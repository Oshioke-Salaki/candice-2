"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type BrandCollab = {
  id: string;
  brand: string;
  displayName: string;
  category: "brand-collab" | "editorial-shoot";
  count: number;
  tier?: "luxury" | "contemporary" | "street" | "indie";
};

const COLLABORATIONS: BrandCollab[] = [
  // ══ BRAND COLLABORATIONS ══
  {
    id: "lacoste",
    brand: "LACOSTE",
    displayName: "Lacoste",
    category: "brand-collab",
    count: 1,
    tier: "luxury",
  },
  {
    id: "fashion-nova",
    brand: "FASHION NOVA",
    displayName: "Fashion Nova",
    category: "brand-collab",
    count: 1,
    tier: "contemporary",
  },
  {
    id: "people-ssense",
    brand: "SSENSE",
    displayName: "SSENSE x People",
    category: "brand-collab",
    count: 1,
    tier: "luxury",
  },
  {
    id: "bershka",
    brand: "BERSHKA",
    displayName: "Bershka",
    category: "brand-collab",
    count: 2,
    tier: "contemporary",
  },
  {
    id: "timberland",
    brand: "TIMBERLAND",
    displayName: "Timberland",
    category: "brand-collab",
    count: 1,
    tier: "street",
  },
  {
    id: "vans",
    brand: "VANS",
    displayName: "Vans",
    category: "brand-collab",
    count: 1,
    tier: "street",
  },
  {
    id: "asos",
    brand: "ASOS",
    displayName: "ASOS",
    category: "brand-collab",
    count: 1,
    tier: "contemporary",
  },
  {
    id: "meshki",
    brand: "MESHKI",
    displayName: "Meshki",
    category: "brand-collab",
    count: 1,
    tier: "indie",
  },
  {
    id: "motel-rocks",
    brand: "MOTEL ROCKS",
    displayName: "Motel Rocks",
    category: "brand-collab",
    count: 1,
    tier: "indie",
  },
  {
    id: "wmns-wear",
    brand: "WMNS WEAR",
    displayName: "WMNS Wear",
    category: "brand-collab",
    count: 2,
    tier: "indie",
  },

  // ══ EDITORIAL SHOOTS ══
  {
    id: "ajanee-studio",
    brand: "AJANEE STUDIO",
    displayName: "Ajanee Studio",
    category: "editorial-shoot",
    count: 4,
  },
  {
    id: "bolapsd",
    brand: "BOLAPSD",
    displayName: "BolaPSD",
    category: "editorial-shoot",
    count: 1,
  },
  {
    id: "meji-meji",
    brand: "MEJI MEJI",
    displayName: "MEJI MEJI",
    category: "editorial-shoot",
    count: 9,
  },
  {
    id: "streetsouk",
    brand: "STREETSOUK",
    displayName: "Streetsouk",
    category: "editorial-shoot",
    count: 4,
  },
  {
    id: "patrique-ophique",
    brand: "PATRIQUE OPHIQUE",
    displayName: "Patrique Ophique",
    category: "editorial-shoot",
    count: 3,
  },
  {
    id: "ldm-clo-ss26",
    brand: "LDM CLO",
    displayName: "LDM CLO SS26",
    category: "editorial-shoot",
    count: 9,
  },
  {
    id: "the-shine-cartel",
    brand: "SHINE CARTEL",
    displayName: "The Shine Cartel",
    category: "editorial-shoot",
    count: 2,
  },
  {
    id: "vvs-lagos",
    brand: "VVS LAGOS",
    displayName: "VVS Lagos",
    category: "editorial-shoot",
    count: 2,
  },
  {
    id: "dolore-inc-ss26",
    brand: "DOLORE INC",
    displayName: "Dolore Inc SS26",
    category: "editorial-shoot",
    count: 1,
  },
  {
    id: "brown-thomas-ss25",
    brand: "BROWN THOMAS",
    displayName: "Brown Thomas SS25",
    category: "editorial-shoot",
    count: 2,
  },
];

export default function BrandCollaborations() {
  const [activeType, setActiveType] = useState<"all" | "brand-collab" | "editorial-shoot">(
    "all"
  );
  const [activeItem, setActiveItem] = useState(COLLABORATIONS[0].id);
  const [photos, setPhotos] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeType === "all"
      ? COLLABORATIONS
      : COLLABORATIONS.filter((c) => c.category === activeType);

  const activeData = COLLABORATIONS.find((c) => c.id === activeItem);

  useEffect(() => {
    const photoList = Array.from({ length: activeData?.count || 0 }, (_, i) =>
      i + 1
    ).map(
      (num) =>
        `/media/campaigns/${activeItem}/${activeItem}-${String(num).padStart(2, "0")}.jpg`
    );
    setPhotos(photoList);

    const el = gridRef.current;
    if (el) {
      el.classList.remove("visible");
      setTimeout(() => el.classList.add("visible"), 10);
    }
  }, [activeItem, activeData?.count]);

  return (
    <section id="collaborations" className="py-32 overflow-hidden px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="mb-16">
          <div className="reveal animate-fade-in" style={{ marginBottom: "1.5rem" }}>
            <div className="section-tag">Partnerships & Campaigns</div>
          </div>
          <h2
            className="font-display animate-reveal-up"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--text)",
              marginBottom: "3rem",
            }}
          >
            COLLABORATIONS
          </h2>

          {/* ── Type Filter ── */}
          <div className="flex gap-3 mb-8 animate-reveal-up">
            {(
              [
                { key: "all", label: "All" },
                { key: "brand-collab", label: "Brand Partners" },
                { key: "editorial-shoot", label: "Editorial" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveType(key);
                  setActiveItem(
                    filtered.find((c) => c.category === (key === "all" ? c.category : key))
                      ?.id || COLLABORATIONS[0].id
                  );
                }}
                className="uppercase tracking-[0.18em] px-4 py-2 transition-all duration-300"
                style={{
                  fontSize: "0.65rem",
                  border: `1px solid ${activeType === key ? "var(--accent)" : "var(--border-hi)"}`,
                  background: activeType === key ? "var(--accent)" : "transparent",
                  color: activeType === key ? "#EDE6DA" : "var(--text-dim)",
                  cursor: "pointer",
                  fontWeight: activeType === key ? 700 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Brand Grid (Interactive) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filtered.map((collab) => {
              const isActive = collab.id === activeItem;
              const isBrand = collab.category === "brand-collab";
              return (
                <button
                  key={collab.id}
                  onClick={() => setActiveItem(collab.id)}
                  className="group relative p-3 transition-all duration-300 overflow-hidden"
                  style={{
                    border: `1.5px solid ${
                      isActive ? "var(--accent)" : "var(--border-hi)"
                    }`,
                    background: isActive ? "rgba(194,69,62,0.08)" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      lineHeight: 1.2,
                      textAlign: "center",
                      color: "var(--text)",
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {collab.brand}
                  </div>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      color: "var(--text-dim)",
                      marginTop: "0.3rem",
                      opacity: 0.6,
                    }}
                  >
                    {collab.count} frame{collab.count > 1 ? "s" : ""}
                    {isBrand && collab.tier && ` • ${collab.tier.toUpperCase()}`}
                  </div>
                  {isActive && (
                    <div
                      className="absolute top-0 left-0 right-0"
                      style={{
                        height: "2px",
                        background: "var(--accent)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Item Display ── */}
        {activeData && (
          <div className="mb-12 pb-8 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-baseline justify-between">
              <div>
                <h3
                  className="font-serif italic"
                  style={{
                    fontSize: "1.8rem",
                    color: "var(--text)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {activeData.displayName}
                </h3>
                <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
                  {activeData.count} frame{activeData.count > 1 ? "s" : ""} •{" "}
                  {activeData.category === "brand-collab" ? "Brand Partnership" : "Editorial"}
                </p>
              </div>
              {activeData.tier && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  {activeData.tier}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Masonry Grid ── */}
        <div
          ref={gridRef}
          className="reveal columns-1 sm:columns-2 lg:columns-3 gap-6"
        >
          {photos.map((photo, i) => (
            <figure
              key={photo}
              className="group relative mb-6 break-inside-avoid overflow-hidden"
              style={{
                background: "var(--bg-card)",
                animationDelay: `${(i % 9) * 0.05}s`,
              }}
            >
              <Image
                src={photo}
                alt={`${activeData?.displayName} - Frame ${i + 1}`}
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
                  {activeData?.displayName}
                </div>
              </figcaption>

              {/* Frame number */}
              <span
                className="absolute top-3 right-3 uppercase tracking-[0.18em] px-2 py-1"
                style={{
                  fontSize: "0.5rem",
                  color: "rgba(237,230,218,0.85)",
                  background: "rgba(4,2,1,0.45)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
