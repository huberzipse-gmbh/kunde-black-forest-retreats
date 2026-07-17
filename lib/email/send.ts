import 'server-only';

/**
 * E-Mail-Versand: Resend, sobald RESEND_API_KEY gesetzt ist, sonst Demo-Modus.
 * In BEIDEN Fällen wird jede Mail in email_log gespeichert — im Demo-Modus
 * ist /admin/emails damit das einsehbare Postfach für den E2E-Test.
 */
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  bookingId?: string | null;
  attachments?: { filename: string; content: Buffer }[];
  /** Antwortadresse — z. B. beim Kontaktformular die E-Mail des Absenders. */
  replyTo?: string;
}

export function emailMode(): 'resend' | 'demo' {
  return process.env.RESEND_API_KEY ? 'resend' : 'demo';
}

/**
 * Interne Empfänger für Betreiber-Benachrichtigungen (Kontaktformular,
 * neue Buchungen): CONTACT_TO (kommagetrennt), sonst fester Fallback.
 */
export function ownerRecipients(): string[] {
  const fromEnv = (process.env.CONTACT_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length > 0
    ? fromEnv
    : ['rentals@axiecentro.de', 'jasin@huber-zipse.de'];
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; error?: string }> {
  const mode = emailMode();
  let providerId = '';
  let error: string | undefined;

  if (mode === 'resend') {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error: resendError } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? 'Black Forest Retreats <onboarding@resend.dev>',
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        html: input.html,
        attachments: input.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
        })),
      });
      if (resendError) error = resendError.message;
      else providerId = data?.id ?? '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unbekannter Fehler';
    }
  }

  // Immer loggen — Demo-Outbox & Nachvollziehbarkeit.
  try {
    const sb = createAdminClient();
    await sb.from('email_log').insert({
      booking_id: input.bookingId ?? null,
      to_email: Array.isArray(input.to) ? input.to.join(', ') : input.to,
      subject: input.subject,
      html: input.html,
      provider: mode,
      provider_id: providerId,
    });
  } catch (err) {
    console.error('[email] Log fehlgeschlagen:', err);
  }

  if (error) {
    console.error('[email] Versand fehlgeschlagen:', error);
    return { ok: false, error };
  }
  return { ok: true };
}
