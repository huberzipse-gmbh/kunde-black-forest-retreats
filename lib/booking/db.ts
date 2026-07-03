/**
 * Row-Mapper + Lese-Helfer der Buchungs-Domäne (DB snake_case ↔ Domäne camelCase).
 * Schreibzugriffe laufen ausschließlich über Server Actions (Service-Role).
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AvailabilityBlock,
  Booking,
  BookingSettings,
  PriceQuote,
  PriceRule,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapPriceRule(r: any): PriceRule {
  return {
    id: r.id,
    retreatId: r.retreat_id,
    name: r.name,
    startDate: r.start_date,
    endDate: r.end_date,
    nightlyPriceCents: r.nightly_price_cents,
    discountAmountCents: r.discount_amount_cents,
    discountPercent: r.discount_percent != null ? Number(r.discount_percent) : null,
    active: r.active,
    createdAt: r.created_at,
  };
}

export function mapBlock(b: any): AvailabilityBlock {
  return {
    id: b.id,
    retreatId: b.retreat_id,
    start: b.start_date,
    end: b.end_date,
    source: b.source,
    bookingId: b.booking_id,
    note: b.note ?? '',
  };
}

export function mapSettings(s: any): BookingSettings {
  return {
    cancellationDays: s.cancellation_days,
    vatRate: Number(s.vat_rate),
    registeredDiscountPercent: Number(s.registered_discount_percent),
    payLaterWindowDays: s.pay_later_window_days,
    globalDiscount: {
      name: s.global_discount_name ?? '',
      amountCents: s.global_discount_amount_cents,
      percent: s.global_discount_percent != null ? Number(s.global_discount_percent) : null,
      active: s.global_discount_active,
    },
  };
}

export function mapBooking(b: any): Booking {
  return {
    id: b.id,
    bookingNumber: b.booking_number,
    retreatId: b.retreat_id,
    userId: b.user_id,
    guestEmail: b.guest_email,
    guestName: b.guest_name,
    checkIn: b.check_in,
    checkOut: b.check_out,
    adults: b.adults,
    children: b.children,
    infants: b.infants,
    status: b.status,
    paymentStatus: b.payment_status,
    paymentTiming: b.payment_timing,
    chargeDueDate: b.charge_due_date,
    quote: b.quote as PriceQuote,
    totalCents: b.total_cents,
    stripePaymentIntentId: b.stripe_payment_intent_id,
    stripeSetupIntentId: b.stripe_setup_intent_id,
    stripeCustomerId: b.stripe_customer_id,
    stripePaymentMethodId: b.stripe_payment_method_id,
    locale: b.locale,
    cancellationDays: b.cancellation_days,
    demo: b.demo,
    createdAt: b.created_at,
    confirmedAt: b.confirmed_at,
    cancelledAt: b.cancelled_at,
  };
}

/** Globale Einstellungen laden (Single Row id = 1). */
export async function fetchSettings(sb: SupabaseClient): Promise<BookingSettings> {
  const { data, error } = await sb.from('settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return mapSettings(data);
}

/** Aktive Preisregeln einer Wohnung. */
export async function fetchPriceRules(sb: SupabaseClient, retreatId: string): Promise<PriceRule[]> {
  const { data, error } = await sb
    .from('price_rules')
    .select('*')
    .eq('retreat_id', retreatId)
    .eq('active', true);
  if (error) throw error;
  return (data ?? []).map(mapPriceRule);
}

/**
 * Relevante Sperrzeiten einer Wohnung (ab heute). Verfallene pending-Buchungen
 * (unbezahlt, älter als 30 min) blockieren NICHT mehr.
 */
export async function fetchBlocks(sb: SupabaseClient, retreatId: string): Promise<AvailabilityBlock[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await sb
    .from('availability_blocks')
    .select('*, bookings(status, payment_status, created_at)')
    .eq('retreat_id', retreatId)
    .gte('end_date', today);
  if (error) throw error;

  const cutoff = Date.now() - 30 * 60 * 1000;
  return (data ?? [])
    .filter((b: any) => {
      if (b.source !== 'booking' || !b.bookings) return true;
      const bk = b.bookings;
      if (bk.status === 'cancelled') return false;
      // Unbezahlte pending-Buchung: nur 30 min reservieren.
      if (
        bk.status === 'pending' &&
        ['unpaid', 'awaiting_payment', 'failed'].includes(bk.payment_status)
      ) {
        return new Date(bk.created_at).getTime() > cutoff;
      }
      return true;
    })
    .map(mapBlock);
}
