"use client";

/**
 * Sprach-Slider — segmentierte Auswahl mit gleitendem Messing-Indikator.
 * Jede Sprache als Kürzel in ihrer eigenen Schrift (DE · EN · عر · 中).
 * Auswahl setzt das Cookie NEXT_LOCALE und lädt neu, damit der Server die
 * Strings (und dir/lang) in der neuen Sprache rendert.
 */
import { availableLocales, localeShort, type Locale } from "@/lib/i18n/config";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";

const PAD = "0.25rem"; // Innenabstand des Tracks (p-1)

interface SwitcherProps {
  className?: string;
  /** Kompakte Variante für den Header (kleinere Segmente, kein Label). */
  compact?: boolean;
  /** „SPRACHE"-Label über dem Slider zeigen. */
  showLabel?: boolean;
}

export function LanguageSwitcher({
  className = "",
  compact = false,
  showLabel = true,
}: SwitcherProps) {
  const current = useLocale();
  const label = useStrings().langSwitcher.label;
  const activeIndex = Math.max(0, availableLocales.indexOf(current));

  // Kompakt (Header): mobil schmaler, ab Desktop voll — damit es neben dem Logo passt.
  const seg = compact ? "clamp(1.5rem, 4.4vw, 2rem)" : "2.75rem";
  const height = compact ? "h-7" : "h-9";
  const textSize = compact ? "text-[0.7rem]" : "text-sm";

  const choose = (l: Locale) => {
    if (l === current) return;
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`;
    window.location.reload();
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

  if (!showLabel) return <div className={className}>{slider}</div>;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.34em] text-cream-100/45">
        {label}
      </span>
      <div className="mt-3">{slider}</div>
    </div>
  );
}
