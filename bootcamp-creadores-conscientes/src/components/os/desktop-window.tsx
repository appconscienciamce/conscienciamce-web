"use client";

import { useRef, useState } from "react";
import { CloseGlyph } from "./glyphs";
import { MacFolder } from "./mac-folder";

let topLayer = 10;

const STEP = 24;
const DRAG_THRESHOLD = 4;

/**
 * Everything on the desktop moves as a whole, from anywhere on the item, stays
 * inside the desktop and comes to the front when touched. Arrow keys move it too.
 */
function useDesktopDrag<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const offset = useRef({ x: 0, y: 0 });
  const dragged = useRef(false);

  const moveTo = (x: number, y: number) => {
    const el = ref.current;
    const area = el?.closest(".desktop");
    if (!el || !area) return;
    const box = el.getBoundingClientRect();
    const bounds = area.getBoundingClientRect();
    const originX = box.left - offset.current.x;
    const originY = box.top - offset.current.y;
    const nextX = Math.min(bounds.right - box.width - originX, Math.max(bounds.left - originX, x));
    const nextY = Math.min(bounds.bottom - box.height - originY, Math.max(bounds.top - originY, y));
    offset.current = { x: nextX, y: nextY };
    el.style.setProperty("--wx", `${nextX}px`);
    el.style.setProperty("--wy", `${nextY}px`);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    el.style.zIndex = String(++topLayer);
    dragged.current = false;
    const start = { x: e.clientX, y: e.clientY, ox: offset.current.x, oy: offset.current.y };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!dragged.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragged.current = true;
      el.dataset.dragging = "true";
      moveTo(start.ox + dx, start.oy + dy);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      delete el.dataset.dragging;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  /** A drag that ends on a link must not follow it. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (!dragged.current) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const { x, y } = offset.current;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [x - STEP, y],
      ArrowRight: [x + STEP, y],
      ArrowUp: [x, y - STEP],
      ArrowDown: [x, y + STEP],
    };
    if (!moves[e.key]) return;
    e.preventDefault();
    moveTo(...moves[e.key]);
  };

  return { ref, onPointerDown, onClickCapture, onKeyDown };
}

export function DesktopWindow({
  title,
  closeLabel,
  className = "",
  style,
  children,
}: {
  title: string;
  closeLabel: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const drag = useDesktopDrag<HTMLElement>();
  const [state, setState] = useState<"open" | "closing" | "closed">("open");

  if (state === "closed") return null;

  return (
    <section
      {...drag}
      aria-label={title}
      tabIndex={0}
      className={`dwin ${className}`}
      style={style}
      data-closing={state === "closing" || undefined}
      onAnimationEnd={(e) => {
        if (e.animationName !== "dwin-out") return;
        // The close button is about to go: keep the keyboard on the desktop.
        if (e.currentTarget.contains(document.activeElement)) document.querySelector<HTMLElement>(".desk-folder")?.focus({ preventScroll: true });
        setState("closed");
      }}
    >
      <div className="dwin-bar">
        <span className="traffic is-small">
          <button type="button" className="tl tl-close" aria-label={`${closeLabel}: ${title}`} onClick={() => setState("closing")}>
            <CloseGlyph />
          </button>
          <span aria-hidden className="tl tl-off" />
          <span aria-hidden className="tl tl-off" />
        </span>
        <span className="dwin-title">{title}</span>
      </div>
      <div className="dwin-body">{children}</div>
    </section>
  );
}

/** Folder that opens a chapter on click and moves around the desktop on drag. */
export function DesktopFolder({ href, label }: { href: string; label: string }) {
  const drag = useDesktopDrag<HTMLAnchorElement>();
  return (
    <a {...drag} href={href} className="desk-folder" draggable={false}>
      <MacFolder />
      <span className="desk-folder-label">{label}</span>
    </a>
  );
}

export function DesktopSticker({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const drag = useDesktopDrag<HTMLDivElement>();
  return (
    <div {...drag} className={`desk-sticker ${className}`}>
      {children}
    </div>
  );
}
