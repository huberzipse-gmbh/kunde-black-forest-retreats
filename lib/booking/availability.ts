/**
 * Verfügbarkeitslogik (pure). end_date ist immer der Checkout-Tag (exklusiv):
 * Abreise- und Anreisetag dürfen sich überlappen — wie bei Airbnb.
 */
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import type { AvailabilityBlock } from './types';

const iso = (d: Date) => format(d, 'yyyy-MM-dd');

/**
 * Buchungsvorlauf: Anreise frühestens 2 Tage (48 h) nach heute — gilt für
 * Kalender-UI und Server-Validierung gleichermaßen.
 */
export const MIN_BOOKING_LEAD_DAYS = 2;

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
 * Unverkäufliche Lücken schließen (Airbnb-Parität): eine freie Lücke zwischen
 * Belegungen, die kürzer als der Mindestaufenthalt ist, kann nie gebucht
 * werden. Airbnb zeigt solche Tage als belegt an, exportiert sie aber NICHT
 * im iCal-Feed — deshalb spiegeln wir die Regel hier selbst, damit beide
 * Kalender exakt dieselben Tage sperren.
 */
export function fillUnsellableGaps(
  blockedSet: Set<string>,
  minNights: number,
  from: string,
  horizonDays = 365,
): Set<string> {
  const result = new Set(blockedSet);
  let run: string[] = [];
  let d = new Date(from);
  for (let i = 0; i <= horizonDays; i++) {
    const day = iso(d);
    if (result.has(day)) {
      // Lücke endet an einer Belegung: zu kurz für minNights → mitsperren.
      if (run.length > 0 && run.length < minNights) {
        for (const night of run) result.add(night);
      }
      run = [];
    } else {
      run.push(day);
    }
    d = addDays(d, 1);
  }
  // Offene Lücke am Horizont-Ende bleibt frei — dort begrenzt nichts den Aufenthalt.
  return result;
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
