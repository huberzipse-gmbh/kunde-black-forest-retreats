-- Rabattcode (Pappaufsteller/QR): ein globaler Code, prozentual auf den
-- Übernachtungspreis. Gepflegt im Admin unter Einstellungen.
alter table settings
  add column if not exists promo_code text not null default 'BFR10',
  add column if not exists promo_percent numeric not null default 10,
  add column if not exists promo_active boolean not null default true;
