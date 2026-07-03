/**
 * Verfügbarkeitslogik (pure). end_date ist immer der Checkout-Tag (exklusiv):
 * Abreise- und Anreisetag dürfen sich überlappen — wie bei Airbnb.
 */
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import type { AvailabilityBlock } from './types';

const iso = (d: Date) => format(d, 'yyyy-MM-dd');

/** Standard-Overlap-Check zweier halboffener Intervalle [start, end). */
export function rangesOverlap(
  aStart: string, aEnd: string,
  bStart: string, bEnd: string,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/** Ist der Zeitraum [checkIn, checkOut) frei von allen Blöcken? */
export function isRangeFree(
  blocks: Pick<AvailabilityBlock, 'start' | 'end'>[],
  checkIn: string,
  checkOut: string,
): boolean {
  return !blocks.some((b) => rangesOverlap(checkIn, checkOut, b.start, b.end));
}

/**
 * Alle belegten NÄCHTE als ISO-Datums-Set (für die Kalender-Anzeige).
 * Ein Datum ist belegt, wenn die Nacht von diesem Tag auf den nächsten
 * gebucht ist — der Checkout-Tag selbst bleibt anwählbar.
 */
export function blockedNights(
  blocks: Pick<AvailabilityBlock, 'start' | 'end'>[],
): Set<string> {
  const set = new Set<string>();
  for (const b of blocks) {
    const nights = differenceInCalendarDays(new Date(b.end), new Date(b.start));
    for (let i = 0; i < nights; i++) {
      set.add(iso(addDays(new Date(b.start), i)));
    }
  }
  return set;
}

/**
 * Frühestes Checkout-Datum ab einem gewählten Check-in: bis zur nächsten
 * belegten Nacht (der Gast kann nicht „über" eine Belegung hinweg buchen).
 * Gibt null zurück, wenn direkt die erste Nacht belegt ist.
 */
export function maxCheckout(
  blockedSet: Set<string>,
  checkIn: string,
  horizonDays = 365,
): string | null {
  if (blockedSet.has(checkIn)) return null;
  let d = new Date(checkIn);
  for (let i = 0; i < horizonDays; i++) {
    d = addDays(d, 1);
    if (blockedSet.has(iso(addDays(d, -1)))) return iso(addDays(d, -1));
  }
  return iso(d);
}
