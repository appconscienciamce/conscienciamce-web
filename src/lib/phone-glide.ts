/**
 * A wheel on the phone reading (a narrow window on a computer) scrolls the board in
 * notches of about 100px: the page jumps. Here it glides to where the notches add up,
 * on a spring: each notch starts softly, gathers speed and settles, and the speed
 * carries from one notch to the next instead of kicking at every one.
 * Only the wheel goes through here. A finger, the keyboard, the scrollbar and a jump
 * to a chapter move the board as they always did; this one notices and steps aside.
 */

/** Stiffness of the spring, in rad/s. Critically damped: it settles in about 6.6 / ω seconds. */
const STIFFNESS = 7;
/** Share of each notch that is travelled: a little less than the wheel asks, for a slower read. */
const NOTCH = 0.85;
/** Closer than this, in px, and slower than this, in px/s, it has landed. */
const LANDED_PX = 0.4;
const LANDED_SPEED = 4;
/** A board moved by more than this since the last frame was moved by someone else. */
const TAKEN_PX = 2;

interface Glide {
  el: HTMLElement;
  /** Where the notches add up to, where it is on its way there, and how fast it goes. */
  target: number;
  position: number;
  velocity: number;
  /** What it last wrote: a different scrollTop means someone else moved the board. */
  written: number;
  frame: number;
  last: number;
}

let glide: Glide | null = null;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function frame(now: number) {
  const g = glide;
  if (!g) return;
  if (Math.abs(g.el.scrollTop - g.written) > TAKEN_PX) {
    glide = null;
    return;
  }
  const dt = Math.min(0.05, (now - g.last) / 1000);
  g.last = now;
  // In small steps, so the spring stays steady on a slow frame.
  const steps = 4;
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    g.velocity += (STIFFNESS * STIFFNESS * (g.target - g.position) - 2 * STIFFNESS * g.velocity) * h;
    g.position += g.velocity * h;
  }
  const max = g.el.scrollHeight - g.el.clientHeight;
  if (g.position <= 0 || g.position >= max) {
    g.position = clamp(g.position, 0, max);
    g.velocity = 0;
  }
  const landed = Math.abs(g.target - g.position) < LANDED_PX && Math.abs(g.velocity) < LANDED_SPEED;
  if (landed) g.position = g.target;
  g.el.scrollTop = g.position;
  g.written = g.el.scrollTop;
  if (landed) {
    g.frame = 0;
    return;
  }
  g.frame = requestAnimationFrame(frame);
}

/** Adds a wheel's notch to where the board is going. */
export function glideBy(el: HTMLElement, dy: number) {
  // A new board, or one someone else moved since: start from where it really is, at rest.
  if (!glide || glide.el !== el || Math.abs(el.scrollTop - glide.written) > TAKEN_PX) {
    stopGlide();
    glide = { el, target: el.scrollTop, position: el.scrollTop, velocity: 0, written: el.scrollTop, frame: 0, last: 0 };
  }
  glide.target = clamp(glide.target + dy * NOTCH, 0, el.scrollHeight - el.clientHeight);
  if (!glide.frame) {
    glide.last = performance.now();
    glide.frame = requestAnimationFrame(frame);
  }
}

/** Where this board is going, not where it is on the way: a gesture starting now starts from there. */
export function glideTarget(el: HTMLElement) {
  return glide?.el === el ? glide.target : el.scrollTop;
}

export function stopGlide() {
  if (glide?.frame) cancelAnimationFrame(glide.frame);
  glide = null;
}
