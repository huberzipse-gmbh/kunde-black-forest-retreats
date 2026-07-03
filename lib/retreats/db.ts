import 'server-only';

/**
 * DB-gestützte Unterkünfte (Server-only).
 *
 * Lesestrategie:
 *  - Supabase konfiguriert → Rows aus der DB; Struktur/Preise/Flags gewinnen
 *    IMMER aus der DB (Admin-Änderungen wirken sofort).
 *  - Für geseedete Retreats (is_seeded) kommt der lokalisierte TEXT weiter aus
 *    lib/strings/<locale>.ts (retreatsContent) — wie bisher.
 *  - Neu angelegte Retreats: deutscher DB-Text in allen Sprachen (Fallback).
 *  - Supabase NICHT konfiguriert → statisches data/retreats.ts (Website
 *    bricht nie).
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  localizeRetreats,
  getLocalizedRetreat,
  retreats as staticRetreats,
  type RetreatCard,
} from '@/data/retreats';
import type { Strings } from '@/lib/strings/de';
import { STRINGS } from '@/lib/i18n/strings';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/env';
import type { CardAccent } from '@/components/sections/ApartmentCard';
import type { GradientVariant } from '@/components/ui/GradientPanel';
import type { UspIconKey } from '@/components/sections/retreat/UspIcons';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface DbUsp {
  icon: string;
  title_de: string;
  text_de?: string;
}

/** DB-Row + lokalisierter Text → RetreatCard (die Form, die die UI konsumiert). */
function mapRow(row: any, t: Strings): RetreatCard {
  const seededContent = row.is_seeded ? t.retreatsContent[row.id] : undefined;
  const staticStruct = staticRetreats.find((r) => r.id === row.id);
  const dbUsps: DbUsp[] = Array.isArray(row.usps) ? row.usps : [];

  const rating: string = row.rating
    ? String(row.rating).replace(/[.,]/, t.formats.decimal)
    : '';

  const base = {
    id: row.id as string,
    slug: row.slug as string,
    year: row.year || undefined,
    image: row.image ?? '',
    gallery: (row.gallery ?? []) as string[],
    beds: row.beds as number,
    bathrooms: row.bathrooms as number,
    rating: rating || undefined,
    reviewCount: row.review_count ?? undefined,
    superhost: row.superhost || undefined,
    guestFavorite: row.guest_favorite || undefined,
    exclusive: row.exclusive || undefined,
    featured: row.featured || undefined,
    heritage: row.heritage || undefined,
    soldOut: row.sold_out || undefined,
    soldOutUntil: row.sold_out_until || undefined,
    accent: (row.accent || undefined) as CardAccent | undefined,
    variant: (row.variant || undefined) as GradientVariant | undefined,
    maxGuests: row.max_guests as number,
    bedrooms: row.bedrooms as number,
    basePriceCents: row.base_price_cents as number,
    cleaningFeeCents: row.cleaning_fee_cents as number,
    minNights: row.min_nights as number,
    bookable: Boolean(row.bookable) && !row.sold_out,
    images: [] as string[],
    // Bewusst NICHT ausliefern: Die Website verweist nirgends auf Airbnb —
    // die URL bleibt reine Admin-/Sync-Information (RetreatEditor lädt die Row direkt).
    airbnbUrl: undefined,
  };

  if (seededContent) {
    // Geseedet: Struktur/Preise/Flags kommen IMMER aus der DB. Beim Text gilt:
    // ADMIN GEWINNT. Weicht der deutsche DB-Text vom ursprünglichen Seed ab,
    // wurde er im Admin bearbeitet → DB-Text in allen Sprachen anzeigen
    // (Übersetzung wäre sonst veraltet). Unverändert → Übersetzung aus strings.
    const deSeed = STRINGS.de.retreatsContent[row.id];
    const pick = (dbVal: string, seedVal: string | undefined, localized: string) =>
      dbVal && dbVal !== (seedVal ?? '') ? dbVal : localized;

    const amenitiesEdited =
      JSON.stringify(row.amenities_de ?? []) !== JSON.stringify(deSeed?.amenities ?? []);

    return {
      ...base,
      name: pick(row.name_de, deSeed?.name, seededContent.name),
      highlight: pick(row.highlight_de, deSeed?.highlight, seededContent.highlight),
      tagline: pick(row.tagline_de, deSeed?.tagline, seededContent.tagline) || undefined,
      shortDescription: pick(
        row.short_description_de,
        deSeed?.shortDescription,
        seededContent.shortDescription,
      ),
      description: pick(row.description_de, deSeed?.description, seededContent.description),
      usps: dbUsps.map((u, i) => {
        const seedUsp = deSeed?.usps[i];
        const edited =
          u.title_de !== (seedUsp?.title ?? '') || (u.text_de ?? '') !== (seedUsp?.text ?? '');
        return {
          icon: u.icon as UspIconKey,
          title: edited ? u.title_de : (seededContent.usps[i]?.title ?? u.title_de),
          text: edited ? u.text_de : (seededContent.usps[i]?.text ?? u.text_de),
        };
      }),
      reviews: staticStruct?.reviews?.map((rv, i) => ({
        author: rv.author,
        date: seededContent.reviews[i]?.date ?? '',
        text: seededContent.reviews[i]?.text ?? '',
      })),
      amenities: amenitiesEdited
        ? ((row.amenities_de ?? []) as string[])
        : seededContent.amenities,
    };
  }

  // Neu angelegt: deutscher DB-Text in allen Sprachen.
  return {
    ...base,
    name: row.name_de,
    highlight: row.highlight_de ?? '',
    tagline: row.tagline_de || undefined,
    shortDescription: row.short_description_de ?? '',
    description: row.description_de ?? '',
    usps: dbUsps.map((u) => ({
      icon: u.icon as UspIconKey,
      title: u.title_de,
      text: u.text_de,
    })),
    reviews: undefined,
    amenities: (row.amenities_de ?? []) as string[],
  };
}

async function fetchRows(sb: SupabaseClient): Promise<any[] | null> {
  const { data, error } = await sb
    .from('retreats')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('[retreats/db] Supabase-Fehler, statischer Fallback:', error.message);
    return null;
  }
  return data ?? [];
}

/** Alle Unterkünfte (DB, sonst statischer Fallback). */
export async function getRetreatCards(t: Strings): Promise<RetreatCard[]> {
  if (!supabaseConfigured()) return localizeRetreats(t);
  const sb = await createClient();
  const rows = await fetchRows(sb);
  if (!rows || rows.length === 0) return localizeRetreats(t);
  return rows.map((row) => mapRow(row, t));
}

/** Eine Unterkunft per Slug (DB, sonst statischer Fallback). */
export async function getRetreatCardBySlug(
  slug: string,
  t: Strings,
): Promise<RetreatCard | undefined> {
  if (!supabaseConfigured()) return getLocalizedRetreat(slug, t);
  const sb = await createClient();
  const { data, error } = await sb
    .from('retreats')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('[retreats/db] Supabase-Fehler, statischer Fallback:', error.message);
    return getLocalizedRetreat(slug, t);
  }
  if (!data) return undefined;
  return mapRow(data, t);
}
