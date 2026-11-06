"use client";

import { useEffect, useState } from "react";
import { SystemClock } from "./system-clock";

/** In a draft, `?cierre=2026-11-20T23:59` previews the countdown before a date is decided. */
const PREVIEW_PARAM = "cierre";

const closesFormat = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

const pad = (n: number) => String(n).padStart(2, "0");

function remaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

/**
 * Where the clock is, the time left until registration closes. The same for everyone and
 * on every reload, because it counts to a real date. Without one, or once it has passed,
 * the clock is back.
 */
export function SystemCountdown({
  closesAt,
  preview,
  copy,
}: {
  /** The real close of registration, from the content. */
  closesAt: string | null;
  /** A draft: the address can preview a date. */
  preview: boolean;
  copy: { label: string; short: string; closes: string };
}) {
  const [deadline, setDeadline] = useState<number | null>(closesAt ? Date.parse(closesAt) : null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!preview) return;
    const asked = new URLSearchParams(window.location.search).get(PREVIEW_PARAM);
    if (asked && !Number.isNaN(Date.parse(asked))) setDeadline(Date.parse(asked));
  }, [preview]);

  // Once a second, on the second: the digits change together with the real clock.
  useEffect(() => {
    if (deadline === null) return;
    let timer = 0;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t < deadline) timer = window.setTimeout(tick, 1000 - (t % 1000));
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [deadline]);

  if (deadline === null || (now !== null && now >= deadline)) return <SystemClock />;

  const closes = new Date(deadline);
  // Client only: the server would render a moment that is already gone.
  const left = now === null ? null : remaining(deadline - now);
  return (
    <span className="sys-pill sys-countdown" role="timer" aria-label={`${copy.closes} ${closesFormat.format(closes)}`} data-days={left && left.days > 0 ? "" : undefined}>
      <span aria-hidden className="sys-pill-dot" />
      <span aria-hidden className="sys-pill-text">
        <span className="sys-pill-label">
          <span className="sys-countdown-long">{copy.label}</span>
          <span className="sys-countdown-short">{copy.short}</span>
        </span>
        <time className="sys-pill-value" dateTime={closes.toISOString()}>
          {left && (
            <>
              {left.days > 0 && `${left.days}d `}
              {left.hours}:{left.minutes}
              <span className="sys-countdown-seconds">:{left.seconds}</span>
            </>
          )}
        </time>
      </span>
    </span>
  );
}
