"use client";

import { useRef, useState } from "react";

const REELS: {
  src: string;
  poster: string;
  title: string;
  meta: string;
  silent?: boolean; // no audio track — hide the sound toggle
}[] = [
  { src: "/reels/beauty.mp4", poster: "/reels/beauty.jpg", title: "Beauty in Detail", meta: "Glam · UGC" },
  { src: "/reels/paris-walk.mp4", poster: "/reels/paris-walk.jpg", title: "Paris, On Foot", meta: "Street diary" },
  { src: "/reels/lagos-live.mp4", poster: "/reels/lagos-live.jpg", title: "I ♥ Lagos", meta: "Lifestyle" },
  { src: "/reels/raindance.mp4", poster: "/reels/raindance.jpg", title: "Raindance", meta: "Santan Dave ft. Tems" },
  { src: "/reels/snowsuit.mp4", poster: "/reels/snowsuit.jpg", title: "Errand Ready", meta: "The snowsuit" },
  { src: "/reels/market.mp4", poster: "/reels/market.jpg", title: "Market Run", meta: "Paris" },
  { src: "/reels/lia-runway.mp4", poster: "/reels/lia-runway.jpg", title: "LIA AW22", meta: "Runway" },
  { src: "/reels/on-set.mp4", poster: "/reels/on-set.jpg", title: "On Set", meta: "BTS — @filmgod.x", silent: true },
  { src: "/reels/interview.mp4", poster: "/reels/interview.jpg", title: "Mic Moment", meta: "Press", silent: true },
];

function SoundIcon({ unmuted }: { unmuted: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {unmuted ? (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      ) : (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      )}
    </svg>
  );
}

function ReelCard({
  reel,
  isUnmuted,
  onToggleMute,
}: {
  reel: (typeof REELS)[0];
  isUnmuted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isUnmuted;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }
  function pause() {
    videoRef.current?.pause();
    setPlaying(false);
  }

  return (
    <div
      className="group relative overflow-hidden"
      style={{ aspectRatio: "9/16", background: "var(--bg-card)" }}
      onMouseEnter={play}
      onMouseLeave={pause}
    >
      <video
        ref={videoRef}
        src={reel.src}
        poster={reel.poster}
        muted={!isUnmuted}
        loop
        playsInline
        preload="none"
        onClick={() => (playing ? pause() : play())}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* Play hint — hides once playing */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
        style={{ opacity: playing ? 0 : 1 }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "3.2rem",
            height: "3.2rem",
            background: "rgba(4,2,1,0.4)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(237,230,218,0.3)",
            color: "#EDE6DA",
            fontSize: "0.9rem",
            paddingLeft: "3px",
          }}
        >
          ▶
        </div>
      </div>

      {/* Bottom gradient + credit */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-14 pointer-events-none"
        style={{
          background: "linear-gradient(transparent, rgba(4,2,1,0.8))",
        }}
      >
        <div className="font-serif italic text-lg" style={{ color: "#EDE6DA" }}>
          {reel.title}
        </div>
        <div
          className="uppercase tracking-[0.22em] mt-1"
          style={{ fontSize: "0.52rem", color: "rgba(237,230,218,0.55)" }}
        >
          {reel.meta}
        </div>
      </div>

      {/* Sound toggle — only for clips that carry audio */}
      {!reel.silent && (
        <button
          onClick={onToggleMute}
          aria-label={isUnmuted ? "Mute video" : "Unmute video"}
          className="absolute bottom-4 right-4 z-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            width: "2rem",
            height: "2rem",
            background: isUnmuted
              ? "rgba(237,230,218,0.95)"
              : "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: isUnmuted ? "#0A0807" : "#EDE6DA",
            cursor: "pointer",
          }}
        >
          <SoundIcon unmuted={isUnmuted} />
        </button>
      )}

      {/* Hover border accent */}
      <div
        className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: "rgba(194,69,62,0.5)" }}
      />
    </div>
  );
}

export default function ContentGrid() {
  // One unmuted reel at a time, like the home page editorials.
  const [unmuted, setUnmuted] = useState<string | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REELS.map((r) => (
          <ReelCard
            key={r.src}
            reel={r}
            isUnmuted={unmuted === r.src}
            onToggleMute={() =>
              setUnmuted((prev) => (prev === r.src ? null : r.src))
            }
          />
        ))}
      </div>
    </div>
  );
}
