'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';

/**
 * What the Club includes, as a bento grid.
 *
 * GlowingEffect traces a gradient along each card's border as the cursor
 * approaches. Its palette is hardcoded in the vendored component; the blues
 * are substituted by overriding the --gradient custom property in CSS rather
 * than editing the component, so it stays updatable.
 */

type Item = {
  id: string;
  title: string;
  detail?: string;
  /** Cards that span two columns on wide screens. */
  wide?: boolean;
};

const ITEMS: Item[] = [
  { id: 'app', title: 'La app', detail: 'Para sostener cada día lo que entrenás', wide: true },
  { id: 'mentorias', title: '2 mentorías semanales' },
  { id: 'filosofia', title: 'La filosofía, tecnología, principios y valores de MCE' },
  { id: 'protocolos', title: 'Protocolos prácticos' },
  { id: 'comunidad', title: 'Comunidad de líderes y emprendedores conscientes' },
  { id: 'eventos', title: 'Acceso a nuestros eventos privados', wide: true },
];

export function ClubGrid() {
  return (
    <ul className="mce-bento">
      {ITEMS.map((item) => (
        <li
          key={item.id}
          className={`mce-bento-item${item.wide ? ' mce-bento-item--wide' : ''}`}
        >
          <div className="mce-bento-card">
            <GlowingEffect
              spread={44}
              glow
              disabled={false}
              proximity={72}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="mce-bento-content">
              <h4 className="mce-bento-title">{item.title}</h4>
              {item.detail ? <p className="mce-bento-detail">{item.detail}</p> : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
