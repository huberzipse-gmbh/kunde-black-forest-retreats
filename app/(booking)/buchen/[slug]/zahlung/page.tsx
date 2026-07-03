import { notFound, redirect } from "next/navigation";
import { getStrings } from "@/lib/i18n/server";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { loadBooking, retreatNameOf } from "@/lib/booking/confirm";
import { createAdminClient } from "@/lib/supabase/admin";
import { CheckoutView } from "@/components/booking/CheckoutView";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";

export default async function BookingPaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  await getStrings(); // Locale-Cookie lesen → Seite bleibt dynamisch.

  if (!supabaseAdminConfigured()) return <NotConfiguredNotice />;

  const bookingId = typeof sp.booking === "string" ? sp.booking : "";
  if (!bookingId) redirect(`/buchen/${slug}`);

  let booking;
  try {
    booking = await loadBooking(bookingId);
  } catch {
    notFound();
  }

  // Schon bestätigt? → direkt zur Bestätigungsseite.
  if (booking.status === "confirmed") {
    redirect(`/buchung/${booking.bookingNumber}`);
  }
  if (booking.status === "cancelled") notFound();

  const retreatName = await retreatNameOf(booking.retreatId);
  const sb = createAdminClient();
  const { data: retreatRow } = await sb
    .from("retreats")
    .select("image")
    .eq("id", booking.retreatId)
    .single();

  return (
    <CheckoutView
      booking={{
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        retreatName,
        retreatImage: retreatRow?.image ?? "",
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.adults + booking.children,
        totalCents: booking.totalCents,
        paymentTiming: booking.paymentTiming ?? "now",
        chargeDueDate: booking.chargeDueDate,
      }}
      publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null}
    />
  );
}
