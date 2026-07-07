"use client";

import { useEffect, useRef, useState } from "react";

interface StatConfig {
  value:  number
  label:  string
  format: (n: number) => string
}

/* Formats large counts as 0 → 500K → 2.3M so the viewer feels the scale. */
function compact(n: number, cap: string) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return m === Math.floor(m) ? `${m}M+` : cap
  }
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K`
  return `${n}`
}

const stats: StatConfig[] = [
  {
    value:  3_500_000,
    label:  'Views / 30 days',
    format: n => (n >= 3_500_000 ? '3.5M+' : compact(n, '3.5M+')),
  },
  {
    value:  2_300_000,
    label:  'Accounts Reached',
    format: n => (n >= 2_300_000 ? '2.3M+' : compact(n, '2.3M+')),
  },
  {
    /* Counts in tenths so the decimal ticks up smoothly. */
    value:  218,
    label:  'Engagement Rate',
    format: n => `${(n / 10).toFixed(1)}%`,
  },
  {
    value:  96,
    label:  'Reach Beyond Followers',
    format: n => `${n}%`,
  },
]

function Counter({ value, label, format }: StatConfig) {
  const [count,   setCount]   = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          const duration = 2200
          let startTime: number | null = null

          function easeOut(t: number) {
            return 1 - Math.pow(1 - t, 3)
          }

          function step(ts: number) {
            if (!startTime) startTime = ts
            const progress = Math.min((ts - startTime) / duration, 1)
            setCount(Math.floor(easeOut(progress) * value))
            if (progress < 1) requestAnimationFrame(step)
            else setCount(value)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, started])

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
      style={{ background: 'var(--bg-alt)' }}
    >
      <div
        className="font-display"
        style={{
          fontSize:      'clamp(2.2rem, 4.5vw, 4rem)',
          lineHeight:    1,
          color:         'var(--text)',
          letterSpacing: '0.02em',
        }}
      >
        {format(count)}
      </div>
      <div
        className="uppercase tracking-[0.25em] mt-3"
        style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}
      >
        {label}
      </div>
    </div>
  )
}

export default function Stats() {
  return (
    <section
      className="py-0"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="stats-grid max-w-none">
        {stats.map((s) => (
          <Counter key={s.label} {...s} />
        ))}
      </div>{" "}
      {/* stats-grid */}
    </section>
  );
}
