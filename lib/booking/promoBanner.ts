/**
 * Server-Helfer fürs Startseiten-Banner: liefert Code + Prozent, wenn im
 * Cookie ein aktuell gültiger Rabattcode liegt (sonst null).
 */
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/env';
import { fetchSettings } from './db';
import { PROMO_COOKIE, promoMatches } from './pricing';

export async function getPromoBannerData(): Promise<{ code: string; percent: number } | null> {
  if (!supabaseConfigured()) return null;
  try {
    const store = await cookies();
    const code = store.get(PROMO_COOKIE)?.value;
    if (!code) return null;

    const sb = await createClient();
    const settings = await fetchSettings(sb);
    if (!promoMatches(settings, code)) return null;
    return { code: settings.promo.code.trim().toUpperCase(), percent: settings.promo.percent };
  } catch {
    return null;
  }
}
