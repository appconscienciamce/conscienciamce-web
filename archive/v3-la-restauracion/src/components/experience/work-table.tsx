"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/** Resting place of each print on the table, as % of the table size. */
const layout = [
  { left: 3, top: 8, rotate: -6 },
  { left: 20, top: 34, rotate: 4 },
  { left: 37, top: 6, rotate: -2 },
  { left: 53, top: 30, rotate: 5 },
  { left: 68, top: 4, rotate: -5 },
  { left: 81, top: 32, rotate: 3 },
];

const mobileScale = "w-[9.5rem] sm:w-[11rem] lg:w-[14rem]";

/** Prints scattered on a table. Drag them around; captions stay readable. */
export function WorkTable({
  title,
  hint,
  prints,
}: {
  title: string;
  hint: string;
  prints: { src: string; alt: string; caption: string }[];
}) {
  const table = useRef<HTMLDivElement>(null);
  // Touch screens keep the layout but not the drag: a table the size of the
  // screen must never trap the page scroll.
  const [canDrag, setCanDrag] = useState(false);
  useEffect(() => setCanDrag(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);

  return (
    <div className="mt-20 lg:mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="display text-[clamp(2rem,4vw,3.25rem)] italic">{title}</h3>
        {canDrag && <p className="label text-[var(--muted)]">{hint}</p>}
      </div>
      <div
        ref={table}
        className="surface-ink relative mt-6 h-[47rem] overflow-hidden rounded-[9px] sm:h-[56rem] lg:h-[35rem]"
      >
        {prints.map((print, i) => {
          const spot = layout[i % layout.length];
          // On phones the prints sit in two loose columns instead of a long row.
          return (
            <motion.figure
              key={print.caption}
              drag={canDrag}
              dragConstraints={table}
              dragElastic={0.12}
              dragMomentum={false}
              whileDrag={{ scale: 1.06, rotate: 0, zIndex: 20, cursor: "grabbing" }}
              whileHover={{ scale: 1.02 }}
              initial={{ rotate: spot.rotate }}
              style={
                {
                  "--l": `${spot.left}%`,
                  "--t": `${spot.top}%`,
                  "--ml": `${i % 2 ? 50 : 3}%`,
                  "--mt": `${3 + Math.floor(i / 2) * 32}%`,
                } as React.CSSProperties
              }
              className={`absolute left-[var(--ml)] top-[var(--mt)] bg-[var(--bone)] [@media(hover:hover)]:cursor-grab p-2 pb-1 lg:left-[var(--l)] lg:top-[var(--t)] ${mobileScale}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={print.src}
                  alt={print.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 14rem, 11rem"
                  className="pointer-events-none object-cover"
                  style={{ objectPosition: "center 42%" }}
                />
              </div>
              <figcaption className="py-1.5 text-center text-[0.75rem] font-medium text-[var(--ink)]">
                {print.caption}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}
