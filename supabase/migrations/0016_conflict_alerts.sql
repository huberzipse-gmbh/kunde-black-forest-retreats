-- ═══════════════════════════════════════════════════════════════════════════
-- Gemeldete Doppelbelegungen.
--
-- Der iCal-Sync läuft alle 30 min und erkennt dieselbe Kollision jedes Mal
-- aufs Neue. Diese Tabelle hält fest, worüber der Betreiber schon informiert
-- wurde — sonst käme alle 30 min dieselbe Warn-Mail und niemand liest sie mehr.
--
-- `key` ist Quelle+Zeitraum beider Seiten (siehe conflictKey() in
-- lib/booking/conflicts.ts), NICHT die Block-ID: der Sync legt die
-- Airbnb-Blöcke bei jedem Lauf neu an, ihre UUIDs wechseln also ständig.
--
-- Aufgelöste Konflikte werden gelöscht, nicht abgehakt: taucht dieselbe
-- Kollision später wieder auf, ist das eine neue Warnung wert.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists booking_conflicts (
  key text primary key,
  retreat_id text not null references retreats(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  -- Klartext beider Seiten für die Mail („Direktbuchung BFR-1042 · Anna Weber
  -- ↔ Airbnb"). Snapshot: die Airbnb-Seite kann beim nächsten Sync weg sein.
  summary text not null default '',
  detected_at timestamptz not null default now(),
  -- null = erkannt, aber Mail noch nicht raus (z. B. Resend-Ausfall) → der
  -- nächste Lauf versucht es erneut.
  notified_at timestamptz
);

create index if not exists booking_conflicts_pending_idx
  on booking_conflicts(detected_at) where notified_at is null;

-- PostgREST-Schema-Cache neu laden
notify pgrst, 'reload schema';
