import 'server-only';

/**
 * E-Mail-Templates als schlichte HTML-Strings in Markenoptik.
 * Lokalisiert über die Buchungs-Locale (STRINGS-Registry).
 */
import { STRINGS } from '@/lib/i18n/strings';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { fmtDate, fmtEur, fmtNum } from '@/lib/i18n/format';
import type { Booking } from '@/lib/booking/types';

const COLORS = {
  night: '#0f1813',
  forest: '#1b2a21',
  cream: '#faf7f1',
  creamSoft: '#f3ede2',
  brass: '#c9a96a',
  text: '#2a3e31',
};

function localeOf(booking: Booking): Locale {
  return isLocale(booking.locale) ? booking.locale : 'de';
}

/** Grundgerüst: dunkler Header mit Wortmarke, heller Inhalt, Footer. */
function shell(locale: Locale, inner: string): string {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return `<!doctype html>
<html dir="${dir}">
<body style="margin:0;padding:0;background:${COLORS.creamSoft};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.creamSoft};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.cream};border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:${COLORS.night};padding:28px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:22px;letter-spacing:1px;">Black Forest Retreats</div>
            <div style="color:${COLORS.brass};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">Neuenbürg</div>
          </td>
        </tr>
        <tr><td style="padding:36px 32px;color:${COLORS.text};font-size:15px;line-height:1.6;">${inner}</td></tr>
        <tr>
          <td style="background:${COLORS.forest};padding:20px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:12px;opacity:.8;">Black Forest Retreats · Neuenbürg</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(27,42,33,.12);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.forest};opacity:.7;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(27,42,33,.12);text-align:end;font-weight:bold;color:${COLORS.forest};">${value}</td>
  </tr>`;
}

export interface BookingEmailContext {
  booking: Booking;
  retreatName: string;
}

/** Buchungsbestätigung (nach erfolgreicher Zahlung bzw. Karten-Hinterlegung). */
export function confirmationEmail({ booking, retreatName }: BookingEmailContext): {
  subject: string;
  html: string;
} {
  const locale = localeOf(booking);
  const t = STRINGS[locale].bookingFlow;
  const guests = booking.adults + booking.children;
  const dates = `${fmtDate(booking.checkIn, locale)} → ${fmtDate(booking.checkOut, locale)}`;

  const scheduled =
    booking.paymentTiming === 'later' && booking.chargeDueDate && booking.paymentStatus !== 'paid'
      ? `<p style="margin:18px 0 0;padding:12px 16px;background:rgba(201,169,106,.15);border-radius:4px;">${t.email.scheduledLine(fmtDate(booking.chargeDueDate, locale))}</p>`
      : '';

  const inner = `
    <p style="margin:0;">${t.email.greeting(booking.guestName)}</p>
    <p style="margin:12px 0 24px;">${t.email.confirmIntro}</p>
    <h2 style="margin:0 0 6px;color:${COLORS.forest};font-size:20px;">${retreatName}</h2>
    <div style="color:${COLORS.brass};font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">${t.confirmation.numberLabel}: ${booking.bookingNumber}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${detailRow(t.email.datesLabel, fmtNum(dates, locale))}
      ${detailRow(t.email.guestsLabel, t.guests.summary(guests))}
      ${detailRow(t.email.totalLabel, fmtNum(fmtEur(booking.totalCents, locale), locale))}
    </table>
    ${scheduled}
    <p style="margin:28px 0 0;">${t.email.signoff}<br/><strong>${t.email.teamName}</strong></p>`;

  return {
    subject: t.email.confirmSubject(booking.bookingNumber),
    html: shell(locale, inner),
  };
}

/** Rechnungs-Mail (PDF im Anhang). */
export function invoiceEmail({ booking, retreatName }: BookingEmailContext): {
  subject: string;
  html: string;
} {
  const locale = localeOf(booking);
  const t = STRINGS[locale].bookingFlow;
  const inner = `
    <p style="margin:0;">${t.email.greeting(booking.guestName)}</p>
    <p style="margin:12px 0 24px;">${t.email.invoiceIntro}</p>
    <h2 style="margin:0 0 6px;color:${COLORS.forest};font-size:20px;">${retreatName}</h2>
    <div style="color:${COLORS.brass};font-size:12px;letter-spacing:2px;text-transform:uppercase;">${t.confirmation.numberLabel}: ${booking.bookingNumber}</div>
    <p style="margin:28px 0 0;">${t.email.signoff}<br/><strong>${t.email.teamName}</strong></p>`;
  return {
    subject: t.email.invoiceSubject(booking.bookingNumber),
    html: shell(locale, inner),
  };
}

/** Hinweis bei fehlgeschlagener Abbuchung („Später zahlen"). */
export function paymentFailedEmail({ booking, retreatName }: BookingEmailContext): {
  subject: string;
  html: string;
} {
  const locale = localeOf(booking);
  const t = STRINGS[locale].bookingFlow;
  const inner = `
    <p style="margin:0;">${t.email.greeting(booking.guestName)}</p>
    <p style="margin:12px 0 24px;">${t.email.failedIntro}</p>
    <h2 style="margin:0 0 6px;color:${COLORS.forest};font-size:20px;">${retreatName}</h2>
    <div style="color:${COLORS.brass};font-size:12px;letter-spacing:2px;text-transform:uppercase;">${t.confirmation.numberLabel}: ${booking.bookingNumber}</div>
    <p style="margin:28px 0 0;">${t.email.signoff}<br/><strong>${t.email.teamName}</strong></p>`;
  return {
    subject: t.email.failedSubject(booking.bookingNumber),
    html: shell(locale, inner),
  };
}
