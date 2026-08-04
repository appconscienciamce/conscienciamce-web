'use client';

import { useState } from 'react';
import WorldMap from '@/components/ui/world-map';

/**
 * Upcoming events on a world map.
 *
 * Pin placement is given in percentages of the map box rather than lat/lng.
 * The rendered map is a 1056x495 image inside a 2:1 container, so its drawing
 * does not line up with a plain equirectangular projection — positions measured
 * against what is actually on screen are the reliable ones.
 *
 * The arc is then derived from those same percentages, so the line always
 * lands on the pins instead of drifting from them.
 */

type EventPin = {
  id: string;
  place: string;
  date: string;
  blurb: string;
  image: string;
  /** Position within the map box, in percent. */
  x: number;
  y: number;
  /** Where the pin sits on narrow screens, where the map is cropped. */
  mobileX: number;
  mobileY: number;
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
    x: 34,
    y: 90,
    mobileX: 40,
    mobileY: 90,
    align: 'right',
  },
  {
    id: 'egipto',
    place: 'Egipto',
    date: 'Fecha a confirmar',
    blurb: 'Un viaje a los orígenes, donde la consciencia y la materia se cruzan.',
    image: '/egipto.jpg',
    x: 55,
    y: 42,
    mobileX: 50,
    mobileY: 45,
    align: 'left',
  },
];

/**
 * WorldMap takes lat/lng and projects with x = (lng+180)*(800/360),
 * y = (90-lat)*(400/180) over an 800x400 viewBox. Inverting that lets a
 * measured percentage drive the arc.
 */
const toLatLng = (xPct: number, yPct: number) => ({
  lng: (xPct / 100) * 360 - 180,
  lat: 90 - (yPct / 100) * 180,
});

function Pin({ event }: { event: EventPin }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`mce-map-pin mce-map-pin--${event.align}${open ? ' is-open' : ''}`}
      style={{
        left: `var(--pin-x, ${event.x}%)`,
        top: `var(--pin-y, ${event.y}%)`,
        ['--pin-mobile-x' as string]: `${event.mobileX}%`,
        ['--pin-mobile-y' as string]: `${event.mobileY}%`,
      }}
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

function EventDetails({ event }: { event: EventPin }) {
  return (
    <>
      <div className="mce-map-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.image} alt="" loading="lazy" />
      </div>
      <div className="mce-map-card-body">
        <p className="mce-map-card-place">{event.place}</p>
        <p className="mce-map-card-date">{event.date}</p>
        <p className="mce-map-card-blurb">{event.blurb}</p>
      </div>
    </>
  );
}

export function EventsMap() {
  return (
    <div className="mce-map">
      <p className="mce-map-hint">
        Pasá el mouse o tocá los puntos de destino
      </p>

      <div className="mce-map-canvas">
        <WorldMap
          lineColor="#2f6bff"
          dots={[
            {
              start: toLatLng(EVENTS[0].x, EVENTS[0].y),
              end: toLatLng(EVENTS[1].x, EVENTS[1].y),
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
            <EventDetails event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}
