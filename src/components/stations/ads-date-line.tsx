"use client";

import { useEffect, useState } from "react";
import { bootcamp } from "@/content/bootcamp";
import { dateLine } from "@/lib/date-line";

/**
 * The hero's date line. The page is cached, so the server always prints the plain dates:
 * the countdown is worked out here, after mount, on the Buenos Aires calendar.
 */
export function AdsDateLine({ className = "" }: { className?: string }) {
  const { hero, offer, ads } = bootcamp;
  const [line, setLine] = useState(hero.dateLine);

  useEffect(() => {
    setLine(dateLine(new Date(), offer.eventDates, ads.dateLine, hero.dateLine));
  }, [hero.dateLine, offer.eventDates, ads.dateLine]);

  return <p className={className}>{line}</p>;
}
