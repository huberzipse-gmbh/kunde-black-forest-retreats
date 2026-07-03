import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { dateDe, eur } from "@/lib/admin/format";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import type { InvoiceLineItem } from "@/lib/invoices/types";

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const { id } = await params;
  const sb = createAdminClient();
  const { data: inv } = await sb
    .from("invoices")
    .select("*, bookings(id, booking_number)")
    .eq("id", id)
    .maybeSingle();
  if (!inv) notFound();

  const items = inv.line_items as InvoiceLineItem[];
  const recipient = inv.recipient as { name?: string; email?: string };
  const booking = (inv as { bookings?: { id?: string; booking_number?: string } }).bookings;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/rechnungen" className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60 hover:text-forest-900">
        ← Rechnungen
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-forest-900">{inv.invoice_number}</h1>
        <a
          href={`/api/invoices/${inv.id}/pdf`}
          className="rounded-[3px] bg-forest-900 px-5 py-3 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800"
        >
          PDF herunterladen
        </a>
      </div>

      <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
        <dl className="space-y-2 font-body text-sm">
          <Row k="Art" v={inv.kind === "storno" ? "Stornorechnung" : "Rechnung"} />
          <Row k="Datum" v={dateDe(inv.issued_at)} />
          <Row k="Empfänger" v={`${recipient?.name ?? ""} (${recipient?.email ?? ""})`} />
          {booking?.booking_number && (
            <div className="flex justify-between gap-4">
              <dt className="text-forest-700/60">Buchung</dt>
              <dd>
                <Link href={`/admin/buchungen/${booking.id}`} className="font-medium text-forest-900 underline-offset-2 hover:underline">
                  {booking.booking_number}
                </Link>
              </dd>
            </div>
          )}
          {inv.service_from && inv.service_to && (
            <Row k="Leistungszeitraum" v={`${dateDe(inv.service_from)} bis ${dateDe(inv.service_to)}`} />
          )}
        </dl>

        <div className="mt-6 border-t border-forest-900/10 pt-5">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4 py-1.5 font-body text-sm">
              <span className="text-forest-900/85">{item.label}</span>
              <span className="shrink-0 font-medium text-forest-900">{eur(item.totalCents)}</span>
            </div>
          ))}
          <div className="mt-3 space-y-1.5 border-t border-forest-900/15 pt-3 font-body text-sm">
            <Row k="Netto" v={eur(inv.net_cents)} />
            <Row k={`USt. ${String(inv.vat_rate).replace(".", ",")} %`} v={eur(inv.vat_cents)} />
            <div className="flex justify-between font-bold text-forest-900">
              <span>Brutto</span>
              <span>{eur(inv.gross_cents)}</span>
            </div>
          </div>
        </div>
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
