import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { dateDe, eur } from "@/lib/admin/format";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";

export default async function AdminInvoicesPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data: invoices } = await sb
    .from("invoices")
    .select("id, invoice_number, kind, gross_cents, issued_at, recipient, bookings(booking_number)")
    .order("issued_at", { ascending: false })
    .limit(500);

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-900">Rechnungen</h1>
      <p className="mt-2 font-body text-sm text-forest-700/70">
        GoBD-konform: lückenlose Nummern, unveränderlich gespeichert, Storno per Stornorechnung.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[8px] border border-forest-900/10 bg-white">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-forest-900/10">
              {["Nummer", "Art", "Datum", "Empfänger", "Buchung", "Brutto", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-start font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/55">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(invoices ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-body text-sm text-forest-700/60">
                  Noch keine Rechnungen. Die erste entsteht automatisch mit der ersten Zahlung.
                </td>
              </tr>
            )}
            {(invoices ?? []).map((inv) => (
              <tr key={inv.id} className="border-b border-forest-900/5 last:border-0 hover:bg-cream-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/rechnungen/${inv.id}`} className="font-body text-sm font-semibold text-forest-900 underline-offset-2 hover:underline">
                    {inv.invoice_number}
                  </Link>
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                  {inv.kind === "storno" ? "Stornorechnung" : "Rechnung"}
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">{dateDe(inv.issued_at)}</td>
                <td className="px-4 py-3 font-body text-sm text-forest-900">
                  {(inv.recipient as { name?: string })?.name ?? ""}
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                  {(inv as { bookings?: { booking_number?: string } }).bookings?.booking_number ?? ""}
                </td>
                <td className="px-4 py-3 font-body text-sm font-semibold text-forest-900">{eur(inv.gross_cents)}</td>
                <td className="px-4 py-3 text-end">
                  <a href={`/api/invoices/${inv.id}/pdf`} className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline">
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
