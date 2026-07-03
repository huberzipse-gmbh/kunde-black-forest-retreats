/**
 * Stripe-Webhook: bestätigt Zahlungen server-seitig (einzige Wahrheit im
 * Stripe-Modus). Idempotent — doppelte Events laufen ins Leere, weil die
 * State Machine unzulässige Doppel-Übergänge still überspringt.
 * Einrichtung (Charge 2): Endpoint im Stripe-Dashboard auf
 *   <SITE_URL>/api/stripe/webhook
 * mit Events payment_intent.succeeded, payment_intent.payment_failed,
 * setup_intent.succeeded → Signing Secret als STRIPE_WEBHOOK_SECRET.
 */
import type Stripe from 'stripe';
import { getStripe } from '@/lib/payments/stripe';
import {
  markBookingPaid,
  markBookingScheduled,
  markPaymentFailed,
} from '@/lib/booking/confirm';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    return new Response('Stripe nicht konfiguriert', { status: 501 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('Signatur fehlt', { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response('Ungültige Signatur', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const bookingId = pi.metadata?.booking_id;
        if (bookingId) await markBookingPaid(bookingId, { paymentIntentId: pi.id });
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        const bookingId = pi.metadata?.booking_id;
        if (bookingId) await markPaymentFailed(bookingId);
        break;
      }
      case 'setup_intent.succeeded': {
        const si = event.data.object;
        const bookingId = si.metadata?.booking_id;
        if (bookingId) {
          await markBookingScheduled(bookingId, {
            setupIntentId: si.id,
            customerId: typeof si.customer === 'string' ? si.customer : undefined,
            paymentMethodId:
              typeof si.payment_method === 'string' ? si.payment_method : undefined,
          });
        }
        break;
      }
      default:
        break; // Nicht relevante Events quittieren.
    }
  } catch (err) {
    console.error('[stripe-webhook] Verarbeitung fehlgeschlagen:', err);
    return new Response('Verarbeitung fehlgeschlagen', { status: 500 });
  }

  return Response.json({ received: true });
}
