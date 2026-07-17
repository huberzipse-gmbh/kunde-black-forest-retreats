import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { getBookingByNumber } from "@/lib/booking/actions";
import { retreatNameOf } from "@/lib/booking/confirm";
import { fmtDate, fmtEur, fmtNum } from "@/lib/i18n/format";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";

/** Bestätigungsseite — auch als Ziel der Stripe-return_url und aus E-Mails. */
export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ bookingNumber: string }>;
}) {
  const { bookingNumber } = await params;
  const t = (await getStrings()).bookingFlow;
  const locale = await getLocale();

  if (!supabaseAdminConfigured()) return <NotConfiguredNotice />;

  const booking = await getBookingByNumber(bookingNumber);
  if (!booking) notFound();

  const retreatName = await retreatNameOf(booking.retreatId);
  const guests = booking.adults + booking.children;
  const scheduled =
    booking.paymentTiming === "later" &&
    booking.chargeDueDate &&
    booking.paymentStatus !== "paid";

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* Haken-Emblem */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-900">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-brass-300" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-7 font-display text-4xl text-forest-900">{t.confirmation.title}</h1>
      <p className="mt-3 font-body text-base text-forest-700/80">{t.confirmation.subtitle}</p>

      <div className="mt-9 rounded-[8px] border border-forest-900/10 bg-white p-7 text-start">
        <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-brass-600">
          {t.confirmation.numberLabel}
        </div>
        <div className="mt-1 font-display text-2xl text-forest-900">{booking.bookingNumber}</div>

        <div className="mt-6 space-y-3 border-t border-forest-900/10 pt-6">
          <Row label={t.review.dates}>
            {fmtNum(`${fmtDate(booking.checkIn, locale)} → ${fmtDate(booking.checkOut, locale)}`, locale)}
          </Row>
          <Row label={t.review.guests}>{fmtNum(t.guests.summary(guests), locale)}</Row>
          <Row label={t.price.total}>{fmtNum(fmtEur(booking.totalCents, locale), locale)}</Row>
          <Row label="">{retreatName}</Row>
        </div>

        <p className="mt-6 rounded-[6px] bg-cream-100 px-4 py-3 font-body text-sm text-forest-900/85">
          {t.confirmation.emailSent(booking.guestEmail)}
          {scheduled ? ` ${fmtNum(t.confirmation.scheduledNote(fmtDate(booking.chargeDueDate!, locale)), locale)}` : ""}
        </p>
      </div>

      {/* Buchung anpassen: Mail an die im Impressum genannte Adresse, mit
          Buchungsnummer im Betreff. Änderungen laufen persönlich per Mail. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href={`mailto:rentals@axiecentro.de?subject=${encodeURIComponent(
            t.confirmation.adjustSubject(booking.bookingNumber),
          )}`}
          className="inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300"
        >
          {t.confirmation.adjustBooking}
        </a>
        <Link
          href="/konto"
          className="inline-flex items-center justify-center rounded-[3px] border border-forest-900/25 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-forest-900 transition-colors hover:border-forest-900"
        >
          {t.confirmation.viewAccount}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[3px] border border-forest-900/25 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-forest-900 transition-colors hover:border-forest-900"
        >
          {t.confirmation.backHome}
        </Link>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      {label ? (
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">{label}</span>
      ) : (
        <span />
      )}
      <span className="font-body text-sm font-semibold text-forest-900">{children}</span>
    </div>
  );
}
