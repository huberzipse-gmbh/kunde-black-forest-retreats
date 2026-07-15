import 'server-only';

/**
 * Doppelbelegungs-Alarm: erkannte Kollisionen mit dem bereits Gemeldeten
 * abgleichen und den Betreiber per E-Mail informieren.
 *
 * Läuft nach jedem iCal-Sync — genau dort fällt der typische Fall auf: über
 * Black Forest Retreats wurde gebucht, und im selben Zeitraum hat auch ein
 * Airbnb-Gast gebucht. Bis zum nächsten Sync (max. 30 min) weiß davon niemand;
 * ab dann sollen es beide Kanäle wissen: Dashboard und Postfach.
 *
 * Gemeldet wird nur, was NEU ist. Ein bekannter Konflikt bleibt still, sonst
 * käme alle 30 min dieselbe Mail. Verschwindet er (geklärt), wird die Zeile
 * gelöscht — taucht er später wieder auf, ist das eine neue Warnung wert.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';
import { fetchOccupancy } from './db';
import { conflictKey, findConflicts, KIND_LABEL, type Conflict } from './conflicts';

const COLORS = {
  night: '#0f1813',
  forest: '#1b2a21',
  cream: '#faf7f1',
  creamSoft: '#f3ede2',
  alert: '#b91c1c',
  text: '#2a3e31',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const dateDe = (iso: string): string =>
  new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Klartext-Zusammenfassung eines Konflikts — für Mail und `summary`-Spalte. */
function describe(c: Conflict, retreatName: string): string {
  return (
    `${retreatName}, ${dateDe(c.start)} – ${dateDe(c.end)}: ` +
    `${KIND_LABEL[c.a.kind]} (${c.a.label}) ↔ ${KIND_LABEL[c.b.kind]} (${c.b.label})`
  );
}

interface AlertRow {
  key: string;
  summary: string;
  retreatId: string;
  start: string;
  end: string;
}

function alertHtml(rows: AlertRow[], siteUrl: string): string {
  const items = rows
    .map(
      (r) => `<tr><td style="padding:12px 14px;border:1px solid rgba(185,28,28,.25);border-radius:4px;background:#fef2f2;color:${COLORS.text};font-size:14px;line-height:1.6;">${esc(r.summary)}</td></tr>
      <tr><td style="height:8px;"></td></tr>`,
    )
    .join('');

  const headline =
    rows.length === 1
      ? 'Eine Doppelbelegung erkannt'
      : `${rows.length} Doppelbelegungen erkannt`;

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${COLORS.creamSoft};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.creamSoft};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.cream};border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:${COLORS.night};padding:28px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:22px;letter-spacing:1px;">Black Forest Retreats</div>
            <div style="color:${COLORS.alert};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">Doppelbelegung</div>
          </td>
        </tr>
        <tr><td style="padding:36px 32px;color:${COLORS.text};font-size:15px;line-height:1.6;">
          <div style="font-size:18px;color:${COLORS.forest};margin-bottom:6px;">${headline}</div>
          <p style="margin:0 0 20px;">Dieselbe Wohnung ist zweimal vergeben. Eine der beiden Belegungen muss weichen — je früher, desto günstiger für alle Beteiligten.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
          <p style="margin:22px 0 0;">
            <a href="${siteUrl}/admin" style="display:inline-block;background:${COLORS.forest};color:${COLORS.cream};text-decoration:none;padding:12px 22px;border-radius:3px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Im Dashboard ansehen</a>
          </p>
        </td></tr>
        <tr>
          <td style="background:${COLORS.forest};padding:20px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:12px;opacity:.8;">Automatische Meldung nach dem Kalender-Abgleich</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface ConflictAlertResult {
  /** Aktuell bestehende Konflikte. */
  open: number;
  /** Davon in diesem Lauf neu erkannt. */
  created: number;
  /** Per Mail gemeldet (inkl. Nachzügler aus fehlgeschlagenen Versuchen). */
  notified: number;
}

/**
 * Konflikte abgleichen und neue melden. Wirft nicht — ein Fehler hier darf den
 * iCal-Sync nicht scheitern lassen; die Belegungsdaten sind wichtiger als die
 * Meldung darüber, und der nächste Lauf versucht es erneut.
 */
export async function syncConflictAlerts(): Promise<ConflictAlertResult> {
  const sb = createAdminClient();
  const empty: ConflictAlertResult = { open: 0, created: 0, notified: 0 };

  try {
    const [occupancy, retreatsRes, knownRes] = await Promise.all([
      fetchOccupancy(sb),
      sb.from('retreats').select('id, name_de'),
      sb.from('booking_conflicts').select('key, summary, retreat_id, start_date, end_date, notified_at'),
    ]);

    const retreatNames = new Map<string, string>(
      (retreatsRes.data ?? []).map((r: { id: string; name_de: string }) => [r.id, r.name_de]),
    );
    const conflicts = findConflicts(occupancy);
    const current = new Map(conflicts.map((c) => [conflictKey(c), c]));
    const known = knownRes.data ?? [];
    const knownKeys = new Set(known.map((r: { key: string }) => r.key));

    // Geklärte Konflikte vergessen, damit ein Rückfall wieder meldet.
    const gone = known.filter((r: { key: string }) => !current.has(r.key)).map((r: { key: string }) => r.key);
    if (gone.length > 0) {
      await sb.from('booking_conflicts').delete().in('key', gone);
    }

    // Neu erkannte festhalten (noch ohne notified_at).
    const fresh = [...current.entries()].filter(([key]) => !knownKeys.has(key));
    if (fresh.length > 0) {
      const { error } = await sb.from('booking_conflicts').insert(
        fresh.map(([key, c]) => ({
          key,
          retreat_id: c.retreatId,
          start_date: c.start,
          end_date: c.end,
          summary: describe(c, retreatNames.get(c.retreatId) ?? c.retreatId),
        })),
      );
      if (error) throw error;
    }

    // Alles Unversandte melden — inklusive Nachzügler, deren Mail beim letzten
    // Lauf nicht rausging.
    const pendingKnown = known
      .filter((r: { key: string; notified_at: string | null }) => !r.notified_at && current.has(r.key))
      .map((r: { key: string; summary: string; retreat_id: string; start_date: string; end_date: string }) => ({
        key: r.key,
        summary: r.summary,
        retreatId: r.retreat_id,
        start: r.start_date,
        end: r.end_date,
      }));
    const pending: AlertRow[] = [
      ...fresh.map(([key, c]) => ({
        key,
        summary: describe(c, retreatNames.get(c.retreatId) ?? c.retreatId),
        retreatId: c.retreatId,
        start: c.start,
        end: c.end,
      })),
      ...pendingKnown,
    ];

    const result: ConflictAlertResult = { open: conflicts.length, created: fresh.length, notified: 0 };
    if (pending.length === 0) return result;

    const to = process.env.CONTACT_TO || process.env.EMAIL_FROM;
    if (!to) {
      console.error('[conflicts] Kein Empfänger konfiguriert (CONTACT_TO/EMAIL_FROM) — Warnung nur im Dashboard.');
      return result;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030';
    const subject =
      pending.length === 1
        ? `Doppelbelegung: ${pending[0].summary.split(':')[0]}`
        : `${pending.length} Doppelbelegungen erkannt`;

    const sent = await sendEmail({ to, subject, html: alertHtml(pending, siteUrl) });
    if (!sent.ok) {
      // notified_at bleibt null → nächster Lauf versucht es erneut.
      console.error('[conflicts] Warn-Mail fehlgeschlagen:', sent.error);
      return result;
    }

    await sb
      .from('booking_conflicts')
      .update({ notified_at: new Date().toISOString() })
      .in('key', pending.map((p) => p.key));

    return { ...result, notified: pending.length };
  } catch (err) {
    console.error('[conflicts] Abgleich fehlgeschlagen:', err);
    return empty;
  }
}
