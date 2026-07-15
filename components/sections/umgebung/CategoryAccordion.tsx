"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { PlaceCard } from "@/components/sections/umgebung/PlaceCard";
import type { Place, SurroundingCategoryKey } from "@/data/surroundings";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";

export interface AccordionCategory {
  key: SurroundingCategoryKey;
  title: string;
  text: string;
  image: string;
  places: Place[];
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-5 w-5 shrink-0 text-brass-300 transition-transform duration-500 ${
      open ? "rotate-180" : ""
    }`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** Aufklappbare Kategorien: pro Welt eine Reihe, beim Öffnen die Orte + Link in die Kategorie. */
export function CategoryAccordion({ categories }: { categories: AccordionCategory[] }) {
  const a = useStrings().surroundings.accordion;
  // Interne Links tragen die Sprache im Pfad (/en/umgebung/... statt /umgebung/...).
  const href = useLocaleHref();
  // Erste Kategorie standardmäßig offen, damit der Bereich nicht leer wirkt.
  const [open, setOpen] = useState<string | null>(categories[0]?.key ?? null);

  return (
    <div className="divide-y divide-cream-50/10 border-y border-cream-50/10">
      {categories.map((cat) => {
        const isOpen = open === cat.key;
        return (
          <div key={cat.key}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen((cur) => (cur === cat.key ? null : cat.key))}
              className="group flex w-full items-center gap-5 py-6 text-start transition-colors"
            >
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[5px] sm:h-20 sm:w-32">
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 bg-night/30" />
              </span>

              <span className="flex-1">
                <Type role="h3" as="h3" className="text-cream-50">
                  {cat.title}
                </Type>
                <p className="mt-1 hidden font-body text-sm leading-relaxed text-cream-100/70 sm:block">
                  {cat.text}
                </p>
              </span>

              <span className="flex items-center gap-3">
                <span className="hidden font-body text-xs font-medium uppercase tracking-[0.16em] text-brass-300/80 md:inline">
                  {isOpen ? a.close : a.open}
                </span>
                <Chevron open={isOpen} />
              </span>
            </button>

            {/* Aufgeklappt: Orte der Kategorie + Link in die volle Kategorie */}
            <div
              className={`grid transition-all duration-500 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-10">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.places.map((p, i) => (
                      <Reveal key={p.id} delay={(i % 3) * 80}>
                        <PlaceCard place={p} />
                      </Reveal>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link
                      href={href(`/umgebung/${cat.key}`)}
                      className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-brass-300 transition-colors hover:text-brass-400"
                    >
                      {a.viewAll(cat.title)}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
