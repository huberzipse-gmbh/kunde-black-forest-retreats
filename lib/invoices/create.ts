import 'server-only';

/**
 * Rechnungserstellung (GoBD): lückenlose Nummer + Insert laufen atomar in
 * der DB-Funktion create_invoice(). Danach PDF rendern und zusätzlich im
 * privaten Storage-Bucket 'invoices' ablegen (Belt & Braces — die Route
 * regeneriert notfalls deterministisch aus der unveränderlichen Row).
 */
import { createAdminClient } from '@/lib/supabase/admin';
import type { Booking, QuoteLine } from '@/lib/booking/types';
import { STRINGS } from '@/lib/i18n/strings';
import { isLocale } from '@/lib/i18n/config';
import type { InvoiceIssuer, InvoiceLineItem, InvoiceRecord } from './types';
import { renderInvoicePdf } from './pdf';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapInvoice(row: any, bookingNumber?: string): InvoiceRecord {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    bookingId: row.booking_id,
    bookingNumber,
    kind: row.kind,
    issuedAt: row.issued_at,
    issuer: row.issuer as InvoiceIssuer,
    recipient: row.recipient,
    lineItems: row.line_items as InvoiceLineItem[],
    netCents: row.net_cents,
    vatRate: Number(row.vat_rate),
    vatCents: row.vat_cents,
    grossCents: row.gross_cents,
    serviceFrom: row.service_from,
    serviceTo: row.service_to,
    pdfPath: row.pdf_path ?? '',
    voided: row.voided,
  };
}

async function loadIssuer(): Promise<InvoiceIssuer> {
  const sb = createAdminClient();
  const { data, error } = await sb.from('settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return {
    name: data.issuer_name,
    address: data.issuer_address,
    phone: data.issuer_phone ?? '',
    email: data.issuer_email ?? '',
    vatId: data.issuer_vat_id ?? '',
    register: data.issuer_register,
    managingDirector: data.issuer_managing_director ?? '',
  };
}

/** Positionen aus der eingefrorenen Preisaufschlüsselung der Buchung. */
function lineItemsFromQuote(booking: Booking, retreatName: string): InvoiceLineItem[] {
  const locale = isLocale(booking.locale) ? booking.locale : 'de';
  // Rechnungstexte bewusst deutsch (Buchhaltung); Rabattnamen wie gepflegt.
  const t = STRINGS.de.bookingFlow;
  const q = booking.quote;

  const items: InvoiceLineItem[] = [];
  for (const line of q.lines as QuoteLine[]) {
    if (line.kind === 'nights') {
      items.push({
        label: `Übernachtung ${retreatName}, ${q.nights} Nächte (${booking.checkIn} bis ${booking.checkOut})`,
        quantity: q.nights,
        unitCents: Math.round(line.amountCents / q.nights),
        totalCents: line.amountCents,
      });
    } else if (line.kind === 'discount') {
      items.push({
        label: `Rabatt: ${line.label}`,
        quantity: 1,
        unitCents: line.amountCents,
        totalCents: line.amountCents,
      });
    } else if (line.kind === 'promo') {
      items.push({
        label: `Rabatt: Code ${line.label}`,
        quantity: 1,
        unitCents: line.amountCents,
        totalCents: line.amountCents,
      });
    } else if (line.kind === 'cleaning') {
      items.push({
        label: 'Endreinigung',
        quantity: 1,
        unitCents: line.amountCents,
        totalCents: line.amountCents,
      });
    } else if (line.kind === 'registered') {
      items.push({
        label: `Rabatt: ${t.price.registered}`,
        quantity: 1,
        unitCents: line.amountCents,
        totalCents: line.amountCents,
      });
    }
  }
  void locale;
  return items;
}

/** Rechnung zu einer bezahlten Buchung erstellen (idempotent pro Buchung). */
export async function createInvoiceForBooking(
  booking: Booking,
  retreatName: string,
): Promise<InvoiceRecord> {
  const sb = createAdminClient();

  // Idempotenz: existiert schon eine (nicht stornierte) Rechnung → zurückgeben.
  const { data: existing } = await sb
    .from('invoices')
    .select('*')
    .eq('booking_id', booking.id)
    .eq('kind', 'invoice')
    .maybeSingle();
  if (existing) return mapInvoice(existing, booking.bookingNumber);

  const issuer = await loadIssuer();
  const payload = {
    booking_id: booking.id,
    kind: 'invoice',
    issuer,
    recipient: { name: booking.guestName, email: booking.guestEmail },
    line_items: lineItemsFromQuote(booking, retreatName),
    net_cents: booking.quote.netCents,
    vat_rate: booking.quote.vatRate,
    vat_cents: booking.quote.vatCents,
    gross_cents: booking.totalCents,
    service_from: booking.checkIn,
    service_to: booking.checkOut,
    pdf_locale: 'de',
  };

  const { data, error } = await sb.rpc('create_invoice', { payload });
  if (error) throw error;
  const invoice = mapInvoice(data, booking.bookingNumber);

  await storePdf(invoice);
  return invoice;
}

/** Stornorechnung: neue Rechnung mit Negativbeträgen, Original bleibt unberührt. */
export async function createStornoInvoice(
  booking: Booking,
  retreatName: string,
  reason: string,
): Promise<InvoiceRecord | null> {
  const sb = createAdminClient();
  const { data: original } = await sb
    .from('invoices')
    .select('*')
    .eq('booking_id', booking.id)
    .eq('kind', 'invoice')
    .maybeSingle();
  if (!original) return null; // Nie bezahlt → keine Rechnung → kein Storno nötig.

  const { data: existingStorno } = await sb
    .from('invoices')
    .select('*')
    .eq('booking_id', booking.id)
    .eq('kind', 'storno')
    .maybeSingle();
  if (existingStorno) return mapInvoice(existingStorno, booking.bookingNumber);

  const issuer = await loadIssuer();
  const negatedItems = (original.line_items as InvoiceLineItem[]).map((it) => ({
    ...it,
    unitCents: -it.unitCents,
    totalCents: -it.totalCents,
  }));

  const payload = {
    booking_id: booking.id,
    kind: 'storno',
    references_invoice_id: original.id,
    issuer,
    recipient: original.recipient,
    line_items: [
      {
        label: `Storno zu Rechnung ${original.invoice_number}${reason ? ` (${reason})` : ''} · ${retreatName}`,
        quantity: 1,
        unitCents: 0,
        totalCents: 0,
      },
      ...negatedItems,
    ],
    net_cents: -original.net_cents,
    vat_rate: Number(original.vat_rate),
    vat_cents: -original.vat_cents,
    gross_cents: -original.gross_cents,
    service_from: original.service_from,
    service_to: original.service_to,
    pdf_locale: 'de',
  };

  const { data, error } = await sb.rpc('create_invoice', { payload });
  if (error) throw error;
  const storno = mapInvoice(data, booking.bookingNumber);
  storno.referencesInvoiceNumber = original.invoice_number;

  await storePdf(storno);
  return storno;
}

/** PDF rendern + im privaten Bucket ablegen, Pfad an der Row vermerken. */
async function storePdf(invoice: InvoiceRecord): Promise<Buffer> {
  const pdf = await renderInvoicePdf(invoice);
  const sb = createAdminClient();
  const path = `${invoice.invoiceNumber}.pdf`;
  const { error } = await sb.storage
    .from('invoices')
    .upload(path, pdf, { contentType: 'application/pdf', upsert: true });
  if (!error) {
    await sb.from('invoices').update({ pdf_path: path }).eq('id', invoice.id);
  } else {
    console.error('[invoices] PDF-Upload fehlgeschlagen:', error.message);
  }
  return pdf;
}

/** PDF laden (Storage) oder deterministisch aus der Row regenerieren. */
export async function getInvoicePdf(invoice: InvoiceRecord): Promise<Buffer> {
  const sb = createAdminClient();
  if (invoice.pdfPath) {
    const { data } = await sb.storage.from('invoices').download(invoice.pdfPath);
    if (data) return Buffer.from(await data.arrayBuffer());
  }
  return renderInvoicePdf(invoice);
}
