"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/* Rolling 90-day window (Apr–Jul).
   Views  = Instagram 4,874,470 + TikTok 1,500,000 = 6,374,470
   Reach  = Instagram 2,326,446 (TikTok reports no reach figure)
   Engmt. = TikTok (274,600 likes + 1,900 comments + 11,400 shares)
            ÷ 1,500,000 views = 19.2%
   Beyond = Instagram non-follower share of views */
const STATS = [
  { to: 6.3, format: (n: number) => `${n.toFixed(1)}M`, label: "Views" },
  { to: 2.3, format: (n: number) => `${n.toFixed(1)}M`, label: "Accounts reached" },
  { to: 19.2, format: (n: number) => `${n.toFixed(1)}%`, label: "Engagement rate" },
  { to: 76.2, format: (n: number) => `${n.toFixed(1)}%`, label: "Views from non-followers" },
];

/* Counts up once when scrolled into view. Writes straight to the DOM
   through Motion, so React never re-renders per frame. */
function Counter({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = format(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, format]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(to)}
    </span>
  );
}

export default function Stats() {
  return (
    <section aria-labelledby="stats-title" className="border-y border-line">
      <div className="mx-auto max-w-350 px-5 py-16 md:px-10 md:py-24">
        <p id="stats-title" className="text-xs font-medium tracking-[0.18em] text-ink-dim uppercase">
          Instagram and TikTok, last 90 days
        </p>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col-reverse justify-end ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""}`}>
              <dt className="mt-3 text-base text-ink-soft">{s.label}</dt>
              <dd className="text-5xl leading-none font-bold tracking-[-0.04em] md:text-6xl lg:text-7xl">
                <Counter to={s.to} format={s.format} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
