"use client";

import { useState } from "react";

/** A list to check off: each line crosses itself out when tapped. */
export function CheckList({ items }: { items: string[] }) {
  const [done, setDone] = useState<string[]>([]);
  return (
    <ul className="file-check">
      {items.map((item) => {
        const checked = done.includes(item);
        return (
          <li key={item}>
            <button
              type="button"
              aria-pressed={checked}
              onClick={() => setDone(checked ? done.filter((line) => line !== item) : [...done, item])}
            >
              <span aria-hidden className="file-check-box" />
              <span className="file-check-text">{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** A quiet fold: the detail of a day slides open under its line. */
export function DayMore({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ed-more ed-r" data-open={open ? "" : undefined}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {label}
        <span aria-hidden className="ed-more-mark" />
      </button>
      <div className="ed-more-body" inert={!open}>
        <div>{children}</div>
      </div>
    </div>
  );
}
