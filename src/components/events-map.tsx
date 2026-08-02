'use client';

import { useState } from 'react';
import WorldMap from '@/components/ui/world-map';

/**
 * Upcoming events on a world map.
 *
 * WorldMap draws a pulsing dot at both ends of every arc, so routing both
 * events out of a shared origin would stack two dots on the same spot. The arc
 * runs Bariloche → Egypt instead: one dot per destination, no duplicates.
 *
 * The component has no notion of interaction, so the markers are a layer on
 * top of it, positioned with the same projection it uses internally.
 */

type EventPin = {
  id: string;
  place: string;
  date: string;
  blurb: string;
  image: string;
  lat: number;
  lng: number;
  /** Which side the card opens towards, to stay inside the map. */
  align: 'left' | 'right';
};

const EVENTS: EventPin[] = [
  {
    id: 'bariloche',
    place: 'Bariloche',
    date: 'Fecha a confirmar',
    blurb: 'Un encuentro entre montaña y lago, para bajar a tierra lo trabajado.',
    image: '/bariloche.jpg',
    lat: -41.1335,
    lng: -71.3103,
    align: 'right',
  },
  {
    id: 'egipto',
    place: 'Egipto',
    date: 'Fecha a confirmar',
    blurb: 'Un viaje a los orígenes, donde la consciencia y la materia se cruzan.',
    image: '/egipto.jpg',
    lat: 26.8206,
    lng: 30.8025,
    align: 'left',
  },
];

/** Same projection WorldMap applies to its own points. */
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 100,
});

function Pin({ event }: { event: EventPin }) {
  const [open, setOpen] = useState(false);
  const { x, y } = project(event.lat, event.lng);

  return (
    <div
      className={`mce-map-pin mce-map-pin--${event.align}${open ? ' is-open' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="mce-map-hit"
        aria-expanded={open}
        aria-label={`Ver el evento en ${event.place}`}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mce-map-hit-dot" aria-hidden="true" />
        <span className="mce-map-badge">{event.place}</span>
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
}

export function EventsMap() {
  return (
    <div className="mce-map">
      <div className="mce-map-canvas">
        <WorldMap
          lineColor="#2f6bff"
          dots={[
            {
              start: { lat: EVENTS[0].lat, lng: EVENTS[0].lng },
              end: { lat: EVENTS[1].lat, lng: EVENTS[1].lng },
            },
          ]}
        />

        {EVENTS.map((event) => (
          <Pin event={event} key={event.id} />
        ))}
      </div>

      {/* Below the map on narrow screens, where the pins are too small to hit. */}
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
