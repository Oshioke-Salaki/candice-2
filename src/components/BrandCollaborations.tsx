"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { campaignFrame, cldBlurURL, cldLoader } from "@/lib/media";

/* ═══════════════════════════════════════════════════════════
   MY WORK — the full body of work, in two labelled groups so
   it reads unambiguously as BOTH modeling gigs AND brand deals.
   Modeling leads; brand partnerships follow.

   Typographic rows like a magazine table of contents.
   Hover a row → a live photo preview floats with the cursor.
   Click a row → an inline cinematic film strip unfolds.
   ═══════════════════════════════════════════════════════════ */

type Collab = {
  id: string;
  name: string;
  category: "modeling" | "brand";
  count: number;
  /** Custom frame sequence (1-based). Omit to run 1…count in order. */
  order?: number[];
};

/* ── Modeling — editorial & campaign shoots (leads the section) ── */
const MODELING: Collab[] = [
  { id: "meji-meji", name: "Meji Meji", category: "modeling", count: 7 },
  {
    id: "ldm-clo-ss26",
    name: "LDM CLO SS26",
    category: "modeling",
    count: 9,
    // Client-specified sequence. Frames 10–12 are the newer shots;
    // old frames 01, 02 and 05 are intentionally left out of the pile.
    order: [10, 6, 11, 3, 12, 4, 7, 8, 9],
  },
  { id: "streetsouk", name: "Streetsouk", category: "modeling", count: 4 },
  {
    id: "bolapsd",
    name: "BolaPSD",
    category: "modeling",
    count: 2,
    // The red-jersey frame leads.
    order: [2, 1],
  },
  {
    id: "by-naomi-smith",
    name: "By Naomi Smith",
    category: "modeling",
    count: 1,
  },
  { id: "ajanee-studio", name: "Ajanee Studio", category: "modeling", count: 3 },
  { id: "vvs-lagos", name: "VVS Lagos", category: "modeling", count: 2 },
  {
    id: "the-shine-cartel",
    name: "The Shine Cartel",
    category: "modeling",
    count: 2,
  },
  {
    id: "patrique-ophique",
    name: "Patrique Ophique",
    category: "modeling",
    count: 2,
  },
  {
    id: "dolore-inc-ss26",
    name: "Dolore Inc SS26",
    category: "modeling",
    count: 2,
  },
  {
    id: "brown-thomas-ss25",
    name: "Brown Thomas SS25",
    category: "modeling",
    count: 2,
  },
  { id: "snowbunny", name: "Snowbunny", category: "modeling", count: 1 },
];

/* ── Brand partnerships — most recognisable houses first ── */
const BRANDS: Collab[] = [
  { id: "lacoste", name: "Lacoste", category: "brand", count: 1 },
  { id: "vans", name: "Vans", category: "brand", count: 1 },
  { id: "timberland", name: "Timberland", category: "brand", count: 1 },
  { id: "asos", name: "ASOS", category: "brand", count: 1 },
  { id: "people-ssense", name: "SSENSE × People", category: "brand", count: 1 },
  { id: "fashion-nova", name: "Fashion Nova", category: "brand", count: 1 },
  { id: "bershka", name: "Bershka", category: "brand", count: 2 },
  { id: "meshki", name: "Meshki", category: "brand", count: 1 },
  { id: "motel-rocks", name: "Motel Rocks", category: "brand", count: 1 },
  { id: "wmns-wear", name: "WMNS Wear", category: "brand", count: 2 },
];

const COLLABS: Collab[] = [...MODELING, ...BRANDS];

/** Nth displayed frame → its real frame number on Cloudinary. */
const frameAt = (c: Collab, i: number) => c.order?.[i] ?? i + 1;
const src = campaignFrame;

export default function BrandCollaborations() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  /* ── Floating preview: lerp-follow the cursor with a lag ── */
  const tick = useCallback(() => {
    const el = previewRef.current;
    if (el) {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;
      const vx = mouse.current.x - pos.current.x;
      const rot = Math.max(-7, Math.min(7, vx * 0.06));
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${rot}deg)`;
    }
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [tick]);

  const onMouseMove = (e: React.MouseEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  };

  /* ── Reveal rows on scroll ── */
  useEffect(() => {
    const rows = sectionRef.current?.querySelectorAll("[data-row]");
    if (!rows) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            obs.unobserve(en.target);
          }
        }),
      { threshold: 0.15 },
    );
    rows.forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-20 md:py-32"
      onMouseMove={onMouseMove}
    >
      {/* ═══ Floating cursor preview (desktop only) ═══ */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 z-50 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="relative overflow-hidden transition-all duration-500"
          style={{
            width: hoverId && !openId ? "240px" : "0px",
            height: hoverId && !openId ? "320px" : "0px",
            marginLeft: "28px",
            marginTop: "-160px",
            opacity: hoverId && !openId ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          }}
        >
          {COLLABS.map((c) => (
            <Image
              key={c.id}
              loader={cldLoader}
              src={src(c.id, frameAt(c, 0))}
              alt=""
              fill
              sizes="240px"
              className="object-cover transition-opacity duration-300"
              style={{ opacity: hoverId === c.id ? 1 : 0 }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* ═══ Header ═══ */}
        <div className="mb-10 md:mb-16">
          <div className="section-tag mb-5">Selected Work</div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.6rem, 7vw, 6rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              color: "var(--text)",
            }}
          >
            MY WORK
          </h2>
          <p
            className="font-serif italic mt-4"
            style={{
              fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
              color: "var(--text-soft)",
              maxWidth: "44rem",
            }}
          >
            Modeling gigs — editorials, campaigns and runway — and the brands
            who book me for partnerships.
          </p>
        </div>

        {/* ═══ Group 1 — Modeling ═══ */}
        <GroupHeading
          label="Modeling"
          note="Editorial & campaign shoots"
          n={MODELING.length}
        />
        <IndexRows
          items={MODELING}
          openId={openId}
          hoverId={hoverId}
          setHoverId={setHoverId}
          toggle={toggle}
        />

        {/* ═══ Group 2 — Brand partnerships ═══ */}
        <div className="mt-16 md:mt-24">
          <GroupHeading
            label="Brand Partnerships"
            note="Campaigns & collaborations"
            n={BRANDS.length}
          />
          <IndexRows
            items={BRANDS}
            openId={openId}
            hoverId={hoverId}
            setHoverId={setHoverId}
            toggle={toggle}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Group heading ─────────────────────────────── */
function GroupHeading({
  label,
  note,
  n,
}: {
  label: string;
  note: string;
  n: number;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
      <h3
        className="font-display"
        style={{
          fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
          letterSpacing: "0.04em",
          color: "var(--text)",
        }}
      >
        {label}
        <sup
          style={{
            color: "var(--accent)",
            marginLeft: "6px",
            fontSize: "0.5em",
          }}
        >
          {n}
        </sup>
      </h3>
      <span
        className="uppercase tracking-[0.22em]"
        style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}
      >
        {note}
      </span>
    </div>
  );
}

/* ─── The interactive index rows ────────────────── */
function IndexRows({
  items,
  openId,
  hoverId,
  setHoverId,
  toggle,
}: {
  items: Collab[];
  openId: string | null;
  hoverId: string | null;
  setHoverId: (id: string | null) => void;
  toggle: (id: string) => void;
}) {
  return (
    <>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {items.map((c, i) => {
            const isOpen = openId === c.id;
            const isHover = hoverId === c.id;
            const dimOthers = hoverId !== null && !isHover && !isOpen;
            return (
              <div
                key={c.id}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* ── Row ── */}
                <button
                  data-row
                  onClick={() => toggle(c.id)}
                  onMouseEnter={() => setHoverId(c.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className="reveal group w-full flex items-baseline gap-4 md:gap-8 text-left py-4 md:py-5 transition-opacity duration-400"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: dimOthers ? 0.25 : 1,
                    transitionDelay: `${(i % 10) * 0.04}s`,
                  }}
                >
                  {/* index number */}
                  <span
                    className="shrink-0 tracking-[0.2em] tabular-nums"
                    style={{
                      fontSize: "0.6rem",
                      color:
                        isHover || isOpen ? "var(--accent)" : "var(--text-dim)",
                      transition: "color 0.3s",
                      width: "2.2rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* name — the star of the row */}
                  <span
                    className="font-display flex-1 min-w-0"
                    style={{
                      fontSize: "clamp(1.25rem, 3.4vw, 2.6rem)",
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      color: isOpen ? "var(--accent)" : "var(--text)",
                      transform:
                        isHover && !isOpen
                          ? "translateX(14px)"
                          : "translateX(0)",
                      transition:
                        "transform 0.5s cubic-bezier(0.16,1,0.3,1), color 0.3s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.name.toUpperCase()}
                  </span>

                  {/* meta */}
                  <span
                    className="hidden sm:flex shrink-0 items-baseline uppercase tracking-[0.18em]"
                    style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}
                  >
                    <span>
                      {c.count} frame{c.count > 1 ? "s" : ""}
                    </span>
                  </span>

                  {/* open indicator */}
                  <span
                    className="shrink-0 font-serif"
                    style={{
                      fontSize: "2.3rem",
                      fontWeight: 300,
                      lineHeight: 1,
                      color: isOpen ? "var(--accent)" : "var(--text-dim)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition:
                        "transform 0.45s cubic-bezier(0.16,1,0.3,1), color 0.3s",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>

                {/* ── Expanded film strip ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition:
                      "grid-template-rows 0.65s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div className="pb-10 pt-2">
                      <div
                        className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto pb-4"
                        style={{ scrollSnapType: "x mandatory" }}
                      >
                        {isOpen &&
                          Array.from({ length: c.count }, (_, n) => (
                            <figure
                              key={n}
                              className="relative shrink-0 overflow-hidden"
                              style={{
                                scrollSnapAlign: "start",
                                background: "var(--bg-card)",
                              }}
                            >
                              <Image
                                loader={cldLoader}
                                src={src(c.id, frameAt(c, n))}
                                placeholder="blur"
                                blurDataURL={cldBlurURL(src(c.id, frameAt(c, n)))}
                                alt={`${c.name} — frame ${n + 1}`}
                                width={720}
                                height={960}
                                sizes="(max-width: 768px) 78vw, 420px"
                                className="object-cover"
                                style={{
                                  height: "min(58vh, 520px)",
                                  width: "auto",
                                  maxWidth: "82vw",
                                }}
                              />
                              <span
                                className="absolute top-3 right-3 uppercase tracking-[0.18em] px-2 py-1"
                                style={{
                                  fontSize: "0.5rem",
                                  color: "rgba(237,230,218,0.9)",
                                  background: "rgba(4,2,1,0.5)",
                                  backdropFilter: "blur(6px)",
                                }}
                              >
                                {String(n + 1).padStart(2, "0")} /{" "}
                                {String(c.count).padStart(2, "0")}
                              </span>
                            </figure>
                          ))}
                      </div>
                      <p
                        className="font-serif italic mt-4"
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--text-soft)",
                        }}
                      >
                        {c.name} —{" "}
                        {c.category === "brand"
                          ? "Brand Partnership"
                          : "Modeling"}{" "}
                        · drag to explore →
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    </>
  );
}
