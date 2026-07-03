"use client";

/**
 * Hero-Video mit robustem Autoplay. Hintergrund: React rendert das
 * muted-Attribut nicht ins Server-HTML — Browser halten das Video dann für
 * vertont und blockieren Autoplay (sichtbarer Play-Button, v. a. iOS/
 * Stromsparmodus). Hier wird Stummschaltung per Ref erzwungen und play()
 * bei jeder Gelegenheit erneut versucht (canplay, Sichtbarkeit, erste
 * Berührung). Ein natives Play-Overlay zeigen wir nie.
 */
import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      if (video.paused) video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);
    // Letztes Netz: die erste Interaktion irgendwo auf der Seite startet das Video.
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    window.addEventListener("click", tryPlay, { once: true });

    return () => {
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("click", tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      aria-hidden
      poster="/hero/hero-desktop-v4.png"
      className="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[2px]"
    >
      <source src="/hero/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}
