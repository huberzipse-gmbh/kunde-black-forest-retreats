"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/admin/actions";

/** Demo-Login: ein Passwortfeld; die Zugangsdaten stehen direkt darunter. */
export function LoginForm({ demoHint }: { demoHint: string }) {
  const [state, formAction, pending] = useActionState(adminLogin, null);

  return (
    <form action={formAction} className="mt-8 rounded-[8px] bg-cream-50 p-7">
      <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">
        Passwort
      </label>
      <input
        type="password"
        name="password"
        autoFocus
        autoComplete="current-password"
        className="w-full rounded-[4px] border border-forest-900/20 bg-white px-4 py-3 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900"
      />
      {state?.error && (
        <p className="mt-3 font-body text-sm text-red-800">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-[3px] bg-forest-900 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-50"
      >
        {pending ? "Anmelden …" : "Anmelden"}
      </button>
      {demoHint && (
        <p className="mt-5 rounded-[4px] bg-brass-400/15 px-4 py-3 text-center font-body text-xs text-forest-900">
          Demo-Zugang · Passwort: <strong className="font-semibold">{demoHint}</strong>
        </p>
      )}
    </form>
  );
}
