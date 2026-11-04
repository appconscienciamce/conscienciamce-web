"use client";

import { useState } from "react";

/** Scattered position of each idea, around the thesis. */
const NOISE: [number, number, number][] = [
  [40, 70, -4],
  [420, 28, 2.2],
  [900, 64, -2.4],
  [24, 256, 3],
  [930, 250, 2.6],
  [60, 520, -2.2],
  [400, 610, 1.8],
  [850, 510, -3],
];

/** Tidy position: two rows under the thesis. */
const SORTED: [number, number][] = [
  [60, 500],
  [355, 500],
  [650, 500],
  [945, 500],
  [60, 590],
  [355, 590],
  [650, 590],
  [945, 590],
];

const CENTER: [number, number] = [650, 320];

/** The noise of the market is one click away from being a system of thought. */
export function ManifestoBoard({
  strikes,
  sortLabel,
  unsortLabel,
  sortedTitle,
  children,
}: {
  strikes: string[];
  sortLabel: string;
  unsortLabel: string;
  sortedTitle: string;
  children: React.ReactNode;
}) {
  const [sorted, setSorted] = useState(false);

  return (
    <div className="manifesto-board" data-sorted={sorted}>
      <svg className="noise-lines" viewBox="0 0 1300 720" aria-hidden fill="none">
        {NOISE.map(([x, y], i) => (
          <line key={i} x1={x + 110} y1={y + 24} x2={CENTER[0]} y2={CENTER[1]} />
        ))}
      </svg>

      <div className="thesis-block">{children}</div>

      <p className="sorted-title" aria-hidden={!sorted}>
        {sortedTitle}
      </p>
      <ul className="strike-list">
        {strikes.map((strike, i) => {
          const [x, y, r] = NOISE[i];
          const [sx, sy] = SORTED[i];
          const style = (sorted
            ? { "--sx": `${sx}px`, "--sy": `${sy}px`, "--sr": "0deg" }
            : { "--sx": `${x}px`, "--sy": `${y}px`, "--sr": `${r}deg` }) as React.CSSProperties;
          return (
            <li key={strike} style={style} className="strike">
              <span>{strike}</span>
            </li>
          );
        })}
      </ul>

      <button type="button" className="btn btn-line sort-button" aria-pressed={sorted} onClick={() => setSorted(!sorted)}>
        {sorted ? unsortLabel : sortLabel}
      </button>
    </div>
  );
}
