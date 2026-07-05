"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;
    let raf: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + "px";
        dotRef.current.style.top = mouseY + "px";
      }
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringX + "px";
        ringRef.current.style.top = ringY + "px";
      }
      raf = requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    setReady(true);

    const targets = document.querySelectorAll("a, button, .hoverable");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", () => setHovered(true));
      el.addEventListener("mouseleave", () => setHovered(false));
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className={`cursor-ring ${ready ? "ready" : ""} ${hovered ? "hovered" : ""}`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`cursor-dot ${ready ? "ready" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
