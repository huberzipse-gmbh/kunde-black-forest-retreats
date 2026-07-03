# Buchungs- & Rabattlogik

Kern-Differenzierer des Projekts: Gäste buchen **direkt über uns statt über
Airbnb** — günstiger für den Gast, provisionsfrei für uns.

## Bausteine (implementiert)

- **`types.ts`** — Domänen-Typen (Retreat, PriceRule, AvailabilityBlock, PriceQuote, Booking).
- **`pricing.ts`** — pure Preis-Engine: Basispreis → Preisregel-Override →
  benannte Rabatte (Betrag vor Prozent) → Registrierten-Rabatt → USt-Aufriss
  (7 % Beherbergung, § 12 Abs. 2 Nr. 11 UStG). Plus „Guter Preis"-Signal
  (Aufenthalt ≤ Ø der nächsten 60 Tage).
- **`availability.ts`** — Overlap-Checks, belegte Nächte fürs Kalender-UI.
  `end_date` ist immer der Checkout-Tag (exklusiv), wie bei Airbnb.
- **`stateMachine.ts`** — erlaubte Übergänge von `status × payment_status`;
  macht Webhooks idempotent.
- **`actions.ts`** — Gäste-Server-Actions (createBooking rechnet Preis +
  Verfügbarkeit IMMER server-seitig neu).
- **`confirm.ts`** — die EINE Bestätigungs-Pipeline (Webhook = Demo = Cron):
  Statusübergang → GoBD-Rechnung → E-Mails.
- **`cron.ts`** — iCal-Sync + fällige Abbuchungen; läuft per externem Cron
  UND opportunistisch beim Admin-Dashboard-Load (wenn > 30 min her).

## Zahlung

`lib/payments/` — ein Interface, zwei Provider:
- **Stripe** (sobald `STRIPE_SECRET_KEY` gesetzt): PaymentIntent (Sofort),
  SetupIntent + off_session-Charge („Später zahlen", Abbuchung
  `pay_later_window_days` Tage vor Anreise). Webhook: `/api/stripe/webhook`.
- **Demo** (ohne Key): simulierte Zahlung, identische Pipeline — kompletter
  E2E-Test ohne Stripe-Konto. E-Mails landen in `/admin/emails`.

## Airbnb-Sync (iCal, zwei Wege)

- **Export** (Website → Airbnb): `/api/ical/<retreatId>/<token>` — URL steht
  im Admin (Wohnung → Airbnb-Sync) und wird bei Airbnb importiert.
- **Import** (Airbnb → Website): Airbnb-Export-URL im Admin hinterlegen;
  der Sync ersetzt die `airbnb-ical`-Blöcke transaktional.
- Kein Echtzeit-Sync: Airbnb pollt importierte Kalender nur alle paar Stunden.

## Cron einrichten (Coolify Scheduled Task oder Host-Crontab)

Alle 30 Minuten:

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL/api/cron/sync-ical"
curl -s -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL/api/cron/charge-due"
```

Bis der externe Cron existiert, stößt das Admin-Dashboard beide Jobs
opportunistisch an (wenn der letzte Lauf > 30 min her ist).

## QR-Code-Direktbucher-Flow (Leitidee, Phase 2)

1. In jeder Wohnung hängt ein QR-Code (Tischaufsteller/Schild).
2. Scan → Landing der jeweiligen Unterkunft mit vorbelegtem Rabattcode.
3. Direktbucher-Rabatt wird gegen den Airbnb-Preis gestellt.
4. Buchung + Zahlung laufen über uns, kein Airbnb-Umweg beim nächsten Mal.
