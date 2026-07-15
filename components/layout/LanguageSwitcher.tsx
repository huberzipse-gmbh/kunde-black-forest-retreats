"use client";

/**
 * Sprachauswahl. Desktop: segmentierter Slider mit gleitendem Messing-Indikator
 * (DE · EN · عر · 中). Mobil: ein kompaktes Sprach-Element, das oben rechts ein
 * Menü mit den Sprachen ausklappt. Auswahl setzt das Cookie NEXT_LOCALE und lädt
 * neu, damit der Server Strings (und dir/lang) in der neuen Sprache rendert.
 */
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  availableLocales,
  localeHref,
  localeNames,
  localeShort,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";

const PAD = "0.25rem"; // Innenabstand des Tracks (p-1)

interface SwitcherProps {
  className?: string;
  /** Kompakte Variante für den Header (kleinere Segmente, kein Label). */
  compact?: boolean;
  /** „SPRACHE"-Label über dem Slider zeigen. */
  showLabel?: boolean;
}

const GlobeIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
  </svg>
);

export function LanguageSwitcher({
  className = "",
  compact = false,
  showLabel = true,
}: SwitcherProps) {
  const current = useLocale();
  const label = useStrings().langSwitcher.label;
  const activeIndex = Math.max(0, availableLocales.indexOf(current));
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Kompakt (Header): mobil schmaler, ab Desktop voll — damit es neben dem Logo passt.
  const seg = compact ? "clamp(1.5rem, 4.4vw, 2rem)" : "2.75rem";
  const height = compact ? "h-7" : "h-9";
  const textSize = compact ? "text-[0.7rem]" : "text-sm";

  const choose = (l: Locale) => {
    if (l === current) {
      setOpen(false);
      return;
    }
    // Cookie bleibt: Buchung, Konto und Admin laufen ohne Sprach-Präfix und
    // lesen die Sprache weiterhin von dort.
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`;
    // Sprache steckt jetzt in der URL → navigieren statt neu laden.
    const { pathname: bare } = splitLocale(pathname);
    router.push(localeHref(bare, l));
    router.refresh();
    setOpen(false);
  };

  const slider = (
    <div
      role="group"
      aria-label={label}
      className="relative inline-flex rounded-full border border-cream-50/15 bg-night/50 p-1 backdrop-blur-sm"
    >
      {/* Gleitender Indikator (RTL-sicher über inset-inline-start) */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-full bg-brass-400 shadow-[0_2px_10px_-2px_rgba(193,150,80,0.6)] transition-[inset-inline-start] duration-300 ease-out"
        style={{ width: seg, insetInlineStart: `calc(${PAD} + ${activeIndex} * ${seg})` }}
      />

      {availableLocales.map((l) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={active}
            aria-label={l.toUpperCase()}
            onClick={() => choose(l)}
            style={{ width: seg }}
            className={`relative z-10 flex items-center justify-center font-body font-semibold tracking-wide transition-colors duration-300 ${height} ${textSize} ${
              active ? "text-night" : "text-cream-100/65 hover:text-cream-50"
            }`}
          >
            {localeShort[l]}
          </button>
        );
      })}
    </div>
  );

  // Mobil: kompaktes Element, das ein Sprach-Menü oben rechts ausklappt.
  const dropdown = (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-cream-50/15 bg-night/50 px-2.5 font-body text-[0.72rem] font-semibold text-cream-50 backdrop-blur-sm"
      >
        <GlobeIcon />
        {localeShort[current]}
      </button>

      {open && (
        <>
          {/* Klick-außerhalb-Fläche */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            aria-label={label}
            className="absolute end-0 top-full z-50 mt-2 min-w-[9.5rem] overflow-hidden rounded-xl border border-cream-50/15 bg-night/95 p-1.5 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            {availableLocales.map((l) => {
              const active = l === current;
              return (
                <button
                  key={l}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => choose(l)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start font-body text-sm transition-colors ${
                    active
                      ? "bg-brass-400 text-night"
                      : "text-cream-100/80 hover:bg-cream-50/10 hover:text-cream-50"
                  }`}
                >
                  <span>{localeNames[l]}</span>
                  <span
                    className={`text-[0.7rem] font-semibold ${active ? "text-night/70" : "text-cream-100/45"}`}
                  >
                    {localeShort[l]}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  if (!showLabel) {
    return (
      <div className={className}>
        {/* Mobil: ausklappbares Sprach-Element */}
        <div className="md:hidden">{dropdown}</div>
        {/* Desktop: Slider */}
        <div className="hidden md:block">{slider}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.34em] text-cream-100/45">
        {label}
      </span>
      <div className="mt-3">{slider}</div>
    </div>
  );
}
