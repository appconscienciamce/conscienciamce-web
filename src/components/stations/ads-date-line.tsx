"use client";

import { useEffect, useState } from "react";
import { bootcamp } from "@/content/bootcamp";
import { dateLine } from "@/lib/date-line";

/**
 * The hero's countdown chip. The page is cached, so the server always prints the plain
 * "2 días en vivo": the countdown is worked out here, after mount, on the Buenos Aires calendar.
 */
export function AdsCountdownChip({ className = "" }: { className?: string }) {
  const { hero, offer, ads } = bootcamp;
  const [line, setLine] = useState(hero.format);

  useEffect(() => {
    setLine(dateLine(new Date(), offer.eventDates, ads.dateLine, hero.format));
  }, [hero.format, offer.eventDates, ads.dateLine]);

  return <span className={`ads-chip ads-chip-live ${className}`}>{line}</span>;
}
