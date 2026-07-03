-- ═══════════════════════════════════════════════════════════════════════════
-- Lückenlose Rechnungsnummern (GoBD): BFR-<Jahr>-<lfd. Nummer, 4-stellig>.
-- Bewusst KEINE Postgres-Sequenz (die reißt bei Rollbacks Lücken), sondern
-- eine Counter-Tabelle: der Row-Lock in derselben Transaktion wie der
-- Rechnungs-INSERT garantiert Lückenlosigkeit und Eindeutigkeit.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists invoice_counters (
  year int primary key,
  last_value int not null default 0
);

alter table invoice_counters enable row level security;
-- keine Policies → nur Service-Role

create or replace function next_invoice_number() returns text
language plpgsql as $$
declare
  y int := extract(year from now());
  n int;
begin
  insert into invoice_counters (year, last_value) values (y, 1)
    on conflict (year) do update set last_value = invoice_counters.last_value + 1
    returning last_value into n;
  return format('BFR-%s-%s', y, lpad(n::text, 4, '0'));
end $$;
