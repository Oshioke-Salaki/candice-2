"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Campaign = {
  id: string;
  name: string;
  displayName: string;
  count: number;
};

const CAMPAIGNS: Campaign[] = [
  { id: "ldm-clo-ss26", name: "LDM CLO", displayName: "LDM CLO SS26", count: 6 },
  { id: "meji-meji", name: "MEJI MEJI", displayName: "MEJI MEJI SHOOT", count: 4 },
  {
    id: "brown-thomas-ss25",
    name: "BROWN THOMAS",
    displayName: "BROWN THOMAS SS25",
    count: 8,
  },
  {
    id: "patrique-ophique",
    name: "PATRIQUE OPHIQUE",
    displayName: "PATRIQUE OPHIQUE SHOOT",
    count: 6,
  },
  { id: "bolapsd", name: "BolaPSD", displayName: "BolaPSD SHOOT", count: 4 },
  {
    id: "ajanee-studio",
    name: "AJANEE STUDIO",
    displayName: "AJANEE STUDIO SHOOT",
    count: 5,
  },
  {
    id: "dolore-inc-ss26",
    name: "DOLORE INC",
    displayName: "DOLORE INC SS26",
    count: 5,
  },
  {
    id: "streetsouk-shoot",
    name: "STREETSOUK",
    displayName: "STREETSOUK SHOOT",
    count: 5,
  },
  {
    id: "the-shine-cartel",
    name: "SHINE CARTEL",
    displayName: "THE SHINE CARTEL BEAUTY",
    count: 6,
  },
];

export default function CampaignShowcase() {
  const [activeCampaign, setActiveCampaign] = useState("ldm-clo-ss26");
  const [photos, setPhotos] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeData = CAMPAIGNS.find((c) => c.id === activeCampaign);

  useEffect(() => {
    // Load photos for active campaign
    const photoList = Array.from({ length: activeData?.count || 0 }, (_, i) =>
      i + 1
    ).map(
      (num) =>
        `/media/campaigns/${activeCampaign}/${activeCampaign}-${String(num).padStart(2, "0")}.jpg`
    );
    setPhotos(photoList);

    // Trigger reveal animation
    const el = gridRef.current;
    if (el) {
      el.classList.remove("visible");
      setTimeout(() => el.classList.add("visible"), 10);
    }
  }, [activeCampaign, activeData?.count]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="campaigns" className="py-32 overflow-hidden px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="mb-16">
          <div
            className="reveal animate-fade-in"
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="section-tag">Collaborations & Editorials</div>
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
            CAMPAIGNS
          </h2>

          {/* ── Campaign tabs ── */}
          <div className="flex flex-wrap gap-2 animate-reveal-up">
            {CAMPAIGNS.map((campaign) => {
              const active = campaign.id === activeCampaign;
              return (
                <button
                  key={campaign.id}
                  onClick={() => setActiveCampaign(campaign.id)}
                  className="uppercase tracking-[0.18em] px-5 py-3 transition-all duration-300 text-sm font-medium"
                  style={{
                    border: `1px solid ${
                      active ? "var(--accent)" : "var(--border-hi)"
                    }`,
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#EDE6DA" : "var(--text-dim)",
                    cursor: "pointer",
                    fontSize: "0.6rem",
                  }}
                >
                  {campaign.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Campaign title & info ── */}
        <div className="mb-12 pb-8 border-b" style={{ borderColor: "var(--border)" }}>
          <h3
            className="font-serif italic"
            style={{
              fontSize: "1.8rem",
              color: "var(--text-dim)",
              marginBottom: "0.5rem",
            }}
          >
            {activeData?.displayName}
          </h3>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
            {activeData?.count} frames
          </p>
        </div>

        {/* ── Masonry grid ── */}
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

              {/* Frame number badge */}
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
