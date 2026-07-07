"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

/* Slash-prefixed hashes so section links also work from /book and /content */
const links = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/content", label: "Content" },
  { href: "/#brands", label: "Brands" },
  { href: "/#contact", label: "Contact" },
];

/* ─── Hamburger icon ─────────────────────────────── */
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      className="md:hidden flex flex-col justify-center gap-[6px] w-9 h-9 relative"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <span
        className="block h-px origin-center transition-all duration-500"
        style={{
          background: "var(--text)",
          transform: open ? "translateY(4.5px) rotate(45deg)" : "none",
          width: open ? "20px" : "20px",
        }}
      />
      <span
        className="block h-px transition-all duration-300"
        style={{
          background: "var(--text)",
          width: open ? "0px" : "14px",
          opacity: open ? 0 : 1,
        }}
      />
      <span
        className="block h-px origin-center transition-all duration-500"
        style={{
          background: "var(--text)",
          transform: open ? "translateY(-4.5px) rotate(-45deg)" : "none",
          width: open ? "20px" : "20px",
        }}
      />
    </button>
  );
}

/* ─── Theme toggle button ────────────────────────── */
function ThemeToggle({
  theme,
  toggle,
  inverted = false,
}: {
  theme: string;
  toggle: () => void;
  inverted?: boolean;
}) {
  const fg = inverted ? "var(--bg)" : "var(--text)";
  const border = inverted ? "var(--bg)" : "var(--text)";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center gap-2 transition-all duration-300"
      style={{
        padding: "0.45rem 1rem",
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: fg,
        background: "transparent",
        border: `1px solid ${border}`,
        borderRadius: 0,
        cursor: "pointer",
        opacity: 0.85,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = fg;
        el.style.color = inverted ? "var(--text)" : "var(--bg)";
        el.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "transparent";
        el.style.color = fg;
        el.style.opacity = "0.85";
      }}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <circle
          cx="5.5"
          cy="5.5"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path d="M5.5 1 A4.5 4.5 0 0 1 5.5 10 Z" fill="currentColor" />
      </svg>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

/* ─── Navbar ─────────────────────────────────────── */
export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false); // for enter animation

  /* Scroll detection */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Mount/unmount menu with animation */
  function openMenu() {
    setMenuMounted(true);
    // small delay so the element mounts before CSS transition fires
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)));
  }
  function closeMenu() {
    setMenuOpen(false);
    setTimeout(() => setMenuMounted(false), 650);
  }

  /* Nav frosted-glass background (always present, deepens on scroll) */
  const isDark = theme === "dark";
  const navBg = isDark
    ? scrolled
      ? "rgba(10,8,7,0.85)"
      : "rgba(10,8,7,0.3)"
    : scrolled
      ? "rgba(236,229,216,0.88)"
      : "rgba(236,229,216,0.3)";

  const ease = "cubic-bezier(0.16,1,0.3,1)";

  return (
    <>
      {/* ══════════════ TOP NAV BAR ══════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-1000 flex items-center justify-between gap-4 px-6 md:px-10 transition-all duration-500"
        style={{
          paddingTop: scrolled ? "0.75rem" : "1.3rem",
          paddingBottom: scrolled ? "0.75rem" : "1.3rem",
          background: navBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <Link
          href="/#home"
          className="font-display text-xl md:text-2xl tracking-[0.25em] no-underline shrink-0"
          style={{ color: "var(--text)" }}
        >
          WC<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex list-none gap-6 lg:gap-9 flex-1 justify-center">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="no-underline text-[0.65rem] tracking-[0.2em] uppercase font-normal transition-opacity duration-300 opacity-50 hover:opacity-100 whitespace-nowrap"
                style={{ color: "var(--text)" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle — desktop */}
          <div className="hidden md:block">
            <ThemeToggle theme={theme} toggle={toggle} />
          </div>

          {/* Hamburger — mobile */}
          <Hamburger
            open={menuOpen}
            onClick={menuOpen ? closeMenu : openMenu}
          />
        </div>
      </nav>

      {/* ══════════════ MOBILE FULL-SCREEN MENU ══════════════ */}
      {menuMounted && (
        <div
          className="fixed inset-0 z-9980 flex flex-col"
          style={{
            background: "var(--bg)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: `transform 0.6s ${ease}`,
          }}
          aria-modal="true"
          role="dialog"
        >
          {/* Menu header */}
          <div
            className="flex items-center justify-between px-6 shrink-0"
            style={{
              paddingTop: "1.3rem",
              paddingBottom: "1.3rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <Link
              href="/#home"
              className="font-display text-xl tracking-[0.25em] no-underline"
              style={{ color: "var(--text)" }}
              onClick={closeMenu}
            >
              WC<span style={{ color: "var(--accent)" }}>.</span>
            </Link>
            <Hamburger open={true} onClick={closeMenu} />
          </div>

          {/* Menu links */}
          <ul
            className="list-none flex-1 flex flex-col justify-center px-8 gap-1"
            style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
          >
            {links.map((l, i) => (
              <li
                key={l.href}
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ${ease} ${0.15 + i * 0.06}s, transform 0.5s ${ease} ${0.15 + i * 0.06}s`,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <Link
                  href={l.href}
                  onClick={closeMenu}
                  className="no-underline flex items-center justify-between py-2 group"
                  style={{ color: "var(--text)" }}
                >
                  <span
                    className="font-display tracking-[0.08em]"
                    style={{ fontSize: "clamp(1.2rem, 8vw, 4rem)" }}
                  >
                    {l.label}
                  </span>
                  <span
                    className="opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    style={{ fontSize: "1.2rem", color: "var(--text)" }}
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Menu footer */}
          <div
            className="px-8 pb-10 flex items-center justify-between shrink-0"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.5s ease 0.55s`,
            }}
          >
            <ThemeToggle theme={theme} toggle={toggle} />
            <span
              className="uppercase tracking-[0.2em]"
              style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}
            >
              London · Lagos
            </span>
          </div>
        </div>
      )}
    </>
  );
}
