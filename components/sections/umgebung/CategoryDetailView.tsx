"use client";

import Link from "next/link";
import { placesByCategory, type SurroundingCategoryKey } from "@/data/surroundings";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";
import { Type } from "@/components/ui/Type";
import { CategoryGrid } from "@/components/sections/umgebung/CategoryGrid";

export function CategoryDetailView({ slug }: { slug: SurroundingCategoryKey }) {
  const strings = useStrings();
  const cat = strings.surroundings.categories[slug];
  const detail = strings.surroundings.detail;
  const places = placesByCategory(slug, strings);
  // Interne Links tragen die Sprache im Pfad (/en/umgebung statt /umgebung).
  const href = useLocaleHref();

  return (
    <article className="bg-night text-cream-50">
      {/* Kopf */}
      <section className="px-6 pt-32 pb-14 md:px-10 md:pt-40 md:pb-18">
        <div className="mx-auto max-w-7xl">
          <Link
            href={href("/umgebung")}
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/70 transition-colors hover:text-cream-50"
          >
            <span aria-hidden className="inline-block rtl:rotate-180">
              &larr;
            </span>{" "}
            {detail.back}
          </Link>

          <div className="mt-10 max-w-2xl">
            <Type role="eyebrow" className="text-brass-300">
              {detail.kicker}
            </Type>
            <Type role="display" as="h1" className="mt-4 text-cream-50">
              {cat.title}
            </Type>
            <div className="mt-7 h-px w-14 bg-brass-400" />
            <Type role="lead" className="mt-7 text-cream-100/80">
              {cat.text}
            </Type>
          </div>
        </div>
      </section>

      {/* Filter + Karten */}
      <section className="px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-7xl">
          <CategoryGrid places={places} />
        </div>
      </section>
    </article>
  );
}
