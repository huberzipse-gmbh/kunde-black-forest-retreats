import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin · Black Forest Retreats" };

/**
 * Admin-Layout. Der Zugriffsschutz sitzt in proxy.ts (HMAC-Cookie) —
 * die Login-Seite bringt ihr eigenes Vollbild-Layout mit.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
