import type { NextConfig } from "next";

/**
 * Supabase-Proxy: Die Website läuft über HTTPS, die self-hosted Supabase-
 * Instanz (Coolify) aktuell über HTTP. Damit der Browser (Gast-Login/-Register,
 * Storage-Bilder) nicht am Mixed-Content-Block scheitert, laufen die
 * Supabase-Pfade same-origin über die eigene Domain und werden hier
 * server-seitig an Kong weitergereicht. Server-Clients sprechen Supabase
 * weiterhin direkt an (SUPABASE_INTERNAL_URL).
 */
const kong = process.env.SUPABASE_INTERNAL_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!kong) return [];
    const paths = ["auth", "rest", "storage", "realtime", "functions"];
    return paths.map((p) => ({
      source: `/${p}/v1/:path*`,
      destination: `${kong}/${p}/v1/:path*`,
    }));
  },
};

export default nextConfig;
