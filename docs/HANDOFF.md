# HANDOFF — Black Forest Retreats (Stand 03.07.2026)

Übergabe für die Weiterarbeit in einem neuen Chat. Ergänzend gilt das
Projekt-Memory (`project_black_forest_retreats.md`) — dort stehen dieselben
Fakten mit mehr Historie.

## Was das Projekt ist

Direktbuchungs-Website für Marks Schwarzwald-Ferienwohnungen (2 echte:
`black-forest-penthouse`, `fachwerk-apartment` · 4 „ausgebucht"-Schein-Häuser),
um Airbnb-Gebühren zu sparen. Marketing-Site (4 Sprachen de/en/ar/zh, RTL) +
komplettes Buchungsportal + Admin. **Alles ist live:** https://blackforest-retreats.de

## Status: KOMPLETT GEBAUT & DEPLOYED

- **Gäste-Flow:** `/buchen/[slug]` Kalender (min. 2 Nächte, Belegung gesperrt)
  → Gäste (max. 4) → Preis (~~200 €~~ 150 €/Nacht via benanntem „Eröffnungsrabatt",
  Good-Price-Badge, −5 % registrierte Gäste) → Storno-Hinweis (10 Tage) +
  Zahlungszeitpunkt (jetzt / 10 Tage vor Anreise via Stripe SetupIntent)
  → Stripe Payment Element → Bestätigung + Mail + GoBD-Rechnung (PDF).
- **Admin** `/admin` (Passwort `Derschwarzwaldruft69`, nur Passwort-Feld):
  Dashboard, Buchungen+Storno (Stornorechnung+Refund), Wohnungen-CRUD
  (Preisregeln je Zeitraum wie Airbnb, Kalender-Blocken, Foto-Upload,
  Airbnb-Sync-Tab), Einstellungen (MwSt 7 %, globale Aktion, Aussteller
  Axiecentro), Rechnungen (PDF), E-Mail-Log. **Admin-Änderungen wirken sofort
  auf die Website** (Admin-gewinnt-Logik in `lib/retreats/db.ts`: bearbeiteter
  Text schlägt Übersetzung, Unverändertes bleibt übersetzt).
- **Website ist 100 % Airbnb-frei** (Buttons, Hinweise, sogar Payload-Feld).
- Rechnungen: lückenlos `BFR-2026-XXXX` (Counter-RPC `create_invoice`),
  Immutability-Trigger, Storno = Stornorechnung. USt 7 % (§ 12 II Nr. 11 UStG).

## Infrastruktur (alles auf dem H&Z-Hetzner-Server)

- **Server:** `ssh hz-hetzner` (= root@178.104.42.87, Key `~/.ssh/hz_hetzner`).
  8 GB RAM + 4 GB Swap (von uns angelegt). Coolify verwaltet alles.
- **App:** Coolify-App `black-forest-retreats-web` (`k3thgjgs9wdbendfta94s9ai`),
  Repo `huberzipse-gmbh/black-forest-retreats` (JasinHuber/... leitet dorthin),
  Branch main, Domain blackforest-retreats.de. Alle 14 Env-Vars in Coolify gesetzt.
- **Supabase self-hosted:** Coolify-Service `supabase-blackforestretreats`
  (`k12b6cugac8arbboouml6sz0`), 15 Container. Kong-URL (HTTP!):
  `http://supabasekong-k12b6cugac8arbboouml6sz0.178.104.42.87.sslip.io`.
  Migrationen `supabase/migrations/0001–0006` sind eingespielt
  (`docker exec -i supabase-db-k12b6cugac8arbboouml6sz0 psql -U postgres`).
  `ENABLE_EMAIL_AUTOCONFIRM=true` (Gast-Konten ohne Mail-Bestätigung).
  ⚠️ Daneben läuft `supabase-airwaymedix` — NICHT anfassen.
- **Mixed-Content-Lösung:** Browser spricht Supabase same-origin über
  Next-Rewrites (`next.config.ts`: /auth|rest|storage|realtime|functions/v1 →
  Kong via `SUPABASE_INTERNAL_URL`); `NEXT_PUBLIC_SUPABASE_URL` = eigene Domain.
- **Coolify-API:** Token `claude-bfr-setup` (per DB-Insert in
  personal_access_tokens erstellt; Plaintext lag nur im Session-Scratchpad —
  bei Bedarf neu anlegen: sha256-Hash in coolify-db inserten oder via UI).
  Deploy: `GET /api/v1/deploy?uuid=k3thgjgs9wdbendfta94s9ai&force=true`
  auf localhost:8000 (per SSH). Deploy-Status pollen bis `finished`.

## Keys & Secrets (NICHT im Repo)

- Lokal: `.env.local` (vollständig befüllt) · Prod: Coolify-App-Envs.
- **Stripe: TEST-Keys** (`sk_test_51Tp7cz…`) — vor Echtbetrieb Live-Keys!
  Prod-Webhook `we_1Tp8BW2LlJ4MmAGtmYMPIxNA` → /api/stripe/webhook.
  Testkarte: 4242 4242 4242 4242.
- **Resend:** Agentur-Key (steht in globaler CLAUDE.md), verifizierte Domain
  huber-zipse.de, Absender `buchung@huber-zipse.de`.
- Admin-Session/Cron-Secrets: in Coolify-Envs.

## Offene Punkte (Reihenfolge = Priorität)

1. **Airbnb-iCal-Sync aktivieren:** Tom (Airbnb-Host) liefert die 2 Export-
   `.ics`-Links (Inserat → Kalender → Einstellungen → Verfügbarkeit → „Mit
   anderer Website verknüpfen"). Diese im Admin je Wohnung (Tab Airbnb-Sync)
   eintragen. Umgekehrt trägt Tom unsere URLs bei Airbnb ein:
   - `https://blackforest-retreats.de/api/ical/black-forest-penthouse/a34fba72-9c75-439e-865f-b1e5b858cc65`
   - `https://blackforest-retreats.de/api/ical/fachwerk-apartment/f19af99e-0b95-4ae0-89d5-8ab34b3f6e0d`
2. **Vor Echtbetrieb:** Live-Stripe-Keys + neuer Live-Webhook; Klarna/PayPal/
   Apple Pay im Stripe-Dashboard aktivieren.
3. **Coolify Scheduled Task** für Cron (alle 30 min, CRON_SECRET aus Coolify-Env):
   `curl -H "Authorization: Bearer $CRON_SECRET" https://blackforest-retreats.de/api/cron/sync-ical`
   und `.../charge-due`. (Bis dahin: läuft opportunistisch beim Admin-Dashboard-Load.)
4. **Supabase-Backup** einrichten (pg_dump-Cron o. Coolify-Backup).
5. Optional: blackforestretreats-Domain in Resend verifizieren (eigener Absender);
   Supabase eigene Domain+TLS (aktuell HTTP/sslip.io, durch Proxy unkritisch);
   Übersetzungs-Review en/ar/zh; `public/hero/hero-video.mp4` (Rohquelle) löschen.

## Arbeitsweise / Stolperfallen

- **Next.js 16!** Vor Code-Änderungen `node_modules/next/dist/docs/` lesen
  (middleware heißt `proxy.ts`, params/cookies async, RSC serialisiert
  `undefined`-Felder als `$undefined`-String → Felder ganz weglassen).
- Goldstandard-Git: Feature-Branch (`funktionen<DD.MM>`), COMMIT ZUERST,
  dann `git rebase origin/main` (main wird durch Rebase-Merges neu
  geschrieben!), force-push, PR, `gh pr merge --rebase`, dann Coolify-Deploy
  anstoßen (kein Auto-Deploy-Webhook aktiv — immer manuell triggern).
- Nach Deploy: Rolling-Überlappung — alte Container antworten noch kurz.
- Alle Seiten sind dynamisch (kein Cache-Invalidieren nötig).
- Preisberechnung: Server rechnet bei createBooking IMMER neu; Anzeige-Quote
  ist dieselbe pure Funktion (`lib/booking/pricing.ts`).
- E-Mails IMMER in `email_log` (Admin → E-Mails), auch bei echtem Versand.
- Testdaten in Prod-DB: Buchungen BF-UYEZER/BF-3Y73V4/BF-64KKYK (demo-Flag
  bzw. Test-Stripe), Rechnungen BFR-2026-0001…0003 — GoBD: nicht löschen,
  ggf. später stornieren.
