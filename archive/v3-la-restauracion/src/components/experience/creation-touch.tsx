"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The closing moment. The painting is split on the gap between the fingers and
 * the two halves travel towards each other with the scroll. When they touch, the
 * ticket rises. Scrolling back undoes it: nothing here is time-based.
 */
export function CreationTouch({
  alt,
  label,
  hint,
  children,
}: {
  alt: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const left = useTransform(p, [0, 0.56], ["-34vw", "0vw"]);
  const right = useTransform(p, [0, 0.56], ["34vw", "0vw"]);
  const hintOpacity = useTransform(p, [0, 0.12, 0.3], [1, 1, 0]);
  const spark = useTransform(p, [0.54, 0.6, 0.72], [0, 1, 0]);
  const sparkScale = useTransform(p, [0.54, 0.72], [0.2, 14]);
  const ticketY = useTransform(p, [0.62, 0.86], ["110%", "0%"]);

  return (
    <div ref={ref} className="pin-touch relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--ink)]">
        <div role="img" aria-label={alt} className="touch-stage">
          <span aria-hidden className="touch-fade" />
          <motion.div className="touch-half touch-left rm-final" style={reduced ? undefined : { x: left }} />
          <motion.div className="touch-half touch-right rm-final" style={reduced ? undefined : { x: right }} />
          <motion.span
            aria-hidden
            className="rm-hide absolute left-[46.38%] top-[74%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            style={{ opacity: reduced ? 0 : spark, scale: sparkScale }}
          />
        </div>

        <p className="absolute left-[var(--gutter)] top-5 max-w-[18rem] rounded-[2px] bg-[var(--ink)]/80 px-3 py-2 text-[0.75rem] text-[var(--paper)]">
          {label}
        </p>

        <motion.p
          aria-hidden
          className="rm-hide label absolute inset-x-0 bottom-6 text-center text-[var(--paper)]"
          style={{ opacity: reduced ? 0 : hintOpacity }}
        >
          {hint} ↓
        </motion.p>

        <motion.div
          className="rm-final absolute inset-x-0 bottom-0 z-10 px-[var(--gutter)] pb-3 sm:pb-6"
          style={reduced ? undefined : { y: ticketY }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
