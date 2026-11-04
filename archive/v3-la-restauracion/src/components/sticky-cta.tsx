"use client";

import { useEffect, useState } from "react";

/**
 * Compact pill shown whenever no other CTA ([data-cta]) is on screen, and
 * hidden across the closing chapter, which has its own ticket.
 */
export function StickyCta({
  href,
  label,
  price,
  closingId,
}: {
  href: string;
  label: string;
  price: string | null;
  closingId: string;
}) {
  // Start hidden: avoids a flash before the observer reports.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const closing = document.getElementById(closingId);
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setShown(visible.size === 0);
    });
    document.querySelectorAll("[data-cta]").forEach((el) => io.observe(el));
    if (closing) io.observe(closing);
    return () => io.disconnect();
  }, [closingId]);

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-500 [transition-timing-function:var(--ease-editorial)] sm:inset-x-auto sm:right-6 sm:bottom-6 ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-[160%]"
      }`}
    >
      <a
        href={href}
        tabIndex={shown ? 0 : -1}
        className="surface-parchment flex items-center justify-between gap-6 px-5 py-3.5 font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.1em]"
      >
        <span>{label}</span>
        <span className="flex items-center gap-3 text-[var(--muted)]">
          {price && <span>{price}</span>}
          <span aria-hidden className="text-[var(--fg)]">→</span>
        </span>
      </a>
    </div>
  );
}
