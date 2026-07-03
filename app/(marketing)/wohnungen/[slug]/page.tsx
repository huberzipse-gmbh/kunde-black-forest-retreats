import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { retreatSlugs } from "@/data/retreats";
import { getStrings } from "@/lib/i18n/server";
import { getRetreatCardBySlug } from "@/lib/retreats/db";
import { RetreatDetailView } from "@/components/sections/retreat/RetreatDetailView";

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
  const t = await getStrings();
  const r = await getRetreatCardBySlug(slug, t);
  return {
    title: r
      ? `${r.name} · Black Forest Retreats`
      : "Unterkunft · Black Forest Retreats",
    description: r?.shortDescription,
  };
}

export default async function RetreatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getStrings();
  const retreat = await getRetreatCardBySlug(slug, t);
  if (!retreat) notFound();

  return <RetreatDetailView retreat={retreat} />;
}
