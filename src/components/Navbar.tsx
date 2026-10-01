"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { BOOK_LABEL, NAV_LINKS } from "@/lib/content";
import { RollText } from "@/components/fx";
import Overlay from "@/components/Overlay";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Only flips booleans when a threshold is crossed, so React re-renders
     a handful of times per scroll session, not every frame. The bar
     tucks away while reading down and returns on the way up. */
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 600 && y > prev);
  });

  // A menu link closes the menu first; the page scrolls to its section
  // once the menu has gone and the scroll lock is released.
  const pending = useRef<string | null>(null);
  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    pending.current = href;
    setMenuOpen(false);
  };
  const afterClose = () => {
    const href = pending.current;
    pending.current = null;
    if (!href) return;
    // Wait a frame so the scroll lock has released and restored the
    // old position first; then glide to the chosen section.
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", href);
    });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease }}
      >
        <nav className="mx-auto flex h-16 max-w-350 items-center justify-between px-5 md:px-10">
          <a href="#home" className="text-lg font-bold tracking-tight" aria-label="WowCandice, back to top">
            WowCandice<span className="text-accent">.</span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group hidden h-10 items-center bg-ink px-5 text-sm font-medium whitespace-nowrap text-bg transition-colors hover:bg-accent hover:text-on-accent active:scale-[0.98] sm:inline-flex"
            >
              <RollText>{BOOK_LABEL}</RollText>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center md:hidden"
            >
              <ListIcon size={24} weight="regular" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence onExitComplete={afterClose}>
        {menuOpen && (
          <Overlay key="menu">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-60 flex h-dvh flex-col overscroll-contain bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="text-lg font-bold tracking-tight">
                WowCandice<span className="text-accent">.</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="flex h-10 w-10 items-center justify-center"
              >
                <XIcon size={24} />
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-2 px-5">
              {[...NAV_LINKS, { href: "#contact", label: BOOK_LABEL }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.05, ease }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className={`block py-1 text-5xl font-bold tracking-tight ${
                      l.href === "#contact" ? "text-accent" : ""
                    }`}
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}
