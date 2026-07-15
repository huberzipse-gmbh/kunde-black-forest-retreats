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

/**
 * next/image erlaubt externe Hosts nur per remotePatterns. Storage-Bilder
 * kommen je nach Kontext vom Kong-Host (Server, getPublicUrl mit
 * SUPABASE_INTERNAL_URL) oder von der Public-URL (Browser/Proxy). Ohne
 * diese Freigabe wirft der SSR-Render "Invalid src prop" und die ganze
 * Startseite (inkl. Hero-Video-Markup) fällt auf die Error-Shell zurück.
 */
const supabaseImageHosts = Array.from(
  new Set(
    [process.env.SUPABASE_INTERNAL_URL, process.env.NEXT_PUBLIC_SUPABASE_URL].filter(
      (u): u is string => Boolean(u)
    )
  )
).map((u) => new URL("/storage/v1/object/public/**", u));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImageHosts,
    // Next 16 liefert per Default nur WebP. AVIF zuerst (20-30 % kleiner),
    // WebP als Fallback. Reihenfolge = Priorität beim Accept-Header.
    formats: ["image/avif", "image/webp"],
    // In Next 16 Pflichtfeld; ohne erlaubte Liste wären beliebig viele
    // Optimierungs-Varianten erzwingbar (Angriffsfläche).
    qualities: [75],
    // On-Demand-Optimierung ist teuer auf dem kleinen Server; optimierte
    // Bilder länger cachen statt bei jedem Aufruf neu zu rechnen.
    minimumCacheTTL: 2678400, // 31 Tage
  },
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
