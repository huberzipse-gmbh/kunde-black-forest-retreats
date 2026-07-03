import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { RetreatEditor } from "@/components/admin/RetreatEditor";

export default function AdminNewRetreatPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  return <RetreatEditor retreat={null} rules={[]} blocks={[]} exportUrl={null} />;
}
