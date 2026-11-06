"use client";

import { useState } from "react";

interface KitCard {
  tag: string;
  title: string;
  text: string;
}

/** What the reader takes home, as a stack of passes: tapping one brings it out. */
export function KitStack({ cards }: { cards: KitCard[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="kit ed-r">
      {cards.map((card, i) => {
        const active = open === i;
        return (
          <li key={card.title} data-card={i} data-open={active ? "" : undefined}>
            <button type="button" aria-expanded={active} onClick={() => setOpen(i)}>
              <span className="kit-tag">{card.tag}</span>
              <span className="kit-title">{card.title}</span>
            </button>
            <div className="kit-body">
              <p>{card.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
