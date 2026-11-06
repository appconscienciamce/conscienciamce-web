"use client";

import { useEffect, useRef, useState } from "react";
import { goneBetween, seatsAt } from "@/lib/seats-drift";

/** What this browser last showed, per cycle, so a reload never shows more places. */
const SEEN_KEY = "cc-seats-seen-2";

type Seen = { cycle: number; left: number };

function readSeen(): Seen | null {
  try {
    const seen = JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "null");
    return seen && Number.isFinite(seen.cycle) && Number.isFinite(seen.left) ? seen : null;
  } catch {
    return null;
  }
}

function writeSeen(seen: Seen) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // Storage off (private mode): the count still goes down with the time alone.
  }
}

/**
 * Where the clock is, the places left. With `low`, the count is simulated (lib/seats-drift.ts):
 * it goes down by itself, unevenly, while the page is open. A reload never shows more places;
 * only a new cycle, on a later visit, starts back at the cap.
 * Without it, the number is just `from`, the cap minus the real registrations.
 */
export function SystemSeats({
  from,
  low,
  copy,
}: {
  from: number;
  low: number | null;
  copy: { left: string; leftOne: string; unit: string; unitOne: string; full: string };
}) {
  // Client only: the page is built ahead of time, so the server can't know the moment.
  const [left, setLeft] = useState<number | null>(low === null ? from : null);
  const [ticked, setTicked] = useState(false);
  const shown = useRef<number | null>(null);
  const lastAt = useRef<number | null>(null);

  useEffect(() => {
    if (low === null) return;
    // Someone who watches through the return to the cap keeps seeing it go down, to here.
    const floor = Math.max(1, Math.round(low / 2));
    let timer = 0;
    /** `fresh`: a new visit, or a return to the tab. Otherwise someone is watching. */
    const update = (fresh: boolean) => {
      window.clearTimeout(timer);
      const now = Date.now();
      // A hidden tab waits: it catches up, as a return, when it is seen again.
      if (!fresh && document.hidden) {
        timer = window.setTimeout(() => update(false), 60_000);
        return;
      }
      const { left: value, cycle, next } = seatsAt(now, from, low);
      const prev = shown.current;
      let count: number;
      if (fresh || prev === null || lastAt.current === null) {
        // What this browser already showed in this cycle is a ceiling: a reload never shows more.
        // A new cycle starts back at the cap, but only on a new visit or a return to the tab.
        const seen = readSeen();
        count = seen && seen.cycle === cycle ? Math.min(seen.left, value) : value;
      } else {
        // Watching: each place that goes takes one off what is shown, even when the cycle
        // starts over, so the number never jumps up nor stalls before someone's eyes.
        count = Math.max(prev - goneBetween(lastAt.current, now, from, low), Math.min(prev, floor));
      }
      writeSeen({ cycle, left: count });
      if (prev !== null && count < prev) setTicked(true);
      shown.current = count;
      lastAt.current = now;
      setLeft(count);
      // Up to a minute at a time, so a tab that slept catches up.
      timer = window.setTimeout(() => update(false), Math.min(Math.max(next - now, 200), 60_000));
    };
    update(true);
    const onVisible = () => {
      if (document.visibilityState === "visible") update(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [from, low]);

  if (left === 0) {
    return (
      <span className="sys-pill sys-seats" data-full="">
        <span aria-hidden className="sys-pill-dot" />
        <span className="sys-pill-text">
          <span className="sys-pill-value sys-pill-unit">{copy.full}</span>
        </span>
      </span>
    );
  }
  const one = left === 1;
  return (
    <span className="sys-pill sys-seats" data-pending={left === null ? "" : undefined} data-ticked={ticked ? "" : undefined}>
      <span aria-hidden className="sys-pill-dot" />
      <span className="sys-pill-text">
        <span className="sys-pill-label">{one ? copy.leftOne : copy.left}</span>
        <span className="sys-pill-value">
          {/* Before the first count, the cap holds the place, unseen: the pill keeps its width. */}
          <span key={left ?? from} className="sys-seats-n">
            {left ?? from}
          </span>
          {/* The space goes with the word: in the number's mono type it reads too wide. */}
          <span className="sys-pill-unit">{` ${one ? copy.unitOne : copy.unit}`}</span>
        </span>
      </span>
    </span>
  );
}
