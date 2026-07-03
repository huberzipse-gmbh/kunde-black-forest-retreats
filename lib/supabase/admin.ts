import 'server-only';

/**
 * Supabase Admin-Client (Service-Role, umgeht RLS).
 * NUR in Server Actions / Route Handlers verwenden — nie an den Client leaken.
 * Alle Schreibzugriffe der App (Buchungen, Rechnungen, Admin) laufen hierüber.
 */
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_INTERNAL_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase ist nicht konfiguriert: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in .env.local setzen.',
    );
  }
  cached = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
