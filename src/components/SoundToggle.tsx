"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { soundtrack, TRACKS, type SoundState } from "@/lib/soundtrack";

const SERVER: SoundState = { enabled: true, started: false, starting: false, playing: null, yielding: false, unavailable: false };

/* The corner sound control. Bars move while something is audible;
   the label says what's playing. Hidden automatically while a
   full-screen layer is open (it's a direct child of <body>). */
export default function SoundToggle() {
  const s = useSyncExternalStore(soundtrack.subscribe, soundtrack.getSnapshot, () => SERVER);

  useEffect(() => soundtrack.init(), []);

  if (s.unavailable) return null;

  const live = s.playing !== null;
  const label = !s.enabled
    ? "Sound off"
    : s.yielding
      ? "Paused for film"
      : live
        ? `${TRACKS[s.playing!].title} · ${TRACKS[s.playing!].artist}`
        : s.starting
          ? "Loading sound"
          : s.started
            ? "Sound on"
            : "Tap for sound";

  return (
    <motion.button
      type="button"
      data-sound-toggle
      onClick={() => soundtrack.toggle()}
      aria-label={s.enabled && (s.started || s.starting) ? "Turn sound off" : "Turn sound on"}
      aria-pressed={s.enabled && (s.started || s.starting)}
      title={label}
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-45 flex h-11 items-center gap-3 border border-white/10 bg-black/60 px-3.5 text-white backdrop-blur-md transition-colors hover:bg-black/80 active:scale-[0.97] md:right-6 md:bottom-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <span aria-hidden className={`eq ${live ? "eq-live" : ""} ${s.starting ? "eq-wait" : ""} ${s.enabled ? "" : "eq-off"}`}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="hidden max-w-[16rem] truncate text-xs font-medium tracking-[0.02em] sm:block" aria-live="polite">
        {label}
      </span>
    </motion.button>
  );
}
