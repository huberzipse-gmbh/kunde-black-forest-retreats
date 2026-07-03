import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { mapBooking } from "@/lib/booking/db";
import { dateDe, dateTimeDe, eur, PAYMENT_LABEL, STATUS_LABEL } from "@/lib/admin/format";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { CancelBookingButton } from "@/components/admin/CancelBookingButton";
import type { QuoteLine } from "@/lib/booking/types";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const { id } = await params;

  const sb = createAdminClient();
  const { data: row } = await sb
    .from("bookings")
    .select("*, retreats(name_de, slug)")
    .eq("id", id)
    .maybeSingle();
  if (!row) notFound();
  const booking = mapBooking(row);
  const retreat = (row as { retreats?: { name_de?: string; slug?: string } }).retreats;

  const { data: invoices } = await sb
    .from("invoices")
    .select("id, invoice_number, kind, gross_cents, issued_at")
    .eq("booking_id", id)
    .order("issued_at");

  const cancellable = booking.status !== "cancelled";
  const q = booking.quote;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/buchungen" className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60 hover:text-forest-900">
        ← Buchungen
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-forest-900">
          {booking.bookingNumber}
          {booking.demo && (
            <span className="ms-3 rounded-full bg-cream-100 px-3 py-1 align-middle font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
              Demo
            </span>
          )}
        </h1>
        {cancellable && <CancelBookingButton bookingId={booking.id} />}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Reise */}
        <div className="rounded-[8px] border border-forest-900/10 bg-white p-5">
          <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Reise</h2>
          <dl className="mt-3 space-y-2 font-body text-sm">
            <Row k="Wohnung" v={retreat?.name_de ?? booking.retreatId} />
            <Row k="Zeitraum" v={`${dateDe(booking.checkIn)} → ${dateDe(booking.checkOut)} (${q.nights} Nächte)`} />
            <Row k="Gäste" v={`${booking.adults} Erwachsene, ${booking.children} Kinder, ${booking.infants} Kleinkinder`} />
            <Row k="Storno-Frist" v={`${booking.cancellationDays} Tage vor Anreise`} />
            <Row k="Gebucht am" v={dateTimeDe(booking.createdAt)} />
          </dl>
        </div>

        {/* Gast + Zahlung */}
        <div className="rounded-[8px] border border-forest-900/10 bg-white p-5">
          <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Gast & Zahlung</h2>
          <dl className="mt-3 space-y-2 font-body text-sm">
            <Row k="Name" v={booking.guestName} />
            <Row k="E-Mail" v={booking.guestEmail} />
            <Row k="Konto" v={booking.userId ? "Registriert" : "Gast"} />
            <Row k="Status" v={STATUS_LABEL[booking.status] ?? booking.status} />
            <Row k="Zahlung" v={PAYMENT_LABEL[booking.paymentStatus] ?? booking.paymentStatus} />
            <Row k="Zahlungsart" v={booking.paymentTiming === "later" ? `Später (fällig ${booking.chargeDueDate ? dateDe(booking.chargeDueDate) : "—"})` : "Sofort"} />
          </dl>
        </div>
      </div>

      {/* Preisaufschlüsselung */}
      <div className="mt-5 rounded-[8px] border border-forest-900/10 bg-white p-5">
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Preisaufschlüsselung
        </h2>
        <div className="mt-3 space-y-2">
          {(q.lines as QuoteLine[]).map((line, i) => (
            <div key={i} className="flex justify-between font-body text-sm">
              <span className={line.amountCents < 0 ? "text-forest-500" : "text-forest-900/85"}>
                {line.kind === "nights"
                  ? `${q.nights} Nächte`
                  : line.kind === "cleaning"
                    ? "Reinigung"
                    : line.kind === "registered"
                      ? "Registrierten-Rabatt"
                      : line.label}
              </span>
              <span className={line.amountCents < 0 ? "text-forest-500" : "text-forest-900"}>{eur(line.amountCents)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-forest-900/15 pt-2 font-body text-sm font-bold text-forest-900">
            <span>Gesamt (inkl. {String(q.vatRate).replace(".", ",")} % USt. = {eur(q.vatCents)})</span>
            <span>{eur(booking.totalCents)}</span>
          </div>
        </div>
      </div>

      {/* Rechnungen */}
      <div className="mt-5 rounded-[8px] border border-forest-900/10 bg-white p-5">
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Rechnungen</h2>
        {(invoices ?? []).length === 0 ? (
          <p className="mt-3 font-body text-sm text-forest-700/60">Noch keine Rechnung (entsteht mit der Zahlung).</p>
        ) : (
          <div className="mt-3 space-y-2">
            {(invoices ?? []).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between font-body text-sm">
                <span>
                  <Link href={`/admin/rechnungen/${inv.id}`} className="font-semibold text-forest-900 underline-offset-2 hover:underline">
                    {inv.invoice_number}
                  </Link>
                  <span className="ms-2 text-forest-700/60">
                    {inv.kind === "storno" ? "Stornorechnung" : "Rechnung"} · {dateDe(inv.issued_at)}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-semibold text-forest-900">{eur(inv.gross_cents)}</span>
                  <a href={`/api/invoices/${inv.id}/pdf`} className="text-xs font-semibold text-brass-600 underline-offset-2 hover:underline">
                    PDF
                  </a>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-forest-700/60">{k}</dt>
      <dd className="text-end font-medium text-forest-900">{v}</dd>
    </div>
  );
}
