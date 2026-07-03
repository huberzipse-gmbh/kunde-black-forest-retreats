import Link from "next/link";
import { dateDe, eur, PAYMENT_LABEL, STATUS_LABEL } from "@/lib/admin/format";

export interface BookingRow {
  id: string;
  bookingNumber: string;
  retreatName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalCents: number;
  status: string;
  paymentStatus: string;
  demo: boolean;
}

const statusClass: Record<string, string> = {
  confirmed: "bg-forest-900/10 text-forest-900",
  pending: "bg-brass-400/20 text-brass-600",
  cancelled: "bg-red-100 text-red-800",
};

const paymentClass: Record<string, string> = {
  paid: "bg-forest-900/10 text-forest-900",
  scheduled: "bg-brass-400/20 text-brass-600",
  charge_due: "bg-brass-400/30 text-brass-600",
  failed: "bg-red-100 text-red-800",
  refund_pending: "bg-red-100 text-red-800",
  refunded: "bg-cream-100 text-forest-700",
  unpaid: "bg-cream-100 text-forest-700",
  awaiting_payment: "bg-cream-100 text-forest-700",
};

export function BookingTable({ rows }: { rows: BookingRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[8px] border border-forest-900/10 bg-white px-6 py-10 text-center font-body text-sm text-forest-700/60">
        Noch keine Buchungen.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-[8px] border border-forest-900/10 bg-white">
      <table className="w-full min-w-[760px] text-start">
        <thead>
          <tr className="border-b border-forest-900/10 text-start">
            {["Nr.", "Wohnung", "Gast", "Zeitraum", "Betrag", "Status", "Zahlung"].map((h) => (
              <th key={h} className="px-4 py-3 text-start font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/55">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-forest-900/5 transition-colors last:border-0 hover:bg-cream-50">
              <td className="px-4 py-3">
                <Link href={`/admin/buchungen/${row.id}`} className="font-body text-sm font-semibold text-forest-900 underline-offset-2 hover:underline">
                  {row.bookingNumber}
                </Link>
                {row.demo && (
                  <span className="ms-2 rounded-full bg-cream-100 px-2 py-0.5 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-forest-700/60">
                    Demo
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-body text-sm text-forest-900">{row.retreatName}</td>
              <td className="px-4 py-3 font-body text-sm text-forest-900">{row.guestName}</td>
              <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                {dateDe(row.checkIn)} → {dateDe(row.checkOut)}
              </td>
              <td className="px-4 py-3 font-body text-sm font-semibold text-forest-900">{eur(row.totalCents)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold ${statusClass[row.status] ?? "bg-cream-100 text-forest-700"}`}>
                  {STATUS_LABEL[row.status] ?? row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold ${paymentClass[row.paymentStatus] ?? "bg-cream-100 text-forest-700"}`}>
                  {PAYMENT_LABEL[row.paymentStatus] ?? row.paymentStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
