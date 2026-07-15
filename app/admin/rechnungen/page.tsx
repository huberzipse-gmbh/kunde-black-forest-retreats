import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { InvoiceExportList, type InvoiceListRow } from "@/components/admin/InvoiceExportList";
import { ExportMenu } from "@/components/admin/ExportMenu";

export default async function AdminInvoicesPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data: invoices } = await sb
    .from("invoices")
    .select("id, invoice_number, kind, gross_cents, issued_at, recipient, bookings(booking_number), gift_cards(code)")
    .order("issued_at", { ascending: false })
    .limit(500);

  const rows: InvoiceListRow[] = (invoices ?? []).map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    kind: inv.kind,
    issuedAt: inv.issued_at,
    recipientName: (inv.recipient as { name?: string })?.name ?? "",
    reference:
      (inv as { bookings?: { booking_number?: string } }).bookings?.booking_number ??
      (inv as { gift_cards?: { code?: string } }).gift_cards?.code ??
      "",
    grossCents: inv.gross_cents,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-forest-900">Rechnungen</h1>
          <p className="mt-2 max-w-xl font-body text-sm text-forest-700/70">
            GoBD-konform: lückenlose Nummern, unveränderlich gespeichert, Storno per Stornorechnung.
          </p>
        </div>
        <ExportMenu endpoint="/api/invoices/bulk" />
      </div>

      <div className="mt-6">
        <InvoiceExportList rows={rows} />
      </div>
    </div>
  );
}
