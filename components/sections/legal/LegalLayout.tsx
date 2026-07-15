import type { ReactNode } from "react";
import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { Type } from "@/components/ui/Type";

/**
 * Einheitliches Layout für die deutschen Rechtsseiten (Impressum, Datenschutz,
 * AGB). Dunkles Titelband oben (damit der transparente Header lesbar bleibt),
 * darunter heller, gut lesbarer Textkörper. Inhalt wird als semantisches JSX
 * (h2/h3/p/ul) übergeben und über die Prose-Klassen einheitlich gestylt.
 */

const PROSE = [
  "mx-auto max-w-3xl px-6 font-body text-[0.95rem] leading-relaxed text-forest-700",
  "[&_h2]:font-display [&_h2]:text-forest-900 [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:mt-12 [&_h2]:mb-4",
  "[&_h3]:font-display [&_h3]:text-forest-900 [&_h3]:text-lg [&_h3]:mt-8 [&_h3]:mb-2.5",
  "[&_p]:mb-4",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5",
  "[&_strong]:text-forest-900 [&_strong]:font-semibold",
  "[&_a]:text-brass-600 [&_a]:underline [&_a]:underline-offset-2",
  "[&_address]:not-italic",
].join(" ");

interface LegalLayoutProps {
  /** Sichtbarer Seitentitel, z. B. „Impressum". */
  title: string;
  /** Stand der Fassung, z. B. „Juni 2026". */
  updated: string;
  backLabel?: string;
  children: ReactNode;
}

export async function LegalLayout({
  title,
  updated,
  backLabel = "Zur Startseite",
  children,
}: LegalLayoutProps) {
  // Server-Komponente: Sprache kommt aus der URL (Middleware-Header), damit der
  // Zurück-Link in der englischen Fassung auf /en zeigt und nicht auf /.
  const locale = await getLocale();

  return (
    <article className="bg-cream-50">
      {/* Dunkles Titelband (unter dem fixierten Header) */}
      <header className="bg-night px-6 pt-32 pb-14 text-cream-50 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={localeHref("/", locale)}
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/75 transition-colors hover:text-cream-50"
          >
            <span aria-hidden className="inline-block rtl:rotate-180">
              &larr;
            </span>{" "}
            {backLabel}
          </Link>
          <Type role="eyebrow" className="mt-8 text-brass-300">
            Rechtliches
          </Type>
          <Type role="display" as="h1" className="mt-4 text-cream-50">
            {title}
          </Type>
          <p className="mt-5 font-body text-xs uppercase tracking-[0.18em] text-cream-100/55">
            Stand: {updated}
          </p>
        </div>
      </header>

      {/* Textkörper */}
      <div className="py-14 md:py-20">
        <div className={PROSE}>{children}</div>
      </div>
    </article>
  );
}
