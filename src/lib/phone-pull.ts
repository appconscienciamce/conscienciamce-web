import { historyGuard } from "@/lib/board/history-guard";
import { appWindow, closeApp, currentApp, isPhoneOs, motion, openApp } from "@/lib/phone-os";
import { glideBy, glideTarget, stopGlide } from "@/lib/phone-glide";

/**
 * The way in and out of the board, the same as on a computer: scrolling opens the
 * window. The hero window grows with the scroll until it is the whole screen, and
 * the board is inside it. The apps fall behind. Scrolling up from the top of the
 * board does the same in reverse. Inside it the page just scrolls.
 * A finger, a wheel and a trackpad all move it; a tap on the hint plays it whole.
 *
 * Nothing here starts or stops dead: the window rides a spring. Under the finger
 * it follows close behind; let go, it keeps the speed it had and lands softly.
 */

/** Scroll travel, as a share of the screen, that brings the window all the way in: a long, calm way. */
const TRAVEL = 0.9;
/** Released past this point, it goes through. Short of it, it goes back. */
const COMMIT_AT = 0.28;
/**
 * A wheel has no release: once it stops, this much is enough to go through. A notch is
 * anything from 4 to 120px depending on the device, so any scroll down is a way in.
 * The way out asks for more: a stray notch at the top of the board must not leave it.
 */
const WHEEL_COMMIT_IN = 0.03;
const WHEEL_COMMIT_OUT = 0.2;
/** Quiet time that ends a wheel gesture, and the gap that starts a new one. */
const WHEEL_IDLE_MS = 120;
const WHEEL_GAP_MS = 220;
/** A flick goes through wherever it is released, in px/ms. */
const FLICK_SPEED = 0.45;
/**
 * Stiffness of the spring that follows the scroll, in rad/s. It is critically damped:
 * no bounce. The window has weight: it follows the finger a breath behind, and the
 * wheel's notches further behind still, so they melt into one movement.
 */
const FOLLOW_FINGER = 11;
const FOLLOW_WHEEL = 5.5;
/**
 * Let go, it lands on a curve of fixed length instead: it leaves at the speed it had and
 * arrives at rest, with no long tail where the window looks done but is not open yet.
 * Longer the further it has to go. A tap plays it whole, from rest, slower still.
 */
const LAND_MIN_S = 0.75;
const LAND_PER_TRAVEL_S = 1;
const PLAY_S = 2;
/** The tap's start: a small push, so it answers at once and then gathers speed. */
const PLAY_PUSH = 0.35;
/** Pixels before a touch counts as having a direction. */
const LOCK_PX = 2;
/** A home screen a few pixels too tall for the browser must not lose the gesture. */
const HOME_SLACK_PX = 40;
/** Length of the paused animations: the spring moves their clock. */
const TIMELINE = 1000;
/** Controls that own their touches. */
const IGNORE = ".sys-bar,.flow-bar,.app-bar,dialog,input,textarea,select,iframe";
/** Things that do something with a wheel of their own. */
const WHEEL_IGNORE = "dialog,input,textarea,select,iframe";
const HERO = ".st-hero";
const DOCK = ".phone-home";

/**
 * The hero window gives its place to the board that grows out of it: it comes a little
 * towards the reader and fades, and is nearly gone before the board starts to show. Two
 * texts over each other read as a glitch, and a finger can hold the gesture right there.
 * Opacity and scale only: a blur here cost whole frames on phones without a strong GPU.
 */
const HERO_GONE = 0.16;
const HERO_OUT: Keyframe[] = [
  { offset: 0, opacity: 1, transform: "none" },
  { offset: HERO_GONE, opacity: 0, transform: "scale(1.05)" },
  { offset: 1, opacity: 0, transform: "scale(1.05)" },
];
/** The board starts to show as the hero is all but gone. */
const BOARD_SHOWS = 0.12;
/** The apps' card sinks and fades, and is gone before the window grows down over it. */
const DOCK_OUT: Keyframe[] = [
  { offset: 0, opacity: 1, transform: "none" },
  { offset: 0.3, opacity: 0, transform: "translateY(28px)" },
  { offset: 1, opacity: 0, transform: "translateY(28px)" },
];
/** Each app drops on its own, one after the other, in reading order. */
const ICON_STAGGER = 0.016;
const ICON_SPAN = 0.19;
function iconOut(i: number): Keyframe[] {
  const start = i * ICON_STAGGER;
  const gone = { opacity: 0, transform: "translateY(22px) scale(0.84)" };
  return [
    { offset: 0, opacity: 1, transform: "none" },
    ...(start > 0 ? [{ offset: start, opacity: 1, transform: "none" }] : []),
    { offset: start + ICON_SPAN, ...gone },
    { offset: 1, ...gone },
  ];
}
/** The buy bar belongs to the board: it leaves with it, not after it. */
const BAR_OUT: Keyframe[] = [
  { offset: 0, opacity: 0, transform: "translateY(24px)" },
  { offset: 0.6, opacity: 0, transform: "translateY(24px)" },
  { offset: 1, opacity: 1, transform: "none" },
];
/** Until here the home screen dissolves and the window only appears; from here it grows. */
const APPEAR = 0.32;
/** How much of its growth the window has made by then: less than the gap down to the apps. */
const APPEAR_GROWTH = 0.08;
/** The board inside settles up into place while its window opens. */
const SHEET_IN: Keyframe[] = [
  { offset: 0, transform: "translateY(40px)" },
  { offset: APPEAR, transform: "translateY(40px)" },
  { offset: 1, transform: "none" },
];
/** Without a hero to grow from, the window comes up from below. */
const RISE: Keyframe[] = [
  { transform: "translateY(100%) scale(0.97)", borderRadius: "28px 28px 0 0" },
  { transform: "none", borderRadius: "14px 14px 0 0" },
];

/**
 * The window starts as the hero: same place, same size, showing its own top.
 * A clip, not a scale: the board inside is never squashed on the way.
 */
function grow(win: HTMLElement, hero: HTMLElement | null): Keyframe[] {
  if (!hero) return RISE;
  const from = hero.getBoundingClientRect();
  const to = win.getBoundingClientRect();
  if (!from.height || !to.height) return RISE;
  const left = Math.max(0, from.left - to.left);
  const right = Math.max(0, to.right - from.right);
  const bottom = Math.max(0, to.height - from.height);
  const at = (share: number) => {
    const k = 1 - share;
    return {
      transform: `translateY(${(from.top - to.top) * k}px)`,
      clipPath: `inset(0px ${right * k}px ${bottom * k}px ${left * k}px round 16px)`,
    };
  };
  return [
    { offset: 0, opacity: 0, ...at(0) },
    { offset: BOARD_SHOWS, opacity: 0 },
    { offset: APPEAR, opacity: 1, ...at(APPEAR_GROWTH) },
    { offset: 1, opacity: 1, transform: "none", clipPath: "inset(0px 0px 0px 0px round 14px 14px 0px 0px)" },
  ];
}

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
  /** The window on the way in. Nothing means the home screen. */
  target: HTMLElement | null;
  /** The window that moves with the finger: the one on top, in both directions. */
  front: HTMLElement;
  animations: Animation[];
  /** Where it is on screen, and how fast it is going there, in progress per second. */
  progress: number;
  velocity: number;
  /** Where the spring pulls it, and how hard. */
  goal: number;
  stiffness: number;
  /** Let go: it finishes by itself once it lands, at 1 or at 0. */
  settling?: boolean;
  /** The landing: from where and how fast it was let go, to `goal`, in `duration` seconds. */
  landing?: { from: number; speed: number; duration: number; start: number };
  /** Moved by a wheel, not by a finger. */
  wheel?: boolean;
}

/** Where the scroller was when a wheel gesture began: momentum must not cross an edge it did not start at. */
interface Wheel {
  last: number;
  atTop: boolean;
  atEnd: boolean;
  timer: number;
}

let touch: Touch | null = null;
let pull: Pull | null = null;
let wheel: Wheel | null = null;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const chapters = () => Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));

function paused(el: HTMLElement, keyframes: Keyframe[]) {
  const animation = el.animate(keyframes, { duration: TIMELINE, fill: "both" });
  animation.pause();
  return animation;
}

function render(active: Pull, progress: number) {
  active.progress = progress;
  const time = (active.direction > 0 ? progress : 1 - progress) * TIMELINE;
  active.animations.forEach((animation) => (animation.currentTime = time));
}

/** One frame of a critically damped spring, in small steps so a stiff one stays steady. */
function spring(active: Pull, dt: number) {
  const { goal, stiffness: w } = active;
  let x = active.progress;
  let v = active.velocity;
  const steps = 4;
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    v += (w * w * (goal - x) - 2 * w * v) * h;
    x += v * h;
  }
  if (x <= 0 || x >= 1) {
    x = clamp(x, 0, 1);
    v = 0;
  }
  active.velocity = v;
  render(active, x);
}

/**
 * The landing: a cubic that leaves at the speed it was let go with and arrives at rest,
 * right on time. `s` runs from 0 to 1 over the landing.
 */
function land(from: number, to: number, speed: number, duration: number, s: number) {
  const s2 = s * s;
  const s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * from + (s3 - 2 * s2 + s) * speed * duration + (3 * s2 - 2 * s3) * to;
}

/** Runs every frame for as long as this pull is the one on screen: the spring, then the landing. */
function drive(active: Pull) {
  let last = performance.now();
  const frame = (now: number) => {
    if (pull !== active) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const { landing } = active;
    if (!landing) spring(active, dt);
    else {
      const s = Math.min(1, (now - landing.start) / 1000 / landing.duration);
      render(active, clamp(land(landing.from, active.goal, landing.speed, landing.duration, s), 0, 1));
      if (s >= 1) {
        finish(active, active.goal === 1);
        return;
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/** Lets go: from wherever it is and as fast as it is going, to the end or back to the start. */
function settle(active: Pull, commit: boolean, played = false) {
  if (active.settling) return;
  active.settling = true;
  active.goal = commit ? 1 : 0;
  const distance = Math.abs(active.goal - active.progress);
  const duration = played ? PLAY_S : LAND_MIN_S + LAND_PER_TRAVEL_S * distance;
  // A speed the wrong way would swing past the start: only the part that goes along counts.
  const along = (active.goal - active.progress) * active.velocity > 0 ? active.velocity : 0;
  // Past three times the distance over the time, the curve would overshoot the end and come back.
  const cap = (3 * distance) / duration;
  const speed = played ? PLAY_PUSH / duration : clamp(along, -cap, cap);
  active.landing = { from: active.progress, speed, duration, start: performance.now() };
}

function begin(direction: 1 | -1): Pull | null {
  const app = currentApp();
  const hero = document.querySelector<HTMLElement>(HERO);
  const dock = document.querySelector<HTMLElement>(DOCK);
  const icons = Array.from(document.querySelectorAll<HTMLElement>(`${DOCK} .phone-grid > li`));
  const sheet = appWindow()?.querySelector<HTMLElement>(".canvas-sheet") ?? null;
  // Only on screen on the way out: on the way in it appears once the board is open.
  const bar = direction < 0 ? document.querySelector<HTMLElement>(".flow-bar") : null;
  // Measured before anything moves: the window starts exactly where the hero is.
  const animate = (front: HTMLElement) => {
    const parts: [HTMLElement | null, Keyframe[]][] = [
      [front, grow(front, hero)],
      [sheet, SHEET_IN],
      [hero, HERO_OUT],
      [dock, DOCK_OUT],
      ...icons.map((icon, i): [HTMLElement, Keyframe[]] => [icon, iconOut(i)]),
      [bar, BAR_OUT],
    ];
    return parts.flatMap(([el, keys]) => (el ? [paused(el, keys)] : []));
  };
  const start = (front: HTMLElement, target: HTMLElement | null): Pull => {
    stopGlide();
    const active: Pull = { direction, target, front, progress: 0, velocity: 0, goal: 0, stiffness: FOLLOW_FINGER, animations: animate(front) };
    pull = active;
    // Whatever draws on the home screen rests while the window moves over it.
    document.documentElement.setAttribute("data-pulling", "");
    // Its first frame now, not on the next tick: on the way out, time 0 is the home screen.
    render(active, 0);
    drive(active);
    return active;
  };

  if (direction > 0) {
    const target = appWindow();
    if (app || !target) return null;
    target.setAttribute("data-app-open", "");
    target.style.zIndex = "39";
    target.scrollTop = 0;
    return start(target, target);
  }

  if (!app) return null;
  app.style.zIndex = "39";
  return start(app, null);
}

function finish(active: Pull, commit: boolean) {
  const { target, front, animations } = active;
  pull = null;
  document.documentElement.removeAttribute("data-pulling");
  front.style.zIndex = "";
  window.clearTimeout(wheel?.timer);
  if (!commit) {
    animations.forEach((animation) => animation.cancel());
    target?.removeAttribute("data-app-open");
    return;
  }
  // What is left of this wheel gesture scrolls the new screen: it must not cross another edge.
  if (wheel) wheel.atTop = wheel.atEnd = false;
  if (target) {
    openApp(chapters()[1].id, { instant: true });
    animations.forEach((animation) => animation.cancel());
    return;
  }
  // The window is already out of sight, and the history takes a moment to answer.
  front.style.visibility = "hidden";
  closeApp({ instant: true });
  holdUntilClosed(animations, performance.now());
}

/** Keeps the last frame (the buy bar out of sight, above all) until the history has closed the board. */
function holdUntilClosed(animations: Animation[], since: number) {
  if (!document.documentElement.dataset.app || performance.now() - since > 1500) {
    animations.forEach((animation) => animation.cancel());
    return;
  }
  requestAnimationFrame(() => holdUntilClosed(animations, since));
}

/** Without motion the same gesture goes straight through, with nothing in between. */
function jump(direction: 1 | -1) {
  if (direction > 0 && !currentApp()) openApp(chapters()[1].id);
  else if (direction < 0 && currentApp()) closeApp();
}

/** What scrolls under the gesture: the board if it is open, the home screen if not. */
function scrollerNow() {
  return currentApp() ?? document.querySelector<HTMLElement>(".stage");
}

const atEndOf = (scroller: HTMLElement) =>
  scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - (currentApp() ? 2 : HOME_SLACK_PX);

function onTouchStart(e: TouchEvent) {
  touch = null;
  if (pull || e.touches.length !== 1 || !isPhoneOs() || historyGuard.video) return;
  if ((e.target as Element).closest?.(IGNORE)) return;
  if (currentApp()?.getAnimations().length) return;
  const scroller = scrollerNow();
  if (!scroller) return;
  const point = e.touches[0];
  touch = {
    x: point.clientX,
    y: point.clientY,
    time: e.timeStamp,
    speed: 0,
    atTop: scroller.scrollTop <= 0,
    atEnd: atEndOf(scroller),
  };
}

function onTouchMove(e: TouchEvent) {
  if (!touch) return;
  if (e.touches.length !== 1) {
    touch = null;
    if (pull && !pull.wheel) settle(pull, false);
    return;
  }
  const point = e.touches[0];

  if (!pull) {
    const dx = point.clientX - touch.x;
    const dy = point.clientY - touch.y;
    if (Math.hypot(dx, dy) < LOCK_PX) return;
    const direction = dy < 0 ? 1 : -1;
    const atEdge = direction > 0 ? touch.atEnd : touch.atTop;
    // Sideways belongs to the carousels, and inside the board the page scrolls by itself.
    if (Math.abs(dx) > Math.abs(dy) || !atEdge || !e.cancelable) {
      touch = null;
      return;
    }
    if (!motion()) {
      e.preventDefault();
      touch = null;
      jump(direction);
      return;
    }
    if (!begin(direction)) {
      touch = null;
      return;
    }
    touch.y = point.clientY;
    touch.time = e.timeStamp;
    touch.x = point.clientY;
  }

  const active = pull;
  if (!active || active.wheel || active.settling) return;
  e.preventDefault();
  const elapsed = Math.max(8, e.timeStamp - touch.time);
  touch.speed = touch.speed * 0.4 + ((touch.x - point.clientY) / elapsed) * 0.6;
  touch.x = point.clientY;
  touch.time = e.timeStamp;
  const travelled = (touch.y - point.clientY) * active.direction;
  active.goal = clamp(travelled / (window.innerHeight * TRAVEL), 0, 1);
}

function onTouchEnd(e: TouchEvent) {
  const active = pull;
  const speed = touch?.speed ?? 0;
  const recent = touch ? e.timeStamp - touch.time < 120 : false;
  touch = null;
  if (!active || active.wheel) return;
  const flick = recent ? speed * active.direction : 0;
  const commit = e.type === "touchend" && flick > -FLICK_SPEED && (active.goal > COMMIT_AT || flick > FLICK_SPEED);
  settle(active, commit);
}

/** An element between the pointer and the board that scrolls on its own: the wheel is its. */
function ownScroller(from: Element, board: HTMLElement) {
  for (let el: Element | null = from; el && el !== board; el = el.parentElement) {
    if (el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY)) return true;
  }
  return false;
}

/**
 * A mouse wheel or a trackpad, on a narrow window: the same way in as a finger. A wheel has
 * no release, so the gesture ends when it goes quiet. Inside the board, the wheel glides.
 */
function onWheel(e: WheelEvent) {
  if (e.ctrlKey || touch || !isPhoneOs() || historyGuard.video) return;
  const origin = e.target as Element;
  if (origin.closest?.(WHEEL_IGNORE)) return;
  const scroller = scrollerNow();
  if (!scroller) return;
  const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
  const vertical = dy !== 0 && Math.abs(dy) >= Math.abs(e.deltaX);

  // A new gesture remembers where it started. Momentum is part of the gesture that threw it.
  if (!wheel || e.timeStamp - wheel.last > WHEEL_GAP_MS) {
    window.clearTimeout(wheel?.timer);
    const top = glideTarget(scroller);
    wheel = {
      last: e.timeStamp,
      atTop: top <= 0,
      atEnd: top + scroller.clientHeight >= scroller.scrollHeight - (currentApp() ? 2 : HOME_SLACK_PX),
      timer: 0,
    };
  }
  wheel.last = e.timeStamp;

  if (pull?.settling) {
    e.preventDefault();
    return;
  }
  if (pull && !pull.wheel) return;

  if (!pull) {
    if (!vertical) return;
    const direction = dy > 0 ? 1 : -1;
    const atEdge = direction > 0 ? wheel.atEnd : wheel.atTop;
    if (!atEdge || currentApp()?.getAnimations().length) {
      // Just scrolling: inside the board it glides instead of jumping notch by notch.
      const app = currentApp();
      if (app && motion() && !ownScroller(origin, app)) {
        e.preventDefault();
        glideBy(app, dy);
      }
      return;
    }
    if (!motion()) {
      e.preventDefault();
      wheel.atTop = wheel.atEnd = false;
      jump(direction);
      return;
    }
    const started = begin(direction);
    if (!started) return;
    started.wheel = true;
    started.stiffness = FOLLOW_WHEEL;
  }

  const active = pull!;
  e.preventDefault();
  active.goal = clamp(active.goal + (dy * active.direction) / (window.innerHeight * TRAVEL), 0, 1);
  window.clearTimeout(wheel.timer);
  if (active.goal >= 1) return settle(active, true);
  wheel.timer = window.setTimeout(() => {
    if (pull === active) settle(active, active.goal > (active.direction > 0 ? WHEEL_COMMIT_IN : WHEEL_COMMIT_OUT));
  }, WHEEL_IDLE_MS);
}

/** The hint under the apps: the same way in, played whole for a tap. */
export function enterLanding() {
  if (pull || currentApp() || !isPhoneOs()) return;
  if (!motion()) return jump(1);
  const active = begin(1);
  if (active) settle(active, true, true);
}

/** The back gesture, or leaving the page, wins over anything still under the finger. */
function abandon() {
  touch = null;
  if (pull) finish(pull, false);
}

function onVisibility() {
  if (document.hidden) abandon();
}

/** Starts listening to the finger and the wheel. Returns what stops them. */
export function startPull() {
  const signal = new AbortController();
  const options = { signal: signal.signal };
  document.addEventListener("touchstart", onTouchStart, { ...options, passive: true });
  document.addEventListener("touchmove", onTouchMove, { ...options, passive: false });
  document.addEventListener("touchend", onTouchEnd, options);
  document.addEventListener("touchcancel", onTouchEnd, options);
  document.addEventListener("wheel", onWheel, { ...options, passive: false });
  window.addEventListener("popstate", abandon, options);
  document.addEventListener("visibilitychange", onVisibility, options);
  return () => {
    signal.abort();
    window.clearTimeout(wheel?.timer);
    wheel = null;
    stopGlide();
    document.documentElement.removeAttribute("data-pulling");
  };
}
