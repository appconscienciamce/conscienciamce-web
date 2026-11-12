"use client";

import { useEffect } from "react";
import { holdOpen, isPhoneOs } from "@/lib/phone-os";
import { startColor } from "@/lib/phone-color";
import { startReveal } from "@/lib/phone-reveal";

/** The sticky buy button stays out of the way while the hero's own button is on screen. */
function watchHeroButton() {
  const win = document.querySelector<HTMLElement>(".canvas");
  const hero = document.querySelector<HTMLElement>(".ads-hero-cta");
  const root = document.documentElement;
  if (!win || !hero) {
    root.setAttribute("data-sticky", "");
    return () => root.removeAttribute("data-sticky");
  }
  const seen = new IntersectionObserver(
    ([entry]) => root.toggleAttribute("data-sticky", !entry.isIntersecting),
    // The bar covers the bottom of the window: the button counts as seen above it.
    { root: win, threshold: 0.9, rootMargin: "0px 0px -72px 0px" },
  );
  seen.observe(hero);
  return () => {
    seen.disconnect();
    root.removeAttribute("data-sticky");
  };
}

/**
 * The phone reading of the paid-traffic page. There is no home screen to open a window
 * from: the window is the page, and this only wires what the reading needs.
 */
export function AdsReading() {
  useEffect(() => {
    if (!isPhoneOs()) return;
    const stops = [holdOpen(), startReveal(), startColor(), watchHeroButton()];
    return () => stops.forEach((stop) => stop());
  }, []);
  return null;
}
