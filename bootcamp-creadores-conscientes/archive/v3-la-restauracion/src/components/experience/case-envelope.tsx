"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

/** A horseshoe around Pilar's photo: x is -1..1 across, y goes up to -1. */
const SPOTS = [
  [-1, -0.2],
  [-1, -0.5],
  [-1, -0.8],
  [-0.42, -1],
  [0.42, -1.1],
  [1, -0.8],
  [1, -0.5],
  [1, -0.2],
];

/** One file leaving the folder, each on its own stretch of scroll. */
function FileCard({
  label,
  index,
  p,
  reduced,
}: {
  label: string;
  index: number;
  p: MotionValue<number>;
  reduced: boolean | null;
}) {
  const [cx, cy] = SPOTS[index % SPOTS.length];
  const from = 0.32 + index * 0.05;
  const t = useTransform(p, [from, from + 0.2], [0, 1]);
  const o = useTransform(p, [from, from + 0.06], [0, 1]);

  return (
    <motion.div
      className="file-card rm-file"
      style={
        {
          "--cx": cx,
          "--cy": cy,
          "--tilt": `${(index % 2 ? -1 : 1) * (3 + index)}deg`,
          "--t": reduced ? 1 : t,
          "--o": reduced ? 1 : o,
        } as never
      }
    >
      <b>{String(index + 1).padStart(2, "0")}</b>
      <span>{label}</span>
    </motion.div>
  );
}

/**
 * The case arrives sealed. Scrolling tips the front of the folder open, light
 * comes out, then Pilar, then every layer of the work flies out around her.
 */
export function CaseEnvelope({
  heading,
  figure,
  layers,
  photo,
  photoAlt,
  name,
  fileLabel,
  kicker,
}: {
  heading: React.ReactNode;
  figure: React.ReactNode;
  layers: string[];
  photo: string;
  photoAlt: string;
  name: string;
  fileLabel: string;
  kicker: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.3 });

  const flap = useTransform(p, [0.06, 0.28], [0, -64]);
  const light = useTransform(p, [0.1, 0.3], [0, 1]);
  const lightScale = useTransform(p, [0.1, 0.42], [0.4, 1.15]);
  const rays = useTransform(p, [0.1, 1], [0, 70]);
  const photoY = useTransform(p, [0.2, 0.4], ["55%", "-58%"]);
  const photoScale = useTransform(p, [0.2, 0.4], [0.6, 1]);
  const photoOpacity = useTransform(p, [0.2, 0.26], [0, 1]);
  const headingOpacity = useTransform(p, [0.3, 0.4], [1, 0]);
  const figureOpacity = useTransform(p, [0.84, 0.94], [0, 1]);
  const figureY = useTransform(p, [0.84, 0.96], [18, 0]);

  return (
    <div ref={ref} className="pin-strata relative">
      <div className="sticky top-0 grid h-[100svh] grid-rows-[auto_1fr_auto] overflow-hidden px-[var(--gutter)] pb-20 pt-8 lg:pb-8">
        <motion.div className="rm-final text-center" style={reduced ? undefined : { opacity: headingOpacity }}>
          {heading}
        </motion.div>

        <div
          className="relative flex min-h-0 items-end justify-center pb-2"
          style={
            {
              "--rx": "min(calc(50vw - 4.4rem), 25rem)",
              "--ry": "min(40svh, 24rem)",
            } as React.CSSProperties
          }
        >
          <div className="envelope [width:min(74vw,24rem,44svh)]">
            <div className="envelope__back">
              <div aria-hidden className="envelope__tabs">
                <span>{layers[1]}</span>
                <span>{layers[5]}</span>
              </div>
            </div>

            <div aria-hidden className="envelope__source rm-hide">
              <motion.div className="envelope__rays" style={{ opacity: reduced ? 0 : light, rotate: rays }} />
              <motion.div className="envelope__light" style={{ opacity: reduced ? 0 : light, scale: lightScale }} />
            </div>

            {layers.map((layer, i) => (
              <FileCard key={layer} label={layer} index={i} p={p} reduced={reduced} />
            ))}

            <motion.figure
              className="rm-final absolute bottom-[34%] left-1/2 w-[min(38vw,11rem,24svh)] -ml-[min(19vw,5.5rem,12svh)] bg-[var(--parchment)] p-1.5 pb-1 text-[var(--ink)] shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
              style={reduced ? undefined : { y: photoY, scale: photoScale, opacity: photoOpacity, rotate: -3 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={photoAlt} loading="lazy" className="aspect-square w-full object-cover sepia-[0.28]" />
              <figcaption className="py-0.5 text-center text-[0.75rem] font-medium">{name}</figcaption>
            </motion.figure>

            <motion.div
              className="envelope__front rm-hide"
              style={reduced ? undefined : { rotateX: flap }}
            >
              <span className="label text-[var(--gold)]">{fileLabel}</span>
              <span className="display mt-2 text-[clamp(2rem,6vw,3rem)] italic leading-none">{name}</span>
              <span className="mt-2 px-4 text-[0.75rem] text-[var(--muted)]">{kicker}</span>
              <span
                aria-hidden
                className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)] text-[0.875rem] text-[var(--gold)]"
              >
                ✦
              </span>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="rm-final min-h-[4.75rem] pt-3 text-center"
          style={reduced ? undefined : { opacity: figureOpacity, y: figureY }}
        >
          {figure}
        </motion.div>
      </div>
    </div>
  );
}
