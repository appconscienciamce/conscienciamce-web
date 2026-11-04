"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { HeroDepth } from "@/components/experience/hero-depth";

/** Where each word sits on the art (%), and which way it leaves. */
const WORDS = [
  { x: "7%", y: "23%", dx: -70, dy: -40 },
  { x: "68%", y: "24%", dx: 70, dy: -40 },
  { x: "5%", y: "46%", dx: -80, dy: 30 },
  { x: "72%", y: "46%", dx: 80, dy: 30 },
];

function Word({ text, index, p, reduced }: { text: string; index: number; p: MotionValue<number>; reduced: boolean | null }) {
  const spot = WORDS[index % WORDS.length];
  const x = useTransform(p, [0, 0.7], [0, spot.dx]);
  const y = useTransform(p, [0, 0.7], [0, spot.dy]);
  const opacity = useTransform(p, [0.3, 0.62], [1, 0]);
  return (
    <motion.span
      className="hero-cine__word rm-final"
      style={{ "--wx": spot.x, "--wy": spot.y, ...(reduced ? {} : { x, y, opacity }) } as never}
    >
      {text}
    </motion.span>
  );
}

/**
 * The hero is a stage held in place while the page scrolls under it. The camera
 * pushes in, the title and the words open up, and the moon rises to carry the
 * reader into the next chapter. On phones the stage is taller than the screen,
 * so it is first read in full and held only when its bottom edge arrives.
 */
export function HeroCine({
  id,
  title,
  titleAlt,
  art,
  depth,
  artAlt,
  moon,
  words,
  scrollNote,
  bar,
  copy,
  side,
}: {
  id: string;
  title: string;
  titleAlt: string;
  art: string;
  depth: string;
  artAlt: string;
  moon: string;
  words: string[];
  scrollNote: string;
  bar: React.ReactNode;
  copy: React.ReactNode;
  side: React.ReactNode;
}) {
  const wrapper = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Desktop has its own exit: everything leaves and MARKETING stays until the end.
  const [desktop, setDesktop] = useState(false);

  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });

  const copyY = useTransform(p, [0, 0.45], [0, -46]);
  const copyOpacity = useTransform(p, [0.08, 0.38], [1, 0]);
  const moonY = useTransform(p, [0, 1], ["0%", "-55%"]);
  const moonScale = useTransform(p, [0, 1], [1, 2.3]);
  const athensY = useTransform(p, [0, 1], ["0%", "-7%"]);
  const veil = useTransform(p, [0.7, 1], [0, 0.9]);
  const noteOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const titleCentre = useTransform(p, [0.22, 0.82], ["0svh", "33svh"]);
  const titleGrow = useTransform(p, [0.22, 0.82], [1, 1.32]);
  const panelOpacity = useTransform(p, [0.03, 0.24], [1, 0]);
  const panelY = useTransform(p, [0, 0.3], [0, -40]);
  const artOpacity = useTransform(p, [0.3, 0.62], [1, 0]);

  // Phones: the held stage has its top above the screen, so the title drops
  // back into view and stays with the buttons after everything else has gone.
  const titleDrop = useMotionValue(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const phoneTitleY = useTransform(p, (v) => Math.min(1, Math.max(0, (v - 0.12) / 0.5)) * titleDrop.get());
  const phoneArtOpacity = useTransform(p, [0.34, 0.66], [1, 0]);
  const factsOpacity = useTransform(p, [0.08, 0.3], [1, 0]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = stage.current;
    const host = wrapper.current;
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fit = () => {
      const h = el.offsetHeight;
      host.style.setProperty("--hero-h", `${h}px`);
      const stick = Math.min(0, window.innerHeight - h);
      host.style.setProperty("--hero-stick", `${stick}px`);
      const title = titleRef.current;
      if (title) {
        const centre = title.offsetTop + title.offsetHeight / 2 + stick;
        titleDrop.set(window.innerHeight * 0.32 - centre);
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      window.removeEventListener("pointermove", onMove);
    };
  }, [titleDrop]);

  return (
    <section id={id} ref={wrapper} aria-labelledby="hero-title" className="hero-cine">
      <div ref={stage} className="hero-cine__stage">
        <motion.div aria-hidden className="hero-cine__athens rm-final" style={reduced ? undefined : { y: athensY }} />
        <div aria-hidden className="hero-cine__glow" />

        {bar}

        <motion.div
          ref={titleRef}
          className="hero-cine__title rm-final"
          style={
            reduced
              ? undefined
              : desktop
                ? { y: titleCentre, scale: titleGrow }
                : { y: phoneTitleY }
          }
        >
          <h1 id="hero-title">
            {/* eslint-disable-next-line @next/next/no-img-element -- the worn print texture is the point */}
            <img src={title} alt={titleAlt} width={1644} height={546} fetchPriority="high" />
          </h1>
        </motion.div>

        <motion.div className="hero-cine__art" style={reduced ? undefined : { opacity: desktop ? artOpacity : phoneArtOpacity }}>
          <HeroDepth image={art} depth={depth} alt={artAlt} progress={p} />
          {words.map((word, i) => (
            <Word key={word} text={word} index={i} p={p} reduced={reduced} />
          ))}
        </motion.div>

        <div className="hero-cine__panel">
          <div className="hero-cine__copy">
            <motion.div
              className="rm-final"
              style={reduced ? undefined : desktop ? { y: panelY, opacity: panelOpacity } : { y: copyY, opacity: copyOpacity }}
            >
              {copy}
            </motion.div>
          </div>

          <div className="hero-cine__side">
            <motion.div
              className="rm-final"
              style={
                (reduced
                  ? undefined
                  : desktop
                    ? { y: panelY, opacity: panelOpacity }
                    : { "--facts-opacity": factsOpacity }) as never
              }
            >
              {side}
            </motion.div>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="hero-cine__moon rm-final"
          style={reduced ? undefined : { y: moonY, scale: moonScale }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={moon} alt="" />
        </motion.div>

        <motion.p
          aria-hidden
          className="hero-cine__scroll rm-hide"
          style={reduced ? undefined : { opacity: noteOpacity }}
        >
          {scrollNote}
        </motion.p>

        <motion.div
          aria-hidden
          className="rm-hide pointer-events-none absolute inset-0 z-[4] bg-[var(--ground)]"
          style={{ opacity: reduced ? 0 : veil }}
        />
      </div>
    </section>
  );
}
