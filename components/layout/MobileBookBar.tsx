"use client";

import { useEffect, useState } from "react";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";

/**
 * MobileBookButton — schwebende grüne Buchen-Pille (nur Mobile, md:hidden).
 * Initial sitzt sie auf der Unterkante des Hero-Videos (halb auf Video, halb
 * darunter). Beim ersten Scrollen verkleinert sie sich auf ~75 % und bleibt
 * dann fix unten sichtbar/klickbar. Link auf #apartments. z-40 (unter Header).
 */
export function MobileBookBar() {
  const t = useStrings();
  // Interne Links tragen die Sprache im Pfad (/en#apartments statt /#apartments).
  const href = useLocaleHref();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={href("/#apartments")}
      aria-label={t.booking.bookStay}
      className={`fixed left-1/2 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-[4px] bg-forest-900 px-9 py-4 font-body text-base font-semibold text-white shadow-[0_16px_36px_-12px_rgba(15,24,19,0.75)] ring-1 ring-white/10 transition-all duration-300 ease-out md:hidden ${
        scrolled ? "bottom-6 scale-[0.75]" : "bottom-[9svh] scale-100"
      }`}
    >
      {t.nav.book}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 rtl:rotate-180"
        aria-hidden
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
