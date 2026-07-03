-- ═══════════════════════════════════════════════════════════════════════════
-- Storage-Buckets: Wohnungs-Fotos (öffentlich lesbar) + Rechnungs-PDFs (privat).
-- Uploads laufen ausschließlich über Server Actions mit Service-Role.
-- ═══════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('retreat-photos', 'retreat-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do nothing;

-- Öffentliches Lesen der Wohnungs-Fotos (Anzeige auf der Website)
create policy "retreat photos public read"
  on storage.objects for select
  using (bucket_id = 'retreat-photos');
