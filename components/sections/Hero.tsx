import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[88svh] overflow-hidden bg-night md:min-h-[100svh]"
    >
      {/* Hero-Video — Ping-Pong-Loop, stumm; Autoplay robust via HeroVideo */}
      <HeroVideo />

      {/* Schwarzer Verlauf oben → unten: stärker & länger (für die weiße Kopfzeile) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[58vh] bg-gradient-to-b from-black/72 via-black/34 to-transparent"
      />
    </section>
  );
}
