import { appWindow, motion } from "@/lib/phone-os";

/**
 * Each piece of a chapter comes in on its own as it reaches the screen: it rises a
 * little and settles, and its photos ease out of a slight zoom. Pieces arriving
 * together follow one another instead of popping in at once.
 * Once in, a piece stays: scrolling back up never makes the page put itself together twice.
 * Without JavaScript, or for those who asked for less motion, nothing is ever hidden.
 */

const PIECES = ".ed-r";
/** A piece starts in once its top is this far up from the bottom of the screen. */
const LINE = "0px 0px -10% 0px";
/** Between pieces arriving together, and the most any one of them waits. */
const STAGGER_S = 0.09;
const MAX_DELAY_S = 0.36;

/** Starts revealing the pieces of the board as they come into view. Returns what stops it. */
export function startReveal() {
  const win = appWindow();
  if (!win || !motion()) return () => {};
  const pieces = Array.from(win.querySelectorAll<HTMLElement>(PIECES));
  win.setAttribute("data-reveal", "");

  const seen = new IntersectionObserver(
    (entries) => {
      // Top to bottom, in the order they are read.
      const arriving = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      arriving.forEach((entry, i) => {
        const piece = entry.target as HTMLElement;
        piece.style.setProperty("--reveal-delay", `${Math.min(MAX_DELAY_S, i * STAGGER_S)}s`);
        piece.setAttribute("data-in", "");
        seen.unobserve(piece);
      });
    },
    { rootMargin: LINE },
  );
  pieces.forEach((piece) => seen.observe(piece));

  return () => {
    seen.disconnect();
    win.removeAttribute("data-reveal");
    pieces.forEach((piece) => {
      piece.removeAttribute("data-in");
      piece.style.removeProperty("--reveal-delay");
    });
  };
}
