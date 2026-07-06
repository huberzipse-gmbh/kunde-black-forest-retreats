"use client";

/**
 * Preisaufschlüsselung im Airbnb-Stil: durchgestrichener Basispreis,
 * benannte Rabattzeilen, Registrierten-Vorteil, Gesamt inkl. MwSt-Hinweis.
 */
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtEur, fmtNum } from "@/lib/i18n/format";
import type { PriceQuote } from "@/lib/booking/types";

export function GoodPriceBadge() {
  const t = useStrings().bookingFlow.price;
  return (
    <div className="flex items-start gap-3 rounded-[6px] border border-brass-400/40 bg-brass-400/10 px-4 py-3">
      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-brass-600" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18M6 9l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)" />
      </svg>
      <p className="font-body text-xs leading-relaxed text-forest-900/85">{t.goodPrice}</p>
    </div>
  );
}

/** Prominente Preisanzeige: „~200 €~ 150 € pro Nacht". */
export function NightlyPrice({ quote }: { quote: Pick<PriceQuote, "avgNightlyBaseCents" | "avgNightlyEffectiveCents"> }) {
  const t = useStrings().bookingFlow.price;
  const locale = useLocale();
  const discounted = quote.avgNightlyEffectiveCents < quote.avgNightlyBaseCents;
  return (
    <div className="flex items-baseline gap-2.5">
      {discounted && (
        <span className="font-body text-base text-forest-700/50 line-through">
          {fmtNum(fmtEur(quote.avgNightlyBaseCents, locale), locale)}
        </span>
      )}
      <span className="font-display text-3xl text-forest-900">
        {fmtNum(fmtEur(quote.avgNightlyEffectiveCents, locale), locale)}
      </span>
      <span className="font-body text-sm text-forest-700/70">{t.perNight}</span>
    </div>
  );
}

export function PriceBreakdown({ quote }: { quote: PriceQuote }) {
  const t = useStrings().bookingFlow.price;
  const locale = useLocale();
  const eur = (c: number) => fmtNum(fmtEur(c, locale), locale);

  return (
    <div>
      <div className="space-y-2.5">
        {quote.lines.map((line, i) => {
          const label =
            line.kind === "nights"
              ? fmtNum(t.nightsLine(fmtEur(quote.avgNightlyBaseCents, locale), quote.nights), locale)
              : line.kind === "cleaning"
                ? t.cleaning
                : line.kind === "registered"
                  ? t.registered
                  : line.kind === "promo"
                    ? t.promoLine(line.label)
                    : line.label;
          const isDiscount = line.amountCents < 0;
          return (
            <div key={i} className="flex items-baseline justify-between gap-4">
              <span className={`font-body text-sm ${isDiscount ? "text-forest-500" : "text-forest-900/85"}`}>
                {label}
              </span>
              <span className={`font-body text-sm font-medium ${isDiscount ? "text-forest-500" : "text-forest-900"}`}>
                {eur(line.amountCents)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-baseline justify-between border-t border-forest-900/15 pt-4">
        <span className="font-body text-sm font-bold text-forest-900">{t.total}</span>
        <div className="text-end">
          <div className="font-body text-base font-bold text-forest-900">{eur(quote.totalCents)}</div>
          <div className="font-body text-[0.7rem] text-forest-700/60">
            {fmtNum(t.inclVat(String(quote.vatRate).replace(".", locale === "de" ? "," : ".")), locale)}
          </div>
        </div>
      </div>
    </div>
  );
}
