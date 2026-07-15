/**
 * Zentrale SEO-Stammdaten — die einzige Quelle für Domain, Anbieter, NAP
 * (Name/Adresse/Telefon) und Social-Profile.
 *
 * NAP muss über Website, Google Business Profile, Airbnb und alle Verzeichnisse
 * hinweg zeichengleich sein, sonst zerfällt das lokale Ranking. Deshalb steht es
 * hier einmal und wird von Schema.org, Sitemap und Metadata gemeinsam genutzt.
 * Die Werte stammen aus dem Impressum (app/(marketing)/impressum/page.tsx).
 */

/** Produktions-Domain, ohne abschließenden Slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blackforest-retreats.de'
).replace(/\/$/, '');

export const SITE_NAME = 'Black Forest Retreats';

/** Betreibergesellschaft laut Impressum. */
export const LEGAL_ENTITY = {
  name: 'Axiecentro Germany GmbH',
  street: 'Hockenheimer Straße 6',
  postalCode: '68723',
  city: 'Oftersheim',
  country: 'DE',
  email: 'blackforestretreats@gmail.com',
  telephone: '+49 160 3756052',
} as const;

/** Standort der Unterkünfte (nicht der Firmensitz) — Basis für LocalBusiness/Geo. */
export const LOCATION = {
  city: 'Neuenbürg',
  postalCode: '75305',
  region: 'Baden-Württemberg',
  country: 'DE',
  /** Ortsmitte Neuenbürg. Objektgenaue Koordinaten sobald die Adressen bestätigt sind. */
  latitude: 48.84639,
  longitude: 8.59944,
} as const;

/**
 * Profile, die dieselbe Entität beschreiben. Speist `sameAs` im Organization-
 * Schema und verankert die Marke für Suchmaschinen und LLMs.
 * Nur bestätigte URLs eintragen — ein falscher sameAs-Link schadet mehr als keiner.
 */
export const SAME_AS: string[] = [];

/** Vollständige URL zu einem Pfad ("/wohnungen/x" → "https://.../wohnungen/x"). */
export const absoluteUrl = (path: string): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
