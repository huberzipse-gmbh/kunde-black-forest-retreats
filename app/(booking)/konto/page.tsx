import { getLocale, getStrings } from "@/lib/i18n/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { mapBooking } from "@/lib/booking/db";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";
import { AccountView, type AccountBooking } from "@/components/booking/AccountView";

/** Gast-Konto: Anmelden/Registrieren + eigene Buchungen. */
export default async function AccountPage() {
  const strings = await getStrings();
  const locale = await getLocale();
  if (!supabaseConfigured()) return <NotConfiguredNotice />;

  const sb = await createClient();
  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user ?? null;

  // Eigene Buchungen über den eingeloggten Client (RLS „own bookings"), NICHT
  // über den Service-Role-Admin. So hängt die Kontoseite nicht am Service-Key,
  // und ein Ladefehler darf hier nie die ganze Seite crashen — im Zweifel
  // bleibt die Buchungsliste leer und der Login-Zustand wird trotzdem gezeigt.
  let bookings: AccountBooking[] = [];
  if (user) {
    try {
      const { data } = await sb
        .from("bookings")
        .select("*, retreats(name_de)")
        .eq("user_id", user.id)
        .order("check_in", { ascending: false });
      bookings = (data ?? []).map((row) => {
        const b = mapBooking(row);
        return {
          bookingNumber: b.bookingNumber,
          retreatName:
            (row as { retreats?: { name_de?: string } }).retreats?.name_de ?? b.retreatId,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          guests: b.adults + b.children,
          totalCents: b.totalCents,
          status: b.status,
        };
      });
    } catch {
      bookings = [];
    }
  }

  void strings;
  const { data: settingsRow } = await sb
    .from("settings")
    .select("registered_discount_percent")
    .eq("id", 1)
    .maybeSingle();

  return (
    <AccountView
      userEmail={user?.email ?? null}
      bookings={bookings}
      registeredDiscountPercent={Number(settingsRow?.registered_discount_percent ?? 5)}
      locale={locale}
    />
  );
}
