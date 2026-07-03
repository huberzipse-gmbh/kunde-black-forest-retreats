import 'server-only';

/**
 * Bestätigungs-Pipeline — die EINE Stelle, an der Buchungen bezahlt/verbindlich
 * werden. Genutzt vom Stripe-Webhook, der Demo-Zahlung und dem Abbuchungs-Cron,
 * damit alle Pfade identisch laufen: Statusübergang → Rechnung → E-Mails.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { mapBooking } from './db';
import { assertTransition, canTransition } from './stateMachine';
import type { Booking } from './types';
import { createInvoiceForBooking } from '@/lib/invoices/create';
import { getInvoicePdf } from '@/lib/invoices/create';
import { sendEmail } from '@/lib/email/send';
import { confirmationEmail, invoiceEmail, paymentFailedEmail } from '@/lib/email/templates';

export async function loadBooking(bookingId: string): Promise<Booking> {
  const sb = createAdminClient();
  const { data, error } = await sb.from('bookings').select('*').eq('id', bookingId).single();
  if (error) throw error;
  return mapBooking(data);
}

export async function retreatNameOf(retreatId: string): Promise<string> {
  const sb = createAdminClient();
  const { data } = await sb.from('retreats').select('name_de').eq('id', retreatId).single();
  return data?.name_de ?? retreatId;
}

/**
 * Zahlung erfolgreich (Sofortzahlung ODER fällige Abbuchung):
 * → confirmed/paid, Rechnung erstellen, Bestätigung + Rechnung mailen.
 * Idempotent: bereits bezahlte Buchungen werden still übersprungen.
 */
export async function markBookingPaid(
  bookingId: string,
  opts: { paymentIntentId?: string; demo?: boolean } = {},
): Promise<Booking> {
  const sb = createAdminClient();
  const booking = await loadBooking(bookingId);

  if (booking.status === 'confirmed' && booking.paymentStatus === 'paid') {
    return booking; // Webhook-Retry o. Ä. — nichts zu tun.
  }
  const to = { status: 'confirmed' as const, paymentStatus: 'paid' as const };
  assertTransition({ status: booking.status, paymentStatus: booking.paymentStatus }, to);

  const wasScheduled = booking.paymentStatus !== 'awaiting_payment';
  const { error } = await sb
    .from('bookings')
    .update({
      status: 'confirmed',
      payment_status: 'paid',
      confirmed_at: booking.confirmedAt ?? new Date().toISOString(),
      stripe_payment_intent_id: opts.paymentIntentId ?? booking.stripePaymentIntentId,
      demo: opts.demo ?? booking.demo,
    })
    .eq('id', bookingId);
  if (error) throw error;

  const updated = await loadBooking(bookingId);
  const retreatName = await retreatNameOf(updated.retreatId);

  // Rechnung (idempotent) + PDF
  const invoice = await createInvoiceForBooking(updated, retreatName);
  const pdf = await getInvoicePdf(invoice);

  // Bestätigung nur, wenn sie nicht schon bei „Später zahlen" rausging.
  if (!wasScheduled) {
    const confirm = confirmationEmail({ booking: updated, retreatName });
    await sendEmail({
      to: updated.guestEmail,
      subject: confirm.subject,
      html: confirm.html,
      bookingId: updated.id,
    });
  }
  const inv = invoiceEmail({ booking: updated, retreatName });
  await sendEmail({
    to: updated.guestEmail,
    subject: inv.subject,
    html: inv.html,
    bookingId: updated.id,
    attachments: [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdf }],
  });

  return updated;
}

/**
 * „Später zahlen": Karte erfolgreich hinterlegt → Buchung sofort verbindlich
 * (confirmed/scheduled), Bestätigungs-Mail raus. Rechnung folgt nach Abbuchung.
 */
export async function markBookingScheduled(
  bookingId: string,
  opts: {
    setupIntentId?: string;
    customerId?: string;
    paymentMethodId?: string;
    demo?: boolean;
  } = {},
): Promise<Booking> {
  const sb = createAdminClient();
  const booking = await loadBooking(bookingId);

  if (booking.status === 'confirmed' && booking.paymentStatus === 'scheduled') {
    return booking;
  }
  const to = { status: 'confirmed' as const, paymentStatus: 'scheduled' as const };
  assertTransition({ status: booking.status, paymentStatus: booking.paymentStatus }, to);

  const { error } = await sb
    .from('bookings')
    .update({
      status: 'confirmed',
      payment_status: 'scheduled',
      confirmed_at: new Date().toISOString(),
      stripe_setup_intent_id: opts.setupIntentId ?? booking.stripeSetupIntentId,
      stripe_customer_id: opts.customerId ?? booking.stripeCustomerId,
      stripe_payment_method_id: opts.paymentMethodId ?? booking.stripePaymentMethodId,
      demo: opts.demo ?? booking.demo,
    })
    .eq('id', bookingId);
  if (error) throw error;

  const updated = await loadBooking(bookingId);
  const retreatName = await retreatNameOf(updated.retreatId);
  const confirm = confirmationEmail({ booking: updated, retreatName });
  await sendEmail({
    to: updated.guestEmail,
    subject: confirm.subject,
    html: confirm.html,
    bookingId: updated.id,
  });
  return updated;
}

/** Fehlgeschlagene Zahlung/Abbuchung protokollieren + Gast informieren. */
export async function markPaymentFailed(bookingId: string): Promise<void> {
  const sb = createAdminClient();
  const booking = await loadBooking(bookingId);
  const from = { status: booking.status, paymentStatus: booking.paymentStatus };
  const to = { status: booking.status, paymentStatus: 'failed' as const };
  if (!canTransition(from, to)) return; // z. B. schon paid — ignorieren.

  await sb.from('bookings').update({ payment_status: 'failed' }).eq('id', bookingId);

  // Beim „Später zahlen"-Fehlschlag den Gast aktiv informieren.
  if (booking.status === 'confirmed') {
    const retreatName = await retreatNameOf(booking.retreatId);
    const failed = paymentFailedEmail({ booking, retreatName });
    await sendEmail({
      to: booking.guestEmail,
      subject: failed.subject,
      html: failed.html,
      bookingId: booking.id,
    });
  }
}
