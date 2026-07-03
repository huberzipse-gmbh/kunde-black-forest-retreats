import Link from "next/link";
import { addDays, format } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { runIfStale } from "@/lib/booking/cron";
import { mapBooking } from "@/lib/booking/db";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { StatCard } from "@/components/admin/StatCard";
import { BookingTable } from "@/components/admin/BookingTable";
import { CronPanel } from "@/components/admin/CronPanel";

const iso = (d: Date) => format(d, "yyyy-MM-dd");

export default async function AdminDashboardPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;

  // Opportunistischer Cron-Trigger: Sync/Abbuchung, wenn > 30 min her.
  await runIfStale();

  const sb = createAdminClient();
  const today = iso(new Date());
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const weekAhead = iso(addDays(new Date(), 7));

  const [paidRes, openRes, arrivalsRes, failedRes, recentRes, cronRes] = await Promise.all([
    sb
      .from("bookings")
      .select("total_cents")
      .eq("payment_status", "paid")
      .gte("confirmed_at", monthAgo),
    sb
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("payment_status", ["awaiting_payment", "scheduled", "charge_due", "failed"])
      .neq("status", "cancelled"),
    sb
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .gte("check_in", today)
      .lte("check_in", weekAhead),
    sb
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("payment_status", "failed"),
    sb
      .from("bookings")
      .select("*, retreats(name_de)")
      .order("created_at", { ascending: false })
      .limit(8),
    sb.from("cron_runs").select("*"),
  ]);

  const revenue30 = (paidRes.data ?? []).reduce((sum, r) => sum + r.total_cents, 0);
  const failedCharges = failedRes.data ?? [];
  const recent = (recentRes.data ?? []).map((row) => ({
    booking: mapBooking(row),
    retreatName: (row as { retreats?: { name_de?: string } }).retreats?.name_de ?? "",
  }));

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-900">Dashboard</h1>

      {/* Warnungen */}
      {failedCharges.length > 0 && (
        <div className="mt-6 rounded-[6px] border border-red-800/25 bg-red-50 px-5 py-4">
          <div className="font-body text-sm font-bold text-red-900">
            {failedCharges.length} fehlgeschlagene Abbuchung{failedCharges.length > 1 ? "en" : ""}
          </div>
          <p className="mt-1 font-body text-xs text-red-900/80">
            Bitte in den{" "}
            <Link href="/admin/buchungen" className="underline underline-offset-2">
              Buchungen
            </Link>{" "}
            prüfen und nachfassen.
          </p>
        </div>
      )}

      {/* Kennzahlen */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Umsatz (30 Tage)" valueCents={revenue30} />
        <StatCard label="Offene Buchungen" value={openRes.count ?? 0} />
        <StatCard label="Anreisen (7 Tage)" value={arrivalsRes.count ?? 0} />
        <StatCard label="Fehlgeschlagene Abbuchungen" value={failedCharges.length} alert={failedCharges.length > 0} />
      </div>

      {/* Cron / Sync */}
      <div className="mt-8">
        <CronPanel runs={(cronRes.data ?? []).map((r) => ({ job: r.job, lastRun: r.last_run, lastResult: r.last_result ?? "" }))} />
      </div>

      {/* Letzte Buchungen */}
      <div className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl text-forest-900">Letzte Buchungen</h2>
          <Link href="/admin/buchungen" className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline">
            Alle ansehen
          </Link>
        </div>
        <div className="mt-4">
          <BookingTable
            rows={recent.map(({ booking, retreatName }) => ({
              id: booking.id,
              bookingNumber: booking.bookingNumber,
              retreatName,
              guestName: booking.guestName,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              totalCents: booking.totalCents,
              status: booking.status,
              paymentStatus: booking.paymentStatus,
              demo: booking.demo,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
