"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const workItems = [
  {
    num:   '01',
    label: 'Crimson, Unfinished',
    type:  'Fashion · Lagos',
    img:   '/work/red-gown.jpg',
  },
  {
    num:   '02',
    label: 'Power, in Red',
    type:  'Commercial · Editorial',
    img:   '/work/red-suit.jpg',
  },
  {
    num:   '03',
    label: 'Yard Work',
    type:  'Fashion · Street',
    img:   '/work/camo-garage.jpg',
  },
  {
    num:   '04',
    label: 'Golden Hour',
    type:  'Beauty · Campaign',
    img:   '/work/market-crochet.jpg',
  },
  {
    num:   '05',
    label: 'After Dark',
    type:  'Fashion · Night',
    img:   '/work/striped-night.jpg',
  },
  {
    num:   '06',
    label: 'Containers',
    type:  'Fashion · Location',
    img:   '/work/container.jpg',
  },
  {
    num:   '07',
    label: 'Set Play',
    type:  'Commercial · Sport',
    img:   '/work/jersey-room.jpg',
  },
  {
    num:   '08',
    label: 'Veiled',
    type:  'Bridal · Editorial',
    img:   '/work/bridal-veil.jpg',
  },
];

export default function Work() {
  const stripRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const scrollL = useRef(0);

  /* Reveal header */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Drag-to-scroll */
  function onDown(e: React.MouseEvent) {
    setDragging(true);
    startX.current = e.pageX - (stripRef.current?.offsetLeft ?? 0);
    scrollL.current = stripRef.current?.scrollLeft ?? 0;
  }
  function onMove(e: React.MouseEvent) {
    if (!dragging || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    stripRef.current.scrollLeft = scrollL.current - (x - startX.current) * 1.4;
  }
  function onUp() {
    setDragging(false);
  }
  function onLeave() {
    setDragging(false);
  }

  return (
    <section
      id="work"
      className="py-32 overflow-hidden"
      style={{ paddingLeft: "2.5rem" }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="reveal flex justify-between items-end mb-14"
        style={{ paddingRight: "2.5rem" }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 7vw, 8rem)",
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            color: "var(--text)",
          }}
        >
          WORK
        </h2>
        <div className="flex flex-col items-end gap-3">
          <span
            className="uppercase tracking-[0.2em]"
            style={{ fontSize: "0.62rem", color: "var(--text-dim)" }}
          >
            ← Drag to explore
          </span>
          <Link
            href="/book"
            className="uppercase tracking-[0.2em] no-underline transition-opacity duration-300 hover:opacity-70"
            style={{
              fontSize: "0.62rem",
              color: "var(--text)",
              borderBottom: "1px solid var(--accent)",
              paddingBottom: "0.35rem",
            }}
          >
            View the full book →
          </Link>
        </div>
      </div>

      {/* Drag strip */}
      <div
        ref={stripRef}
        className="flex gap-px overflow-x-auto select-none"
        style={{
          scrollbarWidth: "none",
          paddingRight: "2.5rem",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onLeave}
      >
        {workItems.map((item) => (
          <div
            key={item.num}
            className="flex-none relative overflow-hidden hoverable group"
            style={{
              width: "clamp(210px, 26vw, 400px)",
              aspectRatio: "2/3",
              background: "var(--bg-card)",
            }}
          >
            {/*
              TO ADD A REAL PHOTO:
              1. Place work-1.jpg … work-6.jpg in /public/
              2. Uncomment the <img> below and delete the placeholder div
              */}

            <img
              src={item.img}
              alt={item.label}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              // style={{ filter: "grayscale(100%)" }}
            />

            {/* Placeholder */}
            {/* <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(170deg, var(--bg-alt) 0%, var(--bg-card) 100%)",
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: "5rem",
                  color: "var(--text-muted)",
                  lineHeight: 1,
                }}
              >
                {item.num}
              </span>
              <span
                className="uppercase tracking-[0.22em]"
                style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}
              >
                {item.label}
              </span>
            </div> */}

            {/* Hover overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10 px-6 pb-6 pt-10"
              style={{
                background: "linear-gradient(transparent, rgba(0,0,0,0.72))",
              }}
            >
              <div className="font-serif italic text-lg text-[#EDEDE8]">
                {item.label}
              </div>
              <div
                className="uppercase tracking-[0.18em]"
                style={{ fontSize: "0.58rem", color: "rgba(237,237,232,0.45)" }}
              >
                {item.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
