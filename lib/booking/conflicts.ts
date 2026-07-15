/**
 * Doppelbelegungen erkennen (pure Logik).
 *
 * Eine Wohnung wird aus drei Quellen belegt: eigene Buchung, Airbnb-iCal-Import
 * und manuelle Sperre. Überlappen sich zwei davon, ist dieselbe Wohnung zweimal
 * vergeben — der klassische Fall: ein Airbnb-Gast bucht in dem Fenster, bevor
 * unser iCal-Sync (alle 30 min) den Zeitraum bei uns sperren konnte.
 *
 * Der DB-Constraint aus Migration 0015 verhindert Kollisionen zwischen unseren
 * EIGENEN Belegungen. Gegen Airbnb hilft kein Constraint — dort ist die Buchung
 * bereits passiert, wenn wir davon erfahren. Deshalb wird sie hier erkannt und
 * im Admin gemeldet, statt den Import abzulehnen (das würde die Belegung
 * verschlucken und die Überbuchung unsichtbar machen).
 */
import { rangesOverlap } from './availability';

export type OccupancyKind = 'booking' | 'airbnb-ical' | 'manual';

/** Ein belegter Zeitraum, quellenunabhängig. [start, end) — end = Checkout-Tag. */
export interface Occupancy {
  retreatId: string;
  start: string;
  end: string;
  kind: OccupancyKind;
  /** Klartext für den Admin: „BFR-1042 · Anna Weber", iCal-Summary oder Notiz. */
  label: string;
  bookingId?: string | null;
  blockId?: string | null;
}

export interface Conflict {
  retreatId: string;
  a: Occupancy;
  b: Occupancy;
  /** Die doppelt vergebenen Nächte: [start, end). */
  start: string;
  end: string;
}

const isOwn = (o: Occupancy) => o.kind !== 'airbnb-ical';

/**
 * Echo unseres eigenen Exports? Airbnb importiert unsere Buchungen über den
 * iCal-Feed und gibt sie im eigenen Feed als gesperrte Tage wieder zurück —
 * mit Airbnb-eigener UID, also nicht über `external_uid` erkennbar. Solche
 * Rückläufer decken sich TAGGENAU mit unserer Belegung; eine echte
 * Airbnb-Buchung tut das nur zufällig.
 *
 * Kompromiss mit offenen Augen: eine echte Airbnb-Buchung über exakt dieselben
 * Nächte wie unsere eigene Belegung wird als Echo eingestuft und nicht
 * gemeldet. Der gefährliche Fall — teilweise Überlappung — bleibt sichtbar.
 * Ohne diese Regel meldete JEDE Direktbuchung eine Kollision und die Warnung
 * wäre wertlos.
 */
function isEcho(candidate: Occupancy, own: Occupancy[]): boolean {
  if (candidate.kind !== 'airbnb-ical') return false;
  return own.some(
    (o) =>
      o.retreatId === candidate.retreatId &&
      o.start === candidate.start &&
      o.end === candidate.end,
  );
}

/**
 * Alle Paare überlappender Belegungen. Erwartet die Belegungen bereits
 * gefiltert (keine stornierten/verfallenen) — siehe `fetchOccupancy`.
 */
export function findConflicts(occupancies: Occupancy[]): Conflict[] {
  const own = occupancies.filter(isOwn);
  const relevant = occupancies.filter((o) => !isEcho(o, own));

  const byRetreat = new Map<string, Occupancy[]>();
  for (const o of relevant) {
    const list = byRetreat.get(o.retreatId);
    if (list) list.push(o);
    else byRetreat.set(o.retreatId, [o]);
  }

  const conflicts: Conflict[] = [];
  for (const [retreatId, list] of byRetreat) {
    const sorted = [...list].sort((x, y) => (x.start < y.start ? -1 : 1));
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i];
        const b = sorted[j];
        // Sortiert nach start: ab hier beginnt alles nach a.end → kein Overlap mehr.
        if (b.start >= a.end) break;
        if (!rangesOverlap(a.start, a.end, b.start, b.end)) continue;
        conflicts.push({
          retreatId,
          a,
          b,
          start: a.start > b.start ? a.start : b.start,
          end: a.end < b.end ? a.end : b.end,
        });
      }
    }
  }
  return conflicts;
}

/**
 * Stabile Identität eines Konflikts — damit derselbe Konflikt nicht bei jedem
 * Sync (alle 30 min) erneut gemeldet wird.
 *
 * Bewusst über Quelle + Zeitraum statt über IDs: der iCal-Sync löscht die
 * Airbnb-Blöcke bei jedem Lauf und legt sie neu an, ihre UUIDs wechseln also
 * ständig. Verschieben sich die Daten, ist es ohnehin ein anderer Konflikt und
 * darf neu gemeldet werden.
 */
export function conflictKey(c: Conflict): string {
  const side = (o: Occupancy) => `${o.kind}:${o.start}:${o.end}`;
  return `${c.retreatId}|${[side(c.a), side(c.b)].sort().join('|')}`;
}

/** Doppelt vergebene Nächte als ISO-Set — für die Kalender-Markierung. */
export function conflictNights(conflicts: Conflict[]): Set<string> {
  const nights = new Set<string>();
  for (const c of conflicts) {
    for (let d = c.start; d < c.end; ) {
      nights.add(d);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      d = next.toISOString().slice(0, 10);
    }
  }
  return nights;
}

export const KIND_LABEL: Record<OccupancyKind, string> = {
  booking: 'Direktbuchung',
  'airbnb-ical': 'Airbnb',
  manual: 'Manuelle Sperre',
};
