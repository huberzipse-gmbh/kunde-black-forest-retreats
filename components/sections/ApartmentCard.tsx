"use client";

import Image from "next/image";
import Link from "next/link";
import type { RetreatCard } from "@/data/retreats";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";
import { Type } from "@/components/ui/Type";
import { GradientPanel } from "@/components/ui/GradientPanel";
import { ApartmentMeta } from "./ApartmentMeta";

/** Akzent-Farbe für Rahmen + Descriptor-Tag (pro Unterkunft eine andere). */
export type CardAccent = "brass" | "bark" | "forest" | "caramel" | "gold";

const ACCENTS: Record<CardAccent, { ring: string; tag: string }> = {
  brass: { ring: "ring-brass-400/80", tag: "bg-brass-400 text-night" },
  bark: { ring: "ring-bark-500/80", tag: "bg-bark-500 text-cream-50" },
  forest: { ring: "ring-forest-500/80", tag: "bg-forest-500 text-cream-50" },
  caramel: { ring: "ring-bark-300/90", tag: "bg-bark-300 text-night" },
  gold: { ring: "ring-brass-600/80", tag: "bg-brass-600 text-cream-50" },
};

interface ApartmentCardProps {
  retreat: RetreatCard;
  ctaLabel: string;
  exclusiveLabel: string;
  soldOutLabel: string;
  /** Bereits formatiert, z. B. „Ausgebucht bis 2027". */
  soldOutUntilLabel?: string;
  /** Label für denkmalgeschützte Gebäude, z. B. „Denkmalgeschützt". */
  heritageLabel: string;
  /** Standort-Hinweis, z. B. „Historische Altstadt". */
  oldTownLabel: string;
  /** Präfix fürs Baujahr, z. B. „Erbaut um". */
  builtLabel: string;
}

const CARD_CLASS =
  "group relative block h-[470px] w-[80vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[4px] shadow-[0_18px_50px_-24px_rgba(15,24,19,0.55)] ring-1 ring-offset-2 ring-offset-cream-100 transition-transform duration-500 hover:-translate-y-1.5 sm:w-[340px]";

const LockIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const LandmarkIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="M3 21h18" />
    <path d="M5 21V10l7-5 7 5v11" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export function ApartmentCard({
  retreat,
  ctaLabel,
  exclusiveLabel,
  soldOutLabel,
  soldOutUntilLabel,
  heritageLabel,
  oldTownLabel,
  builtLabel,
}: ApartmentCardProps) {
  const sold = Boolean(retreat.soldOut);
  const accent = ACCENTS[retreat.accent ?? "brass"];
  // Interne Links tragen die Sprache im Pfad (/en/wohnungen/... statt /wohnungen/...).
  const href = useLocaleHref();

  return (
    <Link
      href={href(`/wohnungen/${retreat.slug}`)}
      className={`${CARD_CLASS} ${accent.ring}`}
      aria-label={retreat.name}
    >
      {/* Medien: echtes Foto oder Mockup-Verlauf; bei „ausgebucht" geblurrt. */}
      {retreat.image ? (
        <Image
          src={retreat.image}
          alt={retreat.name}
          fill
          sizes="(max-width: 640px) 80vw, 340px"
          className={`object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.06] ${
            sold ? "scale-105 blur-[2px]" : ""
          }`}
        />
      ) : (
        <GradientPanel
          variant={retreat.variant ?? "forest"}
          pattern
          monogram={retreat.name.charAt(0)}
          className={`absolute inset-0 ${sold ? "scale-105 blur-[2px]" : ""}`}
        />
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          sold
            ? "from-night/95 via-night/65 to-night/45"
            : "from-night/95 via-night/40 to-night/5"
        }`}
      />

      {/* Oben: Descriptor-Tag (was es ist) links · Status rechts */}
      <div className="absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-2">
        {retreat.tagline ? (
          <span
            className={`rounded-full px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] ${accent.tag}`}
          >
            {retreat.tagline}
          </span>
        ) : (
          <span />
        )}

        <div className="flex flex-col items-end gap-2">
          {retreat.exclusive && (
            <span className="rounded-full border border-brass-300/60 bg-night/40 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brass-300 backdrop-blur-sm">
              {exclusiveLabel}
            </span>
          )}

          {sold && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-50/40 bg-night/55 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream-50 backdrop-blur-sm">
              <LockIcon />
              {soldOutUntilLabel ?? soldOutLabel}
            </span>
          )}

          {retreat.heritage && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-50/40 bg-night/45 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              <LandmarkIcon />
              {heritageLabel}
            </span>
          )}
        </div>
      </div>

      {/* Textkörper unten */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-7 text-cream-50">
        <Type role="eyebrow" className="text-brass-300">
          {retreat.highlight}
        </Type>
        <Type role="h2" as="h3" className="mt-3 text-cream-50">
          {retreat.name}
        </Type>

        <ApartmentMeta
          bedrooms={retreat.bedrooms}
          beds={retreat.beds}
          guests={retreat.maxGuests}
          className="mt-4 text-cream-100/85"
        />

        <p className="mt-2.5 font-body text-[0.78rem] text-cream-100/75">
          {oldTownLabel}
          {retreat.year ? ` · ${builtLabel} ${retreat.year}` : ""}
        </p>

        <span className="mt-6 inline-flex flex-col gap-2">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50">
            {ctaLabel}{" "}
            <span aria-hidden className="inline-block rtl:rotate-180">
              &rarr;
            </span>
          </span>
          <span className="h-px w-7 bg-brass-400 transition-all duration-500 group-hover:w-16" />
        </span>
      </div>
    </Link>
  );
}
