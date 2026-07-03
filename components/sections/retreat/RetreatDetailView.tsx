"use client";

import Image from "next/image";
import Link from "next/link";
import type { RetreatCard } from "@/data/retreats";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { GradientPanel } from "@/components/ui/GradientPanel";
import { ApartmentMeta } from "@/components/sections/ApartmentMeta";
import { RetreatGallery } from "@/components/sections/retreat/RetreatGallery";
import { RetreatAmenities } from "@/components/sections/retreat/RetreatAmenities";
import {
  RetreatHighlights,
  RetreatReviews,
  Stars,
} from "@/components/sections/retreat/RetreatSections";

export function RetreatDetailView({ retreat }: { retreat: RetreatCard }) {
  const strings = useStrings();
  const t = strings.apartments;
  const locale = useLocale();
  const sold = Boolean(retreat.soldOut);
  // Direktbuchung über unser Portal (statischer Fallback: buchbar, wenn nicht ausgebucht).
  const bookable = !sold && (retreat.bookable ?? true);
  const untilLabel =
    sold && retreat.soldOutUntil
      ? fmtNum(t.soldOut.until(retreat.soldOutUntil), locale)
      : null;
  const reviewCount = retreat.reviewCount ?? retreat.reviews?.length ?? 0;

  const stats = [
    { n: retreat.bedrooms, l: t.facts.bedrooms },
    { n: retreat.beds, l: t.facts.beds },
    { n: retreat.bathrooms, l: t.facts.bathrooms },
    { n: retreat.maxGuests, l: t.facts.guests },
  ];

  return (
    <article className="relative">
      {/* Fixierter Hintergrund — das Bild bleibt beim Scrollen stehen. */}
      <div className="fixed inset-0 -z-10 bg-night">
        {retreat.image ? (
          <Image
            src={retreat.image}
            alt={retreat.name}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${sold ? "scale-105 blur-[3px]" : ""}`}
          />
        ) : (
          <GradientPanel
            variant={retreat.variant ?? "forest"}
            pattern
            monogram={retreat.name.charAt(0)}
            className="absolute inset-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/25 to-night/45" />
      </div>

      {/* Hero — transparent, gibt den Blick aufs fixierte Bild frei. */}
      <section className="relative flex min-h-[92svh] items-end text-cream-50">
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
          <Link
            href="/#apartments"
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/80 transition-colors hover:text-cream-50"
          >
            <span aria-hidden className="inline-block rtl:rotate-180">
              &larr;
            </span>{" "}
            {t.detail.back}
          </Link>

          <Type role="eyebrow" className="mt-8 text-brass-300">
            {retreat.highlight}
          </Type>
          <Type role="display" as="h1" className="mt-4 max-w-3xl text-cream-50">
            {retreat.name}
          </Type>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {retreat.rating && (
              <span className="inline-flex items-center gap-2">
                <Stars className="h-4 w-4" />
                <span className="font-body text-sm text-cream-100/90">
                  {fmtNum(t.detail.ratingLine(retreat.rating, reviewCount), locale)}
                </span>
              </span>
            )}
            {retreat.guestFavorite && (
              <span className="rounded-full border border-brass-300/60 bg-night/30 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brass-300 backdrop-blur-sm">
                {t.detail.guestFavorite}
              </span>
            )}
            {untilLabel && (
              <span className="rounded-full border border-cream-50/40 bg-night/45 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream-50 backdrop-blur-sm">
                {untilLabel}
              </span>
            )}
            {retreat.heritage && (
              <span className="rounded-full border border-cream-50/40 bg-night/35 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {t.heritage}
              </span>
            )}
            {retreat.year && (
              <span className="font-body text-sm text-cream-100/80">
                {t.detail.built} {retreat.year}
              </span>
            )}
          </div>

          <ApartmentMeta
            bedrooms={retreat.bedrooms}
            beds={retreat.beds}
            guests={retreat.maxGuests}
            bathrooms={retreat.bathrooms}
            className="mt-7 text-cream-100/90"
          />

          {bookable && (
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={`/buchen/${retreat.slug}`}
                className="inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300"
              >
                {t.detail.book}
              </Link>
              {retreat.airbnbUrl && (
                <a
                  href={retreat.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[3px] border border-cream-50/40 px-6 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50 transition-colors duration-300 hover:bg-cream-50/10"
                >
                  {strings.bookingFlow.alsoOnAirbnb}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Inhalt scrollt über das fixierte Bild. */}
      <div className="relative">
        <RetreatHighlights usps={retreat.usps ?? []} />

        <RetreatGallery images={retreat.gallery} name={retreat.name} />

        {/* Überblick: Beschreibung + Eckdaten */}
        <section className="bg-cream-50 px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <Type role="eyebrow" className="text-brass-600">
                {t.detail.overview}
              </Type>
              <Type role="h2" as="h2" className="mt-4 text-forest-900">
                {t.detail.about}
              </Type>
              <div className="mt-6 h-px w-12 bg-brass-400" />
              <p className="mt-7 font-body text-base leading-relaxed text-forest-700/85">
                {retreat.description}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((s) => (
                  <div
                    key={s.l}
                    className="rounded-[6px] border border-forest-900/10 bg-cream-100 px-6 py-7 text-center"
                  >
                    <div className="font-display text-3xl leading-none text-forest-900 md:text-4xl">
                      {fmtNum(s.n, locale)}
                    </div>
                    <div className="mt-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] text-forest-700/70">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <RetreatAmenities amenities={retreat.amenities} />

        <RetreatReviews retreat={retreat} />

        {/* Abschluss: Ausgebucht-Hinweis ODER Buchungs-CTA */}
        {sold ? (
          <section className="relative bg-forest-900 px-6 py-24 text-center text-cream-50 md:py-32">
            <Reveal className="mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/35 bg-night/40 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50">
                {untilLabel ?? t.soldOut.badge}
              </span>
              <Type role="display" as="h2" className="mt-7 text-cream-50">
                {t.soldOut.detailTitle}
              </Type>
              <div className="mx-auto mt-7 h-px w-14 bg-brass-400" />
              <Type role="lead" className="mx-auto mt-7 max-w-xl text-cream-100/85">
                {retreat.soldOutUntil
                  ? fmtNum(t.soldOut.detailText(retreat.soldOutUntil), locale)
                  : ""}
              </Type>
              <div className="mt-10">
                <Link
                  href="/#apartments"
                  className="inline-flex items-center justify-center rounded-[3px] border border-cream-50/40 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50 transition-colors duration-300 hover:bg-cream-50 hover:text-night"
                >
                  {t.soldOut.detailCta}
                </Link>
              </div>
            </Reveal>
          </section>
        ) : (
          <section
            id="apartments"
            className="relative bg-forest-900 px-6 py-24 text-center text-cream-50 md:py-32"
          >
            <Reveal className="mx-auto max-w-2xl">
              <Type role="display" as="h2" className="text-cream-50">
                {t.detail.bookTitle}
              </Type>
              <div className="mx-auto mt-7 h-px w-14 bg-brass-400" />
              <Type role="lead" className="mx-auto mt-7 max-w-xl text-cream-100/85">
                {t.detail.bookText}
              </Type>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/buchen/${retreat.slug}`}
                  className="inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300"
                >
                  {t.detail.book}
                </Link>
                {retreat.airbnbUrl && (
                  <a
                    href={retreat.airbnbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[3px] border border-cream-50/40 px-6 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50 transition-colors duration-300 hover:bg-cream-50/10"
                  >
                    {strings.bookingFlow.alsoOnAirbnb}
                  </a>
                )}
              </div>
              <Type
                role="caption"
                className="mt-7 font-medium uppercase tracking-[0.18em] text-cream-100/55"
              >
                {t.detail.note}
              </Type>
            </Reveal>
          </section>
        )}
      </div>
    </article>
  );
}
