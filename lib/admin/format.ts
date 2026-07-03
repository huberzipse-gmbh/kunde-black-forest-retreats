/** Kleine Format-Helfer für die (deutschsprachige) Admin-UI. */

export const eur = (cents: number): string =>
  `${(cents / 100).toLocaleString('de-DE', {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} €`;

export const dateDe = (iso: string): string =>
  new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const dateTimeDe = (iso: string): string =>
  new Date(iso).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const STATUS_LABEL: Record<string, string> = {
  pending: 'Offen',
  confirmed: 'Bestätigt',
  cancelled: 'Storniert',
};

export const PAYMENT_LABEL: Record<string, string> = {
  unpaid: 'Unbezahlt',
  awaiting_payment: 'Zahlung läuft',
  scheduled: 'Abbuchung geplant',
  charge_due: 'Abbuchung fällig',
  paid: 'Bezahlt',
  failed: 'Fehlgeschlagen',
  refund_pending: 'Erstattung offen',
  refunded: 'Erstattet',
};
