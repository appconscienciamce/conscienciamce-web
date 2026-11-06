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
/** The board is laid out ahead once the browser is idle, or after this long at the latest. */
const WARM_TIMEOUT_MS = 2500;

/** Starts following the scroll of the window. Returns what stops it. */
export function startCanvas() {
  const win = appWindow();
  if (!win) return () => {};
  const frames = Array.from(win.querySelectorAll<HTMLElement>("[data-station]"));
  const title = win.querySelector(".app-bar-title");
  const progress = win.querySelector<HTMLElement>(".app-bar-progress");
  const arrival = frames.map(() => "");
  const animate = motion();
  let reading: HTMLElement | null = null;
  let frame = 0;

  const paint = () => {
    frame = 0;
    const { scrollTop, clientHeight, scrollHeight } = win;
    if (!clientHeight) return;
    const range = scrollHeight - clientHeight;
    if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollTop / range) : 0})`;

    let chapter = frames[0];
    frames.forEach((el, i) => {
      // The layout position: what the arrival itself moves must not feed back into it.
      const top = el.offsetTop - scrollTop;
      if (top <= clientHeight * READING_LINE) chapter = el;
      if (!animate) return;
      const value = Math.min(1, Math.max(0, (clientHeight - top) / (clientHeight * ARRIVAL))).toFixed(3);
      if (value === arrival[i]) return;
      arrival[i] = value;
      el.style.setProperty("--in", value);
    });
    if (scrollTop >= range - END_PX) chapter = frames[frames.length - 1];

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
  // A window already laid out keeps its size when it opens: it is painted all the same.
  const opened = new MutationObserver(schedule);
  opened.observe(win, { attributes: true, attributeFilter: ["data-app-open"] });

  // The whole board is long: laying it out the moment it opens stalls the first frames of the
  // gesture. Once the home screen is up and the browser is idle, it is laid out out of sight.
  const warm = () => {
    win.setAttribute("data-warm", "layout");
    void win.scrollHeight;
    // Laid out: from now on it is skipped, and its layout kept for when it opens.
    win.setAttribute("data-warm", "");
  };
  // Safari has no idle callback: it simply waits.
  const hasIdle = typeof window.requestIdleCallback === "function";
  const idle = hasIdle ? window.requestIdleCallback(warm, { timeout: WARM_TIMEOUT_MS }) : window.setTimeout(warm, WARM_TIMEOUT_MS);

  return () => {
    signal.abort();
    resize.disconnect();
    opened.disconnect();
    cancelAnimationFrame(frame);
    if (hasIdle) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
    win.removeAttribute("data-warm");
  };
}
