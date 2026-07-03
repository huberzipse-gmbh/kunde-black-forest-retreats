/**
 * Preisberechnung (pure, ohne I/O — Server rechnet bei jeder Buchung neu,
 * die Client-Anzeige ist nur eine Vorschau derselben Funktion).
 *
 * Reihenfolge pro Nacht:
 *  1. Basispreis der Wohnung, ggf. durch aktive Preisregel überschrieben
 *     (nightly_price_cents; bei Überlappung gewinnt die zuletzt angelegte).
 *  2. Benannte Rabatte (Preisregeln + globale Aktion): erst Beträge, dann
 *     Prozente, floor bei 0. Jeder Rabatt wird als eigene Zeile ausgewiesen.
 * Danach: + Reinigungsgebühr, − Registrierten-Rabatt (auf die Zwischensumme).
 * Total = brutto; USt wird herausgerechnet (7 % Beherbergung, § 12 Abs. 2
 * Nr. 11 UStG — Satz aus den Einstellungen).
 */
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import type { BookingSettings, PriceQuote, PriceRule, QuoteLine } from './types';

export interface PricingRetreat {
  id: string;
  basePriceCents: number;
  cleaningFeeCents: number;
}

const iso = (d: Date) => format(d, 'yyyy-MM-dd');

/** Gilt die Regel an diesem Tag? (start/end null = offen; end ist inklusiv gemeint) */
function ruleCoversDay(rule: PriceRule, day: string): boolean {
  if (!rule.active) return false;
  if (rule.startDate && day < rule.startDate) return false;
  if (rule.endDate && day > rule.endDate) return false;
  return true;
}

interface NightPrice {
  baseCents: number;      // Preis vor Rabatten (ggf. Regel-Override)
  effectiveCents: number; // Preis nach Rabatten
  discounts: { name: string; amountCents: number }[];
}

/** Effektiver Preis einer einzelnen Nacht. */
function priceNight(
  day: string,
  retreat: PricingRetreat,
  rules: PriceRule[],
  settings: BookingSettings,
): NightPrice {
  const covering = rules.filter((r) => ruleCoversDay(r, day));

  // Preis-Override: zuletzt angelegte Regel mit nightlyPriceCents gewinnt.
  const override = covering
    .filter((r) => r.nightlyPriceCents != null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  const baseCents = override?.nightlyPriceCents ?? retreat.basePriceCents;

  // Benannte Rabatte sammeln (Regeln + globale Aktion), Betrag vor Prozent.
  const named: { name: string; amountCents?: number | null; percent?: number | null }[] =
    covering
      .filter((r) => r.discountAmountCents != null || r.discountPercent != null)
      .map((r) => ({ name: r.name, amountCents: r.discountAmountCents, percent: r.discountPercent }));
  const g = settings.globalDiscount;
  if (g.active && (g.amountCents || g.percent)) {
    named.push({ name: g.name || 'Aktionsrabatt', amountCents: g.amountCents, percent: g.percent });
  }

  let effective = baseCents;
  const discounts: { name: string; amountCents: number }[] = [];
  for (const d of named.filter((n) => n.amountCents)) {
    const cut = Math.min(effective, d.amountCents!);
    if (cut > 0) discounts.push({ name: d.name, amountCents: cut });
    effective -= cut;
  }
  for (const d of named.filter((n) => !n.amountCents && n.percent)) {
    const cut = Math.min(effective, Math.round((effective * d.percent!) / 100));
    if (cut > 0) discounts.push({ name: d.name, amountCents: cut });
    effective -= cut;
  }

  return { baseCents, effectiveCents: effective, discounts };
}

export interface QuoteInput {
  retreat: PricingRetreat;
  rules: PriceRule[];
  settings: BookingSettings;
  checkIn: string;  // ISO date
  checkOut: string; // ISO date (exklusiv)
  isRegistered: boolean;
}

export function computeQuote(input: QuoteInput): PriceQuote {
  const { retreat, rules, settings, checkIn, checkOut, isRegistered } = input;
  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  if (nights <= 0) throw new Error('Ungültiger Zeitraum: checkOut muss nach checkIn liegen.');

  // Jede Nacht einzeln bepreisen, Rabatte pro Name aggregieren.
  let preDiscountSubtotal = 0;
  let subtotal = 0;
  const discountByName = new Map<string, number>();
  for (let i = 0; i < nights; i++) {
    const day = iso(addDays(new Date(checkIn), i));
    const n = priceNight(day, retreat, rules, settings);
    preDiscountSubtotal += n.baseCents;
    subtotal += n.effectiveCents;
    for (const d of n.discounts) {
      discountByName.set(d.name, (discountByName.get(d.name) ?? 0) + d.amountCents);
    }
  }

  const lines: QuoteLine[] = [
    { kind: 'nights', label: '', amountCents: preDiscountSubtotal },
    ...[...discountByName.entries()].map(
      ([name, cents]): QuoteLine => ({ kind: 'discount', label: name, amountCents: -cents }),
    ),
  ];

  let total = subtotal;
  const cleaning = retreat.cleaningFeeCents;
  if (cleaning > 0) {
    lines.push({ kind: 'cleaning', label: '', amountCents: cleaning });
    total += cleaning;
  }

  let registeredDiscountCents = 0;
  if (isRegistered && settings.registeredDiscountPercent > 0) {
    registeredDiscountCents = Math.round((total * settings.registeredDiscountPercent) / 100);
    if (registeredDiscountCents > 0) {
      lines.push({ kind: 'registered', label: '', amountCents: -registeredDiscountCents });
      total -= registeredDiscountCents;
    }
  }

  // USt aus dem Bruttobetrag herausrechnen (Beherbergung).
  const net = Math.round(total / (1 + settings.vatRate / 100));
  const vat = total - net;

  return {
    retreatId: retreat.id,
    checkIn,
    checkOut,
    nights,
    avgNightlyBaseCents: Math.round(preDiscountSubtotal / nights),
    avgNightlyEffectiveCents: Math.round(subtotal / nights),
    preDiscountSubtotalCents: preDiscountSubtotal,
    lines,
    cleaningFeeCents: cleaning,
    registeredDiscountCents,
    totalCents: total,
    vatRate: settings.vatRate,
    netCents: net,
    vatCents: vat,
    goodPrice: isGoodPrice(input),
    currency: 'EUR',
  };
}

/**
 * „Guter Preis"-Signal: Ø effektiver Nachtpreis des Aufenthalts liegt nicht
 * über dem Ø der nächsten 60 Tage. Mit einem unbefristeten Eröffnungsrabatt
 * ist das praktisch immer wahr (gewollt) — sobald Saisonpreise existieren,
 * bleibt die Aussage ehrlich.
 */
export function isGoodPrice(input: QuoteInput): boolean {
  const { retreat, rules, settings, checkIn, checkOut } = input;
  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  if (nights <= 0) return false;

  let staySum = 0;
  for (let i = 0; i < nights; i++) {
    const day = iso(addDays(new Date(checkIn), i));
    staySum += priceNight(day, retreat, rules, settings).effectiveCents;
  }
  const stayAvg = staySum / nights;

  const today = new Date();
  let sum = 0;
  for (let i = 0; i < 60; i++) {
    const day = iso(addDays(today, i));
    sum += priceNight(day, retreat, rules, settings).effectiveCents;
  }
  const avg60 = sum / 60;

  return stayAvg <= avg60;
}
