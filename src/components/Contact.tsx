"use client";

import { motion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { BOOK_HREF, BOOK_LABEL, EMAIL, SOCIALS } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-350 scroll-mt-16 px-5 py-24 md:px-10 md:py-40">
      <motion.h2
        className="text-[clamp(3.25rem,10vw,9rem)] leading-[0.92] font-bold tracking-[-0.045em]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        Let&rsquo;s make
        <br />
        <span className="font-normal italic text-accent">a moment.</span>
      </motion.h2>

      <div className="mt-14 grid grid-cols-1 gap-14 md:mt-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p className="max-w-[40ch] text-lg leading-relaxed text-ink-soft">
            Campaigns, editorials, runway and content. Send a short brief with dates and
            usage. Based in London and Lagos, available worldwide.
          </p>
          <a
            href={BOOK_HREF}
            className="mt-8 inline-flex h-14 items-center bg-accent px-8 text-lg font-medium whitespace-nowrap text-on-accent transition-transform hover:-translate-y-px active:scale-[0.98]"
          >
            {BOOK_LABEL}
          </a>
          <p className="mt-4 text-sm text-ink-dim">
            or write to <a href={`mailto:${EMAIL}`} className="text-ink underline-offset-4 hover:underline">{EMAIL}</a>
          </p>
        </div>

        <ul className="md:col-span-6 md:col-start-7">
          {SOCIALS.map((s) => (
            <li key={s.name} className="border-t border-line last:border-b">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-6"
              >
                <span className="text-3xl font-bold tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-4xl">
                  {s.name}
                </span>
                <span className="flex items-center gap-3 text-base text-ink-soft">
                  <span className="hidden sm:inline">{s.handle}</span>
                  <ArrowUpRightIcon size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
