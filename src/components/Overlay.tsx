"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Full-screen layers (the shoot viewer, the phone menu) render here.

   Two iOS Safari problems this solves:
   1. `overflow: hidden` on <body> does not stop touch scrolling, so the
      page kept moving underneath. Pinning <body> with position: fixed
      at the current offset does, and the offset is restored on close.
   2. Fixed layers no longer reach under the status bar or the
      floating address bar, so the page peeked through above and below.
      While a layer is open every other child of <body> is hidden, so
      those strips show the plain page background instead.

   The layer is portalled to <body> so no transformed ancestor can trap
   its `position: fixed`. */

let locks = 0;
let savedY = 0;

function lock() {
  if (locks++ > 0) return;
  savedY = window.scrollY;
  const b = document.body.style;
  b.position = "fixed";
  b.top = `-${savedY}px`;
  b.left = "0";
  b.right = "0";
  b.width = "100%";
  document.body.classList.add("overlay-open");
}

function unlock() {
  if (--locks > 0) return;
  const b = document.body.style;
  b.position = b.top = b.left = b.right = b.width = "";
  document.body.classList.remove("overlay-open");
  // Jump straight back; the page's smooth scrolling would animate it.
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, savedY);
  html.style.scrollBehavior = prev;
}

export default function Overlay({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    lock();
    setHost(document.body);
    return unlock;
  }, []);

  return host ? createPortal(<div className="overlay-root">{children}</div>, host) : null;
}
