"use client";

/**
 * Fehlerauffang für die Kontoseite. Ohne diese Boundary crasht /konto bei
 * einem Render-Fehler zu einer leeren Seite — was sich wie „Login tut nichts"
 * anfühlt. Stattdessen: freundlicher Hinweis mit Wiederholen.
 */
import { useEffect } from "react";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[konto] Render-Fehler:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="font-display text-3xl text-forest-900">Kurzer Aussetzer</h1>
      <p className="mt-3 font-body text-sm text-forest-700/75">
        Dein Konto konnte gerade nicht geladen werden. Bitte versuche es noch einmal.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300"
        >
          Erneut versuchen
        </button>
        <a
          href="/"
          className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/70 hover:text-forest-900"
        >
          Zur Startseite
        </a>
      </div>
    </div>
  );
}
