"use client";

import { useEffect, useRef } from "react";

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
          {brands.map((b, i) => (
            <NameCell key={b} name={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
