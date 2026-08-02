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
      </div>
      <p className="mce-testimonial-name">{item.name}</p>
    </li>
  );
}

export function Testimonials() {
  return (
    <div
      className="elementor-element e-flex e-con-boxed e-con e-parent mce-testimonials"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div className="elementor-element elementor-widget elementor-widget-icon-box">
          <div className="elementor-icon-box-wrapper">
            <div className="elementor-icon-box-content">
              <h3 className="elementor-icon-box-title mce-section-title">
                <span className="titulo-premium">Testimonios</span>
              </h3>
            </div>
          </div>
        </div>

        <ul className="mce-testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard item={item} key={item.id} />
          ))}
        </ul>
      </div>
    </div>
  );
}
