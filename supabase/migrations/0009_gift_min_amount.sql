-- Gutschein-Mindestbetrag von 20 € auf 1 € senken (Stripe-Minimum EUR: 0,50 €).
alter table gift_cards drop constraint if exists gift_cards_amount_cents_check;
alter table gift_cards
  add constraint gift_cards_amount_cents_check
  check (amount_cents >= 100 and amount_cents <= 100000);
