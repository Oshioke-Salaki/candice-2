"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Cat = "Fashion" | "Commercial" | "Off Duty";

const PHOTOS: { src: string; title: string; meta: string; cat: Cat }[] = [
  // ── Fashion ──
  { src: "/work/red-gown.jpg", title: "Crimson, Unfinished", meta: "Editorial — Lagos", cat: "Fashion" },
  { src: "/work/strawberry-sheer.jpg", title: "Strawberry Noir", meta: "Editorial", cat: "Fashion" },
  { src: "/work/bridal-veil.jpg", title: "The Veil", meta: "Editorial", cat: "Fashion" },
  { src: "/work/pedestal-duo.jpg", title: "Double Vision", meta: "Campaign", cat: "Fashion" },
  { src: "/work/camo-garage.jpg", title: "Yard Work", meta: "Street editorial", cat: "Fashion" },
  { src: "/work/container.jpg", title: "Containers", meta: "Street editorial", cat: "Fashion" },
  { src: "/work/pedestal-solo.jpg", title: "On the Pedestal", meta: "Campaign", cat: "Fashion" },
  { src: "/work/striped-night.jpg", title: "After Dark", meta: "Resort", cat: "Fashion" },
  // ── Commercial ──
  { src: "/work/red-suit.jpg", title: "Power, in Red", meta: "Studio — 2026", cat: "Commercial" },
  { src: "/work/tan-suit.jpg", title: "Tailored", meta: "Studio — 2026", cat: "Commercial" },
  { src: "/work/burgundy-coat.jpg", title: "Oxblood Coat", meta: "Beauty", cat: "Commercial" },
  { src: "/work/market-crochet.jpg", title: "Golden Hour", meta: "Beauty collab", cat: "Commercial" },
  { src: "/work/timberland.jpg", title: "Boots On", meta: "Lifestyle", cat: "Commercial" },
  { src: "/work/jersey-room.jpg", title: "Set Play", meta: "Set design", cat: "Commercial" },
  { src: "/work/red-suit-seated.jpg", title: "Boardroom", meta: "Studio — 2026", cat: "Commercial" },
  { src: "/work/tan-suit-seated.jpg", title: "Raffia", meta: "Studio — 2026", cat: "Commercial" },
  // ── Off Duty ──
  { src: "/work/beach-plaid.jpg", title: "Beach Day", meta: "Off duty", cat: "Off Duty" },
  { src: "/work/gold-jersey.jpg", title: "Gold Rush", meta: "Street", cat: "Off Duty" },
  { src: "/work/red-gown-bts.jpg", title: "Behind Crimson", meta: "BTS — Lagos", cat: "Off Duty" },
  { src: "/work/film-set.jpg", title: "On Set", meta: "BTS", cat: "Off Duty" },
  { src: "/work/spiral-stairs.jpg", title: "The Spiral", meta: "Location", cat: "Off Duty" },
  { src: "/work/stall-duo.jpg", title: "Market Stories", meta: "Street", cat: "Off Duty" },
  { src: "/work/scooter.jpg", title: "Quick Ride", meta: "Street", cat: "Off Duty" },
  { src: "/work/beauty-look.jpg", title: "Fresh Face", meta: "Beauty", cat: "Off Duty" },
];

const FILTERS = ["All", "Fashion", "Commercial", "Off Duty"] as const;

export default function BookGallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  /* Reveal the grid once */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const shown =
    filter === "All" ? PHOTOS : PHOTOS.filter((p) => p.cat === filter);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-32">
      {/* ── Filter chips ── */}
      <div className="flex flex-wrap gap-2 mb-14">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300"
              style={{
                fontSize: "0.6rem",
                border: `1px solid ${active ? "var(--accent)" : "var(--border-hi)"}`,
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#EDE6DA" : "var(--text-dim)",
                cursor: "pointer",
              }}
            >
              {f}
              <span
                className="ml-2"
                style={{ opacity: 0.55, letterSpacing: "0.05em" }}
              >
                {f === "All"
                  ? PHOTOS.length
                  : PHOTOS.filter((p) => p.cat === f).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Masonry grid — CSS columns keep each frame's own aspect ── */}
      <div
        ref={gridRef}
        className="reveal columns-1 sm:columns-2 lg:columns-3 gap-6"
      >
        {shown.map((p, i) => (
          <figure
            key={p.src}
            className="group relative mb-6 break-inside-avoid overflow-hidden animate-fade-in"
            style={{ background: "var(--bg-card)", animationDelay: `${(i % 9) * 0.05}s` }}
          >
            <Image
              src={p.src}
              alt={`${p.title} — ${p.meta}`}
              width={900}
              height={1200}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Hover overlay */}
            <figcaption
              className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 px-6 pb-5 pt-12"
              style={{
                background: "linear-gradient(transparent, rgba(4,2,1,0.78))",
              }}
            >
              <div className="font-serif italic text-lg" style={{ color: "#EDE6DA" }}>
                {p.title}
              </div>
              <div
                className="uppercase tracking-[0.22em] mt-1"
                style={{ fontSize: "0.52rem", color: "rgba(237,230,218,0.55)" }}
              >
                {p.meta} · {p.cat}
              </div>
            </figcaption>

            {/* index tag — always visible, editorial contact-sheet touch */}
            <span
              className="absolute top-3 right-3 uppercase tracking-[0.18em] px-2 py-1"
              style={{
                fontSize: "0.5rem",
                color: "rgba(237,230,218,0.85)",
                background: "rgba(4,2,1,0.45)",
                backdropFilter: "blur(6px)",
              }}
            >
              {String(PHOTOS.indexOf(p) + 1).padStart(2, "0")}
            </span>
          </figure>
        ))}
      </div>
    </div>
  );
}
