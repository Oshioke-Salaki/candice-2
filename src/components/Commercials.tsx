"use client";

import { useRef, useState } from "react";

const COMMERCIALS = [
  {
    src: "/media/commercials/errand-ready.mp4",
    poster: "/media/commercials/errand-ready.jpg",
    title: "Snow Bunny",
    meta: "Errand Ready",
  },
  {
    src: "/media/commercials/lia-aw22.mp4",
    poster: "/media/commercials/lia-aw22.jpg",
    title: "Lia Cowan",
    meta: "Runway Show",
  },
  {
    src: "/media/commercials/olamide-rock-me-gentle.mp4",
    poster: "/media/commercials/olamide-rock-me-gentle.jpg",
    title: "Rock Me Gentle",
    meta: "Olamide — Music Video",
  },
  {
    src: "/media/commercials/bts-behind-scenes.mp4",
    poster: "/media/commercials/bts-behind-scenes.jpg",
    title: "Snow Bunny",
    meta: "Brand Collab",
  },
  {
    src: "/media/commercials/commercial-01.mp4",
    poster: "/media/commercials/commercial-01.jpg",
    title: "Raindance",
    meta: "Dave ft. Tems — Music Video",
  },
  {
    src: "/media/commercials/meji-meji-collab.mp4",
    poster: "/media/commercials/meji-meji-collab.jpg",
    title: "Meji Meji",
    meta: "Collab Commercial",
  },
  {
    src: "/media/commercials/ldm-clo.mp4",
    poster: "/media/commercials/ldm-clo.jpg",
    title: "LDM CLO",
    meta: "Collab Commercial",
  },
];

function PlayIcon() {
  return (
    <svg
      width="3.2rem"
      height="3.2rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

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

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="4" height="16" rx="1" />
      <rect x="15" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function CtrlBtn({
  onClick,
  active,
  label,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        width: "2.2rem",
        height: "2.2rem",
        background: active
          ? "rgba(237,230,218,0.95)"
          : "rgba(255,255,255,0.14)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: active ? "#0A0807" : "#EDE6DA",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function VideoCard({
  commercial,
  isPlaying,
  onPlay,
}: {
  commercial: (typeof COMMERCIALS)[0];
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.muted = muted;
      v.play().catch(() => {});
    }
    onPlay();
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  }

  function pause(e: React.MouseEvent) {
    e.stopPropagation();
    togglePlay();
  }

  return (
    <div
      className="group relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      style={{ aspectRatio: "9/16", background: "var(--bg-card)" }}
      onClick={togglePlay}
    >
      {/* Blurred poster backdrop — fills the frame when the video's
          aspect ratio doesn't match the card (e.g. landscape cuts) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${commercial.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(36px) brightness(0.5)",
          transform: "scale(1.2)",
        }}
      />
      <video
        ref={videoRef}
        src={commercial.src}
        poster={commercial.poster}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Play indicator */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{
            background: "rgba(0,0,0,0.25)",
            color: "#EDE6DA",
          }}
        >
          <PlayIcon />
        </div>
      )}

      {/* Controls while playing — pause + mute/unmute */}
      {isPlaying && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <CtrlBtn onClick={pause} active={false} label="Pause video">
            <PauseIcon />
          </CtrlBtn>
          <CtrlBtn
            onClick={toggleMute}
            active={!muted}
            label={muted ? "Unmute video" : "Mute video"}
          >
            <SoundIcon unmuted={!muted} />
          </CtrlBtn>
        </div>
      )}

      {/* Title overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-12 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(transparent, rgba(4,2,1,0.8))",
          opacity: isPlaying ? 0 : 1,
        }}
      >
        <div
          className="font-serif italic"
          style={{ fontSize: "1.1rem", color: "#EDE6DA" }}
        >
          {commercial.title}
        </div>
        <div
          className="uppercase tracking-[0.22em] mt-1"
          style={{
            fontSize: "0.52rem",
            color: "rgba(237,230,218,0.55)",
          }}
        >
          {commercial.meta}
        </div>
      </div>

      {/* Border accent */}
      <div
        className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ borderColor: "rgba(194,69,62,0.5)", borderWidth: "1px" }}
      />
    </div>
  );
}

export default function Commercials() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="commercials" className="py-32 overflow-hidden px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="mb-16">
          <div
            className="reveal animate-fade-in"
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="section-tag">Media & Campaigns</div>
          </div>
          <h2
            className="font-display animate-reveal-up"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--text)",
            }}
          >
            COMMERCIALS
          </h2>
        </div>

        {/* ── Grid — portrait reels, three across ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMERCIALS.map((commercial) => (
            <VideoCard
              key={commercial.src}
              commercial={commercial}
              isPlaying={playing === commercial.src}
              onPlay={() =>
                setPlaying((prev) =>
                  prev === commercial.src ? null : commercial.src,
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
