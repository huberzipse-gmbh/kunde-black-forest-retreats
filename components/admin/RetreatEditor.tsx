"use client";

/**
 * Wohnungs-Editor mit vier Tabs:
 *  Stammdaten (Inhalte wie auf der Website) · Preise & Rabatte (Airbnb-Modell)
 *  · Kalender (Belegung + manuelles Blocken) · iCal (Airbnb-Sync).
 * Alle Änderungen wirken sofort auf die Website (Seiten sind dynamisch).
 */
import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  blockDates,
  deletePriceRule,
  unblockDates,
  uploadRetreatPhoto,
  upsertPriceRule,
  upsertRetreat,
  type RetreatFormData,
} from "@/app/admin/actions";
import type { PriceRule } from "@/lib/booking/types";
import { dateDe, eur } from "@/lib/admin/format";

/* eslint-disable @typescript-eslint/no-explicit-any */

const USP_ICONS = [
  "castle", "key", "parking", "sparkle", "beams", "bath", "wifi", "waves",
  "group", "kitchen", "location", "stairs", "building", "arch", "terrace",
] as const;

const ICON_LABEL: Record<string, string> = {
  castle: "Schloss", key: "Schlüssel", parking: "Parken", sparkle: "Sauber",
  beams: "Fachwerk", bath: "Bad", wifi: "WLAN", waves: "Wasser", group: "Gruppe",
  kitchen: "Küche", location: "Lage", stairs: "Etagen", building: "Gebäude",
  arch: "Bögen", terrace: "Terrasse",
};

export interface EditorBlock {
  id: string;
  start: string;
  end: string;
  source: "booking" | "airbnb-ical" | "manual";
  note: string;
}

interface Props {
  retreat: any | null; // DB-Row (snake_case) oder null = neu anlegen
  rules: PriceRule[];
  blocks: EditorBlock[];
  exportUrl: string | null;
}

type Tab = "stammdaten" | "preise" | "kalender" | "ical";

const input =
  "w-full rounded-[4px] border border-forest-900/20 bg-white px-3.5 py-2.5 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";
const label = "mb-1 block font-body text-xs font-semibold text-forest-900";
const card = "rounded-[8px] border border-forest-900/10 bg-white p-5 md:p-6";
const primaryBtn =
  "rounded-[3px] bg-forest-900 px-6 py-3 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-40";
const outlineBtn =
  "rounded-[3px] border border-forest-900/25 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900";

export function RetreatEditor({ retreat, rules, blocks, exportUrl }: Props) {
  const router = useRouter();
  const isNew = !retreat;
  const [tab, setTab] = useState<Tab>("stammdaten");
  const [message, setMessage] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; disabled?: boolean }[] = [
    { key: "stammdaten", label: "Stammdaten" },
    { key: "preise", label: "Preise & Rabatte", disabled: isNew },
    { key: "kalender", label: "Kalender", disabled: isNew },
    { key: "ical", label: "Airbnb-Sync", disabled: isNew },
  ];

  return (
    <div className="max-w-4xl">
      <Link href="/admin/wohnungen" className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60 hover:text-forest-900">
        ← Wohnungen
      </Link>
      <h1 className="mt-3 font-display text-3xl text-forest-900">
        {isNew ? "Neue Wohnung" : retreat.name_de}
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={t.disabled}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-colors ${
              tab === t.key
                ? "bg-forest-900 text-cream-50"
                : "border border-forest-900/15 text-forest-900 hover:border-forest-900/40 disabled:opacity-35"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="mt-5 rounded-[6px] bg-forest-900/5 px-4 py-3 font-body text-sm text-forest-900">
          {message}
        </div>
      )}

      <div className="mt-6">
        {tab === "stammdaten" && (
          <MasterDataTab retreat={retreat} onSaved={(msg) => { setMessage(msg); router.refresh(); }} />
        )}
        {tab === "preise" && retreat && (
          <PricingTab retreat={retreat} rules={rules} onSaved={(msg) => { setMessage(msg); router.refresh(); }} />
        )}
        {tab === "kalender" && retreat && (
          <CalendarTab retreatId={retreat.id} blocks={blocks} onChanged={() => router.refresh()} />
        )}
        {tab === "ical" && retreat && (
          <IcalTab retreat={retreat} exportUrl={exportUrl} onSaved={(msg) => { setMessage(msg); router.refresh(); }} />
        )}
      </div>
    </div>
  );
}

/* ── Tab 1: Stammdaten ────────────────────────────────────────────────────── */

function MasterDataTab({ retreat, onSaved }: { retreat: any | null; onSaved: (msg: string) => void }) {
  const router = useRouter();
  const isNew = !retreat;
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(() => ({
    id: retreat?.id ?? "",
    name_de: retreat?.name_de ?? "",
    highlight_de: retreat?.highlight_de ?? "",
    tagline_de: retreat?.tagline_de ?? "",
    short_description_de: retreat?.short_description_de ?? "",
    description_de: retreat?.description_de ?? "",
    amenities_de: (retreat?.amenities_de ?? []) as string[],
    usps: (retreat?.usps ?? []) as { icon: string; title_de: string; text_de: string }[],
    max_guests: retreat?.max_guests ?? 4,
    bedrooms: retreat?.bedrooms ?? 2,
    beds: retreat?.beds ?? 2,
    bathrooms: retreat?.bathrooms ?? 1,
    year: retreat?.year ?? "",
    rating: retreat?.rating ?? "",
    review_count: retreat?.review_count ?? 0,
    superhost: retreat?.superhost ?? false,
    guest_favorite: retreat?.guest_favorite ?? false,
    exclusive: retreat?.exclusive ?? false,
    featured: retreat?.featured ?? false,
    heritage: retreat?.heritage ?? false,
    sold_out: retreat?.sold_out ?? false,
    sold_out_until: retreat?.sold_out_until ?? "",
    accent: retreat?.accent ?? "brass",
    image: retreat?.image ?? "",
    gallery: (retreat?.gallery ?? []) as string[],
    base_price_cents: retreat?.base_price_cents ?? 20000,
    cleaning_fee_cents: retreat?.cleaning_fee_cents ?? 0,
    min_nights: retreat?.min_nights ?? 2,
    cancellation_days_override: retreat?.cancellation_days_override ?? null,
    airbnb_url: retreat?.airbnb_url ?? "",
    airbnb_ical_url: retreat?.airbnb_ical_url ?? "",
    bookable: retreat?.bookable ?? true,
    sort_order: retreat?.sort_order ?? 100,
  }));

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const save = () => {
    setError(null);
    const id =
      form.id ||
      form.name_de
        .toLowerCase()
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    if (!id || !form.name_de) {
      setError("Name ist Pflicht.");
      return;
    }
    startTransition(async () => {
      const res = await upsertRetreat({ ...form, id } as RetreatFormData);
      if (!res.ok) {
        setError(res.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      onSaved("Gespeichert. Die Website zeigt die Änderungen sofort.");
      if (isNew) router.push(`/admin/wohnungen/${id}`);
    });
  };

  const upload = async (files: FileList | null, asCover: boolean) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("retreatId", form.id || "neu");
        const res = await uploadRetreatPhoto(fd);
        if (!res.ok || !res.url) throw new Error(res.error ?? "Upload fehlgeschlagen");
        if (asCover) set({ image: res.url });
        else setForm((f) => ({ ...f, gallery: [...f.gallery, res.url!] }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Basis */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Basis</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Name</label>
            <input className={input} value={form.name_de} onChange={(e) => set({ name_de: e.target.value })} />
          </div>
          <div>
            <label className={label}>Übertitel (z. B. „Penthouse · Blick aufs Schloss")</label>
            <input className={input} value={form.highlight_de} onChange={(e) => set({ highlight_de: e.target.value })} />
          </div>
          <div>
            <label className={label}>Tagline (z. B. „Unser Beliebtestes")</label>
            <input className={input} value={form.tagline_de} onChange={(e) => set({ tagline_de: e.target.value })} />
          </div>
          <div>
            <label className={label}>Baujahr</label>
            <input className={input} value={form.year} onChange={(e) => set({ year: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Kurzbeschreibung (Karte)</label>
            <textarea className={`${input} min-h-20`} value={form.short_description_de} onChange={(e) => set({ short_description_de: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Überblick (Detailseite)</label>
            <textarea className={`${input} min-h-32`} value={form.description_de} onChange={(e) => set({ description_de: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Eckdaten + Bewertung + Labels */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Eckdaten, Bewertung & Labels
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(
            [
              ["Schlafzimmer", "bedrooms"],
              ["Betten", "beds"],
              ["Bäder", "bathrooms"],
              ["Max. Gäste", "max_guests"],
            ] as const
          ).map(([lbl, key]) => (
            <div key={key}>
              <label className={label}>{lbl}</label>
              <input
                type="number"
                min={0}
                className={input}
                value={form[key]}
                onChange={(e) => set({ [key]: parseInt(e.target.value || "0", 10) } as never)}
              />
            </div>
          ))}
          <div>
            <label className={label}>Bewertung (z. B. 4,89)</label>
            <input className={input} value={form.rating} onChange={(e) => set({ rating: e.target.value })} />
          </div>
          <div>
            <label className={label}>Anzahl Bewertungen</label>
            <input type="number" min={0} className={input} value={form.review_count} onChange={(e) => set({ review_count: parseInt(e.target.value || "0", 10) })} />
          </div>
          <div>
            <label className={label}>Sortierung</label>
            <input type="number" className={input} value={form.sort_order} onChange={(e) => set({ sort_order: parseInt(e.target.value || "0", 10) })} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {(
            [
              ["Gästefavorit", "guest_favorite"],
              ["Superhost", "superhost"],
              ["Exklusiv", "exclusive"],
              ["Hervorgehoben", "featured"],
              ["Denkmalgeschützt", "heritage"],
              ["Buchbar", "bookable"],
              ["Ausgebucht", "sold_out"],
            ] as const
          ).map(([lbl, key]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 font-body text-sm text-forest-900">
              <input
                type="checkbox"
                checked={form[key] as boolean}
                onChange={(e) => set({ [key]: e.target.checked } as never)}
                className="h-4 w-4 accent-forest-900"
              />
              {lbl}
            </label>
          ))}
          {form.sold_out && (
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-forest-900">bis</span>
              <input
                className={`${input} w-24`}
                placeholder="2027"
                value={form.sold_out_until}
                onChange={(e) => set({ sold_out_until: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Was uns besonders macht */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
            Was uns besonders macht (max. 4)
          </h2>
          {form.usps.length < 4 && (
            <button
              type="button"
              className={outlineBtn}
              onClick={() => set({ usps: [...form.usps, { icon: "sparkle", title_de: "", text_de: "" }] })}
            >
              + Punkt
            </button>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {form.usps.map((usp, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-[6px] border border-forest-900/10 p-4 md:grid-cols-[140px_1fr_1fr_auto]">
              <div>
                <label className={label}>Icon</label>
                <select
                  className={input}
                  value={usp.icon}
                  onChange={(e) => {
                    const usps = [...form.usps];
                    usps[i] = { ...usp, icon: e.target.value };
                    set({ usps });
                  }}
                >
                  {USP_ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ICON_LABEL[ic] ?? ic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Titel</label>
                <input
                  className={input}
                  value={usp.title_de}
                  onChange={(e) => {
                    const usps = [...form.usps];
                    usps[i] = { ...usp, title_de: e.target.value };
                    set({ usps });
                  }}
                />
              </div>
              <div>
                <label className={label}>Text</label>
                <input
                  className={input}
                  value={usp.text_de}
                  onChange={(e) => {
                    const usps = [...form.usps];
                    usps[i] = { ...usp, text_de: e.target.value };
                    set({ usps });
                  }}
                />
              </div>
              <button
                type="button"
                aria-label="Entfernen"
                className="self-end pb-2 font-body text-sm text-red-800 hover:underline"
                onClick={() => set({ usps: form.usps.filter((_, j) => j !== i) })}
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ausstattung */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Ausstattung</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {form.amenities_de.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-3.5 py-1.5 font-body text-sm text-forest-900">
              {a}
              <button
                type="button"
                aria-label={`${a} entfernen`}
                className="text-forest-700/50 hover:text-red-800"
                onClick={() => set({ amenities_de: form.amenities_de.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <AmenityAdder onAdd={(v) => set({ amenities_de: [...form.amenities_de, v] })} />
      </div>

      {/* Fotos */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Fotos</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {form.image && (
            <div className="relative aspect-square overflow-hidden rounded-[6px] ring-2 ring-brass-400">
              <Image src={form.image} alt="Cover" fill sizes="120px" className="object-cover" />
              <span className="absolute bottom-1 start-1 rounded bg-night/70 px-1.5 py-0.5 font-body text-[0.55rem] font-semibold uppercase text-cream-50">
                Cover
              </span>
            </div>
          )}
          {form.gallery.map((src, i) => (
            <div key={src + i} className="group relative aspect-square overflow-hidden rounded-[6px]">
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              <div className="absolute inset-0 hidden items-center justify-center gap-1.5 bg-night/55 group-hover:flex">
                <button
                  type="button"
                  title="Als Cover"
                  className="rounded bg-cream-50 px-2 py-1 font-body text-[0.6rem] font-semibold"
                  onClick={() => set({ image: src })}
                >
                  Cover
                </button>
                <button
                  type="button"
                  title="Entfernen"
                  className="rounded bg-red-800 px-2 py-1 font-body text-[0.6rem] font-semibold text-white"
                  onClick={() => set({ gallery: form.gallery.filter((_, j) => j !== i) })}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files, false)} />
          <button type="button" className={outlineBtn} disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? "Lade hoch …" : "+ Fotos hochladen"}
          </button>
          <span className="font-body text-xs text-forest-700/55">
            Erstes Foto als Cover markieren; Galerie erscheint auf der Detailseite.
          </span>
        </div>
      </div>

      {/* Airbnb-Link */}
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Airbnb</h2>
        <div className="mt-4">
          <label className={label}>Airbnb-Inserats-URL (Sekundärlink auf der Website)</label>
          <input className={input} value={form.airbnb_url} onChange={(e) => set({ airbnb_url: e.target.value })} placeholder="https://www.airbnb.de/rooms/…" />
        </div>
      </div>

      {error && <p className="font-body text-sm text-red-800">{error}</p>}
      <button type="button" className={primaryBtn} disabled={isPending} onClick={save}>
        {isPending ? "Speichere …" : isNew ? "Wohnung anlegen" : "Speichern"}
      </button>
    </div>
  );
}

function AmenityAdder({ onAdd }: { onAdd: (v: string) => void }) {
  const [value, setValue] = useState("");
  const add = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
  };
  return (
    <div className="mt-4 flex gap-2">
      <input
        className={input}
        value={value}
        placeholder="z. B. Siebträger-Maschine"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
      />
      <button type="button" className={outlineBtn} onClick={add}>
        Hinzufügen
      </button>
    </div>
  );
}

/* ── Tab 2: Preise & Rabatte ──────────────────────────────────────────────── */

function PricingTab({ retreat, rules, onSaved }: { retreat: any; rules: PriceRule[]; onSaved: (msg: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const [base, setBase] = useState(String(retreat.base_price_cents / 100));
  const [cleaning, setCleaning] = useState(String(retreat.cleaning_fee_cents / 100));
  const [minNights, setMinNights] = useState(String(retreat.min_nights));
  const [cancelOverride, setCancelOverride] = useState(
    retreat.cancellation_days_override != null ? String(retreat.cancellation_days_override) : "",
  );
  const [error, setError] = useState<string | null>(null);

  const saveBase = () => {
    setError(null);
    startTransition(async () => {
      const res = await upsertRetreat({
        ...retreatToForm(retreat),
        base_price_cents: Math.round(parseFloat(base.replace(",", ".")) * 100) || 0,
        cleaning_fee_cents: Math.round(parseFloat(cleaning.replace(",", ".")) * 100) || 0,
        min_nights: parseInt(minNights, 10) || 1,
        cancellation_days_override: cancelOverride === "" ? null : parseInt(cancelOverride, 10),
      });
      if (!res.ok) setError(res.error ?? "Fehler");
      else onSaved("Preise gespeichert.");
    });
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">Grundpreis</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className={label}>Preis pro Nacht (€)</label>
            <input className={input} value={base} onChange={(e) => setBase(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <label className={label}>Reinigung (€, einmalig)</label>
            <input className={input} value={cleaning} onChange={(e) => setCleaning(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <label className={label}>Mindestnächte</label>
            <input className={input} value={minNights} onChange={(e) => setMinNights(e.target.value)} inputMode="numeric" />
          </div>
          <div>
            <label className={label}>Storno-Tage (leer = global)</label>
            <input className={input} value={cancelOverride} onChange={(e) => setCancelOverride(e.target.value)} inputMode="numeric" placeholder="global" />
          </div>
        </div>
        {error && <p className="mt-3 font-body text-sm text-red-800">{error}</p>}
        <button type="button" className={`${primaryBtn} mt-5`} disabled={isPending} onClick={saveBase}>
          {isPending ? "Speichere …" : "Speichern"}
        </button>
      </div>

      <PriceRuleEditor retreatId={retreat.id} rules={rules} onSaved={onSaved} />
    </div>
  );
}

/** DB-Row → Formulardaten für upsertRetreat (unveränderte Felder durchreichen). */
function retreatToForm(r: any): RetreatFormData {
  return {
    id: r.id,
    name_de: r.name_de,
    highlight_de: r.highlight_de ?? "",
    tagline_de: r.tagline_de ?? "",
    short_description_de: r.short_description_de ?? "",
    description_de: r.description_de ?? "",
    amenities_de: r.amenities_de ?? [],
    usps: r.usps ?? [],
    max_guests: r.max_guests,
    bedrooms: r.bedrooms,
    beds: r.beds,
    bathrooms: r.bathrooms,
    year: r.year ?? "",
    rating: r.rating ?? "",
    review_count: r.review_count ?? 0,
    superhost: r.superhost,
    guest_favorite: r.guest_favorite,
    exclusive: r.exclusive,
    featured: r.featured,
    heritage: r.heritage,
    sold_out: r.sold_out,
    sold_out_until: r.sold_out_until ?? "",
    accent: r.accent ?? "brass",
    image: r.image ?? "",
    gallery: r.gallery ?? [],
    base_price_cents: r.base_price_cents,
    cleaning_fee_cents: r.cleaning_fee_cents,
    min_nights: r.min_nights,
    cancellation_days_override: r.cancellation_days_override,
    airbnb_url: r.airbnb_url ?? "",
    airbnb_ical_url: r.airbnb_ical_url ?? "",
    bookable: r.bookable,
    sort_order: r.sort_order ?? 100,
  };
}

function PriceRuleEditor({ retreatId, rules, onSaved }: { retreatId: string; rules: PriceRule[]; onSaved: (msg: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Partial<PriceRule> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [percent, setPercent] = useState("");

  const openNew = () => {
    setEditing({});
    setName("");
    setStartDate("");
    setEndDate("");
    setPrice("");
    setAmount("");
    setPercent("");
    setError(null);
  };
  const openEdit = (r: PriceRule) => {
    setEditing(r);
    setName(r.name);
    setStartDate(r.startDate ?? "");
    setEndDate(r.endDate ?? "");
    setPrice(r.nightlyPriceCents != null ? String(r.nightlyPriceCents / 100) : "");
    setAmount(r.discountAmountCents != null ? String(r.discountAmountCents / 100) : "");
    setPercent(r.discountPercent != null ? String(r.discountPercent) : "");
    setError(null);
  };

  const save = () => {
    setError(null);
    const toCents = (v: string) =>
      v.trim() === "" ? null : Math.round(parseFloat(v.replace(",", ".")) * 100);
    const pct = percent.trim() === "" ? null : parseFloat(percent.replace(",", "."));
    if (!name.trim()) {
      setError("Name ist Pflicht (erscheint als Rabattzeile beim Gast).");
      return;
    }
    if (toCents(price) == null && toCents(amount) == null && pct == null) {
      setError("Mindestens Preis, Rabattbetrag oder Prozent angeben.");
      return;
    }
    startTransition(async () => {
      const res = await upsertPriceRule({
        id: (editing as PriceRule)?.id ?? null,
        retreatId,
        name: name.trim(),
        startDate: startDate || null,
        endDate: endDate || null,
        nightlyPriceCents: toCents(price),
        discountAmountCents: toCents(amount),
        discountPercent: pct,
        active: true,
      });
      if (!res.ok) setError(res.error ?? "Fehler");
      else {
        setEditing(null);
        onSaved("Preisregel gespeichert.");
      }
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deletePriceRule(id);
      onSaved("Preisregel gelöscht.");
    });
  };

  const ruleSummary = (r: PriceRule) => {
    const parts: string[] = [];
    if (r.nightlyPriceCents != null) parts.push(`Preis ${eur(r.nightlyPriceCents)}/Nacht`);
    if (r.discountAmountCents != null) parts.push(`−${eur(r.discountAmountCents)}/Nacht`);
    if (r.discountPercent != null) parts.push(`−${String(r.discountPercent).replace(".", ",")} %`);
    const range =
      r.startDate || r.endDate
        ? `${r.startDate ? dateDe(r.startDate) : "ab sofort"} bis ${r.endDate ? dateDe(r.endDate) : "unbefristet"}`
        : "unbefristet";
    return `${parts.join(" · ")} · ${range}`;
  };

  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Preisregeln & benannte Rabatte (Zeiträume wie bei Airbnb)
        </h2>
        <button type="button" className={outlineBtn} onClick={openNew}>
          + Regel
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {rules.length === 0 && (
          <p className="font-body text-sm text-forest-700/60">Noch keine Regeln. Der Grundpreis gilt für alle Nächte.</p>
        )}
        {rules.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-forest-900/10 px-4 py-3">
            <div>
              <div className="font-body text-sm font-semibold text-forest-900">{r.name}</div>
              <div className="font-body text-xs text-forest-700/65">{ruleSummary(r)}</div>
            </div>
            <div className="flex gap-3">
              <button type="button" className="font-body text-xs font-semibold text-brass-600 hover:underline" onClick={() => openEdit(r)}>
                Bearbeiten
              </button>
              <button type="button" className="font-body text-xs font-semibold text-red-800 hover:underline" disabled={isPending} onClick={() => remove(r.id)}>
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <div className="mt-5 rounded-[6px] border border-forest-900/15 bg-cream-50 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-3">
              <label className={label}>Name (erscheint beim Gast, z. B. „Eröffnungsrabatt")</label>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className={label}>Von (leer = ab sofort)</label>
              <input type="date" className={input} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className={label}>Bis (leer = unbefristet)</label>
              <input type="date" className={input} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <label className={label}>Nachtpreis im Zeitraum (€)</label>
              <input className={input} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="leer = Grundpreis" />
            </div>
            <div>
              <label className={label}>Rabatt pro Nacht (€)</label>
              <input className={input} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="z. B. 50" />
            </div>
            <div>
              <label className={label}>Rabatt in Prozent</label>
              <input className={input} value={percent} onChange={(e) => setPercent(e.target.value)} inputMode="decimal" placeholder="alternativ zu €" />
            </div>
          </div>
          {error && <p className="mt-3 font-body text-sm text-red-800">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button type="button" className={primaryBtn} disabled={isPending} onClick={save}>
              {isPending ? "Speichere …" : "Regel speichern"}
            </button>
            <button type="button" className={outlineBtn} onClick={() => setEditing(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab 3: Kalender ──────────────────────────────────────────────────────── */

function CalendarTab({ retreatId, blocks, onChanged }: { retreatId: string; blocks: EditorBlock[]; onChanged: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sourceLabel: Record<EditorBlock["source"], string> = {
    booking: "Buchung",
    "airbnb-ical": "Airbnb",
    manual: "Manuell",
  };
  const sourceClass: Record<EditorBlock["source"], string> = {
    booking: "bg-brass-400/25 text-brass-600",
    "airbnb-ical": "bg-bark-100 text-bark-700",
    manual: "bg-cream-100 text-forest-700",
  };

  const sorted = useMemo(() => [...blocks].sort((a, b) => (a.start < b.start ? -1 : 1)), [blocks]);

  const block = () => {
    setError(null);
    startTransition(async () => {
      const res = await blockDates(retreatId, start, end, note.trim());
      if (!res.ok) {
        setError(res.error ?? "Fehler");
        return;
      }
      setStart("");
      setEnd("");
      setNote("");
      onChanged();
    });
  };

  const unblock = (id: string) => {
    startTransition(async () => {
      await unblockDates(id);
      onChanged();
    });
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Zeitraum manuell blocken
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
          <div>
            <label className={label}>Von (erste gesperrte Nacht)</label>
            <input type="date" className={input} value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className={label}>Bis (Checkout-Tag, frei)</label>
            <input type="date" className={input} value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div>
            <label className={label}>Notiz</label>
            <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="z. B. Renovierung" />
          </div>
          <button type="button" className={`${primaryBtn} self-end`} disabled={isPending || !start || !end} onClick={block}>
            Blocken
          </button>
        </div>
        {error && <p className="mt-3 font-body text-sm text-red-800">{error}</p>}
      </div>

      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          Belegung (ab heute)
        </h2>
        {sorted.length === 0 ? (
          <p className="mt-3 font-body text-sm text-forest-700/60">Aktuell keine Sperrzeiten oder Buchungen.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {sorted.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-forest-900/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold ${sourceClass[b.source]}`}>
                    {sourceLabel[b.source]}
                  </span>
                  <span className="font-body text-sm text-forest-900">
                    {dateDe(b.start)} → {dateDe(b.end)}
                  </span>
                  {b.note && <span className="font-body text-xs text-forest-700/60">{b.note}</span>}
                </div>
                {b.source === "manual" && (
                  <button type="button" className="font-body text-xs font-semibold text-red-800 hover:underline" disabled={isPending} onClick={() => unblock(b.id)}>
                    Freigeben
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tab 4: Airbnb-Sync (iCal) ────────────────────────────────────────────── */

function IcalTab({ retreat, exportUrl, onSaved }: { retreat: any; exportUrl: string | null; onSaved: (msg: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const [importUrl, setImportUrl] = useState(retreat.airbnb_ical_url ?? "");
  const [copied, setCopied] = useState(false);

  const save = () => {
    startTransition(async () => {
      const res = await upsertRetreat({ ...retreatToForm(retreat), airbnb_ical_url: importUrl.trim() });
      onSaved(res.ok ? "Import-URL gespeichert. Der Sync läuft automatisch (alle 30 Minuten)." : (res.error ?? "Fehler"));
    });
  };

  const copy = async () => {
    if (!exportUrl) return;
    await navigator.clipboard.writeText(exportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          1 · Airbnb-Kalender importieren (Airbnb → Website)
        </h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-forest-700/80">
          Bei Airbnb unter <em>Kalender → Verfügbarkeit → Kalender exportieren</em> die iCal-URL
          kopieren und hier einfügen. Airbnb-Buchungen sperren dann automatisch den Kalender der Website.
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            className={input}
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://www.airbnb.de/calendar/ical/…ics"
          />
          <button type="button" className={primaryBtn} disabled={isPending} onClick={save}>
            {isPending ? "Speichere …" : "Speichern"}
          </button>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
          2 · Unseren Kalender bei Airbnb importieren (Website → Airbnb)
        </h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-forest-700/80">
          Diese URL bei Airbnb unter <em>Kalender → Verfügbarkeit → Kalender importieren</em> eintragen.
          Direktbuchungen der Website sperren dann automatisch den Airbnb-Kalender.
        </p>
        {exportUrl && (
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input className={`${input} text-forest-700/80`} readOnly value={exportUrl} onFocus={(e) => e.target.select()} />
            <button type="button" className={outlineBtn} onClick={copy}>
              {copied ? "Kopiert ✓" : "Kopieren"}
            </button>
          </div>
        )}
        <p className="mt-3 font-body text-xs text-forest-700/55">
          Hinweis: Airbnb aktualisiert importierte Kalender nur alle paar Stunden — kein Echtzeit-Sync.
        </p>
      </div>
    </div>
  );
}
