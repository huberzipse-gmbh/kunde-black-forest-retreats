import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { mapBooking } from "@/lib/booking/db";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { BookingTable } from "@/components/admin/BookingTable";
import Link from "next/link";

const FILTERS = [
  { key: "alle", label: "Alle" },
  { key: "offen", label: "Offen" },
  { key: "bestaetigt", label: "Bestätigt" },
  { key: "storniert", label: "Storniert" },
] as const;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sp = await searchParams;
  const filter = typeof sp.filter === "string" ? sp.filter : "alle";

  const sb = createAdminClient();
  let query = sb
    .from("bookings")
    .select("*, retreats(name_de)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter === "offen") {
    query = query
      .in("payment_status", ["unpaid", "awaiting_payment", "scheduled", "charge_due", "failed"])
      .neq("status", "cancelled");
  } else if (filter === "bestaetigt") {
    query = query.eq("status", "confirmed");
  } else if (filter === "storniert") {
    query = query.eq("status", "cancelled");
  }
  const { data } = await query;

  const rows = (data ?? []).map((row) => {
    const b = mapBooking(row);
    return {
      id: b.id,
      bookingNumber: b.bookingNumber,
      retreatName: (row as { retreats?: { name_de?: string } }).retreats?.name_de ?? "",
      guestName: b.guestName,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalCents: b.totalCents,
      status: b.status,
      paymentStatus: b.paymentStatus,
      demo: b.demo,
    };
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-900">Buchungen</h1>
      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "alle" ? "/admin/buchungen" : `/admin/buchungen?filter=${f.key}`}
            className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-colors ${
              filter === f.key
                ? "bg-forest-900 text-cream-50"
                : "border border-forest-900/15 text-forest-900 hover:border-forest-900/40"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <BookingTable rows={rows} />
      </div>
    </div>
  );
}
