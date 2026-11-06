/**
 * The simulated count of places left in the system bar. It is not the real registrations:
 * from the cap it goes down by itself, about one place every seven or eight seconds, but
 * unevenly: quick stretches, slow ones, a pause now and then, two places at once or a
 * quick run of three. It goes down to about `low`, slips a few places further, slower,
 * rests a moment and is back at the cap.
 *
 * It depends only on the time: the same number for everyone at the same moment. Each cycle
 * is drawn from its own seed. Its length follows from the pace and from how far down it
 * goes (from 300 to about 100: some half an hour). The pace is set here; `low` comes from
 * `offer.seats.drift` in the content.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;

/** Where the cycles are counted from: 1 Nov 2026, 00:00 in Buenos Aires. Any fixed past moment. */
const EPOCH = Date.UTC(2026, 10, 1, 3);

/** The average time per place on the way down. */
const PACE = 7.6 * SECOND;

/** At the cap, before the first place goes. */
const HOLD = { min: 20 * SECOND, max: 60 * SECOND };

/** Where the descent ends: `low`, give or take this many places. */
const TARGET_SPREAD = 10;

/**
 * The wait after each drop on the way down, before it is fitted to the cycle: [chance, min, max].
 * With one drop in four being two at once or a run of three, it averages out to `PACE`.
 */
const GAPS: [number, number, number][] = [
  [0.25, 2 * SECOND, 5 * SECOND], // quick
  [0.5, 5 * SECOND, 11 * SECOND], // steady
  [0.17, 11 * SECOND, 20 * SECOND], // slow
  [0.08, 20 * SECOND, 40 * SECOND], // a pause
];

/** Past the target: one place at a time, further apart. */
const TAIL = { placesMin: 4, placesMax: 10, gapMin: 15 * SECOND, gapMax: 45 * SECOND };

/** At the bottom, before it is back at the cap. */
const REST = { min: 1 * MINUTE, max: 3 * MINUTE };

/** A small 32-bit generator: the same seed, the same cycle. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (r: () => number, lo: number, hi: number) => lo + r() * (hi - lo);

function gap(r: () => number) {
  let roll = r();
  for (const [chance, lo, hi] of GAPS) {
    if (roll < chance) return between(r, lo, hi);
    roll -= chance;
  }
  return between(r, GAPS[1][1], GAPS[1][2]);
}

/** Every cycle lasts the same: the descent at `PACE`, plus the hold, the tail and the rest. */
function cycleLength(from: number, low: number) {
  const tail = ((TAIL.placesMin + TAIL.placesMax) / 2) * ((TAIL.gapMin + TAIL.gapMax) / 2);
  const extra = (HOLD.min + HOLD.max) / 2 + tail + (REST.min + REST.max) / 2;
  return Math.max(5 * MINUTE, Math.max(0, from - low) * PACE + extra);
}

type Cycle = { index: number; start: number; end: number; drops: number[] };

/** One cycle: the moments at which a place goes (two equal moments: two at once). */
function buildCycle(index: number, from: number, low: number): Cycle {
  const length = cycleLength(from, low);
  const start = EPOCH + index * length;
  const r = seeded(Math.imul(index + 1, 2654435761) ^ 0xd217);
  const target = low + Math.round(between(r, -TARGET_SPREAD, TARGET_SPREAD));
  const raw: number[] = [];
  let left = from;
  let t = 0;

  while (left > target) {
    const roll = r();
    if (roll < 0.75) {
      raw.push(t);
      left -= 1;
    } else if (roll < 0.9) {
      raw.push(t, t);
      left -= 2;
    } else {
      // A quick run of three.
      for (let k = 0; k < 3; k++) {
        raw.push(t);
        if (k < 2) t += between(r, 1, 2.5) * SECOND;
      }
      left -= 3;
    }
    t += gap(r);
  }

  const tail = Math.round(between(r, TAIL.placesMin, TAIL.placesMax));
  for (let k = 0; k < tail && left > 1; k++) {
    t += between(r, TAIL.gapMin, TAIL.gapMax);
    raw.push(t);
    left -= 1;
  }

  // Fit the drawn moments between the hold and the rest: same rhythm, a little faster or slower.
  const hold = between(r, HOLD.min, HOLD.max);
  const rest = between(r, REST.min, REST.max);
  const last = raw.length ? raw[raw.length - 1] : 0;
  const scale = last > 0 ? (length - hold - rest) / last : 1;
  const drops = raw.map((x) => start + hold + x * scale);
  return { index, start, end: start + length, drops };
}

let cached: { from: number; low: number; cycle: Cycle } | null = null;

function cycleOf(index: number, from: number, low: number): Cycle {
  if (cached && cached.from === from && cached.low === low && cached.cycle.index === index) return cached.cycle;
  const cycle = buildCycle(index, from, low);
  cached = { from, low, cycle };
  return cycle;
}

const indexAt = (t: number, from: number, low: number) => Math.floor((t - EPOCH) / cycleLength(from, low));

function goneBy(cycle: Cycle, t: number) {
  let gone = 0;
  while (gone < cycle.drops.length && cycle.drops[gone] <= t) gone += 1;
  return gone;
}

/**
 * The places left at `now`, counting down from `from`; the cycle; and the moment the number
 * changes next (the next place that goes, or the return to the cap).
 */
export function seatsAt(now: number, from: number, low: number): { left: number; cycle: number; next: number } {
  if (now < EPOCH) return { left: from, cycle: -1, next: EPOCH };
  const cycle = cycleOf(indexAt(now, from, low), from, low);
  const gone = goneBy(cycle, now);
  return { left: from - gone, cycle: cycle.index, next: gone < cycle.drops.length ? cycle.drops[gone] : cycle.end };
}

/** How many places went between two moments, across the return to the cap too. */
export function goneBetween(a: number, b: number, from: number, low: number): number {
  if (b <= a || b < EPOCH) return 0;
  const first = indexAt(Math.max(a, EPOCH), from, low);
  const lastIndex = indexAt(b, from, low);
  // Long apart: more than anyone would see go; the caller holds a floor anyway.
  if (lastIndex - first > 3) return from;
  let gone = 0;
  for (let i = first; i <= lastIndex; i++) {
    const cycle = cycleOf(i, from, low);
    const upTo = i === lastIndex ? goneBy(cycle, b) : cycle.drops.length;
    const before = i === first ? goneBy(cycle, a) : 0;
    gone += upTo - before;
  }
  return gone;
}
