"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Day 1 (dark) is cleaned away by the scroll until Day 2 (light) is left.
 * Desktop only: on mobile both days stack, because five items in a pinned
 * phone screen would not fit. The wipe itself lives in CSS (--wipe).
 */
export function DayWipe({ dayA, dayB }: { dayA: React.ReactNode; dayB: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const wipe = useTransform(p, [0.18, 0.82], ["100%", "0%"]);

  return (
    <div ref={ref} className="pin-days relative">
      <div className="days-stage">
        <div className="day-panel surface-ink">{dayA}</div>
        <motion.div className="day-panel day-panel-b surface-parchment" style={{ "--wipe": wipe } as never}>
          {dayB}
        </motion.div>
        <motion.span
          aria-hidden
          className="absolute inset-y-0 hidden w-px bg-[var(--paper)] mix-blend-difference lg:block"
          style={{ left: wipe }}
        />
      </div>
    </div>
  );
}
