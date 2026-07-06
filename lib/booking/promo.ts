'use server';

/**
 * Rabattcode-Einlösung (Pappaufsteller/QR). Der eingelöste Code liegt in
 * einem Cookie und wird bei jeder Preisberechnung serverseitig gegen die
 * Einstellungen validiert — ein deaktivierter Code verfällt damit sofort.
 */
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/env';
import { fetchSettings } from './db';
import { PROMO_COOKIE, promoMatches } from './pricing';

const MAX_AGE = 60 * 60 * 24 * 180; // 180 Tage — der Aufsteller wirbt für den nächsten Stay.

export interface ApplyPromoResult {
  ok: boolean;
  /** Normalisierter Code (uppercase), wenn gültig. */
  code?: string;
  percent?: number;
  error?: 'invalid' | 'not-configured';
}

/** Code prüfen und bei Erfolg als Cookie merken. */
export async function applyPromoCode(raw: string): Promise<ApplyPromoResult> {
  if (!supabaseConfigured()) return { ok: false, error: 'not-configured' };
  const code = raw.trim().toUpperCase();
  if (!code || code.length > 40) return { ok: false, error: 'invalid' };

  const sb = await createClient();
  const settings = await fetchSettings(sb);
  if (!promoMatches(settings, code)) return { ok: false, error: 'invalid' };

  const store = await cookies();
  store.set(PROMO_COOKIE, code, { maxAge: MAX_AGE, sameSite: 'lax' });
  return { ok: true, code, percent: settings.promo.percent };
}

/** Eingelösten Code entfernen. */
export async function removePromoCode(): Promise<void> {
  const store = await cookies();
  store.delete(PROMO_COOKIE);
}

/** Gemerkten Code lesen (Validierung passiert in computeQuote). */
export async function getStoredPromoCode(): Promise<string | null> {
  const store = await cookies();
  return store.get(PROMO_COOKIE)?.value ?? null;
}
