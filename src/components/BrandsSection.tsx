"use client";

import { useCallback, useEffect, useRef } from "react";

/* ─── Brand roster — logo wall.
   Every mark is normalized to monochrome via CSS (.brand-logo):
   white on dark theme, ink on light, cream on the accent hover wash.
   `h` is a per-logo height multiplier to balance optical weight. ─── */
type Brand = {
  name: string;
  logo?: string;
  h?: number;
  text?: string; // typographic fallback when no usable mark exists
  pair?: [string, string]; // two marks joined by a serif ×
};

const brands: Brand[] = [
  { name: "Topicals", logo: "/brands/final/topicals.png", h: 0.95 },
  { name: "ANUA", logo: "/brands/final/anua.png" },
  { name: "ASOS", logo: "/brands/final/asos.svg" },
  { name: "NYX", logo: "/brands/final/nyx.svg", h: 1.6 },
  { name: "Rhode Beauty", logo: "/brands/final/rhode.svg" },
  { name: "Morphe", logo: "/brands/final/morphe.svg" },
  { name: "Estée Lauder", logo: "/brands/final/estee-lauder.png", h: 3.1 },
  { name: "Bershka", logo: "/brands/final/bershka.svg" },
  { name: "Meshki", logo: "/brands/final/meshki.svg" },
  { name: "Timberland", logo: "/brands/final/timberland.svg", h: 1.6 },
  { name: "Puma", logo: "/brands/final/puma.svg", h: 1.4 },
  { name: "Lacoste", logo: "/brands/final/lacoste.svg", h: 1.5 },
  { name: "Marc Jacobs", logo: "/brands/final/marc-jacobs.png" },
  {
    name: "Miu Miu × L'Oréal",
    pair: ["/brands/final/miu-miu.svg", "/brands/final/loreal.svg"],
  },
  { name: "Izipizi", logo: "/brands/final/izipizi.svg", h: 1.15 },
  { name: "Quay", text: "QUAY" },
  { name: "Corteiz", logo: "/brands/final/corteiz.png", h: 1.6 },
  { name: "AboutYou", logo: "/brands/final/about-you.svg" },
  { name: "Motel Rocks", logo: "/brands/final/motel-rocks.png", h: 1.35 },
  { name: "Revolve", logo: "/brands/final/revolve.svg" },
  { name: "Fashion Nova", logo: "/brands/final/fashion-nova.svg" },
  { name: "Sumwon Women", text: "SUMWON" },
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

/* ─── One logo mark, rendered for either layer ────
   mode "mono"  → theme-aware silhouette (.brand-logo)
   mode "paper" → printed ink on cream; Lacoste keeps
                  its true colors (the only colored mark) */
function Mark({ brand, mode }: { brand: Brand; mode: "mono" | "paper" }) {
  const base = 30; // px — baseline wordmark height
  const imgClass =
    mode === "mono"
      ? "brand-logo"
      : brand.name === "Lacoste"
        ? "brand-true"
        : "brand-ink";
  if (brand.text) {
    return (
      <span
        className={`font-display uppercase ${mode === "paper" ? "spot-text" : ""}`}
        style={{
          fontSize: "1.6rem",
          letterSpacing: "0.12em",
          color: mode === "mono" ? "var(--text)" : undefined,
          opacity: mode === "mono" ? 0.8 : 0.92,
          lineHeight: 1,
        }}
      >
        {brand.text}
      </span>
    );
  }

  if (brand.pair) {
    return (
      <span className="flex items-center gap-3">
        <img
          src={brand.pair[0]}
          alt="Miu Miu"
          loading="lazy"
          className={imgClass}
          style={{ height: `${base * 0.75}px`, width: "auto", objectFit: "contain" }}
        />
        <span
          className={`font-serif italic ${mode === "paper" ? "spot-x" : ""}`}
          style={{
            fontSize: "1.1rem",
            color: mode === "mono" ? "var(--text-dim)" : undefined,
            lineHeight: 1,
          }}
        >
          ×
        </span>
        <img
          src={brand.pair[1]}
          alt="L'Oréal"
          loading="lazy"
          className={imgClass}
          style={{ height: `${base * 0.7}px`, width: "auto", objectFit: "contain" }}
        />
      </span>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      loading="lazy"
      className={imgClass}
      style={{
        height: `${base * (brand.h ?? 1)}px`,
        width: "auto",
        maxWidth: "min(46vw, 240px)",
        objectFit: "contain",
      }}
    />
  );
}

/* ─── The flowing wall, rendered twice (must match 1:1) ─── */
function Flow({ mode }: { mode: "mono" | "paper" }) {
  return (
    <div className="spot-flow">
      {brands.map((b) => (
        <span key={b.name} title={b.name} className="inline-flex items-center">
          <Mark brand={b} mode={mode} />
        </span>
      ))}
    </div>
  );
}

/* ─── Spotlight wall — "The Contact Sheet" ────────
   At rest: monochrome marks, no grid, free flow.
   A soft circle of warm paper follows the cursor and
   reveals the logos as printed ink (Lacoste in color).
   Touch devices: the light drifts on its own. ─── */
function SpotlightWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -9999, y: -9999, r: 0 });
  const cur = useRef({ x: -9999, y: -9999, r: 0 });
  const raf = useRef(0);
  const autoT = useRef(0);
  const autoMode = useRef(false);

  const tick = useCallback(() => {
    const paper = paperRef.current;
    const wall = wallRef.current;
    if (paper && wall) {
      if (autoMode.current) {
        // autonomous drift for touch devices
        autoT.current += 0.008;
        const t = autoT.current;
        const w = wall.offsetWidth;
        const hgt = wall.offsetHeight;
        target.current.x = w / 2 + Math.sin(t) * w * 0.36;
        target.current.y = hgt / 2 + Math.cos(t * 0.73) * hgt * 0.32;
        target.current.r = 150 + Math.sin(t * 1.6) * 30;
      }
      cur.current.x += (target.current.x - cur.current.x) * 0.14;
      cur.current.y += (target.current.y - cur.current.y) * 0.14;
      cur.current.r += (target.current.r - cur.current.r) * 0.1;
      paper.style.clipPath = `circle(${cur.current.r}px at ${cur.current.x}px ${cur.current.y}px)`;
    }
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    autoMode.current = window.matchMedia("(hover: none)").matches;
    if (autoMode.current) target.current.r = 150;
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [tick]);

  const onMove = (e: React.MouseEvent) => {
    if (autoMode.current) return;
    const rect = wallRef.current!.getBoundingClientRect();
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;
    target.current.r = 200;
  };
  const onLeave = () => {
    if (autoMode.current) return;
    target.current.r = 0;
  };

  return (
    <div
      ref={wallRef}
      className="relative overflow-hidden"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* base — monochrome marks on the site background */}
      <Flow mode="mono" />

      {/* the light — warm paper, printed ink, true Lacoste green */}
      <div
        ref={paperRef}
        aria-hidden="true"
        className="spot-paper absolute inset-0 pointer-events-none"
        style={{
          clipPath: "circle(0px at 50% 50%)",
          willChange: "clip-path",
        }}
      >
        <Flow mode="paper" />
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────── */
export default function BrandsSection() {
  const headerRef = useReveal(0.1);
  const logosRef = useReveal(0.08);

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
              fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
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
            A few names. Many stories.{" "}
            <span className="spot-hint" style={{ color: "var(--accent)" }}>
              Bring the light. ✶
            </span>
          </p>
        </div>
      </div>

      {/* ══ Partner brands — spotlight wall ══ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div ref={logosRef} className="reveal">
          <SpotlightWall />
        </div>
      </div>
    </section>
  );
}
