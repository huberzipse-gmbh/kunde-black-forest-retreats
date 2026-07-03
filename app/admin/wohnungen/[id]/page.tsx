import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { mapPriceRule } from "@/lib/booking/db";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { RetreatEditor, type EditorBlock } from "@/components/admin/RetreatEditor";

export default async function AdminRetreatEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const { id } = await params;

  const sb = createAdminClient();
  const [{ data: retreat }, { data: rules }, { data: blocks }] = await Promise.all([
    sb.from("retreats").select("*").eq("id", id).maybeSingle(),
    sb.from("price_rules").select("*").eq("retreat_id", id).order("created_at"),
    sb
      .from("availability_blocks")
      .select("*, bookings(booking_number, status, guest_name)")
      .eq("retreat_id", id)
      .gte("end_date", new Date().toISOString().slice(0, 10)),
  ]);
  if (!retreat) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030";
  const exportUrl = `${siteUrl}/api/ical/${retreat.id}/${retreat.ical_export_token}`;

  const editorBlocks: EditorBlock[] = (blocks ?? [])
    .filter((b) => {
      const bk = (b as { bookings?: { status?: string } }).bookings;
      return b.source !== "booking" || (bk && bk.status !== "cancelled");
    })
    .map((b) => ({
      id: b.id,
      start: b.start_date,
      end: b.end_date,
      source: b.source,
      note:
        b.source === "booking"
          ? `${(b as { bookings?: { booking_number?: string; guest_name?: string } }).bookings?.booking_number ?? ""} ${(b as { bookings?: { guest_name?: string } }).bookings?.guest_name ?? ""}`.trim()
          : (b.note ?? ""),
    }));

  return (
    <RetreatEditor
      retreat={retreat}
      rules={(rules ?? []).map(mapPriceRule)}
      blocks={editorBlocks}
      exportUrl={exportUrl}
    />
  );
}
