/**
 * Rechnungs-PDF ausliefern: gespeicherte Datei aus dem Storage, notfalls
 * deterministische Regeneration aus der unveränderlichen Rechnungs-Row.
 * Zugriff nur mit Admin-Session (Rechnungen enthalten personenbezogene Daten).
 */
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin/session';
import { getInvoicePdf, mapInvoice } from '@/lib/invoices/create';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!supabaseAdminConfigured()) return new Response('Not configured', { status: 503 });

  const store = await cookies();
  if (!(await verifyAdminToken(store.get(ADMIN_COOKIE)?.value))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const sb = createAdminClient();
  const { data: row } = await sb
    .from('invoices')
    .select('*, bookings(booking_number)')
    .eq('id', id)
    .maybeSingle();
  if (!row) return new Response('Not found', { status: 404 });

  const invoice = mapInvoice(
    row,
    (row as { bookings?: { booking_number?: string } }).bookings?.booking_number,
  );
  const pdf = await getInvoicePdf(invoice);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
