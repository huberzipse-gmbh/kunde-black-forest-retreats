"use client";

/**
 * Verfügbarkeits-Kalender im Airbnb-Stil: 2 Monate nebeneinander (Desktop),
 * 1 Monat mobil. Belegte Nächte sind gesperrt, Auswahl = [Anreise, Abreise),
 * Mindestaufenthalt wird visuell erzwungen. RTL-tauglich über logische
 * Reihenfolge (Grid folgt der Schreibrichtung nicht — Wochentage bleiben fix).
 */
import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";

const iso = (d: Date) => format(d, "yyyy-MM-dd");

const INTL: Record<string, string> = { de: "de-DE", en: "en-GB", ar: "ar", zh: "zh-CN" };

export interface CalendarSelection {
  checkIn: string | null;
  checkOut: string | null;
}

interface Props {
  blockedNights: string[]; // ISO-Daten belegter Nächte
  minNights: number;
  selection: CalendarSelection;
  onChange: (sel: CalendarSelection) => void;
}

export function AvailabilityCalendar({ blockedNights, minNights, selection, onChange }: Props) {
  const t = useStrings().bookingFlow.calendar;
  const locale = useLocale();
  const today = startOfToday();
  const [viewMonth, setViewMonth] = useState(startOfMonth(today));
  const blocked = useMemo(() => new Set(blockedNights), [blockedNights]);

  const { checkIn, checkOut } = selection;

  /** Nächste belegte Nacht NACH dem gewählten Check-in (Buchen „über" Belegung verhindern). */
  const nextBlockedAfterCheckIn = useMemo(() => {
    if (!checkIn) return null;
    for (let i = 0; i < 400; i++) {
      const d = iso(addDays(new Date(checkIn), i));
      if (blocked.has(d)) return d;
    }
    return null;
  }, [checkIn, blocked]);

  const selectDay = (day: Date) => {
    const dayIso = iso(day);
    // Neustart der Auswahl: kein Check-in, beides gesetzt, oder Klick vor Check-in.
    if (!checkIn || (checkIn && checkOut) || dayIso <= checkIn) {
      if (blocked.has(dayIso)) return; // Anreise auf belegter Nacht: nein.
      onChange({ checkIn: dayIso, checkOut: null });
      return;
    }
    // Checkout wählen: hinter der nächsten Belegung oder unter Mindestnächten: nein.
    if (nextBlockedAfterCheckIn && dayIso > nextBlockedAfterCheckIn) return;
    const nights = Math.round(
      (new Date(dayIso).getTime() - new Date(checkIn).getTime()) / 86_400_000,
    );
    if (nights < minNights) return;
    onChange({ checkIn, checkOut: dayIso });
  };

  const monthsToShow = [viewMonth, addMonths(viewMonth, 1)];
  const weekdayFmt = new Intl.DateTimeFormat(INTL[locale] ?? "de-DE", { weekday: "narrow" });
  const monthFmt = new Intl.DateTimeFormat(INTL[locale] ?? "de-DE", {
    month: "long",
    year: "numeric",
  });
  // Montag als Wochenstart (mitteleuropäische Konvention der Website).
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2024, 0, i + 1)), // 1.1.2024 = Montag
  );

  const dayState = (day: Date): "past" | "blocked" | "selected" | "range" | "free" | "checkout-only" => {
    const dayIso = iso(day);
    if (isBefore(day, today)) return "past";
    if (dayIso === checkIn || dayIso === checkOut) return "selected";
    if (checkIn && checkOut && dayIso > checkIn && dayIso < checkOut) return "range";
    if (blocked.has(dayIso)) {
      // Belegte Nacht: als Abreisetag trotzdem wählbar, wenn direkt anschließend.
      if (checkIn && !checkOut && dayIso === nextBlockedAfterCheckIn) return "checkout-only";
      return "blocked";
    }
    return "free";
  };

  return (
    <div>
      {/* Monats-Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={t.prevMonth}
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          disabled={iso(viewMonth) <= iso(startOfMonth(today))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 font-display text-lg text-forest-900 transition-colors hover:border-forest-900 disabled:opacity-30 rtl:rotate-180"
        >
          ‹
        </button>
        <div className="flex gap-16 md:gap-32">
          {monthsToShow.map((m, idx) => (
            <span
              key={idx}
              className={`font-display text-base text-forest-900 ${idx === 1 ? "hidden md:inline" : ""}`}
            >
              {fmtNum(monthFmt.format(m), locale)}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label={t.nextMonth}
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 font-display text-lg text-forest-900 transition-colors hover:border-forest-900 rtl:rotate-180"
        >
          ›
        </button>
      </div>

      {/* Monate */}
      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2" dir="ltr">
        {monthsToShow.map((month, idx) => {
          const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
          // getDay: 0 = So … Montag-basiert verschieben.
          const lead = (getDay(startOfMonth(month)) + 6) % 7;
          return (
            <div key={idx} className={idx === 1 ? "hidden md:block" : ""}>
              <div className="grid grid-cols-7 text-center">
                {weekdays.map((w, i) => (
                  <div
                    key={i}
                    className="pb-2 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/50"
                  >
                    {w}
                  </div>
                ))}
                {Array.from({ length: lead }).map((_, i) => (
                  <div key={`lead-${i}`} />
                ))}
                {days.map((day) => {
                  const state = dayState(day);
                  const disabled = state === "past" || state === "blocked";
                  const base =
                    "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full font-body text-sm transition-colors";
                  const cls =
                    state === "selected"
                      ? "bg-forest-900 text-cream-50"
                      : state === "range"
                        ? "bg-forest-900/10 text-forest-900"
                        : state === "blocked"
                          ? "text-forest-700/25 line-through"
                          : state === "past"
                            ? "text-forest-700/20"
                            : state === "checkout-only"
                              ? "text-forest-900 hover:bg-brass-400/20"
                              : "text-forest-900 hover:bg-forest-900/10";
                  return (
                    <button
                      key={iso(day)}
                      type="button"
                      disabled={disabled}
                      onClick={() => selectDay(day)}
                      className={`${base} ${cls}`}
                      aria-pressed={state === "selected"}
                    >
                      {fmtNum(format(day, "d"), locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legende + Mindestaufenthalt */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-xs text-forest-700/70">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-forest-900" /> {t.checkIn} / {t.checkOut}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border border-forest-900/20 line-through" />{" "}
          {t.blocked}
        </span>
        <span>{fmtNum(t.minNights(minNights), locale)}</span>
        {(checkIn || checkOut) && (
          <button
            type="button"
            onClick={() => onChange({ checkIn: null, checkOut: null })}
            className="font-semibold text-brass-600 underline-offset-2 hover:underline"
          >
            {t.clear}
          </button>
        )}
      </div>
    </div>
  );
}
