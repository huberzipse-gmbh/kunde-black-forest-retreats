import 'server-only';

/**
 * Demo-Zahlungsanbieter: aktiv, solange kein STRIPE_SECRET_KEY gesetzt ist.
 * Liefert Fake-Secrets; die Checkout-Seite zeigt statt des Payment Elements
 * eine Demo-Zahlfläche, deren Bestätigung dieselbe Pipeline durchläuft wie
 * der echte Stripe-Webhook. Abbuchungen („Später zahlen") gelingen immer,
 * damit auch der Cron-Pfad testbar ist.
 */
import type { Booking } from '@/lib/booking/types';
import type { PaymentProvider } from './types';

export const demoProvider: PaymentProvider = {
  mode: 'demo',

  async createPayNowIntent(booking: Booking) {
    return {
      clientSecret: `demo_pi_${booking.id}`,
      paymentIntentId: `demo_pi_${booking.id}`,
      customerId: null,
    };
  },

  async createPayLaterSetup(booking: Booking) {
    return {
      clientSecret: `demo_seti_${booking.id}`,
      setupIntentId: `demo_seti_${booking.id}`,
      customerId: `demo_cus_${booking.id}`,
    };
  },

  async chargeSavedMethod(booking: Booking) {
    return { ok: true, paymentIntentId: `demo_pi_charge_${booking.id}` };
  },

  async refund() {
    return { ok: true };
  },
};
