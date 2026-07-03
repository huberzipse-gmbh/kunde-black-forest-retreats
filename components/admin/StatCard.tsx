import { eur } from "@/lib/admin/format";

export function StatCard({
  label,
  value,
  valueCents,
  alert = false,
}: {
  label: string;
  value?: number;
  valueCents?: number;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-[8px] border bg-white p-5 ${alert ? "border-red-800/30" : "border-forest-900/10"}`}>
      <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
        {label}
      </div>
      <div className={`mt-2 font-display text-2xl md:text-3xl ${alert ? "text-red-800" : "text-forest-900"}`}>
        {valueCents !== undefined ? eur(valueCents) : (value ?? 0).toLocaleString("de-DE")}
      </div>
    </div>
  );
}
