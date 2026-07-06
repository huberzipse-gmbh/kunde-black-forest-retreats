"use client";

/**
 * Schritt 2: Zusammenfassung + Storno-Hinweis + Zahlungszeitpunkt + Gastdaten
 * (Gast-Checkout oder Konto mit Extra-Rabatt). Absenden legt die Buchung an
 * (pending) und führt zur Zahlungsseite.
 */
import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtDate, fmtNum } from "@/lib/i18n/format";
import { computeQuote } from "@/lib/booking/pricing";
import { createBooking } from "@/lib/booking/actions";
import type { BookingSettings, PriceRule } from "@/lib/booking/types";
import { createClient } from "@/lib/supabase/client";
import { Type } from "@/components/ui/Type";
import { GoodPriceBadge, PriceBreakdown } from "./PriceBreakdown";
import type { BookingWidgetRetreat } from "./BookingWidget";

interface Props {
  retreat: BookingWidgetRetreat;
  rules: PriceRule[];
  settings: BookingSettings;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  payLaterPossible: boolean;
  cancellationDays: number;
  initialUser: { email: string } | null;
  /** Eingelöster Rabattcode aus dem Cookie (Validierung in computeQuote). */
  promoCode: string | null;
}

type AuthMode = "guest" | "login" | "register";

export function ReviewView({
  retreat,
  rules,
  settings,
  checkIn,
  checkOut,
  adults,
  children,
  infants,
  payLaterPossible,
  cancellationDays,
  initialUser,
  promoCode,
}: Props) {
  const strings = useStrings();
  const t = strings.bookingFlow;
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [timing, setTiming] = useState<"now" | "later">("now");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("guest");
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const quote = useMemo(
    () =>
      computeQuote({
        retreat: {
          id: retreat.id,
          basePriceCents: retreat.basePriceCents,
          cleaningFeeCents: retreat.cleaningFeeCents,
        },
        rules,
        settings,
        checkIn,
        checkOut,
        isRegistered: Boolean(user),
        promoCode,
      }),
    [retreat, rules, settings, checkIn, checkOut, user, promoCode],
  );

  const editHref = `/buchen/${retreat.slug}`;
  const guests = adults + children;
  const pct = String(settings.registeredDiscountPercent).replace(".", locale === "de" ? "," : ".");

  const doAuth = async () => {
    setAuthBusy(true);
    setError(null);
    try {
      const sb = createClient();
      if (authMode === "login") {
        const { data, error: e } = await sb.auth.signInWithPassword({ email, password });
        if (e || !data.user) throw new Error("auth");
        setUser({ email: data.user.email ?? email });
      } else {
        const { data, error: e } = await sb.auth.signUp({ email, password });
        if (e) throw new Error("auth");
        if (data.user && data.session) {
          setUser({ email: data.user.email ?? email });
        } else {
          // E-Mail-Bestätigung aktiv → Hinweis zeigen, Buchung als Gast möglich.
          setError(t.account.checkEmail);
        }
      }
      router.refresh();
    } catch {
      setError(t.errors.authFailed);
    } finally {
      setAuthBusy(false);
    }
  };

  const submit = () => {
    setError(null);
    if (name.trim().length < 2) {
      setError(t.errors.missingName);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t.errors.invalidEmail);
      return;
    }
    startTransition(async () => {
      const result = await createBooking({
        retreatId: retreat.id,
        checkIn,
        checkOut,
        adults,
        children,
        infants,
        guestName: name.trim(),
        guestEmail: email.trim(),
        paymentTiming: payLaterPossible ? timing : "now",
      });
      if (!result.ok || !result.bookingId) {
        const map: Record<string, string> = {
          unavailable: t.errors.unavailable,
          "min-nights": t.errors.minNights(retreat.minNights),
          "max-guests": t.errors.maxGuests(retreat.maxGuests),
          "not-configured": t.errors.notConfigured,
        };
        setError(map[result.error ?? ""] ?? t.errors.generic);
        return;
      }
      router.push(`/buchen/${retreat.slug}/zahlung?booking=${result.bookingId}`);
    });
  };

  const input =
    "w-full rounded-[4px] border border-forest-900/20 bg-white px-4 py-3 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";
  const radioCard = (active: boolean, disabled = false) =>
    `flex w-full items-start gap-3 rounded-[6px] border px-4 py-4 text-start transition-colors ${
      disabled
        ? "cursor-not-allowed border-forest-900/10 opacity-45"
        : active
          ? "border-forest-900 bg-forest-900/[0.04]"
          : "cursor-pointer border-forest-900/15 hover:border-forest-900/40"
    }`;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <Type role="h1" as="h1" className="text-forest-900">
          {t.review.title}
        </Type>

        {/* Reise-Daten */}
        <div className="mt-8 rounded-[8px] border border-forest-900/10 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
                {t.review.dates}
              </div>
              <div className="mt-1 font-body text-sm font-semibold text-forest-900">
                {fmtNum(`${fmtDate(checkIn, locale)} → ${fmtDate(checkOut, locale)}`, locale)}
              </div>
              <div className="mt-0.5 font-body text-xs text-forest-700/60">
                {fmtNum(t.calendar.nights(quote.nights), locale)}
              </div>
            </div>
            <Link href={editHref} className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline">
              {t.review.edit}
            </Link>
          </div>
          <div className="mt-5 flex items-start justify-between gap-4 border-t border-forest-900/10 pt-5">
            <div>
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
                {t.review.guests}
              </div>
              <div className="mt-1 font-body text-sm font-semibold text-forest-900">
                {fmtNum(t.guests.summary(guests), locale)}
                {infants > 0 ? ` + ${fmtNum(infants, locale)} ${t.guests.infants}` : ""}
              </div>
            </div>
            <Link href={editHref} className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline">
              {t.review.edit}
            </Link>
          </div>
        </div>

        {/* Stornierung */}
        <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
          <Type role="h3" as="h2" className="text-forest-900">
            {t.review.cancellationTitle}
          </Type>
          <p className="mt-2 font-body text-sm leading-relaxed text-forest-700/85">
            {fmtNum(t.review.cancellationFree(cancellationDays), locale)}
          </p>
        </div>

        {/* Zahlungszeitpunkt */}
        <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
          <Type role="h3" as="h2" className="text-forest-900">
            {t.review.paymentTimingTitle}
          </Type>
          <div className="mt-4 space-y-3">
            <button type="button" onClick={() => setTiming("now")} className={radioCard(timing === "now")}>
              <span className={`mt-0.5 inline-block h-4 w-4 shrink-0 rounded-full border-2 ${timing === "now" ? "border-forest-900 bg-forest-900" : "border-forest-900/30"}`} />
              <span>
                <span className="block font-body text-sm font-semibold text-forest-900">{t.review.payNow}</span>
                <span className="mt-0.5 block font-body text-xs text-forest-700/70">{t.review.payNowHint}</span>
              </span>
            </button>
            <button
              type="button"
              disabled={!payLaterPossible}
              onClick={() => payLaterPossible && setTiming("later")}
              className={radioCard(timing === "later", !payLaterPossible)}
            >
              <span className={`mt-0.5 inline-block h-4 w-4 shrink-0 rounded-full border-2 ${timing === "later" ? "border-forest-900 bg-forest-900" : "border-forest-900/30"}`} />
              <span>
                <span className="block font-body text-sm font-semibold text-forest-900">{t.review.payLater}</span>
                <span className="mt-0.5 block font-body text-xs text-forest-700/70">
                  {payLaterPossible
                    ? fmtNum(t.review.payLaterHint(settings.payLaterWindowDays), locale)
                    : t.review.payLaterUnavailable}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Gastdaten + Konto */}
        <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
          <Type role="h3" as="h2" className="text-forest-900">
            {t.review.contactTitle}
          </Type>

          {!user && (
            <>
              <p className="mt-2 font-body text-xs text-brass-600">{fmtNum(t.review.registerTeaser(pct), locale)}</p>
              <div className="mt-4 flex gap-2">
                {(["guest", "login", "register"] as AuthMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAuthMode(mode)}
                    className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-colors ${
                      authMode === mode
                        ? "bg-forest-900 text-cream-50"
                        : "border border-forest-900/15 text-forest-900 hover:border-forest-900/40"
                    }`}
                  >
                    {mode === "guest" ? t.review.continueAsGuest : mode === "login" ? t.review.loginTab : t.review.registerTab}
                  </button>
                ))}
              </div>
            </>
          )}

          {user && (
            <p className="mt-3 font-body text-sm text-forest-700/85">{t.review.loggedInAs(user.email)}</p>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">{t.review.nameLabel}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={input} autoComplete="name" />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">{t.review.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
                autoComplete="email"
                disabled={Boolean(user)}
              />
              <p className="mt-1.5 font-body text-xs text-forest-700/60">{t.review.emailHint}</p>
            </div>
            {!user && authMode !== "guest" && (
              <div>
                <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">{t.review.passwordLabel}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={input}
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={doAuth}
                  disabled={authBusy || !email || password.length < 6}
                  className="mt-3 rounded-[3px] border border-forest-900 px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.16em] text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50 disabled:opacity-40"
                >
                  {authMode === "login" ? t.review.loginButton : t.review.registerButton}
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-[6px] border border-red-800/25 bg-red-50 px-4 py-3 font-body text-sm text-red-900">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="mt-8 w-full rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:opacity-50 lg:w-auto"
        >
          {isPending ? t.payment.processing : t.cta.toPayment}
        </button>
      </div>

      {/* Rechts: Preis */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-[8px] border border-forest-900/10 bg-white p-6 shadow-[0_10px_40px_rgba(15,24,19,0.06)]">
          <div className="flex items-center gap-4">
            {retreat.image && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[6px]">
                <Image src={retreat.image} alt={retreat.name} fill sizes="56px" className="object-cover" />
              </div>
            )}
            <div>
              <div className="font-display text-lg text-forest-900">{retreat.name}</div>
              <div className="font-body text-xs text-forest-700/60">{retreat.highlight}</div>
            </div>
          </div>
          {quote.goodPrice && (
            <div className="mt-5">
              <GoodPriceBadge />
            </div>
          )}
          <div className="mt-5 border-t border-forest-900/10 pt-5">
            <div className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
              {t.price.details}
            </div>
            <PriceBreakdown quote={quote} />
          </div>
        </div>
      </aside>
    </div>
  );
}
