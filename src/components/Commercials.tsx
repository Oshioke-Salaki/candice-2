"use client";

import { useRef, useState } from "react";

const COMMERCIALS = [
  {
    src: "/media/commercials/errand-ready.mp4",
    poster: "/media/commercials/errand-ready.jpg",
    title: "Errand Ready",
    meta: "The Snowsuit",
  },
  {
    src: "/media/commercials/lia-aw22.mp4",
    poster: "/media/commercials/lia-aw22.jpg",
    title: "LIA AW22",
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
    title: "Behind The Scenes",
    meta: "@filmgod.x",
  },
  {
    src: "/media/commercials/commercial-01.mp4",
    poster: "/media/commercials/commercial-01.jpg",
    title: "Commercial 01",
    meta: "Campaign",
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

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.muted = false;
      v.play().catch(() => {});
    }
    onPlay();
  }

  return (
    <div
      className="group relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      style={{ aspectRatio: "16/9", background: "var(--bg-card)" }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={commercial.src}
        muted={!isPlaying}
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Play indicator */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            color: "#EDE6DA",
          }}
        >
          <PlayIcon />
        </div>
      )}

      {/* Title overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-12 transition-opacity duration-500"
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
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--text)",
            }}
          >
            COMMERCIALS
          </h2>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
