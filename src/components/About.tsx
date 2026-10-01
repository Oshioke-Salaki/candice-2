"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRightIcon, PlayIcon } from "@phosphor-icons/react";
import { cldBlurURL, cldLoader, cldLoaderWith } from "@/lib/media";

/* Three frames layered like prints on a table. Each drifts at its own
   speed as the section scrolls past, which gives the collage depth. */
// The original file carries a white-and-black print border; crop it off.
const MAIN = {
  src: "candice/about/00",
  alt: "Candice in a sand-coloured gown",
  crop: "c_crop,x_56,y_30,w_1408,h_2088/c_limit",
};
const INSET = { src: "candice/about/04", alt: "Candice, beauty close-up" };
// Pulled straight from the LDM CLO SS26 campaign, no duplicate upload.
const SMALL = { src: "candice/campaigns/ldm-clo-ss26/ldm-clo-ss26-12", alt: "Candice for LDM CLO SS26" };

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

export default function About() {
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: collageRef, offset: ["start end", "end start"] });
  // Parallax is off for visitors who prefer reduced motion.
  const k = useReducedMotion() ? 0 : 1;
  const yMain = useTransform(scrollYProgress, [0, 1], [30 * k, -30 * k]);
  const yInset = useTransform(scrollYProgress, [0, 1], [90 * k, -90 * k]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [140 * k, -60 * k]);

  return (
    <section
      id="about"
      className="mx-auto grid max-w-350 scroll-mt-16 grid-cols-1 gap-20 px-5 py-24 md:grid-cols-12 md:gap-10 md:px-10 md:py-40"
    >
      <motion.div
        ref={collageRef}
        className="relative pb-[18%] md:col-span-6 md:pr-[6%]"
        {...reveal}
        transition={{ duration: 1, ease }}
      >
        <motion.div style={{ y: yMain }} className="w-[74%]">
          <Print img={MAIN} ratio="3/4" sizes="(max-width: 768px) 74vw, 36vw" />
        </motion.div>

        <motion.div style={{ y: ySmall }} className="absolute top-[4%] right-0 w-[30%] md:right-[6%]">
          <Print img={SMALL} ratio="3/4" sizes="(max-width: 768px) 30vw, 15vw" />
        </motion.div>

        <motion.div
          style={{ y: yInset }}
          className="absolute right-[4%] bottom-0 w-[46%] outline-8 outline-bg md:right-[10%]"
        >
          <Print img={INSET} ratio="4/5" sizes="(max-width: 768px) 46vw, 22vw" />
        </motion.div>
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
