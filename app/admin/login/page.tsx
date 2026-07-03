import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin · Black Forest Retreats" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-night px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="font-display text-2xl tracking-wide text-cream-50">
            Black Forest Retreats
          </div>
          <div className="mt-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-brass-300">
            Admin
          </div>
        </div>
        <LoginForm demoHint={process.env.NEXT_PUBLIC_ADMIN_DEMO_HINT ?? ""} />
      </div>
    </div>
  );
}
