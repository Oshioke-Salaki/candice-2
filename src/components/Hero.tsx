"use client";

import { getImageProps } from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cldLoaderWith } from "@/lib/media";
import { BOOK_LABEL } from "@/lib/content";
import { Magnetic, RollText } from "@/components/fx";

/* Two crops of the same photo, chosen by screen shape (art direction):
   • Cover (phones, upright tablets): trim the black void around her so
     she fills an edge-to-edge frame, head to podium.
   • Side (laptops, landscape): the 4:5 portrait beside the headline.
   The browser downloads only the one it shows. */
const HERO_SRC = "candice/hero/hero";
// Pixel crop on the 1206×2622 original: head to heels, with headroom
// for the nav. Re-measure if the hero photo is ever replaced.
const COVER_CROP = "c_crop,x_156,y_430,w_875,h_1250";
const SIDE_CROP = "c_crop,w_0.9,h_0.62,g_auto/c_fill,ar_4:5,g_auto";
const WIDE_MEDIA = "(min-width: 640px) and (orientation: landscape)";

function useHeroImage() {
  const common = { src: HERO_SRC, alt: "Candice, cover portrait", fill: true } as const;
  const side = getImageProps({ ...common, loader: cldLoaderWith(SIDE_CROP), sizes: "40vw" }).props;
  const cover = getImageProps({
    ...common,
    loader: cldLoaderWith(COVER_CROP),
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  }).props;
  return { side, cover };
}

const ease = [0.16, 1, 0.3, 1] as const;

/* Each headline line rises out of its own mask, in sequence. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  /* Scrolling away, the portrait sinks slower than the page and the
     name lifts and fades: the cover recedes rather than just leaving. */
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const k = useReducedMotion() ? 0 : 1;
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", `${18 * k}%`]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120 * k]);
  const textFade = useTransform(scrollYProgress, [0, 0.7], [1, k ? 0 : 1]);
  const { side, cover } = useHeroImage();

  return (
    <section
      ref={ref}
      id="home"
      className="relative mx-auto grid min-h-svh max-w-350 grid-cols-1 grid-rows-[1fr_auto] px-5 pb-8 md:px-10 md:pb-10 wide:min-h-dvh wide:grid-cols-12 wide:grid-rows-1 wide:gap-10 wide:pt-24 wide:pb-12"
    >
      {/* Portrait. Phones and upright tablets: edge to edge and right up
          under the nav, taking every pixel the text doesn't, at full
          brightness; only the podium melts into the page, and the name
          overlaps that edge like a magazine cover. Laptops and landscape:
          the 4:5 portrait beside the headline. */}
      <div className="relative -mx-5 min-h-[48svh] overflow-hidden bg-black md:-mx-10 wide:order-last wide:col-span-5 wide:col-start-8 wide:mx-0 wide:aspect-4/5 wide:max-h-[calc(100dvh-9rem)] wide:min-h-0 wide:self-end wide:bg-surface">
        <motion.div
          className="absolute inset-0"
          style={{ y: imgY }}
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <picture>
            <source media={WIDE_MEDIA} srcSet={side.srcSet} sizes={side.sizes} />
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img {...cover} className="object-cover object-[50%_15%] md:object-contain wide:object-cover wide:object-top" />
          </picture>
        </motion.div>
        {/* Cover mode only: the podium melts into the page under the
            name, and a light shade at the top keeps the nav legible. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[28%] bg-linear-to-t from-bg to-transparent wide:hidden" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/50 to-transparent wide:hidden" />
        {/* Curtain lifts to reveal the portrait */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 origin-top bg-bg"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
        />
      </div>

      <motion.div className="relative -mt-16 flex flex-col justify-end md:-mt-20 wide:col-span-7 wide:mt-0" style={{ y: textY, opacity: textFade }}>
        <h1 className="text-[clamp(3.75rem,17vw,8.5rem)] wide:text-[min(8.5vw,16dvh,9.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">
          <Line delay={0.25}>
            <span className="font-normal italic text-accent">Wow</span>
          </Line>
          <Line delay={0.38}>Candice</Line>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease }}
        >
          <p className="mt-4 max-w-[38ch] text-lg leading-relaxed text-ink-soft md:mt-6 md:text-xl wide:mt-8">
            Nigerian-Sudanese fashion and commercial model and content creator,
            working between London and Lagos.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-6 wide:mt-8">
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex h-12 items-center bg-accent px-7 text-base font-medium whitespace-nowrap text-on-accent transition-transform active:scale-[0.98]"
              >
                <RollText>{BOOK_LABEL}</RollText>
              </a>
            </Magnetic>
            <a
              href="#work"
              className="group inline-flex h-12 items-center border border-ink/25 px-7 text-base font-medium whitespace-nowrap transition-colors hover:border-ink active:scale-[0.98]"
            >
              <RollText>View work</RollText>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
