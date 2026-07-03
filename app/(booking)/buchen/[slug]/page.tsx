import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getStrings } from "@/lib/i18n/server";
import { getRetreatCardBySlug } from "@/lib/retreats/db";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { fetchBlocks, fetchPriceRules, fetchSettings } from "@/lib/booking/db";
import { blockedNights } from "@/lib/booking/availability";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getStrings();
  const r = await getRetreatCardBySlug(slug, t);
  return { title: r ? `${t.bookingFlow.steps.dates} · ${r.name}` : "Buchen · Black Forest Retreats" };
}

export default async function BookingDatesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getStrings();
  const retreat = await getRetreatCardBySlug(slug, t);
  if (!retreat) notFound();
  if (retreat.soldOut || retreat.bookable === false) redirect(`/wohnungen/${slug}`);

  if (!supabaseConfigured()) {
    return <NotConfiguredNotice />;
  }

  const sb = await createClient();
  const [settings, rules, blocks, userRes] = await Promise.all([
    fetchSettings(sb),
    fetchPriceRules(sb, retreat.id),
    fetchBlocks(sb, retreat.id),
    sb.auth.getUser(),
  ]);

  return (
    <BookingWidget
      retreat={{
        id: retreat.id,
        slug: retreat.slug,
        name: retreat.name,
        highlight: retreat.highlight,
        image: retreat.image,
        basePriceCents: retreat.basePriceCents,
        cleaningFeeCents: retreat.cleaningFeeCents,
        minNights: retreat.minNights ?? 2,
        maxGuests: retreat.maxGuests,
      }}
      rules={rules}
      settings={settings}
      blockedNights={[...blockedNights(blocks)]}
      isRegistered={Boolean(userRes.data?.user)}
    />
  );
}
