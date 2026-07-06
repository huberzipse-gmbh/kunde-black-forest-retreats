import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data } = await sb.from("settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-forest-900">Einstellungen</h1>
      <SettingsForm
        initial={{
          cancellation_days: data.cancellation_days,
          vat_rate: Number(data.vat_rate),
          registered_discount_percent: Number(data.registered_discount_percent),
          pay_later_window_days: data.pay_later_window_days,
          issuer_name: data.issuer_name,
          issuer_address: data.issuer_address,
          issuer_phone: data.issuer_phone ?? "",
          issuer_email: data.issuer_email ?? "",
          issuer_vat_id: data.issuer_vat_id ?? "",
          issuer_register: data.issuer_register,
          issuer_managing_director: data.issuer_managing_director ?? "",
          global_discount_name: data.global_discount_name ?? "",
          global_discount_amount_cents: data.global_discount_amount_cents,
          global_discount_percent:
            data.global_discount_percent != null ? Number(data.global_discount_percent) : null,
          global_discount_active: data.global_discount_active,
          promo_code: data.promo_code ?? "",
          promo_percent: data.promo_percent != null ? Number(data.promo_percent) : 0,
          promo_active: Boolean(data.promo_active),
        }}
      />
    </div>
  );
}
