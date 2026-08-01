/**
 * Faceted line-art iceberg for the "¿Qué es Consciencia MCE?" section.
 *
 * Structure follows the classic iceberg diagram: overlapping facets build the
 * ice mass on the left, and each stratum is called out on the right by a solid
 * label bar joined to the drawing by a dashed connector.
 *
 * The vertical axis is the MCE chain read bottom-up — Esencia → Consciencia →
 * Identidad → Acción → the visible tip — because that is the order in which it
 * operates: consciousness precedes identity, identity precedes action, action
 * produces matter.
 *
 * Palette is the page's own: white-with-alpha ice against the #2f6bff accent,
 * not the cyan of the reference sketch.
 *
 * Labels are <foreignObject> HTML rather than <text> so copy wraps and
 * inherits page typography instead of being baked into the drawing.
 */

/**
 * The ice is drawn in its own coordinates and shifted down by ICE_OFFSET_Y so
 * the peak has headroom. Anchor points are measured against the ice silhouette
 * at each stratum's height, so connectors leave the ice where it actually is
 * rather than from a fixed column.
 */
const ICE_OFFSET_Y = 30;

type Stratum = {
  id: string;
  label: string;
  detail: string;
  /** y where the connector leaves the ice (already includes the offset). */
  anchorY: number;
  /** x of the ice's right edge at that height. */
  anchorX: number;
};

const STRATA: Stratum[] = [
  {
    id: 'visible',
    label: 'Lo visible',
    detail: 'Negocio, dinero, relaciones, cuerpo, impacto',
    anchorX: 368,
    anchorY: 135 + ICE_OFFSET_Y,
  },
  {
    id: 'accion',
    label: 'Acción',
    detail: 'Decisiones, hábitos y sistemas que sostienen el resultado',
    anchorX: 353,
    anchorY: 370 + ICE_OFFSET_Y,
  },
  {
    id: 'identidad',
    label: 'Identidad',
    detail: 'Quién creés que sos, qué merecés y qué podés sostener',
    anchorX: 375,
    anchorY: 460 + ICE_OFFSET_Y,
  },
  {
    id: 'consciencia',
    label: 'Consciencia',
    detail: 'Paradigmas, estándares y principios desde los que operás',
    anchorX: 290,
    anchorY: 550 + ICE_OFFSET_Y,
  },
  {
    id: 'esencia',
    label: 'Esencia',
    detail: 'Mente, cuerpo y espíritu alineados: la expansión como naturaleza',
    anchorX: 236,
    anchorY: 630 + ICE_OFFSET_Y,
  },
];

/** Where every connector turns to run into its label. */
const LABEL_X = 470;
/** Vertical centre of a label box, relative to its top edge. */
const LABEL_MID = 26;

export function Iceberg() {
  return (
    <figure className="mce-iceberg-figure">
      <svg
        className="mce-iceberg-svg"
        viewBox="0 0 1040 740"
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

          {/* Water fades out on all sides so it has no visible hard edge. */}
          <linearGradient id="water-veil" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0.16)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0)" />
          </linearGradient>

          <linearGradient id="water-sides" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="14%" stopColor="#fff" stopOpacity="1" />
            <stop offset="72%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>

          <mask id="water-mask">
            <rect x="0" y="300" width="560" height="440" fill="url(#water-sides)" />
          </mask>

          <linearGradient id="waterline-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0)" />
            <stop offset="20%" stopColor="rgb(47 107 255 / 0.6)" />
            <stop offset="80%" stopColor="rgb(47 107 255 / 0.6)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0)" />
          </linearGradient>
        </defs>

        {/* Submerged water field, faded at every edge. */}
        <rect
          className="ice-water"
          x="0"
          y="300"
          width="560"
          height="440"
          fill="url(#water-veil)"
          mask="url(#water-mask)"
        />

        <g id="mce-iceberg-scenery" transform={`translate(0 ${ICE_OFFSET_Y})`}>
          {/* ── Tip: the visible facets ──────────────────────────────── */}
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

          {/* ── Waterline ───────────────────────────────────────────── */}
          <line
            className="ice-waterline"
            x1="0"
            y1="270"
            x2="520"
            y2="270"
            stroke="url(#waterline-fade)"
            strokeWidth="2"
          />

          {/* ── Submerged mass ──────────────────────────────────────── */}
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
            {/* Facet seams. */}
            <path d="M139,270 L212,665" stroke="rgb(255 255 255 / 0.10)" strokeWidth="1" fill="none" />
            <path d="M293,270 L277,571" stroke="rgb(255 255 255 / 0.07)" strokeWidth="1" fill="none" />
          </g>
        </g>

        {/* ── Strata callouts ───────────────────────────────────────── */}
        {STRATA.map((stratum) => (
          <g key={stratum.id} className="ice-callout" data-stratum={stratum.id}>
            {/* Elbow connector: out from the ice, then across to the label. */}
            <path
              className="ice-connector"
              d={`M${stratum.anchorX},${stratum.anchorY} H${LABEL_X - 34} V${stratum.anchorY - LABEL_MID} H${LABEL_X - 10}`}
              stroke="rgb(47 107 255 / 0.5)"
              strokeWidth="1.5"
              strokeDasharray="5 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx={stratum.anchorX} cy={stratum.anchorY} r="4" className="ice-node" />

            <foreignObject
              x={LABEL_X}
              y={stratum.anchorY - LABEL_MID * 2}
              width={1040 - LABEL_X - 10}
              height="120"
            >
              <div className="ice-callout-box">
                <span className="badge-camino">{stratum.label}</span>
                <span className="ice-callout-detail">{stratum.detail}</span>
              </div>
            </foreignObject>
          </g>
        ))}

      </svg>

      {/* Shown instead of the in-drawing callouts on narrow screens, where
          foreignObject text would scale down past legibility. */}
      <ul className="mce-iceberg-fallback">
        {STRATA.map((stratum) => (
          <li key={stratum.id}>
            <span className="badge-camino">{stratum.label}</span>
            <span className="ice-callout-detail">{stratum.detail}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
