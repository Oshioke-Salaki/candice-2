"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Brand roster — typographic wall.
   The client is sourcing logo files; swap names for logos later.
   Alternating display / serif treatment keeps the wall rhythmic. ─── */
const brands = [
  "Topicals",
  "ANUA",
  "ASOS",
  "NYX",
  "Rhode Beauty",
  "Morphe",
  "Estée Lauder",
  "Bershka",
  "Meshki",
  "Timberland",
  "Puma",
  "Lacoste",
  "Marc Jacobs",
  "Miu Miu × L'Oréal",
  "Izipizi",
  "Quay",
  "Corteiz",
  "AboutYou",
  "Motel Rocks",
  "Revolve",
  "Fashion Nova",
  "Sumwon Women",
];

/*
  Featured credits & campaign shoots.
  photo | photos (auto-cycling slideshow) | video — video takes priority.
  href — optional external link (e.g. a YouTube credit).
*/
const editorials: {
  brand: string;
  tag: string;
  photo: string | null;
  photos?: string[];
  video: string | null;
  href?: string;
  year: string;
}[] = [
  {
    brand: "RAINDANCE",
    tag: "Santan Dave ft. Tems — Music Video",
    photo: null,
    video: "/reels/raindance.mp4",
    year: "2025",
  },
  {
    brand: "POWER, IN RED",
    tag: "Studio Campaign",
    photo: null,
    photos: ["/work/red-suit.jpg", "/work/red-suit-seated.jpg"],
    video: null,
    year: "2026",
  },
  {
    brand: "LIA AW22",
    tag: "Runway — Undisciplined Tulips",
    photo: null,
    video: "/reels/lia-runway.mp4",
    year: "2022",
  },
  {
    brand: "GOLDEN HOUR",
    tag: "Beauty Collab",
    photo: "/work/market-crochet.jpg",
    video: null,
    year: "2025",
  },
  {
    brand: "ROCK ME GENTLE",
    tag: "Olamide — Music Video",
    photo: "/featured/olamide.jpg",
    video: null,
    href: "https://www.youtube.com/watch?v=qzjO31PRP9I",
    year: "2024",
  },
  {
    brand: "TAILORED",
    tag: "Studio Campaign",
    photo: null,
    photos: ["/work/tan-suit.jpg", "/work/tan-suit-seated.jpg"],
    video: null,
    year: "2026",
  },
];

/* ─── Reveal hook ─────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ─── Typographic brand cell ──────────────────── */
function NameCell({ name, index }: { name: string; index: number }) {
  const isDisplay = index % 2 === 0;
  return (
    <div
      className="group relative flex items-center justify-center py-9 px-6 cursor-default overflow-hidden text-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Hover wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "var(--accent)" }}
      />

      <span
        className={
          isDisplay
            ? "font-display relative z-10 uppercase transition-colors duration-400"
            : "font-serif italic relative z-10 transition-colors duration-400"
        }
        style={{
          fontSize: isDisplay ? "clamp(1.2rem, 2vw, 1.7rem)" : "clamp(1.25rem, 2.1vw, 1.8rem)",
          letterSpacing: isDisplay ? "0.1em" : "0.02em",
          color: "var(--text)",
          lineHeight: 1.1,
        }}
      >
        <span className="group-hover:text-[#EDE6DA] transition-colors duration-400">
          {name}
        </span>
      </span>
    </div>
  );
}

/* ─── Video icons ─────────────────────────────── */
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

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return playing ? (
    /* Pause — two bars */
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="4" height="16" rx="1" />
      <rect x="15" y="4" width="4" height="16" rx="1" />
    </svg>
  ) : (
    /* Play — triangle */
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 21,12 6,21" />
    </svg>
  );
}

function VideoCtrlBtn({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
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
        width: "2rem",
        height: "2rem",
        background: active
          ? "rgba(237,230,218,0.95)"
          : "rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.22)",
        color: active ? "#0A0807" : "#EDE6DA",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ─── Editorial card ──────────────────────────── */
function EditorialCard({
  item,
  index,
  isUnmuted,
  onToggleMute,
}: {
  item: (typeof editorials)[0];
  index: number;
  isUnmuted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Slideshow state for multi-image cards
  const slides = item.photos ?? (item.photo ? [item.photo] : []);
  const [slide, setSlide] = useState(0);
  // Track which indices have ever been shown so we only mount seen images
  // (plus the next one for a smooth crossfade preload).
  const [rendered, setRendered] = useState<Set<number>>(() => new Set([0, 1]));
  const cardRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    if (slides.length < 2) return;

    // Pause the interval when the card is off-screen
    const obs = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0.1 },
    );
    if (cardRef.current) obs.observe(cardRef.current);

    const id = setInterval(() => {
      if (!visibleRef.current) return;
      setSlide((s) => {
        const next = (s + 1) % slides.length;
        const preload = (next + 1) % slides.length;
        setRendered((r) => {
          if (r.has(next) && r.has(preload)) return r;
          return new Set([...r, next, preload]);
        });
        return next;
      });
    }, 3500);

    return () => { clearInterval(id); obs.disconnect(); };
  }, [slides.length]);

  // Sync muted state imperatively (React doesn't reflect `muted` prop changes after mount)
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !isUnmuted;
  }, [isUnmuted]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play();
      setPlaying(true);
    }
  }

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden"
      style={{ aspectRatio: "3/4" }}
    >
      {item.video ? (
        <video
          ref={videoRef}
          src={item.video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : slides.length > 0 ? (
        /* ── Single photo or auto-cycling slideshow ── */
        <>
          {slides.map((src, i) =>
            rendered.has(i) ? (
              <Image
                key={src}
                src={src}
                alt={`${item.brand} — ${item.tag}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
                style={{
                  opacity: i === slide ? 1 : 0,
                  transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ) : null,
          )}
          {/* Slide dots — only shown when there are multiple images */}
          {slides.length > 1 && (
            <div className="absolute top-4 right-4 z-10 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Go to image ${i + 1}`}
                  style={{
                    width: i === slide ? "1.4rem" : "0.35rem",
                    height: "0.25rem",
                    background:
                      i === slide
                        ? "rgba(237,230,218,0.9)"
                        : "rgba(237,230,218,0.3)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    borderRadius: 0,
                    transition: "width 0.4s ease, background 0.4s ease",
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* ── Placeholder ── */
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "var(--bg-card)" }}
        >
          <span
            className="font-display select-none pointer-events-none"
            style={{
              fontSize: "clamp(7rem, 15vw, 14rem)",
              color: "var(--text-muted)",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(4,2,1,0.84) 0%, rgba(4,2,1,0.08) 55%, transparent 100%)",
        }}
      />

      {/* External credit link — covers the card, controls sit above it */}
      {item.href && (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${item.brand} — ${item.tag}`}
          className="absolute inset-0 z-10"
        >
          <span
            className="absolute top-4 right-4 flex items-center justify-center rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              width: "2rem",
              height: "2rem",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "#EDE6DA",
              fontSize: "0.85rem",
            }}
          >
            ↗
          </span>
        </a>
      )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none">
        <div className="flex items-end justify-between">
          <div>
            <div
              className="font-display text-white tracking-[0.06em]"
              style={{
                fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
                lineHeight: 1,
              }}
            >
              {item.brand}
            </div>
            <div
              className="uppercase tracking-[0.28em] mt-1.5"
              style={{ fontSize: "0.5rem", color: "rgba(237,230,218,0.55)" }}
            >
              {item.tag}
            </div>
          </div>
          <div
            className="font-display text-white mb-0.5"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              opacity: 0.3,
            }}
          >
            {item.year}
          </div>
        </div>
      </div>

      {/* Video controls — play/pause + mute, bottom-right */}
      {item.video && (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
          <VideoCtrlBtn
            onClick={togglePlay}
            active={!playing}
            label={playing ? "Pause video" : "Play video"}
          >
            <PlayPauseIcon playing={playing} />
          </VideoCtrlBtn>

          <VideoCtrlBtn
            onClick={onToggleMute}
            active={isUnmuted}
            label={isUnmuted ? "Mute video" : "Unmute video"}
          >
            <SoundIcon unmuted={isUnmuted} />
          </VideoCtrlBtn>
        </div>
      )}

      {/* Hover border accent */}
      <div
        className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: "rgba(194,69,62,0.5)" }}
      />
    </div>
  );
}

/* ─── Section ─────────────────────────────────── */
export default function BrandsSection() {
  const headerRef = useReveal(0.1);
  const logosRef = useReveal(0.08);
  const editRef = useReveal(0.06);

  // Only one video can be unmuted at a time. null = all muted.
  const [unmutedBrand, setUnmutedBrand] = useState<string | null>(null);

  function toggleMute(brand: string) {
    setUnmutedBrand((prev) => (prev === brand ? null : brand));
  }

  return (
    <section
      id="brands"
      className="py-32"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* ══ Header ══ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div ref={headerRef} className="reveal text-center mb-20">
          <div className="section-tag justify-center">
            Selected Collaborations
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 7vw, 8rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--text)",
            }}
          >
            WORKED WITH{" "}
            <span
              style={{
                WebkitTextStroke: "1.5px var(--accent-soft)",
                color: "transparent",
              }}
            >
              THE BEST
            </span>
          </h2>
          <p
            className="font-serif italic mt-4"
            style={{ fontSize: "1.1rem", color: "var(--text-dim)" }}
          >
            A few names. Many stories.
          </p>
        </div>
      </div>

      {/* ══ Partner brands — typographic wall ══ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-32">
        <div ref={logosRef} className="reveal brand-logos-grid">
          {brands.map((b, i) => (
            <NameCell key={b} name={b} index={i} />
          ))}
        </div>
      </div>

      {/* ══ Featured credits & campaigns ══ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Sub-header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <div className="section-tag">Credits</div>
            <h3
              className="font-display"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 5.5rem)",
                lineHeight: 0.9,
                letterSpacing: "0.04em",
                color: "var(--text)",
              }}
            >
              FEATURED IN
            </h3>
          </div>
          <p
            className="uppercase tracking-[0.2em] md:text-right"
            style={{
              fontSize: "0.58rem",
              color: "var(--text-dim)",
              maxWidth: "16rem",
              lineHeight: 2.2,
            }}
          >
            Music videos, runways
            <br className="hidden md:block" /> & campaign shoots
          </p>
        </div>

        {/* Staggered editorial grid */}
        <div ref={editRef} className="reveal editorial-grid">
          {editorials.map((item, i) => (
            <EditorialCard
              key={item.brand}
              item={item}
              index={i}
              isUnmuted={unmutedBrand === item.brand}
              onToggleMute={() => toggleMute(item.brand)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
