'use client';

import { useState } from 'react';

/**
 * Testimonial videos, three across on desktop and stacked on mobile.
 *
 * The videos are unlisted YouTube uploads. Six iframes loading at once is a
 * lot of weight for a section most readers scroll past, so each card starts as
 * a poster with a play button and only mounts its iframe once clicked.
 */

type Testimonial = {
  id: string;
  name: string;
  /** YouTube video id. */
  videoId: string;
};

const TESTIMONIALS: Testimonial[] = [
  { id: 'cielo', name: 'Cielo', videoId: '4KqPW5kEa-s' },
  { id: 'denise', name: 'Denise', videoId: 'ElEjtQWUoM4' },
  { id: 'gonzalo', name: 'Gonzalo', videoId: 'DFetk1jh2Ac' },
  { id: 'laureano', name: 'Laureano', videoId: 'Z9HtD4_jbUc' },
  { id: 'lucas', name: 'Lucas', videoId: '8u1wb35RSbA' },
  { id: 'nicolas', name: 'Nicolás', videoId: '2XxkjfUsiwE' },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  const [playing, setPlaying] = useState(false);

  return (
    <li className="mce-testimonial scroll-bottom">
      <div className="mce-testimonial-frame">
        {playing ? (
          /* `autoplay=1` is what makes the click that mounted this frame also
             start the video; without it the reader has to press play twice.
             nocookie defers YouTube's tracking cookies until playback. */
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`Testimonio de ${item.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="mce-testimonial-play"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir el testimonio de ${item.name}`}
          >
            {/* YouTube's own still stands in until play. hqdefault is the
                largest size present for every upload — maxresdefault only
                exists above 720p and 404s otherwise. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
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
        <h3 className="mce-section-title scroll-bottom">
          <span className="titulo-premium">Testimonios</span>
        </h3>

        <ul className="mce-testimonial-grid reveal-stagger">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard item={item} key={item.id} />
          ))}
        </ul>
      </div>
    </section>
  );
}
