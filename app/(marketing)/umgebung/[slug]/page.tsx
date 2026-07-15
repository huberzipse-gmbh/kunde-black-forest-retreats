import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_ORDER, isCategoryKey } from "@/data/surroundings";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { CategoryDetailView } from "@/components/sections/umgebung/CategoryDetailView";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getStrings();
  const cat = isCategoryKey(slug) ? t.surroundings.categories[slug] : null;
  return buildMetadata({
    path: `/umgebung/${slug}`,
    locale,
    title: cat ? `${cat.title} · Umgebung Neuenbürg` : t.surroundings.hub.title,
    description: cat?.text ?? t.surroundings.hub.text,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isCategoryKey(slug)) notFound();

  const locale = await getLocale();
  const t = await getStrings();
  const cat = t.surroundings.categories[slug];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: t.surroundings.hub.title, path: localeHref("/umgebung", locale) },
          { name: cat.title, path: localeHref(`/umgebung/${slug}`, locale) },
        ])}
      />
      <CategoryDetailView slug={slug} />
    </>
  );
}
