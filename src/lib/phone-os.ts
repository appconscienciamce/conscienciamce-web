import { historyGuard } from "@/lib/board/history-guard";

/**
 * The phone reading: a home screen, and one window over it. That window is a board:
 * every chapter is a frame on it, one under the other, and the finger just scrolls.
 * Chapters are the same <section>s as everywhere else. The history is the source of
 * truth, so the back gesture just works: the open window is one entry, and everything
 * on screen follows the entry that is current.
 */

const OPEN_MS = 460;
const CLOSE_MS = 320;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
/** Behind the window, and out of the keyboard's way. */
export const HOME = ".phone-home,.st-hero";

interface AppEntry {
  ccApp?: string;
  /** Entries between this one and the home screen. */
  ccDepth?: number;
  ccMap?: boolean;
  ccVideo?: boolean;
}

let current: HTMLElement | null = null;
let origin: HTMLElement | null = null;
/** A close is on its way through the history. A second tap must not walk out of the site. */
let closing = false;
/** The window already left with the finger: closing it has nothing left to show. */
let quietClose = false;

const root = () => document.documentElement;
export const motion = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const entry = () => (window.history.state ?? {}) as AppEntry;

export const appWindow = () => document.querySelector<HTMLElement>(".canvas");
export const currentApp = () => current;

export const isPhoneOs = () => root().classList.contains("phone-os") && !root().classList.contains("board-on");

/** Some anchors belong to the board: on a phone their place is held by a `data-phone-anchor`. */
const landing = (id: string) => {
  const target = document.getElementById(id);
  if (target?.getClientRects().length) return target;
  return document.querySelector<HTMLElement>(`[data-phone-anchor="${id}"]`) ?? target;
};

const stationOf = (id: string) => document.getElementById(id)?.closest<HTMLElement>("[data-station]") ?? null;
const isHome = (station: HTMLElement) => station.classList.contains("st-hero");

function setHomeInert(inert: boolean) {
  document.querySelectorAll<HTMLElement>(HOME).forEach((el) => (el.inert = inert));
}

/** The transform that lays the window over the icon it came from. */
function fromIcon(icon: HTMLElement, win: HTMLElement) {
  const a = icon.getBoundingClientRect();
  const b = win.getBoundingClientRect();
  return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
}

function hide(win: HTMLElement) {
  win.removeAttribute("data-app-open");
  win.style.visibility = "";
  if (current === null) {
    delete root().dataset.app;
    setHomeInert(false);
  }
}

function reveal(id: string, smooth = false) {
  landing(id)?.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
}

function present(id: string, icon: HTMLElement | null, animate: boolean) {
  const win = appWindow();
  if (!win) return;
  current = win;
  origin = icon ?? origin;
  // A gesture can land in the middle of a transition.
  win.getAnimations().forEach((animation) => animation.cancel());
  win.setAttribute("data-app-open", "");
  root().dataset.app = stationOf(id)?.id ?? id;
  setHomeInert(true);
  reveal(id);
  win.querySelector<HTMLElement>(".app-bar button")?.focus({ preventScroll: true });
  if (!animate || !motion()) return;
  if (icon) {
    win.animate(
      [
        { transform: fromIcon(icon, win), borderRadius: "32px", opacity: 0.4 },
        { transform: "none", borderRadius: "14px", opacity: 1 },
      ],
      { duration: OPEN_MS, easing: EASE },
    );
  } else {
    win.animate([{ transform: "translateY(40px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: OPEN_MS, easing: EASE });
  }
}

function dismiss() {
  const instant = quietClose;
  quietClose = false;
  const win = current;
  if (!win) return;
  const icon = origin;
  current = null;
  origin = null;
  const done = () => {
    if (current === win) return;
    hide(win);
    if (!current) icon?.closest<HTMLElement>("a,button")?.focus({ preventScroll: true });
  };
  if (instant || !motion()) return done();
  // Back into the icon it came from, or just down if it never had one.
  const to = icon?.isConnected
    ? { transform: fromIcon(icon, win), borderRadius: "32px", opacity: 0 }
    : { transform: "translateY(60px)", opacity: 0 };
  win.animate([{ transform: "none", borderRadius: "14px", opacity: 1 }, to], { duration: CLOSE_MS, easing: EASE, fill: "forwards" }).finished.then((a) => {
    done();
    a.cancel();
  }, done);
}

/** Goes to `id` on the board, opening the window if it has to. The home screen's own chapter just goes home. */
export function openApp(
  id: string,
  { icon = null, replace = false, instant = false }: { icon?: HTMLElement | null; replace?: boolean; instant?: boolean } = {},
) {
  const chapter = stationOf(id);
  if (!chapter) return false;
  if (isHome(chapter)) {
    closeApp();
    return true;
  }
  if (current) {
    reveal(id, !instant && motion());
    return true;
  }
  const { ccMap: _map, ccVideo: _video, ...state } = entry();
  // Replacing swaps the map's own entry, which sits one above where it was opened.
  const next = { ...state, ccApp: id, ccDepth: (state.ccDepth ?? 0) + 1 };
  if (replace) window.history.replaceState(next, "", `#${id}`);
  else window.history.pushState(next, "", `#${id}`);
  // The icon is where it goes back to, even if the finger brought it here.
  present(id, icon ?? document.querySelector<HTMLElement>(`.phone-app[href="#${id}"] .phone-icon`), !instant);
  return true;
}

/** The chapter being read: the address follows it, so a reload or a shared link lands there. */
export function followChapter(id: string) {
  if (!current || closing) return;
  root().dataset.app = id;
  const state = entry();
  if (!state.ccApp || state.ccMap || state.ccVideo) return;
  // A link to a place inside the chapter stays as it is.
  const hash = window.location.hash.slice(1);
  if (hash && stationOf(hash)?.id === id) return;
  try {
    window.history.replaceState({ ...state, ccApp: id }, "", `#${id}`);
  } catch {
    // Safari caps these per minute. The address catches up on the next chapter.
  }
}

/** Back to the home screen, wherever the reader got to on the board. */
export function closeApp({ instant = false }: { instant?: boolean } = {}) {
  if (closing) return;
  quietClose = instant;
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
    const { ccApp: id } = entry();
    if (!id) return dismiss();
    if (!current) present(id, null, true);
  };
  window.addEventListener("popstate", onPop);
  // Going back to an entry with a hash would jump the board to that anchor: closing a video, for one.
  window.history.scrollRestoration = "manual";

  // A shared link to a chapter opens the board at that chapter.
  const hash = window.location.hash.slice(1);
  if (hash) {
    const chapter = stationOf(hash);
    if (chapter && !isHome(chapter)) {
      // A reload lands here too, and keeps the place it already had in the history.
      window.history.replaceState({ ...window.history.state, ccApp: hash, ccDepth: entry().ccDepth ?? 0 }, "");
      present(hash, null, false);
    }
  }

  return () => {
    window.removeEventListener("popstate", onPop);
    window.history.scrollRestoration = "auto";
  };
}
