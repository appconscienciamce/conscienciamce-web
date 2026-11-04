"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** The reader's own date and time. Client only, so it never mismatches the server. */
export function SystemClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <span className="sys-clock" />;

  return (
    <time className="sys-clock" dateTime={now.toISOString()}>
      {format.format(now).replaceAll(",", "")}
    </time>
  );
}
