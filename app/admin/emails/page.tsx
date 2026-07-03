import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { emailMode } from "@/lib/email/send";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { EmailOutbox } from "@/components/admin/EmailOutbox";

export default async function AdminEmailsPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data: emails } = await sb
    .from("email_log")
    .select("id, to_email, subject, html, provider, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-900">E-Mails</h1>
      <p className="mt-2 font-body text-sm text-forest-700/70">
        {emailMode() === "demo"
          ? "Demo-Modus: E-Mails werden nicht versendet, sondern landen hier als Postfach."
          : "Versand über Resend. Jede Mail wird zusätzlich hier protokolliert."}
      </p>
      <div className="mt-6">
        <EmailOutbox
          emails={(emails ?? []).map((e) => ({
            id: e.id,
            to: e.to_email,
            subject: e.subject,
            html: e.html,
            provider: e.provider,
            createdAt: e.created_at,
          }))}
        />
      </div>
    </div>
  );
}
