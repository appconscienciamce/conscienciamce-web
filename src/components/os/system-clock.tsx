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

  // It shows minutes: waking up every second would only spend battery.
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = window.setTimeout(tick, 60000 - date.getSeconds() * 1000 - date.getMilliseconds());
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  if (!now) return <span className="sys-clock" />;

  return (
    <time className="sys-clock" dateTime={now.toISOString()}>
      {format.format(now).replaceAll(",", "")}
    </time>
  );
}
