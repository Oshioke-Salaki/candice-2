"use client";

import { useEffect, useRef } from "react";

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

/* ─── Logo cell ───────────────────────────────── */
function LogoCell({ brand }: { brand: Brand }) {
  const base = 26; // px — baseline wordmark height
  return (
    <div
      className="logo-cell group relative flex items-center justify-center overflow-hidden cursor-default"
      style={{ background: "var(--bg)", minHeight: "7rem", padding: "1.5rem" }}
      title={brand.name}
    >
      {/* Hover wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "var(--accent)" }}
      />

      {brand.text ? (
        /* Typographic stand-in — matches the monochrome wall */
        <span
          className="font-display relative z-10 uppercase transition-colors duration-400 group-hover:text-[#EDE6DA]"
          style={{
            fontSize: "1.5rem",
            letterSpacing: "0.12em",
            color: "var(--text)",
            opacity: 0.85,
          }}
        >
          {brand.text}
        </span>
      ) : brand.pair ? (
        /* Two houses, one collab — joined by the serif × */
        <div className="relative z-10 flex items-center justify-center gap-3 w-full">
          <img
            src={brand.pair[0]}
            alt="Miu Miu"
            loading="lazy"
            className="brand-logo"
            style={{ height: `${base * 0.8}px`, width: "auto", maxWidth: "34%", objectFit: "contain" }}
          />
          <span
            className="font-serif italic transition-colors duration-400 group-hover:text-[#EDE6DA]"
            style={{ fontSize: "1.1rem", color: "var(--text-dim)", lineHeight: 1 }}
          >
            ×
          </span>
          <img
            src={brand.pair[1]}
            alt="L'Oréal"
            loading="lazy"
            className="brand-logo"
            style={{ height: `${base * 0.75}px`, width: "auto", maxWidth: "34%", objectFit: "contain" }}
          />
        </div>
      ) : (
        <img
          src={brand.logo}
          alt={brand.name}
          loading="lazy"
          className="brand-logo relative z-10"
          style={{
            height: `${base * (brand.h ?? 1)}px`,
            width: "auto",
            maxWidth: "72%",
            objectFit: "contain",
          }}
        />
      )}
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
            A few names. Many stories.
          </p>
        </div>
      </div>

      {/* ══ Partner brands — typographic wall ══ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div ref={logosRef} className="reveal brand-logos-grid">
          {brands.map((b) => (
            <LogoCell key={b.name} brand={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
