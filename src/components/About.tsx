"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRightIcon, PlayIcon } from "@phosphor-icons/react";
import { cldBlurURL, cldLoader, cldLoaderWith } from "@/lib/media";

/* All six frames scattered like prints on a table, overlapping at
   different depths. Each drifts at its own speed as the section
   scrolls past; hovering a print lifts it to the top of the pile.
   Positions are percentages of a fixed-ratio board, so the
   composition holds at every width. */
type PrintSpec = {
  src: string;
  alt: string;
  crop?: string;
  ratio: string;
  /** left / top / width as % of the board */
  pos: [number, number, number];
  z: number;
  /** parallax travel in px across the section's scroll */
  drift: number;
  sizes: string;
};

const PRINTS: PrintSpec[] = [
  // The original file carries a white-and-black print border; crop it off.
  { src: "candice/about/00", alt: "Candice in a sand-coloured gown", crop: "c_crop,x_56,y_30,w_1408,h_2088/c_limit",
    ratio: "3/4", pos: [0, 5, 56], z: 2, drift: 30, sizes: "(max-width: 768px) 56vw, 28vw" },
  // Pulled straight from the LDM CLO SS26 campaign, no duplicate upload.
  { src: "candice/campaigns/ldm-clo-ss26/ldm-clo-ss26-12", alt: "Candice for LDM CLO SS26",
    ratio: "3/4", pos: [61, 0, 31], z: 1, drift: 120, sizes: "(max-width: 768px) 31vw, 16vw" },
  { src: "candice/about/04", alt: "Candice, beauty close-up",
    ratio: "4/5", pos: [45, 33, 42], z: 3, drift: 80, sizes: "(max-width: 768px) 42vw, 21vw" },
  { src: "candice/about/01", alt: "Candice on the beach in a knit top",
    ratio: "3/4", pos: [4, 61, 35], z: 3, drift: 55, sizes: "(max-width: 768px) 35vw, 18vw" },
  { src: "candice/about/03", alt: "Candice at the easel",
    ratio: "3/4", pos: [38, 75, 25], z: 4, drift: 140, sizes: "(max-width: 768px) 25vw, 13vw" },
  { src: "candice/about/02", alt: "Candice in a red jersey",
    ratio: "3/4", pos: [66, 71, 30], z: 2, drift: 95, sizes: "(max-width: 768px) 30vw, 15vw" },
];

const REEL_URL = "https://www.instagram.com/reel/DZliPFzAJP_/";

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

function Print({
  img,
  sizes,
  className,
  ratio,
}: {
  img: { src: string; alt: string; crop?: string };
  sizes: string;
  className?: string;
  ratio: string;
}) {
  return (
    <div className={`group relative overflow-hidden bg-surface ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      <Image
        loader={img.crop ? cldLoaderWith(img.crop) : cldLoader}
        src={img.src}
        alt={img.alt}
        fill
        placeholder="blur"
        blurDataURL={cldBlurURL(img.src, img.crop)}
        sizes={sizes}
        className="object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
    </div>
  );
}

function Piece({ spec, progress, k }: { spec: PrintSpec; progress: MotionValue<number>; k: number }) {
  const y = useTransform(progress, [0, 1], [spec.drift * k, -spec.drift * k]);
  const [left, top, width] = spec.pos;
  return (
    <motion.div
      style={{ y, left: `${left}%`, top: `${top}%`, width: `${width}%`, zIndex: spec.z }}
      className="absolute outline-6 outline-bg transition-[z-index] hover:z-10!"
    >
      <Print img={spec} ratio={spec.ratio} sizes={spec.sizes} />
    </motion.div>
  );
}

export default function About() {
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: collageRef, offset: ["start end", "end start"] });
  // Parallax is off for visitors who prefer reduced motion.
  const k = useReducedMotion() ? 0 : 1;

  return (
    <section
      id="about"
      className="mx-auto grid max-w-350 scroll-mt-16 grid-cols-1 gap-20 px-5 py-24 md:grid-cols-12 md:items-center md:gap-10 md:px-10 md:py-40"
    >
      <motion.div
        ref={collageRef}
        className="relative aspect-[10/14] md:col-span-6"
        {...reveal}
        transition={{ duration: 1, ease }}
      >
        {PRINTS.map((p) => (
          <Piece key={p.src} spec={p} progress={scrollYProgress} k={k} />
        ))}
      </motion.div>

      <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
        <motion.h2
          className="text-5xl leading-[0.95] font-bold tracking-[-0.04em] md:text-7xl"
          {...reveal}
          transition={{ duration: 0.9, ease }}
        >
          A muse.
          <br />
          <span className="font-normal italic text-ink-dim">And an artist.</span>
        </motion.h2>

        <motion.div
          className="mt-10 max-w-[58ch] space-y-5 text-lg leading-relaxed text-ink-soft"
          {...reveal}
          transition={{ duration: 0.9, delay: 0.1, ease }}
        >
          <p>
            I&apos;m <strong className="font-medium text-ink">Candice</strong>, a Nigerian-Sudanese
            model and content creator working between London and Lagos. Eight years in front of the
            lens turned a kid who loved to pose into a disciplined creative, fluent in fashion,
            beauty, photography and movement.
          </p>
          <p>
            My work sits where modeling meets storytelling: cultural depth with a modern edge,
            across editorials, campaigns and the content my audience replays.{" "}
            <strong className="font-medium text-ink">Don&apos;t get it twisted.</strong>
          </p>
        </motion.div>

        <motion.figure
          className="mt-10 border-l-2 border-accent pl-6"
          {...reveal}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          <blockquote className="text-2xl leading-snug font-normal italic md:text-[1.75rem]">
            &ldquo;I don&apos;t just create visuals. I create moments that are felt, remembered and
            impossible to ignore.&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm text-ink-dim">Candice, model and creator</figcaption>
        </motion.figure>

        <motion.a
          href={REEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex w-fit items-center gap-3 text-base font-medium"
          {...reveal}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          <span className="flex h-11 w-11 items-center justify-center border border-ink/25 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <PlayIcon size={16} weight="fill" />
          </span>
          <span className="border-b border-transparent transition-colors group-hover:border-ink">
            Watch the intro reel
          </span>
          <ArrowUpRightIcon size={16} className="text-ink-dim" />
          <span className="sr-only">(opens Instagram in a new tab)</span>
        </motion.a>
      </div>
    </section>
  );
}
