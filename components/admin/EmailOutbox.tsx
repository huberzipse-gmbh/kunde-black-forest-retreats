"use client";

/** E-Mail-Log mit aufklappbarer HTML-Vorschau (iframe srcdoc, sandboxed). */
import { useState } from "react";
import { dateTimeDe } from "@/lib/admin/format";

interface EmailRow {
  id: string;
  to: string;
  subject: string;
  html: string;
  provider: string;
  createdAt: string;
}

export function EmailOutbox({ emails }: { emails: EmailRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (emails.length === 0) {
    return (
      <div className="rounded-[8px] border border-forest-900/10 bg-white px-6 py-10 text-center font-body text-sm text-forest-700/60">
        Noch keine E-Mails. Die erste entsteht mit der ersten Buchung.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((mail) => (
        <div key={mail.id} className="rounded-[8px] border border-forest-900/10 bg-white">
          <button
            type="button"
            className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-start"
            onClick={() => setOpenId(openId === mail.id ? null : mail.id)}
          >
            <div>
              <div className="font-body text-sm font-semibold text-forest-900">{mail.subject}</div>
              <div className="mt-0.5 font-body text-xs text-forest-700/60">
                an {mail.to} · {dateTimeDe(mail.createdAt)}
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider ${
                mail.provider === "demo" ? "bg-brass-400/20 text-brass-600" : "bg-forest-900/10 text-forest-900"
              }`}
            >
              {mail.provider === "demo" ? "Demo (nicht versendet)" : "Resend"}
            </span>
          </button>
          {openId === mail.id && (
            <div className="border-t border-forest-900/10 p-4">
              <iframe
                title={mail.subject}
                srcDoc={mail.html}
                sandbox=""
                className="h-[560px] w-full rounded-[6px] border border-forest-900/10 bg-cream-50"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
