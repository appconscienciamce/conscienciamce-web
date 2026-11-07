import { appWindow, followChapter, motion } from "@/lib/phone-os";

/**
 * Everything that depends on where the reader is on the board: the title and the
 * progress of the window, and each frame arriving as it comes up from below.
 * The frames follow the scroll itself, not a timer, so they stop when the finger stops.
 */

/** Share of the window a frame climbs while it arrives. */
const ARRIVAL = 0.42;
/** A chapter is the one being read once its top passes this share of the window. */
const READING_LINE = 0.4;
/** Pixels short of the end that still count as the end. */
const END_PX = 2;

/** Starts following the scroll of the window. Returns what stops it. */
export function startCanvas() {
  const win = appWindow();
  if (!win) return () => {};
  const frames = Array.from(win.querySelectorAll<HTMLElement>("[data-station]"));
  const title = win.querySelector(".app-bar-title");
  const progress = win.querySelector<HTMLElement>(".app-bar-progress");
  const arrival = frames.map(() => "");
  // The current page draws its own arrival per piece (phone-reveal): writing --in on every frame
  // would only make the browser restyle each whole chapter while the finger scrolls.
  const animate = motion() && !win.closest(".v-current");
  let reading: HTMLElement | null = null;
  let frame = 0;

  const paint = () => {
    frame = 0;
    const { scrollTop, clientHeight, scrollHeight } = win;
    if (!clientHeight) return;
    const range = scrollHeight - clientHeight;
    if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollTop / range) : 0})`;

    // The chapters may be reordered on screen: the one read is the lowest that already passed the line.
    let chapter = frames.reduce((first, el) => (el.offsetTop < first.offsetTop ? el : first), frames[0]);
    let passed = -Infinity;
    frames.forEach((el, i) => {
      // The layout position: what the arrival itself moves must not feed back into it.
      const top = el.offsetTop - scrollTop;
      if (top <= clientHeight * READING_LINE && el.offsetTop > passed) {
        passed = el.offsetTop;
        chapter = el;
      }
      if (!animate) return;
      const value = Math.min(1, Math.max(0, (clientHeight - top) / (clientHeight * ARRIVAL))).toFixed(3);
      if (value === arrival[i]) return;
      arrival[i] = value;
      el.style.setProperty("--in", value);
    });
    if (scrollTop >= range - END_PX) chapter = frames.reduce((last, el) => (el.offsetTop > last.offsetTop ? el : last), frames[0]);

    if (chapter !== reading) {
      reading = chapter;
      if (title) title.textContent = chapter.dataset.label ?? "";
      followChapter(chapter.id);
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  const signal = new AbortController();
  win.addEventListener("scroll", schedule, { passive: true, signal: signal.signal });
  // Opening the window is a resize too: from nothing to the whole screen.
  const resize = new ResizeObserver(schedule);
  resize.observe(win);

  return () => {
    signal.abort();
    resize.disconnect();
    cancelAnimationFrame(frame);
  };
}
