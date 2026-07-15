import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getStrings } from "@/lib/i18n/server";
import { getRetreatCardBySlug } from "@/lib/retreats/db";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { fetchBlocks, fetchPriceRules, fetchSettings } from "@/lib/booking/db";
import { blockedNights, fillUnsellableGaps } from "@/lib/booking/availability";
import { PROMO_COOKIE } from "@/lib/booking/pricing";
import { GIFT_COOKIE } from "@/lib/giftcards/types";
import { resolveGiftCard } from "@/lib/giftcards/redeem";
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
  const [settings, rules, blocks, userRes, cookieStore] = await Promise.all([
    fetchSettings(sb),
    fetchPriceRules(sb, retreat.id),
    fetchBlocks(sb, retreat.id),
    sb.auth.getUser(),
    cookies(),
  ]);
  const promoCode = cookieStore.get(PROMO_COOKIE)?.value ?? null;
  const giftCard = await resolveGiftCard(cookieStore.get(GIFT_COOKIE)?.value ?? null);

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
      blockedNights={[
        ...fillUnsellableGaps(
          blockedNights(blocks),
          retreat.minNights ?? 2,
          new Date().toISOString().slice(0, 10),
        ),
      ]}
      isRegistered={Boolean(userRes.data?.user)}
      promoCode={promoCode}
      giftCard={giftCard ? { code: giftCard.code, balanceCents: giftCard.balanceCents } : null}
    />
  );
}
