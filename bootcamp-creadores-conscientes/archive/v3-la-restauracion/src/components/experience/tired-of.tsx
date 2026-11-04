"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

function Line({
  text,
  index,
  total,
  p,
  reduced,
}: {
  text: string;
  index: number;
  total: number;
  p: MotionValue<number>;
  reduced: boolean | null;
}) {
  const slot = 1 / total;
  const from = index * slot;
  const to = from + slot;
  const last = index === total - 1;
  const opacity = useTransform(
    p,
    last ? [from, from + 0.04, 1] : [from, from + 0.04, to - 0.04, to],
    last ? [index === 0 ? 1 : 0, 1, 1] : [index === 0 ? 1 : 0, 1, 1, 0],
  );
  const y = useTransform(p, [from, to], [index === 0 ? 0 : 26, last ? 0 : -26]);

  return (
    <motion.p
      className={`rm-final col-start-1 row-start-1 text-[clamp(1.5rem,3.1vw,2.75rem)] font-normal leading-[1.28] tracking-[-0.012em] ${
        reduced ? "mb-8" : ""
      }`}
      style={reduced ? undefined : { opacity, y }}
    >
      {text}
    </motion.p>
  );
}

/**
 * One sentence at a time, large, in the grotesk. Reading a block of hairline
 * serif while it lights up was the problem: this only ever asks for one idea.
 */
export function TiredOf({ eyebrow, lines }: { eyebrow: string; lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="pin-words relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-[var(--gutter)]">
        <div className="mx-auto w-full max-w-[60rem]">
          <p className="display text-[clamp(1.75rem,3.4vw,3rem)] italic text-[var(--gold)]">{eyebrow}</p>
          <div className="mt-8 grid min-h-[11em]">
            {lines.map((line, i) => (
              <Line key={line} text={line} index={i} total={lines.length} p={p} reduced={reduced} />
            ))}
          </div>
          <div aria-hidden className="rm-hide mt-6 h-px w-full bg-[var(--rule)]">
            <motion.div className="h-full bg-[var(--gold)]" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </div>
  );
}
