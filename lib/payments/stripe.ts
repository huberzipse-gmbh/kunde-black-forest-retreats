import 'server-only';

/**
 * Stripe-Zahlungsanbieter (aktiv, sobald STRIPE_SECRET_KEY gesetzt ist).
 *  - Sofortzahlung: PaymentIntent mit automatic_payment_methods → Karte,
 *    Klarna, PayPal, Apple Pay etc. kommen ohne Extra-Code aus dem
 *    Stripe-Dashboard.
 *  - Später zahlen: Customer + SetupIntent (usage off_session); die fällige
 *    Abbuchung läuft als off_session-PaymentIntent mit der gespeicherten
 *    Zahlungsmethode.
 */
import Stripe from 'stripe';
import type { Booking } from '@/lib/booking/types';
import type { PaymentProvider } from './types';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

async function ensureCustomer(stripe: Stripe, booking: Booking): Promise<string> {
  if (booking.stripeCustomerId) return booking.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: booking.guestEmail,
    name: booking.guestName,
    metadata: { booking_id: booking.id },
  });
  return customer.id;
}

export const stripeProvider: PaymentProvider = {
  mode: 'stripe',

  async createPayNowIntent(booking: Booking) {
    const stripe = getStripe();
    const customerId = await ensureCustomer(stripe, booking);
    const pi = await stripe.paymentIntents.create({
      amount: booking.totalCents,
      currency: 'eur',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      description: `Buchung ${booking.bookingNumber}`,
      metadata: { booking_id: booking.id, booking_number: booking.bookingNumber },
    });
    return {
      clientSecret: pi.client_secret!,
      paymentIntentId: pi.id,
      customerId,
    };
  },

  async createPayLaterSetup(booking: Booking) {
    const stripe = getStripe();
    const customerId = await ensureCustomer(stripe, booking);
    const si = await stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
      automatic_payment_methods: { enabled: true },
      metadata: { booking_id: booking.id, booking_number: booking.bookingNumber },
    });
    return {
      clientSecret: si.client_secret!,
      setupIntentId: si.id,
      customerId,
    };
  },

  async chargeSavedMethod(booking: Booking) {
    const stripe = getStripe();
    if (!booking.stripeCustomerId || !booking.stripePaymentMethodId) {
      return { ok: false, error: 'Keine gespeicherte Zahlungsmethode vorhanden.' };
    }
    try {
      const pi = await stripe.paymentIntents.create({
        amount: booking.totalCents,
        currency: 'eur',
        customer: booking.stripeCustomerId,
        payment_method: booking.stripePaymentMethodId,
        off_session: true,
        confirm: true,
        description: `Buchung ${booking.bookingNumber} (Abbuchung vor Anreise)`,
        metadata: { booking_id: booking.id, booking_number: booking.bookingNumber },
      });
      if (pi.status === 'succeeded') {
        return { ok: true, paymentIntentId: pi.id };
      }
      return { ok: false, paymentIntentId: pi.id, error: `Status: ${pi.status}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      return { ok: false, error: message };
    }
  },

  async refund(booking: Booking) {
    const stripe = getStripe();
    if (!booking.stripePaymentIntentId) {
      return { ok: false, error: 'Kein PaymentIntent zum Erstatten vorhanden.' };
    }
    try {
      await stripe.refunds.create({ payment_intent: booking.stripePaymentIntentId });
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      return { ok: false, error: message };
    }
  },
};
