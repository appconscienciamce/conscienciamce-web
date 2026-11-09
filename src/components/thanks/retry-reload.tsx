"use client";

import { useEffect } from "react";

/**
 * Stripe sends the buyer back before its webhook has always arrived. While the
 * purchase is not recorded yet, the page asks again every few seconds, a few times.
 */
export function RetryReload({ attempt, max, delayMs }: { attempt: number; max: number; delayMs: number }) {
  useEffect(() => {
    if (attempt >= max) return;
    const timer = window.setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("intento", String(attempt + 1));
      window.location.replace(url.toString());
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [attempt, max, delayMs]);
  return null;
}
