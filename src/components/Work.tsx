"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  campaignFrame,
  cldBlurURL,
  cldLoader,
  cldLoaderWith,
  cldPoster,
  cldPosterTiny,
  cldVideo,
} from "@/lib/media";

/* ─── Data ───────────────────────────────────────────────────
   A shoot is an ordered list of media: photos and short films mix
   freely, so a hair campaign can show its stills and its clips in
   the order they were shot. */
type Media =
  | { kind: "image"; id: string }
  | { kind: "video"; id: string; posterAt: number };

type Credit = { role: string; handle: string };

type Collab = {
  id: string;
  name: string;
  category: "modeling" | "brand";
  media: Media[];
  /** Team credits, shown in the viewer like a magazine credit line. */
  credits?: Credit[];
};

const C = "candice/campaigns";

/** Frames by number (1-based), in the order given. */
const photos = (id: string, nums: number[]): Media[] =>
  nums.map((n) => ({ kind: "image", id: campaignFrame(id, n) }));
/** Frames 1…count in order. */
const run = (count: number) => Array.from({ length: count }, (_, i) => i + 1);
const film = (shoot: string, slug: string, posterAt = 1): Media => ({
  kind: "video",
  id: `${C}/${shoot}/${shoot}-${slug}`,
  posterAt,
});

const shoot = (
  id: string,
  name: string,
  media: Media[],
  category: Collab["category"] = "modeling",
  credits?: Credit[],
): Collab => ({ id, name, category, media, credits });

/* Modeling: the 2026 campaigns lead, then the existing sequence. */
const MODELING: Collab[] = [
  shoot("kai-collective-2026", "Kai Collective 2026", photos("kai-collective-2026", run(4))),
  shoot("mowalola", "Mowalola", photos("mowalola", [1])),
  shoot("udiahgebi-2026", "Udiahgebi 2026", photos("udiahgebi-2026", run(4))),
  shoot("luxeal-hair-2026", "Luxeal Hair 2026", [
    ...photos("luxeal-hair-2026", [1]),
    film("luxeal-hair-2026", "candy-floss", 4),
    ...photos("luxeal-hair-2026", [2, 3]),
    film("luxeal-hair-2026", "ginger-me"),
  ], "modeling", [
    // Credits as tagged on the original posts.
    { role: "Hair", handle: "remilaide" },
    { role: "Makeup", handle: "breelliant__" },
    { role: "Wig", handle: "luxealhair" },
    { role: "Colour", handle: "thehairpaletteuk" },
  ]),
  shoot("makeup-by-chelsea", "Makeup by Chelsea", [
    ...photos("makeup-by-chelsea", [1, 2]),
    film("makeup-by-chelsea", "film"),
  ]),
  // The close-up leads; the captioned video still closes the set.
  shoot("meji-meji", "Meji Meji", photos("meji-meji", [5, 2, 3, 4, 6, 7, 1])),
  // Client-specified sequence: 10 opens, then 12, then 04. Frames 01,
  // 02 and 05 stay out of the set.
  shoot("ldm-clo-ss26", "LDM CLO SS26", photos("ldm-clo-ss26", [10, 12, 4, 6, 11, 3, 7, 8, 9])),
  shoot("streetsouk", "Streetsouk", photos("streetsouk", run(4))),
  // The red-jersey frame leads.
  shoot("bolapsd", "BolaPSD", photos("bolapsd", [2, 1])),
  shoot("by-naomi-smith", "By Naomi Smith", photos("by-naomi-smith", [1])),
  // Client sequence: the four finished slides (05–08) in order, then
  // the behind-the-scenes frames from the same day.
  shoot("ajanee-studio", "Ajanee Studio", photos("ajanee-studio", [5, 6, 7, 8, 1, 2, 3])),
  shoot("vvs-lagos", "VVS Lagos", photos("vvs-lagos", run(2))),
  shoot("the-shine-cartel", "The Shine Cartel", photos("the-shine-cartel", run(2))),
  // Finished frames (03–05) lead; the original two follow.
  shoot("patrique-ophique", "Patrique Ophique", photos("patrique-ophique", [3, 4, 5, 1, 2])),
  shoot("dolore-inc-ss26", "Dolore Inc SS26", photos("dolore-inc-ss26", run(2))),
  shoot("brown-thomas-ss25", "Brown Thomas SS25", photos("brown-thomas-ss25", run(2))),
  shoot("snowbunny", "Snowbunny", photos("snowbunny", [1])),
];

/* Brand partnerships: most recognisable houses first. */
const BRANDS: Collab[] = [
  ["lacoste", "Lacoste", 1],
  ["vans", "Vans", 1],
  ["timberland", "Timberland", 1],
  ["asos", "ASOS", 1],
  ["people-ssense", "SSENSE × People", 1],
  ["fashion-nova", "Fashion Nova", 1],
  ["bershka", "Bershka", 2],
  ["meshki", "Meshki", 1],
  ["motel-rocks", "Motel Rocks", 1],
  ["wmns-wear", "WMNS Wear", 2],
].map(([id, name, n]) => shoot(id as string, name as string, photos(id as string, run(n as number)), "brand"));

const TABS = [
  { key: "modeling", label: "Modeling", items: MODELING },
  { key: "brand", label: "Brand partnerships", items: BRANDS },
] as const;

/* ─── Helpers ─────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

function countLabel(media: Media[]) {
  const p = media.filter((m) => m.kind === "image").length;
  const f = media.length - p;
  const parts = [];
  if (p) parts.push(`${p} ${p === 1 ? "photo" : "photos"}`);
  if (f) parts.push(`${f} ${f === 1 ? "film" : "films"}`);
  return parts.join(" · ");
}

/** A tiny blurred stand-in for any media item. */
const blurOf = (m: Media) =>
  m.kind === "image" ? cldBlurURL(m.id) : cldPosterTiny(m.id, m.posterAt);

/* Varied crops give the masonry its rhythm. */
const RATIOS = ["3:4", "4:5", "2:3", "4:5", "3:4", "2:3"];
const loaders = Object.fromEntries(RATIOS.map((r) => [r, cldLoaderWith(`c_fill,ar_${r},g_auto`)]));
const thumbLoader = cldLoaderWith("c_fill,ar_3:4,g_auto");

/* Column count per breakpoint: 2 below md, 3 below lg, 4 above.
   The server renders 4; the grid sits below the fold, so the swap
   to the real count happens before anyone scrolls to it. */
const MQ_MD = "(min-width: 768px)";
const MQ_LG = "(min-width: 1024px)";
function subscribe(cb: () => void) {
  const lists = [MQ_MD, MQ_LG].map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", cb));
  return () => lists.forEach((l) => l.removeEventListener("change", cb));
}
function useColumns() {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(MQ_LG).matches ? 4 : window.matchMedia(MQ_MD).matches ? 3 : 2),
    () => 4,
  );
}

/* ─── Section ─────────────────────────────────────────────── */
export default function Work() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("modeling");
  const [open, setOpen] = useState<Collab | null>(null);
  const items = TABS.find((t) => t.key === tab)!.items;
  const close = useCallback(() => setOpen(null), []);
  const cols = useColumns();

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
        <motion.div
          key={tab}
          role="tabpanel"
          className="mt-10 grid gap-4 md:gap-6"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Masonry, filled row-first: item i goes to column i % cols, so
              the newest shoots sit across the top row. */}
          {Array.from({ length: cols }, (_, col) => (
            <ul key={col} className="flex flex-col gap-4 md:gap-6">
              {items.map((c, i) =>
                i % cols === col ? <Card key={c.id} c={c} i={i} onOpen={() => setOpen(c)} /> : null,
              )}
            </ul>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>{open && <Lightbox collab={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}

/* ─── Grid card ───────────────────────────────────────────────
   On hover the cover gives way to the shoot's next photo: a peek
   that tells you there is more inside. */
function Card({ c, i, onOpen }: { c: Collab; i: number; onOpen: () => void }) {
  const ratio = RATIOS[i % RATIOS.length];
  const [w, h] = ratio.split(":").map(Number);
  const crop = `c_fill,ar_${ratio},g_auto`;
  const cover = c.media.find((m) => m.kind === "image")!;
  const peek = c.media.find((m) => m.kind === "image" && m.id !== cover.id);
  const hasFilm = c.media.some((m) => m.kind === "video");

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full text-left"
        aria-label={`Open ${c.name}, ${countLabel(c.media)}`}
      >
        <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: `${w}/${h}` }}>
          <Image
            loader={loaders[ratio]}
            src={cover.id}
            alt=""
            fill
            placeholder="blur"
            blurDataURL={cldBlurURL(cover.id, crop)}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          {peek && (
            <Image
              loader={loaders[ratio]}
              src={peek.id}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          {hasFilm && (
            <span className="absolute top-3 left-3 flex h-7 items-center gap-1.5 bg-black/55 px-2.5 text-xs font-medium text-white backdrop-blur-md">
              <PlayIcon size={11} weight="fill" />
              Film
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-0.5 lg:flex-row lg:items-baseline lg:justify-between lg:gap-3">
          <span className="text-base font-medium md:text-lg">{c.name}</span>
          <span className="shrink-0 text-sm tabular-nums text-ink-dim">{countLabel(c.media)}</span>
        </div>
      </button>
    </motion.li>
  );
}

/* ─── Lightbox ────────────────────────────────────────────────
   One frame at a time on a dark stage lit by the frame itself: a
   blurred copy of the current photo glows behind it. Swipe or drag,
   tap either side, use the arrow keys or the contact strip. */
const slide = {
  enter: (dir: number) => ({ x: dir * 90, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * -90, opacity: 0, scale: 0.97 }),
};

function Lightbox({ collab, onClose }: { collab: Collab; onClose: () => void }) {
  const { media, name, category, credits } = collab;
  const total = media.length;
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [muted, setMuted] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const current = media[index];

  const go = useCallback(
    (step: number) =>
      setState(([i]) => {
        const next = i + step;
        if (next < 0 || next >= total) return [i, 0];
        return [next, step];
      }),
    [total],
  );
  const jump = (n: number) => setState(([i]) => [n, n > i ? 1 : -1]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [go, onClose]);

  // Keep the active thumbnail centred. Scrolls the strip only;
  // scrollIntoView would also nudge the dialog sideways.
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !el) return;
    strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
  };

  const onTap = (e: MouseEvent | TouchEvent | PointerEvent) => {
    if (total < 2 || current.kind === "video") return;
    const x = "clientX" in e ? e.clientX : e.changedTouches[0].clientX;
    go(x < window.innerWidth / 2 ? -1 : 1);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-70 flex flex-col overflow-hidden bg-[#0b0b0c] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Ambient glow from the current frame */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current.id}
          aria-hidden
          className="absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
          style={{ backgroundImage: `url(${blurOf(current)})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,11,12,0.75)_75%)]" />

      {/* Top bar */}
      <div className="relative flex h-16 shrink-0 items-center justify-between gap-4 px-5 md:h-20 md:px-10">
        <div className="min-w-0">
          <p id="lightbox-title" className="truncate text-lg font-bold tracking-[-0.02em] md:text-xl">
            {name}
          </p>
          <p className="text-sm text-white/60">{category === "brand" ? "Brand partnership" : "Modeling"}</p>
        </div>
        <div className="flex items-center gap-4">
          {total > 1 && (
            <p className="text-sm tabular-nums text-white/70" aria-live="polite">
              <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </p>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 260, damping: 32 }, opacity: { duration: 0.35 }, scale: { duration: 0.5, ease } }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            onTap={onTap}
            className={`absolute inset-0 px-5 py-2 md:px-24 md:py-4 ${total > 1 && current.kind === "image" ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {current.kind === "image" ? (
              <div className="relative h-full w-full">
                <Image
                  loader={cldLoader}
                  src={current.id}
                  alt={`${name}, ${index + 1} of ${total}`}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={cldBlurURL(current.id)}
                  sizes="100vw"
                  draggable={false}
                  className="pointer-events-none object-contain select-none"
                />
              </div>
            ) : (
              <video
                key={current.id}
                src={cldVideo(current.id)}
                poster={cldPoster(current.id, current.posterAt)}
                autoPlay
                loop
                playsInline
                muted={muted}
                className="mx-auto h-full w-auto max-w-full object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {current.kind === "video" && (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute film" : "Mute film"}
            className="absolute right-5 bottom-4 z-10 flex h-11 items-center gap-2 bg-white/10 px-4 text-sm backdrop-blur-md transition-colors hover:bg-white/20 md:right-10"
          >
            {muted ? <SpeakerSlashIcon size={18} /> : <SpeakerHighIcon size={18} />}
            {muted ? "Sound off" : "Sound on"}
          </button>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Previous"
              className="absolute top-1/2 left-6 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 backdrop-blur-md transition hover:bg-white/20 active:scale-95 disabled:opacity-0 md:flex"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === total - 1}
              aria-label="Next"
              className="absolute top-1/2 right-6 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 backdrop-blur-md transition hover:bg-white/20 active:scale-95 disabled:opacity-0 md:flex"
            >
              <ArrowRightIcon size={20} />
            </button>
          </>
        )}

        {/* Warm the neighbours so the next frame appears instantly */}
        <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
          {[media[index - 1], media[index + 1]].map(
            (m) =>
              m?.kind === "image" && (
                <Image key={m.id} loader={cldLoader} src={m.id} alt="" width={1200} height={1600} sizes="100vw" />
              ),
          )}
        </div>
      </div>

      {credits && (
        <p className="relative shrink-0 px-5 pt-3 text-center text-xs leading-relaxed text-white/55 md:px-10">
          {credits.map((c, n) => (
            <span key={c.handle} className="whitespace-nowrap">
              {n > 0 && <span className="mx-2 text-white/25">/</span>}
              {c.role}{" "}
              <a
                href={`https://www.instagram.com/${c.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                @{c.handle}
              </a>
            </span>
          ))}
        </p>
      )}

      {/* Contact strip */}
      {total > 1 && (
        <div
          ref={stripRef}
          className="no-scrollbar relative flex shrink-0 gap-2 overflow-x-auto px-5 py-4 md:justify-center md:px-10 md:py-5"
        >
          {media.map((m, n) => {
            const active = n === index;
            const thumbSrc = m.kind === "image" ? m.id : null;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => jump(n)}
                aria-label={`Show ${m.kind === "video" ? "film" : "photo"} ${n + 1}`}
                aria-current={active}
                className={`relative h-16 w-12 shrink-0 overflow-hidden transition duration-300 md:h-20 md:w-15 ${
                  active ? "opacity-100 ring-2 ring-white ring-offset-2 ring-offset-[#0b0b0c]" : "opacity-45 hover:opacity-80"
                }`}
              >
                {thumbSrc ? (
                  <Image loader={thumbLoader} src={thumbSrc} alt="" fill sizes="60px" className="object-cover" />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldPoster(m.id, m.kind === "video" ? m.posterAt : 1, 160)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayIcon size={14} weight="fill" />
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
