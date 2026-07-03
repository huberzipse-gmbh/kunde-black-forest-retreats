import { notFound, redirect } from "next/navigation";
import { differenceInCalendarDays } from "date-fns";
import { getStrings } from "@/lib/i18n/server";
import { getRetreatCardBySlug } from "@/lib/retreats/db";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { fetchPriceRules, fetchSettings } from "@/lib/booking/db";
import { ReviewView } from "@/components/booking/ReviewView";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function BookingReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const t = await getStrings();

  const retreat = await getRetreatCardBySlug(slug, t);
  if (!retreat) notFound();
  if (retreat.soldOut || retreat.bookable === false) redirect(`/wohnungen/${slug}`);
  if (!supabaseConfigured()) return <NotConfiguredNotice />;

  const checkIn = typeof sp.checkin === "string" ? sp.checkin : "";
  const checkOut = typeof sp.checkout === "string" ? sp.checkout : "";
  if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut) || checkOut <= checkIn) {
    redirect(`/buchen/${slug}`);
  }
  const num = (v: unknown, fallback: number) => {
    const n = typeof v === "string" ? parseInt(v, 10) : NaN;
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  const adults = Math.max(1, num(sp.adults, 2));
  const children = num(sp.children, 0);
  const infants = num(sp.infants, 0);

  const sb = await createClient();
  const [settings, rules, userRes] = await Promise.all([
    fetchSettings(sb),
    fetchPriceRules(sb, retreat.id),
    sb.auth.getUser(),
  ]);

  const payLaterPossible =
    differenceInCalendarDays(new Date(checkIn), new Date()) > settings.payLaterWindowDays;
  const cancellationDays = settings.cancellationDays;
  const user = userRes.data?.user;

  return (
    <ReviewView
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
      checkIn={checkIn}
      checkOut={checkOut}
      adults={adults}
      children={children}
      infants={infants}
      payLaterPossible={payLaterPossible}
      cancellationDays={cancellationDays}
      initialUser={user?.email ? { email: user.email } : null}
    />
  );
}
