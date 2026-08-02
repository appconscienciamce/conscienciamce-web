'use client';

import { useState } from 'react';
import WorldMap from '@/components/ui/world-map';

/**
 * Upcoming events on a world map.
 *
 * WorldMap draws the arcs and their pulsing endpoints but has no notion of
 * interaction, so the clickable markers are a layer on top of it, positioned
 * with the same projection the component uses internally. The map is left
 * untouched.
 */

type EventPin = {
  id: string;
  place: string;
  country: string;
  date: string;
  blurb: string;
  image: string;
  lat: number;
  lng: number;
};

/** Buenos Aires — where the arcs start. */
const ORIGIN = { lat: -34.6037, lng: -58.3816 };

const EVENTS: EventPin[] = [
  {
    id: 'bariloche',
    place: 'Bariloche',
    country: 'Argentina',
    date: 'Fecha a confirmar',
    blurb: 'Un encuentro entre montaña y lago, para bajar a tierra lo trabajado.',
    image: '/wp-content/uploads/2026/03/img13.webp',
    lat: -41.1335,
    lng: -71.3103,
  },
  {
    id: 'egipto',
    place: 'Egipto',
    country: 'Egipto',
    date: 'Fecha a confirmar',
    blurb: 'Un viaje a los orígenes, donde la consciencia y la materia se cruzan.',
    image: '/wp-content/uploads/2026/03/img20.webp',
    lat: 26.8206,
    lng: 30.8025,
  },
];

/** Same projection WorldMap applies to its own points. */
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) * (800 / 360) * 100) / 800,
  y: ((90 - lat) * (400 / 180) * 100) / 400,
});

export function EventsMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mce-map">
      <div className="mce-map-canvas">
        <WorldMap
          lineColor="#2f6bff"
          dots={EVENTS.map((event) => ({
            start: ORIGIN,
            end: { lat: event.lat, lng: event.lng },
          }))}
        />

        {EVENTS.map((event) => {
          const { x, y } = project(event.lat, event.lng);
          const isOpen = active === event.id;

          return (
            <div
              key={event.id}
              className={`mce-map-pin${isOpen ? ' is-open' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <button
                type="button"
                className="mce-map-hit"
                aria-expanded={isOpen}
                aria-label={`Ver el evento en ${event.place}`}
                onClick={() => setActive(isOpen ? null : event.id)}
              >
                <span className="mce-map-hit-dot" aria-hidden="true" />
              </button>

              <div className="mce-map-card" role="dialog" aria-label={event.place}>
                <div className="mce-map-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.image} alt="" loading="lazy" />
                </div>
                <div className="mce-map-card-body">
                  <p className="mce-map-card-place">{event.place}</p>
                  <p className="mce-map-card-date">{event.date}</p>
                  <p className="mce-map-card-blurb">{event.blurb}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* On narrow screens the pins are too small to hit, so the same
          information is listed below the map. */}
      <ul className="mce-map-list">
        {EVENTS.map((event) => (
          <li key={event.id}>
            <div className="mce-map-card-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.image} alt="" loading="lazy" />
            </div>
            <div className="mce-map-card-body">
              <p className="mce-map-card-place">{event.place}</p>
              <p className="mce-map-card-date">{event.date}</p>
              <p className="mce-map-card-blurb">{event.blurb}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
