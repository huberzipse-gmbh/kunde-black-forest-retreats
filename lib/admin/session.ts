/**
 * Admin-Session: HMAC-signiertes Cookie (Web Crypto, edge-tauglich — läuft
 * identisch in proxy.ts und in Server Actions, ganz ohne DB-Roundtrip).
 * Wert: <ablauf-ts>.<hmac(ablauf-ts)>, Geheimnis aus ADMIN_SESSION_SECRET.
 */

export const ADMIN_COOKIE = 'bfr_admin';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? 'bfr-dev-secret';
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Neues Session-Token (7 Tage gültig). */
export async function createAdminToken(): Promise<string> {
  const expires = String(Date.now() + WEEK_MS);
  return `${expires}.${await hmac(expires)}`;
}

/** Token prüfen (Signatur + Ablauf). */
export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expires, sig] = token.split('.');
  if (!expires || !sig) return false;
  if (Number(expires) < Date.now()) return false;
  return (await hmac(expires)) === sig;
}
