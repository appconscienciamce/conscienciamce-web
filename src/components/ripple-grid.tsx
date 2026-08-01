/**
 * Interactive cell grid used as a section backdrop.
 *
 * Cells light up on hover and a ripple spreads outward from whichever cell is
 * clicked, the distance from the clicked cell driving each neighbour's delay.
 *
 * Written in plain CSS rather than pulled from a component library: this
 * project has no Tailwind, and adding it would put a second reset on top of
 * the ported Elementor base styles.
 */

const COLS = 24;
const ROWS = 8;

export function RippleGrid() {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);

  return (
    <div
      className="mce-ripple"
      aria-hidden="true"
      style={{ ['--ripple-cols' as string]: COLS, ['--ripple-rows' as string]: ROWS }}
    >
      {cells.map((i) => (
        <span
          key={i}
          className="mce-ripple-cell"
          data-col={i % COLS}
          data-row={Math.floor(i / COLS)}
        />
      ))}
    </div>
  );
}
