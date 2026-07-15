"use client";

/**
 * Client-Kontext für die aktive Locale. Der Root-Layout liest die Locale
 * server-seitig (Cookie) und reicht NUR die Locale herein (serialisierbar,
 * im Gegensatz zu den String-Objekten, die Interpolations-Funktionen wie
 * `copyright(year)` enthalten). Die Strings werden hier client-seitig aus
 * der Registry aufgelöst — keine Funktion überquert die RSC-Grenze.
 */
import { createContext, useCallback, useContext } from "react";
import type { ReactNode } from "react";
import { localeHref, type Locale } from "./config";
import { STRINGS } from "./strings";
import type { Strings } from "@/lib/strings/de";

const LocaleContext = createContext<Locale | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext);
  if (!locale) {
    throw new Error("useStrings/useLocale müssen innerhalb von <I18nProvider> stehen.");
  }
  return locale;
}

export function useStrings(): Strings {
  return STRINGS[useLocale()];
}

/**
 * Interne Links sprachrichtig machen: href("/umgebung") → "/en/umgebung".
 * Ohne das würde ein Klick in der englischen Fassung auf der deutschen URL
 * landen — die Sprache steckt jetzt im Pfad, nicht mehr nur im Cookie.
 * Buchungs- und Konto-Pfade bleiben absichtlich unpräfigiert (siehe config).
 */
export function useLocaleHref(): (path: string) => string {
  const locale = useLocale();
  return useCallback((path: string) => localeHref(path, locale), [locale]);
}
