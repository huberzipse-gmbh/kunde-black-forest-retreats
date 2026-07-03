"use client";

/**
 * Allgemeine Einstellungen: Buchungsregeln, globale Rabattaktion und die
 * Rechnungsaussteller-Daten (Impressum-Basis; Telefon/USt-IdNr hier pflegen).
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings, type SettingsFormData } from "@/app/admin/actions";

const input =
  "w-full rounded-[4px] border border-forest-900/20 bg-white px-3.5 py-2.5 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";
const label = "mb-1 block font-body text-xs font-semibold text-forest-900";
const card = "rounded-[8px] border border-forest-900/10 bg-white p-5 md:p-6";

export function SettingsForm({ initial }: { initial: SettingsFormData }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<SettingsFormData>) => setForm((f) => ({ ...f, ...patch }));
  const num = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  const save = () => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await saveSettings(form);
      if (!res.ok) setError(res.error ?? "Speichern fehlgeschlagen.");
      else {
        setMessage("Gespeichert. Gilt sofort für neue Buchungen.");
        router.refresh();
      }
    });
  };

  return (
    <div className="mt-6 space-y-5">
      {/* Buchungsregeln */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Buchungsregeln
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className={label}>Kostenlose Stornierung (Tage vor Anreise)</label>
            <input className={input} inputMode="numeric" value={String(form.cancellation_days)} onChange={(e) => set({ cancellation_days: parseInt(e.target.value || "0", 10) })} />
          </div>
          <div>
            <label className={label}>MwSt-Satz (%)</label>
            <input className={input} inputMode="decimal" value={String(form.vat_rate).replace(".", ",")} onChange={(e) => set({ vat_rate: num(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Rabatt registrierte Gäste (%)</label>
            <input className={input} inputMode="decimal" value={String(form.registered_discount_percent).replace(".", ",")} onChange={(e) => set({ registered_discount_percent: num(e.target.value) })} />
          </div>
          <div>
            <label className={label}>„Später zahlen": Abbuchung X Tage vor Anreise</label>
            <input className={input} inputMode="numeric" value={String(form.pay_later_window_days)} onChange={(e) => set({ pay_later_window_days: parseInt(e.target.value || "1", 10) })} />
          </div>
        </div>
      </div>

      {/* Globale Rabattaktion */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Globale Rabattaktion (gilt für alle Wohnungen)
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className={label}>Name (erscheint beim Gast)</label>
            <input className={input} value={form.global_discount_name} onChange={(e) => set({ global_discount_name: e.target.value })} placeholder="z. B. Sommeraktion" />
          </div>
          <div>
            <label className={label}>Rabatt pro Nacht (€)</label>
            <input
              className={input}
              inputMode="decimal"
              value={form.global_discount_amount_cents != null ? String(form.global_discount_amount_cents / 100) : ""}
              onChange={(e) =>
                set({
                  global_discount_amount_cents:
                    e.target.value.trim() === "" ? null : Math.round(num(e.target.value) * 100),
                })
              }
            />
          </div>
          <div>
            <label className={label}>Rabatt (%)</label>
            <input
              className={input}
              inputMode="decimal"
              value={form.global_discount_percent != null ? String(form.global_discount_percent).replace(".", ",") : ""}
              onChange={(e) =>
                set({ global_discount_percent: e.target.value.trim() === "" ? null : num(e.target.value) })
              }
            />
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 font-body text-sm text-forest-900">
          <input type="checkbox" checked={form.global_discount_active} onChange={(e) => set({ global_discount_active: e.target.checked })} className="h-4 w-4 accent-forest-900" />
          Aktion ist aktiv
        </label>
      </div>

      {/* Rechnungsaussteller */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Rechnungsaussteller (GoBD)
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Firma</label>
            <input className={input} value={form.issuer_name} onChange={(e) => set({ issuer_name: e.target.value })} />
          </div>
          <div>
            <label className={label}>Geschäftsführer</label>
            <input className={input} value={form.issuer_managing_director} onChange={(e) => set({ issuer_managing_director: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Anschrift</label>
            <textarea className={`${input} min-h-20`} value={form.issuer_address} onChange={(e) => set({ issuer_address: e.target.value })} />
          </div>
          <div>
            <label className={label}>Telefon</label>
            <input className={input} value={form.issuer_phone} onChange={(e) => set({ issuer_phone: e.target.value })} />
          </div>
          <div>
            <label className={label}>E-Mail</label>
            <input className={input} value={form.issuer_email} onChange={(e) => set({ issuer_email: e.target.value })} />
          </div>
          <div>
            <label className={label}>USt-IdNr.</label>
            <input className={input} value={form.issuer_vat_id} onChange={(e) => set({ issuer_vat_id: e.target.value })} placeholder="DE…" />
          </div>
          <div>
            <label className={label}>Registereintrag</label>
            <input className={input} value={form.issuer_register} onChange={(e) => set({ issuer_register: e.target.value })} />
          </div>
        </div>
        <p className="mt-3 font-body text-xs text-forest-700/55">
          Diese Daten werden bei jeder Rechnung als Snapshot eingefroren — Änderungen wirken nur auf künftige Rechnungen.
        </p>
      </div>

      {error && <p className="font-body text-sm text-red-800">{error}</p>}
      {message && <p className="font-body text-sm text-forest-900">{message}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={save}
        className="rounded-[3px] bg-forest-900 px-6 py-3 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-40"
      >
        {isPending ? "Speichere …" : "Einstellungen speichern"}
      </button>
    </div>
  );
}
