/**
 * Spatial layout of the living board. Geometry only, no copy: stations are
 * world rectangles, stops are the places the guided camera rests on.
 * World units equal CSS pixels at zoom 1.
 *
 * The map is linear on purpose: chapters run left to right, so scrolling down
 * always moves forward and the camera never travels back over the path.
 * The vertical offsets keep the board spatial, nothing else.
 */

/** Screens that get the spatial board by default. Everything else reads vertically. */
export const BOARD_QUERY =
  "(min-width: 1180px) and (min-height: 620px) and (hover: hover) and (pointer: fine)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Width of the idea index when open. The camera frames around it. */
export const SIDEBAR_WIDTH = 216;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StationDef extends Rect {
  id: string;
}

export const STATIONS: StationDef[] = [
  { id: "inicio", x: 0, y: 420, w: 1040, h: 620 },
  { id: "para-quien", x: 1460, y: 60, w: 2320, h: 820 },
  { id: "manifiesto", x: 4200, y: 600, w: 2560, h: 720 },
  { id: "caso-pilar", x: 7180, y: 120, w: 2280, h: 700 },
  { id: "dos-dias", x: 9880, y: 620, w: 2500, h: 720 },
  { id: "que-te-llevas", x: 12800, y: 100, w: 1320, h: 780 },
  { id: "quienes", x: 14540, y: 620, w: 2480, h: 740 },
  { id: "inscripcion", x: 17440, y: 120, w: 2480, h: 720 },
];

export const WORLD: Rect = { x: -240, y: -120, w: 20400, h: 1700 };

export interface StopDef {
  /** Anchor that targets this stop. Station ids are registered automatically. */
  anchor?: string;
  station: number;
  rect: Rect;
  /** Scroll length, in units of one stop. */
  length?: number;
  /** Fraction of the stop spent resting before the camera leaves. */
  hold?: number;
}

function within(station: number, x: number, y: number, w: number, h: number): Rect {
  const s = STATIONS[station];
  return { x: s.x + x, y: s.y + y, w, h };
}

export const STOPS: StopDef[] = [
  { station: 0, rect: within(0, 0, 0, 1040, 620), length: 0.8 },
  { anchor: "mapa", station: 1, rect: within(1, 0, 0, 1120, 640) },
  { station: 1, rect: within(1, 1200, 120, 1120, 680) },
  { station: 2, rect: within(2, 0, 0, 1300, 720) },
  { station: 2, rect: within(2, 1380, 0, 1180, 680) },
  { station: 3, rect: within(3, 0, 0, 1200, 680) },
  { anchor: "expediente", station: 3, rect: within(3, 1280, 0, 1000, 640) },
  { station: 4, rect: within(4, 0, 0, 1200, 700) },
  { anchor: "dia-2", station: 4, rect: within(4, 1280, 0, 1200, 700) },
  { station: 5, rect: within(5, 0, 0, 1320, 780) },
  { station: 6, rect: within(6, 0, 0, 1200, 680) },
  { anchor: "testimonios", station: 6, rect: within(6, 1280, 0, 1200, 720) },
  { station: 7, rect: within(7, 0, 0, 1200, 700) },
  { anchor: "preguntas", station: 7, rect: within(7, 1280, 0, 1200, 680) },
];

/** First stop of every station, by station index. */
export const STATION_FIRST_STOP: number[] = STATIONS.map((_, i) => STOPS.findIndex((s) => s.station === i));

/* ----------------------------------------------------------------
   Edges. `from`/`to` are stop positions: the line is drawn while the
   guided camera moves between them, and undrawn when scrolling back.
----------------------------------------------------------------- */
export interface EdgeDef {
  d: string;
  from: number;
  to: number;
  /** Label anchor. Text comes from `bootcamp.board.path`. */
  label?: { x: number; y: number };
}

/** Horizontal S-curve from the right side of one station to the left of the next. */
function link(a: Rect, b: Rect) {
  const p = { x: a.x + a.w, y: a.y + a.h / 2 };
  const q = { x: b.x, y: b.y + b.h / 2 };
  const pull = (q.x - p.x) * 0.6;
  return {
    d: `M${p.x} ${p.y} C${p.x + pull} ${p.y} ${q.x - pull} ${q.y} ${q.x} ${q.y}`,
    mid: { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 - 16 },
  };
}

const days = STATIONS[4];

export const EDGES: EdgeDef[] = [
  ...STATIONS.slice(1).map((station, i) => {
    const { d, mid } = link(STATIONS[i], station);
    return { d, from: STATION_FIRST_STOP[i + 1] - 1, to: STATION_FIRST_STOP[i + 1], label: mid };
  }),
  // The line that joins the two days, drawn with the scroll.
  {
    d: `M${days.x + 1170} ${days.y + 350} C${days.x + 1230} ${days.y + 300} ${days.x + 1270} ${days.y + 400} ${days.x + 1320} ${days.y + 350}`,
    from: STATION_FIRST_STOP[4],
    to: STATION_FIRST_STOP[4] + 1,
  },
];
