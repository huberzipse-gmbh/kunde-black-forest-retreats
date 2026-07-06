"use client";

/**
 * Bestätigung nach QR-Scan vom Pappaufsteller: schwebende Karte am unteren
 * Rand, solange der Rabattcode im Cookie liegt. Wegklickbar pro Sitzung.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

interface Props {
  code: string;
  percent: number;
}

export function PromoBanner({ code, percent }: Props) {
  const t = useStrings().bookingFlow.promo;
  const locale = useLocale();
  const [hidden, setHidden] = useState(false);
  // Erst zeigen, wenn der Cookie-Hinweis beantwortet ist (beide liegen unten).
  const [consentDone, setConsentDone] = useState(false);
  useEffect(() => {
    setConsentDone(getConsent() !== null);
    const onChange = () => setConsentDone(true);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (hidden || !consentDone) return null;

  const pct = String(percent).replace(".", locale === "de" ? "," : ".");

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl">
      <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-brass-400/40 bg-forest-900 px-5 py-4 shadow-[0_16px_50px_rgba(15,24,19,0.45)] sm:flex-nowrap sm:gap-4">
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-brass-300" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 14.5 20.5 3M15 3h5.5v5.5M13.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Auf schmalen Screens rutscht der Text als volle Zeile unter Icon/Code/Schließen. */}
        <div className="order-last basis-full min-w-0 sm:order-none sm:basis-auto sm:flex-1">
          <p className="font-body text-sm leading-relaxed text-cream-50">
            {fmtNum(t.banner(pct), locale)}
          </p>
          <Link
            href="/wohnungen"
            className="mt-1 inline-block font-body text-xs font-semibold uppercase tracking-[0.14em] text-brass-300 underline-offset-4 transition-colors hover:text-brass-100 hover:underline"
          >
            {t.bannerCta}
          </Link>
        </div>
        <div className="shrink-0 text-end sm:order-none">
          <div className="rounded-[4px] border border-brass-400/50 px-2.5 py-1 font-body text-xs font-bold tracking-[0.12em] text-brass-300">
            {code}
          </div>
        </div>
        <button
          type="button"
          aria-label={t.close}
          onClick={() => setHidden(true)}
          className="ms-auto shrink-0 self-start p-1 text-cream-50/50 transition-colors hover:text-cream-50 sm:ms-0"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
