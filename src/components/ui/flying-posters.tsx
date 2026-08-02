'use client';

import { useEffect, useRef } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import type { OGLRenderingContext } from 'ogl';

/**
 * FlyingPosters from React Bits.
 *
 * Two changes from the published source, both about not hijacking the page:
 *   - the original binds wheel/mouse/touch listeners to `window` and calls
 *     preventDefault on wheel, which would take over scrolling for the whole
 *     document. Here the columns follow the page's own scroll position instead.
 *   - the preloader's `loading`/`loaded` classes on <html> are dropped; nothing
 *     in this project reads them.
 */

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uPosition;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                               0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5 ? 16.0 * pow(t, 5.0) : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;

  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  float imageAspect = uImageSize.x / uImageSize.y;
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  vec2 scale = vec2(1.0);

  if (planeAspect > imageAspect) {
    scale.x = imageAspect / planeAspect;
  } else {
    scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;
  vec4 colour = texture2D(tMap, uv);
  gl_FragColor = vec4(colour.rgb, colour.a * uOpacity);
}
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const map = (n: number, a1: number, b1: number, a2: number, b2: number) =>
  ((n - a1) / (b1 - a1)) * (b2 - a2) + a2;

type Viewport = { width: number; height: number };
type Screen = { width: number; height: number };

class Media {
  extra = 0;
  plane!: Mesh;
  program!: Program;
  padding = 5;
  height = 0;
  heightTotal = 0;
  y = 0;

  constructor(
    private opts: {
      gl: OGLRenderingContext;
      geometry: Plane;
      scene: Transform;
      screen: Screen;
      viewport: Viewport;
      image: string;
      length: number;
      index: number;
      planeWidth: number;
      planeHeight: number;
      distortion: number;
      opacity: number;
    }
  ) {
    this.createShader();
    this.createMesh();
    this.onResize({});
  }

  private createShader() {
    const { gl, viewport, distortion, image, opacity } = this.opts;
    const texture = new Texture(gl, { generateMipmaps: false });

    this.program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      transparent: true,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uOpacity: { value: opacity },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: distortion },
        uViewportSize: { value: [viewport.width, viewport.height] },
      },
      cullFace: false,
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  private createMesh() {
    this.plane = new Mesh(this.opts.gl, {
      geometry: this.opts.geometry,
      program: this.program,
    });
    this.plane.setParent(this.opts.scene);
  }

  private setScale() {
    const { viewport, screen, planeWidth, planeHeight } = this.opts;
    this.plane.scale.x = (viewport.width * planeWidth) / screen.width;
    this.plane.scale.y = (viewport.height * planeHeight) / screen.height;
    this.plane.position.x = 0;
    this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  onResize({ screen, viewport }: { screen?: Screen; viewport?: Viewport }) {
    if (screen) this.opts.screen = screen;
    if (viewport) {
      this.opts.viewport = viewport;
      this.plane.program.uniforms.uViewportSize.value = [viewport.width, viewport.height];
    }
    this.setScale();

    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.opts.length;
    this.y = -this.heightTotal / 2 + (this.opts.index + 0.5) * this.height;
  }

  update(scroll: { current: number }) {
    this.plane.position.y = this.y - scroll.current - this.extra;

    const { viewport } = this.opts;
    const position = map(this.plane.position.y, -viewport.height, viewport.height, 5, 15);
    this.program.uniforms.uPosition.value = position;

    const half = this.plane.scale.y / 2;
    if (this.plane.position.y + half < -viewport.height / 2) this.extra -= this.heightTotal;
    else if (this.plane.position.y - half > viewport.height / 2) this.extra += this.heightTotal;
  }
}

export default function FlyingPosters({
  items = [],
  planeWidth = 320,
  planeHeight = 320,
  distortion = 3,
  scrollEase = 0.05,
  cameraFov = 45,
  cameraZ = 20,
  opacity = 1,
  className = '',
}: {
  items?: string[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  opacity?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const scroll = { ease: scrollEase, current: 0, target: 0 };

    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    const gl = renderer.gl;

    const camera = new Camera(gl);
    camera.fov = cameraFov;
    camera.position.z = cameraZ;

    const scene = new Transform();
    const geometry = new Plane(gl, { heightSegments: 1, widthSegments: 100 });

    let screen: Screen = { width: 0, height: 0 };
    let viewport: Viewport = { width: 0, height: 0 };
    let medias: Media[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      screen = { width: rect.width, height: rect.height };
      renderer.setSize(screen.width, screen.height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });

      const fov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * camera.position.z;
      viewport = { height, width: height * camera.aspect };

      medias.forEach((media) => media.onResize({ screen, viewport }));
    };

    resize();

    medias = items.map(
      (image, index) =>
        new Media({
          gl,
          geometry,
          scene,
          screen,
          viewport,
          image,
          length: items.length,
          index,
          planeWidth,
          planeHeight,
          distortion,
          opacity,
        })
    );

    // Follow the page's scroll rather than capturing wheel events, so the
    // column moves with the reader instead of trapping them.
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      scroll.target = progress * 14;
    };

    const update = () => {
      scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
      medias.forEach((media) => media.update(scroll));
      renderer.render({ scene, camera });
      frame = requestAnimationFrame(update);
    };

    onScroll();
    scroll.current = scroll.target;
    update();

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ, opacity]);

  return (
    <div ref={containerRef} className={`posters-container ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="posters-canvas" />
    </div>
  );
}
