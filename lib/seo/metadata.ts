import type { Metadata } from 'next';
import { hreflang, localeHref, locales, defaultLocale, type Locale } from '@/lib/i18n/config';
import { SITE_NAME, SITE_URL } from './config';

/**
 * Baukasten für Seiten-Metadata: canonical, hreflang und Social-Tags aus einer
 * Hand, damit sie nicht seitenweise auseinanderlaufen.
 *
 * Zwei Regeln, an denen mehrsprachige Seiten regelmäßig scheitern:
 *   1. canonical zeigt IMMER auf die Seite selbst, nie auf die deutsche Fassung.
 *      Sonst kippen alle Übersetzungen aus dem Index.
 *   2. `languages` listet ALLE Sprachen inklusive der eigenen. Fehlt die
 *      Rückverlinkung, ignoriert Google die hreflang-Angaben der Seite.
 *
 * Hinweis zum Merging: Next mischt Metadata nur flach. Setzt eine Seite
 * `openGraph`, überschreibt sie das komplette openGraph-Objekt des Layouts.
 * Deshalb baut dieser Helper immer den vollständigen Satz.
 */

const OG_LOCALE: Record<Locale, string> = {
  de: 'de_DE',
  en: 'en_US',
  ar: 'ar_AR',
  zh: 'zh_CN',
};

/** Standard-Vorschaubild für Social und Chat-Previews. */
export const DEFAULT_OG_IMAGE = '/images/wohnungen/penthouse/01.jpg';

export interface PageMetaInput {
  /** Sprachneutrale Route, z. B. "/umgebung" oder "/wohnungen/riverhouse". */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  /** Pfade relativ zur Domain; erstes Bild wird zur Social-Vorschau. */
  images?: string[];
}

export function buildMetadata({
  path,
  locale,
  title,
  description,
  images = [DEFAULT_OG_IMAGE],
}: PageMetaInput): Metadata {
  const canonical = localeHref(path, locale);

  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [hreflang[l], localeHref(path, l)]),
  );
  // Für Sucher ohne passende Sprachfassung: die deutsche Hauptseite.
  languages['x-default'] = localeHref(path, defaultLocale);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: canonical,
      title,
      description,
      locale: OG_LOCALE[locale],
      images: images.map((url) => ({ url })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export { SITE_URL };
