"use client";

/**
 * Prominenter „Als PDF exportieren"-Button (oben rechts) mit Ausfahr-Menü zur
 * Zeitraum-Auswahl. Exportiert alle Dokumente im Zeitraum als ZIP über die
 * übergebene Bulk-Route (/api/invoices/bulk bzw. /api/giftcards/bulk).
 */
import { useEffect, useRef, useState } from "react";

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function ExportMenu({ endpoint }: { endpoint: string }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const preset = (kind: "thisMonth" | "lastMonth" | "thisYear") => {
    const now = new Date();
    let start: Date;
    let end: Date;
    if (kind === "thisMonth") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (kind === "lastMonth") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }
    setFrom(iso(start));
    setTo(iso(end));
  };

  const exportZip = () => {
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    if (![...qs.keys()].length) return;
    window.location.href = `${endpoint}?${qs.toString()}`;
    setOpen(false);
  };

  const label = "font-body text-xs font-medium text-forest-700/70";
  const input =
    "w-full rounded-[4px] border border-forest-900/15 bg-white px-3 py-2 font-body text-sm text-forest-900 outline-none focus:border-brass-400";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-[3px] bg-forest-900 px-5 py-3 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Als PDF exportieren
      </button>

      {open && (
        <div className="absolute end-0 z-20 mt-2 w-72 rounded-[8px] border border-forest-900/10 bg-white p-4 shadow-[0_20px_50px_-18px_rgba(15,24,19,0.4)]">
          <p className="font-body text-sm font-semibold text-forest-900">Zeitraum wählen</p>
          <p className="mt-0.5 font-body text-xs text-forest-700/60">
            Alle Dokumente im Zeitraum als ZIP.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["Dieser Monat", "thisMonth"],
                ["Letzter Monat", "lastMonth"],
                ["Dieses Jahr", "thisYear"],
              ] as const
            ).map(([lbl, kind]) => (
              <button
                key={kind}
                type="button"
                onClick={() => preset(kind)}
                className="rounded-full border border-forest-900/15 px-3 py-1 font-body text-xs text-forest-700 transition-colors hover:border-forest-900/40 hover:bg-cream-50"
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="block">
              <span className={label}>Von</span>
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) => setFrom(e.target.value)}
                className={`mt-1 ${input}`}
              />
            </label>
            <label className="block">
              <span className={label}>Bis</span>
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
                className={`mt-1 ${input}`}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={exportZip}
            disabled={!from && !to}
            className="mt-4 w-full rounded-[3px] bg-brass-400 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-night transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Exportieren
          </button>
        </div>
      )}
    </div>
  );
}
