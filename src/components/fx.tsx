"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/* Small interaction pieces shared across the page. Each one is
   desktop-pointer only and switches off under reduced motion. */

/* ─── RollText ────────────────────────────────────────────────
   On hover the word rolls up and a fresh copy rolls in beneath it.
   The parent must carry the `group` class. */
export function RollText({ children }: { children: string }) {
  const roll =
    "block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0";
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className={roll}>{children}</span>
      <span aria-hidden className={`absolute top-full left-0 ${roll}`}>
        {children}
      </span>
    </span>
  );
}

/* ─── Magnetic ────────────────────────────────────────────────
   The child leans toward the pointer while it is near, then springs
   back. Driven by motion values, so React never re-renders. */
export function Magnetic({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
