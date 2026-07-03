'use server';

/**
 * Admin-Server-Actions. Jede Action prüft zuerst die HMAC-Admin-Session,
 * dann arbeitet sie mit dem Service-Role-Client (umgeht RLS).
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { ADMIN_COOKIE, createAdminToken, verifyAdminToken } from '@/lib/admin/session';
import { mapBooking } from '@/lib/booking/db';
import { canTransition } from '@/lib/booking/stateMachine';
import { getPaymentProvider } from '@/lib/payments';
import { createStornoInvoice } from '@/lib/invoices/create';
import { retreatNameOf } from '@/lib/booking/confirm';
import { runChargeDue, runIcalSync, type CronResult } from '@/lib/booking/cron';

async function assertAdmin(): Promise<void> {
  const store = await cookies();
  const ok = await verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect('/admin/login');
}

/* ── Login / Logout ───────────────────────────────────────────────────────── */

export async function adminLogin(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get('password') ?? '');
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return { error: 'Falsches Passwort.' };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  redirect('/admin');
}

export async function adminLogout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

/* ── Buchungen ────────────────────────────────────────────────────────────── */

export async function cancelBooking(bookingId: string, reason: string): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  try {
    const sb = createAdminClient();
    const { data: row, error } = await sb.from('bookings').select('*').eq('id', bookingId).single();
    if (error || !row) return { ok: false, error: 'Buchung nicht gefunden.' };
    const booking = mapBooking(row);

    const from = { status: booking.status, paymentStatus: booking.paymentStatus };
    const wasPaid = booking.paymentStatus === 'paid';
    const targetPayment = wasPaid ? 'refund_pending' : 'unpaid';
    if (!canTransition(from, { status: 'cancelled', paymentStatus: targetPayment as never })) {
      return { ok: false, error: `Storno aus Status ${from.status}/${from.paymentStatus} nicht möglich.` };
    }

    // Bezahlt → Erstattung anstoßen
    let refunded = false;
    if (wasPaid) {
      const res = await getPaymentProvider().refund(booking);
      refunded = res.ok;
    }

    await sb
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: wasPaid ? (refunded ? 'refunded' : 'refund_pending') : 'unpaid',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    // Kalender freigeben
    await sb.from('availability_blocks').delete().eq('booking_id', bookingId);

    // GoBD: existierende Rechnung → Stornorechnung
    const retreatName = await retreatNameOf(booking.retreatId);
    await createStornoInvoice(booking, retreatName, reason);

    return { ok: true };
  } catch (err) {
    console.error('[admin] cancelBooking:', err);
    return { ok: false, error: 'Storno fehlgeschlagen.' };
  }
}

/* ── Wohnungen ────────────────────────────────────────────────────────────── */

const retreatSchema = z.object({
  id: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  name_de: z.string().trim().min(1),
  highlight_de: z.string().trim(),
  tagline_de: z.string().trim(),
  short_description_de: z.string().trim(),
  description_de: z.string().trim(),
  amenities_de: z.array(z.string().trim().min(1)),
  usps: z.array(z.object({ icon: z.string(), title_de: z.string(), text_de: z.string() })),
  max_guests: z.number().int().min(1).max(50),
  bedrooms: z.number().int().min(0).max(30),
  beds: z.number().int().min(0).max(50),
  bathrooms: z.number().int().min(0).max(20),
  year: z.string().trim(),
  rating: z.string().trim(),
  review_count: z.number().int().min(0),
  superhost: z.boolean(),
  guest_favorite: z.boolean(),
  exclusive: z.boolean(),
  featured: z.boolean(),
  heritage: z.boolean(),
  sold_out: z.boolean(),
  sold_out_until: z.string().trim(),
  accent: z.string().trim(),
  image: z.string().trim(),
  gallery: z.array(z.string().trim().min(1)),
  base_price_cents: z.number().int().min(0),
  cleaning_fee_cents: z.number().int().min(0),
  min_nights: z.number().int().min(1).max(60),
  cancellation_days_override: z.number().int().min(0).nullable(),
  airbnb_url: z.string().trim(),
  airbnb_ical_url: z.string().trim(),
  bookable: z.boolean(),
  sort_order: z.number().int(),
});

export type RetreatFormData = z.infer<typeof retreatSchema>;

export async function upsertRetreat(raw: RetreatFormData): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const parsed = retreatSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Ungültige Eingaben.' };
  const r = parsed.data;
  try {
    const sb = createAdminClient();
    const { error } = await sb.from('retreats').upsert(
      {
        ...r,
        slug: r.id,
        variant: r.image ? '' : 'forest',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    console.error('[admin] upsertRetreat:', err);
    return { ok: false, error: 'Speichern fehlgeschlagen.' };
  }
}

/* ── Preisregeln ──────────────────────────────────────────────────────────── */

const priceRuleSchema = z.object({
  id: z.string().uuid().nullable(),
  retreatId: z.string().min(1),
  name: z.string().trim().min(1),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  nightlyPriceCents: z.number().int().min(0).nullable(),
  discountAmountCents: z.number().int().min(0).nullable(),
  discountPercent: z.number().min(0).max(100).nullable(),
  active: z.boolean(),
});

export type PriceRuleFormData = z.infer<typeof priceRuleSchema>;

export async function upsertPriceRule(raw: PriceRuleFormData): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const parsed = priceRuleSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Ungültige Eingaben.' };
  const r = parsed.data;
  try {
    const sb = createAdminClient();
    const row = {
      retreat_id: r.retreatId,
      name: r.name,
      start_date: r.startDate || null,
      end_date: r.endDate || null,
      nightly_price_cents: r.nightlyPriceCents,
      discount_amount_cents: r.discountAmountCents,
      discount_percent: r.discountPercent,
      active: r.active,
    };
    const { error } = r.id
      ? await sb.from('price_rules').update(row).eq('id', r.id)
      : await sb.from('price_rules').insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Speichern fehlgeschlagen.' };
  }
}

export async function deletePriceRule(id: string): Promise<{ ok: boolean }> {
  await assertAdmin();
  const sb = createAdminClient();
  await sb.from('price_rules').delete().eq('id', id);
  return { ok: true };
}

/* ── Kalender: manuell blocken / freigeben ────────────────────────────────── */

export async function blockDates(
  retreatId: string,
  startDate: string,
  endDate: string,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate) || endDate <= startDate) {
    return { ok: false, error: 'Ungültiger Zeitraum.' };
  }
  const sb = createAdminClient();
  const { error } = await sb.from('availability_blocks').insert({
    retreat_id: retreatId,
    start_date: startDate,
    end_date: endDate,
    source: 'manual',
    note,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function unblockDates(blockId: string): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const sb = createAdminClient();
  // Nur manuelle Blöcke löschen — Buchungen/Airbnb bleiben unangetastet.
  const { error } = await sb
    .from('availability_blocks')
    .delete()
    .eq('id', blockId)
    .eq('source', 'manual');
  return error ? { ok: false, error: error.message } : { ok: true };
}

/* ── Einstellungen ────────────────────────────────────────────────────────── */

const settingsSchema = z.object({
  cancellation_days: z.number().int().min(0).max(365),
  vat_rate: z.number().min(0).max(100),
  registered_discount_percent: z.number().min(0).max(100),
  pay_later_window_days: z.number().int().min(1).max(90),
  issuer_name: z.string().trim().min(1),
  issuer_address: z.string().trim().min(1),
  issuer_phone: z.string().trim(),
  issuer_email: z.string().trim(),
  issuer_vat_id: z.string().trim(),
  issuer_register: z.string().trim(),
  issuer_managing_director: z.string().trim(),
  global_discount_name: z.string().trim(),
  global_discount_amount_cents: z.number().int().min(0).nullable(),
  global_discount_percent: z.number().min(0).max(100).nullable(),
  global_discount_active: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export async function saveSettings(raw: SettingsFormData): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Ungültige Eingaben.' };
  const sb = createAdminClient();
  const { error } = await sb
    .from('settings')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', 1);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/* ── Foto-Upload (Supabase Storage) ───────────────────────────────────────── */

export async function uploadRetreatPhoto(formData: FormData): Promise<{ ok: boolean; url?: string; error?: string }> {
  await assertAdmin();
  const file = formData.get('file');
  const retreatId = String(formData.get('retreatId') ?? 'neu');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Keine Datei.' };
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: 'Datei zu groß (max. 8 MB).' };

  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${retreatId}/${Date.now()}.${ext}`;
  const sb = createAdminClient();
  const { error } = await sb.storage
    .from('retreat-photos')
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || 'image/jpeg',
    });
  if (error) return { ok: false, error: error.message };
  const { data } = sb.storage.from('retreat-photos').getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

/* ── Cron manuell anstoßen ────────────────────────────────────────────────── */

export async function runIcalSyncNow(): Promise<CronResult> {
  await assertAdmin();
  return runIcalSync();
}

export async function runChargeDueNow(): Promise<CronResult> {
  await assertAdmin();
  return runChargeDue();
}
