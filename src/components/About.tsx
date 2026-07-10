"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { cldBlurURL, cldLoader } from "@/lib/media";

/* ─── Reveal hook ─────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Images ──────────────────────────────────── */
const IMAGES = [
  { src: "candice/about/00", alt: "Candice — portrait" },
  { src: "candice/about/01", alt: "Candice — portrait" },
  { src: "candice/about/02", alt: "Candice — editorial" },
  { src: "candice/about/03", alt: "Candice — campaign" },
  { src: "candice/about/04", alt: "Candice — beauty" },
  // Pulled straight from the LDM CLO SS26 campaign — no duplicate upload.
  {
    src: "candice/campaigns/ldm-clo-ss26/ldm-clo-ss26-12",
    alt: "Candice — LDM CLO SS26",
  },
];

const INTERVAL = 3800; // ms between auto-advances

/* ─── Skill tags ──────────────────────────────── */
const tags = [
  "Editorial",
  "Runway",
  "Campaign",
  "Commercial",
  "Beauty",
  "UGC",
  "Content Creation",
];

/* ─── Digitals — the spec sheet bookers ask for ── */
const digitals = [
  { label: "Height", value: "5′11″" },
  { label: "Bust", value: "36″" },
  { label: "Waist", value: "26″" },
  { label: "Hips", value: "40″" },
  { label: "Dress", value: "UK 8–10" },
  { label: "Hair", value: "Black" },
  { label: "Eyes", value: "Dark Brown" },
];

/* ─── About ───────────────────────────────────── */
export default function About() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-play */
  const schedule = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % IMAGES.length;
        setDir(1);
        setPrev(prev);
        return next;
      });
    }, INTERVAL);
  }, []);

  useEffect(() => {
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, schedule]);

  /* Clear prev after transition completes */
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 700);
    return () => clearTimeout(t);
  }, [prev, current]);

  /* Reveal refs */
  const leftRef = useReveal();
  const tagRef = useReveal();
  const headRef = useReveal();
  const body1Ref = useReveal();
  const body2Ref = useReveal();
  const quoteRef = useReveal();
  const digiRef = useReveal();

  return (
    <section
      id="about"
      className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-40 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
    >
      {/* ══════════════ LEFT — image carousel ══════════════ */}
      <div ref={leftRef} className="reveal from-left relative">
        {/* ── Main photo frame ── */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4", background: "var(--bg-card)" }}
        >
          {IMAGES.map((img, i) => {
            const isCurrent = i === current;
            const isPrev = i === prev;
            if (!isCurrent && !isPrev) return null;

            const leaveTo = dir === 1 ? "-6%" : "6%";

            return (
              <div
                key={img.src}
                className="absolute inset-0"
                style={{
                  zIndex: isCurrent ? 2 : 1,
                  opacity: isCurrent ? 1 : 0,
                  transform: isCurrent
                    ? "translateY(0) scale(1)"
                    : `translateY(${leaveTo}) scale(0.98)`,
                  transition: isCurrent
                    ? "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)"
                    : "opacity 0.5s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <Image
                  loader={cldLoader}
                  src={img.src}
                  placeholder="blur"
                  blurDataURL={cldBlurURL(img.src)}
                  alt={img.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                />
              </div>
            );
          })}
        </div>

        {/* ── Floating stat card ── */}
        <div
          className="about-float-card absolute z-20 -bottom-8 -right-8 w-40 p-6 text-center"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border-hi)",
            borderBottom: "2px solid var(--accent)",
          }}
        >
          <div
            className="font-display"
            style={{ fontSize: "3rem", lineHeight: 1, color: "var(--text)" }}
          >
            8+
          </div>
          <div
            className="uppercase tracking-[0.2em] mt-1"
            style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}
          >
            Years on Camera
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT — copy ══════════════ */}
      <div className="pt-8">
        <div ref={tagRef} className="reveal section-tag">
          About
        </div>

        <h2
          ref={headRef}
          className="reveal font-display mb-8"
          style={{
            fontSize: "clamp(2.6rem, 4.4vw, 4.8rem)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "0.01em",
            color: "var(--text)",
          }}
        >
          A muse.
          <br />
          <span style={{ color: "var(--text-dim)" }}>And an artist.</span>
        </h2>

        <p
          ref={body1Ref}
          className="reveal mb-6"
          style={{
            fontFamily: "var(--font-dm), sans-serif",
            fontSize: "1.2rem",
            lineHeight: 1.75,
            color: "var(--text-soft)",
          }}
        >
          I&apos;m{" "}
          <strong style={{ color: "var(--text)", fontWeight: 400 }}>
            Candice
          </strong>{" "}
          — a{" "}
          <strong style={{ color: "var(--text)", fontWeight: 400 }}>
            Nigerian-Sudanese
          </strong>{" "}
          model and content creator, based between London and Lagos. Eight-plus
          years in front of the lens turned a kid who loved to pose into a
          disciplined creative fluent in fashion, beauty, photography and
          movement.
        </p>

        <p
          ref={body2Ref}
          className="reveal mb-10"
          style={{
            fontFamily: "var(--font-dm), sans-serif",
            fontSize: "1.2rem",
            lineHeight: 1.75,
            color: "var(--text-soft)",
          }}
        >
          My work lives where modeling meets storytelling — cultural depth,
          modern edge. Magnetic on camera, sharp on set, across editorials,
          campaigns and the content my audience replays.{" "}
          <strong style={{ color: "var(--text)", fontWeight: 400 }}>
            Don&apos;t get it twisted.
          </strong>
        </p>

        {/* Skill pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className="uppercase tracking-[0.18em] px-4 py-2 transition-all duration-300"
              style={{
                fontSize: "0.58rem",
                border: "1px solid var(--border-hi)",
                color: "var(--text-soft)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--accent)";
                el.style.borderColor = "var(--accent)";
                el.style.color = "#EDE6DA";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "transparent";
                el.style.borderColor = "var(--border-hi)";
                el.style.color = "var(--text-soft)";
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          ref={quoteRef}
          role="blockquote"
          className="reveal font-serif italic"
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.5,
            color: "var(--text-soft)",
            paddingLeft: "1.5rem",
            borderLeft: "1px solid var(--accent)",
          }}
        >
          &ldquo;I don&apos;t just create visuals — I create moments that are
          felt, remembered, and impossible to ignore.&rdquo;
        </div>
      </div>

      {/* ══════════════ DIGITALS — the comp card ══════════════
          A booker's spec sheet: the full-body reference shot beside
          the measurements, the way an agency card is laid out. */}
      <div
        ref={digiRef}
        className="reveal md:col-span-2 mt-4 grid grid-cols-1 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] gap-10 md:gap-16 items-start"
      >
        {/* Full-body reference */}
        <div
          className="relative overflow-hidden w-full max-w-[300px] md:max-w-none mx-auto"
          style={{
            aspectRatio: "3/4",
            background: "var(--bg-card)",
            border: "1px solid var(--border-hi)",
          }}
        >
          <Image
            loader={cldLoader}
            src="candice/about/full-body"
            placeholder="blur"
            blurDataURL={cldBlurURL("candice/about/full-body")}
            alt="Candice — full-body digital"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, 30vw"
          />
        </div>

        {/* Measurements */}
        <div>
          <p
            className="uppercase tracking-[0.3em] mb-5"
            style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}
          >
            Digitals
          </p>
          <dl
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            style={{ borderTop: "1px solid var(--border-hi)" }}
          >
            {digitals.map((d) => (
              <div
                key={d.label}
                className="py-5 pr-4"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <dt
                  className="uppercase tracking-[0.22em]"
                  style={{ fontSize: "0.55rem", color: "var(--text-dim)" }}
                >
                  {d.label}
                </dt>
                <dd
                  className="font-serif mt-2"
                  style={{ fontSize: "1.5rem", color: "var(--text)" }}
                >
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
