'use server';

/**
 * Server Action des Kontaktformulars. Nimmt die Nachricht entgegen, validiert
 * server-seitig und schickt sie per Resend an das Postfach der Gastgeber
 * (CONTACT_TO, Fallback EMAIL_FROM). Reply-To ist die E-Mail des Absenders,
 * damit eine Antwort direkt beim Gast landet. Jede Mail wird über sendEmail
 * zusätzlich in email_log protokolliert (auch im Demo-Modus einsehbar).
 */
import { z } from 'zod';
import { sendEmail } from '@/lib/email/send';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().min(1).max(4000),
  // Honeypot: von echten Menschen nie ausgefüllt.
  company: z.string().max(0).optional().default(''),
});

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  company?: string;
}

const COLORS = {
  night: '#0f1813',
  forest: '#1b2a21',
  cream: '#faf7f1',
  creamSoft: '#f3ede2',
  brass: '#c9a96a',
  text: '#2a3e31',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(27,42,33,.12);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.forest};opacity:.7;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(27,42,33,.12);text-align:end;font-weight:bold;color:${COLORS.forest};">${value}</td>
  </tr>`;
}

function notificationHtml(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const details = [
    row('Name', esc(data.name)),
    row('E-Mail', esc(data.email)),
    data.phone ? row('Telefon', esc(data.phone)) : '',
  ].join('');
  const message = esc(data.message).replace(/\n/g, '<br>');

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${COLORS.creamSoft};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.creamSoft};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.cream};border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:${COLORS.night};padding:28px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:22px;letter-spacing:1px;">Black Forest Retreats</div>
            <div style="color:${COLORS.brass};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">Neue Nachricht über das Kontaktformular</div>
          </td>
        </tr>
        <tr><td style="padding:36px 32px;color:${COLORS.text};font-size:15px;line-height:1.6;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details}</table>
          <div style="margin-top:22px;padding:16px 18px;background:${COLORS.creamSoft};border-radius:4px;white-space:normal;">${message}</div>
        </td></tr>
        <tr>
          <td style="background:${COLORS.forest};padding:20px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:12px;opacity:.8;">Black Forest Retreats · Neuenbürg</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendContactMessage(
  input: ContactInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid' };
  }
  const { name, email, phone, message, company } = parsed.data;

  // Honeypot ausgefüllt → still „ok" zurückgeben, aber nichts senden.
  if (company) {
    return { ok: true };
  }

  const to = process.env.CONTACT_TO || process.env.EMAIL_FROM;
  if (!to) {
    console.error('[contact] Kein Empfänger konfiguriert (CONTACT_TO/EMAIL_FROM).');
    return { ok: false, error: 'no-recipient' };
  }

  const res = await sendEmail({
    to,
    replyTo: email,
    subject: `Neue Kontaktanfrage von ${name}`,
    html: notificationHtml({ name, email, phone, message }),
  });

  if (!res.ok) {
    return { ok: false, error: res.error ?? 'send-failed' };
  }
  return { ok: true };
}
