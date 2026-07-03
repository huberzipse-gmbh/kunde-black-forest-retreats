/**
 * Supabase Server-Client (Server Components, Route Handlers, Server Actions).
 * Nutzt den Cookie-Store von next/headers.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  // Server spricht Supabase direkt an (interne URL), nicht über den
  // Browser-Proxy — spart den Traefik-Umweg und funktioniert ohne HTTPS.
  return createServerClient(
    process.env.SUPABASE_INTERNAL_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll aus einer Server Component aufgerufen — kann ignoriert werden,
            // wenn Sessions über Middleware aktualisiert werden.
          }
        },
      },
    },
  );
}
