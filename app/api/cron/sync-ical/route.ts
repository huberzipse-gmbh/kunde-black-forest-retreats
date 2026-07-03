/**
 * Cron-Route: Airbnb-iCal-Import. Aufruf (Coolify Scheduled Task / crontab):
 *   curl -H "Authorization: Bearer $CRON_SECRET" <SITE_URL>/api/cron/sync-ical
 */
import { runIcalSync } from '@/lib/booking/cron';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const result = await runIcalSync();
  return Response.json(result);
}
