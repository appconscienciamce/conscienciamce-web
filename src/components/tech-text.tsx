"use client";

/**
 * Interactive wordmark. Adapted from TechText by React Bits (reactbits.dev),
 * Copyright (c) 2026 David Haz, MIT + Commons Clause. See THIRD_PARTY_NOTICES.md.
 *
 * Changes from the original: reduced to the letter reveal, pointer coordinates
 * corrected for the board's CSS scale, and left alignment flush with the text.
 */

import { useEffect, useRef } from "react";

const LABEL_FONT = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SPRING = 320;
const BOUNCE = 0.4;
const KICK_DECAY = 0.62;
const SPECKS = 15;
const DASH: [number, number] = [4, 2];
const STROKE = 1.2;
/** On touch nobody hovers: it shows what it does, then stops spending battery. */
const TOUCH_SWEEP_SECONDS = 5;
/** After the first touch, the wait before the letters are drawn: past the start of a gesture. */
const FIRST_TOUCH_DELAY_MS = 600;

interface Art {
  image: HTMLCanvasElement;
  left: number;
  top: number;
}

interface Glyph {
  char: string;
  box: { x1: number; y1: number; x2: number; y2: number };
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  fill: Art;
  dashes: Art;
}

interface Word {
  size: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const noise = (...values: number[]) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0");

export function TechText({
  text,
  fontSize = 48,
  fontWeight = 400,
  letterSpacing = -0.01,
  className = "",
}: {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;
    const stage = canvas;
    const paint = ctx;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    let inkColor = "";
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let alive = true;
    let layoutKey = "";
    let word: Word | null = null;
    let glyphs: Glyph[] = [];
    let clock = 0;
    let pulse = 0;
    let placed = false;
    let dragging = -1;
    let cursor = "";
    const kicks: { index: number; at: number; velocity: number }[] = [];
    const press = { x: 0, y: 0, time: 0, index: -1 };
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const measure = document.createElement("canvas").getContext("2d")!;

    // On the phone a window can sit over the hero, or be on its way: the hero is still on
    // screen to an observer, but nobody sees it. Drawing then only takes frames from the window.
    const root = document.documentElement;
    const covered = () => root.hasAttribute("data-app") || root.hasAttribute("data-pulling");
    const uncovered = new MutationObserver(() => wake());
    uncovered.observe(root, { attributes: true, attributeFilter: ["data-app", "data-pulling"] });

    const setFont = (target: CanvasRenderingContext2D, size: number) => {
      const family = getComputedStyle(container).fontFamily || "serif";
      target.font = `${fontWeight} ${size}px ${family}`;
      if ("letterSpacing" in target) target.letterSpacing = `${letterSpacing * size}px`;
      target.textAlign = "left";
      target.textBaseline = "alphabetic";
    };

    const sprite = (char: string, x: number, baseline: number, box: Glyph["box"], size: number, stroke: boolean, ink: string): Art => {
      const pad = Math.ceil(STROKE * 2 + 4);
      const left = box.x1 - pad;
      const top = box.y1 - pad;
      const image = document.createElement("canvas");
      image.width = Math.max(1, Math.ceil((box.x2 - box.x1 + pad * 2) * dpr));
      image.height = Math.max(1, Math.ceil((box.y2 - box.y1 + pad * 2) * dpr));
      const c = image.getContext("2d");
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, size);
      if (stroke) {
        c.lineJoin = "round";
        c.lineWidth = STROKE * 2;
        c.strokeStyle = ink;
        c.setLineDash(DASH);
        c.strokeText(char, x, baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = "destination-out";
        c.fillStyle = "#000000";
        c.fillText(char, x, baseline);
        c.globalCompositeOperation = "source-over";
      } else {
        c.fillStyle = ink;
        c.fillText(char, x, baseline);
      }
      return { image, left, top };
    };

    const ensureLayout = (ink: string) => {
      const key = [text, ink, width, height, dpr].join("|");
      if (key === layoutKey && word) return word;
      layoutKey = key;

      setFont(measure, fontSize);
      let m = measure.measureText(text);
      const fit = Math.min(
        1,
        width / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1),
      );
      const size = fontSize * fit;
      setFont(measure, size);
      m = measure.measureText(text);
      const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const x = m.actualBoundingBoxLeft;
      const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
      const next: Word = {
        size,
        left: 0,
        right: x + m.actualBoundingBoxRight,
        top: baseline - m.actualBoundingBoxAscent,
        bottom: baseline + m.actualBoundingBoxDescent,
      };
      word = next;

      const previous = glyphs;
      glyphs = [];
      let prefix = "";
      for (const char of Array.from(text)) {
        prefix += char;
        const own = measure.measureText(char);
        const gx = x + measure.measureText(prefix).width - own.width;
        if (!char.trim()) continue;
        const box = {
          x1: gx - own.actualBoundingBoxLeft,
          y1: baseline - own.actualBoundingBoxAscent,
          x2: gx + own.actualBoundingBoxRight,
          y2: baseline + own.actualBoundingBoxDescent,
        };
        const kept = previous[glyphs.length];
        glyphs.push({
          char,
          box,
          offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          outline: 0,
          fill: sprite(char, gx, baseline, box, size, false, ink),
          dashes: sprite(char, gx, baseline, box, size, true, ink),
        });
      }
      dragging = -1;
      frame.index = -1;
      return next;
    };

    const glyphAt = (x: number, y: number) => {
      if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, i) => {
        const x1 = glyph.box.x1 + glyph.offset.x;
        const x2 = glyph.box.x2 + glyph.offset.x;
        const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    };

    const blit = (art: Art, dx: number, dy: number) => {
      paint.drawImage(art.image, Math.round((art.left + dx) * dpr), Math.round((art.top + dy) * dpr));
    };

    const crisp = (value: number) => (Math.round(value * dpr) + 0.5) / dpr;

    const perimeterPoint = (distance: number, w: number, h: number): [number, number, number, number] => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (a: number, ink: string) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      const grid = 3;
      paint.fillStyle = ink;
      paint.strokeStyle = ink;
      for (let k = 0; k < SPECKS; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.5 ? 2 : pick < 0.8 ? 3 : 5;
        const out = 4 + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
        const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        paint.globalAlpha = a * (0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - size / 2);
        const top = Math.round(y - size / 2);
        if (tone < 0.26) paint.strokeRect(left + 0.5, top + 0.5, size, size);
        else paint.fillRect(left, top, size, size);
      }
      paint.globalAlpha = 1;
    };

    const drawFrame = (ink: string) => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);
      paint.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint.fillStyle = ink;
      paint.strokeStyle = ink;
      paint.lineWidth = 1;

      paint.beginPath();
      paint.rect(x1, y1, x2 - x1, y2 - y1);
      paint.globalAlpha = 0.5 * a;
      paint.stroke();

      paint.beginPath();
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
      ]) {
        paint.rect(Math.round(cx) - 2, Math.round(cy) - 2, 4, 4);
      }
      paint.globalAlpha = 0.95 * a;
      paint.fill();

      drawSpecks(a, ink);

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      paint.font = LABEL_FONT;
      paint.textAlign = "left";
      paint.textBaseline = "bottom";
      paint.fillStyle = ink;
      paint.globalAlpha = 0.62 * a;
      const label =
        moved > 1
          ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
          : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
      paint.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 5);
      paint.globalAlpha = 1;
      paint.setTransform(1, 0, 0, 1, 0, 0);
    };

    const kick = (index: number) => {
      const strength = (word ? word.size : 40) * 11;
      kicks.push({ index, at: pulse, velocity: strength });
      for (let d = 1; d < glyphs.length; d++) {
        const velocity = strength * Math.pow(KICK_DECAY, d);
        if (velocity < 30) break;
        for (const j of [index - d, index + d]) {
          if (j >= 0 && j < glyphs.length) kicks.push({ index: j, at: pulse + d * 0.055, velocity });
        }
      }
      wake();
    };

    const tick = (now: number) => {
      raf = 0;
      if (covered()) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      // Reading computed styles on every frame forces the browser to recalculate them.
      inkColor ||= getComputedStyle(container).color || "#000000";
      const ink = inkColor;
      const view = ensureLayout(ink);
      const damping = 2 * Math.sqrt(SPRING) * (1 - BOUNCE * 0.96);

      const sweeping = !reducedMotion && !pointer.inside && dragging < 0 && !(touch && clock > TOUCH_SWEEP_SECONDS);
      if (sweeping) clock += dt;
      pulse += dt;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (sweeping) {
        targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      const active = pointer.inside || sweeping || dragging >= 0;
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        const lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;

      for (let k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at > pulse) continue;
        const glyph = glyphs[kicks[k].index];
        if (glyph) glyph.velocity.y -= kicks[k].velocity;
        kicks.splice(k, 1);
      }

      let moving = false;
      glyphs.forEach((glyph, i) => {
        if (i === dragging) {
          glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
          glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
          glyph.velocity.x = 0;
          glyph.velocity.y = 0;
          moving = true;
          return;
        }
        const { offset, velocity } = glyph;
        if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      const focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0) {
        const glyph = glyphs[focus];
        const bx1 = glyph.box.x1 + glyph.offset.x - 4;
        const by1 = glyph.box.y1 + glyph.offset.y - 4;
        const bx2 = glyph.box.x2 + glyph.offset.x + 4;
        const by2 = glyph.box.y2 + glyph.offset.y + 4;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        const glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 ? 1 : 0, dt, 0.1);

      glyphs.forEach((glyph, i) => {
        const target = i === focus && i !== dragging ? 1 : 0;
        glyph.outline = approach(glyph.outline, target, dt, 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      const hovering = focus >= 0 && pointer.inside;
      const nextCursor = dragging >= 0 ? "grabbing" : hovering ? "grab" : "";
      if (nextCursor !== cursor) {
        cursor = nextCursor;
        container.style.cursor = nextCursor;
      }

      paint.setTransform(1, 0, 0, 1, 0, 0);
      paint.globalCompositeOperation = "source-over";
      paint.globalAlpha = 1;
      paint.clearRect(0, 0, stage.width, stage.height);
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          paint.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(glyph.dashes, 0, 0);
          paint.globalAlpha = 1;
        }
      }
      for (const glyph of glyphs) {
        if (glyph.outline < 0.999) {
          paint.globalAlpha = 1 - glyph.outline;
          blit(glyph.fill, glyph.offset.x, glyph.offset.y);
        }
        if (glyph.outline > 0.001) {
          paint.globalAlpha = glyph.outline;
          blit(glyph.dashes, glyph.offset.x, glyph.offset.y);
        }
        paint.globalAlpha = 1;
      }
      drawFrame(ink);
      // The plain line steps aside only once this one is drawn: never a blank in between.
      if (!container.dataset.ready) container.dataset.ready = "true";

      const settling = moving || kicks.length > 0 || (frame.alpha > 0.01 && frame.alpha < 0.99);
      if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
    };

    function wake() {
      if (raf || !visible || !alive || covered()) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      // The board can zoom past 100%: keep the sprites sharp.
      dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2);
      stage.width = Math.round(width * dpr);
      stage.height = Math.round(height * dpr);
      layoutKey = "";
      inkColor = "";
      wake();
    };

    /** The board scales the page with a CSS transform; layout pixels are what we draw in. */
    const locate = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const scale = rect.width / Math.max(1, container.clientWidth);
      pointer.x = (e.clientX - rect.left) / scale;
      pointer.y = (e.clientY - rect.top) / scale;
    };

    const onMove = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      wake();
    };

    const onLeave = () => {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    };

    const onDown = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      const primary = e.pointerType !== "mouse" || e.button === 0;
      const index = primary ? glyphAt(pointer.x, pointer.y) : -1;
      press.x = pointer.x;
      press.y = pointer.y;
      press.time = performance.now();
      press.index = index;
      if (index >= 0) {
        dragging = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        container.setPointerCapture?.(e.pointerId);
      }
      wake();
    };

    const onUp = (e: PointerEvent) => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(e.pointerId);
        const rect = container.getBoundingClientRect();
        pointer.inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
      if (e.type === "pointerup" && press.index >= 0 && !reducedMotion && performance.now() - press.time < 450) {
        const before = { x: press.x, y: press.y };
        locate(e);
        if (Math.hypot(pointer.x - before.x, pointer.y - before.y) < 6) kick(press.index);
      }
      press.index = -1;
      wake();
    };

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerenter", onMove, { passive: true });
    container.addEventListener("pointerdown", onDown, { passive: true });
    container.addEventListener("pointerup", onUp, { passive: true });
    container.addEventListener("pointercancel", onUp, { passive: true });
    container.addEventListener("pointerleave", onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });

    const refreshFonts = () => {
      layoutKey = "";
      wake();
    };
    void document.fonts.ready.then(refreshFonts, refreshFonts);

    const begin = () => {
      resizeObserver.observe(container);
      intersectionObserver.observe(container);
      resize();
    };
    // Drawing the letters is heavy for a phone: the real line waits for the first
    // sign of someone there. If that is a scroll past the hero, nothing gets drawn.
    // Not in that same moment, though: on the phone that first touch is often the one
    // opening the board, and the heaviest frame here would land on its first frame.
    let soon = 0;
    const beginOnce = () => {
      window.removeEventListener("scroll", beginOnce);
      window.removeEventListener("pointerdown", beginOnce);
      soon = window.setTimeout(begin, FIRST_TOUCH_DELAY_MS);
    };
    if (touch) {
      window.addEventListener("scroll", beginOnce, { passive: true });
      window.addEventListener("pointerdown", beginOnce, { passive: true });
    } else {
      begin();
    }

    return () => {
      alive = false;
      delete container.dataset.ready;
      window.removeEventListener("scroll", beginOnce);
      window.removeEventListener("pointerdown", beginOnce);
      window.clearTimeout(soon);
      uncovered.disconnect();
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.style.cursor = "";
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerenter", onMove);
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [text, fontSize, fontWeight, letterSpacing]);

  return (
    <div ref={containerRef} className={`tech-text ${className}`.trim()} aria-hidden data-nopan>
      <canvas ref={canvasRef} className="tech-text-canvas" />
      <span className="tech-text-fallback">{text}</span>
    </div>
  );
}
