'use client'

import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Service {
  num:  string
  name: string
  desc: string
  span?: string
}

const services: Service[] = [
  {
    num:  '01',
    name: 'Fashion &\nEditorial',
    desc: 'Editorial spreads, designer lookbooks and high-fashion stories with cultural depth and modern edge. From crimson gowns in Lagos to bridal veils in London — images that stop the page.',
    span: 'row-span-2',
  },
  {
    num:  '02',
    name: 'Commercial\nModeling',
    desc: 'Brand campaigns, print advertising, beauty and e-commerce shoots. Your brand vision, delivered with polish and presence.',
  },
  {
    num:  '03',
    name: 'Content\nCreation',
    desc: 'Scroll-stopping photo and video content for social media and digital campaigns — 3.5M+ views in 30 days speak for themselves.',
  },
  {
    num:  '04',
    name: 'Brand\nPartnerships',
    desc: 'Long-term ambassador deals, sponsored content, and full lifestyle integration across every platform her audience lives on.',
  },
  {
    num:  '05',
    name: 'Runway &\nMotion',
    desc: 'Fashion shows, presentations and music-video features — movement, discipline and stage presence from LIA runways to major sets.',
  },
]

function ServiceCard({ s, delay = 0 }: { s: Service; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="reveal relative overflow-hidden p-12 group cursor-default hoverable h-full flex flex-col"
      style={{
        background:        'var(--bg-alt)',
        transitionDelay:   `${delay}s`,
      }}
    >
      <div className="svc-num relative z-10 mb-8 transition-colors duration-400"
        style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--text-dim)' }}>
        {s.num}
      </div>

      <h3
        className="svc-name relative z-10 font-serif mb-6 transition-colors duration-400 whitespace-pre-line"
        style={{ fontSize: 'clamp(1.6rem, 2.2vw, 2.8rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text)' }}
      >
        {s.name}
      </h3>

      <p
        className="svc-desc relative z-10 transition-colors duration-400"
        style={{ fontSize: '0.83rem', lineHeight: 1.85, color: 'var(--text-dim)' }}
      >
        {s.desc}
      </p>

      <span
        className="svc-arrow relative z-10 block mt-auto pt-8 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        style={{ color: 'var(--text-dim)' }}
      >
        <ArrowUpRight size={24} strokeWidth={1.5} />
      </span>
    </div>
  )
}

export default function Services() {
  const headRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = headRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="services"
      className="py-32 px-10"
      style={{ background: 'var(--bg-alt)' }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div
          ref={headRef}
          className="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6"
        >
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: 'var(--text)' }}
          >
            WHAT<br />I DO
          </h2>
          <p
            className="font-serif italic md:text-right"
            style={{ fontSize: '1.1rem', color: 'var(--text-dim)', maxWidth: 280 }}
          >
            A muse and an artist —<br />don&apos;t get it twisted.
          </p>
        </div>

        {/* Bento grid — responsive via CSS class in globals.css */}
        <div className="services-bento">
          {services.map((s, i) => (
            <div key={s.num} className={i === 0 ? 'h-full' : ''}>
              <ServiceCard s={s} delay={i * 0.08} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
