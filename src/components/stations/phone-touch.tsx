"use client";

import { useState } from "react";
import { Print } from "@/components/editorial";
import type { Img } from "@/content/types";

/** Clipped photos on a pile: tapping one lays it on top, straight, so it can be seen whole. */
export function PhotoPile({ photos, label }: { photos: Img[]; label: string }) {
  const [top, setTop] = useState<number | null>(null);
  return (
    <ul className="pile ed-r" aria-label={label}>
      {photos.map((image, i) => (
        <li key={image.src} data-photo={i} data-top={top === i ? "" : undefined}>
          <button type="button" aria-label={image.alt} aria-pressed={top === i} onClick={() => setTop(top === i ? null : i)}>
            <Print image={image} sizes="74vw" />
            <svg className="paperclip" viewBox="0 0 24 64" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8 16v32a6 6 0 0 0 12 0V12a9 9 0 0 0-18 0v38" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}

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
