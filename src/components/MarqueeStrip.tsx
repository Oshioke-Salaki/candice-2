const items = [
  'A MUSE AND AN ARTIST',
  'WOW CANDICE',
  'FASHION MODEL',
  'COMMERCIAL',
  'CONTENT CREATOR',
  "DON'T GET IT TWISTED",
]

export default function MarqueeStrip() {
  // Duplicate for seamless infinite scroll
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden py-4"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex w-max animate-marquee-ltr hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className="font-display whitespace-nowrap px-8"
              style={{
                fontSize:      'clamp(1.6rem, 3.5vw, 3.2rem)',
                letterSpacing: '0.15em',
                color:         i % 2 === 0 ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {item}
            </span>
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>✶</span>
          </span>
        ))}
      </div>
    </div>
  )
}
