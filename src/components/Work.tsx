"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { campaignFrame, cldBlurURL, cldLoader, cldLoaderWith } from "@/lib/media";

type Collab = {
  id: string;
  name: string;
  count: number;
  /** Custom frame sequence (1-based). Omit to run 1…count in order. */
  order?: number[];
};

/* Modeling: editorial and campaign shoots. */
const MODELING: Collab[] = [
  { id: "meji-meji", name: "Meji Meji", count: 7 },
  // Client-specified sequence: 10 opens, then 12, then 04. Frames 01,
  // 02 and 05 stay out of the set.
  { id: "ldm-clo-ss26", name: "LDM CLO SS26", count: 9, order: [10, 12, 4, 6, 11, 3, 7, 8, 9] },
  { id: "streetsouk", name: "Streetsouk", count: 4 },
  // The red-jersey frame leads.
  { id: "bolapsd", name: "BolaPSD", count: 2, order: [2, 1] },
  { id: "by-naomi-smith", name: "By Naomi Smith", count: 1 },
  { id: "ajanee-studio", name: "Ajanee Studio", count: 3 },
  { id: "vvs-lagos", name: "VVS Lagos", count: 2 },
  { id: "the-shine-cartel", name: "The Shine Cartel", count: 2 },
  { id: "patrique-ophique", name: "Patrique Ophique", count: 2 },
  { id: "dolore-inc-ss26", name: "Dolore Inc SS26", count: 2 },
  { id: "brown-thomas-ss25", name: "Brown Thomas SS25", count: 2 },
  { id: "snowbunny", name: "Snowbunny", count: 1 },
];

/* Brand partnerships: most recognisable houses first. */
const BRANDS: Collab[] = [
  { id: "lacoste", name: "Lacoste", count: 1 },
  { id: "vans", name: "Vans", count: 1 },
  { id: "timberland", name: "Timberland", count: 1 },
  { id: "asos", name: "ASOS", count: 1 },
  { id: "people-ssense", name: "SSENSE × People", count: 1 },
  { id: "fashion-nova", name: "Fashion Nova", count: 1 },
  { id: "bershka", name: "Bershka", count: 2 },
  { id: "meshki", name: "Meshki", count: 1 },
  { id: "motel-rocks", name: "Motel Rocks", count: 1 },
  { id: "wmns-wear", name: "WMNS Wear", count: 2 },
];

const TABS = [
  { key: "modeling", label: "Modeling", items: MODELING },
  { key: "brand", label: "Brand partnerships", items: BRANDS },
] as const;

/** Nth displayed frame → its real frame number on Cloudinary. */
const frameAt = (c: Collab, i: number) => campaignFrame(c.id, c.order?.[i] ?? i + 1);

/* Varied crops give the masonry its rhythm. */
const RATIOS = ["3:4", "4:5", "2:3", "4:5", "3:4", "2:3"];
const loaders = Object.fromEntries(
  RATIOS.map((r) => [r, cldLoaderWith(`c_fill,ar_${r},g_auto`)]),
);

const ease = [0.16, 1, 0.3, 1] as const;

export default function Work() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("modeling");
  const [open, setOpen] = useState<Collab | null>(null);
  const items = TABS.find((t) => t.key === tab)!.items;

  return (
    <section id="work" className="mx-auto max-w-350 scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <h2 className="text-5xl leading-none font-bold tracking-[-0.04em] md:text-7xl">Selected work</h2>

      <div role="tablist" aria-label="Work type" className="mt-10 flex gap-8 border-b border-line">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={`relative pb-4 text-base font-medium transition-colors md:text-lg ${
                active ? "text-ink" : "text-ink-dim hover:text-ink-soft"
              }`}
            >
              {t.label}
              <span className="ml-2 text-sm tabular-nums text-ink-dim">{t.items.length}</span>
              {active && (
                <motion.span
                  layoutId="work-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={tab}
          role="tabpanel"
          className="mt-10 columns-2 gap-4 md:columns-3 md:gap-6 lg:columns-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {items.map((c, i) => {
            const ratio = RATIOS[i % RATIOS.length];
            const [w, h] = ratio.split(":").map(Number);
            return (
              <motion.li
                key={c.id}
                className="mb-4 break-inside-avoid md:mb-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(c)}
                  className="group block w-full text-left"
                  aria-label={`Open ${c.name}, ${c.count} frame${c.count > 1 ? "s" : ""}`}
                >
                  <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: `${w}/${h}` }}>
                    <Image
                      loader={loaders[ratio]}
                      src={frameAt(c, 0)}
                      alt=""
                      fill
                      placeholder="blur"
                      blurDataURL={cldBlurURL(frameAt(c, 0), `c_fill,ar_${ratio},g_auto`)}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="text-base font-medium md:text-lg">{c.name}</span>
                    <span className="shrink-0 text-sm tabular-nums text-ink-dim">
                      {c.count} {c.count > 1 ? "frames" : "frame"}
                    </span>
                  </div>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

      <AnimatePresence>{open && <Viewer collab={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

/* Full-screen film strip for one shoot. Scroll or swipe sideways;
   arrow keys and Escape work too. */
function Viewer({ collab, onClose }: { collab: Collab; onClose: () => void }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      className="fixed inset-0 z-70 flex flex-col bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-5 md:px-10">
        <p id="viewer-title" className="truncate text-lg font-medium">
          {collab.name}
          <span className="ml-3 text-sm tabular-nums text-ink-dim">
            {collab.count} {collab.count > 1 ? "frames" : "frame"}
          </span>
        </p>
        <div className="flex items-center gap-1">
          {collab.count > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Previous frames" className="hidden h-10 w-10 items-center justify-center hover:bg-surface md:flex">
                <ArrowLeftIcon size={20} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next frames" className="hidden h-10 w-10 items-center justify-center hover:bg-surface md:flex">
                <ArrowRightIcon size={20} />
              </button>
            </>
          )}
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center hover:bg-surface">
            <XIcon size={22} />
          </button>
        </div>
      </div>

      <div
        ref={stripRef}
        className={`no-scrollbar flex flex-1 snap-x snap-mandatory items-center gap-4 overflow-x-auto px-5 py-6 md:gap-6 md:px-10 ${
          collab.count === 1 ? "justify-center" : ""
        }`}
      >
        {Array.from({ length: collab.count }, (_, n) => (
          <motion.figure
            key={n}
            className="relative h-full max-h-[78dvh] shrink-0 snap-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05 + n * 0.05, ease }}
          >
            <Image
              loader={cldLoader}
              src={frameAt(collab, n)}
              alt={`${collab.name}, frame ${n + 1} of ${collab.count}`}
              width={900}
              height={1200}
              placeholder="blur"
              blurDataURL={cldBlurURL(frameAt(collab, n))}
              sizes="(max-width: 768px) 85vw, 45vw"
              className="h-full w-auto max-w-[85vw] bg-surface object-contain"
            />
          </motion.figure>
        ))}
      </div>
    </motion.div>
  );
}
