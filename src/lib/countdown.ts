/** Days are counted on the calendar of Buenos Aires, so everyone sees the same number. */
const dayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Argentina/Buenos_Aires",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const DAY = 86_400_000;

function dayOf(moment: Date) {
  const parts = dayFormat.formatToParts(moment);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(part("year"), part("month") - 1, part("day")) / DAY;
}

const dateOf = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / DAY;

export type EventMoment = { phase: "before"; days: number } | { phase: "live"; day: number } | { phase: "over" };

/** Where a moment falls: days left until the first day, which live day it is, or past the last one. */
export function eventMoment({ start, end }: { start: string; end: string }, now: Date): EventMoment {
  const today = dayOf(now);
  if (today < dateOf(start)) return { phase: "before", days: dateOf(start) - today };
  if (today > dateOf(end)) return { phase: "over" };
  return { phase: "live", day: today - dateOf(start) + 1 };
}
