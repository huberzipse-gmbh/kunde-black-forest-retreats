/**
 * Buchungs-Lebenszyklus: erlaubte Übergänge von status × payment_status.
 * Jeder Mutator (Server Action, Webhook, Cron) ruft assertTransition auf —
 * Webhooks sind dadurch idempotent (unerlaubter Doppel-Übergang wirft).
 */
import type { BookingStatus, PaymentStatus } from './types';

export interface BookingState {
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

const key = (s: BookingState) => `${s.status}/${s.paymentStatus}`;

/** from → erlaubte Ziele. */
const TRANSITIONS: Record<string, string[]> = {
  // Neu angelegt
  'pending/unpaid': ['pending/awaiting_payment', 'cancelled/unpaid'],
  // Zahlung angestoßen (PaymentIntent oder SetupIntent unterwegs)
  'pending/awaiting_payment': [
    'confirmed/paid',       // Jetzt zahlen: PI erfolgreich
    'confirmed/scheduled',  // Später zahlen: SetupIntent erfolgreich (verbindlich)
    'pending/failed',       // Zahlung fehlgeschlagen → Retry möglich
    'cancelled/unpaid',
  ],
  'pending/failed': ['pending/awaiting_payment', 'cancelled/unpaid'],
  // Später zahlen: Karte hinterlegt, Abbuchung folgt
  'confirmed/scheduled': ['confirmed/charge_due', 'cancelled/unpaid'],
  'confirmed/charge_due': ['confirmed/paid', 'confirmed/failed', 'cancelled/unpaid'],
  'confirmed/failed': ['confirmed/charge_due', 'confirmed/paid', 'cancelled/unpaid'],
  // Bezahlt → nur noch Storno mit Erstattung
  'confirmed/paid': ['cancelled/refund_pending', 'cancelled/refunded'],
  'cancelled/refund_pending': ['cancelled/refunded'],
};

export function canTransition(from: BookingState, to: BookingState): boolean {
  return (TRANSITIONS[key(from)] ?? []).includes(key(to));
}

export function assertTransition(from: BookingState, to: BookingState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Ungültiger Buchungs-Übergang: ${key(from)} → ${key(to)}`);
  }
}
