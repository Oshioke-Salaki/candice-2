'use client'

import { useEffect, useRef } from 'react'

const socials = [
  {
    name:   'Instagram',
    handle: '@wowcandice',
    href:   'https://www.instagram.com/wowcandice',
  },
  {
    name:   'TikTok',
    handle: '@wowcandice',
    href:   'https://www.tiktok.com/@wowcandice',
  },
  {
    name:   'WhatsApp',
    handle: '+353 83 804 5399',
    href:   'https://wa.me/353838045399',
  },
  {
    name:   'Email',
    handle: 'candicefarinde@gmail.com',
    href:   'mailto:candicefarinde@gmail.com',
  },
]

function useRevealRef() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible') },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function Contact() {
  const leftRef   = useRevealRef()
  const rightRef  = useRevealRef()
  const noteRef   = useRevealRef()

  return (
    <section
      id="contact"
      className="py-40 px-10"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-32 items-start">

        {/* ── LEFT ── */}
        <div ref={leftRef} className="reveal">
          <div className="section-tag">Get In Touch</div>

          <h2
            className="font-display mb-8"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 0.88, letterSpacing: '0.04em', color: 'var(--text)' }}
          >
            LET&apos;S MAKE
            <br />
            {/* Outlined variant — carries the oxblood accent */}
            <span
              style={{
                WebkitTextStroke: '1.5px var(--accent-soft)',
                color:            'transparent',
              }}
            >
              A MOMENT
            </span>
          </h2>

          <p
            className="font-serif italic mb-10"
            style={{ fontSize: '1.15rem', lineHeight: 1.65, color: 'var(--text-soft)', maxWidth: 380 }}
          >
            Campaigns, editorials, runway and content that gets replayed.
            Brands, agencies, and creative directors — let&apos;s talk.
          </p>

          <a
            href="mailto:candicefarinde@gmail.com"
            className="hoverable inline-flex items-center gap-3 no-underline transition-all duration-300 group"
            style={{
              fontSize:      '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'var(--text)',
              borderBottom:  '1px solid var(--border-hi)',
              paddingBottom: '0.5rem',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            candicefarinde@gmail.com
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex flex-col gap-10">
          <div ref={rightRef} className="reveal">
            <p
              className="uppercase tracking-[0.3em] mb-6"
              style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}
            >
              Find me on
            </p>

            {/* Socials list */}
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hoverable social-row group no-underline"
                  style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span
                    className="font-serif"
                    style={{ fontSize: '1.5rem', fontWeight: 300 }}
                  >
                    {s.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span
                      className="uppercase tracking-[0.18em] transition-colors duration-300"
                      style={{ fontSize: '0.62rem', color: 'var(--text-soft)' }}
                    >
                      {s.handle}
                    </span>
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ fontSize: '1rem', color: 'var(--text)' }}
                    >
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Brand inquiry note */}
          <div
            ref={noteRef}
            className="reveal p-8"
            style={{
              border:     '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}
          >
            <p
              className="uppercase tracking-[0.2em] mb-3"
              style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}
            >
              For brand inquiries
            </p>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-soft)' }}>
              Booking a campaign, editorial, runway show or content collaboration?
              Reach out via{' '}
              <a
                href="mailto:candicefarinde@gmail.com"
                className="no-underline transition-opacity duration-300 hover:opacity-70"
                style={{ color: 'var(--text)', borderBottom: '1px solid var(--border-hi)' }}
              >
                email
              </a>{' '}
              or WhatsApp with a brief overview of your brand and campaign goals.
              Based between London &amp; Lagos — travels worldwide.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
