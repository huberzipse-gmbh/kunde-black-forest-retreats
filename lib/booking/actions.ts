'use server';

/**
 * Server Actions des Gäste-Buchungsflows. Der Server ist die einzige
 * Wahrheit: Verfügbarkeit und Preis werden hier IMMER neu berechnet —
 * Client-Werte sind reine Anzeige.
 */
import { z } from 'zod';
import { cookies } from 'next/headers';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { getLocale } from '@/lib/i18n/server';
import { computeQuote, PROMO_COOKIE } from './pricing';
import { isRangeFree } from './availability';
import { fetchBlocks, fetchPriceRules, fetchSettings, mapBooking } from './db';
import { generateBookingNumber } from './bookingNumber';
import { assertTransition } from './stateMachine';
import { getPaymentProvider, paymentMode } from '@/lib/payments';
import { markBookingPaid, markBookingScheduled, loadBooking } from './confirm';
import type { Booking, PaymentTiming } from './types';

const iso = (d: Date) => format(d, 'yyyy-MM-dd');

const createBookingSchema = z.object({
  retreatId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(30),
  children: z.number().int().min(0).max(30),
  infants: z.number().int().min(0).max(10),
  guestName: z.string().trim().min(2).max(120),
  guestEmail: z.string().trim().email().max(200),
  paymentTiming: z.enum(['now', 'later']),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export interface CreateBookingResult {
  ok: boolean;
  error?:
    | 'not-configured'
    | 'invalid'
    | 'unavailable'
    | 'min-nights'
    | 'max-guests'
    | 'generic';
  bookingId?: string;
  bookingNumber?: string;
}

/** Buchung anlegen (pending) + Zeitraum provisorisch blocken. */
export async function createBooking(raw: CreateBookingInput): Promise<CreateBookingResult> {
  if (!supabaseAdminConfigured()) return { ok: false, error: 'not-configured' };

  const parsed = createBookingSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const input = parsed.data;

  try {
    const admin = createAdminClient();

    // Wohnung + Regeln + Settings + Belegung server-seitig laden.
    const { data: retreatRow, error: retreatError } = await admin
      .from('retreats')
      .select('*')
      .eq('id', input.retreatId)
      .single();
    if (retreatError || !retreatRow || !retreatRow.bookable || retreatRow.sold_out) {
      return { ok: false, error: 'invalid' };
    }

    const nights = differenceInCalendarDays(new Date(input.checkOut), new Date(input.checkIn));
    if (nights < retreatRow.min_nights) return { ok: false, error: 'min-nights' };
    if (input.checkIn < iso(new Date())) return { ok: false, error: 'invalid' };
    if (input.adults + input.children > retreatRow.max_guests) {
      return { ok: false, error: 'max-guests' };
    }

    const [settings, rules, blocks] = await Promise.all([
      fetchSettings(admin),
      fetchPriceRules(admin, input.retreatId),
      fetchBlocks(admin, input.retreatId),
    ]);

    if (!isRangeFree(blocks, input.checkIn, input.checkOut)) {
      return { ok: false, error: 'unavailable' };
    }

    // Eingeloggt? → Registrierten-Rabatt.
    const supa = await createClient();
    const { data: userData } = await supa.auth.getUser();
    const user = userData?.user ?? null;

    // Eingelöster Rabattcode (Cookie) — computeQuote validiert gegen Settings.
    const promoCode = (await cookies()).get(PROMO_COOKIE)?.value ?? null;

    const quote = computeQuote({
      retreat: {
        id: retreatRow.id,
        basePriceCents: retreatRow.base_price_cents,
        cleaningFeeCents: retreatRow.cleaning_fee_cents,
      },
      rules,
      settings,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      isRegistered: Boolean(user),
      promoCode,
    });

    // „Später zahlen" nur, wenn die Anreise weit genug entfernt ist.
    const payLaterPossible =
      differenceInCalendarDays(new Date(input.checkIn), new Date()) > settings.payLaterWindowDays;
    const timing: PaymentTiming = payLaterPossible ? input.paymentTiming : 'now';
    const chargeDueDate =
      timing === 'later'
        ? iso(addDays(new Date(input.checkIn), -settings.payLaterWindowDays))
        : null;

    const cancellationDays =
      retreatRow.cancellation_days_override ?? settings.cancellationDays;
    const locale = await getLocale();

    const { data: bookingRow, error: bookingError } = await admin
      .from('bookings')
      .insert({
        booking_number: generateBookingNumber(),
        retreat_id: input.retreatId,
        user_id: user?.id ?? null,
        guest_email: input.guestEmail,
        guest_name: input.guestName,
        check_in: input.checkIn,
        check_out: input.checkOut,
        adults: input.adults,
        children: input.children,
        infants: input.infants,
        status: 'pending',
        payment_status: 'unpaid',
        payment_timing: timing,
        charge_due_date: chargeDueDate,
        quote,
        total_cents: quote.totalCents,
        locale,
        cancellation_days: cancellationDays,
        demo: paymentMode() === 'demo',
      })
      .select('*')
      .single();
    if (bookingError) throw bookingError;

    // Provisorischer Block (verfällt nach 30 min, siehe fetchBlocks).
    await admin.from('availability_blocks').insert({
      retreat_id: input.retreatId,
      start_date: input.checkIn,
      end_date: input.checkOut,
      source: 'booking',
      booking_id: bookingRow.id,
    });

    return { ok: true, bookingId: bookingRow.id, bookingNumber: bookingRow.booking_number };
  } catch (err) {
    console.error('[booking] createBooking fehlgeschlagen:', err);
    return { ok: false, error: 'generic' };
  }
}

export interface InitiatePaymentResult {
  ok: boolean;
  error?: string;
  mode?: 'stripe' | 'demo';
  clientSecret?: string;
  /** 'payment' (Sofort) oder 'setup' (Später zahlen). */
  intentType?: 'payment' | 'setup';
}

/** Zahlung anstoßen: PaymentIntent (Jetzt) bzw. SetupIntent (Später). */
export async function initiatePayment(bookingId: string): Promise<InitiatePaymentResult> {
  if (!supabaseAdminConfigured()) return { ok: false, error: 'not-configured' };
  try {
    const admin = createAdminClient();
    const booking = await loadBooking(bookingId);

    assertTransition(
      { status: booking.status, paymentStatus: booking.paymentStatus },
      { status: 'pending', paymentStatus: 'awaiting_payment' },
    );

    const provider = getPaymentProvider();
    let clientSecret: string;
    let intentType: 'payment' | 'setup';
    const update: Record<string, unknown> = { payment_status: 'awaiting_payment' };

    if (booking.paymentTiming === 'later') {
      const setup = await provider.createPayLaterSetup(booking);
      clientSecret = setup.clientSecret;
      intentType = 'setup';
      update.stripe_setup_intent_id = setup.setupIntentId;
      update.stripe_customer_id = setup.customerId;
    } else {
      const intent = await provider.createPayNowIntent(booking);
      clientSecret = intent.clientSecret;
      intentType = 'payment';
      update.stripe_payment_intent_id = intent.paymentIntentId;
      update.stripe_customer_id = intent.customerId;
    }

    await admin.from('bookings').update(update).eq('id', bookingId);
    return { ok: true, mode: provider.mode, clientSecret, intentType };
  } catch (err) {
    console.error('[booking] initiatePayment fehlgeschlagen:', err);
    return { ok: false, error: 'generic' };
  }
}

/**
 * Demo-Zahlung bestätigen — durchläuft exakt dieselbe Pipeline wie der
 * Stripe-Webhook (Status, Rechnung, E-Mails). Nur im Demo-Modus erlaubt.
 */
export async function confirmDemoPayment(bookingId: string): Promise<{ ok: boolean; error?: string }> {
  if (paymentMode() !== 'demo') return { ok: false, error: 'not-demo' };
  try {
    const booking = await loadBooking(bookingId);
    if (booking.paymentTiming === 'later') {
      await markBookingScheduled(bookingId, {
        setupIntentId: `demo_seti_${bookingId}`,
        customerId: `demo_cus_${bookingId}`,
        paymentMethodId: `demo_pm_${bookingId}`,
        demo: true,
      });
    } else {
      await markBookingPaid(bookingId, {
        paymentIntentId: `demo_pi_${bookingId}`,
        demo: true,
      });
    }
    return { ok: true };
  } catch (err) {
    console.error('[booking] confirmDemoPayment fehlgeschlagen:', err);
    return { ok: false, error: 'generic' };
  }
}

/** Buchung per Nummer laden (Bestätigungsseite). */
export async function getBookingByNumber(bookingNumber: string): Promise<Booking | null> {
  if (!supabaseAdminConfigured()) return null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('bookings')
      .select('*')
      .eq('booking_number', bookingNumber)
      .maybeSingle();
    return data ? mapBooking(data) : null;
  } catch {
    return null;
  }
}
