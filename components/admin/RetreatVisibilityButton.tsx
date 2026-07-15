"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setRetreatHidden } from "@/app/admin/actions";

/**
 * Wohnung mit einem Klick aus-/einblenden. Ausgeblendet = nicht auf der Website,
 * aber nicht gelöscht (alle Daten/Buchungen bleiben). Instant, ohne den Editor
 * zu speichern.
 */
export function RetreatVisibilityButton({
  retreatId,
  hidden,
}: {
  retreatId: string;
  hidden: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setError(null);
    startTransition(async () => {
      const res = await setRetreatHidden(retreatId, !hidden);
      if (!res.ok) {
        setError(res.error ?? "Fehlgeschlagen.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        className={`inline-flex items-center gap-2 rounded-[3px] border px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
          hidden
            ? "border-brass-600/50 bg-brass-400/15 text-brass-600 hover:bg-brass-400 hover:text-night"
            : "border-forest-900/25 text-forest-900 hover:bg-forest-900 hover:text-cream-50"
        }`}
      >
        {hidden ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {isPending ? "Blende ein …" : "Wieder einblenden"}
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 3l18 18M10.6 10.6a2.5 2.5 0 003.4 3.4M9.4 5.2A9.5 9.5 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-2.4 3.3M6.3 6.3A16.8 16.8 0 002 12s3.5 7 10 7a9.7 9.7 0 004.2-.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {isPending ? "Blende aus …" : "Ausblenden"}
          </>
        )}
      </button>
      {hidden && !isPending && (
        <span className="font-body text-[0.65rem] font-medium uppercase tracking-wider text-brass-600">
          Zurzeit nicht auf der Website
        </span>
      )}
      {error && <span className="font-body text-xs text-red-800">{error}</span>}
    </div>
  );
}
