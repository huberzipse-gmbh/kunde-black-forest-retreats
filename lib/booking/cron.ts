import 'server-only';

/**
 * Cron-Kernlogik — aufgerufen von /api/cron/* (externer Scheduler mit
 * CRON_SECRET) UND opportunistisch beim Laden des Admin-Dashboards
 * (wenn der letzte Lauf > 30 min her ist). So funktioniert das System
 * schon, bevor auf Coolify ein Scheduled Task eingerichtet ist.
 */
import { format } from 'date-fns';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseIcs } from '@/lib/ical/parse';
import { getPaymentProvider } from '@/lib/payments';
import { mapBooking } from './db';
import { syncConflictAlerts } from './conflictAlerts';
import { markBookingPaid, markPaymentFailed } from './confirm';

const iso = (d: Date) => format(d, 'yyyy-MM-dd');

// Nach so vielen fehlgeschlagenen Abbuchungsversuchen zieht der Cron eine
// Buchung nicht mehr — danach klärt der Betreiber manuell (kein Endlos-Retry,
// kein Mail-Spam). Der Gast wurde beim ersten Fehlversuch bereits informiert.
const MAX_CHARGE_ATTEMPTS = 3;

export interface CronResult {
  job: 'sync-ical' | 'charge-due';
  processed: number;
  failed: number;
  details: string[];
}

async function recordRun(job: CronResult['job'], result: string): Promise<void> {
  const sb = createAdminClient();
  await sb
    .from('cron_runs')
    .upsert({ job, last_run: new Date().toISOString(), last_result: result });
}

/** Airbnb-Kalender aller Wohnungen mit hinterlegter Import-URL synchronisieren. */
export async function runIcalSync(): Promise<CronResult> {
  const sb = createAdminClient();
  const details: string[] = [];
  let processed = 0;
  let failed = 0;

  const { data: retreats } = await sb
    .from('retreats')
    .select('id, name_de, airbnb_ical_url')
    .neq('airbnb_ical_url', '');

  for (const retreat of retreats ?? []) {
    try {
      const res = await fetch(retreat.airbnb_ical_url, {
        headers: { 'User-Agent': 'BlackForestRetreats-CalendarSync/1.0' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const events = parseIcs(await res.text());

      // Transaktionales Ersetzen: alte airbnb-Blöcke raus, frische rein.
      await sb
        .from('availability_blocks')
        .delete()
        .eq('retreat_id', retreat.id)
        .eq('source', 'airbnb-ical');
      if (events.length > 0) {
        await sb.from('availability_blocks').insert(
          events.map((ev) => ({
            retreat_id: retreat.id,
            start_date: ev.start,
            end_date: ev.end,
            source: 'airbnb-ical',
            external_uid: ev.uid,
            note: ev.summary,
          })),
        );
      }
      processed++;
      details.push(`${retreat.name_de}: ${events.length} Blöcke`);
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : 'Fehler';
      details.push(`${retreat.name_de}: FEHLER ${msg}`);
    }
  }

  // Frisch importiert → jetzt zeigt sich, ob eine Airbnb-Buchung auf eine
  // eigene Buchung trifft. Neue Kollisionen gehen sofort per Mail raus.
  const alerts = await syncConflictAlerts();
  if (alerts.open > 0) {
    details.push(
      `${alerts.open} Doppelbelegung${alerts.open > 1 ? 'en' : ''}` +
        (alerts.notified > 0 ? ` (${alerts.notified} gemeldet)` : ''),
    );
  }

  const result: CronResult = { job: 'sync-ical', processed, failed, details };
  await recordRun('sync-ical', details.join(' · ') || 'keine Import-URLs');
  return result;
}

/** Fällige „Später zahlen"-Abbuchungen ausführen (charge_due_date erreicht). */
export async function runChargeDue(): Promise<CronResult> {
  const sb = createAdminClient();
  const details: string[] = [];
  let processed = 0;
  let failed = 0;
  const today = iso(new Date());

  const { data: rows } = await sb
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .in('payment_status', ['scheduled', 'failed'])
    .lte('charge_due_date', today)
    .lt('payment_attempts', MAX_CHARGE_ATTEMPTS);

  const provider = getPaymentProvider();

  for (const row of rows ?? []) {
    const booking = mapBooking(row);
    const attempt = (row.payment_attempts ?? 0) + 1;
    try {
      // Versuch zählen + scheduled → charge_due (Zwischenschritt der State Machine).
      const patch: Record<string, unknown> = { payment_attempts: attempt };
      if (booking.paymentStatus === 'scheduled') {
        patch.payment_status = 'charge_due';
        booking.paymentStatus = 'charge_due';
      }
      await sb.from('bookings').update(patch).eq('id', booking.id);

      const charge = await provider.chargeSavedMethod(booking);
      if (charge.ok) {
        await markBookingPaid(booking.id, { paymentIntentId: charge.paymentIntentId });
        processed++;
        details.push(`${booking.bookingNumber}: abgebucht`);
      } else {
        // Gast nur beim ERSTEN Fehlversuch benachrichtigen (kein Spam bei Retry).
        await markPaymentFailed(booking.id, { notify: attempt === 1 });
        failed++;
        const last = attempt >= MAX_CHARGE_ATTEMPTS ? ', letzter Versuch' : '';
        details.push(
          `${booking.bookingNumber}: FEHLGESCHLAGEN (Versuch ${attempt}${last}, ${charge.error ?? '?'})`,
        );
      }
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : 'Fehler';
      details.push(`${booking.bookingNumber}: FEHLER ${msg}`);
    }
  }

  const result: CronResult = { job: 'charge-due', processed, failed, details };
  await recordRun('charge-due', details.join(' · ') || 'nichts fällig');
  return result;
}

/** Opportunistischer Trigger (Admin-Dashboard): laufen lassen, wenn > 30 min her. */
export async function runIfStale(): Promise<void> {
  const sb = createAdminClient();
  const { data } = await sb.from('cron_runs').select('job, last_run');
  const lastRun = new Map((data ?? []).map((r) => [r.job, new Date(r.last_run).getTime()]));
  const cutoff = Date.now() - 30 * 60 * 1000;

  const jobs: Promise<CronResult>[] = [];
  if ((lastRun.get('sync-ical') ?? 0) < cutoff) jobs.push(runIcalSync());
  if ((lastRun.get('charge-due') ?? 0) < cutoff) jobs.push(runChargeDue());
  if (jobs.length) await Promise.allSettled(jobs);
}
