/**
 * Server-seitiger Locale-Zugriff.
 * Nur in Server-Komponenten / generateMetadata verwenden.
 *
 * Quelle ist der Header `x-locale`, den die Middleware aus dem URL-Präfix
 * ableitet — die Sprache hängt damit eindeutig an der URL und ist für
 * Suchmaschinen sichtbar. Das Cookie NEXT_LOCALE bleibt als Fallback für die
 * Pfade ohne Sprach-Präfix (Buchung, Konto, Admin), die die Middleware
 * bewusst nicht anfasst.
 */
import { cookies, headers } from 'next/headers';
import { STRINGS } from './strings';
import { isLocale, defaultLocale, type Locale } from './config';

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromUrl = h.get('x-locale');
  if (isLocale(fromUrl)) return fromUrl;

  const c = await cookies();
  const fromCookie = c.get('NEXT_LOCALE')?.value;
  return isLocale(fromCookie) ? fromCookie : defaultLocale;
}

export async function getStrings() {
  return STRINGS[await getLocale()];
}
