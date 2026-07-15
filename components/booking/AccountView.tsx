"use client";

/**
 * Gast-Konto: Anmelden / Registrieren (Supabase Auth) und die eigenen
 * Buchungen im Überblick. Registrierte Gäste sparen dauerhaft.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStrings } from "@/lib/i18n/I18nProvider";
import { fmtDateShort, fmtEur, fmtNum } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { Type } from "@/components/ui/Type";

export interface AccountBooking {
  bookingNumber: string;
  retreatName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalCents: number;
  status: "pending" | "confirmed" | "cancelled";
}

interface Props {
  userEmail: string | null;
  bookings: AccountBooking[];
  registeredDiscountPercent: number;
  locale: Locale;
}

export function AccountView({ userEmail, bookings, registeredDiscountPercent, locale }: Props) {
  const t = useStrings().bookingFlow;
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pct = fmtNum(
    String(registeredDiscountPercent).replace(".", locale === "de" ? "," : "."),
    locale,
  );

  const doAuth = async () => {
    if (busy || !email || password.length < 6) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const sb = createClient();
      if (mode === "login") {
        const { error: e } = await sb.auth.signInWithPassword({ email, password });
        if (e) throw e;
      } else {
        const { data, error: e } = await sb.auth.signUp({ email, password });
        if (e) throw e;
        if (data.user && !data.session) {
          // Selbst-Hosting bestätigt Mails automatisch — dieser Zweig greift nur,
          // falls die Bestätigung doch aktiviert ist.
          setNotice(t.account.checkEmail);
          setBusy(false);
          return;
        }
      }
      // Erfolg: Seite serverseitig neu laden. busy bleibt an, damit der Button
      // nicht kurz wieder klickbar wirkt, während der Login-Zustand rendert.
      router.refresh();
    } catch (e) {
      setBusy(false);
      const msg = e instanceof Error ? e.message.toLowerCase() : "";
      if (msg.includes("invalid login") || msg.includes("invalid_credentials")) {
        setError(t.account.errInvalid);
      } else if (msg.includes("not confirmed") || msg.includes("email_not_confirmed")) {
        setError(t.account.errNotConfirmed);
      } else if (msg.includes("already registered") || msg.includes("user_already_exists")) {
        setError(t.account.errExists);
      } else if (msg.includes("password")) {
        setError(t.account.errPassword);
      } else {
        setError(t.errors.authFailed);
      }
    }
  };

  const logout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    router.refresh();
  };

  const input =
    "w-full rounded-[4px] border border-forest-900/20 bg-white px-4 py-3 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";

  const statusLabel: Record<AccountBooking["status"], string> = {
    confirmed: t.account.statusConfirmed,
    pending: t.account.statusPending,
    cancelled: t.account.statusCancelled,
  };
  const statusClass: Record<AccountBooking["status"], string> = {
    confirmed: "bg-forest-900/10 text-forest-900",
    pending: "bg-brass-400/20 text-brass-600",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Type role="h1" as="h1" className="text-forest-900">
        {t.account.title}
      </Type>
      <p className="mt-2 font-body text-sm text-forest-700/75">{t.account.subtitle}</p>
      <p className="mt-1 font-body text-sm font-semibold text-brass-600">{t.account.benefit(pct)}</p>

      {!userEmail ? (
        <div className="mt-8 rounded-[8px] border border-forest-900/10 bg-white p-6">
          <div className="flex gap-2">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-colors ${
                  mode === m
                    ? "bg-forest-900 text-cream-50"
                    : "border border-forest-900/15 text-forest-900 hover:border-forest-900/40"
                }`}
              >
                {m === "login" ? t.account.login : t.account.register}
              </button>
            ))}
          </div>
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              doAuth();
            }}
          >
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">
                {t.account.emailLabel}
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" required />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">
                {t.account.passwordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={input}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                required
              />
              <p className="mt-1.5 font-body text-xs text-forest-700/55">{t.account.passwordHint}</p>
            </div>
            {error && <p className="font-body text-sm text-red-800">{error}</p>}
            {notice && <p className="font-body text-sm text-forest-700/80">{notice}</p>}
            <button
              type="submit"
              disabled={busy || !email || password.length < 6}
              className="rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy
                ? t.account.working
                : mode === "login"
                  ? t.account.login
                  : t.account.register}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="mt-8 flex items-center justify-between rounded-[8px] border border-forest-900/10 bg-white px-6 py-4">
            <span className="font-body text-sm text-forest-900">{t.review.loggedInAs(userEmail)}</span>
            <button
              type="button"
              onClick={logout}
              className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/70 hover:text-forest-900"
            >
              {t.account.logout}
            </button>
          </div>

          <Type role="h3" as="h2" className="mt-10 text-forest-900">
            {t.account.myBookings}
          </Type>
          {bookings.length === 0 ? (
            <div className="mt-4 rounded-[8px] border border-forest-900/10 bg-white px-6 py-10 text-center">
              <p className="font-body text-sm text-forest-700/70">{t.account.noBookings}</p>
              <Link
                href="/#apartments"
                className="mt-5 inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300"
              >
                {t.cta.checkAvailability}
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {bookings.map((b) => (
                <Link
                  key={b.bookingNumber}
                  href={`/buchung/${b.bookingNumber}`}
                  className="flex items-center justify-between gap-4 rounded-[8px] border border-forest-900/10 bg-white px-6 py-4 transition-colors hover:border-forest-900/30"
                >
                  <div>
                    <div className="font-body text-sm font-semibold text-forest-900">{b.retreatName}</div>
                    <div className="mt-0.5 font-body text-xs text-forest-700/65">
                      {fmtNum(`${fmtDateShort(b.checkIn, locale)} → ${fmtDateShort(b.checkOut, locale)}`, locale)} ·{" "}
                      {fmtNum(t.guests.summary(b.guests), locale)} · {b.bookingNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider ${statusClass[b.status]}`}>
                      {statusLabel[b.status]}
                    </span>
                    <span className="font-body text-sm font-bold text-forest-900">
                      {fmtNum(fmtEur(b.totalCents, locale), locale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
