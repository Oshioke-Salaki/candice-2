'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) {
        barRef.current.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 h-px z-[10001]"
      style={{ width: '0%', background: 'var(--accent)' }}
    />
  )
}
