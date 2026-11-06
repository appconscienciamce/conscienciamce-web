import { appWindow, motion } from "@/lib/phone-os";

/**
 * Each piece of the page is tied to the scroll: it comes in as the finger moves it up
 * and goes back the same way, like a scrubbed timeline. Nothing runs on its own clock.
 * Without JavaScript, or for those who asked for less motion, nothing is ever hidden.
 */

const PIECES = ".ed-r,.ph-keep,.ed-fit li,.ed-nofit li";
/** The bar with the buy button covers this much of the bottom of the window. */
const BAR_PX = 84;
/** How far a piece travels up the screen while it arrives, as a part of the window. */
const TRAVEL = 0.2;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Starts tying the pieces of the page to the scroll. Returns what stops it. */
export function startReveal() {
  const win = appWindow();
  if (!win || !motion()) return () => {};
  const pieces = Array.from(win.querySelectorAll<HTMLElement>(PIECES));
  const painted = new Map<HTMLElement, number>();
  win.setAttribute("data-reveal", "");
  pieces.forEach((piece) => piece.setAttribute("data-scrub", ""));

  let frame = 0;
  const paint = () => {
    frame = 0;
    const box = win.getBoundingClientRect();
    if (!box.height) return;
    const line = box.bottom - BAR_PX;
    const span = box.height * TRAVEL;
    // The last pieces may never climb that far: the end of the page shows them all.
    const atEnd = win.scrollTop + win.clientHeight >= win.scrollHeight - 2;
    const tops = pieces.map((piece) => piece.getBoundingClientRect().top);
    pieces.forEach((piece, i) => {
      const progress = atEnd ? 1 : clamp((line - tops[i]) / span);
      if (Math.abs((painted.get(piece) ?? -1) - progress) < 0.004) return;
      painted.set(piece, progress);
      piece.style.setProperty("--p", progress.toFixed(3));
      if (progress > 0.97) piece.setAttribute("data-in", "");
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  win.addEventListener("scroll", schedule, { passive: true });
  // Opening the window is a resize too: from nothing to the whole screen.
  const resize = new ResizeObserver(schedule);
  resize.observe(win);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    win.removeEventListener("scroll", schedule);
    resize.disconnect();
    win.removeAttribute("data-reveal");
    pieces.forEach((piece) => {
      piece.removeAttribute("data-scrub");
      piece.removeAttribute("data-in");
      piece.style.removeProperty("--p");
    });
  };
}
