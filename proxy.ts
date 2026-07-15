/**
 * Proxy (Next 16, Nachfolger der middleware.ts). Zwei Aufgaben:
 *
 *  1. Admin-Schutz: ohne gültiges HMAC-Session-Cookie zurück auf /admin/login.
 *  2. Sprach-Routing: jede Sprache bekommt eine eigene, indexierbare URL, OHNE
 *     das app-Verzeichnis umzubauen (dort liegen Buchungsstrecke, Stripe und
 *     Admin — die bleiben unangetastet).
 *
 *       /en/umgebung  → rendert intern /umgebung, Sprache steckt im Header x-locale
 *       /umgebung     → Deutsch (Default, bleibt auf der bestehenden URL)
 *       /de/umgebung  → 308 auf /umgebung (kein doppelter Index-Eintrag)
 *
 *     Vorher lief die Sprachwahl nur über das Cookie NEXT_LOCALE. Googlebot
 *     crawlt ohne Cookie und sah deshalb ausschließlich Deutsch — en/ar/zh
 *     waren faktisch nicht indexierbar. Eigene URLs sind Googles empfohlene
 *     Lösung.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin/session';
import { defaultLocale, isLocale, isUnprefixed, type Locale } from '@/lib/i18n/config';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Admin-Schutz (unverändert) ──────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await verifyAdminToken(token))) {
      const login = new URL('/admin/login', request.url);
      return NextResponse.redirect(login);
    }
  }

  // ── 2. Sprach-Routing (nur Marketing-Pfade) ────────────────────
  // Buchung, Konto, Admin, API und der Supabase-Proxy laufen unverändert durch.
  if (isUnprefixed(pathname)) return NextResponse.next();

  const [, first, ...rest] = pathname.split('/');
  const tail = `/${rest.join('/')}`.replace(/\/$/, '') || '/';

  // /de/... ist ein Duplikat der Root-URL → dauerhaft auf die kanonische Form.
  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = tail;
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(request.headers);

  if (isLocale(first)) {
    // Ein Sprach-Präfix vor einem eigentlich präfixlosen Pfad (/en/gutschein)
    // wäre ein Duplikat der Buchungsstrecke → dauerhaft auf die kanonische,
    // präfixlose Form.
    if (isUnprefixed(tail)) {
      const url = request.nextUrl.clone();
      url.pathname = tail;
      return NextResponse.redirect(url, 308);
    }
    // Sprach-Präfix: Präfix abschneiden und die bestehende Route rendern.
    const locale: Locale = first;
    const url = request.nextUrl.clone();
    url.pathname = tail;
    headers.set('x-locale', locale);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // Kein Präfix → Deutsch. Der Header macht die Sprache für Server-Komponenten
  // eindeutig, statt sie wie bisher aus dem Cookie zu raten.
  headers.set('x-locale', defaultLocale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Alles außer Next-Interna und Dateien mit Endung (Bilder, Videos, robots.txt …).
  matcher: ['/((?!_next/|.*\\.[\\w]+$).*)'],
};
