export default function Noise() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9998] pointer-events-none"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="du-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#du-noise)" opacity="0.05" />
      </svg>
    </div>
  )
}
