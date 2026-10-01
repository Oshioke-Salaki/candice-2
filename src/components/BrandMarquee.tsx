/* Logo wall directly under the hero: logos only, one slow marquee.
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

function Mark({ b, hidden }: { b: Brand; hidden?: boolean }) {
  if (b.text) {
    return (
      <span aria-hidden={hidden} className="text-2xl font-bold tracking-[0.08em] text-ink/70">
        {b.text}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={b.logo}
      alt={hidden ? "" : b.name}
      className="brand-mark w-auto max-w-[180px] object-contain"
      style={{ height: BASE * (b.h ?? 1) }}
    />
  );
}

export default function BrandMarquee() {
  return (
    <section aria-label="Brands Candice has worked with" className="overflow-hidden border-y border-line py-10">
      {/* Track is doubled so translating -50% loops seamlessly. Under
          reduced motion the animation stops and the first copy stays put. */}
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex items-center gap-16 pr-16">
            {BRANDS.map((b) => (
              <li key={b.name} className="flex shrink-0 items-center">
                <Mark b={b} hidden={copy === 1} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
