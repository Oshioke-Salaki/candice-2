"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Category = "Fashion" | "Beauty";

const FASHION_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  src: `/media/fashion/fashion-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Candice Fashion Editorial ${i + 1}`,
  category: "Fashion" as Category,
}));

const BEAUTY_PHOTOS = Array.from({ length: 9 }, (_, i) => ({
  src: `/media/beauty/beauty-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Candice Beauty Portrait ${i + 1}`,
  category: "Beauty" as Category,
}));

const ALL_PHOTOS = [...FASHION_PHOTOS, ...BEAUTY_PHOTOS];
const CATEGORIES = ["All", "Fashion", "Beauty"] as const;

export default function FashionBeauty() {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const shown =
    filter === "All"
      ? ALL_PHOTOS
      : ALL_PHOTOS.filter((p) => p.category === filter);

  return (
    <section id="fashion" className="py-32 overflow-hidden px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="mb-16">
          <div
            className="reveal animate-fade-in"
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="section-tag">Visual Portfolio</div>
          </div>
          <h2
            className="font-display animate-reveal-up"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--text)",
              marginBottom: "2rem",
            }}
          >
            FASHION<br />& BEAUTY
          </h2>

          {/* ── Category filters ── */}
          <div className="flex flex-wrap gap-2 animate-reveal-up">
            {CATEGORIES.map((cat) => {
              const active = cat === filter;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300"
                  style={{
                    fontSize: "0.6rem",
                    border: `1px solid ${
                      active ? "var(--accent)" : "var(--border-hi)"
                    }`,
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#EDE6DA" : "var(--text-dim)",
                    cursor: "pointer",
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {cat}
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      opacity: 0.6,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {cat === "All"
                      ? ALL_PHOTOS.length
                      : ALL_PHOTOS.filter((p) => p.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Masonry grid ── */}
        <div
          ref={gridRef}
          className="reveal columns-1 sm:columns-2 lg:columns-3 gap-6"
        >
          {shown.map((photo, i) => (
            <figure
              key={photo.src}
              className="group relative mb-6 break-inside-avoid overflow-hidden"
              style={{
                background: "var(--bg-card)",
                animationDelay: `${(i % 9) * 0.05}s`,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={600}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <figcaption
                className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 px-6 pb-6 pt-12"
                style={{
                  background: "linear-gradient(transparent, rgba(4,2,1,0.78))",
                }}
              >
                <div
                  className="uppercase tracking-[0.22em]"
                  style={{
                    fontSize: "0.52rem",
                    color: "rgba(237,230,218,0.7)",
                  }}
                >
                  {photo.category}
                </div>
              </figcaption>

              {/* Category badge */}
              <span
                className="absolute top-3 right-3 uppercase tracking-[0.18em] px-2 py-1"
                style={{
                  fontSize: "0.5rem",
                  color: "rgba(237,230,218,0.85)",
                  background: "rgba(4,2,1,0.45)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {photo.category === "Fashion" ? "F" : "B"}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
