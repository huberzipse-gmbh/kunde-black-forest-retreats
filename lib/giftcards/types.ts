/**
 * Gutschein-Domäne (Typen + Konstanten). Wertgutscheine: Kauf via Stripe,
 * Einlösung im Buchungsflow, Restguthaben bleibt auf dem Code.
 */

export type GiftCardStatus = 'pending' | 'active' | 'redeemed' | 'expired' | 'cancelled';

export type GiftElementIcon = 'hut' | 'uhr' | 'kirschtorte' | 'schinken';

export interface GiftCard {
  id: string;
  code: string;
  amountCents: number;
  balanceCents: number;
  currency: 'EUR';
  buyerName: string;
  buyerEmail: string;
  recipientName: string;
  message: string;
  status: GiftCardStatus;
  stripePaymentIntentId: string | null;
  downloadToken: string;
  elementIcon: GiftElementIcon;
  locale: string;
  demo: boolean;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string | null;
}

/** Preset-Beträge im Wizard (Cent). */
export const GIFT_PRESETS = [5000, 10000] as const;
export const GIFT_MIN_CENTS = 100; // Stripe-Minimum für EUR ist 0,50 €
export const GIFT_MAX_CENTS = 100000;
export const GIFT_VALIDITY_YEARS = 3;
export const GIFT_MESSAGE_MAX = 240;

/**
 * Cookie-Name des eingelösten Gutscheins (hier, weil 'use server'-Module
 * nur async Funktionen exportieren dürfen — wie PROMO_COOKIE in pricing.ts).
 */
export const GIFT_COOKIE = 'bfr_gift';

/** Erkennungsmerkmal von Gutschein-Codes (fürs kombinierte Code-Feld). */
export const GIFT_CODE_PREFIX = 'GIFT-';
