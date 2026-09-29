"use client";

import { MotionConfig } from "motion/react";

/* reducedMotion="user" makes every Motion animation on the page collapse
   to an instant change when the visitor prefers reduced motion. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
