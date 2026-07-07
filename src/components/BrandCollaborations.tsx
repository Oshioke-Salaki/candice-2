"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   THE INDEX — editorial collaborations directory.
   Typographic rows like a magazine table of contents.
   Hover a row → a live photo preview floats with the cursor.
   Click a row → an inline cinematic film strip unfolds.
   ═══════════════════════════════════════════════════════════ */

type Collab = {
  id: string;
  name: string;
  category: "brand" | "editorial";
  count: number;
  tier?: string;
};

const COLLABS: Collab[] = [
  // ── Brand partnerships ──
  { id: "lacoste", name: "Lacoste", category: "brand", count: 1, tier: "Luxury" },
  { id: "people-ssense", name: "SSENSE × People", category: "brand", count: 1, tier: "Luxury" },
  { id: "bershka", name: "Bershka", category: "brand", count: 2, tier: "Contemporary" },
  { id: "asos", name: "ASOS", category: "brand", count: 1, tier: "Contemporary" },
  { id: "fashion-nova", name: "Fashion Nova", category: "brand", count: 1, tier: "Contemporary" },
  { id: "timberland", name: "Timberland", category: "brand", count: 1, tier: "Street" },
  { id: "vans", name: "Vans", category: "brand", count: 1, tier: "Street" },
  { id: "meshki", name: "Meshki", category: "brand", count: 1, tier: "Indie" },
  { id: "motel-rocks", name: "Motel Rocks", category: "brand", count: 1, tier: "Indie" },
  { id: "wmns-wear", name: "WMNS Wear", category: "brand", count: 2, tier: "Indie" },
  // ── Editorial shoots ──
  { id: "ldm-clo-ss26", name: "LDM CLO SS26", category: "editorial", count: 9 },
  { id: "meji-meji", name: "Meji Meji", category: "editorial", count: 6 },
  { id: "streetsouk", name: "Streetsouk", category: "editorial", count: 4 },
  { id: "ajanee-studio", name: "Ajanee Studio", category: "editorial", count: 3 },
  { id: "the-shine-cartel", name: "The Shine Cartel", category: "editorial", count: 2 },
  { id: "patrique-ophique", name: "Patrique Ophique", category: "editorial", count: 2 },
  { id: "bolapsd", name: "BolaPSD", category: "editorial", count: 2 },
  { id: "vvs-lagos", name: "VVS Lagos", category: "editorial", count: 2 },
  { id: "dolore-inc-ss26", name: "Dolore Inc SS26", category: "editorial", count: 2 },
  { id: "brown-thomas-ss25", name: "Brown Thomas SS25", category: "editorial", count: 2 },
  { id: "snowbunny", name: "Snowbunny", category: "editorial", count: 1 },
];

const src = (id: string, n: number) =>
  `/media/campaigns/${id}/${id}-${String(n).padStart(2, "0")}.jpg`;

type Filter = "all" | "brand" | "editorial";

export default function BrandCollaborations() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const visible = filter === "all" ? COLLABS : COLLABS.filter((c) => c.category === filter);

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
      { threshold: 0.15 }
    );
    rows.forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, [filter]);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section
      id="collaborations"
      ref={sectionRef}
      className="relative py-32"
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
              src={src(c.id, 1)}
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
        <div className="mb-14 md:mb-20">
          <div className="section-tag mb-6">Partnerships & Campaigns</div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(3rem, 9vw, 8rem)",
                lineHeight: 0.85,
                letterSpacing: "0.02em",
                color: "var(--text)",
              }}
            >
              THE&nbsp;INDEX
            </h2>
            {/* ── Understated text filters ── */}
            <div className="flex gap-7 pb-2">
              {(
                [
                  { key: "all", label: "All", n: COLLABS.length },
                  { key: "brand", label: "Brands", n: COLLABS.filter((c) => c.category === "brand").length },
                  { key: "editorial", label: "Editorial", n: COLLABS.filter((c) => c.category === "editorial").length },
                ] as const
              ).map(({ key, label, n }) => (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(key);
                    setOpenId(null);
                  }}
                  className="relative uppercase tracking-[0.22em] pb-1 transition-colors duration-300"
                  style={{
                    fontSize: "0.62rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: filter === key ? "var(--text)" : "var(--text-dim)",
                  }}
                >
                  {label}
                  <sup style={{ color: "var(--accent)", marginLeft: "3px", fontSize: "0.5rem" }}>
                    {n}
                  </sup>
                  <span
                    className="absolute bottom-0 left-0 h-px transition-all duration-400"
                    style={{
                      width: filter === key ? "100%" : "0%",
                      background: "var(--accent)",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ The index rows ═══ */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {visible.map((c, i) => {
            const isOpen = openId === c.id;
            const isHover = hoverId === c.id;
            const dimOthers = hoverId !== null && !isHover && !isOpen;
            return (
              <div key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                {/* ── Row ── */}
                <button
                  data-row
                  onClick={() => toggle(c.id)}
                  onMouseEnter={() => setHoverId(c.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className="reveal group w-full flex items-baseline gap-4 md:gap-8 text-left py-5 md:py-7 transition-opacity duration-400"
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
                      color: isHover || isOpen ? "var(--accent)" : "var(--text-dim)",
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
                      fontSize: "clamp(1.7rem, 5.5vw, 4.2rem)",
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      color: isOpen ? "var(--accent)" : "var(--text)",
                      transform: isHover && !isOpen ? "translateX(14px)" : "translateX(0)",
                      transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), color 0.3s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.name.toUpperCase()}
                  </span>

                  {/* meta */}
                  <span
                    className="hidden sm:flex shrink-0 items-baseline gap-5 uppercase tracking-[0.18em]"
                    style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}
                  >
                    {c.tier && (
                      <span style={{ color: isHover ? "var(--accent)" : "var(--text-dim)", transition: "color 0.3s" }}>
                        {c.tier}
                      </span>
                    )}
                    <span>
                      {c.count} frame{c.count > 1 ? "s" : ""}
                    </span>
                  </span>

                  {/* open indicator */}
                  <span
                    className="shrink-0 font-serif italic"
                    style={{
                      fontSize: "1.4rem",
                      lineHeight: 1,
                      color: isOpen ? "var(--accent)" : "var(--text-dim)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), color 0.3s",
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
                    transition: "grid-template-rows 0.65s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div className="pb-10 pt-2">
                      <div
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-4"
                        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}
                      >
                        {isOpen &&
                          Array.from({ length: c.count }, (_, n) => (
                            <figure
                              key={n}
                              className="relative shrink-0 overflow-hidden"
                              style={{ scrollSnapAlign: "start", background: "var(--bg-card)" }}
                            >
                              <Image
                                src={src(c.id, n + 1)}
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
                                {String(n + 1).padStart(2, "0")} / {String(c.count).padStart(2, "0")}
                              </span>
                            </figure>
                          ))}
                      </div>
                      <p
                        className="font-serif italic mt-4"
                        style={{ fontSize: "0.95rem", color: "var(--text-dim)" }}
                      >
                        {c.name} — {c.category === "brand" ? "Brand Partnership" : "Editorial"}
                        {c.tier ? ` · ${c.tier}` : ""} · drag to explore →
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
