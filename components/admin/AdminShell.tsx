"use client";

/**
 * Admin-Gerüst: Sidebar (Desktop) / Bottom-Tabs (Mobil) in Markenfarben.
 * Die Login-Seite rendert ohne Shell (Vollbild).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/buchungen", label: "Buchungen", icon: "☰" },
  { href: "/admin/wohnungen", label: "Wohnungen", icon: "⌂" },
  { href: "/admin/rechnungen", label: "Rechnungen", icon: "¶" },
  { href: "/admin/emails", label: "E-Mails", icon: "✉" },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: "⚙" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-svh bg-cream-100 md:flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-forest-900 md:flex">
        <div className="px-6 py-7">
          <Link href="/admin" className="block">
            <span className="font-display text-lg tracking-wide text-cream-50">
              Black Forest
            </span>
            <span className="mt-0.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-brass-300">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[5px] px-4 py-2.5 font-body text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-cream-50/10 font-semibold text-brass-300"
                  : "text-cream-100/75 hover:bg-cream-50/5 hover:text-cream-50"
              }`}
            >
              <span aria-hidden className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 px-3 pb-6">
          <Link
            href="/"
            className="block rounded-[5px] px-4 py-2.5 font-body text-xs text-cream-100/60 transition-colors hover:text-cream-50"
          >
            → Zur Website
          </Link>
          <button
            type="button"
            onClick={() => adminLogout()}
            className="w-full rounded-[5px] px-4 py-2.5 text-start font-body text-xs text-cream-100/60 transition-colors hover:text-cream-50"
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Inhalt */}
      <main className="min-w-0 flex-1 px-5 py-8 pb-24 md:px-10 md:py-10 md:pb-10">
        {children}
      </main>

      {/* Bottom-Tabs (Mobil) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-forest-900/10 bg-forest-900 py-2 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-body text-[0.6rem] ${
              isActive(item.href) ? "text-brass-300" : "text-cream-100/65"
            }`}
          >
            <span aria-hidden className="text-base leading-none">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
