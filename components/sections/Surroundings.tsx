"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";

type CategoryKey =
  | "restaurants"
  | "experiences"
  | "nature"
  | "culture"
  | "wellness"
  | "regional";

const ICONS: Record<CategoryKey, ReactNode> = {
  restaurants: (
    <path d="M6 3v7a3 3 0 0 0 6 0V3M9 10v11M18 3c-1.5 0-3 1.5-3 5s1.5 4 3 4v9" />
  ),
  experiences: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
    </>
  ),
  nature: <path d="M3 20h18M7 20l5-13 5 13M12 7 9.5 13h5L12 7z" />,
  culture: (
    <path d="M4 21V9l4-2 4 2 4-2 4 2v12M4 21h16M9 21v-5a3 3 0 0 1 6 0v5" />
  ),
  wellness: <path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z" />,
  regional: (
    <path d="M12 7c0-2 1.5-4 4-4 0 2.5-1.5 4-4 4zM12 7c0-2-1.5-4-4-4 0 2.5 1.5 4 4 4zM12 7v3M8 13a4 4 0 1 0 8 0 4 4 0 0 0-8 0zM12 17v4" />
  ),
};

const ORDER: CategoryKey[] = [
  "restaurants",
  "experiences",
  "nature",
  "culture",
  "wellness",
  "regional",
];

// Dateinamen (versioniert, wo nötig, um Bild-Cache zu umgehen).
const IMAGE: Record<CategoryKey, string> = {
  restaurants: "restaurants-v3.jpg",
  experiences: "experiences-v3.jpg",
  nature: "nature/wildline.webp",
  culture: "culture-v3.jpg",
  wellness: "wellness-v3.webp",
  regional: "regional/zordel.webp",
};

// Foto-Quellen je Kategorie (urheberrechtskonform, dezent unten rechts).
const SOURCE: Record<CategoryKey, { label: string; href: string }> = {
  restaurants: { label: "benders-restaurant.de", href: "https://benders-restaurant.de" },
  experiences: {
    label: "neuenbuerg.de",
    href: "https://www.neuenbuerg.de/freizeit-erlebnis/sehenswertes-in-um-neuenbuerg/besucherbergwerk",
  },
  nature: { label: "bwegt.de", href: "https://www.bwegt.de" },
  culture: { label: "schloss-neuenbuerg.de", href: "https://www.schloss-neuenbuerg.de" },
  wellness: { label: "schloss-neuenbuerg.de", href: "https://www.schloss-neuenbuerg.de" },
  regional: { label: "schwarzwald-tourismus.info", href: "https://www.schwarzwald-tourismus.info" },
};

export function Surroundings() {
  const t = useStrings();
  // Interne Links tragen die Sprache im Pfad (/en/umgebung statt /umgebung).
  const href = useLocaleHref();

  return (
    <section
      id="umgebung"
      className="relative overflow-hidden bg-night px-6 py-28 text-cream-50 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={t.surroundings.eyebrow}
          title={t.surroundings.title}
          text={t.surroundings.text}
          align="center"
          tone="light"
        />

        <div className="mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {ORDER.map((key, i) => {
            const cat = t.surroundings.categories[key];
            const source = SOURCE[key];
            return (
              <Reveal
                key={key}
                delay={(i % 3) * 90}
                className="relative w-[78vw] shrink-0 snap-start sm:w-auto"
              >
                <Link
                  href={href(`/umgebung/${key}`)}
                  aria-label={cat.title}
                  className="group relative block h-[420px] overflow-hidden rounded-[5px]"
                >
                  <Image
                    src={`/images/umgebung/${IMAGE[key]}`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  {/* Dunkler Verlauf für Lesbarkeit */}
                  <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/45 to-night/5 transition-opacity duration-500 group-hover:from-night/90" />

                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-7">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-brass-300"
                    >
                      {ICONS[key]}
                    </svg>
                    <Type role="h3" className="mt-4 text-cream-50">
                      {cat.title}
                    </Type>
                    <p className="mt-2 max-w-[40ch] font-body text-sm leading-relaxed text-cream-100/80">
                      {cat.text}
                    </p>
                    <span className="mt-5 h-px w-8 bg-brass-400 transition-all duration-500 group-hover:w-16" />
                  </div>
                </Link>

                {/* Dezente Foto-Quellenangabe (Geschwister des Karten-Links, nicht verschachtelt) */}
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto absolute bottom-1.5 end-2.5 z-20 font-body text-[9px] tracking-wide text-cream-50/45 transition-colors [text-shadow:_0_1px_2px_rgba(0,0,0,0.55)] hover:text-cream-50/80"
                >
                  {t.surroundings.card.photo} {source.label}
                </a>
              </Reveal>
            );
          })}
          {/* Innenabstand am Ende des mobilen Scrollers */}
          <div aria-hidden className="w-1 shrink-0 sm:hidden" />
        </div>

        <div className="mt-12 text-center">
          <Link
            href={href("/umgebung")}
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-brass-300 transition-colors hover:text-brass-400"
          >
            {t.surroundings.all}
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
