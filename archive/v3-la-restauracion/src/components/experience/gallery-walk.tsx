"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Item = { text: string; image: string; alt: string };

/** Light slides over each plate in turn, so the wall feels lit from outside. */
function Plate({ item, index, className = "" }: { item: Item; index: number; className?: string }) {
  return (
    <div className={`plate sheen ${className}`} style={{ "--sheen-delay": `${index * 1.15}s` } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.alt} loading="lazy" draggable={false} />
    </div>
  );
}

/* ----------------------------------------------------------------
   Desktop: the wall slides sideways while the page scrolls down.
----------------------------------------------------------------- */
function Wall({ title, intro, items }: { title: string; intro: string; items: Item[] }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const x = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.3 });

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useMotionValueEvent(smooth, "change", (p) => x.set(-p * distance));
  const pinned = distance > 0;

  return (
    <div
      ref={wrapper}
      className="surface-putty relative hidden lg:block"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 h-[100svh] overflow-hidden" : "overflow-x-auto"}>
        <motion.ul
          ref={track}
          style={pinned ? { x } : undefined}
          className="flex h-full min-h-[100svh] w-max items-center gap-12 px-[var(--gutter)]"
        >
          <li className="w-[min(34vw,32rem)] shrink-0">
            <h2 className="display text-[clamp(3.5rem,7vw,7rem)]">{title}</h2>
            <p className="mt-6 max-w-[22rem] text-lg text-[var(--muted)]">{intro}</p>
          </li>
          {items.map((item, i) => (
            <li key={item.image} className="w-[calc(62svh*0.638)] min-w-[17rem] shrink-0">
              <Plate item={item} index={i} className="h-[62svh] min-h-[23rem]" />
              <p className="mt-4 min-h-[5.5rem] text-[1.0625rem] leading-snug">{item.text}</p>
            </li>
          ))}
          <li aria-hidden className="w-[10vw] shrink-0" />
        </motion.ul>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Phones: each plate slides up and lands on the pile.
----------------------------------------------------------------- */
const TILT = [-3, 2.2, -1.6, 2.6, 0];

function PileCard({ item, index, total, p }: { item: Item; index: number; total: number; p: MotionValue<number> }) {
  const span = 0.84 / (total - 1);
  const start = (index - 1) * span;
  const end = index * span;
  const buried = total - 1 - index;
  const y = useTransform(p, index === 0 ? [0, 1] : [start, end], index === 0 ? ["0%", "0%"] : ["125%", "0%"]);
  const sink = useTransform(p, [end, 0.9], [1, 1 - buried * 0.045]);
  const lift = useTransform(p, [end, 0.9], [0, buried * -9]);
  const rotate = useTransform(p, index === 0 ? [0, 1] : [start, end], index === 0 ? [TILT[0], TILT[0]] : [TILT[index] * 3, TILT[index]]);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y, zIndex: index }}>
      <motion.div className="h-full max-h-[122vw] aspect-[410/643]" style={{ rotate, scale: sink, y: lift }}>
        <Plate item={item} index={index} className="h-full shadow-[0_18px_40px_rgba(0,0,0,0.6)]" />
      </motion.div>
    </motion.div>
  );
}

function Pile({ title, intro, items }: { title: string; intro: string; items: Item[] }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.3 });

  useMotionValueEvent(p, "change", (v) => {
    setActive(Math.min(items.length - 1, Math.round((v / 0.84) * (items.length - 1))));
  });

  if (reduced) {
    return (
      <div className="surface-putty px-[var(--gutter)] py-16 lg:hidden">
        <h2 className="display text-[3.25rem]">{title}</h2>
        <p className="mt-3 text-[var(--muted)]">{intro}</p>
        <ul className="mt-8 space-y-8">
          {items.map((item, i) => (
            <li key={item.image}>
              <Plate item={item} index={i} className="aspect-[410/643]" />
              <p className="mt-3 text-[1.0625rem] leading-snug">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={wrapper} className="surface-putty relative lg:hidden" style={{ height: `${items.length * 75}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-[var(--gutter)] pt-6">
        <h2 className="display text-center text-[clamp(2.25rem,11vw,3.5rem)]">{title}</h2>
        <div className="relative my-4 min-h-0 flex-1">
          {items.map((item, i) => (
            <PileCard key={item.image} item={item} index={i} total={items.length} p={p} />
          ))}
        </div>
        <div className="min-h-[7.5rem] pb-20 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mx-auto max-w-[24rem] text-[1.0625rem] leading-snug"
            >
              {items[active].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function GalleryWalk(props: { title: string; intro: string; items: Item[] }) {
  return (
    <section aria-label={props.title}>
      <Wall {...props} />
      <Pile {...props} />
    </section>
  );
}
