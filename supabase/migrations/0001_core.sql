-- ═══════════════════════════════════════════════════════════════════════════
-- Black Forest Retreats — Kern-Schema: Settings, Retreats, Preisregeln,
-- Verfügbarkeit, Buchungen, Rechnungen, E-Mail-Log, Cron-Läufe.
-- Ausführen im Supabase SQL-Editor (oder via CLI), Reihenfolge 0001 → 0003.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Allgemeine Einstellungen (Single Row, id = 1) ───────────────────────────
create table if not exists settings (
  id int primary key default 1 check (id = 1),
  cancellation_days int not null default 10,
  vat_rate numeric(4,1) not null default 7.0,
  registered_discount_percent numeric(4,1) not null default 5,
  pay_later_window_days int not null default 10,
  -- Rechnungsaussteller (Snapshot-Quelle; aus dem Impressum vorbefüllt)
  issuer_name text not null default 'Axiecentro Germany GmbH',
  issuer_address text not null default E'Hockenheimer Straße 6\n68723 Oftersheim\nDeutschland',
  issuer_phone text default '',
  issuer_email text default '',
  issuer_vat_id text default '',
  issuer_register text not null default 'Amtsgericht Mannheim, HRB 719866',
  issuer_managing_director text not null default 'Tom Thiel',
  -- Globale Rabattaktion (seitenweit, zusätzlich zu Preisregeln pro Wohnung)
  global_discount_name text default '',
  global_discount_amount_cents int,
  global_discount_percent numeric(4,1),
  global_discount_active boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ── Unterkünfte ─────────────────────────────────────────────────────────────
create table if not exists retreats (
  id text primary key,
  slug text unique not null,
  -- Deutscher Quelltext (für geseedete Retreats liefert lib/strings die
  -- Übersetzungen; für neu angelegte gilt der deutsche Text in allen Sprachen)
  name_de text not null,
  highlight_de text default '',
  tagline_de text default '',
  short_description_de text default '',
  description_de text default '',
  amenities_de text[] not null default '{}',
  -- USPs: [{icon, title_de, text_de}] — Icon-Keys aus UspIcons.tsx
  usps jsonb not null default '[]',
  -- Struktur
  max_guests int not null default 4,
  bedrooms int not null default 1,
  beds int not null default 1,
  bathrooms int not null default 1,
  year text default '',
  rating text default '',
  review_count int default 0,
  superhost boolean not null default false,
  guest_favorite boolean not null default false,
  exclusive boolean not null default false,
  featured boolean not null default false,
  heritage boolean not null default false,
  sold_out boolean not null default false,
  sold_out_until text default '',
  accent text default 'brass',
  variant text default '',
  image text default '',
  gallery text[] not null default '{}',
  -- Buchung
  base_price_cents int not null default 20000,
  cleaning_fee_cents int not null default 0,
  min_nights int not null default 2,
  cancellation_days_override int, -- null = globale Einstellung
  airbnb_url text default '',
  airbnb_ical_url text default '',
  ical_export_token text not null default gen_random_uuid()::text,
  bookable boolean not null default true,
  is_seeded boolean not null default false,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Preisregeln (Airbnb-Saisonmodell: Preis-Override und/oder benannter Rabatt)
create table if not exists price_rules (
  id uuid primary key default gen_random_uuid(),
  retreat_id text not null references retreats(id) on delete cascade,
  name text not null,
  start_date date,                 -- null = ab sofort
  end_date date,                   -- null = unbefristet
  nightly_price_cents int,         -- null = Basispreis behalten
  discount_amount_cents int,       -- Rabatt pro Nacht (Betrag)
  discount_percent numeric(4,1),   -- ODER Rabatt in Prozent
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists price_rules_retreat_idx on price_rules(retreat_id) where active;

-- ── Sperr-/Belegungszeiten (eigene Buchungen, Airbnb-iCal, manuell) ─────────
create table if not exists availability_blocks (
  id uuid primary key default gen_random_uuid(),
  retreat_id text not null references retreats(id) on delete cascade,
  start_date date not null,
  end_date date not null,          -- Checkout-Tag, EXKLUSIV
  source text not null check (source in ('booking', 'airbnb-ical', 'manual')),
  booking_id uuid,                 -- gesetzt bei source = 'booking'
  external_uid text,               -- iCal-UID für idempotenten Import
  note text default '',
  created_at timestamptz not null default now(),
  check (end_date > start_date)
);
create index if not exists availability_blocks_retreat_idx
  on availability_blocks(retreat_id, start_date, end_date);
create unique index if not exists availability_blocks_external_uid_idx
  on availability_blocks(retreat_id, external_uid) where external_uid is not null;

-- ── Buchungen ───────────────────────────────────────────────────────────────
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text unique not null,
  retreat_id text not null references retreats(id),
  user_id uuid references auth.users(id) on delete set null, -- null = Gast
  guest_email text not null,
  guest_name text not null,
  check_in date not null,
  check_out date not null,
  adults int not null default 2,
  children int not null default 0,
  infants int not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','awaiting_payment','scheduled','charge_due','paid','failed','refund_pending','refunded')),
  payment_timing text check (payment_timing in ('now', 'later')),
  charge_due_date date,            -- check_in − pay_later_window_days
  quote jsonb not null,            -- eingefrorene Preisaufschlüsselung
  total_cents int not null,
  stripe_payment_intent_id text,
  stripe_setup_intent_id text,
  stripe_customer_id text,
  stripe_payment_method_id text,
  locale text not null default 'de',
  cancellation_days int not null default 10, -- bei Buchung eingefroren
  demo boolean not null default false,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  check (check_out > check_in)
);
create index if not exists bookings_retreat_idx on bookings(retreat_id, check_in);
create index if not exists bookings_status_idx on bookings(status, payment_status);
create index if not exists bookings_user_idx on bookings(user_id) where user_id is not null;

-- ── Rechnungen (GoBD: unveränderlich, lückenlose Nummern via 0002) ──────────
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  booking_id uuid not null references bookings(id),
  kind text not null default 'invoice' check (kind in ('invoice', 'storno')),
  references_invoice_id uuid references invoices(id), -- Stornorechnung → Original
  issued_at timestamptz not null default now(),
  issuer jsonb not null,           -- Snapshot der Aussteller-Daten
  recipient jsonb not null,        -- {name, email}
  line_items jsonb not null,       -- [{label, quantity, unitCents, totalCents}]
  net_cents int not null,
  vat_rate numeric(4,1) not null,
  vat_cents int not null,
  gross_cents int not null,
  service_from date,
  service_to date,
  pdf_locale text not null default 'de',
  pdf_path text default '',        -- Pfad im Storage-Bucket 'invoices'
  voided boolean not null default false,
  void_reason text default ''
);

-- GoBD-Unveränderlichkeit: UPDATE nur für voided/void_reason, DELETE nie.
create or replace function invoices_guard() returns trigger
language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Rechnungen dürfen nicht gelöscht werden (GoBD)';
  end if;
  if (new.invoice_number, new.booking_id, new.kind, new.issued_at,
      new.issuer::text, new.recipient::text, new.line_items::text,
      new.net_cents, new.vat_rate, new.vat_cents, new.gross_cents)
     is distinct from
     (old.invoice_number, old.booking_id, old.kind, old.issued_at,
      old.issuer::text, old.recipient::text, old.line_items::text,
      old.net_cents, old.vat_rate, old.vat_cents, old.gross_cents) then
    raise exception 'Rechnungen sind unveränderlich (GoBD) — Storno per Stornorechnung';
  end if;
  return new;
end $$;

drop trigger if exists invoices_immutable on invoices;
create trigger invoices_immutable
  before update or delete on invoices
  for each row execute function invoices_guard();

-- ── E-Mail-Log (zugleich Demo-Outbox im Admin) ──────────────────────────────
create table if not exists email_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  to_email text not null,
  subject text not null,
  html text not null,
  provider text not null check (provider in ('resend', 'demo')),
  provider_id text default '',
  created_at timestamptz not null default now()
);
create index if not exists email_log_created_idx on email_log(created_at desc);

-- ── Cron-Läufe (für opportunistischen Trigger im Admin-Dashboard) ───────────
create table if not exists cron_runs (
  job text primary key check (job in ('sync-ical', 'charge-due')),
  last_run timestamptz not null default now(),
  last_result text default ''
);

-- ═══ RLS ════════════════════════════════════════════════════════════════════
-- Schreiben läuft IMMER über Server Actions mit Service-Role (umgeht RLS).
alter table settings enable row level security;
alter table retreats enable row level security;
alter table price_rules enable row level security;
alter table availability_blocks enable row level security;
alter table bookings enable row level security;
alter table invoices enable row level security;
alter table email_log enable row level security;
alter table cron_runs enable row level security;

-- Öffentlich lesbar (Website braucht Preise/Verfügbarkeit/Settings clientlos via Server)
create policy "retreats public read" on retreats for select using (true);
create policy "price_rules public read" on price_rules for select using (true);
create policy "availability public read" on availability_blocks for select using (true);
create policy "settings public read" on settings for select using (true);

-- Eigene Buchungen für eingeloggte Gäste
create policy "own bookings" on bookings for select using (auth.uid() = user_id);

-- invoices, email_log, cron_runs: KEINE Policies → nur Service-Role.
