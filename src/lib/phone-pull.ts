import { historyGuard } from "@/lib/board/history-guard";
import { closeApp, currentApp, HOME, isPhoneOs, motion, openApp } from "@/lib/phone-os";

/**
 * The phone reading as one continuous walk. Scrolling past the end of a chapter
 * keeps going: the next one comes up attached to the finger, and the one being
 * left falls behind it. Scrolling up from the top does the same in reverse.
 * Chapters stay apps, so the history and the back gesture work as usual.
 */

/** Finger travel, as a share of the screen, that brings a chapter all the way in. */
const TRAVEL = 0.62;
/** Released past this point, it goes through. Short of it, it goes back. */
const COMMIT_AT = 0.36;
/** A flick goes through wherever it is released, in px/ms. */
const FLICK_SPEED = 0.45;
const SETTLE_MS = 420;
/** Pixels before a touch counts as having a direction. */
const LOCK_PX = 2;
/** A home screen a few pixels too tall for the browser must not lose the gesture. */
const HOME_SLACK_PX = 40;
/** Length of the paused animations: the finger moves their clock. */
const TIMELINE = 1000;
/** Controls that own their gestures. */
const IGNORE = ".sys-bar,.flow-bar,.app-bar,dialog,input,textarea,select,iframe";

const FRONT: Keyframe[] = [
  { transform: "translateY(100%) scale(0.97)", borderRadius: "28px 28px 0 0" },
  { transform: "none", borderRadius: "14px 14px 0 0" },
];
const BEHIND: Keyframe[] = [
  { transform: "none", opacity: 1, transformOrigin: "50% 28%" },
  { transform: "translateY(-5%) scale(0.88)", opacity: 0.25, transformOrigin: "50% 28%" },
];

interface Touch {
  x: number;
  y: number;
  time: number;
  speed: number;
  atTop: boolean;
  atEnd: boolean;
}

interface Pull {
  /** 1 walks forward, -1 back. */
  direction: 1 | -1;
  /** The chapter on the way in. Nothing means the home screen. */
  target: HTMLElement | null;
  /** The window that moves with the finger: the one on top, in both directions. */
  front: HTMLElement;
  animations: Animation[];
  progress: number;
  /** The finger is gone: it finishes by itself, once. */
  settling?: boolean;
}

let touch: Touch | null = null;
let pull: Pull | null = null;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const chapters = () => Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));

function paused(el: HTMLElement, keyframes: Keyframe[]) {
  const animation = el.animate(keyframes, { duration: TIMELINE, fill: "both" });
  animation.pause();
  return animation;
}

function setProgress(active: Pull, progress: number) {
  active.progress = progress;
  const time = (active.direction > 0 ? progress : 1 - progress) * TIMELINE;
  active.animations.forEach((animation) => (animation.currentTime = time));
}

function begin(direction: 1 | -1): Pull | null {
  const list = chapters();
  const app = currentApp();
  const index = app ? list.indexOf(app) : 0;
  const home = Array.from(document.querySelectorAll<HTMLElement>(HOME));

  if (direction > 0) {
    const target = list[index + 1];
    if (!target) return null;
    target.setAttribute("data-app-open", "");
    target.style.zIndex = "39";
    target.scrollTop = 0;
    const behind = app ? [app] : home;
    return { direction, target, front: target, progress: 0, animations: [paused(target, FRONT), ...behind.map((el) => paused(el, BEHIND))] };
  }

  if (!app) return null;
  const target = index > 1 ? list[index - 1] : null;
  if (target) {
    target.setAttribute("data-app-open", "");
    target.scrollTop = target.scrollHeight;
  }
  app.style.zIndex = "39";
  const behind = target ? [target] : home;
  return { direction, target, front: app, progress: 0, animations: [paused(app, FRONT), ...behind.map((el) => paused(el, BEHIND))] };
}

function finish(active: Pull, commit: boolean) {
  const { direction, target, front, animations } = active;
  pull = null;
  front.style.zIndex = "";
  if (!commit) {
    animations.forEach((animation) => animation.cancel());
    target?.removeAttribute("data-app-open");
    return;
  }
  if (target) {
    openApp(target.id, { instant: true, atEnd: direction < 0 });
    animations.forEach((animation) => animation.cancel());
    return;
  }
  // The window is already out of sight, and the history takes a moment to answer.
  front.style.visibility = "hidden";
  animations.forEach((animation) => animation.cancel());
  closeApp({ instant: true });
}

/** From where the finger left it to the end, or back to the start. */
function settle(active: Pull, commit: boolean) {
  if (active.settling) return;
  active.settling = true;
  const from = active.progress;
  const to = commit ? 1 : 0;
  const duration = Math.max(160, SETTLE_MS * Math.abs(to - from));
  const start = performance.now();
  const step = (now: number) => {
    if (pull !== active) return;
    const t = clamp((now - start) / duration, 0, 1);
    setProgress(active, from + (to - from) * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(step);
    else finish(active, commit);
  };
  requestAnimationFrame(step);
}

function onTouchStart(e: TouchEvent) {
  touch = null;
  if (pull || e.touches.length !== 1 || !isPhoneOs() || historyGuard.video || !motion()) return;
  if ((e.target as Element).closest?.(IGNORE)) return;
  const app = currentApp();
  if (app?.getAnimations().length) return;
  const scroller = app ?? document.querySelector<HTMLElement>(".stage");
  if (!scroller) return;
  const point = e.touches[0];
  touch = {
    x: point.clientX,
    y: point.clientY,
    time: e.timeStamp,
    speed: 0,
    atTop: scroller.scrollTop <= 0,
    atEnd: scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - (app ? 2 : HOME_SLACK_PX),
  };
}

function onTouchMove(e: TouchEvent) {
  if (!touch) return;
  if (e.touches.length !== 1) {
    touch = null;
    if (pull) settle(pull, false);
    return;
  }
  const point = e.touches[0];

  if (!pull) {
    const dx = point.clientX - touch.x;
    const dy = point.clientY - touch.y;
    if (Math.hypot(dx, dy) < LOCK_PX) return;
    const direction = dy < 0 ? 1 : -1;
    const atEdge = direction > 0 ? touch.atEnd : touch.atTop;
    // Sideways belongs to the carousels, and inside a chapter the page scrolls by itself.
    if (Math.abs(dx) > Math.abs(dy) || !atEdge || !e.cancelable) {
      touch = null;
      return;
    }
    pull = begin(direction);
    if (!pull) {
      touch = null;
      return;
    }
    touch.y = point.clientY;
    touch.time = e.timeStamp;
    touch.x = point.clientY;
  }

  e.preventDefault();
  const elapsed = Math.max(8, e.timeStamp - touch.time);
  touch.speed = touch.speed * 0.4 + ((touch.x - point.clientY) / elapsed) * 0.6;
  touch.x = point.clientY;
  touch.time = e.timeStamp;
  const travelled = (touch.y - point.clientY) * pull.direction;
  setProgress(pull, clamp(travelled / (window.innerHeight * TRAVEL), 0, 1));
}

function onTouchEnd(e: TouchEvent) {
  const active = pull;
  const speed = touch?.speed ?? 0;
  const recent = touch ? e.timeStamp - touch.time < 120 : false;
  touch = null;
  if (!active) return;
  const flick = recent ? speed * active.direction : 0;
  const commit = e.type === "touchend" && flick > -FLICK_SPEED && (active.progress > COMMIT_AT || flick > FLICK_SPEED);
  settle(active, commit);
}

/** The back gesture, or leaving the page, wins over anything still under the finger. */
function abandon() {
  touch = null;
  if (pull) finish(pull, false);
}

function onVisibility() {
  if (document.hidden) abandon();
}

/** Starts listening to the finger. Returns what stops it. */
export function startPull() {
  const signal = new AbortController();
  const options = { signal: signal.signal };
  document.addEventListener("touchstart", onTouchStart, { ...options, passive: true });
  document.addEventListener("touchmove", onTouchMove, { ...options, passive: false });
  document.addEventListener("touchend", onTouchEnd, options);
  document.addEventListener("touchcancel", onTouchEnd, options);
  window.addEventListener("popstate", abandon, options);
  document.addEventListener("visibilitychange", onVisibility, options);
  return () => signal.abort();
}
