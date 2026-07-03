/**
 * iCal-Import (handgerollt): liest die flachen All-Day-Feeds von Airbnb
 * („Reserved" / „Airbnb (Not available)"). Mehr braucht es nicht — keine
 * RRULEs, keine Zeitzonen-Gymnastik.
 */

export interface ParsedIcalEvent {
  uid: string;
  /** ISO-Datum (inklusive). */
  start: string;
  /** ISO-Datum (exklusiv). */
  end: string;
  summary: string;
}

/** Gefaltete Zeilen (CRLF + Whitespace) wieder zusammenfügen. */
function unfold(ics: string): string[] {
  return ics
    .replace(/\r\n[ \t]/g, '')
    .replace(/\n[ \t]/g, '')
    .split(/\r?\n/);
}

/** "20260712" oder "20260712T140000Z" → "2026-07-12". */
function toIsoDate(value: string): string | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export function parseIcs(ics: string): ParsedIcalEvent[] {
  const events: ParsedIcalEvent[] = [];
  let current: Partial<ParsedIcalEvent> | null = null;

  for (const rawLine of unfold(ics)) {
    const line = rawLine.trim();
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current?.start && current?.end) {
        events.push({
          uid: current.uid ?? `${current.start}-${current.end}`,
          start: current.start,
          end: current.end,
          summary: current.summary ?? '',
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).split(';')[0].toUpperCase();
    const value = line.slice(idx + 1);

    if (key === 'UID') current.uid = value;
    else if (key === 'SUMMARY') current.summary = value;
    else if (key === 'DTSTART') current.start = toIsoDate(value) ?? undefined;
    else if (key === 'DTEND') current.end = toIsoDate(value) ?? undefined;
  }
  return events;
}
