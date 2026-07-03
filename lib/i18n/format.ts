import type { Locale } from "./config";

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Wandelt westliche Ziffern (0-9) in die locale-übliche Schreibweise.
 * - ar  → arabisch-indische Ziffern (٠١٢…), authentisch fürs Arabische.
 * - de/en/zh → unverändert (dort sind westliche Ziffern Standard).
 * Wirkt nur auf Ziffern-Zeichen, lässt Punkt/Komma/Text unangetastet.
 */
export function fmtNum(value: string | number, locale: Locale): string {
  const s = String(value);
  if (locale === "ar") return s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
  return s;
}

/** Intl-Locale je App-Locale (fürs Währungs-/Datumsformat). */
const INTL: Record<Locale, string> = {
  de: "de-DE",
  en: "en-GB",
  ar: "ar",
  zh: "zh-CN",
};

/**
 * EUR-Betrag aus Cent, locale-typisch formatiert (de „150 €", en „€150").
 * Ganze Beträge ohne Nachkommastellen, krumme mit zweien.
 */
export function fmtEur(cents: number, locale: Locale): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(INTL[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100);
}

/** Datum locale-typisch (z. B. „12. August 2026"). */
export function fmtDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** Kurzdatum (z. B. „12. Aug.") für kompakte Zusammenfassungen. */
export function fmtDateShort(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    day: "numeric",
    month: "short",
  }).format(new Date(isoDate));
}
