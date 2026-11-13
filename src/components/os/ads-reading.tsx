"use client";

import { useEffect } from "react";
import { holdOpen, isPhoneOs } from "@/lib/phone-os";
import { startColor } from "@/lib/phone-color";
import { startReveal } from "@/lib/phone-reveal";

/** The bar covers the bottom of the window: something counts as seen above it. */
const BAR_PX = 72;

/**
 * The sticky buy button waits while the hero's own button is on screen, and goes away
 * again while the ticket is on screen: the ticket has its own button, and it is the
 * only one that links to the checkout.
 */
function watchStickyButton() {
  const win = document.querySelector<HTMLElement>(".canvas");
  const hero = document.querySelector<HTMLElement>(".ads-hero-cta");
  const ticket = document.querySelector<HTMLElement>(".ticket-wrap");
  const root = document.documentElement;
  const sync = (heroSeen: boolean, ticketSeen: boolean) => root.toggleAttribute("data-sticky", !heroSeen && !ticketSeen);
  if (!win || !hero || !ticket) {
    sync(false, false);
    return () => root.removeAttribute("data-sticky");
  }
  let heroSeen = true;
  let ticketSeen = false;
  const options = { root: win, rootMargin: `0px 0px -${BAR_PX}px 0px` };
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroSeen = entry.isIntersecting;
    sync(heroSeen, ticketSeen);
  }, { ...options, threshold: 0.9 });
  const ticketObserver = new IntersectionObserver(([entry]) => {
    ticketSeen = entry.isIntersecting;
    sync(heroSeen, ticketSeen);
  }, { ...options, threshold: 0 });
  heroObserver.observe(hero);
  ticketObserver.observe(ticket);
  return () => {
    heroObserver.disconnect();
    ticketObserver.disconnect();
    root.removeAttribute("data-sticky");
  };
}

/**
 * The reading of the paid-traffic page. There is no home screen to open a window
 * from: the window is the page, and this only wires what the reading needs.
 */
export function AdsReading() {
  useEffect(() => {
    if (!isPhoneOs()) return;
    const stops = [holdOpen(), startReveal(), startColor(), watchStickyButton()];
    return () => stops.forEach((stop) => stop());
  }, []);
  return null;
}
