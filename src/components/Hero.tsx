"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { cldLoader } from "@/lib/media";

// In-session guard so client-side navigations also skip the splash.
let splashHasPlayed = false;

export default function Hero() {
  const [textIn, setTextIn] = useState(false);
  const [open,   setOpen]   = useState(false);
  const [gone,   setGone]   = useState(false);

  // Runs synchronously before the browser paints — returning visitors never
  // see the preloader DOM at all, eliminating the black flash on refresh.
  useLayoutEffect(() => {
    if (splashHasPlayed || localStorage.getItem('wcSeenSplash') === '1') {
      setTextIn(true);
      setOpen(true);
      setGone(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const alreadySeen =
      splashHasPlayed || localStorage.getItem('wcSeenSplash') === '1';

    if (alreadySeen) return; // useLayoutEffect already handled it

    splashHasPlayed = true;

    const t1 = setTimeout(() => setTextIn(true),  100);
    const t2 = setTimeout(() => setOpen(true),    1900);
    const t3 = setTimeout(() => {
      setGone(true);
      localStorage.setItem('wcSeenSplash', '1');
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ease = "cubic-bezier(0.16,1,0.3,1)";

  return (
    <>
      {/* ═══════ PRELOADER ═══════ */}
      {!gone && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9990] flex items-center justify-center"
          style={{
            background: "#0A0807",
            opacity: open ? 0 : 1,
            transition: "opacity 0.9s ease 0.05s",
            pointerEvents: open ? "none" : "auto",
          }}
        >
          <div className="text-center" style={{ lineHeight: 0.88 }}>
            <div
              className="font-serif italic"
              style={{
                fontSize: "clamp(1.8rem, 6vw, 5.5rem)",
                letterSpacing: "0.5em",
                color: "#A82420",
                transform: textIn ? "translateY(0)" : "translateY(-36px)",
                opacity: textIn ? 1 : 0,
                transition: `transform 0.75s ${ease}, opacity 0.75s ${ease}`,
              }}
            >
              WOW
            </div>
            <div
              className="font-display tracking-[0.12em]"
              style={{
                fontSize: "clamp(2.8rem, 10vw, 10rem)",
                color: "#EDE6DA",
                transform: textIn ? "translateY(0)" : "translateY(36px)",
                opacity: textIn ? 1 : 0,
                transition: `transform 0.75s ${ease} 0.08s, opacity 0.75s ${ease} 0.08s`,
              }}
            >
              CANDICE
            </div>
          </div>
        </div>
      )}

      {/* ═══════ HERO ═══════
          Concept: "The Title Card"
          Full-bleed cinematic portrait with a precisely centered typographic
          composition built on contrast:
            ↳ Fine spaced italic serif  "W O W"     (elegance)
            ↳ Massive display caps      "CANDICE"   (power)
          Framed above and below by thin ruled lines — like a couture label.
          The rules and separators carry her oxblood red.
      ══════════════════════ */}
      <section
        id="home"
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "100svh", minHeight: 600 }}
      >
        {/* ── Full portrait over a blurred self-extension ──
            The source image is an ultra-tall portrait (1206×2622), so
            object-cover would crop most of it on wide screens. Instead:
            a blurred, darkened copy fills the frame edge-to-edge, and the
            full uncropped portrait sits on top with object-contain. ── */}
        <div className="absolute inset-0 z-0">
          <Image
            loader={cldLoader}
            src="candice/hero/hero"
            alt=""
            aria-hidden
            fill
            priority
            className="object-cover"
            sizes="100vw"
            style={{
              filter: "blur(48px) brightness(0.5) saturate(1.15)",
              transform: "scale(1.15)",
            }}
          />
          <Image
            loader={cldLoader}
            src="candice/hero/hero"
            alt="Candice — Hero"
            fill
            priority
            className="object-contain"
            sizes="100vw"
            style={{
              objectPosition: "50% 50%",
              transform: open ? "scale(1.03)" : "scale(1.0)",
              transition: "transform 14s ease-out",
            }}
          />

          {/* Cinematic radial vignette — subtle, preserves image visibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 90% at 50% 45%, transparent 25%, rgba(6,3,2,0.45) 100%)",
            }}
          />

          {/* Dark cap at top — nav always readable */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "140px",
              background:
                "linear-gradient(to bottom, rgba(6,3,2,0.4) 0%, transparent 100%)",
            }}
          />

          {/* Dark gradient from bottom — grounds composition */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "30%",
              background:
                "linear-gradient(to top, rgba(6,3,2,0.5) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Centered editorial composition ── */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-6 w-full"
          style={{ gap: 0 }}
        >
          {/* ROLE LABEL — ultra-fine, widely tracked */}
          <p
            className="uppercase font-medium"
            style={{
              fontSize: "clamp(0.8rem, 1vw, 0.58rem)",
              letterSpacing: "0.55em",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "clamp(1.2rem, 2.5vh, 2rem)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.9s ease 0.9s, transform 0.9s ${ease} 0.9s`,
            }}
          >
            <span style={{ color: "#C2453E" }}>✶</span> &nbsp; Model
            &nbsp;·&nbsp; Creator &nbsp;·&nbsp; Muse &nbsp;{" "}
            <span style={{ color: "#C2453E" }}>✶</span>
          </p>

          {/* TOP RULE — grows from center outward */}
          <div
            style={{
              width: "clamp(40px, 6vw, 80px)",
              height: "1px",
              background: "rgba(194,69,62,0.75)",
              marginBottom: "clamp(1.4rem, 3vh, 2.5rem)",
              transformOrigin: "center",
              transform: open ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 1s ${ease} 0.38s`,
            }}
            aria-hidden="true"
          />

          {/* "WOW" — Cormorant Garamond italic, elegant, tracked out */}
          <div
            className="font-serif italic"
            style={{
              fontSize: "clamp(2.4rem, 6.5vw, 8.5rem)",
              fontWeight: 300,
              letterSpacing: "clamp(0.35em, 1.5vw, 0.6em)",
              color: "rgba(255,255,255,0.93)",
              lineHeight: 1,
              marginBottom: "clamp(0.4rem, 1vh, 0.75rem)",
              transform: open ? "translateY(0)" : "translateY(22px)",
              opacity: open ? 1 : 0,
              transition: `transform 1.1s ${ease} 0.44s, opacity 1s ${ease} 0.44s`,
            }}
          >
            WOW
          </div>

          {/* "CANDICE" — Bebas Neue, massive, solid white, commands the frame */}
          <h1
            className="font-display text-white"
            style={{
              fontSize: "clamp(4.6rem, 17.5vw, 23rem)",
              lineHeight: 0.82,
              letterSpacing: "0.025em",
              marginBottom: "clamp(1.4rem, 3vh, 2.5rem)",
              transform: open ? "translateY(0)" : "translateY(36px)",
              opacity: open ? 1 : 0,
              transition: `transform 1.1s ${ease} 0.56s, opacity 1s ${ease} 0.56s`,
            }}
          >
            CANDICE
          </h1>

          {/* BOTTOM RULE */}
          <div
            style={{
              width: "clamp(40px, 6vw, 80px)",
              height: "1px",
              background: "rgba(194,69,62,0.75)",
              marginBottom: "clamp(1.2rem, 2.5vh, 2rem)",
              transformOrigin: "center",
              transform: open ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 1s ${ease} 0.68s`,
            }}
            aria-hidden="true"
          />

          {/* LOCATION — mirrors the role label */}
          <p
            className="uppercase"
            style={{
              fontSize: "clamp(0.52rem, 1vw, 0.62rem)",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.42)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.9s ease 0.95s, transform 0.9s ${ease} 0.95s`,
            }}
          >
            London &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; Worldwide
          </p>
        </div>

        {/* ── Corner details — appear last ── */}

        {/* Bottom-left: year */}
        <div
          className="absolute bottom-7 left-8 md:left-14 z-10"
          style={{
            opacity: open ? 0.35 : 0,
            transition: `opacity 0.8s ease 1.1s`,
          }}
        >
          <span
            className="font-display tracking-[0.25em] text-white"
            style={{ fontSize: "0.62rem" }}
          >
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Bottom-right: WC monogram */}
        <div
          className="absolute bottom-7 right-8 md:right-14 z-10"
          style={{
            opacity: open ? 0.35 : 0,
            transition: `opacity 0.8s ease 1.1s`,
          }}
        >
          <span
            className="font-display tracking-[0.25em] text-white"
            style={{ fontSize: "0.62rem" }}
          >
            WC
          </span>
        </div>
      </section>
    </>
  );
}
