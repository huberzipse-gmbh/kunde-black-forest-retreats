import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { retreatSlugs } from "@/data/retreats";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { getRetreatCardBySlug } from "@/lib/retreats/db";
import { RetreatDetailView } from "@/components/sections/retreat/RetreatDetailView";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, lodgingSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";

// Bekannte Slugs als Hinweis; neue (Admin-)Retreats rendern dynamisch.
export function generateStaticParams() {
  return retreatSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getStrings();
  const r = await getRetreatCardBySlug(slug, t);
  const path = `/wohnungen/${slug}`;
  return buildMetadata({
    path,
    locale,
    title: r ? `${r.name} in Neuenbürg im Schwarzwald` : "Unterkunft",
    description:
      r?.shortDescription ??
      "Exklusive Ferienwohnung im Nordschwarzwald, Neuenbürg. Direkt buchen.",
    images: r?.image ? [r.image] : undefined,
  });
}

export default async function RetreatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getStrings();
  const retreat = await getRetreatCardBySlug(slug, t);
  if (!retreat) notFound();

  const path = localeHref(`/wohnungen/${slug}`, locale);
  const schema = [
    lodgingSchema(retreat, path),
    breadcrumbSchema([
      { name: SITE_NAME, path: localeHref("/", locale) },
      { name: retreat.name, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <RetreatDetailView retreat={retreat} />
    </>
  );
}
