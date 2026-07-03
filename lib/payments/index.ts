import 'server-only';

/**
 * Anbieter-Auswahl: echtes Stripe, sobald STRIPE_SECRET_KEY gesetzt ist,
 * sonst Demo-Modus (voll testbarer Buchungsfluss ohne echte Zahlung).
 */
import type { PaymentProvider } from './types';
import { demoProvider } from './demo';

export function getPaymentProvider(): PaymentProvider {
  if (process.env.STRIPE_SECRET_KEY) {
    // Lazy require, damit der Demo-Modus ohne Stripe-Konfiguration auskommt.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { stripeProvider } = require('./stripe') as typeof import('./stripe');
    return stripeProvider;
  }
  return demoProvider;
}

export function paymentMode(): 'stripe' | 'demo' {
  return process.env.STRIPE_SECRET_KEY ? 'stripe' : 'demo';
}
