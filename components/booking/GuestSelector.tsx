"use client";

/**
 * Gäste-Auswahl (Erwachsene / Kinder / Kleinkinder) mit Steppern.
 * Erwachsene + Kinder zählen gegen maxGuests; Kleinkinder nicht (Airbnb-Logik).
 */
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";

export interface GuestSelection {
  adults: number;
  children: number;
  infants: number;
}

interface Props {
  maxGuests: number;
  value: GuestSelection;
  onChange: (v: GuestSelection) => void;
}

export function GuestSelector({ maxGuests, value, onChange }: Props) {
  const t = useStrings().bookingFlow.guests;
  const locale = useLocale();
  const counted = value.adults + value.children;

  const rows: {
    key: keyof GuestSelection;
    label: string;
    hint: string;
    min: number;
    canAdd: boolean;
  }[] = [
    { key: "adults", label: t.adults, hint: t.adultsHint, min: 1, canAdd: counted < maxGuests },
    { key: "children", label: t.children, hint: t.childrenHint, min: 0, canAdd: counted < maxGuests },
    { key: "infants", label: t.infants, hint: t.infantsHint, min: 0, canAdd: value.infants < 5 },
  ];

  const stepBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/20 font-display text-lg text-forest-900 transition-colors hover:border-forest-900 disabled:opacity-25 disabled:hover:border-forest-900/20";

  return (
    <div className="divide-y divide-forest-900/10">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center justify-between py-4">
          <div>
            <div className="font-body text-sm font-semibold text-forest-900">{row.label}</div>
            <div className="font-body text-xs text-forest-700/60">{fmtNum(row.hint, locale)}</div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={`${row.label} −`}
              disabled={value[row.key] <= row.min}
              onClick={() => onChange({ ...value, [row.key]: value[row.key] - 1 })}
              className={stepBtn}
            >
              −
            </button>
            <span className="w-5 text-center font-body text-sm font-semibold text-forest-900">
              {fmtNum(value[row.key], locale)}
            </span>
            <button
              type="button"
              aria-label={`${row.label} +`}
              disabled={!row.canAdd}
              onClick={() => onChange({ ...value, [row.key]: value[row.key] + 1 })}
              className={stepBtn}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="pt-3 font-body text-xs text-forest-700/60">
        {fmtNum(t.max(maxGuests), locale)} · {t.infantsNote}
      </div>
    </div>
  );
}
