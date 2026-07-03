/**
 * Zahlungs-Abstraktion: eine Schnittstelle, zwei Implementierungen.
 *  - stripe.ts: echte Zahlungen (PaymentIntent / SetupIntent + off_session).
 *  - demo.ts:  ohne STRIPE_SECRET_KEY wird die Zahlung simuliert, damit der
 *    komplette Buchungsfluss End-to-End testbar ist.
 */
import type { Booking } from '@/lib/booking/types';

export interface PaymentProvider {
  mode: 'stripe' | 'demo';
  /** Sofortzahlung: PaymentIntent anlegen → clientSecret fürs Payment Element. */
  createPayNowIntent(booking: Booking): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    customerId: string | null;
  }>;
  /** Später zahlen: Karte via SetupIntent hinterlegen (off_session). */
  createPayLaterSetup(booking: Booking): Promise<{
    clientSecret: string;
    setupIntentId: string;
    customerId: string;
  }>;
  /** Fällige Abbuchung mit hinterlegter Karte (Cron / Admin-Button). */
  chargeSavedMethod(booking: Booking): Promise<{
    ok: boolean;
    paymentIntentId?: string;
    error?: string;
  }>;
  /** Erstattung nach Storno einer bezahlten Buchung. */
  refund(booking: Booking): Promise<{ ok: boolean; error?: string }>;
}
