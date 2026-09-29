"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cldBlurURL, cldLoader } from "@/lib/media";

/* The comp card bookers ask for. Height leads as the wide accent tile;
   the other six fill a clean 4×2 grid (2-col on mobile). */
const DIGITALS = [
  { label: "Height", value: "5′11″" },
  { label: "Bust", value: "36″" },
  { label: "Waist", value: "26″" },
  { label: "Hips", value: "40″" },
  { label: "Dress", value: "UK 8–10" },
  { label: "Hair", value: "Black" },
  { label: "Eyes", value: "Dark brown" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Digitals() {
  return (
    <section className="mx-auto grid max-w-350 grid-cols-1 gap-10 px-5 pb-24 md:grid-cols-12 md:px-10 md:pb-40">
      <div className="md:col-span-8">
        <h2 className="text-5xl leading-none font-bold tracking-[-0.04em] md:text-7xl">Digitals</h2>

        <dl className="mt-10 grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {DIGITALS.map((d, i) => {
            const lead = i === 0;
            return (
              <motion.div
                key={d.label}
                className={`flex flex-col justify-between p-5 md:p-6 ${
                  lead ? "col-span-2 min-h-44 bg-accent text-on-accent" : "min-h-32 bg-bg"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.05, ease }}
              >
                <dt className={`text-sm ${lead ? "opacity-80" : "text-ink-dim"}`}>{d.label}</dt>
                <dd
                  className={`font-bold tracking-[-0.03em] ${
                    lead ? "text-7xl md:text-8xl" : "text-3xl md:text-4xl"
                  }`}
                >
                  {d.value}
                </dd>
              </motion.div>
            );
          })}
        </dl>
      </div>

      <motion.div
        className="relative mx-auto aspect-3/4 w-full max-w-sm overflow-hidden bg-surface md:col-span-4 md:max-w-none md:self-end"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease }}
      >
        <Image
          loader={cldLoader}
          src="candice/about/full-body"
          alt="Candice, full-length digital"
          fill
          placeholder="blur"
          blurDataURL={cldBlurURL("candice/about/full-body")}
          sizes="(max-width: 768px) 90vw, 30vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
