import Link from "next/link";
import { getStrings } from "@/lib/i18n/server";

/**
 * Schlankes Layout für den Buchungsflow: ruhiger Kopf mit Wortmarke,
 * cremefarbener Grund, kein Marketing-Chrome — der Gast soll buchen.
 */
export default async function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getStrings();

  return (
    <div className="min-h-svh bg-cream-50">
      <header className="border-b border-forest-900/10 bg-cream-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="text-center">
            <span className="font-display text-xl tracking-wide text-forest-900">
              {t.brand.name}
            </span>
            <span className="ms-3 hidden font-body text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brass-600 sm:inline">
              {t.brand.location}
            </span>
          </Link>
          <Link
            href="/#apartments"
            className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-forest-700/70 transition-colors hover:text-forest-900"
          >
            {t.apartments.detail.back}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">{children}</main>
    </div>
  );
}
