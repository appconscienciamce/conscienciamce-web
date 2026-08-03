import React from 'react';

/**
 * "¿Para quién es esto?" as Aceternity's features grid.
 *
 * Structure and classes are the published demo's. Two adaptations:
 *   - `dark:` variants are dropped and their values applied directly, since
 *     this page has no `dark` class
 *   - the demo seeds its square pattern with Math.random() at render time,
 *     which produces different markup on the server and the client and breaks
 *     hydration. Each card is given a fixed pattern instead.
 */

const grid = [
  {
    title: 'Tenés más potencial del que estás expresando',
    description:
      'Sabés que tenés más potencial del que hoy estás expresando en tu negocio y en tu vida, pero todavía no conseguís llevarlo a resultados de forma consistente.',
    pattern: [
      [8, 1],
      [9, 3],
      [7, 5],
      [10, 2],
      [8, 6],
    ],
  },
  {
    title: 'Entendés la teoría, pero tu realidad no la refleja',
    description:
      'Has consumido desarrollo personal, espiritualidad o consciencia, entendés muchas cosas a nivel teórico, pero tu realidad todavía no refleja todo lo que sabés.',
    pattern: [
      [7, 2],
      [10, 4],
      [8, 6],
      [9, 1],
      [7, 4],
    ],
  },
  {
    title: 'Te cuesta sostener los resultados',
    description:
      'Has conseguido resultados, pero te cuesta sostenerlos sin volver a caer en los mismos patrones, perder claridad o desconectarte de tu visión.',
    pattern: [
      [9, 5],
      [7, 1],
      [10, 3],
      [8, 2],
      [9, 6],
    ],
  },
  {
    title: 'No querés elegir entre lo material y lo espiritual',
    description:
      'Querés construir un negocio con propósito sin tener que elegir entre expansión material y desarrollo espiritual, integrando ambos en una misma forma de vivir y operar.',
    pattern: [
      [10, 1],
      [8, 4],
      [7, 6],
      [9, 2],
      [10, 5],
    ],
  },
  {
    title: 'Tu siguiente nivel no es otra estrategia',
    description:
      'Sentís que tu siguiente nivel no depende de aprender otra estrategia, sino de elevar tus estándares, transformar tu identidad y convertirte en la persona capaz de sostener una realidad más grande.',
    pattern: [
      [8, 3],
      [9, 6],
      [7, 2],
      [10, 4],
      [8, 1],
    ],
  },
];

export function PathsGrid() {
  return (
    <div className="py-20 lg:py-40">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
        {grid.map((feature, index) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 rounded-3xl overflow-hidden"
          >
            <Grid size={20} pattern={feature.pattern} patternKey={index} />
            <p className="text-base font-bold text-white relative z-20">{feature.title}</p>
            <p className="text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Grid = ({
  pattern,
  size,
  patternKey,
}: {
  pattern?: number[][];
  size?: number;
  patternKey: string | number;
}) => {
  const p = pattern ?? [
    [8, 1],
    [9, 3],
    [7, 5],
    [10, 2],
    [8, 6],
  ];

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-900/30 to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          patternKey={patternKey}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-white/10 stroke-white/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  patternKey,
  ...props
}: {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
  /** Stable id source, so the pattern needs no client-side hook. */
  patternKey: string | number;
  [key: string]: unknown;
}) {
  const patternId = `mce-grid-${patternKey}`;

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy]) => (
            <rect
              strokeWidth="0"
              key={`${sx}-${sy}`}
              width={width + 1}
              height={height + 1}
              x={sx * width}
              y={sy * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
