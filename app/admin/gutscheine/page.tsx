import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { GiftCardCreateForm } from "@/components/admin/GiftCardCreateForm";
import { GiftCardExportList, type GiftCardListRow } from "@/components/admin/GiftCardExportList";
import { ExportMenu } from "@/components/admin/ExportMenu";

export default async function AdminGiftCardsPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data: cards } = await sb
    .from("gift_cards")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows: GiftCardListRow[] = (cards ?? []).map((c) => ({
    id: c.id,
    code: c.code,
    demo: Boolean(c.demo),
    source: c.source ?? null,
    status: c.status,
    amountCents: c.amount_cents,
    balanceCents: c.balance_cents,
    buyerName: c.buyer_name ?? "",
    buyerEmail: c.buyer_email ?? "",
    recipientName: c.recipient_name ?? "",
    createdAt: c.created_at,
    expiresAt: c.expires_at ?? null,
    downloadToken: c.download_token ?? "",
  }));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-forest-900">Gutscheine</h1>
          <p className="mt-2 max-w-xl font-body text-sm text-forest-700/70">
            Wertgutscheine aus dem Kaufflow und selbst ausgestellte Gutscheine. Restguthaben bleibt
            auf dem Code; Storno nur bei unangetastetem Guthaben (Stripe-Erstattung manuell im
            Dashboard).
          </p>
        </div>
        <ExportMenu endpoint="/api/giftcards/bulk" />
      </div>

      <GiftCardCreateForm />

      <div className="mt-6">
        <GiftCardExportList rows={rows} />
      </div>
    </div>
  );
}
