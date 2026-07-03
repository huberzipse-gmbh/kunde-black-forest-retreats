-- ═══════════════════════════════════════════════════════════════════════════
-- Fix: Foreign Key availability_blocks.booking_id → bookings.id.
-- PostgREST braucht die FK-Beziehung für eingebettete Joins
-- (select '*, bookings(...)'), z. B. beim Filtern verfallener
-- pending-Reservierungen in fetchBlocks().
-- ═══════════════════════════════════════════════════════════════════════════

alter table availability_blocks
  add constraint availability_blocks_booking_id_fkey
  foreign key (booking_id) references bookings(id) on delete cascade;

-- PostgREST-Schema-Cache neu laden
notify pgrst, 'reload schema';
