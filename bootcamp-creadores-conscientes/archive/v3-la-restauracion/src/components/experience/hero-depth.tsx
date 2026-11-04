"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(p, 0.0, 1.0); }
`;

/**
 * 2.5D camera over a flat picture. Every pixel moves according to a hand-painted
 * depth map, so Santiago, the building and the clouds separate as the page
 * scrolls or the pointer moves. On top: drifting fog and floating dust.
 */
const FRAG = `
precision mediump float;
uniform sampler2D uImg;
uniform sampler2D uDepth;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 focus = vec2(0.5, 0.42);
  float zoom = 1.0 + uScroll * 0.34;
  vec2 uv = (vUv - focus) / zoom + focus;

  vec2 shift = uPointer * 0.02 + vec2(0.0, uScroll * 0.038);
  float d = texture2D(uDepth, uv).r;
  d = texture2D(uDepth, uv + shift * (d - 0.32) * 0.6).r;
  vec2 st = uv + shift * (d - 0.32);

  vec3 c = texture2D(uImg, st).rgb;

  // Fog low in the frame, sliding between the mountains.
  float band = smoothstep(0.58, 0.8, vUv.y) * (1.0 - smoothstep(0.84, 0.98, vUv.y));
  float fog = fbm(vec2(vUv.x * 3.2 + uTime * 0.035, vUv.y * 5.0 - uTime * 0.02));
  c += vec3(0.62, 0.52, 0.38) * band * smoothstep(0.42, 0.82, fog) * 0.36;

  // Slow light across the sky behind him.
  float sky = 1.0 - smoothstep(0.1, 0.5, vUv.y);
  float beam = smoothstep(0.42, 0.5, sin(vUv.x * 2.4 + vUv.y * 1.4 - uTime * 0.16) * 0.5 + 0.5) * sky;
  c += vec3(0.5, 0.36, 0.2) * beam * fbm(vUv * 4.0 + uTime * 0.03) * 0.13;

  // Dust: a drifting grid of tiny lights, nearer ones in front.
  vec2 g = vec2(vUv.x * 26.0, vUv.y * 30.0 + uTime * 0.22);
  vec2 id = floor(g);
  vec2 fr = fract(g) - 0.5;
  float seed = hash(id);
  vec2 at = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
  float twinkle = 0.5 + 0.5 * sin(uTime * (1.0 + seed * 2.0) + seed * 40.0);
  float mote = step(0.86, seed) * smoothstep(0.075, 0.0, length(fr - at * 0.8)) * twinkle;
  c += vec3(0.95, 0.8, 0.55) * mote * 0.75;

  // Melt every edge into the page, so the picture has no border at any size.
  float edge = smoothstep(0.0, 0.14, vUv.x) * (1.0 - smoothstep(0.86, 1.0, vUv.x));
  edge *= smoothstep(0.0, 0.09, vUv.y) * (1.0 - smoothstep(0.84, 1.0, vUv.y));
  gl_FragColor = vec4(c * edge, edge);
}
`;

function shader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function HeroDepth({
  image,
  depth,
  alt,
  progress,
}: {
  image: string;
  depth: string;
  alt: string;
  progress: MotionValue<number>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, shader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

    const u = {
      pointer: gl.getUniformLocation(program, "uPointer"),
      scroll: gl.getUniformLocation(program, "uScroll"),
      time: gl.getUniformLocation(program, "uTime"),
    };

    const texture = (unit: number, img: HTMLImageElement, name: string) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(gl.getUniformLocation(program, name), unit);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let frame = 0;
    let visible = true;
    let ready = false;
    const start = performance.now();

    const draw = () => {
      frame = 0;
      if (!visible || !ready || document.hidden) return;
      const t = (performance.now() - start) / 1000;
      // With no pointer around (phones) the camera drifts by itself.
      const idleX = Math.sin(t * 0.45) * 0.28;
      const idleY = Math.cos(t * 0.33) * 0.16;
      pointer.x += (target.x + idleX - pointer.x) * 0.06;
      pointer.y += (target.y + idleY - pointer.y) * 0.06;
      gl.uniform2f(u.pointer, pointer.x, pointer.y);
      gl.uniform1f(u.scroll, progress.get());
      gl.uniform1f(u.time, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(cv);
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", kick);

    let cancelled = false;
    Promise.all([load(image), load(depth)])
      .then(([img, map]) => {
        if (cancelled) return;
        texture(0, img, "uImg");
        texture(1, map, "uDepth");
        resize();
        ready = true;
        kick();
        cv.classList.add("is-live");
        // The canvas melts into whatever is behind it, so the flat copy must go.
        const flat = cv.previousElementSibling as HTMLElement | null;
        if (flat) flat.style.opacity = "0";
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", kick);
    };
  }, [image, depth, progress]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- flat fallback under the live canvas */}
      <img src={image} alt={alt} fetchPriority="high" />
      <canvas ref={canvas} aria-hidden />
    </>
  );
}
