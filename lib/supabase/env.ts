/**
 * Supabase-Umgebungs-Check: Ist die Datenbank konfiguriert?
 * Buchungs-/Admin-Seiten zeigen ohne Konfiguration einen freundlichen
 * Hinweis statt zu crashen; Marketing-Seiten fallen auf die statischen
 * Daten aus data/retreats.ts zurück.
 */
export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Service-Role zusätzlich vorhanden (für Server Actions / Admin)? */
export function supabaseAdminConfigured(): boolean {
  return supabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
