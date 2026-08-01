/**
 * Line-art iceberg illustrating the MCE premise: what the world sees is the
 * surface; what sustains it sits below.
 *
 * The vertical axis is the MCE chain read from the bottom up —
 * Consciencia → Identidad → Acción → Materia — because that is the order in
 * which it actually operates: consciousness precedes identity, identity
 * precedes action, action produces matter.
 *
 * Drawn as inline SVG rather than an image so strokes stay crisp at any size,
 * the palette follows the page tokens, and the labels remain real text for
 * screen readers and translation.
 */

export function Iceberg() {
  return (
    <figure className="mce-iceberg-figure">
      <svg
        className="mce-iceberg-svg"
        viewBox="0 0 720 720"
        role="img"
        aria-labelledby="iceberg-title iceberg-desc"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="iceberg-title">
          El iceberg de Consciencia MCE
        </title>
        <desc id="iceberg-desc">
          Sobre la línea de agua, lo visible: negocio, dinero, relaciones,
          cuerpo e impacto. Debajo, lo que lo sostiene en cuatro capas
          descendentes: acción y sistemas, identidad, consciencia, y el
          principio de expansión.
        </desc>

        <defs>
          {/* Shimmer that mirrors the .titulo-premium gradient. */}
          <linearGradient id="ice-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6f6f6f" />
            <stop offset="28%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#6392EA" />
            <stop offset="72%" stopColor="#c9dbff" />
            <stop offset="100%" stopColor="#6f6f6f" />
          </linearGradient>

          <linearGradient id="ice-below" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0.20)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0.02)" />
          </linearGradient>

          <linearGradient id="ice-above" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(255 255 255 / 0.16)" />
            <stop offset="100%" stopColor="rgb(255 255 255 / 0.04)" />
          </linearGradient>

          <linearGradient id="waterline-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(47 107 255 / 0)" />
            <stop offset="18%" stopColor="rgb(47 107 255 / 0.55)" />
            <stop offset="82%" stopColor="rgb(47 107 255 / 0.55)" />
            <stop offset="100%" stopColor="rgb(47 107 255 / 0)" />
          </linearGradient>
        </defs>

        {/* ── Above the waterline: the visible tip ─────────────────────── */}
        <g className="ice-tip">
          <path
            d="M360 96 L286 250 L434 250 Z"
            fill="url(#ice-above)"
            stroke="url(#ice-edge)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Interior facets — the sense of carved ice. */}
          <path d="M360 96 L336 250" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1" fill="none" />
          <path d="M360 96 L392 250" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1" fill="none" />
        </g>

        {/* ── Waterline ────────────────────────────────────────────────── */}
        <g className="ice-waterline">
          <line
            x1="40"
            y1="250"
            x2="680"
            y2="250"
            stroke="url(#waterline-fade)"
            strokeWidth="1.5"
          />
        </g>

        {/* ── Below the waterline: the mass that sustains it ───────────── */}
        <g className="ice-mass">
          <path
            d="M286 250 L434 250 L470 366 L446 486 L392 592 L318 626 L252 566 L214 452 L238 340 Z"
            fill="url(#ice-below)"
            stroke="url(#ice-edge)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Strata dividers: the four layers, drawn as chords across the mass. */}
          <path d="M232 366 L470 366" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1" strokeDasharray="3 6" />
          <path d="M220 486 L446 486" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1" strokeDasharray="3 6" />
          <path d="M252 592 L392 592" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1" strokeDasharray="3 6" />

          {/* Interior facets. */}
          <path d="M286 250 L318 626" stroke="rgb(255 255 255 / 0.10)" strokeWidth="1" fill="none" />
          <path d="M434 250 L392 592" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1" fill="none" />
        </g>

        {/* Anchor dots where each label's leader line meets the ice. */}
        <g className="ice-nodes">
          {[
            [434, 196],
            [452, 310],
            [458, 428],
            [418, 542],
            [352, 614],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" className="ice-node" />
          ))}
        </g>
      </svg>

      {/* Labels live in the DOM, not the SVG, so they wrap and scale with the
          page's type rather than being baked into the drawing. */}
      <div className="mce-iceberg-labels">
        <p className="mce-ice-label mce-ice-label--above">
          <span className="badge-camino">Lo visible</span>
          <span className="mce-ice-label-text">
            Negocio, dinero, relaciones, cuerpo, impacto
          </span>
        </p>

        <p className="mce-ice-label mce-ice-label--waterline">
          <span className="mce-ice-waterline-text">Lo que el mundo ve</span>
        </p>

        <p className="mce-ice-label">
          <span className="badge-camino">Acción</span>
          <span className="mce-ice-label-text">
            Decisiones, hábitos y sistemas que sostienen el resultado
          </span>
        </p>

        <p className="mce-ice-label">
          <span className="badge-camino">Identidad</span>
          <span className="mce-ice-label-text">
            Quién crees que sos, qué merecés y qué podés sostener
          </span>
        </p>

        <p className="mce-ice-label">
          <span className="badge-camino">Consciencia</span>
          <span className="mce-ice-label-text">
            Paradigmas, estándares y principios desde los que operás
          </span>
        </p>

        <p className="mce-ice-label">
          <span className="badge-camino">Esencia</span>
          <span className="mce-ice-label-text">
            Mente, cuerpo y espíritu alineados: la expansión como naturaleza
          </span>
        </p>
      </div>
    </figure>
  );
}
