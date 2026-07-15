"use client";

/** E-Mail-Log mit aufklappbarer HTML-Vorschau (iframe srcdoc, sandboxed). */
import { useState, useTransition } from "react";
import { dateTimeDe } from "@/lib/admin/format";
import { resendLoggedEmail } from "@/app/admin/actions";

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
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ id: string; text: string; ok: boolean } | null>(null);

  const resend = (mail: EmailRow) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await resendLoggedEmail(mail.id);
      setFeedback(
        res.ok
          ? { id: mail.id, text: `Erneut an ${mail.to} gesendet.`, ok: true }
          : { id: mail.id, text: res.error ?? "Versand fehlgeschlagen.", ok: false },
      );
    });
  };

  if (emails.length === 0) {
    return (
      <div className="rounded-[8px] border border-forest-900/10 bg-white px-6 py-10 text-center font-body text-sm text-forest-700/60">
        Noch keine E-Mails. Die erste entsteht mit der ersten Buchung.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((mail) => {
        const isOpen = openId === mail.id;
        return (
          <div key={mail.id} className="rounded-[8px] border border-forest-900/10 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              {/* Links: klickbarer Bereich zum Auf-/Zuklappen der Vorschau */}
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : mail.id)}
                aria-expanded={isOpen}
                className="flex min-w-0 flex-1 items-center gap-3 text-start"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className={`shrink-0 text-forest-700/50 transition-transform ${isOpen ? "rotate-90" : ""}`}
                >
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="min-w-0">
                  <span className="block truncate font-body text-sm font-semibold text-forest-900">
                    {mail.subject}
                  </span>
                  <span className="mt-0.5 block font-body text-xs text-forest-700/60">
                    an {mail.to} · {dateTimeDe(mail.createdAt)} · Vorschau
                  </span>
                </span>
              </button>

              {/* Rechts: erneut senden direkt neben dem Provider-Emblem */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => resend(mail)}
                  disabled={isPending}
                  className="rounded-[3px] bg-forest-900 px-3.5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending && feedback?.id !== mail.id ? "Wird gesendet …" : "Erneut senden"}
                </button>
                <span
                  className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider ${
                    mail.provider === "demo" ? "bg-brass-400/20 text-brass-600" : "bg-forest-900/10 text-forest-900"
                  }`}
                >
                  {mail.provider === "demo" ? "Demo (nicht versendet)" : "Resend"}
                </span>
              </div>
            </div>

            {feedback?.id === mail.id && (
              <div className="px-5 pb-3">
                <span className={`font-body text-xs ${feedback.ok ? "text-forest-700" : "text-red-700"}`}>
                  {feedback.text}
                </span>
              </div>
            )}

            {isOpen && (
              <div className="border-t border-forest-900/10 p-4">
                <p className="mb-3 font-body text-xs text-forest-700/50">
                  Etwaige PDF-Anhänge werden beim erneuten Senden nicht mitgeschickt.
                </p>
                <iframe
                  title={mail.subject}
                  srcDoc={mail.html}
                  sandbox=""
                  className="h-[560px] w-full rounded-[6px] border border-forest-900/10 bg-cream-50"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
