import type { Rect } from "./layout";

/** Camera over the world: `cx,cy` is the world point at the center of the view. */
export interface Camera {
  cx: number;
  cy: number;
  z: number;
}

/** Everything the guided timeline drives: window frame plus camera. */
export interface Scene extends Camera {
  wx: number;
  wy: number;
  ww: number;
  wh: number;
  /** 0 = desktop, 1 = map open. */
  open: number;
  /** World opacity during a morph. Absent the rest of the time. */
  fade?: number;
}

export interface Padding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const MIN_ZOOM = 0.03;
export const MAX_ZOOM = 2;
const MAX_FIT_ZOOM = 1.3;

/** Camera that frames `rect` inside a view of `vw × vh`. */
export function fit(rect: Rect, vw: number, vh: number, pad: Padding, maxZoom = MAX_FIT_ZOOM): Camera {
  const availableW = Math.max(1, vw - pad.left - pad.right);
  const availableH = Math.max(1, vh - pad.top - pad.bottom);
  const z = clamp(Math.min(availableW / rect.w, availableH / rect.h), MIN_ZOOM, maxZoom);
  return {
    z,
    // Shift so the padded area, not the raw view, is what gets centered.
    cx: rect.x + rect.w / 2 - (pad.left - pad.right) / (2 * z),
    cy: rect.y + rect.h / 2 + (pad.bottom - pad.top) / (2 * z),
  };
}

/**
 * Moves between two framings. Zoom is interpolated in log space so that going
 * to and from the overview feels constant, and long flights pull back a bit
 * so the reader sees where they are going.
 */
export function travel(a: Camera, b: Camera, t: number, vw: number): Camera {
  const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), t));
  const ratio = Math.max(a.z, b.z) / Math.min(a.z, b.z);
  const distance = Math.hypot(a.cx - b.cx, a.cy - b.cy) * Math.min(a.z, b.z);
  const screens = distance / Math.max(1, vw);
  const dip = ratio > 2.5 ? 0 : Math.min(0.42, 0.14 * screens) * Math.sin(Math.PI * t);
  return { cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), z: z * (1 - dip) };
}

/**
 * Resizes the window between two scenes without flying the camera across the
 * map: the content scales with the frame, fades out and comes back as the other
 * scene. A long jump would otherwise be a blur of chapters.
 */
export function morphScene(a: Scene, b: Scene, t: number): Scene {
  const ww = lerp(a.ww, b.ww, t);
  const source = t < 0.5 ? a : b;
  return {
    cx: source.cx,
    cy: source.cy,
    z: source.z * (ww / source.ww),
    wx: lerp(a.wx, b.wx, t),
    wy: lerp(a.wy, b.wy, t),
    ww,
    wh: lerp(a.wh, b.wh, t),
    open: lerp(a.open, b.open, t),
    fade: clamp(Math.abs(t - 0.5) * 3 - 0.25, 0, 1),
  };
}

export function mixScene(a: Scene, b: Scene, t: number, vw: number): Scene {
  return {
    ...travel(a, b, t, vw),
    wx: lerp(a.wx, b.wx, t),
    wy: lerp(a.wy, b.wy, t),
    ww: lerp(a.ww, b.ww, t),
    wh: lerp(a.wh, b.wh, t),
    open: lerp(a.open, b.open, t),
  };
}
