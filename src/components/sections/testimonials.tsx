'use client';

import { useState } from 'react';

/**
 * Testimonial videos, three across on desktop and stacked on mobile.
 *
 * The videos live on Google Drive, which only embeds through an iframe. Six
 * iframes loading at once is a lot of weight for a section most readers scroll
 * past, so each card starts as a poster with a play button and only mounts its
 * iframe once clicked.
 */

type Testimonial = {
  id: string;
  name: string;
  /** Google Drive file id. */
  fileId: string;
};

const TESTIMONIALS: Testimonial[] = [
  { id: 'cielo', name: 'Cielo', fileId: '1xpnpC7T2kBEl30cLhwppLa11NyLSUVt_' },
  { id: 'denise', name: 'Denise', fileId: '1I3G0HyAjjmRBBvN9exIZzd_0iatRCCoG' },
  { id: 'gonzalo', name: 'Gonzalo', fileId: '1hduoL_abInhiiOV0F5paUFjGuqhF30iP' },
  { id: 'laureano', name: 'Laureano', fileId: '1d9i4hiS92YfQlOG5i5KrTN85ipsSuL8v' },
  { id: 'lucas', name: 'Lucas', fileId: '172FjYBV1lR39QJ65Layk4K8RA-b2pihz' },
  { id: 'nicolas', name: 'Nicolás', fileId: '1ekHqGXhFNFLt5LauJg-06LHeOEoYS-wT' },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  const [playing, setPlaying] = useState(false);

  return (
    <li className="mce-testimonial">
      <div className="mce-testimonial-frame">
        {playing ? (
          <iframe
            src={`https://drive.google.com/file/d/${item.fileId}/preview`}
            title={`Testimonio de ${item.name}`}
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="mce-testimonial-play"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir el testimonio de ${item.name}`}
          >
            {/* Drive serves a still for each file; it stands in until play. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://drive.google.com/thumbnail?id=${item.fileId}&sz=w640`}
              alt=""
              loading="lazy"
            />
            <span className="mce-testimonial-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}

        {/* The name sits inside the frame, over a shadow that keeps it legible
            against whatever the still happens to show. */}
        {playing ? null : <p className="mce-testimonial-name">{item.name}</p>}
      </div>
    </li>
  );
}

export function Testimonials() {
  return (
    <section className="mce-testimonials">
      <div className="mce-testimonials-inner">
        <h3 className="mce-section-title">
          <span className="titulo-premium">Testimonios</span>
        </h3>

        <ul className="mce-testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard item={item} key={item.id} />
          ))}
        </ul>
      </div>
    </section>
  );
}
