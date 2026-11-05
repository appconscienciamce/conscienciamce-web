import { historyGuard } from "@/lib/board/history-guard";

/**
 * The phone reading: a home screen, and every chapter an app that opens over it.
 * Chapters are the same <section>s as everywhere else; only their window changes.
 * The history is the source of truth, so the back gesture just works: each open
 * app is an entry, and everything on screen follows the entry that is current.
 */

const OPEN_MS = 460;
const CLOSE_MS = 320;
const NEXT_MS = 360;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
/** Behind an open app, and out of the keyboard's way. */
const HOME = ".phone-home,.st-hero";

interface AppEntry {
  ccApp?: string;
  /** Entries between this one and the home screen. */
  ccDepth?: number;
  ccMap?: boolean;
  ccVideo?: boolean;
}

let current: HTMLElement | null = null;
let origin: HTMLElement | null = null;
/** Depth of the entry on screen: tells a step back from a step forward. */
let shownDepth = 0;
/** A close is on its way through the history. A second tap must not walk out of the site. */
let closing = false;

const root = () => document.documentElement;
const motion = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const entry = () => (window.history.state ?? {}) as AppEntry;

export const isPhoneOs = () => root().classList.contains("phone-os") && !root().classList.contains("board-on");

const stationOf = (id: string) => document.getElementById(id)?.closest<HTMLElement>("[data-station]") ?? null;
const isHome = (station: HTMLElement) => station.classList.contains("st-hero");

function setHomeInert(inert: boolean) {
  document.querySelectorAll<HTMLElement>(HOME).forEach((el) => (el.inert = inert));
}

/** The transform that lays an app over the icon it came from. */
function fromIcon(icon: HTMLElement, app: HTMLElement) {
  const a = icon.getBoundingClientRect();
  const b = app.getBoundingClientRect();
  return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
}

function show(app: HTMLElement) {
  app.setAttribute("data-app-open", "");
  root().dataset.app = app.id;
  setHomeInert(true);
}

function hide(app: HTMLElement) {
  app.removeAttribute("data-app-open");
  if (current === null) {
    delete root().dataset.app;
    setHomeInert(false);
  }
}

function present(app: HTMLElement, targetId: string, icon: HTMLElement | null, animate: boolean, back = false) {
  const previous = current;
  shownDepth = entry().ccDepth ?? 0;
  if (previous === app) return reveal(app, targetId);
  current = app;
  origin = icon ?? origin;
  // A gesture can land in the middle of a transition.
  [app, previous].forEach((el) => el?.getAnimations().forEach((animation) => animation.cancel()));
  show(app);
  reveal(app, targetId);
  app.querySelector<HTMLElement>(".app-bar button")?.focus({ preventScroll: true });
  if (!animate || !motion()) {
    if (previous) hide(previous);
    return;
  }
  if (previous) {
    app.style.zIndex = "39";
    const slide = app.animate([{ transform: `translateX(${back ? -100 : 100}%)` }, { transform: "none" }], { duration: NEXT_MS, easing: EASE });
    const done = () => {
      app.style.zIndex = "";
      if (previous !== current) hide(previous);
    };
    slide.finished.then(done, done);
  } else if (icon) {
    app.animate(
      [
        { transform: fromIcon(icon, app), borderRadius: "32px", opacity: 0.4 },
        { transform: "none", borderRadius: "14px", opacity: 1 },
      ],
      { duration: OPEN_MS, easing: EASE },
    );
  } else {
    app.animate([{ transform: "translateY(40px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: OPEN_MS, easing: EASE });
  }
}

function reveal(app: HTMLElement, targetId: string) {
  if (targetId === app.id) {
    app.scrollTop = 0;
    return;
  }
  document.getElementById(targetId)?.scrollIntoView({ block: "start" });
}

function dismiss() {
  shownDepth = 0;
  const app = current;
  if (!app) return;
  const icon = origin;
  current = null;
  origin = null;
  const done = () => {
    if (current === app) return;
    hide(app);
    if (!current) icon?.closest<HTMLElement>("a,button")?.focus({ preventScroll: true });
  };
  if (!motion()) return done();
  // Back into the icon it came from, or just down if it never had one.
  const to = icon?.isConnected
    ? { transform: fromIcon(icon, app), borderRadius: "32px", opacity: 0 }
    : { transform: "translateY(60px)", opacity: 0 };
  app.animate([{ transform: "none", borderRadius: "14px", opacity: 1 }, to], { duration: CLOSE_MS, easing: EASE, fill: "forwards" }).finished.then((a) => {
    done();
    a.cancel();
  }, done);
}

/** Opens the chapter that holds `id`, at `id`. The home screen's own chapter just goes home. */
export function openApp(id: string, { icon = null, replace = false }: { icon?: HTMLElement | null; replace?: boolean } = {}) {
  const app = stationOf(id);
  if (!app) return false;
  if (isHome(app)) {
    closeApp();
    return true;
  }
  if (app === current) {
    reveal(app, id);
    return true;
  }
  const { ccMap: _map, ccVideo: _video, ...state } = entry();
  // Replacing swaps the map's own entry, which sits one above where it was opened.
  const next = { ...state, ccApp: app.id, ccDepth: (state.ccDepth ?? 0) + 1 };
  if (replace) window.history.replaceState(next, "", `#${id}`);
  else window.history.pushState(next, "", `#${id}`);
  present(app, id, icon, true);
  return true;
}

/** Back to the home screen, however many chapters the reader walked through. */
export function closeApp() {
  if (closing) return;
  const { ccDepth = 0, ccMap } = entry();
  const steps = ccDepth + (ccMap ? 1 : 0);
  if (steps > 0) {
    closing = true;
    window.history.go(-steps);
    return;
  }
  goHome();
}

/** The entry on screen becomes the home screen: a shared link has nothing behind it to go back to. */
function goHome() {
  const { ccApp, ccDepth: _depth, ...state } = entry();
  if (ccApp) window.history.replaceState(state, "", window.location.pathname + window.location.search);
  dismiss();
}

/** Starts following the history. Returns what stops it. */
export function startPhoneOs() {
  const onPop = () => {
    const closed = closing;
    closing = false;
    if (historyGuard.video) return;
    if (closed) return goHome();
    const { ccApp: id, ccDepth = 0 } = entry();
    if (!id) return dismiss();
    const app = document.getElementById(id);
    if (app && app !== current) present(app, id, null, true, ccDepth < shownDepth);
  };
  window.addEventListener("popstate", onPop);

  // A shared link to a chapter opens that chapter.
  const hash = window.location.hash.slice(1);
  if (hash) {
    const app = stationOf(hash);
    if (app && !isHome(app)) {
      // A reload lands here too, and keeps the place it already had in the history.
      window.history.replaceState({ ...window.history.state, ccApp: app.id, ccDepth: entry().ccDepth ?? 0 }, "");
      present(app, hash, null, false);
    }
  }

  return () => window.removeEventListener("popstate", onPop);
}
