"use client";

/**
 * Rabattcode-Eingabe im Preis-Panel. Ein eingelöster Code liegt als Cookie
 * und gilt für den gesamten Buchungsflow; hier lässt er sich auch entfernen.
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";
import { applyPromoCode, removePromoCode } from "@/lib/booking/promo";

interface Props {
  /** Aktuell eingelöster, gültiger Code (aus dem Cookie, serverseitig validiert). */
  activeCode: string | null;
  percent: number;
}

export function PromoCodeField({ activeCode, percent }: Props) {
  const t = useStrings().bookingFlow.promo;
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pct = String(percent).replace(".", locale === "de" ? "," : ".");

  const apply = () => {
    if (!value.trim()) return;
    setInvalid(false);
    startTransition(async () => {
      const res = await applyPromoCode(value);
      if (res.ok) {
        setValue("");
        router.refresh();
      } else {
        setInvalid(true);
      }
    });
  };

  const remove = () =>
    startTransition(async () => {
      await removePromoCode();
      router.refresh();
    });

  if (activeCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[6px] border border-forest-500/30 bg-forest-50 px-4 py-3">
        <p className="font-body text-xs leading-relaxed text-forest-700">
          {fmtNum(t.applied(activeCode, pct), locale)}
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={remove}
          className="shrink-0 font-body text-xs font-semibold text-forest-700/70 underline underline-offset-2 transition-colors hover:text-forest-900 disabled:opacity-40"
        >
          {t.remove}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          className="w-full rounded-[4px] border border-forest-900/20 bg-white px-3.5 py-2.5 font-body text-sm text-forest-900 uppercase placeholder:normal-case outline-none transition-colors focus:border-forest-900"
          placeholder={t.placeholder}
          aria-label={t.title}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setInvalid(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        <button
          type="button"
          disabled={isPending || !value.trim()}
          onClick={apply}
          className="shrink-0 rounded-[3px] border border-forest-900/25 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t.apply}
        </button>
      </div>
      {invalid && <p className="mt-2 font-body text-xs text-red-800">{t.invalid}</p>}
    </div>
  );
}
