"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

type Shard = {
  bitmap: HTMLCanvasElement;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  dist: number;
  seedA: number;
  seedB: number;
  seedC: number;
};
type Edge = [number, number, number, number, number];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cuts the picture into jittered triangles and pre-renders each into its own bitmap. */
function fracture(img: HTMLImageElement, w: number, h: number) {
  const rand = mulberry(7);
  const cols = w < 700 ? 6 : 11;
  const rows = w < 700 ? 9 : 7;
  const impact = { x: w * 0.5, y: h * 0.42 };
  const maxDist = Math.hypot(w * 0.55, h * 0.62);

  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  const base = document.createElement("canvas");
  base.width = w;
  base.height = h;
  const bctx = base.getContext("2d")!;
  bctx.fillStyle = "#181714";
  bctx.fillRect(0, 0, w, h);
  bctx.drawImage(img, dx, dy, dw, dh);

  const pts: [number, number][][] = [];
  for (let r = 0; r <= rows; r++) {
    pts[r] = [];
    for (let c = 0; c <= cols; c++) {
      const edgeX = c === 0 || c === cols;
      const edgeY = r === 0 || r === rows;
      pts[r][c] = [
        (c / cols) * w + (edgeX ? 0 : (rand() - 0.5) * (w / cols) * 0.72),
        (r / rows) * h + (edgeY ? 0 : (rand() - 0.5) * (h / rows) * 0.72),
      ];
    }
  }

  const shards: Shard[] = [];
  const edges: Edge[] = [];
  const pushTri = (a: number[], b: number[], c: number[]) => {
    const minX = Math.floor(Math.min(a[0], b[0], c[0])) - 1;
    const minY = Math.floor(Math.min(a[1], b[1], c[1])) - 1;
    const maxX = Math.ceil(Math.max(a[0], b[0], c[0])) + 1;
    const maxY = Math.ceil(Math.max(a[1], b[1], c[1])) + 1;
    const sw = maxX - minX;
    const sh = maxY - minY;
    const bitmap = document.createElement("canvas");
    bitmap.width = sw;
    bitmap.height = sh;
    const ctx = bitmap.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(a[0] - minX, a[1] - minY);
    ctx.lineTo(b[0] - minX, b[1] - minY);
    ctx.lineTo(c[0] - minX, c[1] - minY);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.drawImage(base, -minX, -minY);
    ctx.restore();
    ctx.strokeStyle = "rgba(12,9,5,0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const cx = (a[0] + b[0] + c[0]) / 3;
    const cy = (a[1] + b[1] + c[1]) / 3;
    shards.push({
      bitmap,
      x: minX,
      y: minY,
      w: sw,
      h: sh,
      cx,
      cy,
      dist: Math.hypot(cx - impact.x, cy - impact.y) / maxDist,
      seedA: rand(),
      seedB: rand(),
      seedC: rand(),
    });
    for (const [p, q] of [
      [a, b],
      [b, c],
      [c, a],
    ]) {
      edges.push([p[0], p[1], q[0], q[1], Math.hypot((p[0] + q[0]) / 2 - impact.x, (p[1] + q[1]) / 2 - impact.y) / maxDist]);
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = pts[r][c];
      const tr = pts[r][c + 1];
      const bl = pts[r + 1][c];
      const br = pts[r + 1][c + 1];
      if (rand() > 0.5) {
        pushTri(tl, tr, br);
        pushTri(tl, br, bl);
      } else {
        pushTri(tl, tr, bl);
        pushTri(tr, br, bl);
      }
    }
  }
  edges.sort((a, b) => a[4] - b[4]);
  return { base, shards, edges };
}

/**
 * Athens cracks from one point of impact and comes down in pieces, tied to the
 * scroll and fully reversible: it is a pure function of progress, not a timeline.
 * What it was hiding is a statement on an open sky.
 */
export function AthensCrumble({
  image,
  sky,
  skyAlt,
  rules,
  statement,
  counter,
  label,
}: {
  image: string;
  sky: string;
  skyAlt: string;
  rules: string;
  statement: string;
  counter: string;
  label: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const paint = useRef<(p: number) => void>(() => undefined);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  useMotionValueEvent(p, "change", (v) => paint.current(v));

  const rulesOpacity = useTransform(p, [0.2, 0.34], [1, 0]);
  const statementOpacity = useTransform(p, [0.66, 0.84], [0, 1]);
  const statementY = useTransform(p, [0.66, 0.86], [40, 0]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let scene: ReturnType<typeof fracture> | null = null;
    const img = new Image();
    let w = 0;
    let h = 0;
    let last = 0;

    const render = (progress: number) => {
      last = progress;
      if (!scene) return;
      ctx.clearRect(0, 0, w, h);
      const crack = clamp01(progress / 0.3);

      if (progress < 0.3) {
        const shake = crack > 0.7 ? (crack - 0.7) * 5 : 0;
        ctx.drawImage(scene.base, Math.sin(progress * 400) * shake, Math.cos(progress * 520) * shake);
        const count = Math.floor(crack * crack * scene.edges.length);
        ctx.lineCap = "round";
        for (let i = 0; i < count; i++) {
          const [x0, y0, x1, y1] = scene.edges[i];
          ctx.strokeStyle = "rgba(10,7,4,0.92)";
          ctx.lineWidth = i < 40 ? 2.2 : 1.3;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          ctx.strokeStyle = "rgba(226,190,130,0.3)";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x0 + 1, y0 + 1);
          ctx.lineTo(x1 + 1, y1 + 1);
          ctx.stroke();
        }
        return;
      }

      for (const s of scene.shards) {
        const delay = 0.3 + s.dist * 0.34 + s.seedA * 0.07;
        const t = clamp01((progress - delay) / 0.26);
        if (t >= 1) continue;
        const fall = t * t * h * 1.2;
        const drift = (s.seedB - 0.5) * t * w * 0.22;
        const spin = (s.seedC - 0.5) * t * 2.6;
        ctx.save();
        ctx.globalAlpha = t < 0.72 ? 1 : 1 - (t - 0.72) / 0.28;
        ctx.translate(s.cx + drift, s.cy + fall);
        ctx.rotate(spin);
        ctx.drawImage(s.bitmap, s.x - s.cx, s.y - s.cy);
        ctx.restore();

        // Dust shaken loose as the piece goes.
        if (t > 0 && t < 0.7) {
          ctx.globalAlpha = (0.7 - t) * 0.8;
          ctx.fillStyle = "#d8c7a3";
          for (let i = 0; i < 3; i++) {
            const a = s.seedA * 6.28 + i * 2.1;
            ctx.fillRect(s.cx + Math.cos(a) * 26 * t + drift * 0.5, s.cy + fall * 0.82 + Math.sin(a) * 26 * t, 1.6, 1.6);
          }
          ctx.globalAlpha = 1;
        }
      }
    };

    const rebuild = () => {
      if (!img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      w = Math.round(cv.clientWidth * dpr);
      h = Math.round(cv.clientHeight * dpr);
      if (!w || !h) return;
      cv.width = w;
      cv.height = h;
      scene = fracture(img, w, h);
      render(last);
    };

    img.onload = rebuild;
    img.src = image;
    paint.current = render;

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(rebuild, 180);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(cv);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      paint.current = () => undefined;
    };
  }, [image]);

  return (
    <section ref={wrapper} aria-label={statement} className="pin-reveal surface-putty relative">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sky} alt={skyAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-[var(--ground)] opacity-75" />

        <motion.div
          className="rm-final relative mx-auto max-w-[64rem] px-[var(--gutter)] text-center"
          style={reduced ? undefined : { opacity: statementOpacity, y: statementY }}
        >
          <p className="display text-[clamp(2.5rem,6.4vw,6.25rem)] leading-[1]">{statement}</p>
          <p className="display mx-auto mt-6 max-w-[34ch] text-[clamp(1.4rem,2.4vw,2.125rem)] italic leading-[1.2] text-[var(--gold)]">
            {counter}
          </p>
          <p className="mt-6 text-[0.75rem] text-[var(--muted)]">{label}</p>
        </motion.div>

        <canvas ref={canvas} aria-hidden className="rm-hide absolute inset-0 h-full w-full" />

        <motion.p
          className="rm-hide display absolute inset-x-0 top-[12%] px-[var(--gutter)] text-center text-[clamp(2.25rem,6vw,5.5rem)] italic text-[var(--ink)]"
          style={{ opacity: rulesOpacity, textShadow: "0 0 24px rgba(236,226,205,0.8)" }}
        >
          {rules}
        </motion.p>
      </div>
    </section>
  );
}
