/**
 * JSON-LD-Fabriken (schema.org).
 *
 * Strukturierte Daten sind der Haupthebel dafür, dass Suchmaschinen UND
 * Sprachmodelle (ChatGPT, Perplexity, Google AI Overviews) die Marke, die
 * Objekte und die Region als Entitäten verstehen und korrekt zitieren.
 *
 * Bewusste Entscheidung: KEINE selbst vergebene `aggregateRating`/`review`.
 * Google ignoriert self-serving Bewertungen auf der eigenen Seite; Sterne
 * müssen extern (Google Business Profile, Airbnb) entstehen. Das im Datensatz
 * vorhandene `rating` bleibt deshalb aus dem Schema heraus.
 */
import type { RetreatCard } from '@/data/retreats';
import { LEGAL_ENTITY, LOCATION, SAME_AS, SITE_NAME, SITE_URL, absoluteUrl } from './config';

type Json = Record<string, unknown>;

const postalAddress = (): Json => ({
  '@type': 'PostalAddress',
  streetAddress: LEGAL_ENTITY.street,
  postalCode: LEGAL_ENTITY.postalCode,
  addressLocality: LEGAL_ENTITY.city,
  addressCountry: LEGAL_ENTITY.country,
});

const geo = (): Json => ({
  '@type': 'GeoCoordinates',
  latitude: LOCATION.latitude,
  longitude: LOCATION.longitude,
});

/** Sitewide-Anker: die Marke als Organisation, verankert über sameAs. */
export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_ENTITY.name,
    url: SITE_URL,
    email: LEGAL_ENTITY.email,
    telephone: LEGAL_ENTITY.telephone,
    address: postalAddress(),
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

/** Die Website selbst — verknüpft Seiten mit der Organisation. */
export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['de', 'en', 'ar', 'zh-Hans'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

const amenities = (list: string[]): Json[] =>
  list.map((name) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value: true,
  }));

/**
 * Eine Unterkunft als LodgingBusiness + eingebettete VacationRental.
 * `path` ist die bereits lokalisierte Objekt-URL (mit Sprach-Präfix).
 */
export function lodgingSchema(retreat: RetreatCard, path: string): Json {
  const url = absoluteUrl(path);
  const images = [retreat.image, ...(retreat.gallery ?? [])]
    .filter(Boolean)
    .map((src) => absoluteUrl(src));

  return {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'VacationRental'],
    '@id': `${url}#lodging`,
    name: `${retreat.name} · ${SITE_NAME}`,
    description: retreat.shortDescription,
    url,
    ...(images.length ? { image: images } : {}),
    address: postalAddress(),
    geo: geo(),
    telephone: LEGAL_ENTITY.telephone,
    email: LEGAL_ENTITY.email,
    numberOfRooms: retreat.bedrooms,
    petsAllowed: retreat.amenities.some((a) => /hund|pet|dog/i.test(a)),
    ...(retreat.amenities.length ? { amenityFeature: amenities(retreat.amenities) } : {}),
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'https://schema.org/Apartment',
      numberOfBedrooms: retreat.bedrooms,
      numberOfBathroomsTotal: retreat.bathrooms,
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: retreat.maxGuests,
        unitText: 'guests',
      },
    },
    ...(retreat.airbnbUrl ? { sameAs: [retreat.airbnbUrl] } : {}),
    isPartOf: { '@id': `${SITE_URL}/#organization` },
  };
}

export interface Crumb {
  name: string;
  /** Bereits lokalisierter Pfad. */
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/**
 * Region/Ort als TouristDestination — verknüpft die Marke mit den Entitäten,
 * nach denen tatsächlich gesucht wird (Nationalpark, Thermen, Baumwipfelpfad).
 */
export function touristDestinationSchema(name: string, description: string, attractions: string[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    geo: geo(),
    address: {
      '@type': 'PostalAddress',
      addressLocality: LOCATION.city,
      addressRegion: LOCATION.region,
      addressCountry: LOCATION.country,
    },
    ...(attractions.length
      ? {
          includesAttraction: attractions.map((a) => ({
            '@type': 'TouristAttraction',
            name: a,
          })),
        }
      : {}),
  };
}
