/**
 * Mehrere Gutscheine gebündelt als ZIP ausliefern (Bulk-Export). Jede Karte als
 * eigene PDF. Zugriff nur mit Admin-Session (nicht über den Käufer-Token).
 * Nur Karten mit PDF (Status aktiv/eingelöst) werden aufgenommen. Zwei Modi:
 *   - Zeitraum:  /api/giftcards/bulk?from=YYYY-MM-DD&to=YYYY-MM-DD
 *   - Auswahl:   /api/giftcards/bulk?ids=<id1,id2,...>
 */
import { cookies } from 'next/headers';
import { zipSync } from 'fflate';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin/session';
import { loadGiftCard, mapGiftCard } from '@/lib/giftcards/db';
import { renderGiftCardPdf } from '@/lib/giftcards/pdf';
import type { GiftCard } from '@/lib/giftcards/types';

const MAX = 500;
const isDate = (s: string | null): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

export async function GET(request: Request) {
  if (!supabaseAdminConfigured()) return new Response('Not configured', { status: 503 });

  const store = await cookies();
  if (!(await verifyAdminToken(store.get(ADMIN_COOKIE)?.value))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const sb = createAdminClient();

  const ids = (params.get('ids') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX);
  const from = params.get('from');
  const to = params.get('to');

  // Karten sammeln — per Auswahl (ids) oder per Zeitraum (created_at).
  let cards: GiftCard[] = [];
  if (ids.length > 0) {
    cards = (await Promise.all(ids.map((id) => loadGiftCard(sb, id)))).filter(
      (c): c is GiftCard => c !== null,
    );
  } else if (isDate(from) || isDate(to)) {
    let query = sb.from('gift_cards').select('*').in('status', ['active', 'redeemed']);
    if (isDate(from)) query = query.gte('created_at', `${from}T00:00:00Z`);
    if (isDate(to)) query = query.lte('created_at', `${to}T23:59:59.999Z`);
    const { data, error } = await query.order('created_at', { ascending: true }).limit(MAX);
    if (error) return new Response('Fehler beim Laden', { status: 500 });
    cards = (data ?? []).map(mapGiftCard);
  } else {
    return new Response('Zeitraum oder Auswahl angeben', { status: 400 });
  }

  const files: Record<string, Uint8Array> = {};
  const used = new Set<string>();
  await Promise.all(
    cards.map(async (card) => {
      // Nur Karten mit PDF (aktiv/eingelöst); Rest still überspringen.
      if (card.status !== 'active' && card.status !== 'redeemed') return;
      const pdf = await renderGiftCardPdf(card);
      let name = `${card.code}.pdf`;
      let n = 2;
      while (used.has(name)) name = `${card.code}-${n++}.pdf`;
      used.add(name);
      files[name] = new Uint8Array(pdf);
    }),
  );

  if (Object.keys(files).length === 0) {
    return new Response('Keine exportierbaren Gutscheine im Zeitraum', { status: 404 });
  }

  const zip = zipSync(files, { level: 0 });
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(zip), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="gutscheine-${stamp}.zip"`,
    },
  });
}
