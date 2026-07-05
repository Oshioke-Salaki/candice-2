"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Add more reels here anytime ─────────────────────────────────────────────
const REELS = [
  {
    video: "/reels/beauty.mp4",
    credit: "Beauty in Detail",
    label: "Glam · UGC",
    year: "2026",
  },
  {
    video: "/reels/paris-walk.mp4",
    credit: "Paris, On Foot",
    label: "Street Diary",
    year: "2025",
  },
  {
    video: "/reels/lagos-live.mp4",
    credit: "I ♥ Lagos",
    label: "Lifestyle",
    year: "2025",
  },
  {
    video: "/reels/snowsuit.mp4",
    credit: "Errand Ready",
    label: "The Snowsuit",
    year: "2026",
  },
  {
    video: "/reels/market.mp4",
    credit: "Market Run",
    label: "Paris",
    year: "2025",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

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

function ArrowBtn({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous video" : "Next video"}
      className="flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 hover:border-(--text)"
      style={{
        width: "2.4rem",
        height: "2.4rem",
        border: "1px solid var(--border-hi)",
        borderRadius: "50%",
        background: "transparent",
        color: "var(--text)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "prev" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

export default function Reel() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const leftMobileRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);
  const activeRef = useRef(0); // mirrors `active` without closure staleness

  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0); // text lags behind for stagger
  const [textVisible, setTextVisible] = useState(true);
  const [unmuted, setUnmuted] = useState(false);
  const [showPlay, setShowPlay] = useState(false);

  // Play active, pause all others
  const syncPlayback = useCallback((idx: number) => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx && inViewRef.current) {
        // Reset if the video previously played to the end
        if (v.ended || v.currentTime >= v.duration - 0.1) v.currentTime = 0;
        v.play()
          .then(() => setShowPlay(false))
          .catch((err: unknown) => {
            // Only show the manual play button for a genuine browser autoplay
            // policy block — not for buffering failures (onCanPlay handles those)
            if (err instanceof DOMException && err.name === 'NotAllowedError') {
              setShowPlay(true)
            }
          });
      } else {
        v.pause();
      }
    });
  }, []);

  // Navigate with crossfade video + staggered text
  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = (activeRef.current + dir + REELS.length) % REELS.length;
      activeRef.current = next;
      setActive(next);
      syncPlayback(next);
      setTextVisible(false);
      setTimeout(() => {
        setDisplayed(next);
        setTextVisible(true);
      }, 280);
    },
    [syncPlayback],
  );

  // IntersectionObserver — play at 20% visibility, fully stop + mute at 0%
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.2) {
          inViewRef.current = true;
          syncPlayback(activeRef.current);
        } else if (ratio === 0) {
          // Fully off-screen — stop and kill sound immediately
          inViewRef.current = false;
          videoRefs.current.forEach((v) => {
            if (!v) return;
            v.pause();
            v.muted = true;
          });
          setUnmuted(false);
        }
      },
      { threshold: [0, 0.2] },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync active video when active changes
  useEffect(() => {
    if (inViewRef.current) syncPlayback(active);
  }, [active, syncPlayback]);

  // Sync muted imperatively across all videos
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.muted = !unmuted;
    });
  }, [unmuted]);

  // Reveal left columns
  useEffect(() => {
    const els = [leftRef.current, leftMobileRef.current].filter(
      Boolean,
    ) as HTMLDivElement[];
    const observers = els.map((el) => {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) el.classList.add("visible");
        },
        { threshold: 0.1 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const ease = "cubic-bezier(0.16,1,0.3,1)";
  const reel = REELS[displayed];

  return (
    <section
      id="reel"
      className="py-14 md:py-28 px-6 md:px-10"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center lg:flex-row flex-col justify-center gap-y-10 gap-x-[250px] lg:items-stretch">
          {/* ══ LEFT — desktop ══ */}
          <div
            ref={leftRef}
            className="reveal hidden md:flex flex-col justify-center gap-2 lg:gap-10"
          >
            <div className="section-tag">Behind the Feed</div>

            <h2
              className="font-display"
              style={{ lineHeight: 0.85, letterSpacing: "0.04em" }}
            >
              <span
                className="block"
                style={{
                  fontSize: "clamp(5rem, 10vw, 13rem)",
                  color: "var(--text)",
                }}
              >
                THE
              </span>
              <span
                className="block"
                style={{
                  fontSize: "clamp(5rem, 10vw, 13rem)",
                  WebkitTextStroke: "1.5px var(--text)",
                  color: "transparent",
                }}
              >
                FEED
              </span>
            </h2>

            {/* Animated text block — fixed width prevents layout shift on text change */}
            <div
              style={{
                width: 320,
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.45s ${ease}, transform 0.45s ${ease}`,
              }}
            >
              <p
                className="font-serif italic mb-5"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "var(--text-dim)",
                  maxWidth: 300,
                }}
              >
                The camera stops. The work doesn&apos;t.
              </p>
              <span
                className="block uppercase tracking-[0.25em] mb-5"
                style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}
              >
                {reel.credit} &nbsp;·&nbsp; {reel.year}
              </span>
              <span
                className="block uppercase tracking-[0.2em]"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-dim)",
                  opacity: 0.5,
                }}
              >
                {reel.label}
              </span>
            </div>

            <Link
              href="/content"
              className="uppercase tracking-[0.2em] no-underline transition-opacity duration-300 hover:opacity-70 self-start"
              style={{
                fontSize: "0.62rem",
                color: "var(--text)",
                borderBottom: "1px solid var(--accent)",
                paddingBottom: "0.35rem",
              }}
            >
              All content →
            </Link>
          </div>

          {/* ══ MOBILE left — stacked ══ */}
          <div
            ref={leftMobileRef}
            className="reveal flex md:hidden flex-col gap-5"
          >
            <div className="section-tag">Behind the Feed</div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(4rem, 18vw, 7rem)",
                lineHeight: 0.88,
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: "var(--text)" }}>THE </span>
              <span
                style={{
                  WebkitTextStroke: "1.5px var(--text)",
                  color: "transparent",
                }}
              >
                FEED
              </span>
            </h2>
            <p
              className="font-serif italic"
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--text-dim)",
              }}
            >
              The camera stops. The work doesn&apos;t.
            </p>
            <Link
              href="/content"
              className="uppercase tracking-[0.2em] no-underline self-start"
              style={{
                fontSize: "0.62rem",
                color: "var(--text)",
                borderBottom: "1px solid var(--accent)",
                paddingBottom: "0.35rem",
              }}
            >
              All content →
            </Link>
          </div>

          {/* ══ RIGHT — video + controls ══ */}
          <div className="flex flex-col items-center md:items-end gap-4 w-[360px]">
            {/* Video frame */}
            <div
              ref={containerRef}
              className="relative overflow-hidden w-full"
              style={{ aspectRatio: "9/16", background: "var(--bg-card)" }}
            >
              {REELS.map((r, i) => (
                <video
                  key={r.video}
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={r.video}
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transition: `opacity 0.7s ${ease}`,
                  }}
                  // Retry once buffered — catches play() called before data was ready
                  onCanPlay={() => {
                    if (i === activeRef.current && inViewRef.current) {
                      videoRefs.current[i]?.play()
                        .then(() => setShowPlay(false))
                        .catch((err: unknown) => {
                          if (err instanceof DOMException && err.name === 'NotAllowedError') {
                            setShowPlay(true)
                          }
                        })
                    }
                  }}
                  // Auto-advance to next video when this one ends
                  onEnded={() => {
                    if (i === activeRef.current) navigate(1);
                  }}
                />
              ))}

              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)",
                }}
              />

              {/* Film credit */}
              <div
                className="absolute bottom-4 left-4 z-10"
                style={{ opacity: 0.5 }}
              >
                <span
                  className="font-display tracking-[0.2em] text-white"
                  style={{ fontSize: "0.55rem" }}
                >
                  {REELS[active].credit} · {REELS[active].year}
                </span>
              </div>

              {/* Mute toggle — frosted glass, bottom-right, same style as editorial cards */}
              <div className="absolute bottom-4 right-4 z-20">
                <button
                  onClick={() => setUnmuted((u) => !u)}
                  aria-label={unmuted ? "Mute video" : "Unmute video"}
                  className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    background: unmuted
                      ? "rgba(237,237,232,0.95)"
                      : "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    color: unmuted ? "#080808" : "#EDEDE8",
                    cursor: "pointer",
                  }}
                >
                  <SoundIcon unmuted={unmuted} />
                </button>
              </div>

              {/* Manual play fallback */}
              {showPlay && (
                <button
                  onClick={() =>
                    videoRefs.current[active]
                      ?.play()
                      .then(() => setShowPlay(false))
                      .catch(() => {})
                  }
                  aria-label="Play video"
                  className="absolute inset-0 flex items-center justify-center z-20"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "4rem",
                      height: "4rem",
                      background: "rgba(237,237,232,0.15)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(237,237,232,0.3)",
                      color: "#EDEDE8",
                      fontSize: "1.2rem",
                    }}
                  >
                    ▶
                  </div>
                </button>
              )}
            </div>

            {/* ── Navigation bar ── */}
            <div className="flex items-center justify-between w-full">
              {/* Prev · Dots · Next */}
              <div className="flex items-center gap-3">
                <ArrowBtn dir="prev" onClick={() => navigate(-1)} />

                {/* Dot pills */}
                <div className="flex items-center gap-1.5">
                  {REELS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const dir = i > active ? 1 : -1;
                        setActive(i);
                        syncPlayback(i);
                        setTextVisible(false);
                        setTimeout(() => {
                          setDisplayed(i);
                          setTextVisible(true);
                        }, 280);
                        void dir;
                      }}
                      aria-label={`Go to video ${i + 1}`}
                      style={{
                        height: "0.22rem",
                        width: i === active ? "1.6rem" : "0.35rem",
                        background:
                          i === active ? "var(--text)" : "var(--border-hi)",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        borderRadius: 0,
                        transition: `width 0.4s ${ease}, background 0.4s ease`,
                      }}
                    />
                  ))}
                </div>

                <ArrowBtn dir="next" onClick={() => navigate(1)} />
              </div>

              {/* Counter */}
              <span
                className="uppercase tracking-[0.18em]"
                style={{
                  fontSize: "0.52rem",
                  color: "var(--text-dim)",
                  opacity: 0.6,
                }}
              >
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(REELS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
