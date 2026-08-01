/**
 * Faceted line-art iceberg for the "¿Qué es Consciencia MCE?" section.
 *
 * The ice sits centred with its strata called out on alternating sides, so the
 * composition stays balanced around it. Reading down: the visible tip, then
 * Acción, Identidad, Consciencia and Esencia — the MCE chain read bottom-up,
 * because that is the order in which it operates.
 *
 * Palette is the page's own: white-with-alpha ice against the #2f6bff accent.
 * Labels are foreignObject HTML rather than <text> so copy wraps and inherits
 * page typography instead of being baked into the drawing.
 */

/** The ice occupies x 0..398 in its own coordinates; centre it in the viewBox. */
const ICE_OFFSET_X = 300;
const ICE_OFFSET_Y = 30;

const VIEW_W = 1000;
const VIEW_H = 740;

type Stratum = {
  id: string;
  label: string;
  detail: string;
  /** Which side the callout sits on. */
  side: 'left' | 'right';
  /** y where the connector leaves the ice, in ice coordinates. */
  y: number;
  /** x of the ice edge on that side at that height, in ice coordinates. */
  edgeX: number;
};

const STRATA: Stratum[] = [
  {
    id: 'visible',
    label: 'Lo visible',
    detail: 'Negocio, dinero, relaciones, cuerpo, impacto',
    side: 'right',
    y: 135,
    edgeX: 368,
  },
  {
    id: 'accion',
    label: 'Acción',
    detail: 'Decisiones, hábitos y sistemas que sostienen el resultado',
    side: 'left',
    y: 370,
    edgeX: 55,
  },
  {
    id: 'identidad',
    label: 'Identidad',
    detail: 'Quién creés que sos, qué merecés y qué podés sostener',
    side: 'right',
    y: 460,
    edgeX: 375,
  },
  {
    id: 'consciencia',
    label: 'Consciencia',
    detail: 'Paradigmas, estándares y principios desde los que operás',
    side: 'left',
    y: 550,
    edgeX: 124,
  },
  {
    id: 'esencia',
    label: 'Esencia',
    detail: 'Mente, cuerpo y espíritu alineados: la expansión como naturaleza',
    side: 'right',
    y: 630,
    edgeX: 236,
  },
];

/** Horizontal room reserved for a callout on either side. */
const CALLOUT_W = 280;
/** Gap between the ice edge and where the connector turns. */
const ELBOW_GAP = 46;
/** Half the height of a label box, used to centre the connector on it. */
const LABEL_MID = 24;

export function Iceberg() {
  return (
    <figure className="mce-iceberg-figure">
      <svg
        className="mce-iceberg-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-labelledby="iceberg-title iceberg-desc"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="iceberg-title">El iceberg de Consciencia MCE</title>
        <desc id="iceberg-desc">
          Sobre la línea de agua, lo visible: negocio, dinero, relaciones,
          cuerpo e impacto. Debajo, lo que lo sostiene: acción, identidad,
          consciencia y esencia.
        </desc>

        <defs>
          <linearGradient id="ice-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6f6f6f" />
            <stop offset="28%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#6392ea" />
            <stop offset="72%" stopColor="#c9dbff" />
            <stop offset="100%" stopColor="#6f6f6f" />
          </linearGradient>

          <linearGradient id="water-veil" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0.16)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0)" />
          </linearGradient>

          <linearGradient id="water-sides" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="18%" stopColor="#fff" stopOpacity="1" />
            <stop offset="82%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>

          <mask id="water-mask">
            <rect
              x={ICE_OFFSET_X - 130}
              y="300"
              width="660"
              height="440"
              fill="url(#water-sides)"
            />
          </mask>

          <linearGradient id="waterline-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0)" />
            <stop offset="22%" stopColor="rgb(47 107 255 / 0.6)" />
            <stop offset="78%" stopColor="rgb(47 107 255 / 0.6)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0)" />
          </linearGradient>

          {/* Soft bloom for the travelling edge light and the node pulses. */}
          <filter id="ice-bloom" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          className="ice-water"
          x={ICE_OFFSET_X - 130}
          y="300"
          width="660"
          height="440"
          fill="url(#water-veil)"
          mask="url(#water-mask)"
        />

        <g
          id="mce-iceberg-scenery"
          transform={`translate(${ICE_OFFSET_X} ${ICE_OFFSET_Y})`}
        >
          <g className="ice-tip">
            <polygon
              points="8,146 80,66 138,95 192,1 293,100 351,108 391,171 351,270 26,270 0,233"
              fill="rgb(255 255 255 / 0.16)"
              stroke="url(#ice-edge)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="193,0 226,124 311,182 353,269 393,172 352,108 293,99"
              fill="rgb(255 255 255 / 0.22)"
            />
            <polygon
              points="139,95 88,102 32,152 16,231 27,270 0,233 8,146 80,66"
              fill="rgb(255 255 255 / 0.10)"
            />
            <polygon points="139,95 200,31 193,0" fill="rgb(255 255 255 / 0.13)" />
          </g>

          <line
            className="ice-waterline"
            x1="-130"
            y1="270"
            x2="530"
            y2="270"
            stroke="url(#waterline-fade)"
            strokeWidth="2"
          />

          <g className="ice-mass">
            <polygon
              points="27,270 80,456 107,427 126,561 212,665 277,571 321,498 398,444 352,368 398,320 352,270"
              fill="rgb(255 255 255 / 0.07)"
              stroke="url(#ice-edge)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="139,270 227,410 302,436 321,498 398,444 352,368 398,320 352,270"
              fill="rgb(255 255 255 / 0.05)"
            />
            <polygon
              points="27,270 80,456 107,427 126,561 212,665 162,545 126,388 85,394"
              fill="rgb(47 107 255 / 0.10)"
            />
            <path d="M139,270 L212,665" stroke="rgb(255 255 255 / 0.10)" strokeWidth="1" fill="none" />
            <path d="M293,270 L277,571" stroke="rgb(255 255 255 / 0.07)" strokeWidth="1" fill="none" />
          </g>

          {/* Light travelling the full silhouette, tip then mass. */}
          <g className="ice-trace" filter="url(#ice-bloom)" aria-hidden="true">
            <polygon
              className="ice-trace-path"
              points="8,146 80,66 138,95 192,1 293,100 351,108 391,171 351,270 26,270 0,233"
              fill="none"
              stroke="#2f6bff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon
              className="ice-trace-path ice-trace-path--mass"
              points="27,270 80,456 107,427 126,561 212,665 277,571 321,498 398,444 352,368 398,320 352,270"
              fill="none"
              stroke="#2f6bff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* ── Strata callouts, alternating sides ────────────────────────── */}
        {STRATA.map((stratum, index) => {
          const anchorX = ICE_OFFSET_X + stratum.edgeX;
          const anchorY = ICE_OFFSET_Y + stratum.y;
          const toRight = stratum.side === 'right';

          const elbowX = toRight ? anchorX + ELBOW_GAP : anchorX - ELBOW_GAP;
          const labelX = toRight ? elbowX + 14 : elbowX - 14 - CALLOUT_W;
          const labelY = anchorY - LABEL_MID * 2;

          return (
            <g
              key={stratum.id}
              className={`ice-callout ice-callout--${stratum.side}`}
              style={{ ['--i' as string]: index }}
            >
              <path
                className="ice-connector"
                d={`M${anchorX},${anchorY} H${elbowX} V${anchorY - LABEL_MID} H${
                  toRight ? elbowX + 12 : elbowX - 12
                }`}
                stroke="rgb(47 107 255 / 0.55)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Expanding rings marking the point of activation. */}
              <g className="ice-node-group" filter="url(#ice-bloom)">
                <circle className="ice-node-ring" cx={anchorX} cy={anchorY} r="4" />
                <circle
                  className="ice-node-ring ice-node-ring--delayed"
                  cx={anchorX}
                  cy={anchorY}
                  r="4"
                />
                <circle className="ice-node" cx={anchorX} cy={anchorY} r="3.5" />
              </g>

              <foreignObject
                x={labelX}
                y={labelY}
                width={CALLOUT_W}
                height="120"
              >
                <div
                  className={`ice-callout-box ice-callout-box--${stratum.side}`}
                >
                  <span className="ice-badge">{stratum.label}</span>
                  <span className="ice-callout-detail">{stratum.detail}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Shown instead of the in-drawing callouts on narrow screens, where
          foreignObject text would scale down past legibility. */}
      <ul className="mce-iceberg-fallback">
        {STRATA.map((stratum) => (
          <li key={stratum.id}>
            <span className="ice-badge">{stratum.label}</span>
            <span className="ice-callout-detail">{stratum.detail}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
