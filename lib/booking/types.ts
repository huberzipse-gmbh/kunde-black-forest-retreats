/**
 * Black Forest Retreats — Buchungs-Domäne (Typen).
 * Kernlogik: Verfügbarkeit, Preisberechnung (Preisregeln + benannte Rabatte
 * + Registrierten-Rabatt), Buchungs-Lebenszyklus inkl. „Später zahlen".
 */

/** Eine buchbare Unterkunft (Wohnung/Retreat). Skaliert auf 10–20 Einheiten. */
export interface Retreat {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  /** Basis-Übernachtungspreis in Cent (EUR). */
  basePriceCents: number;
  /** Reinigungsgebühr in Cent, einmalig pro Buchung. */
  cleaningFeeCents: number;
  /** Mindestaufenthalt in Nächten. */
  minNights: number;
  amenities: string[];
  images: string[];
  /** Externe Airbnb-URL — für Preisvergleich „Direkt vs. Airbnb". */
  airbnbUrl?: string;
}

/** Belegung/Sperrzeit (aus iCal-Sync, eigenen Buchungen oder manuell). */
export interface AvailabilityBlock {
  id?: string;
  retreatId: string;
  start: string; // ISO date
  end: string;   // ISO date (Checkout-Tag, exklusiv)
  source: 'booking' | 'airbnb-ical' | 'manual';
  bookingId?: string | null;
  note?: string;
}

/**
 * Preisregel (Airbnb-Saisonmodell): für einen Zeitraum kann ein eigener
 * Nachtpreis gelten UND/ODER ein benannter Rabatt (Betrag oder Prozent).
 * start/end = null → ab sofort / unbefristet.
 */
export interface PriceRule {
  id: string;
  retreatId: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  nightlyPriceCents: number | null;
  discountAmountCents: number | null;
  discountPercent: number | null;
  active: boolean;
  createdAt: string;
}

/** Relevante globale Einstellungen für Preis & Buchung. */
export interface BookingSettings {
  cancellationDays: number;
  vatRate: number;
  registeredDiscountPercent: number;
  payLaterWindowDays: number;
  globalDiscount: {
    name: string;
    amountCents: number | null;
    percent: number | null;
    active: boolean;
  };
}

/** Eine Zeile der Preisaufschlüsselung (wie bei Airbnb). */
export interface QuoteLine {
  kind: 'nights' | 'discount' | 'cleaning' | 'registered';
  label: string;
  amountCents: number; // Rabatte negativ
}

export interface PriceQuote {
  retreatId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  /** Ø Nachtpreis VOR Rabatten (fürs Durchstreichen: „200 €"). */
  avgNightlyBaseCents: number;
  /** Ø Nachtpreis NACH Rabatten (der beworbene Preis: „150 €"). */
  avgNightlyEffectiveCents: number;
  /** Summe vor Rabatten (nights × base). */
  preDiscountSubtotalCents: number;
  lines: QuoteLine[];
  cleaningFeeCents: number;
  registeredDiscountCents: number;
  totalCents: number; // brutto
  vatRate: number;
  netCents: number;
  vatCents: number;
  /** „Guter Preis"-Signal: Aufenthalt liegt ≤ Ø der nächsten 60 Tage. */
  goodPrice: boolean;
  currency: 'EUR';
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentStatus =
  | 'unpaid'
  | 'awaiting_payment'
  | 'scheduled'
  | 'charge_due'
  | 'paid'
  | 'failed'
  | 'refund_pending'
  | 'refunded';

export type PaymentTiming = 'now' | 'later';

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  retreatId: string;
  userId: string | null;
  guestEmail: string;
  guestName: string;
  checkIn: string;  // ISO date
  checkOut: string; // ISO date
  adults: number;
  children: number;
  infants: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentTiming: PaymentTiming | null;
  chargeDueDate: string | null;
  quote: PriceQuote;
  totalCents: number;
  stripePaymentIntentId: string | null;
  stripeSetupIntentId: string | null;
  stripeCustomerId: string | null;
  stripePaymentMethodId: string | null;
  locale: string;
  cancellationDays: number;
  demo: boolean;
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
}
