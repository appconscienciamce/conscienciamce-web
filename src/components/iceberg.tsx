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

type Stratum = {
  id: string;
  label: string;
  detail: string;
  /** y of the label bar's top edge, in viewBox units. */
  y: number;
  /** y where the connector meets the ice. */
  anchorY: number;
};

const STRATA: Stratum[] = [
  {
    id: 'visible',
    label: 'Lo visible',
    detail: 'Negocio, dinero, relaciones, cuerpo, impacto',
    y: 60,
    anchorY: 150,
  },
  {
    id: 'accion',
    label: 'Acción',
    detail: 'Decisiones, hábitos y sistemas que sostienen el resultado',
    y: 330,
    anchorY: 420,
  },
  {
    id: 'identidad',
    label: 'Identidad',
    detail: 'Quién creés que sos, qué merecés y qué podés sostener',
    y: 470,
    anchorY: 560,
  },
  {
    id: 'consciencia',
    label: 'Consciencia',
    detail: 'Paradigmas, estándares y principios desde los que operás',
    y: 610,
    anchorY: 700,
  },
  {
    id: 'esencia',
    label: 'Esencia',
    detail: 'Mente, cuerpo y espíritu alineados: la expansión como naturaleza',
    y: 750,
    anchorY: 830,
  },
];

const LABEL_X = 470;
const CONNECTOR_X = 430;

export function Iceberg() {
  return (
    <figure className="mce-iceberg-figure">
      <svg
        className="mce-iceberg-svg"
        viewBox="0 0 1040 900"
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
            <stop offset="0%" stopColor="rgb(47 107 255 / 0.14)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0.02)" />
          </linearGradient>

          <linearGradient id="waterline-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0)" />
            <stop offset="20%" stopColor="rgb(47 107 255 / 0.6)" />
            <stop offset="80%" stopColor="rgb(47 107 255 / 0.6)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0)" />
          </linearGradient>
        </defs>

        {/* Submerged water field. */}
        <rect
          className="ice-water"
          x="0"
          y="270"
          width="430"
          height="630"
          fill="url(#water-veil)"
        />

        <g id="mce-iceberg-scenery">
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
            x2="430"
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
            {/* Connector from the ice to the label bar. */}
            <path
              className="ice-connector"
              d={`M${CONNECTOR_X},${stratum.anchorY} L${LABEL_X - 8},${stratum.y + 26}`}
              stroke="rgb(47 107 255 / 0.55)"
              strokeWidth="2"
              strokeDasharray="6 7"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={CONNECTOR_X} cy={stratum.anchorY} r="4" className="ice-node" />

            <foreignObject
              x={LABEL_X}
              y={stratum.y}
              width={1040 - LABEL_X - 10}
              height="130"
            >
              <div className="ice-callout-box">
                <span className="badge-camino">{stratum.label}</span>
                <span className="ice-callout-detail">{stratum.detail}</span>
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Waterline caption sits with the drawing, not the strata. */}
        <text
          className="ice-waterline-caption"
          x="0"
          y="296"
          fill="rgb(255 255 255 / 0.5)"
        >
          Lo que el mundo ve
        </text>
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
