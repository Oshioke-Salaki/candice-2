"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRightIcon, PlayIcon } from "@phosphor-icons/react";
import { cldBlurURL, cldLoader } from "@/lib/media";

const IMAGES = [
  { src: "candice/about/00", alt: "Candice, portrait" },
  { src: "candice/about/01", alt: "Candice, portrait" },
  { src: "candice/about/02", alt: "Candice, editorial" },
  { src: "candice/about/03", alt: "Candice, campaign" },
  { src: "candice/about/04", alt: "Candice, beauty" },
  // Pulled straight from the LDM CLO SS26 campaign, no duplicate upload.
  { src: "candice/campaigns/ldm-clo-ss26/ldm-clo-ss26-12", alt: "Candice, LDM CLO SS26" },
];

const INTERVAL = 4200; // ms between auto-advances

const REEL_URL = "https://www.instagram.com/reel/DZliPFzAJP_/";

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export default function About() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setCurrent((c) => (c + 1) % IMAGES.length), INTERVAL);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <section
      id="about"
      className="mx-auto grid max-w-350 scroll-mt-16 grid-cols-1 gap-14 px-5 py-24 md:grid-cols-12 md:gap-10 md:px-10 md:py-40"
    >
      <motion.div
        className="relative md:col-span-5"
        {...reveal}
        transition={{ duration: 0.9, ease }}
      >
        <div className="relative aspect-3/4 overflow-hidden bg-surface">
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease }}
            >
              <Image
                loader={cldLoader}
                src={IMAGES[current].src}
                alt={IMAGES[current].alt}
                fill
                placeholder="blur"
                blurDataURL={cldBlurURL(IMAGES[current].src)}
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Frame picker doubles as the progress indicator */}
        <div className="mt-4 flex gap-1.5" role="group" aria-label="Choose photo">
          {IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === current}
              className="h-6 flex-1"
            >
              <span className={`block h-0.5 transition-colors ${i === current ? "bg-accent" : "bg-line"}`} />
            </button>
          ))}
        </div>
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
