-- ═══════════════════════════════════════════════════════════════════════════
-- Seed: Settings-Row + die 6 bestehenden Unterkünfte aus data/retreats.ts
-- (is_seeded = true → lokalisierter Text kommt weiter aus lib/strings/*;
-- die deutschen Spalten dienen als Fallback und Admin-Bearbeitungsbasis).
-- Live-Wohnungen: 200 €/Nacht Basis + unbefristeter „Eröffnungsrabatt" −50 €.
-- ═══════════════════════════════════════════════════════════════════════════

insert into settings (id) values (1) on conflict (id) do nothing;

-- ── Black Forest Penthouse (live, buchbar) ──────────────────────────────────
insert into retreats (
  id, slug, name_de, highlight_de, tagline_de, short_description_de, description_de,
  amenities_de, usps, max_guests, bedrooms, beds, bathrooms, year, rating, review_count,
  superhost, guest_favorite, exclusive, accent, image, gallery,
  base_price_cents, min_nights, airbnb_url, bookable, is_seeded, sort_order
) values (
  'black-forest-penthouse', 'black-forest-penthouse',
  'Black Forest Penthouse', 'Penthouse · Blick aufs Schloss', 'Unser Beliebtestes',
  'Charaktervolles Penthouse unterm Dach mit Terrasse und Blick auf Schloss Neuenbürg.',
  'Hochwertig renoviertes Penthouse mit zwei Mezzanin-Schlafzimmern unter dem Dach, moderner Küche und großer Terrasse über der Enz. Sichtbare Holzbalken, rustikale Balkenbetten und feine Details: Siebträger-Maschine, Smart-TV mit Netflix und eine Marshall-Soundbox. Mitten im Schwarzwald, mit freiem Blick auf das Schloss Neuenbürg.',
  array['Große Terrasse','Blick aufs Schloss','Voll ausgestattete Küche','Siebträger-Maschine','Smart-TV & Netflix','Marshall-Soundbox','Schnelles WLAN & Arbeitsplatz','Kostenlose Parkplätze'],
  '[{"icon":"castle","title_de":"Blick aufs Schloss","text_de":"Vom Bett und der Terrasse direkt aufs Schloss Neuenbürg."},
    {"icon":"key","title_de":"Check-in per Schlüsselbox","text_de":"Komm an, wann du willst, ganz ohne Übergabe."},
    {"icon":"parking","title_de":"Kostenlose Parkplätze","text_de":"Eine Seltenheit in der Gegend, bei uns inklusive."},
    {"icon":"sparkle","title_de":"Sehr sauber","text_de":"Von Gästen immer wieder besonders gelobt."}]'::jsonb,
  4, 2, 2, 1, '1870', '4,89', 100,
  true, true, true, 'brass',
  '/images/wohnungen/penthouse/01.jpg',
  array['/images/wohnungen/penthouse/01.jpg','/images/wohnungen/penthouse/02.jpg','/images/wohnungen/penthouse/03.jpg','/images/wohnungen/penthouse/04.jpg','/images/wohnungen/penthouse/05.jpg','/images/wohnungen/penthouse/06.jpg','/images/wohnungen/penthouse/07.jpg','/images/wohnungen/penthouse/08.jpg','/images/wohnungen/penthouse/09.jpg'],
  15000, 2, 'https://www.airbnb.de/rooms/1109938710053146548', true, true, 10
) on conflict (id) do nothing;

-- ── Fachwerk-Apartment (live, buchbar) ──────────────────────────────────────
insert into retreats (
  id, slug, name_de, highlight_de, tagline_de, short_description_de, description_de,
  amenities_de, usps, max_guests, bedrooms, beds, bathrooms, year, rating, review_count,
  superhost, exclusive, accent, image, gallery,
  base_price_cents, min_nights, airbnb_url, bookable, is_seeded, sort_order
) values (
  'fachwerk-apartment', 'fachwerk-apartment',
  'Fachwerk-Apartment', 'Fachwerk · Terrasse & Schlossblick', 'Perfekt für Paare',
  'Echtes Fachwerk, viel warmes Holz und eine Dachterrasse mit Blick aufs Schloss.',
  'Stilvolles Apartment im historischen Fachwerkhaus: sichtbares Gebälk, Natursteinwände und warmes Holz. Zwei Schlafzimmer, ein privates Badezimmer und eine Dachterrasse über den Dächern von Neuenbürg mit freiem Blick auf das Schloss. Der ruhige Rückzugsort für zwei bis vier Gäste.',
  array['Dachterrasse','Blick aufs Schloss','Privates Badezimmer','Voll ausgestattete Küche','Sichtbares Fachwerk','Kostenfreies WLAN'],
  '[{"icon":"castle","title_de":"Dachterrasse mit Schlossblick","text_de":"Über den Dächern von Neuenbürg, das Schloss im Blick."},
    {"icon":"beams","title_de":"Echtes Fachwerk","text_de":"Sichtbares Gebälk, Natursteinwände, warmes Holz."},
    {"icon":"bath","title_de":"Privates Badezimmer","text_de":"Ganz für dich, modern ausgestattet."},
    {"icon":"wifi","title_de":"Schnelles WLAN","text_de":"Auch zum Arbeiten oder Streamen bestens geeignet."}]'::jsonb,
  4, 2, 2, 1, '1870', '4,87', 52,
  true, true, 'bark',
  '/images/wohnungen/fachwerk/01.jpg',
  array['/images/wohnungen/fachwerk/01.jpg','/images/wohnungen/fachwerk/02.jpg','/images/wohnungen/fachwerk/03.jpg','/images/wohnungen/fachwerk/04.jpg','/images/wohnungen/fachwerk/05.jpg','/images/wohnungen/fachwerk/06.jpg','/images/wohnungen/fachwerk/07.jpg','/images/wohnungen/fachwerk/08.jpg','/images/wohnungen/fachwerk/09.jpg'],
  15000, 2, 'https://www.airbnb.de/rooms/1694207599638836907', true, true, 20
) on conflict (id) do nothing;

-- ── Ausgebuchte Schein-Häuser (nicht buchbar) ───────────────────────────────
insert into retreats (
  id, slug, name_de, highlight_de, tagline_de, short_description_de, description_de,
  amenities_de, usps, max_guests, bedrooms, beds, bathrooms, year, rating, review_count,
  sold_out, sold_out_until, heritage, featured, accent, variant, image,
  bookable, is_seeded, sort_order
) values
(
  'riverhouse', 'riverhouse',
  'Riverhouse', 'Direkt am Fluss · Blick aufs Wasser', 'Für die ganze Familie',
  'Großzügiges Haus direkt an der Enz mit weitem Blick aufs Wasser.',
  'Ein weitläufiges Haus unmittelbar am Flussufer der Enz. Große Fensterfronten holen das Wasser ins Innere, dazu viel Platz für Familien und Gruppen. Eigener Zugang zum Ufer, ruhige Lage und der Klang des Flusses vor der Tür.',
  array['Direkt am Fluss','Blick aufs Wasser','Eigener Uferzugang','Voll ausgestattete Küche','Großer Essbereich','Schnelles WLAN'],
  '[{"icon":"waves","title_de":"Direkt am Fluss","text_de":"Das Wasser rauscht vor der Tür, eigener Uferzugang inklusive."},
    {"icon":"group","title_de":"Platz für 10 Gäste","text_de":"Acht Schlafzimmer, ideal für Familien und Gruppen."},
    {"icon":"kitchen","title_de":"Großer Essbereich","text_de":"Voll ausgestattete Küche und Tafel für alle."},
    {"icon":"wifi","title_de":"Schnelles WLAN","text_de":"Im ganzen Haus, auch fürs Homeoffice am See."}]'::jsonb,
  10, 8, 8, 3, '1782', '4,88', 38,
  true, '2027', false, false, 'forest', 'moss', '/images/wohnungen/riverhouse/01.webp',
  false, true, 30
),
(
  'the-raccoon-house', 'the-raccoon-house',
  'Country Club', 'Marktstraße 25 · Altstadt', 'Altstadt-Charme',
  'Charaktervolles Stadthaus in der Marktstraße 25, mitten in der Altstadt.',
  'Ein liebevoll hergerichtetes Stadthaus in der Marktstraße 25, direkt im historischen Kern von Neuenbürg. Knarrende Dielen, dicke Mauern und viel Charakter über mehrere Etagen. Cafés, Bäcker und das Schloss sind nur ein paar Schritte entfernt.',
  array['Mitten in der Altstadt','Über mehrere Etagen','Historisches Stadthaus','Voll ausgestattete Küche','Kostenfreies WLAN'],
  '[{"icon":"location","title_de":"Mitten in der Altstadt","text_de":"Cafés, Bäcker und das Schloss sind nur ein paar Schritte weg."},
    {"icon":"stairs","title_de":"Über mehrere Etagen","text_de":"Viel Charakter und Raum in einem historischen Stadthaus."},
    {"icon":"kitchen","title_de":"Voll ausgestattete Küche","text_de":"Zum Kochen wie zu Hause."},
    {"icon":"wifi","title_de":"Kostenfreies WLAN","text_de":"Schnell und stabil im ganzen Haus."}]'::jsonb,
  6, 4, 5, 2, '1740', '4,82', 44,
  true, '2027', true, false, 'caramel', 'bark', '/images/wohnungen/raccoon-house/01.webp',
  false, true, 40
),
(
  'the-postal-office', 'the-postal-office',
  'The Postal Office', 'Das alte Postamt · Im Herzen von Neuenbürg', 'Unser Herzstück',
  'Das ehrwürdige alte Postamt, großzügig umgebaut für große Gruppen.',
  'Das historische Postamt von Neuenbürg, mit viel Liebe zu einem außergewöhnlichen Refugium umgebaut. Hohe Decken, weite Räume und Platz für große Gruppen oder Feiern. Ein besonderer Ort mit Geschichte, mitten im Herzen der Stadt.',
  array['Historisches Postamt','Hohe Decken & weite Räume','Ideal für große Gruppen','Großer Gemeinschaftsbereich','Voll ausgestattete Küche','Schnelles WLAN'],
  '[{"icon":"building","title_de":"Historisches Postamt","text_de":"Ein besonderer Ort mit Geschichte, mitten in Neuenbürg."},
    {"icon":"group","title_de":"Bis zu 20 Gäste","text_de":"Zehn Schlafzimmer für große Gruppen und Feiern."},
    {"icon":"arch","title_de":"Hohe Decken & weite Räume","text_de":"Großzügig wie kaum eine andere Unterkunft."},
    {"icon":"kitchen","title_de":"Großer Gemeinschaftsbereich","text_de":"Zum gemeinsamen Kochen, Essen und Beisammensein."}]'::jsonb,
  20, 10, 15, 5, '1902', '4,86', 26,
  true, '2028', true, true, 'gold', 'night', '/images/wohnungen/postal-office/01.webp',
  false, true, 50
),
(
  'grey-fox', 'grey-fox',
  'Grey Fox', 'Le Renard Ivre · Altstadt', 'Altstadt-Charme',
  'Gemütliches Stadthaus in der historischen Altstadt, benannt nach „Le Renard Ivre", dem betrunkenen Fuchs.',
  'Ein charmantes Refugium in der historischen Altstadt von Neuenbürg, liebevoll „Le Renard Ivre" getauft, nach dem alten Sprichwort vom betrunkenen Fuchs. Warmes Holz, dicke Mauern und viel Charakter über mehrere Etagen. Cafés, Bäcker und das Schloss sind nur ein paar Schritte entfernt.',
  array['Mitten in der historischen Altstadt','Über mehrere Etagen','Historisches Stadthaus','Voll ausgestattete Küche','Kostenfreies WLAN'],
  '[{"icon":"location","title_de":"Mitten in der historischen Altstadt","text_de":"Cafés, Bäcker und das Schloss sind nur ein paar Schritte weg."},
    {"icon":"beams","title_de":"Viel Charakter","text_de":"Warmes Holz und dicke Mauern in einem historischen Stadthaus."},
    {"icon":"kitchen","title_de":"Voll ausgestattete Küche","text_de":"Zum Kochen wie zu Hause."},
    {"icon":"wifi","title_de":"Kostenfreies WLAN","text_de":"Schnell und stabil im ganzen Haus."}]'::jsonb,
  5, 3, 4, 2, '1540', '4,74', 19,
  true, '2028', true, false, 'forest', 'moss', '',
  false, true, 60
) on conflict (id) do nothing;

-- Eröffnungsrabatt (−50 €/Nacht) wurde am 2026-07-16 auf Kundenwunsch entfernt —
-- neue Umgebungen starten ohne Rabatt-Preisregel.
