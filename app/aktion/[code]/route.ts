/**
 * QR-Einstieg vom Pappaufsteller: /aktion/BFR10 prüft den Code, merkt ihn
 * als Cookie und leitet auf die Startseite (dort bestätigt ein Banner den
 * aktiven Rabatt). Ungültige Codes leiten kommentarlos auf die Startseite.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/env';
import { fetchSettings } from '@/lib/booking/db';
import { PROMO_COOKIE, promoMatches } from '@/lib/booking/pricing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).trim().toUpperCase();
  const home = new URL('/', req.url);

  if (!supabaseConfigured() || !code || code.length > 40) {
    return NextResponse.redirect(home);
  }

  try {
    const sb = await createClient();
    const settings = await fetchSettings(sb);
    if (!promoMatches(settings, code)) return NextResponse.redirect(home);

    const res = NextResponse.redirect(home);
    res.cookies.set(PROMO_COOKIE, code, {
      maxAge: 60 * 60 * 24 * 180,
      sameSite: 'lax',
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.redirect(home);
  }
}
