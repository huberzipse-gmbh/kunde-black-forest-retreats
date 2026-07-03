-- ═══════════════════════════════════════════════════════════════════════════
-- Atomare Rechnungserstellung: Nummer ziehen + Zeile einfügen in EINER
-- Transaktion (Funktionsaufruf) → garantiert lückenlose Nummern auch dann,
-- wenn der aufrufende Prozess zwischen zwei Requests abbrechen würde.
-- Aufruf ausschließlich per Service-Role (RPC).
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function create_invoice(payload jsonb) returns invoices
language plpgsql as $$
declare
  inv invoices;
begin
  insert into invoices (
    invoice_number, booking_id, kind, references_invoice_id,
    issuer, recipient, line_items,
    net_cents, vat_rate, vat_cents, gross_cents,
    service_from, service_to, pdf_locale
  ) values (
    next_invoice_number(),
    (payload->>'booking_id')::uuid,
    coalesce(payload->>'kind', 'invoice'),
    nullif(payload->>'references_invoice_id', '')::uuid,
    payload->'issuer',
    payload->'recipient',
    payload->'line_items',
    (payload->>'net_cents')::int,
    (payload->>'vat_rate')::numeric,
    (payload->>'vat_cents')::int,
    (payload->>'gross_cents')::int,
    nullif(payload->>'service_from', '')::date,
    nullif(payload->>'service_to', '')::date,
    coalesce(payload->>'pdf_locale', 'de')
  ) returning * into inv;
  return inv;
end $$;
