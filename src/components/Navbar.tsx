"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#brands", label: "Brands" },
  { href: "/#contact", label: "Contact" },
];

/* ─── Hamburger icon ─────────────────────────────── */
function Hamburger({
  open,
  onClick,
  color = "var(--text)",
}: {
  open: boolean;
  onClick: () => void;
  color?: string;
}) {
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
          background: color,
          transform: open ? "translateY(4.5px) rotate(45deg)" : "none",
          width: open ? "20px" : "20px",
        }}
      />
      <span
        className="block h-px transition-all duration-300"
        style={{
          background: color,
          width: open ? "0px" : "14px",
          opacity: open ? 0 : 1,
        }}
      />
      <span
        className="block h-px origin-center transition-all duration-500"
        style={{
          background: color,
          transform: open ? "translateY(-4.5px) rotate(-45deg)" : "none",
          width: open ? "20px" : "20px",
        }}
      />
    </button>
  );
}


/* ─── Navbar ─────────────────────────────────────── */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false); // for enter animation

  /* The home page opens on the cinematic hero, whose portrait sits behind
     the nav. Over it we brighten the marks; once scrolled we fall back to
     the standard text colour against the page background. */
  const overHero = pathname === "/" && !scrolled;

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
  const navBg = overHero
    ? "rgba(10,8,7,0.28)"
    : scrolled
      ? "rgba(10,8,7,0.85)"
      : "rgba(10,8,7,0.3)";

  /* Foreground: brighter cream over the hero portrait, else standard text. */
  const navFg = overHero ? "#EDE6DA" : "var(--text)";
  const navDot = overHero ? "#C2453E" : "var(--accent)";

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
          className="font-display text-xl md:text-2xl tracking-[0.25em] no-underline shrink-0 transition-colors duration-500"
          style={{ color: navFg }}
        >
          WC<span style={{ color: navDot }}>.</span>
        </Link>

        {/* Desktop links — absolutely centred so the empty right slot
            (the theme toggle used to live there) can't skew them. */}
        <ul className="hidden md:flex list-none gap-7 lg:gap-10 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="no-underline text-[0.78rem] tracking-[0.16em] uppercase font-medium transition-all duration-300 opacity-65 hover:opacity-100 whitespace-nowrap"
                style={{ color: navFg }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Hamburger — mobile */}
          <Hamburger
            open={menuOpen}
            onClick={menuOpen ? closeMenu : openMenu}
            color={menuOpen ? "var(--text)" : navFg}
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
            className="px-8 pb-10 flex items-center justify-end shrink-0"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.5s ease 0.55s`,
            }}
          >
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
