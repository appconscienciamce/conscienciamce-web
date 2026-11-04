"use client";

import { useEffect } from "react";

/**
 * One observer for the whole page. [data-reveal] elements get `is-visible`
 * once on screen; [data-hero] gets `is-ready` after first paint.
 * Everything here is decorative: if it never runs, content stays visible.
 */
export function MotionController() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    let disconnect: (() => void) | undefined;

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0 },
      );
      targets.forEach((el) => io.observe(el));

      // A fast scroll or an anchor jump can carry an element past the screen
      // between two observer samples. Anything already above the fold must show.
      let last = 0;
      const sweep = () => {
        const now = performance.now();
        if (now - last < 160) return;
        last = now;
        for (const el of targets) {
          if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        }
      };
      window.addEventListener("scroll", sweep, { passive: true });
      disconnect = () => {
        io.disconnect();
        window.removeEventListener("scroll", sweep);
      };
    }

    const frame = requestAnimationFrame(() => {
      document.querySelector("[data-hero]")?.classList.add("is-ready");
    });

    return () => {
      disconnect?.();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
