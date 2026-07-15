"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * Datenschutzkonformer Cookie-/Einwilligungs-Hinweis. Technisch notwendige
 * Cookies (Spracheinstellung) sind ohne Einwilligung zulässig (§ 25 Abs. 2
 * TDDDG). Eine echte Wahl besteht für externe Inhalte Dritter (OpenStreetMap-
 * Karte): „Akzeptieren" erlaubt sie, „Ablehnen" lädt nur notwendige Funktionen.
 * Die Auswahl wird gespeichert und steuert das Laden der Karte (siehe RegionMap).
 */
export function CookieBanner() {
  const t = useStrings().cookie;
  // Interne Links tragen die Sprache im Pfad (/en/datenschutz statt /datenschutz).
  const href = useLocaleHref();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (value: "all" | "essential") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t.title}
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-[60] md:inset-x-auto md:bottom-5 md:end-5 md:max-w-md"
    >
      <div className="rounded-xl border border-cream-50/15 bg-night/95 p-5 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brass-300">
          {t.title}
        </p>
        <p className="mt-3 font-body text-sm leading-relaxed text-cream-100/80">
          {t.text}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3">
          <button
            type="button"
            onClick={() => decide("all")}
            className="rounded-[3px] bg-brass-400 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-night transition-colors hover:bg-brass-300"
          >
            {t.accept}
          </button>
          <button
            type="button"
            onClick={() => decide("essential")}
            className="rounded-[3px] border border-cream-50/30 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-cream-100/85 transition-colors hover:border-cream-50/60 hover:text-cream-50"
          >
            {t.reject}
          </button>
          <Link
            href={href("/datenschutz")}
            className="font-body text-xs text-cream-100/60 underline-offset-2 transition-colors hover:text-brass-300 hover:underline"
          >
            {t.link}
          </Link>
        </div>
      </div>
    </div>
  );
}
