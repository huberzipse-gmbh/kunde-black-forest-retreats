"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStrings } from "@/lib/i18n/useStrings";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

// Mit führendem "/" → funktioniert von jeder Unterseite zurück zur Startseite.
const NAV = [
  { key: "retreats", href: "/#apartments" },
  { key: "surroundings", href: "/#umgebung" },
  { key: "gift", href: "/#gutschein" },
] as const;

export function SiteHeader() {
  const t = useStrings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Weißer Balken nur wenn gescrollt UND Menü zu. Sonst transparent (über Hero / bei offenem Menü).
  const solid = scrolled && !open;
  // Helle Elemente (weiß) über Hero und bei offenem Menü; dunkle nur im weißen Balken.
  const light = !solid;

  const lineColor = light ? "bg-white" : "bg-forest-900";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-white py-3 shadow-[0_1px_0_0_rgba(27,42,33,0.08)]"
            : "bg-transparent pt-8 pb-5 md:pt-10 md:pb-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-5 md:px-10">
          {/* Links: Menü-Button */}
          <div className="flex shrink-0 justify-start">
            <button
              type="button"
              aria-label={open ? t.nav.close : t.nav.menu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 items-center gap-3"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-6 transition-all duration-300 ${lineColor} ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-px w-6 transition-all duration-300 ${lineColor} ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-6 transition-all duration-300 ${lineColor} ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
              <span
                className={`hidden text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300 sm:inline ${
                  light ? "text-white" : "text-forest-900"
                }`}
              >
                {open ? t.nav.close : t.nav.menu}
              </span>
            </button>
          </div>

          {/* Mitte: Logo (flex-zentriert zwischen Menü-Button und Slider) */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex min-w-0 flex-1 flex-col items-center px-1 text-center"
          >
            <span
              className={`font-display whitespace-nowrap text-[0.88rem] leading-none tracking-[0.1em] transition-colors duration-500 sm:text-[1.06rem] sm:tracking-[0.14em] md:text-[1.375rem] ${
                light ? "text-white" : "text-forest-900"
              }`}
            >
              {t.brand.name}
            </span>
            <span
              className={`mt-1.5 font-body text-[0.6rem] font-medium uppercase tracking-[0.34em] transition-colors duration-500 md:text-[0.7rem] ${
                light ? "text-white/85" : "text-forest-700/80"
              }`}
            >
              {t.brand.location}
            </span>
          </Link>

          {/* Rechts: Sprach-Slider (immer sichtbar) + Buchen (Desktop; mobil übernimmt die Bottom-Bar) */}
          <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
            <LanguageSwitcher compact showLabel={false} />
            <Link
              href="/#apartments"
              className="hidden rounded-[3px] border border-forest-900 bg-forest-900 px-4 py-2.5 font-body text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white hover:text-forest-900 md:inline-flex md:px-6 md:text-xs"
            >
              {t.nav.book}
            </Link>
          </div>
        </div>
      </header>

      {/* Vollbild-Menü */}
      <div
        className={`fixed inset-0 z-40 bg-night/97 backdrop-blur-md transition-opacity duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-3 px-6">
          {NAV.map((item, i) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl text-cream-50 transition-colors duration-300 hover:text-brass-300 md:text-5xl"
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              {t.nav[item.key]}
            </a>
          ))}
          <span className="mt-10 font-body text-[0.62rem] font-medium uppercase tracking-[0.34em] text-cream-100/50">
            {t.park.name}
          </span>
        </nav>
      </div>
    </>
  );
}
