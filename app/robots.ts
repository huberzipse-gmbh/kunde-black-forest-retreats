import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';

/**
 * robots.txt
 *
 * Bewusst offen für alle Crawler, inklusive der KI-Bots (GPTBot, ClaudeBot,
 * PerplexityBot, OAI-SearchBot …). Für eine Marketing-Website IST der Text die
 * Werbung: wer KI-Crawler aussperrt, verliert nur Sichtbarkeit in ChatGPT,
 * Perplexity und Google AI Overviews. Die Blocking-Debatte ist eine Verlags-,
 * keine Marketing-Debatte. `User-agent: *` deckt sie alle ab, deshalb keine
 * Einzelregeln: jeder überflüssige Block wäre nur eine zusätzliche Fehlerquelle.
 *
 * Gesperrt wird nur, was nicht in den Index gehört: API, Admin, Buchungsstrecke,
 * Konto und der Supabase-Proxy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin',
        '/buchen/',
        '/buchung/',
        '/konto',
        '/aktion/',
        '/auth/',
        '/rest/',
        '/storage/',
        '/realtime/',
        '/functions/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
