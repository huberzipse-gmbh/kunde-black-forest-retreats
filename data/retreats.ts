/**
 * Unsere aktuellen Unterkünfte — strukturelle Daten (Fotos, Eckdaten, Flags).
 * Aller nutzersichtbare TEXT (Name, Highlight, Beschreibung, USPs, Reviews,
 * Ausstattung) liegt in lib/strings/<locale>.ts unter `retreatsContent[id]`
 * und wird hier über `localizeRetreats(t)` / `getLocalizedRetreat(slug, t)`
 * pro Sprache zu vollständigen `RetreatCard`-Objekten gemergt.
 * Skaliert langfristig auf 10–20 Wohnungen.
 */
import type { Retreat } from '@/lib/booking/types';
import type { GradientVariant } from '@/components/ui/GradientPanel';
import type { UspIconKey } from '@/components/sections/retreat/UspIcons';
import type { CardAccent } from '@/components/sections/ApartmentCard';
import type { Strings } from '@/lib/strings/de';

/**
 * Strukturelle Felder einer Unterkunft (sprachunabhängig). Der lokalisierte
 * Text (name/highlight/usps[].title … ) wird beim Mergen ergänzt.
 */
export interface RetreatStruct
  extends Omit<
    Retreat,
    'name' | 'shortDescription' | 'description' | 'amenities' | 'minNights'
  > {
  /** Mindestaufenthalt in Nächten (DB-gepflegt; statisch default 2). */
  minNights?: number;
  /** Direkt buchbar über unser Portal (DB-gepflegt). */
  bookable?: boolean;
  image: string;        // Cover-Foto ('' → Mockup-Verlauf, bis ein Foto da ist)
  gallery: string[];    // Galerie für die Detailseite
  beds: number;
  bathrooms: number;
  /** Geschätztes Baujahr (vorläufig, bis die genauen Zahlen vorliegen). */
  year?: string;
  rating?: string;      // z. B. "4,91"
  reviewCount?: number; // Anzahl Bewertungen
  superhost?: boolean;
  guestFavorite?: boolean;
  /** Akzentfarbe für Rahmen + Tag (pro Unterkunft eine andere). */
  accent?: CardAccent;
  /** USP-Highlights: nur das Icon ist strukturell, Titel/Text aus den Strings. */
  usps?: { icon: UspIconKey }[];
  /** Gäste-Stimmen: nur der Name ist strukturell, Datum/Text aus den Strings. */
  reviews?: { author: string }[];
  exclusive?: boolean;
  /** Ausgebucht-Unterkunft: blurred Bild + „Ausgebucht bis <Jahr>". */
  soldOut?: boolean;
  soldOutUntil?: string; // z. B. "2027"
  /** Besonders hervorgehoben (eigener Akzent), z. B. The Postal Office. */
  featured?: boolean;
  /** Denkmalgeschütztes Gebäude → eigener Tag auf der Karte. */
  heritage?: boolean;
  /** Mockup-Verlauf, solange kein echtes Foto (`image`) gesetzt ist. */
  variant?: GradientVariant;
}

/** Vollständige Unterkunft (Struktur + lokalisierter Text) — die Form, die Komponenten konsumieren. */
export interface RetreatCard extends RetreatStruct {
  name: string;
  highlight: string;
  tagline?: string;
  shortDescription: string;
  description: string;
  usps?: { icon: UspIconKey; title: string; text?: string }[];
  reviews?: { author: string; date: string; text: string }[];
  amenities: string[];
}

const penthouseGallery = Array.from(
  { length: 9 },
  (_, i) => `/images/wohnungen/penthouse/${String(i + 1).padStart(2, '0')}.jpg`,
);
const fachwerkGallery = Array.from(
  { length: 9 },
  (_, i) => `/images/wohnungen/fachwerk/${String(i + 1).padStart(2, '0')}.jpg`,
);

export const retreats: RetreatStruct[] = [
  {
    id: 'black-forest-penthouse',
    slug: 'black-forest-penthouse',
    year: '1900',
    image: penthouseGallery[0],
    gallery: penthouseGallery,
    exclusive: true,
    accent: 'brass',
    rating: '4,89',
    reviewCount: 100,
    superhost: true,
    guestFavorite: true,
    usps: [{ icon: 'castle' }, { icon: 'key' }, { icon: 'parking' }, { icon: 'sparkle' }],
    reviews: [{ author: 'Sarah' }, { author: 'Michael' }, { author: 'Jana' }],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    images: [],
    airbnbUrl: 'https://www.airbnb.de/rooms/1109938710053146548',
  },
  {
    id: 'fachwerk-apartment',
    slug: 'fachwerk-apartment',
    year: '1750',
    image: fachwerkGallery[0],
    gallery: fachwerkGallery,
    exclusive: true,
    accent: 'bark',
    rating: '4,87',
    reviewCount: 52,
    superhost: true,
    usps: [{ icon: 'castle' }, { icon: 'beams' }, { icon: 'bath' }, { icon: 'wifi' }],
    reviews: [{ author: 'Lena' }, { author: 'Daniel' }, { author: 'Christine' }],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    images: [],
    airbnbUrl: 'https://www.airbnb.de/rooms/1694207599638836907',
  },

  // ── Weitere Häuser (ausgebucht); Foto wird per CSS geblurrt dargestellt. ──
  {
    id: 'riverhouse',
    slug: 'riverhouse',
    year: '1920',
    image: '/images/wohnungen/riverhouse/01.webp',
    gallery: [],
    variant: 'moss',
    soldOut: true,
    soldOutUntil: '2027',
    accent: 'forest',
    rating: '4,88',
    reviewCount: 38,
    usps: [{ icon: 'waves' }, { icon: 'group' }, { icon: 'kitchen' }, { icon: 'wifi' }],
    reviews: [{ author: 'Familie K.' }, { author: 'Andreas' }],
    maxGuests: 10,
    bedrooms: 8,
    beds: 8,
    bathrooms: 3,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    images: [],
  },
  {
    id: 'the-raccoon-house',
    slug: 'the-raccoon-house',
    year: '1820',
    image: '/images/wohnungen/raccoon-house/01.webp',
    gallery: [],
    variant: 'bark',
    soldOut: true,
    soldOutUntil: '2027',
    heritage: true,
    accent: 'caramel',
    rating: '4,82',
    reviewCount: 44,
    usps: [{ icon: 'location' }, { icon: 'stairs' }, { icon: 'kitchen' }, { icon: 'wifi' }],
    reviews: [{ author: 'Petra' }, { author: 'Thomas' }],
    maxGuests: 6,
    bedrooms: 4,
    beds: 5,
    bathrooms: 2,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    images: [],
  },
  {
    id: 'the-postal-office',
    slug: 'the-postal-office',
    year: '1895',
    image: '/images/wohnungen/postal-office/01.webp',
    gallery: [],
    variant: 'night',
    soldOut: true,
    soldOutUntil: '2028',
    heritage: true,
    accent: 'gold',
    rating: '4,86',
    reviewCount: 26,
    usps: [{ icon: 'building' }, { icon: 'group' }, { icon: 'arch' }, { icon: 'kitchen' }],
    reviews: [{ author: 'Markus' }, { author: 'Verein H.' }],
    maxGuests: 20,
    bedrooms: 10,
    beds: 15,
    bathrooms: 5,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    images: [],
  },
  {
    id: 'grey-fox',
    slug: 'grey-fox',
    year: '1850',
    image: '',
    gallery: [],
    variant: 'moss',
    soldOut: true,
    soldOutUntil: '2028',
    heritage: true,
    accent: 'forest',
    rating: '4,74',
    reviewCount: 19,
    usps: [{ icon: 'location' }, { icon: 'beams' }, { icon: 'kitchen' }, { icon: 'wifi' }],
    reviews: [{ author: 'Nicolas' }, { author: 'Sophie' }],
    maxGuests: 5,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    images: [],
  },
];

/** Schlanke Slug-Liste für generateStaticParams (kein Text/keine Strings nötig). */
export const retreatSlugs = retreats.map((r) => r.slug);

/** Struktur + lokalisierter Text (per Index) → vollständige RetreatCard. */
function mergeRetreat(r: RetreatStruct, t: Strings): RetreatCard {
  const c = t.retreatsContent[r.id];
  return {
    ...r,
    // Bewertung mit Locale-Dezimaltrennzeichen (de „4,91" / en „4.91").
    rating: r.rating ? r.rating.replace(/[.,]/, t.formats.decimal) : r.rating,
    name: c.name,
    highlight: c.highlight,
    tagline: c.tagline,
    shortDescription: c.shortDescription,
    description: c.description,
    usps: r.usps?.map((u, i) => ({
      icon: u.icon,
      title: c.usps[i]?.title ?? '',
      text: c.usps[i]?.text,
    })),
    reviews: r.reviews?.map((rv, i) => ({
      author: rv.author,
      date: c.reviews[i]?.date ?? '',
      text: c.reviews[i]?.text ?? '',
    })),
    amenities: c.amenities,
  };
}

export const localizeRetreats = (t: Strings): RetreatCard[] =>
  retreats.map((r) => mergeRetreat(r, t));

export const getLocalizedRetreat = (
  slug: string,
  t: Strings,
): RetreatCard | undefined => {
  const r = retreats.find((x) => x.slug === slug);
  return r ? mergeRetreat(r, t) : undefined;
};
