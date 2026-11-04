"use client";

import { motion, useScroll } from "motion/react";

/** A hairline on the page edge: how far along the restoration the reader is. */
export function RestorationMeter() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-40 h-full w-[3px] origin-top bg-[var(--paper)] mix-blend-difference"
      style={{ scaleY: scrollYProgress }}
    />
  );
}
