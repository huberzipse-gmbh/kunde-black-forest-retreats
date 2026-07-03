/**
 * iCal-Export-Feed pro Wohnung: bestätigte Buchungen + manuelle Sperren.
 * Diese URL wird bei Airbnb unter „Kalender importieren" eingetragen —
 * der Token macht sie unerratbar (steht im Admin unter Wohnung → iCal).
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { generateIcs } from '@/lib/ical/generate';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ retreatId: string; token: string }> },
) {
  const { retreatId, token } = await params;
  if (!supabaseAdminConfigured()) return new Response('Not configured', { status: 503 });

  const sb = createAdminClient();
  const { data: retreat } = await sb
    .from('retreats')
    .select('id, name_de, ical_export_token')
    .eq('id', retreatId)
    .maybeSingle();
  if (!retreat || retreat.ical_export_token !== token) {
    return new Response('Not found', { status: 404 });
  }

  // Eigene bestätigte Buchungen + manuelle Sperren (Airbnb-Blöcke NICHT
  // zurückspiegeln — sonst entstünde ein Echo im Airbnb-Kalender).
  const { data: blocks } = await sb
    .from('availability_blocks')
    .select('id, start_date, end_date, source, bookings(status)')
    .eq('retreat_id', retreatId)
    .in('source', ['booking', 'manual']);

  const events = (blocks ?? [])
    .filter((b) => {
      if (b.source === 'manual') return true;
      const status = (b as { bookings?: { status?: string } }).bookings?.status;
      return status === 'confirmed';
    })
    .map((b) => ({
      uid: `bfr-${b.id}@blackforestretreats`,
      start: b.start_date,
      end: b.end_date,
      summary: b.source === 'manual' ? 'Blocked' : 'Reserved',
    }));

  return new Response(generateIcs(`Black Forest Retreats — ${retreat.name_de}`, events), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${retreatId}.ics"`,
      'Cache-Control': 'no-cache',
    },
  });
}
