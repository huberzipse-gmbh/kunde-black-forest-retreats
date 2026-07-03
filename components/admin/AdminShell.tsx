"use client";

/**
 * Admin-Gerüst: Sidebar (Desktop) / Bottom-Tabs (Mobil) in Markenfarben.
 * Die Login-Seite rendert ohne Shell (Vollbild).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/admin/actions";

/** Einheitliche Stroke-Icons (24er-Viewbox, Linienstil passend zur Marke). */
function NavIcon({ name, className }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "dashboard": // Balkendiagramm
      return (
        <svg {...common}>
          <path d="M4 20V10M10 20V4M16 20v-8M21 20H3" />
        </svg>
      );
    case "buchungen": // Kalender mit Haken
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5M9 14.5l2.2 2.2 3.8-4" />
        </svg>
      );
    case "wohnungen": // Haus
      return (
        <svg {...common}>
          <path d="M3.5 11.5 12 4l8.5 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M10 19.5v-5h4v5" />
        </svg>
      );
    case "rechnungen": // Euro-Zeichen
      return (
        <svg {...common}>
          <path d="M17.5 6.5a6.5 6.5 0 1 0 0 11" />
          <path d="M4.5 10.5h8M4.5 13.5h8" />
        </svg>
      );
    case "emails": // Umschlag
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
    case "einstellungen": // Schieberegler
      return (
        <svg {...common}>
          <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3" />
          <circle cx="15" cy="7" r="2" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="15" cy="17" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/buchungen", label: "Buchungen", icon: "buchungen" },
  { href: "/admin/wohnungen", label: "Wohnungen", icon: "wohnungen" },
  { href: "/admin/rechnungen", label: "Rechnungen", icon: "rechnungen" },
  { href: "/admin/emails", label: "E-Mails", icon: "emails" },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: "einstellungen" },
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
              <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
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
            className={`flex flex-col items-center gap-1 px-2 py-1 font-body text-[0.6rem] ${
              isActive(item.href) ? "text-brass-300" : "text-cream-100/65"
            }`}
          >
            <NavIcon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
