/**
 * The hero's date line for the paid-traffic page, by the calendar day in Buenos Aires.
 * Pure on purpose: the caller passes the clock and the copy, so it can be checked by hand.
 */

export interface DateLineCopy {
  /** `{n}` is the number of days left. */
  soon: string;
  tomorrow: string;
  today: string;
  dayTwo: string;
}

/** Buenos Aires has no daylight saving time: it is UTC-3 all year. */
const BUENOS_AIRES_OFFSET_MS = -3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The day number of a "YYYY-MM-DD" date, counted in whole days since 1970-01-01. */
function dayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

/** Today's day number in Buenos Aires. */
function today(now: Date): number {
  return Math.floor((now.getTime() + BUENOS_AIRES_OFFSET_MS) / DAY_MS);
}

/**
 * The line for `now`, or `fallback` once the event is over (and for an invalid clock).
 * More than one day before the start: "Empieza en {n} días ..."; the day before: tomorrow;
 * the first day: today; the last day: day two.
 */
export function dateLine(now: Date, dates: { start: string; end: string }, copy: DateLineCopy, fallback: string): string {
  if (Number.isNaN(now.getTime())) return fallback;
  const start = dayOf(dates.start);
  const end = dayOf(dates.end);
  const day = today(now);
  if (day > end) return fallback;
  if (day === end && end !== start) return copy.dayTwo;
  if (day === start) return copy.today;
  const left = start - day;
  if (left < 1) return fallback;
  if (left === 1) return copy.tomorrow;
  return copy.soon.replace("{n}", String(left));
}
