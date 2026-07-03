/** Hinweis im Admin, solange Supabase-Env fehlt. */
export function AdminNotConfigured() {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-[8px] border border-forest-900/10 bg-white px-8 py-10 text-center">
      <h1 className="font-display text-2xl text-forest-900">Supabase ist noch nicht verbunden</h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-forest-700/80">
        Bitte <code className="rounded bg-cream-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="rounded bg-cream-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> und{" "}
        <code className="rounded bg-cream-100 px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
        <code className="rounded bg-cream-100 px-1.5 py-0.5">.env.local</code> setzen und die
        Migrationen aus <code className="rounded bg-cream-100 px-1.5 py-0.5">supabase/migrations/</code> ausführen.
      </p>
    </div>
  );
}
