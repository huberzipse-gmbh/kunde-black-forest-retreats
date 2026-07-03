/**
 * Menschlich lesbare Buchungsnummer (KEINE Rechnungsnummer — die kommt
 * lückenlos aus next_invoice_number() in der Datenbank).
 * Format: BF-XXXXXX aus einem Alphabet ohne verwechselbare Zeichen.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateBookingNumber(): string {
  let out = '';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `BF-${out}`;
}
