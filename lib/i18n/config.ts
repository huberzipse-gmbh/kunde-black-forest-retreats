/**
 * i18n-Grundkonfiguration: verfügbare Sprachen, Default, Anzeigenamen, Schreibrichtung.
 *
 * `locales`         = alle Sprachen, deren String-Datei existiert (auch Platzhalter).
 * `availableLocales`= Sprachen, deren Übersetzung schon REAL ist → nur diese im Switcher.
 *                     Phase 1A: nur Deutsch. Später erweitern, sobald en/ar/zh übersetzt sind.
 */
export const locales = ['de', 'en', 'ar', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

/** Im Sprachwähler sichtbar (echte Übersetzungen). Phase 1A: nur Deutsch. */
export const availableLocales: Locale[] = ['de', 'en', 'ar', 'zh'];

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  ar: 'العربية',
  zh: '中文',
};

/** Kurzkürzel je Sprache, in der eigenen Schrift (für den kompakten Slider). */
export const localeShort: Record<Locale, string> = {
  de: 'DE',
  en: 'EN',
  ar: 'عر',
  zh: '中',
};

export const dir = (l: Locale): 'ltr' | 'rtl' => (l === 'ar' ? 'rtl' : 'ltr');

export const isLocale = (s?: string | null): s is Locale =>
  !!s && (locales as readonly string[]).includes(s);
