/**
 * Cron-Route: fällige „Später zahlen"-Abbuchungen. Aufruf:
 *   curl -H "Authorization: Bearer $CRON_SECRET" <SITE_URL>/api/cron/charge-due
 */
import { runChargeDue } from '@/lib/booking/cron';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const result = await runChargeDue();
  return Response.json(result);
}
