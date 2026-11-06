import { ChevronGlyph } from "@/components/os/glyphs";
import { bootcamp } from "@/content/bootcamp";
import { AppBar } from "@/components/os/phone-home";
import { EDGES, STATIONS } from "@/lib/board/layout";

type Vars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Station: a real <section> placed in the world when the board is active and
 * in normal flow otherwise. One DOM for both readings, nothing duplicated.
 */
export function Station({
  index,
  titleId,
  className = "",
  children,
}: {
  index: number;
  titleId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const def = STATIONS[index];
  const { chapters, os, footer, board } = bootcamp;
  const chapter = chapters[index];
  const next = chapters[index + 1];
  const style: Vars = {
    "--x": `${def.x}px`,
    "--y": `${def.y}px`,
    "--w": `${def.w}px`,
    "--h": `${def.h}px`,
  };
  return (
    <section id={def.id} data-station={def.id} data-label={chapter.label} aria-labelledby={titleId} className={`st ${className}`} style={style}>
      {index === 0 && <AppBar title={os.phone.heroWindow} back={os.back} />}
      <p className="st-tag">
        {chapter.number} — {chapter.label}
      </p>
      <span aria-hidden className="st-far">
        <b>{chapter.number}</b>
        {chapter.label}
      </span>
      {children}
      {index > 0 &&
        (next ? (
          <a href={`#${next.id}`} className="app-next" aria-label={`${os.phone.next} ${next.label}`}>
            <span aria-hidden className="app-next-word">
              {board.path[index]}
            </span>
            <span aria-hidden className="scroll-arrow">
              <ChevronGlyph direction="down" />
            </span>
          </a>
        ) : (
          <p className="app-end">
            © {new Date().getFullYear()} {footer.copyright}
          </p>
        ))}
    </section>
  );
}

/**
 * Piece of a station. `x, y, w, h` only apply on the board; in the vertical
 * reading a piece follows the document order.
 */
export function Piece({
  x,
  y,
  w,
  h,
  r = 0,
  z,
  as: Tag = "div",
  className = "",
  movable = false,
  id,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  r?: number;
  z?: number;
  as?: "div" | "aside" | "figure" | "article" | "ol" | "ul";
  className?: string;
  movable?: boolean;
  id?: string;
  children: React.ReactNode;
}) {
  const style: Vars = {
    "--px": `${x}px`,
    "--py": `${y}px`,
    "--pw": `${w}px`,
    "--pr": `${r}deg`,
    ...(h !== undefined && { "--ph": `${h}px` }),
    ...(z !== undefined && { "--pz": String(z) }),
  };
  return (
    <Tag id={id} className={`piece ${className}`} style={style} data-movable={movable || undefined}>
      {children}
    </Tag>
  );
}

/** The line of the journey. Each link is drawn while the camera travels it. */
export function BoardEdges() {
  const { path } = bootcamp.board;
  return (
    <svg className="edges" aria-hidden width="1" height="1">
      {EDGES.map((edge, i) => (
        <path key={i} d={edge.d} pathLength={1} data-edge={i} className="edge" />
      ))}
      {EDGES.map(
        (edge, i) =>
          edge.label &&
          path[i] && (
            <text key={i} x={edge.label.x} y={edge.label.y} textAnchor="middle" className="edge-label">
              {path[i]}
            </text>
          ),
      )}
    </svg>
  );
}
