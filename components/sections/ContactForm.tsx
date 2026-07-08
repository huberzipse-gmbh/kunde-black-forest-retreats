"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { useStrings } from "@/lib/i18n/useStrings";
import { sendContactMessage } from "@/lib/contact/actions";

interface DecorItem {
  src: string;
  size: number;
  pos: string;
  rotate: number;
  opacity: number;
  hideOnMobile?: boolean;
}

/** Dezent gestreute Kuckucksuhren — greift den Spruch darüber auf (sepia via multiply). */
const DECOR: DecorItem[] = [
  { src: "/images/elemente/uhr.png", size: 150, pos: "left-[3%] top-[12%]", rotate: -8, opacity: 0.14 },
  { src: "/images/elemente/uhr.png", size: 110, pos: "right-[4%] top-[18%]", rotate: 10, opacity: 0.12, hideOnMobile: true },
  { src: "/images/elemente/uhr.png", size: 128, pos: "right-[7%] bottom-[10%]", rotate: -6, opacity: 0.13 },
  { src: "/images/elemente/uhr.png", size: 92, pos: "left-[8%] bottom-[12%]", rotate: 12, opacity: 0.1, hideOnMobile: true },
];

const inputBase =
  "w-full rounded-[5px] border border-forest-900/15 bg-cream-50/70 px-4 py-3 font-body text-[0.95rem] text-forest-900 placeholder:text-forest-700/40 outline-none transition-colors duration-300 focus:border-brass-400 focus:bg-white";

export function ContactForm() {
  const t = useStrings().contact;
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFailed(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };
    startTransition(async () => {
      const res = await sendContactMessage(payload);
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        setFailed(true);
      }
    });
  };

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-cream-50 px-6 py-24 text-forest-900 md:py-32"
    >
      {/* Dezente Kuckucksuhr-Elemente */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DECOR.map((it, i) => (
          <Image
            key={i}
            src={it.src}
            alt=""
            width={it.size}
            height={it.size}
            className={`absolute ${it.pos} mix-blend-multiply ${
              it.hideOnMobile ? "hidden sm:block" : ""
            }`}
            style={{ opacity: it.opacity, transform: `rotate(${it.rotate}deg)` }}
          />
        ))}
      </div>

      <Reveal className="relative z-10 mx-auto max-w-xl">
        <div className="text-center">
          <Type role="eyebrow" className="text-brass-600">
            {t.eyebrow}
          </Type>
          <Type role="display" as="h2" className="mt-5 text-forest-900">
            {t.title}
          </Type>
          <div className="mx-auto mt-7 h-px w-12 bg-brass-400" />
          <Type role="lead" className="mx-auto mt-7 max-w-md text-forest-700/85">
            {t.text}
          </Type>
        </div>

        <div className="mt-11 rounded-[12px] border border-forest-900/10 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(15,24,19,0.55)] backdrop-blur-sm sm:p-9">
          {sent ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brass-400/60 text-brass-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12.5l4.2 4.2L19 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Type role="h3" as="p" className="mt-5 text-forest-900">
                {t.success.title}
              </Type>
              <Type role="body" className="mx-auto mt-3 max-w-sm text-forest-700/80">
                {t.success.text}
              </Type>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {/* Honeypot — für Menschen unsichtbar */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Firma
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div>
                <Type role="label" as="label" className="mb-2 block text-forest-800">
                  {t.form.name}
                </Type>
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={t.form.namePlaceholder}
                  className={inputBase}
                />
              </div>

              <div>
                <Type role="label" as="label" className="mb-2 block text-forest-800">
                  {t.form.email}
                </Type>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.form.emailPlaceholder}
                  className={inputBase}
                />
              </div>

              <div>
                <Type role="label" as="label" className="mb-2 block text-forest-800">
                  {t.form.phone}
                  <span className="ml-2 font-normal normal-case tracking-normal text-forest-700/45">
                    {t.form.phoneOptional}
                  </span>
                </Type>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t.form.phonePlaceholder}
                  className={inputBase}
                />
              </div>

              <div>
                <Type role="label" as="label" className="mb-2 block text-forest-800">
                  {t.form.message}
                </Type>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={t.form.messagePlaceholder}
                  className={`${inputBase} resize-none`}
                />
              </div>

              {failed && (
                <p className="rounded-[6px] border border-red-800/20 bg-red-50 px-4 py-3 font-body text-sm text-red-800">
                  {t.error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? t.form.sending : t.form.submit}
              </button>

              <Type role="caption" className="text-center text-forest-700/55">
                {t.privacy}{" "}
                <Link href="/datenschutz" className="underline underline-offset-2 hover:text-brass-600">
                  {t.privacyLink}
                </Link>{" "}
                {t.privacyAfter}
              </Type>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
