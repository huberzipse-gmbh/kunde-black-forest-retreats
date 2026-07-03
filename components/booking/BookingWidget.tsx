"use client";

/**
 * Schritt 1 des Buchungsflows: Kalender + Gäste + Live-Preis.
 * Der hier gezeigte Preis ist eine Vorschau derselben pure Funktion,
 * die der Server bei createBooking erneut ausführt.
 */
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";
import { computeQuote } from "@/lib/booking/pricing";
import type { BookingSettings, PriceRule } from "@/lib/booking/types";
import { Type } from "@/components/ui/Type";
import { AvailabilityCalendar, type CalendarSelection } from "./AvailabilityCalendar";
import { GuestSelector, type GuestSelection } from "./GuestSelector";
import { GoodPriceBadge, NightlyPrice, PriceBreakdown } from "./PriceBreakdown";

export interface BookingWidgetRetreat {
  id: string;
  slug: string;
  name: string;
  highlight: string;
  image: string;
  basePriceCents: number;
  cleaningFeeCents: number;
  minNights: number;
  maxGuests: number;
}

interface Props {
  retreat: BookingWidgetRetreat;
  rules: PriceRule[];
  settings: BookingSettings;
  blockedNights: string[];
  isRegistered: boolean;
}

export function BookingWidget({ retreat, rules, settings, blockedNights, isRegistered }: Props) {
  const strings = useStrings();
  const t = strings.bookingFlow;
  const locale = useLocale();
  const router = useRouter();

  const [selection, setSelection] = useState<CalendarSelection>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState<GuestSelection>({ adults: 2, children: 0, infants: 0 });

  const quote = useMemo(() => {
    if (!selection.checkIn || !selection.checkOut) return null;
    try {
      return computeQuote({
        retreat: {
          id: retreat.id,
          basePriceCents: retreat.basePriceCents,
          cleaningFeeCents: retreat.cleaningFeeCents,
        },
        rules,
        settings,
        checkIn: selection.checkIn,
        checkOut: selection.checkOut,
        isRegistered,
      });
    } catch {
      return null;
    }
  }, [selection, retreat, rules, settings, isRegistered]);

  // Vorschau des Nachtpreises auch ohne Auswahl (heutiger Tag als Referenz).
  const previewQuote = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    try {
      return computeQuote({
        retreat: {
          id: retreat.id,
          basePriceCents: retreat.basePriceCents,
          cleaningFeeCents: retreat.cleaningFeeCents,
        },
        rules,
        settings,
        checkIn: today,
        checkOut: tomorrow,
        isRegistered: false,
      });
    } catch {
      return null;
    }
  }, [retreat, rules, settings]);

  const proceed = () => {
    if (!selection.checkIn || !selection.checkOut) return;
    const params = new URLSearchParams({
      checkin: selection.checkIn,
      checkout: selection.checkOut,
      adults: String(guests.adults),
      children: String(guests.children),
      infants: String(guests.infants),
    });
    router.push(`/buchen/${retreat.slug}/pruefen?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
      {/* Links: Kalender + Gäste */}
      <div>
        <div className="flex items-center gap-4">
          {retreat.image && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px]">
              <Image src={retreat.image} alt={retreat.name} fill sizes="64px" className="object-cover" />
            </div>
          )}
          <div>
            <Type role="eyebrow" className="text-brass-600">
              {retreat.highlight}
            </Type>
            <Type role="h2" as="h1" className="mt-1 text-forest-900">
              {retreat.name}
            </Type>
          </div>
        </div>

        <div className="mt-8 rounded-[8px] border border-forest-900/10 bg-white p-5 md:p-7">
          <Type role="h3" as="h2" className="text-forest-900">
            {t.calendar.title}
          </Type>
          <div className="mt-5">
            <AvailabilityCalendar
              blockedNights={blockedNights}
              minNights={retreat.minNights}
              selection={selection}
              onChange={setSelection}
            />
          </div>
        </div>

        <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-5 md:p-7">
          <Type role="h3" as="h2" className="text-forest-900">
            {t.guests.title}
          </Type>
          <div className="mt-2">
            <GuestSelector maxGuests={retreat.maxGuests} value={guests} onChange={setGuests} />
          </div>
        </div>
      </div>

      {/* Rechts: Preis-Panel (sticky auf Desktop) */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-[8px] border border-forest-900/10 bg-white p-6 shadow-[0_10px_40px_rgba(15,24,19,0.06)]">
          {(quote ?? previewQuote) && <NightlyPrice quote={(quote ?? previewQuote)!} />}

          {/* Auswahl-Zusammenfassung */}
          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-[6px] border border-forest-900/15">
            <div className="border-e border-forest-900/15 px-4 py-3">
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
                {t.calendar.checkIn}
              </div>
              <div className="mt-0.5 font-body text-sm text-forest-900">
                {selection.checkIn
                  ? fmtNum(new Date(selection.checkIn).toLocaleDateString(locale === "de" ? "de-DE" : locale === "zh" ? "zh-CN" : locale === "ar" ? "ar" : "en-GB"), locale)
                  : "–"}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
                {t.calendar.checkOut}
              </div>
              <div className="mt-0.5 font-body text-sm text-forest-900">
                {selection.checkOut
                  ? fmtNum(new Date(selection.checkOut).toLocaleDateString(locale === "de" ? "de-DE" : locale === "zh" ? "zh-CN" : locale === "ar" ? "ar" : "en-GB"), locale)
                  : "–"}
              </div>
            </div>
            <div className="col-span-2 border-t border-forest-900/15 px-4 py-3">
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
                {t.guests.title}
              </div>
              <div className="mt-0.5 font-body text-sm text-forest-900">
                {fmtNum(t.guests.summary(guests.adults + guests.children), locale)}
                {guests.infants > 0 ? ` + ${fmtNum(guests.infants, locale)} ${t.guests.infants}` : ""}
              </div>
            </div>
          </div>

          {quote?.goodPrice && (
            <div className="mt-5">
              <GoodPriceBadge />
            </div>
          )}

          {quote && (
            <div className="mt-5 border-t border-forest-900/10 pt-5">
              <PriceBreakdown quote={quote} />
            </div>
          )}

          <button
            type="button"
            disabled={!quote}
            onClick={proceed}
            className="mt-6 w-full rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {quote ? t.cta.continue : t.cta.checkAvailability}
          </button>
          {!quote && (
            <p className="mt-3 text-center font-body text-xs text-forest-700/60">
              {fmtNum(t.calendar.minNights(retreat.minNights), locale)}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
