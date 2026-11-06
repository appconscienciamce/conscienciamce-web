"use client";

import { useEffect, useState } from "react";
import type { OsCopy } from "@/content/types";
import { eventMoment } from "@/lib/countdown";
import { SystemClock } from "./system-clock";

/**
 * The days left until the bootcamp, where the clock is. Once the live days are over,
 * the clock again. Client only: a static page would keep the number of the day it was built.
 */
export function SystemCountdown({ dates, copy }: { dates: { start: string; end: string }; copy: OsCopy["countdown"] }) {
  const [now, setNow] = useState<Date | null>(null);

  // The number changes once a day: a look every minute is more than enough.
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const moment = now ? eventMoment(dates, now) : { phase: "before" as const, days: 10 };
  if (moment.phase === "over") return <SystemClock />;

  const one = moment.phase === "before" && moment.days === 1;
  const live = moment.phase === "live";
  const label = live ? copy.today : copy.dates;
  const value = live ? `${copy.day} ${moment.day}` : `${one ? copy.leftOne : copy.left} ${moment.days} ${one ? copy.unitOne : copy.unit}`;

  return (
    <span className="sys-pill" role="timer" aria-label={now ? `${label}: ${value}` : undefined} data-pending={now ? undefined : ""}>
      <span aria-hidden className="sys-pill-dot" />
      <span aria-hidden className="sys-pill-text">
        <span className="sys-pill-label">{label}</span>
        <span className="sys-pill-value">{value}</span>
      </span>
    </span>
  );
}
