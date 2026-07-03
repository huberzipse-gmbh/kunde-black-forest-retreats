/**
 * iCal-Export (handgerollt, kein Dependency-Ballast): flache All-Day-VEVENTs
 * für bestätigte Buchungen und manuelle Sperren — genau das Format, das
 * Airbnb beim Kalender-Import erwartet.
 */

interface IcalEvent {
  uid: string;
  /** ISO-Datum (inklusive). */
  start: string;
  /** ISO-Datum (exklusiv, Checkout-Tag). */
  end: string;
  summary: string;
}

const icsDate = (iso: string) => iso.replace(/-/g, '');

/** RFC-5545-Zeilen bei 75 Oktetten falten (CRLF + Leerzeichen). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const ch of line) {
    const chBytes = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // Folgezeilen beginnen mit Space
    if (currentBytes + chBytes > limit) {
      out.push(current);
      current = ch;
      currentBytes = chBytes;
    } else {
      current += ch;
      currentBytes += chBytes;
    }
  }
  if (current) out.push(current);
  return out.join('\r\n ');
}

export function generateIcs(calendarName: string, events: IcalEvent[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Black Forest Retreats//Booking//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    fold(`X-WR-CALNAME:${calendarName}`),
  ];
  for (const ev of events) {
    lines.push(
      'BEGIN:VEVENT',
      fold(`UID:${ev.uid}`),
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${icsDate(ev.start)}`,
      `DTEND;VALUE=DATE:${icsDate(ev.end)}`,
      fold(`SUMMARY:${ev.summary.replace(/([,;\\])/g, '\\$1')}`),
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
