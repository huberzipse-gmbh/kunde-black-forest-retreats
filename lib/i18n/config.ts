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

/* ------------------------------------------------------------------ *
 * URL-Routing der Sprachen
 *
 * Deutsch bleibt bewusst OHNE Präfix auf den bestehenden URLs ("/",
 * "/wohnungen/x"), damit keine bereits verlinkte oder indexierte URL bricht.
 * Die übrigen Sprachen bekommen ein Präfix ("/en/wohnungen/x").
 *
 * Vorher lief die Sprachwahl nur über das Cookie NEXT_LOCALE. Googlebot crawlt
 * ohne Cookie und sah deshalb ausschließlich Deutsch — en/ar/zh waren faktisch
 * nicht indexierbar. Eigene URLs sind die von Google empfohlene Lösung.
 * ------------------------------------------------------------------ */

/** Sprache → Pfad-Präfix. Deutsch = '' (Root). */
export const localePrefix = (l: Locale): string => (l === defaultLocale ? '' : `/${l}`);

/**
 * hreflang-Code je Sprache. Weicht bewusst vom internen Kürzel ab:
 * `zh` allein ist mehrdeutig (Kurz- vs. Langzeichen), Google erwartet `zh-Hans`.
 * `ar` bleibt ohne Länderkürzel, damit der gesamte arabische Sprachraum
 * adressiert wird und nicht nur ein einzelnes Land.
 */
export const hreflang: Record<Locale, string> = {
  de: 'de',
  en: 'en',
  ar: 'ar',
  zh: 'zh-Hans',
};

/**
 * Pfade OHNE Sprach-Präfix: Buchung, Konto, Admin, API und der Supabase-Proxy.
 * Sie sollen nicht indexiert werden und bleiben technisch unangetastet; ihre
 * Sprache kommt weiterhin aus dem Cookie. Middleware und Sprachwähler müssen
 * sich exakt an dieselbe Liste halten, sonst entstehen 404er.
 */
export const UNPREFIXED_PATHS = [
  '/api',
  '/admin',
  '/buchen',
  '/buchung',
  '/gutschein',
  '/konto',
  '/aktion',
  '/auth',
  '/rest',
  '/storage',
  '/realtime',
  '/functions',
] as const;

export const isUnprefixed = (path: string): boolean =>
  UNPREFIXED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

/** Interne Route ("/umgebung") → lokalisierter Pfad ("/en/umgebung"). */
export const localeHref = (path: string, l: Locale): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  // Buchung/Konto/Admin tragen nie ein Präfix (siehe UNPREFIXED_PATHS).
  if (isUnprefixed(clean)) return clean;
  // Anker und Query dürfen das Präfix nicht abbekommen: "/#apartments" → "/en#apartments"
  const m = clean.match(/^([^?#]*)(.*)$/);
  const [, route = clean, suffix = ''] = m ?? [];
  const base = `${localePrefix(l)}${route}`.replace(/\/$/, '') || '/';
  return `${base}${suffix}`;
};

/**
 * Zerlegt einen eingehenden Pfad in Sprache + sprachfreien Rest.
 * "/en/umgebung" → { locale: 'en', pathname: '/umgebung' }
 * "/umgebung"    → { locale: 'de', pathname: '/umgebung' }
 */
export const splitLocale = (path: string): { locale: Locale; pathname: string } => {
  const [, first, ...rest] = path.split('/');
  if (isLocale(first) && first !== defaultLocale) {
    return { locale: first, pathname: `/${rest.join('/')}`.replace(/\/$/, '') || '/' };
  }
  return { locale: defaultLocale, pathname: path };
};
