"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { campaignFrame, cldLoaderWith } from "@/lib/media";

type Tone = "photo" | "accent" | "plain";

const SERVICES: { name: string; desc: string; tone: Tone; image?: string; cls: string }[] = [
  {
    name: "Fashion, beauty and editorial",
    desc: "Editorial spreads, designer lookbooks and beauty stories with cultural depth and a modern edge.",
    tone: "photo",
    image: campaignFrame("ldm-clo-ss26", 10),
    cls: "md:row-span-2 min-h-[28rem]",
  },
  {
    name: "Commercial modeling",
    desc: "Brand campaigns, print advertising and e-commerce shoots, delivered with polish and presence.",
    tone: "plain",
    cls: "",
  },
  {
    name: "Content creation",
    desc: "Photo and video built for social feeds and digital campaigns, shot and edited in-house.",
    tone: "accent",
    cls: "",
  },
  {
    name: "Brand partnerships",
    desc: "Ambassador deals, sponsored content and lifestyle integration on every platform my audience uses.",
    tone: "photo",
    image: campaignFrame("lacoste", 1),
    cls: "min-h-72",
  },
  {
    name: "Runway and motion",
    desc: "Fashion shows, presentations and music-video features, from LIA runways to major sets.",
    tone: "plain",
    cls: "",
  },
];

const photoLoader = cldLoaderWith("c_fill,ar_4:5,g_auto");
const ease = [0.16, 1, 0.3, 1] as const;

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-350 scroll-mt-16 px-5 pb-20 md:px-10 md:pb-24 lg:pb-28">
      <h2 className="max-w-[16ch] text-5xl leading-none font-bold tracking-[-0.04em] md:text-7xl">
        What I do
      </h2>

      <ul className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {SERVICES.map((s, i) => {
          const onDark = s.tone === "photo";
          return (
            <motion.li
              key={s.name}
              className={`group relative flex flex-col justify-end overflow-hidden p-7 md:p-8 ${s.cls} ${
                s.tone === "accent" ? "bg-accent text-on-accent" : s.tone === "plain" ? "bg-surface" : "bg-ink"
              } ${onDark ? "text-white" : ""}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: i * 0.06, ease }}
            >
              {s.image && (
                <>
                  <Image
                    loader={photoLoader}
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                </>
              )}
              <div className="relative">
                <span className={`text-sm tabular-nums ${onDark || s.tone === "accent" ? "opacity-75" : "text-ink-dim"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-2xl leading-tight font-bold tracking-[-0.02em] md:text-3xl">{s.name}</h3>
                <p className={`mt-3 max-w-[40ch] text-base leading-relaxed ${onDark || s.tone === "accent" ? "opacity-90" : "text-ink-soft"}`}>
                  {s.desc}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
