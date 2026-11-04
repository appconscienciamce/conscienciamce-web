"use client";

import { useState } from "react";

/**
 * Testimonial video as a poster until clicked. Six iframes on load would be
 * heavy for a section many readers skim; this mounts each one on demand.
 * Uses youtube-nocookie so nothing is set before the reader presses play.
 */
export function VideoCard({ name, videoId }: { name: string; videoId: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="group">
      <div className="relative aspect-video overflow-hidden rounded-[9px] bg-[var(--ink)]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`Testimonio de ${name}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir el testimonio de ${name}`}
            className="absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover grayscale-[0.35] transition duration-500 group-hover:grayscale-0"
            />
            <span
              aria-hidden
              className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--putty)] text-[var(--ink)] transition-transform duration-300 group-hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-[0.9375rem] font-medium">{name}</figcaption>
    </figure>
  );
}
