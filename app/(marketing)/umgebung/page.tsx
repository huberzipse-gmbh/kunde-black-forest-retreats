import type { Metadata } from "next";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { UmgebungHubView } from "@/components/sections/umgebung/UmgebungHubView";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getStrings();
  return buildMetadata({
    path: "/umgebung",
    locale,
    // Der lokalisierte Titel ersetzt den vorher hart deutschen String.
    title: `${t.surroundings.hub.title} · Neuenbürg im Schwarzwald`,
    description: t.surroundings.hub.text,
  });
}

export default async function UmgebungHubPage() {
  const locale = await getLocale();
  const t = await getStrings();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: t.surroundings.hub.title, path: localeHref("/umgebung", locale) },
        ])}
      />
      <h1 className="sr-only">{t.surroundings.hub.title}</h1>
      <UmgebungHubView />
    </>
  );
}
