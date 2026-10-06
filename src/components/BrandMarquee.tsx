"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/* ─── Brand strip ─────────────────────────────────────────────
   Drifts on its own, and can be grabbed: drag or swipe to scrub,
   fling it and it glides on with momentum before easing back into
   its drift, now heading the way it was thrown. The marks lean into
   the motion, harder the faster it goes.

   Each logo is positioned on its own and wraps around the loop. The
   old version slid one ~10,000px band, which iOS Safari eventually
   stops painting (the strip went blank); small independent layers
   don't hit that limit.

   `h` is a per-logo height multiplier that balances optical weight. */
type Brand = { name: string; logo?: string; h?: number; text?: string };

const BRANDS: Brand[] = [
  { name: "Lacoste", logo: "/brands/final/lacoste.svg", h: 1.5 },
  { name: "Estée Lauder", logo: "/brands/final/estee-lauder.png", h: 3.1 },
  { name: "Marc Jacobs", logo: "/brands/final/marc-jacobs.png" },
  { name: "Mowalola", text: "MOWALOLA" },
  { name: "Kai Collective", text: "KAI COLLECTIVE" },
  { name: "Miu Miu", logo: "/brands/final/miu-miu.svg", h: 0.8 },
  { name: "L'Oréal", logo: "/brands/final/loreal.svg", h: 0.75 },
  { name: "Timberland", logo: "/brands/final/timberland.svg", h: 1.6 },
  { name: "Puma", logo: "/brands/final/puma.svg", h: 1.4 },
  { name: "Rhode", logo: "/brands/final/rhode.svg" },
  { name: "NYX", logo: "/brands/final/nyx.svg", h: 1.6 },
  { name: "Morphe", logo: "/brands/final/morphe.svg" },
  { name: "ASOS", logo: "/brands/final/asos.svg" },
  { name: "Bershka", logo: "/brands/final/bershka.svg" },
  { name: "Corteiz", logo: "/brands/final/corteiz.png", h: 1.6 },
  { name: "Revolve", logo: "/brands/final/revolve.svg" },
  { name: "Fashion Nova", logo: "/brands/final/fashion-nova.svg" },
  { name: "Meshki", logo: "/brands/final/meshki.svg" },
  { name: "Motel Rocks", logo: "/brands/final/motel-rocks.png", h: 1.35 },
  { name: "About You", logo: "/brands/final/about-you.svg" },
  { name: "Topicals", logo: "/brands/final/topicals.png", h: 0.95 },
  { name: "ANUA", logo: "/brands/final/anua.png" },
  { name: "Izipizi", logo: "/brands/final/izipizi.svg", h: 1.15 },
  { name: "Quay", text: "QUAY" },
  { name: "Sumwon", text: "SUMWON" },
];

const BASE = 26; // px, baseline mark height
const SPEED = 38; // px/s idle drift
const GAP = 64; // px between marks

function Mark({ b }: { b: Brand }) {
  if (b.text) {
    return <span className="text-2xl font-bold tracking-[0.08em] whitespace-nowrap text-ink">{b.text}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={b.logo}
      alt={b.name}
      draggable={false}
      className="brand-mark pointer-events-none w-auto max-w-[180px] object-contain select-none"
      style={{ height: BASE * (b.h ?? 1) }}
    />
  );
}

/** One mark: placed at its slot plus the shared offset, wrapped
    around the loop so it re-enters on the far side. */
function Slot({
  b,
  start,
  total,
  lead,
  offset,
  skew,
  onSize,
}: {
  b: Brand;
  start: number;
  total: number;
  lead: number;
  offset: MotionValue<number>;
  skew: MotionValue<number>;
  onSize: (w: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const x = useTransform(offset, (o) => {
    if (!total) return start;
    const p = (((start + o) % total) + total) % total;
    return p - lead;
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onSize(el.offsetWidth));
    ro.observe(el);
    onSize(el.offsetWidth);
    return () => ro.disconnect();
  }, [onSize]);

  return (
    <motion.li
      ref={ref}
      style={{ x, skewX: skew }}
      className="absolute top-0 left-0 flex h-full items-center opacity-70 transition-opacity duration-300 hover:opacity-100"
    >
      <Mark b={b} />
    </motion.li>
  );
}

export default function BrandMarquee() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[]>(() => BRANDS.map(() => 0));
  // If a logo never loads, don't hold the whole strip back for it.
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setGaveUp(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  const offset = useMotionValue(0);
  const velocity = useMotionValue(0); // px/s, drives the lean
  const smoothV = useSpring(velocity, { stiffness: 260, damping: 40 });
  const skew = useTransform(smoothV, (v) => (reduce ? 0 : Math.max(-14, Math.min(14, v / -90))));

  // Physics state lives in refs: no re-render per frame.
  const cur = useRef(-SPEED); // current velocity
  const dir = useRef(-1); // drift direction, follows the last fling
  const dragging = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(true);
  const last = useRef({ x: 0, t: 0, v: 0 });

  // Layout: cumulative slot starts from measured widths.
  const starts: number[] = [];
  let acc = 0;
  for (const w of widths) {
    starts.push(acc);
    acc += w + GAP;
  }
  const measured = widths.every((w) => w > 0) || gaveUp;
  const total = measured ? acc : 0;
  const lead = measured ? Math.max(...widths) + GAP : 0;

  const sizers = useRef(
    BRANDS.map((_, i) => (w: number) =>
      setWidths((prev) => (prev[i] === w ? prev : prev.map((v, j) => (j === i ? w : v)))),
    ),
  ).current;

  // Only animate while the strip is on screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!visible.current || dragging.current || !total) return;
    const dt = Math.min(delta, 64) / 1000;
    const cruise = reduce ? 0 : dir.current * SPEED * (hovering.current ? 0.25 : 1);
    // Momentum eases toward the cruising speed (friction after a fling).
    cur.current += (cruise - cur.current) * (1 - Math.exp(-dt * 2.2));
    offset.set(offset.get() + cur.current * dt);
    velocity.set(Math.abs(cur.current) < SPEED * 1.2 ? 0 : cur.current);
  });

  /* Drag / swipe. Vertical page scrolling stays native (touch-action:
     pan-y), so on phones only sideways swipes scrub the strip. */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging.current = true;
    last.current = { x: e.clientX, t: performance.now(), v: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dx = e.clientX - last.current.x;
    const dt = Math.max(1, now - last.current.t) / 1000;
    const v = dx / dt;
    // Smooth the release velocity so a jittery last frame doesn't decide it.
    last.current = { x: e.clientX, t: now, v: last.current.v * 0.6 + v * 0.4 };
    offset.set(offset.get() + dx);
    velocity.set(last.current.v);
  };
  const release = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const v = Math.max(-4000, Math.min(4000, last.current.v));
    cur.current = v;
    if (Math.abs(v) > 120) dir.current = Math.sign(v);
  }, []);

  // Arrow keys nudge it, for keyboard visitors.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") cur.current -= 900;
    else if (e.key === "ArrowRight") cur.current += 900;
    else return;
    e.preventDefault();
  };

  return (
    <section aria-label="Brands Candice has worked with" className="border-y border-line py-8 md:py-10">
      <div
        ref={wrapRef}
        tabIndex={0}
        aria-roledescription="scrollable strip"
        aria-label="Brand logos. Drag, swipe or use the arrow keys to scroll."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onPointerEnter={(e) => e.pointerType === "mouse" && (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
        onKeyDown={onKeyDown}
        className="relative h-16 cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing md:h-20"
      >
        <ul className={`h-full transition-opacity duration-500 ${measured ? "opacity-100" : "opacity-0"}`}>
          {BRANDS.map((b, i) => (
            <Slot
              key={b.name}
              b={b}
              start={starts[i]}
              total={total}
              lead={lead}
              offset={offset}
              skew={skew}
              onSize={sizers[i]}
            />
          ))}
        </ul>
        {/* Soft fades at both edges so marks glide in and out. */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-bg to-transparent md:w-24" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-bg to-transparent md:w-24" />
      </div>
    </section>
  );
}
