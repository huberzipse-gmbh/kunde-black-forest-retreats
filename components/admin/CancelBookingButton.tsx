"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/app/admin/actions";

/** Storno mit Bestätigungsdialog; erstellt bei bezahlten Buchungen die Stornorechnung. */
export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const res = await cancelBooking(bookingId, reason.trim());
      if (!res.ok) {
        setError(res.error ?? "Storno fehlgeschlagen.");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[3px] border border-red-800/40 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-red-800 transition-colors hover:bg-red-800 hover:text-white"
      >
        Stornieren
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 px-6">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6">
            <h3 className="font-display text-xl text-forest-900">Buchung stornieren?</h3>
            <p className="mt-2 font-body text-sm text-forest-700/80">
              Der Zeitraum wird freigegeben. Bezahlte Buchungen werden erstattet und erhalten
              automatisch eine Stornorechnung (GoBD).
            </p>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Grund (optional, erscheint auf der Stornorechnung)"
              className="mt-4 w-full rounded-[4px] border border-forest-900/20 px-4 py-3 font-body text-sm outline-none focus:border-forest-900"
            />
            {error && <p className="mt-3 font-body text-sm text-red-800">{error}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[3px] border border-forest-900/25 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirm}
                className="rounded-[3px] bg-red-800 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {isPending ? "Storniere …" : "Verbindlich stornieren"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
