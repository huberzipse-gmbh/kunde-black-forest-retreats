import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { eur } from "@/lib/admin/format";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";

export default async function AdminRetreatsPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data: retreats } = await sb
    .from("retreats")
    .select("id, name_de, highlight_de, image, base_price_cents, min_nights, max_guests, bookable, sold_out, sold_out_until")
    .order("sort_order");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-forest-900">Wohnungen</h1>
        <Link
          href="/admin/wohnungen/neu"
          className="rounded-[3px] bg-forest-900 px-5 py-3 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800"
        >
          + Wohnung anlegen
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(retreats ?? []).map((r) => (
          <Link
            key={r.id}
            href={`/admin/wohnungen/${r.id}`}
            className="group overflow-hidden rounded-[8px] border border-forest-900/10 bg-white transition-colors hover:border-forest-900/30"
          >
            <div className="relative h-36 bg-forest-900">
              {r.image ? (
                <Image
                  src={r.image}
                  alt={r.name_de}
                  fill
                  sizes="400px"
                  className={`object-cover ${r.sold_out ? "blur-[2px] brightness-75" : ""}`}
                />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-3xl text-cream-50/40">
                  {r.name_de.charAt(0)}
                </div>
              )}
              <div className="absolute start-3 top-3 flex gap-2">
                {r.sold_out ? (
                  <span className="rounded-full bg-night/70 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-cream-50">
                    Ausgebucht {r.sold_out_until ? `bis ${r.sold_out_until}` : ""}
                  </span>
                ) : r.bookable ? (
                  <span className="rounded-full bg-forest-500/90 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-cream-50">
                    Buchbar
                  </span>
                ) : (
                  <span className="rounded-full bg-night/70 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-cream-50">
                    Nicht buchbar
                  </span>
                )}
              </div>
            </div>
            <div className="p-5">
              <div className="font-display text-lg text-forest-900">{r.name_de}</div>
              <div className="mt-0.5 font-body text-xs text-forest-700/60">{r.highlight_de}</div>
              <div className="mt-3 flex items-center justify-between font-body text-sm">
                <span className="font-semibold text-forest-900">{eur(r.base_price_cents)} / Nacht</span>
                <span className="text-forest-700/60">
                  min. {r.min_nights} Nächte · max. {r.max_guests} Gäste
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
