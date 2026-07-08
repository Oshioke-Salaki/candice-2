"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { cldBlurURL, cldLoader, cldLoaderWith } from "@/lib/media";

/* Cloudinary two-step smart crop: first trim the dark void around
   the subject, then fill a 2:3 cover portrait — she fills the frame
   head to podium. */
const heroLoader = cldLoaderWith(
  "c_crop,w_0.9,h_0.62,g_auto/c_fill,ar_2:3,g_auto",
);

// In-session guard so client-side navigations also skip the splash.
let splashHasPlayed = false;

export default function Hero() {
  const [textIn, setTextIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  // Runs synchronously before the browser paints — returning visitors never
  // see the preloader DOM at all, eliminating the black flash on refresh.
  useLayoutEffect(() => {
    if (splashHasPlayed || localStorage.getItem("wcSeenSplash") === "1") {
      setTextIn(true);
      setOpen(true);
      setGone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const alreadySeen =
      splashHasPlayed || localStorage.getItem("wcSeenSplash") === "1";

    if (alreadySeen) return; // useLayoutEffect already handled it

    splashHasPlayed = true;

    const t1 = setTimeout(() => setTextIn(true), 100);
    const t2 = setTimeout(() => setOpen(true), 1900);
    const t3 = setTimeout(() => {
      setGone(true);
      localStorage.setItem("wcSeenSplash", "1");
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
              className="font-display"
              style={{
                fontSize: "clamp(1.8rem, 6vw, 5.5rem)",
                fontWeight: 700,
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
              className="font-display"
              style={{
                fontSize: "clamp(2.8rem, 10vw, 10rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#EDE6DA",
                transform: textIn ? "translateY(0)" : "translateY(36px)",
                opacity: textIn ? 1 : 0,
                transition: `transform 0.75s ${ease} 0.08s, opacity 0.75s ${ease} 0.08s`,
              }}
            >
              Candice
            </div>
          </div>
        </div>
      )}

      {/* ═══════ HERO ═══════
          Concept: "The Cover"
          A digital magazine cover. The masthead — fine serif "WOW" over
          massive "CANDICE" — sits high in the frame; the portrait
          (smart-cropped by Cloudinary, g_auto) rises from the bottom edge
          OVER the masthead, the way a cover star overlaps the logo.
      ══════════════════════ */}
      <section
        id="home"
        className="relative overflow-hidden"
        style={{ height: "100svh", minHeight: 640 }}
      >
        {/* ── Atmospheric wash — blurred echo of the portrait ── */}
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
              filter: "blur(64px) brightness(0.32) saturate(1.25)",
              transform: "scale(1.25)",
            }}
          />
          {/* Dark cap at top — nav always readable */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "120px",
              background:
                "linear-gradient(to bottom, rgba(6,3,2,0.5) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Masthead — BEHIND the portrait, like a magazine logo ── */}
        <div
          className="absolute inset-x-0 z-10 flex flex-col items-center text-center px-6"
          style={{ top: "max(9svh, 92px)" }}
        >
          <p
            className="uppercase font-medium"
            style={{
              fontSize: "clamp(0.55rem, 0.9vw, 0.68rem)",
              letterSpacing: "0.55em",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "clamp(1rem, 2.2svh, 1.8rem)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.9s ease 0.85s, transform 0.9s ${ease} 0.85s`,
            }}
          >
            <span style={{ color: "#C2453E" }}>✶</span> &nbsp; Model
            &nbsp;·&nbsp; Creator &nbsp;·&nbsp; Muse &nbsp;{" "}
            <span style={{ color: "#C2453E" }}>✶</span>
          </p>

          {/* <div
            className="font-display text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(1.4rem, 3.2vw, 3.1rem)",
              fontWeight: 700,
              letterSpacing: "clamp(0.3em, 1vw, 0.5em)",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1,
              marginBottom: "clamp(0.3rem, 0.8svh, 0.6rem)",
              transform: open ? "translateY(0)" : "translateY(20px)",
              opacity: open ? 1 : 0,
              transition: `transform 1.1s ${ease} 0.4s, opacity 1s ${ease} 0.4s`,
            }}
          >
            WOW
          </div> */}

          <h1
            className="font-display text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(4rem, 13vw, 10.5rem)",
              fontWeight: 700,
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
              transform: open ? "translateY(0)" : "translateY(34px)",
              opacity: open ? 1 : 0,
              transition: `transform 1.1s ${ease} 0.5s, opacity 1s ${ease} 0.5s`,
            }}
          >
            <span style={{ color: "#A82420" }}>wow</span>candice
          </h1>
        </div>

        {/* ── Cover star — smart-cropped portrait over the masthead ── */}
        <div
          className="absolute left-1/2 bottom-0 z-20"
          style={{
            width: "min(88vw, calc(64svh * 2 / 3))",
            aspectRatio: "2/3",
            transform: `translateX(-50%) translateY(${open ? "0" : "5%"})`,
            opacity: open ? 1 : 0,
            transition: `transform 1.4s ${ease} 0.65s, opacity 1.1s ease 0.65s`,
          }}
        >
          <Image
            loader={heroLoader}
            src="candice/hero/hero"
            alt="Candice — cover portrait"
            fill
            priority
            placeholder="blur"
            blurDataURL={cldBlurURL(
              "candice/hero/hero",
              "c_crop,w_0.9,h_0.62,g_auto/c_fill,ar_2:3,g_auto",
            )}
            className="object-cover"
            sizes="(max-width: 768px) 88vw, 460px"
          />
          {/* hairline frame in her oxblood red */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ border: "1px solid rgba(194,69,62,0.4)" }}
          />
          {/* grounding gradient inside the portrait's bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "22%",
              background:
                "linear-gradient(to top, rgba(6,3,2,0.55) 0%, transparent 100%)",
            }}
          />
          {/* location — cover strapline, pinned to the portrait's foot */}
          <p
            className="absolute bottom-4 left-0 right-0 text-center uppercase"
            style={{
              fontSize: "clamp(0.5rem, 0.9vw, 0.6rem)",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.75)",
              opacity: open ? 1 : 0,
              transition: `opacity 0.9s ease 1.15s`,
            }}
          >
            London &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; Worldwide
          </p>
        </div>

        {/* ── Flanking rules — the couture red, framing the cover ── */}
        <div
          aria-hidden="true"
          className="absolute z-10 hidden md:block"
          style={{
            left: "8%",
            top: "50%",
            width: "1px",
            height: "clamp(60px, 14svh, 130px)",
            background: "rgba(194,69,62,0.6)",
            transformOrigin: "center",
            transform: `translateY(-50%) scaleY(${open ? 1 : 0})`,
            transition: `transform 1s ${ease} 0.9s`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute z-10 hidden md:block"
          style={{
            right: "8%",
            top: "50%",
            width: "1px",
            height: "clamp(60px, 14svh, 130px)",
            background: "rgba(194,69,62,0.6)",
            transformOrigin: "center",
            transform: `translateY(-50%) scaleY(${open ? 1 : 0})`,
            transition: `transform 1s ${ease} 0.9s`,
          }}
        />

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
