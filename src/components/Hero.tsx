"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cldBlurURL, cldLoaderWith } from "@/lib/media";
import { BOOK_LABEL } from "@/lib/content";
import { Magnetic, RollText } from "@/components/fx";

/* Cloudinary smart crop: trim the dark void around the subject, then
   fill a 4:5 portrait so she fills the frame. */
const HERO_CROP = "c_crop,w_0.9,h_0.62,g_auto/c_fill,ar_4:5,g_auto";
const heroLoader = cldLoaderWith(HERO_CROP);

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

  return (
    <section
      ref={ref}
      id="home"
      className="mx-auto grid min-h-dvh max-w-350 grid-cols-1 gap-8 px-5 pt-20 pb-10 md:grid-cols-12 md:gap-10 md:px-10 md:pt-24 md:pb-12"
    >
      {/* Portrait: first on mobile, right-hand column on desktop */}
      <div className="relative order-first h-[46dvh] overflow-hidden bg-surface md:order-last md:col-span-5 md:col-start-8 md:h-auto md:max-h-[calc(100dvh-9rem)] md:self-end md:aspect-4/5">
        <motion.div
          className="absolute inset-0"
          style={{ y: imgY }}
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <Image
            loader={heroLoader}
            src="candice/hero/hero"
            alt="Candice, cover portrait"
            fill
            priority
            placeholder="blur"
            blurDataURL={cldBlurURL("candice/hero/hero", HERO_CROP)}
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-top"
          />
        </motion.div>
        {/* Curtain lifts to reveal the portrait */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 origin-top bg-bg"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
        />
      </div>

      <motion.div className="flex flex-col justify-end md:col-span-7" style={{ y: textY, opacity: textFade }}>
        <h1 className="text-[clamp(4rem,16vw,9.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">
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
          <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-ink-soft md:mt-8 md:text-xl">
            Nigerian-Sudanese fashion and commercial model and content creator,
            working between London and Lagos.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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
