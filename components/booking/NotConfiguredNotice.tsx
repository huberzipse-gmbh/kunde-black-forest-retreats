"use client";

/** Freundlicher Hinweis, solange Supabase noch nicht konfiguriert ist. */
import Link from "next/link";
import { useStrings } from "@/lib/i18n/I18nProvider";
import { Type } from "@/components/ui/Type";

export function NotConfiguredNotice() {
  const t = useStrings().bookingFlow;
  return (
    <div className="mx-auto max-w-lg rounded-[8px] border border-forest-900/10 bg-white px-8 py-12 text-center">
      <Type role="h2" as="h1" className="text-forest-900">
        {t.errors.notConfigured}
      </Type>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300"
        >
          {t.confirmation.backHome}
        </Link>
      </div>
    </div>
  );
}
