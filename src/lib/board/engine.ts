import { BOARD_QUERY, EDGES, REDUCED_MOTION_QUERY, SIDEBAR_WIDTH, STATIONS, STATION_FIRST_STOP, STOPS, WORLD } from "./layout";
import { isPhoneOs, openApp } from "@/lib/phone-os";
import { historyGuard } from "./history-guard";
import { MAX_ZOOM, MIN_ZOOM, clamp, easeInOut, fit, lerp, mixScene, morphScene, smoother, travel, type Camera, type Scene } from "./camera";

export type BoardMode = "guided" | "explore";

export interface BoardState {
  /** Spatial board active. False means the vertical editorial reading. */
  board: boolean;
  /** Map open over the desktop. */
  open: boolean;
  mode: BoardMode;
  station: number;
  maximized: boolean;
  /** Small screens: explicit, full-screen map. */
  overlay: boolean;
}

export interface BoardNodes {
  track: HTMLElement;
  stage: HTMLElement;
  win: HTMLElement;
  viewport: HTMLElement;
  world: HTMLElement;
}

const TITLE_BAR = 40;
const SYSTEM_BAR = 32;
const OPEN_RANGE = 0.9; // viewport heights
const STOP_LENGTH = 0.95; // viewport heights
const DEFAULT_HOLD = 0.46;
const FLIGHT_MS = 950;
const MORPH_MS = 720;
/** Same duration and curve as the sidebar's CSS slide, so both move as one. */
const SIDEBAR_MS = 440;
const MAXIMIZE_MS = 460;
const DRAG_THRESHOLD = 4;

const NO_PAN_CONTROLS = "a,button,input,textarea,select,summary,label,iframe,video,audio,[data-nopan]";
const NO_PAN = `${NO_PAN_CONTROLS},h1,h2,h3,h4,p,li,dt,dd,blockquote,figcaption`;
const OVERLAY_BACKGROUND = ".site-footer,.flow-bar,.skip-link";
const OVERLAY_PADDING = { left: 12, right: 12, top: 14, bottom: 84 };
const DOUBLE_TAP_MS = 400;
const DOUBLE_TAP_PX = 28;
const GLIDE_DECAY_MS = 260;
const GLIDE_MIN_SPEED = 0.02;
const GLIDE_MAX_SPEED = 2.5;
/** The map opening out of what was tapped, and the camera settling on the chapter. */
const OVERLAY_IN_MS = 520;
const OVERLAY_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const INTRO_MS = 1100;
const INTRO_ZOOM = 0.55;
/** Screen pixels of vertical swipe that walk one stop along the path. */
const RAIL_STEP_PX = 240;
/** Finger speed, in px/ms, that makes a swipe a flick. How fast the camera follows it or settles. */
const RAIL_FLICK_SPEED = 0.2;
const RAIL_FOLLOW_MS = 70;
const RAIL_SETTLE_MS = 170;
/** Past this much of a chapter's zoom the reader is looking at details: the finger pans. */
const RAIL_MAX_ZOOM = 1.2;
/** How much of a station has to come into view before it appears. */
const REVEAL_MARGIN = 60;

/**
 * The only owner of the board viewport. The document scroll is the single
 * source of truth while guided; while exploring, the pointer is. Nothing else
 * writes the world transform, so the two modes can never fight over the wheel.
 */
export class BoardEngine {
  private state: BoardState = { board: false, open: false, mode: "guided", station: 0, maximized: false, overlay: false };

  private vw = 0;
  private vh = 0;
  private starts: number[] = [];
  private lengths: number[] = [];
  private trackTop = 0;
  private trackLength = 0;
  private openEnd = 0;

  private smoothScroll = 0;
  private savedScroll = 0;
  private raf = 0;
  private lastFrame = 0;
  private idleTimer = 0;
  private moving = false;

  private scene: Scene | null = null;
  private maxBlend = 0;
  /** `start` is set on the first painted frame: promoting the world can take a while, and that wait must not eat the motion. */
  private flight: { from: Scene; start: number | null; duration: number; morph?: boolean } | null = null;
  private camFlight: { from: Camera; to: Camera; start: number; duration: number } | null = null;

  private explore: Camera = { cx: 0, cy: 0, z: 1 };
  private pointers = new Map<number, { x: number; y: number }>();
  private drag: { id: number; x: number; y: number; moved: boolean; viaGuided: boolean; rail?: boolean } | null = null;
  private note: { el: HTMLElement; id: number; x: number; y: number; mx: number; my: number } | null = null;
  private pinch: { distance: number; z: number } | null = null;
  private suppressClick = false;

  private stations: HTMLElement[] = [];
  private edges: { el: SVGPathElement; from: number; to: number }[] = [];
  private anchors = new Map<string, number>();
  private query: MediaQueryList;
  private reduced: MediaQueryList;
  private abort = new AbortController();
  private cameraNow: Camera = { cx: 0, cy: 0, z: 1 };
  private sidebar = true;
  private followFocus = true;

  /** Height of the bar above the viewport. Taller on the phone map, measured there. */
  private bar = TITLE_BAR;
  /** What the reader had in front of them, as an element: pixels stop meaning anything if the layout changes. */
  private overlayAnchor: { el: HTMLElement; top: number } | null = null;
  private overlayStop = 0;
  private appScroll = 0;
  private overlayOpener: HTMLElement | null = null;
  private ignorePop = false;
  private glide: { vx: number; vy: number } | null = null;
  /** Position along the path, in stops, while a swipe walks the map. */
  private rail: { pos: number; held: boolean } | null = null;
  /** Rightmost point of the map reached so far: what is past it has not appeared yet. */
  private reach = -Infinity;
  private edgeSpans: [number, number][] = [];
  private panTrack = { t: 0, vx: 0, vy: 0 };
  private lastTap = { t: 0, x: 0, y: 0 };
  private tapStart: { id: number; x: number; y: number } | null = null;

  constructor(
    private nodes: BoardNodes,
    private onChange: (state: BoardState) => void,
    private onChapter: (station: number) => void,
    private onOpenChange: (open: boolean) => void,
  ) {
    this.query = window.matchMedia(BOARD_QUERY);
    this.reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    STATIONS.forEach((s, i) => this.anchors.set(s.id, STATION_FIRST_STOP[i]));
    STOPS.forEach((s, i) => s.anchor && this.anchors.set(s.anchor, i));
    this.stations = Array.from(nodes.world.querySelectorAll<HTMLElement>("[data-station]"));
    this.edges = Array.from(nodes.world.querySelectorAll<SVGPathElement>("[data-edge]")).map((el) => {
      const edge = EDGES[Number(el.dataset.edge)];
      return { el, from: edge.from, to: edge.to };
    });
    // A reload with the map open lands on its history entry: the page starts clean.
    if (window.history.state?.ccMap || window.history.state?.ccVideo) {
      const { ccMap: _map, ccVideo: _video, ...rest } = window.history.state;
      window.history.replaceState(rest, "");
    }
    window.history.scrollRestoration = "auto";
    this.bind();
    this.syncBoard();
    const hash = window.location.hash.slice(1);
    if (hash && this.state.board) this.goTo(hash, true);
  }

  destroy() {
    this.abort.abort();
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.idleTimer);
    this.setExploreListeners(false);
    this.releaseOverlay();
    window.history.scrollRestoration = "auto";
  }

  /* ---------------- Public actions ---------------- */

  /** Anchor navigation. Returns false when the id is not on the board. */
  goTo(id: string, instant = false): boolean {
    if (!this.state.board) return false;
    if (id === "inicio") {
      if (this.state.overlay) this.goToStop(0);
      else this.close();
      return true;
    }
    const stop = this.anchors.get(id);
    if (stop === undefined) return false;
    this.goToStop(stop, instant);
    this.focusAnchor(id);
    return true;
  }

  private focusAnchor(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    this.followFocus = false;
    target.focus({ preventScroll: true });
    this.followFocus = true;
  }

  goToStop(index: number, instant = false) {
    const stop = clamp(index, 0, STOPS.length - 1);
    if (this.state.mode === "explore") {
      this.overlayStop = stop;
      this.flyCamera(this.frame(stop));
      this.setState({ station: STOPS[stop].station });
      return;
    }
    this.flyToScroll(this.scrollForStop(stop), instant);
  }

  /** Advance or go back by one stop. */
  step(direction: 1 | -1) {
    if (!this.state.board) return;
    // During a flight the camera is still leaving: count from where it is going.
    if (this.state.overlay) return this.goToStop((this.camFlight || this.rail ? this.overlayStop : this.nearestStop()) + direction);
    const { pos } = this.position(this.smoothScroll);
    const target = direction > 0 ? Math.floor(pos + 0.51) + 1 : Math.ceil(pos - 0.51) - 1;
    if (target < 0) return this.close();
    this.goToStop(target);
  }

  openMap() {
    if (this.state.board) this.goToStop(1);
  }

  /** The index takes real width: the camera reframes around it. */
  setSidebar(open: boolean) {
    if (open === this.sidebar) return;
    // Without a board there is no camera to reframe.
    if (!this.state.board) {
      this.sidebar = open;
      return;
    }
    const from = this.currentScene();
    this.sidebar = open;
    if (this.state.mode === "guided") this.flight = { from, start: null, duration: SIDEBAR_MS };
    this.wake();
  }

  close() {
    if (!this.state.board) return;
    if (this.state.overlay) return this.closeOverlay();
    if (this.state.mode === "explore") this.leaveExplore();
    this.setState({ maximized: false });
    this.flyToScroll(0, false, true);
  }

  toggleMaximized() {
    this.setState({ maximized: !this.state.maximized });
    this.wake();
  }

  setMode(mode: BoardMode) {
    if (mode === this.state.mode) return;
    if (mode === "explore") this.enterExplore();
    else this.resumeGuided(false);
  }

  /** Leave exploration. `nearest` continues from what is on screen. */
  resumeGuided(nearest: boolean) {
    if (!this.state.board || this.state.overlay) return;
    const stop = nearest ? this.nearestStop() : null;
    const from = this.currentScene();
    this.leaveExplore();
    this.flight = { from, start: null, duration: FLIGHT_MS };
    if (stop !== null) window.scrollTo(0, this.trackTop + this.scrollForStop(stop));
    else window.scrollTo(0, this.savedScroll);
    this.smoothScroll = this.scrollValue();
    this.wake();
  }

  zoomBy(factor: number) {
    if (this.state.mode !== "explore") return;
    const z = clamp(this.explore.z * factor, MIN_ZOOM, MAX_ZOOM);
    this.flyCamera({ ...this.explore, z }, 220);
  }

  zoomReset() {
    if (this.state.mode === "explore") this.flyCamera({ ...this.explore, z: 1 }, 260);
  }

  fitMap() {
    if (!this.state.board) return;
    if (this.state.mode !== "explore") this.enterExplore();
    this.flyCamera(fit(WORLD, ...this.viewSize(), this.padding(1), 1));
  }

  /** Small screens: full-screen map, opened on request. */
  openOverlay(origin?: HTMLElement | null) {
    if (this.state.board) return;
    const root = document.documentElement;
    const from = origin?.getBoundingClientRect() ?? null;
    const station = this.readingStation();
    this.appScroll = document.querySelector("[data-app-open]")?.scrollTop ?? 0;
    // The page leaves the flow under the map and the document collapses:
    // the place to come back to has to be kept by hand.
    const anchor = this.stations[station];
    this.overlayAnchor = anchor ? { el: anchor, top: anchor.getBoundingClientRect().top } : null;
    this.overlayStop = STATION_FIRST_STOP[station];
    this.overlayOpener = document.activeElement as HTMLElement | null;
    window.history.scrollRestoration = "manual";
    window.history.pushState({ ...window.history.state, ccMap: true }, "");
    // Set before the map exists on screen: stations must start hidden, not fade out.
    this.reach = -Infinity;
    if (!this.reduced.matches) this.stations.forEach((el) => (el.dataset.shown = "false"));
    root.classList.add("board-on", "map-overlay");
    this.setBackgroundInert(true);
    this.setState({ overlay: true, board: true, open: true, station });
    this.measure();
    this.scene = null;
    this.edgeSpans = this.edges.map(({ el }) => {
      const box = el.getBBox();
      return [box.x, box.x + box.width];
    });
    const target = this.frame(STATION_FIRST_STOP[station]);
    this.explore = { ...target, z: target.z * INTRO_ZOOM };
    this.enterExplore();
    this.nodes.world.classList.add("is-ready");
    this.flyCamera(target, INTRO_MS);
    if (!this.reduced.matches) this.paintReveal();
    this.openWindow(from);
  }

  private cancelWindow() {
    this.nodes.win.getAnimations().forEach((animation) => animation.cancel());
  }

  /** The map grows out of what was tapped, the same way an app grows out of its icon. */
  private openWindow(from: DOMRect | null) {
    this.cancelWindow();
    if (this.reduced.matches) return;
    const origin = from ? "0 0" : "50% 50%";
    const start = from
      ? `translate(${from.left}px, ${from.top}px) scale(${from.width / window.innerWidth}, ${from.height / window.innerHeight})`
      : "scale(0.94)";
    this.nodes.win.animate(
      [
        { transform: start, transformOrigin: origin, borderRadius: "22px", opacity: 0.3 },
        { transform: "none", transformOrigin: origin, borderRadius: "0px", opacity: 1 },
      ],
      { duration: OVERLAY_IN_MS, easing: OVERLAY_EASE },
    );
  }

  /** The chapter on screen, so the map opens where the reader already is. */
  private readingStation() {
    if (isPhoneOs()) {
      const app = document.querySelector<HTMLElement>("[data-app-open]");
      return app ? Math.max(0, this.stations.indexOf(app)) : 0;
    }
    const middle = window.innerHeight * 0.45;
    let station = 0;
    this.stations.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= middle) station = i;
    });
    return station;
  }

  /** A link to the map, from the vertical reading. */
  openFromLink(id: string) {
    if (id !== "mapa" || this.state.board) return false;
    this.openOverlay();
    return true;
  }

  /**
   * An in-page link in the vertical reading. Not left to the browser: a native jump
   * adds a history entry without the router state, and coming back to one of those
   * after the map or a video reloads the whole page.
   */
  jumpInReading(id: string) {
    if (this.state.board) return false;
    if (isPhoneOs()) return openApp(id);
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ block: "start" });
    this.focusAnchor(id);
    return true;
  }

  /** Leaves the phone map for the reading, at that chapter. */
  readAt(id: string) {
    if (!this.state.overlay) return;
    if (document.documentElement.classList.contains("phone-os")) {
      // The map's history entry becomes the app: going back from it lands where the map was opened.
      // Reading on in the app already open, there is nothing to replace it with.
      const station = document.getElementById(id)?.closest("[data-station]");
      this.closeOverlay(station !== document.querySelector("[data-app-open]"));
      openApp(id, { replace: true });
      return;
    }
    this.closeOverlay();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ block: "start" });
    this.focusAnchor(id);
  }

  private setBackgroundInert(inert: boolean) {
    document.querySelectorAll<HTMLElement>(OVERLAY_BACKGROUND).forEach((el) => (el.inert = inert));
  }

  closeOverlay(fromHistory = false) {
    this.cancelWindow();
    this.leaveExplore();
    this.glide = null;
    this.setBackgroundInert(false);
    this.releaseOverlay();
    this.bar = TITLE_BAR;
    this.setState({ overlay: false, board: false, open: false });
    this.syncBoard();
    this.restoreReading();
    if (!fromHistory && window.history.state?.ccMap) {
      this.ignorePop = true;
      window.history.back();
    } else {
      window.history.scrollRestoration = "auto";
    }
  }

  /**
   * Back at the same spot. Sections off screen skip their layout and remember the
   * size they had on the map: they are measured for real once, or the page would
   * come back with another height and the scroll position would mean something else.
   */
  private restoreReading() {
    const root = document.documentElement;
    root.classList.add("measure-all");
    const anchor = this.overlayAnchor;
    this.overlayAnchor = null;
    // Widened past the breakpoint while open: the board is back and owns the scroll.
    if (anchor && !this.state.board) window.scrollBy(0, anchor.el.getBoundingClientRect().top - anchor.top);
    const app = document.querySelector("[data-app-open]");
    if (app) app.scrollTop = this.appScroll;
    // Two frames: the browser stores the remembered sizes after layout.
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("measure-all")));

    // A tap does not always leave the focus on what was tapped.
    const opener = this.overlayOpener && this.overlayOpener !== document.body ? this.overlayOpener : document.querySelector<HTMLElement>(".view-map");
    opener?.focus({ preventScroll: true });
    this.overlayOpener = null;
  }

  /** The phone's back gesture leaves the map, not the page. */
  private onPopState = () => {
    if (historyGuard.skipNext) {
      historyGuard.skipNext = false;
      return;
    }
    if (historyGuard.video) return;
    if (this.ignorePop) {
      this.ignorePop = false;
      window.history.scrollRestoration = "auto";
    } else if (this.state.overlay) {
      this.closeOverlay(true);
    } else if (window.history.state?.ccMap || window.history.state?.ccVideo) {
      // Forward into an entry that no longer has anything behind it.
      this.ignorePop = true;
      window.history.back();
    }
  };

  /* ---------------- Setup ---------------- */

  private releaseOverlay() {
    if (!this.state.overlay) return;
    document.documentElement.classList.remove("map-overlay", "board-on");
    this.clearInline();
  }

  private clearInline() {
    const { win, world, viewport, track, stage } = this.nodes;
    win.removeAttribute("style");
    world.style.transform = "";
    world.style.willChange = "";
    world.style.opacity = "";
    viewport.removeAttribute("style");
    track.style.height = "";
    stage.style.removeProperty("--open");
    this.stations.forEach((s) => {
      s.removeAttribute("data-active");
      s.removeAttribute("data-sub");
      s.removeAttribute("data-shown");
    });
    this.edges.forEach((e) => (e.el.style.strokeDashoffset = ""));
  }

  private bind() {
    const { signal } = this.abort;
    window.addEventListener("scroll", this.onScroll, { passive: true, signal });
    window.addEventListener("resize", this.syncBoard, { passive: true, signal });
    this.query.addEventListener("change", this.syncBoard, { signal });
    this.reduced.addEventListener("change", this.syncBoard, { signal });
    window.addEventListener("keydown", this.onKey, { signal });
    window.addEventListener("popstate", this.onPopState, { signal });
    this.nodes.viewport.addEventListener("pointerdown", this.onPointerDown, { signal });
    window.addEventListener("pointermove", this.onPointerMove, { signal });
    window.addEventListener("pointerup", this.onPointerUp, { signal });
    window.addEventListener("pointercancel", this.onPointerUp, { signal });
    this.nodes.viewport.addEventListener("click", this.onClickCapture, { capture: true, signal });
    this.nodes.world.addEventListener("focusin", this.onFocus, { signal });
  }

  private syncBoard = () => {
    if (this.state.overlay) {
      const width = this.vw;
      this.measure();
      // A turned phone: the same chapter, framed for the new shape.
      if (width !== this.vw) this.explore = this.frame(this.nearestStop());
      this.wake();
      return;
    }
    const wanted = this.query.matches && !this.reduced.matches;
    const root = document.documentElement;
    if (wanted !== this.state.board) {
      root.classList.toggle("board-on", wanted);
      if (!wanted) {
        if (this.state.mode === "explore") this.leaveExplore();
        cancelAnimationFrame(this.raf);
        this.raf = 0;
        this.flight = null;
        this.camFlight = null;
        this.clearInline();
        this.setDesktopInert(false);
      }
      this.setState({ board: wanted, open: false });
    }
    if (!wanted) return;
    this.measure();
    this.smoothScroll = this.scrollValue();
    this.scene = null;
    this.flight = null;
    this.render(performance.now());
    this.nodes.world.classList.add("is-ready");
  };

  private measure() {
    this.vw = document.documentElement.clientWidth;
    this.vh = window.innerHeight;
    if (this.state.overlay) {
      this.vh = this.nodes.win.clientHeight || this.vh;
      this.bar = this.nodes.win.clientHeight - this.nodes.viewport.clientHeight || TITLE_BAR;
    }
    this.trackTop = this.nodes.track.offsetTop;
    this.openEnd = OPEN_RANGE * this.vh;
    let at = this.openEnd;
    this.starts = [];
    this.lengths = [];
    for (const stop of STOPS) {
      const length = (stop.length ?? 1) * STOP_LENGTH * this.vh;
      this.starts.push(at);
      this.lengths.push(length);
      at += length;
    }
    const last = this.lengths.length - 1;
    this.trackLength = this.starts[last] + this.lengths[last] * 0.6;
    if (!this.state.overlay) this.nodes.track.style.height = `${this.trackLength + this.vh}px`;
  }

  /* ---------------- Timeline ---------------- */

  private scrollValue() {
    return clamp(window.scrollY - this.trackTop, 0, this.trackLength);
  }

  private scrollForStop(index: number) {
    const hold = STOPS[index].hold ?? DEFAULT_HOLD;
    return this.starts[index] + this.lengths[index] * hold * 0.55;
  }

  /** Continuous position along the stops, and the eased travel inside the current segment. */
  private position(scroll: number) {
    if (scroll <= this.starts[0]) return { index: 0, travel: 0, pos: 0 };
    let index = this.starts.length - 1;
    for (let i = 0; i < this.starts.length; i++) {
      if (scroll < this.starts[i] + this.lengths[i]) {
        index = i;
        break;
      }
    }
    if (index === STOPS.length - 1) return { index, travel: 0, pos: index };
    const f = (scroll - this.starts[index]) / this.lengths[index];
    const hold = STOPS[index].hold ?? DEFAULT_HOLD;
    const t = smoother(clamp((f - hold) / (1 - hold), 0, 1));
    return { index, travel: t, pos: index + t };
  }

  private viewSize(): [number, number] {
    const scene = this.scene;
    if (this.state.overlay) return [this.vw, this.vh - this.bar];
    if (!scene) return [this.vw * 0.92, this.vh * 0.86 - TITLE_BAR];
    return [scene.ww, scene.wh - TITLE_BAR];
  }

  private padding(open: number) {
    if (this.state.overlay) return OVERLAY_PADDING;
    const sidebar = this.sidebar && !this.state.overlay ? SIDEBAR_WIDTH : 0;
    return { left: (44 + sidebar) * open, right: 44 * open, top: 30 * open, bottom: 58 * open };
  }

  /** Camera that rests on a stop, for the map window fully open. */
  private frame(index: number, view = this.openFrame()): Camera {
    const stop = STOPS[index];
    if (this.state.overlay) return fit(stop.rect, ...this.viewSize(), this.padding(1));
    const w = view.ww;
    const h = view.wh - TITLE_BAR;
    return fit(stop.rect, w, h, this.padding(1));
  }

  private closedFrame() {
    const h0 = STATIONS[0].h / STATIONS[0].w;
    const maxW = (this.vh - SYSTEM_BAR - 64 - TITLE_BAR) / h0;
    const ww = Math.round(Math.min(this.vw * 0.56, maxW));
    const wh = Math.round(ww * h0 + TITLE_BAR);
    return { wx: Math.round((this.vw - ww) / 2), wy: Math.round(SYSTEM_BAR + (this.vh - SYSTEM_BAR - wh) / 2), ww, wh };
  }

  private openFrame() {
    if (this.maxBlend >= 1) return { wx: 0, wy: SYSTEM_BAR, ww: this.vw, wh: this.vh - SYSTEM_BAR };
    const ww = Math.round(this.vw * 0.92);
    const wh = Math.round(this.vh * 0.86);
    const base = { wx: Math.round((this.vw - ww) / 2), wy: Math.round(SYSTEM_BAR + (this.vh - SYSTEM_BAR - wh) / 2), ww, wh };
    if (this.maxBlend <= 0) return base;
    const t = easeInOut(this.maxBlend);
    return {
      wx: lerp(base.wx, 0, t),
      wy: lerp(base.wy, SYSTEM_BAR, t),
      ww: lerp(base.ww, this.vw, t),
      wh: lerp(base.wh, this.vh - SYSTEM_BAR, t),
    };
  }

  /** Pure function of the scroll: the same input always gives the same scene. */
  private guidedScene(scroll: number): Scene {
    const open = this.openFrame();
    if (scroll < this.openEnd) {
      const closed = this.closedFrame();
      const t = smoother(clamp(scroll / this.openEnd, 0, 1));
      const ww = lerp(closed.ww, open.ww, t);
      const wh = lerp(closed.wh, open.wh, t);
      const camera = fit(STOPS[0].rect, ww, wh - TITLE_BAR, this.padding(t));
      return {
        ...camera,
        wx: lerp(closed.wx, open.wx, t),
        wy: lerp(closed.wy, open.wy, t),
        ww,
        wh,
        open: t,
      };
    }
    const { index, travel: t } = this.position(scroll);
    const a = this.frame(index, open);
    const camera = t > 0 ? travel(a, this.frame(index + 1, open), t, open.ww) : a;
    return { ...camera, ...open, open: 1 };
  }

  private currentScene(): Scene {
    return this.scene ?? this.guidedScene(this.smoothScroll);
  }

  /* ---------------- Motion ---------------- */

  private flyToScroll(scroll: number, instant = false, morph = false) {
    const target = clamp(scroll, 0, this.trackLength);
    const from = this.currentScene();
    // Reopening onto a far chapter is the same move as closing from it.
    const crossesWindow = target < this.openEnd !== this.smoothScroll < this.openEnd;
    const far = Math.abs(target - this.smoothScroll) > this.vh * 2.5;
    const useMorph = morph || (crossesWindow && far);
    window.scrollTo(0, this.trackTop + target);
    this.smoothScroll = target;
    if (instant) {
      this.flight = null;
      this.scene = null;
    } else {
      this.flight = { from, start: null, duration: useMorph ? MORPH_MS : FLIGHT_MS, morph: useMorph };
    }
    this.wake();
  }

  private flyCamera(to: Camera, duration = 800) {
    this.glide = null;
    this.rail = null;
    this.camFlight = { from: { ...this.explore }, to, start: performance.now(), duration: this.reduced.matches ? 1 : duration };
    this.wake();
  }

  private wake() {
    if (this.raf || !this.state.board) return;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private setDesktopInert(inert: boolean) {
    const desktop = this.nodes.stage.querySelector<HTMLElement>("[data-board-desktop]");
    if (desktop) desktop.inert = inert;
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (!this.state.board) return;
    const dt = Math.min(64, now - this.lastFrame);
    this.lastFrame = now;
    let busy = this.advanceMaximize(dt);
    if (this.advanceGlide(dt)) busy = true;
    if (this.advanceRail(dt)) busy = true;

    if (this.state.mode === "guided" && !this.state.overlay) {
      const target = this.scrollValue();
      const gap = target - this.smoothScroll;
      if (Math.abs(gap) > 0.4) {
        this.smoothScroll += gap * (1 - Math.exp(-dt / 75));
        busy = true;
      } else {
        this.smoothScroll = target;
      }
    }

    this.render(now);
    if (this.flight || this.camFlight) busy = true;
    if (busy) {
      this.lastFrame = now;
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  /** A flick keeps moving for a moment, like anything that has weight. */
  private advanceGlide(dt: number) {
    const glide = this.glide;
    if (!glide) return false;
    const { cx, cy, z } = this.explore;
    this.explore = { z, cx: cx + (glide.vx * dt) / z, cy: cy + (glide.vy * dt) / z };
    this.clampExplore();
    const decay = Math.exp(-dt / GLIDE_DECAY_MS);
    glide.vx *= decay;
    glide.vy *= decay;
    if (Math.hypot(glide.vx, glide.vy) < GLIDE_MIN_SPEED) this.glide = null;
    return true;
  }

  /** The camera on the path: the stops, and every point between two of them. */
  private railCamera(pos: number): Camera {
    const index = Math.floor(pos);
    const a = this.frame(index);
    const b = this.frame(Math.min(index + 1, STOPS.length - 1));
    const t = pos - index;
    return { cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, z: a.z + (b.z - a.z) * t };
  }

  /** Where the camera is along the path. The map is linear, so its x says it. */
  private pathPosition() {
    const { cx } = this.explore;
    for (let i = 0; i < STOPS.length - 1; i++) {
      const a = this.frame(i).cx;
      const b = this.frame(i + 1).cx;
      if (cx <= b) return i + clamp((cx - a) / Math.max(1, b - a), 0, 1);
    }
    return STOPS.length - 1;
  }

  private advanceRail(dt: number) {
    const rail = this.rail;
    if (!rail) return false;
    const to = this.railCamera(rail.pos);
    const { cx, cy, z } = this.explore;
    const k = this.reduced.matches ? 1 : 1 - Math.exp(-dt / (rail.held ? RAIL_FOLLOW_MS : RAIL_SETTLE_MS));
    this.explore = { cx: cx + (to.cx - cx) * k, cy: cy + (to.cy - cy) * k, z: z + (to.z - z) * k };
    const away = Math.hypot(to.cx - this.explore.cx, to.cy - this.explore.cy) * z > 0.5 || Math.abs(to.z - this.explore.z) > 0.0005;
    if (away) return true;
    this.explore = to;
    if (!rail.held) this.rail = null;
    return true;
  }

  private advanceMaximize(dt: number) {
    const target = this.state.maximized ? 1 : 0;
    if (this.maxBlend === target) return false;
    this.maxBlend = clamp(this.maxBlend + Math.sign(target - this.maxBlend) * (dt / MAXIMIZE_MS), 0, 1);
    return true;
  }

  private render(now: number) {
    let scene: Scene;

    if (this.state.overlay) {
      this.advanceCamera(now);
      scene = { ...this.explore, wx: 0, wy: 0, ww: this.vw, wh: this.vh, open: 1 };
      this.paint(scene);
      return;
    }

    if (this.state.mode === "explore") {
      this.advanceCamera(now);
      const open = this.openFrame();
      scene = { ...this.explore, ...open, open: 1 };
    } else {
      scene = this.guidedScene(this.smoothScroll);
      if (this.flight) {
        this.flight.start ??= now;
        const raw = (now - this.flight.start) / this.flight.duration;
        const t = easeInOut(clamp(raw, 0, 1));
        if (raw >= 1) this.flight = null;
        else if (this.flight.morph) scene = morphScene(this.flight.from, scene, t);
        else scene = mixScene(this.flight.from, scene, t, scene.ww);
      }
    }
    this.scene = scene;
    this.paint(scene);
  }

  private advanceCamera(now: number) {
    if (!this.camFlight) return;
    const f = this.camFlight;
    const raw = clamp((now - f.start) / f.duration, 0, 1);
    this.explore = travel(f.from, f.to, easeInOut(raw), this.vw);
    if (raw >= 1) this.camFlight = null;
  }

  /** The only place that writes the board to the DOM. */
  private paint(scene: Scene) {
    const { win, world, viewport, stage } = this.nodes;
    const vw = scene.ww;
    const vh = scene.wh - this.bar;
    const x = vw / 2 - scene.cx * scene.z;
    const y = vh / 2 - scene.cy * scene.z;
    this.cameraNow = { cx: scene.cx, cy: scene.cy, z: scene.z };

    if (!this.state.overlay) {
      win.style.left = `${scene.wx}px`;
      win.style.top = `${scene.wy}px`;
      win.style.width = `${scene.ww}px`;
      win.style.height = `${scene.wh}px`;
      stage.style.setProperty("--open", scene.open.toFixed(3));
    }

    if (!this.moving) {
      this.moving = true;
      world.style.willChange = "transform";
    }
    window.clearTimeout(this.idleTimer);
    // Back to crisp text once the camera rests.
    this.idleTimer = window.setTimeout(() => {
      this.moving = false;
      world.style.willChange = "";
    }, 160);

    world.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scene.z.toFixed(4)})`;
    world.style.opacity = scene.fade === undefined ? "" : scene.fade.toFixed(3);

    const minor = 44 * scene.z;
    const major = minor * 5;
    viewport.style.backgroundSize = `${major}px ${major}px, ${major}px ${major}px, ${minor}px ${minor}px, ${minor}px ${minor}px`;
    viewport.style.backgroundPosition = `${x}px ${y}px`;
    world.dataset.far = scene.z < 0.2 ? "true" : "false";

    this.paintStory(scene);
    this.paintHud(scene, vw, vh);
  }

  private paintStory(scene: Scene) {
    const exploring = this.state.mode === "explore" || this.state.overlay;
    const { index, travel: t, pos } = this.position(this.smoothScroll);
    const stopIndex = t > 0.5 ? index + 1 : index;
    const stop = STOPS[stopIndex];
    const isOpen = scene.open > 0.5;

    if (!exploring) {
      this.nodes.stage.dataset.open = String(isOpen);
      // Behind the scrim the desktop is scenery: it must not take keyboard focus.
      this.setDesktopInert(isOpen);
      this.setState({ station: stop.station, open: isOpen });
      this.stations.forEach((el, i) => {
        el.dataset.active = i === stop.station ? "true" : "false";
        if (i === stop.station) el.dataset.sub = String(stopIndex - STATION_FIRST_STOP[i]);
      });
      this.edges.forEach((e) => {
        const p = clamp((pos - e.from) / Math.max(0.001, e.to - e.from), 0, 1);
        e.el.style.strokeDashoffset = String(1 - p);
      });
    } else {
      const seen = this.nearestStationIndex();
      if (seen !== this.state.station) this.setState({ station: seen });
      this.stations.forEach((el) => {
        el.dataset.active = "true";
        el.dataset.sub = "9";
      });
      if (this.state.overlay && !this.reduced.matches) this.paintReveal();
      else this.edges.forEach((e) => (e.el.style.strokeDashoffset = "0"));
    }
  }

  /** Going forward, the line draws itself and each chapter appears when it gets there. */
  private paintReveal() {
    const { cx, z } = this.camFlight?.to ?? this.explore;
    const reach = cx + this.viewSize()[0] / (2 * z);
    if (reach <= this.reach) return;
    this.reach = reach;
    this.stations.forEach((el, i) => {
      if (STATIONS[i].x + REVEAL_MARGIN < reach) el.dataset.shown = "true";
    });
    this.edges.forEach((e, i) => {
      const [start, end] = this.edgeSpans[i];
      e.el.style.strokeDashoffset = String(1 - clamp((reach - start) / Math.max(1, end - start), 0, 1));
    });
  }

  private paintHud(scene: Scene, vw: number, vh: number) {
    // Looked up on every paint: React may mount and unmount these with the UI.
    const { win } = this.nodes;
    const zoom = win.querySelector<HTMLElement>("[data-hud=zoom]");
    const coords = win.querySelector<HTMLElement>("[data-hud=coords]");
    const progress = win.querySelector<HTMLElement>("[data-hud=progress]");
    const mini = win.querySelector<SVGRectElement>("[data-hud=mini]");
    const rail = win.querySelector<HTMLElement>("[data-hud=rail]");
    if (zoom) zoom.textContent = `${Math.round(scene.z * 100)}%`;
    if (coords) coords.textContent = `X ${Math.round(scene.cx)}  Y ${Math.round(scene.cy)}`;
    if (progress) {
      const pos = this.state.overlay ? this.nearestStop() : this.position(this.smoothScroll).pos;
      progress.style.transform = `scaleX(${pos / (STOPS.length - 1)})`;
    }
    if (rail) rail.style.setProperty("--rail", this.railPosition().toFixed(3));
    if (mini) {
      const w = vw / scene.z;
      const h = vh / scene.z;
      mini.setAttribute("x", String(scene.cx - w / 2));
      mini.setAttribute("y", String(scene.cy - h / 2));
      mini.setAttribute("width", String(w));
      mini.setAttribute("height", String(h));
    }
  }

  /** Continuous position along the chapters, for the index rail. */
  private railPosition() {
    if (this.state.mode === "explore" || this.state.overlay) return this.state.station;
    const { index, travel: t } = this.position(this.smoothScroll);
    const next = STOPS[Math.min(index + 1, STOPS.length - 1)];
    return lerp(STOPS[index].station, next.station, t);
  }

  private nearestStationIndex() {
    return STOPS[this.nearestStop()].station;
  }

  private nearestStop() {
    let best = 0;
    let bestDistance = Infinity;
    STOPS.forEach((s, i) => {
      const d = Math.hypot(s.rect.x + s.rect.w / 2 - this.cameraNow.cx, s.rect.y + s.rect.h / 2 - this.cameraNow.cy);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    return best;
  }

  /* ---------------- Explore ---------------- */

  private enterExplore() {
    if (this.state.mode === "explore" && !this.state.overlay) return;
    if (!this.state.overlay) {
      this.explore = { ...this.cameraNow };
      this.savedScroll = window.scrollY;
    }
    this.flight = null;
    this.setExploreListeners(true);
    this.nodes.stage.dataset.mode = "explore";
    this.setState({ mode: "explore" });
    this.wake();
  }

  private leaveExplore() {
    this.camFlight = null;
    this.rail = null;
    this.setExploreListeners(false);
    delete this.nodes.stage.dataset.mode;
    this.setState({ mode: "guided" });
  }

  private exploreAbort: AbortController | null = null;

  private setExploreListeners(on: boolean) {
    this.exploreAbort?.abort();
    this.exploreAbort = null;
    if (!on) return;
    this.exploreAbort = new AbortController();
    const { signal } = this.exploreAbort;
    this.nodes.stage.addEventListener("wheel", this.onWheel, { passive: false, signal });
    this.nodes.stage.addEventListener("gesturestart", this.onGestureStart as EventListener, { signal });
    this.nodes.stage.addEventListener("gesturechange", this.onGestureChange as EventListener, { signal });
  }

  private zoomAt(clientX: number, clientY: number, z: number) {
    const rect = this.nodes.viewport.getBoundingClientRect();
    const px = clientX - rect.left - rect.width / 2;
    const py = clientY - rect.top - rect.height / 2;
    const next = clamp(z, MIN_ZOOM, MAX_ZOOM);
    this.rail = null;
    const c = this.explore;
    this.explore = {
      z: next,
      cx: c.cx + px / c.z - px / next,
      cy: c.cy + py / c.z - py / next,
    };
    this.clampExplore();
    this.wake();
  }

  private panBy(dx: number, dy: number) {
    this.camFlight = null;
    this.rail = null;
    this.explore = { ...this.explore, cx: this.explore.cx + dx / this.explore.z, cy: this.explore.cy + dy / this.explore.z };
    this.clampExplore();
    this.wake();
  }

  private clampExplore() {
    this.explore.cx = clamp(this.explore.cx, WORLD.x, WORLD.x + WORLD.w);
    this.explore.cy = clamp(this.explore.cy, WORLD.y, WORLD.y + WORLD.h);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.camFlight = null;
    if (e.ctrlKey || e.metaKey) {
      this.zoomAt(e.clientX, e.clientY, this.explore.z * Math.exp(-e.deltaY * 0.0028));
    } else {
      // The map runs sideways: the wheel always moves along the path.
      this.panBy(e.deltaX + e.deltaY, 0);
    }
  };

  private gestureZoom = 1;
  private onGestureStart = (e: Event) => {
    e.preventDefault();
    this.gestureZoom = this.explore.z;
  };
  private onGestureChange = (e: Event & { scale?: number; clientX?: number; clientY?: number }) => {
    e.preventDefault();
    this.zoomAt(e.clientX ?? this.vw / 2, e.clientY ?? this.vh / 2, this.gestureZoom * (e.scale ?? 1));
  };

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || !this.state.board) return;
    const stoppedGlide = this.glide !== null || this.rail !== null;
    this.glide = null;
    this.rail = null;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // A tap is one finger, on the map, that was not stopping it.
    const canvas = !(e.target as HTMLElement).closest(`${NO_PAN_CONTROLS},[data-board-ui]`);
    this.tapStart = this.state.overlay && canvas && !stoppedGlide && this.pointers.size === 1 ? { id: e.pointerId, x: e.clientX, y: e.clientY } : null;
    const target = e.target as HTMLElement;
    const exploring = this.state.mode === "explore";

    if (this.pointers.size === 2 && exploring) {
      const [a, b] = [...this.pointers.values()];
      this.pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y), z: this.explore.z };
      this.drag = null;
      return;
    }

    const note = target.closest<HTMLElement>("[data-movable]");
    if (this.state.open && !this.state.overlay && note && !target.closest("a,button,summary,iframe")) {
      const style = getComputedStyle(note);
      this.note = {
        el: note,
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        mx: parseFloat(style.getPropertyValue("--mx")) || 0,
        my: parseFloat(style.getPropertyValue("--my")) || 0,
      };
      note.dataset.dragging = "true";
      e.preventDefault();
      return;
    }

    if (target.closest(this.state.overlay ? NO_PAN_CONTROLS : NO_PAN)) return;
    // The chrome floating over the board is not canvas.
    if (target.closest("[data-board-ui]")) return;
    if (!exploring && !this.state.open) return;
    this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, viaGuided: !exploring };
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.pointers.has(e.pointerId)) this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this.pinch && this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      this.zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, this.pinch.z * (distance / this.pinch.distance));
      return;
    }

    if (this.note && e.pointerId === this.note.id) {
      const z = this.cameraNow.z;
      const mx = this.note.mx + (e.clientX - this.note.x) / z;
      const my = this.note.my + (e.clientY - this.note.y) / z;
      this.note.el.style.setProperty("--mx", `${mx}px`);
      this.note.el.style.setProperty("--my", `${my}px`);
      return;
    }

    const drag = this.drag;
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      drag.moved = true;
      if (drag.viaGuided) this.enterExplore();
      this.nodes.stage.dataset.dragging = "true";
      // Up and down is the scroll of the map. Sideways, or looking closely, the finger just pans.
      if (this.state.overlay && Math.abs(dy) > Math.abs(dx) && this.explore.z <= this.frame(this.nearestStop()).z * RAIL_MAX_ZOOM) {
        drag.rail = true;
        this.camFlight = null;
        this.rail = { pos: this.pathPosition(), held: true };
      }
    }
    drag.x = e.clientX;
    drag.y = e.clientY;
    if (drag.rail && this.rail) {
      this.rail.pos = clamp(this.rail.pos - dy / RAIL_STEP_PX, 0, STOPS.length - 1);
      this.wake();
    } else {
      this.panBy(-dx, -dy);
    }
    if (this.state.overlay) {
      // Event time, not handler time: after a busy moment queued moves would all look instant.
      const elapsed = Math.max(8, e.timeStamp - this.panTrack.t);
      const blend = (old: number, next: number) => clamp(old * 0.4 + (next / elapsed) * 0.6, -GLIDE_MAX_SPEED, GLIDE_MAX_SPEED);
      this.panTrack = { t: e.timeStamp, vx: blend(this.panTrack.vx, -dx), vy: blend(this.panTrack.vy, -dy) };
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinch = null;
    const tap = this.tapStart;
    if (tap && tap.id === e.pointerId) {
      this.tapStart = null;
      const still = e.type === "pointerup" && !this.drag?.moved && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < DOUBLE_TAP_PX;
      if (still) this.onTap(e);
    }
    if (this.note && e.pointerId === this.note.id) {
      delete this.note.el.dataset.dragging;
      this.note = null;
    }
    if (this.drag && e.pointerId === this.drag.id) {
      if (this.drag.moved) this.suppressClick = true;
      if (this.drag.rail && this.rail) {
        // It rests on a stop. A flick goes on to the next one, however short it was.
        const speed = e.type === "pointerup" && e.timeStamp - this.panTrack.t < 120 ? this.panTrack.vy : 0;
        const stop = speed > RAIL_FLICK_SPEED ? Math.ceil(this.rail.pos) : speed < -RAIL_FLICK_SPEED ? Math.floor(this.rail.pos) : Math.round(this.rail.pos);
        this.overlayStop = clamp(stop, 0, STOPS.length - 1);
        this.rail = { pos: this.overlayStop, held: false };
        this.wake();
      } else if (this.state.overlay && this.drag.moved && !this.reduced.matches && e.timeStamp - this.panTrack.t < 120) {
        this.glide = { vx: this.panTrack.vx, vy: this.panTrack.vy };
        this.wake();
      }
      this.drag = null;
      delete this.nodes.stage.dataset.dragging;
    }
  };

  /** Two taps on the same spot: closer to it, or back to the whole chapter. */
  private onTap(e: PointerEvent) {
    const last = this.lastTap;
    const again = e.timeStamp - last.t < DOUBLE_TAP_MS && Math.hypot(e.clientX - last.x, e.clientY - last.y) < DOUBLE_TAP_PX;
    if (!again) {
      this.lastTap = { t: e.timeStamp, x: e.clientX, y: e.clientY };
      return;
    }
    this.lastTap = { t: 0, x: 0, y: 0 };
    const base = this.frame(this.nearestStop());
    const { cx, cy, z } = this.explore;
    if (z > base.z * 1.5) return this.flyCamera(base, 420);
    const rect = this.nodes.viewport.getBoundingClientRect();
    this.flyCamera(
      {
        cx: cx + (e.clientX - rect.left - rect.width / 2) / z,
        cy: cy + (e.clientY - rect.top - rect.height / 2) / z,
        z: Math.min(1, base.z * 2.6),
      },
      420,
    );
  }

  private onClickCapture = (e: MouseEvent) => {
    if (!this.suppressClick) return;
    this.suppressClick = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /* ---------------- Input ---------------- */

  private onScroll = () => {
    if (!this.state.board) return;
    if (this.state.mode === "explore" && !this.state.overlay) {
      // Scrollbar or keyboard moved the page: the document wins, nobody gets trapped.
      if (Math.abs(window.scrollY - this.savedScroll) > 48) {
        const from = this.currentScene();
        this.leaveExplore();
        this.flight = { from, start: null, duration: 500 };
      } else {
        return;
      }
    }
    this.wake();
  };

  private onKey = (e: KeyboardEvent) => {
    if (!this.state.board) return;
    const target = e.target as HTMLElement;
    if (target.closest("input,textarea,select,[contenteditable],.sys-menus,.sys-sound")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const exploring = this.state.mode === "explore";

    if (e.key === "Escape") {
      if (this.state.overlay) this.closeOverlay();
      else if (exploring) this.resumeGuided(false);
      else if (this.state.open) this.close();
      return;
    }
    if (exploring) {
      const pan = 90;
      const keys: Record<string, () => void> = {
        ArrowLeft: () => this.panBy(-pan, 0),
        ArrowRight: () => this.panBy(pan, 0),
        ArrowUp: () => this.panBy(0, -pan),
        ArrowDown: () => this.panBy(0, pan),
        "+": () => this.zoomBy(1.25),
        "=": () => this.zoomBy(1.25),
        "-": () => this.zoomBy(0.8),
        "0": () => this.zoomReset(),
      };
      if (keys[e.key]) {
        e.preventDefault();
        keys[e.key]();
      }
      return;
    }
    if (this.state.open && e.key === "ArrowRight") {
      e.preventDefault();
      this.step(1);
    } else if (this.state.open && e.key === "ArrowLeft") {
      e.preventDefault();
      this.step(-1);
    }
  };

  /** Keyboard focus moved into a station that is off camera: bring it into view. */
  private onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (!this.followFocus || !this.state.board || !target.matches(":focus-visible")) return;
    const station = target.closest<HTMLElement>("[data-station]");
    if (!station) return;
    const index = this.stations.indexOf(station);
    if (index >= 0 && index !== this.state.station) {
      if (index === 0) this.close();
      else this.goToStop(STATION_FIRST_STOP[index]);
    }
  };

  private setState(patch: Partial<BoardState>) {
    let changed = false;
    for (const key of Object.keys(patch) as (keyof BoardState)[]) {
      if (this.state[key] !== patch[key]) changed = true;
    }
    if (!changed) return;
    const prev = this.state;
    this.state = { ...prev, ...patch };
    this.onChange(this.state);
    if (this.state.station !== prev.station && this.state.board) this.onChapter(this.state.station);
    if (this.state.open !== prev.open) this.onOpenChange(this.state.open);
  }
}
