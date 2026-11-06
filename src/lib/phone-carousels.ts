import { isPhoneOs, motion } from "@/lib/phone-os";

/**
 * Every sideways list on the phone drifts on its own, in a loop with no end.
 * A finger stops it to read and can drag it. Left alone, it starts again.
 * Items are copied once at the end of the list, and each one runs the same
 * compositor animation, so the jump back to the start cannot be seen.
 */

const SELECTOR = ".fit-group ul,.tired ul,.outcome-list,.video-grid";
/** Drift, in px/s: slow enough to read a card as it goes by. */
const SPEED = 26;
const RESUME_MS = 5000;
const TAP_PX = 8;
const GLIDE_DECAY_MS = 280;
const GLIDE_MIN_SPEED = 0.03;
/** Far enough into the loop that dragging backwards never reaches its start. */
const HEADROOM = 1000;

class Loop {
  private items: HTMLElement[] = [];
  private animations: Animation[] = [];
  private distance = 0;
  private visible = false;
  private held = false;
  private focused = false;
  private moved = 0;
  private lastX = 0;
  private lastTime = 0;
  private speed = 0;
  private timer = 0;
  private frame = 0;
  private pointer: number | null = null;
  private listeners = new AbortController();
  private resize: ResizeObserver | null = null;

  constructor(private el: HTMLElement) {}

  /** Runs once, the first time the list is really on screen and has a size. */
  private build() {
    const { el } = this;
    if (this.items.length || el.scrollWidth <= el.clientWidth + 4) return false;
    this.items = Array.from(el.children) as HTMLElement[];
    this.items.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.dataset.clone = "";
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
      clone.querySelectorAll("a,button").forEach((node) => node.setAttribute("tabindex", "-1"));
      el.append(clone);
    });
    el.dataset.loop = "on";
    const { signal } = this.listeners;
    el.addEventListener("pointerdown", this.onDown, { signal });
    el.addEventListener("pointermove", this.onMove, { signal });
    // Out here, because a drag can end anywhere. Capturing it would take the tap away from the cards.
    window.addEventListener("pointerup", this.onUp, { signal });
    window.addEventListener("pointercancel", this.onUp, { signal });
    el.addEventListener("focusin", () => this.setFocused(true), { signal });
    el.addEventListener("focusout", () => this.setFocused(false), { signal });
    el.addEventListener("click", this.onClick, { signal, capture: true });
    this.resize = new ResizeObserver(() => this.run());
    this.resize.observe(el);
    return true;
  }

  /** Starts the drift. On a new size it keeps its place in the loop. */
  run() {
    if (!this.items.length || !isPhoneOs()) return;
    const clone = this.el.children[this.items.length] as HTMLElement;
    const distance = clone.offsetLeft - this.items[0].offsetLeft;
    if (distance <= 0) return this.stop();
    if (distance === this.distance && this.animations.length) return;
    const duration = (distance / SPEED) * 1000;
    const start = this.animations[0];
    const loop = start ? Number(start.currentTime) / (this.distance / SPEED) / 1000 : HEADROOM;
    this.stop();
    this.distance = distance;
    const children = Array.from(this.el.children) as HTMLElement[];
    this.animations = children.map((child) => {
      const animation = child.animate([{ transform: "none" }, { transform: `translateX(${-distance}px)` }], { duration, iterations: Infinity, easing: "linear" });
      animation.currentTime = loop * duration;
      return animation;
    });
    this.sync();
  }

  /** The map uses these same sections, without any of this. */
  stop() {
    this.animations.forEach((animation) => animation.cancel());
    this.animations = [];
    this.distance = 0;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible && this.build()) this.run();
    this.sync();
  }

  private setFocused(focused: boolean) {
    this.focused = focused;
    this.sync();
  }

  private sync() {
    const go = this.visible && !this.held && !this.focused && !this.timer && !this.frame;
    this.animations.forEach((animation) => (go ? animation.play() : animation.pause()));
  }

  private shift(ms: number) {
    this.animations.forEach((animation) => (animation.currentTime = Number(animation.currentTime) + ms));
  }

  private resumeLater() {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.timer = 0;
      this.sync();
    }, RESUME_MS);
    this.sync();
  }

  private onDown = (e: PointerEvent) => {
    this.pointer = e.pointerId;
    this.held = true;
    this.moved = 0;
    this.speed = 0;
    this.lastX = e.clientX;
    this.lastTime = e.timeStamp;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    window.clearTimeout(this.timer);
    this.timer = 0;
    this.sync();
  };

  private onMove = (e: PointerEvent) => {
    if (e.pointerId !== this.pointer) return;
    const dx = e.clientX - this.lastX;
    const elapsed = Math.max(8, e.timeStamp - this.lastTime);
    this.moved += Math.abs(dx);
    this.speed = this.speed * 0.4 + (dx / elapsed) * 0.6;
    this.lastX = e.clientX;
    this.lastTime = e.timeStamp;
    this.shift((-dx / SPEED) * 1000);
  };

  private onUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointer) return;
    this.pointer = null;
    this.held = false;
    // The page took the gesture to scroll: nobody asked this list to stop.
    if (e.type === "pointercancel" && this.moved < TAP_PX) return this.sync();
    if (Math.abs(this.speed) > GLIDE_MIN_SPEED) this.glide(performance.now());
    this.resumeLater();
  };

  private glide(now: number) {
    this.frame = requestAnimationFrame((time) => {
      const dt = Math.min(64, time - now);
      this.shift(((-this.speed * dt) / SPEED) * 1000);
      this.speed *= Math.exp(-dt / GLIDE_DECAY_MS);
      this.frame = 0;
      if (Math.abs(this.speed) > GLIDE_MIN_SPEED) this.glide(time);
      else this.sync();
    });
  }

  private onClick = (e: MouseEvent) => {
    // A keyboard or a screen reader clicks with no pointer: what the last drag did is not about it.
    if (e.detail !== 0 && this.moved >= TAP_PX) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    // A copy has no behavior of its own: what it does is what the original does.
    const clone = (e.target as Element).closest<HTMLElement>("[data-clone]");
    const hit = (e.target as Element).closest("a,button");
    if (!clone || !hit) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const original = this.items[Array.from(this.el.children).indexOf(clone) - this.items.length];
    const same = Array.from(clone.querySelectorAll("a,button")).indexOf(hit);
    original?.querySelectorAll<HTMLElement>("a,button")[same]?.click();
  };

  destroy() {
    this.listeners.abort();
    this.resize?.disconnect();
    this.stop();
    window.clearTimeout(this.timer);
    cancelAnimationFrame(this.frame);
    this.el.querySelectorAll(":scope > [data-clone]").forEach((clone) => clone.remove());
    delete this.el.dataset.loop;
  }
}

/** Starts every list when it comes into view. Returns what stops them. */
export function startCarousels() {
  if (!motion()) return () => {};
  const loops = new Map<Element, Loop>();
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => loops.set(el, new Loop(el)));

  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => loops.get(entry.target)?.setVisible(entry.isIntersecting));
  });
  loops.forEach((_, el) => seen.observe(el));

  // The phone map shows these same sections as they are.
  const mode = new MutationObserver(() => {
    const phone = isPhoneOs();
    loops.forEach((loop) => (phone ? loop.run() : loop.stop()));
  });
  mode.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  return () => {
    seen.disconnect();
    mode.disconnect();
    loops.forEach((loop) => loop.destroy());
  };
}
