"use client";

/**
 * Sync-Status + manuelle Trigger: Airbnb-iCal-Sync und fällige Abbuchungen.
 * Läuft sonst automatisch (externer Cron + opportunistisch beim Dashboard-Load).
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { runChargeDueNow, runIcalSyncNow } from "@/app/admin/actions";
import { dateTimeDe } from "@/lib/admin/format";

interface Run {
  job: string;
  lastRun: string;
  lastResult: string;
}

export function CronPanel({ runs }: { runs: Run[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const runOf = (job: string) => runs.find((r) => r.job === job);
  const stale = (job: string) => {
    const r = runOf(job);
    return !r || Date.now() - new Date(r.lastRun).getTime() > 2 * 60 * 60 * 1000;
  };

  const trigger = (job: "sync-ical" | "charge-due") => {
    startTransition(async () => {
      const result = job === "sync-ical" ? await runIcalSyncNow() : await runChargeDueNow();
      setMessage(
        `${job === "sync-ical" ? "iCal-Sync" : "Abbuchungen"}: ${result.processed} verarbeitet, ${result.failed} fehlgeschlagen${result.details.length ? ` — ${result.details.join(" · ")}` : ""}`,
      );
      router.refresh();
    });
  };

  return (
    <div className="rounded-[8px] border border-forest-900/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          {(["sync-ical", "charge-due"] as const).map((job) => {
            const r = runOf(job);
            return (
              <div key={job} className="font-body text-xs text-forest-700/75">
                <span className={`me-2 inline-block h-2 w-2 rounded-full ${stale(job) ? "bg-brass-400" : "bg-forest-500"}`} />
                {job === "sync-ical" ? "Airbnb-Kalender-Sync" : "Fällige Abbuchungen"}:{" "}
                {r ? `zuletzt ${dateTimeDe(r.lastRun)}${r.lastResult ? ` (${r.lastResult})` : ""}` : "noch nie gelaufen"}
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => trigger("sync-ical")}
            className="rounded-[3px] border border-forest-900/25 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900 disabled:opacity-40"
          >
            Jetzt synchronisieren
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => trigger("charge-due")}
            className="rounded-[3px] bg-forest-900 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-40"
          >
            Fällige Abbuchungen ausführen
          </button>
        </div>
      </div>
      {message && (
        <p className="mt-3 rounded-[4px] bg-cream-100 px-3 py-2 font-body text-xs text-forest-900">{message}</p>
      )}
    </div>
  );
}
