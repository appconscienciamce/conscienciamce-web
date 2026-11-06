"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter, OsCopy } from "@/content/types";
import { EDGES, STATIONS, WORLD } from "@/lib/board/layout";
import { useBoard } from "./board-provider";
import { ChevronGlyph, MapGlyph } from "./glyphs";

/** The whole board in miniature. */
export function MapArt() {
  return (
    <svg viewBox={`${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`} preserveAspectRatio="none" aria-hidden>
      {EDGES.slice(0, STATIONS.length - 1).map((edge) => (
        <path key={edge.d} d={edge.d} pathLength={1} />
      ))}
      {STATIONS.map((s) => (
        <rect key={s.id} x={s.x} y={s.y} width={s.w} height={s.h} rx={60} />
      ))}
    </svg>
  );
}

/** The map, shown as what it is: a place to walk through, not one more button. */
export function MapCard({ title, text, cta }: { title: string; text: string; cta: string }) {
  const { engine } = useBoard();
  return (
    <button type="button" className="map-card" onClick={(e) => engine()?.openOverlay(e.currentTarget)}>
      <MapArt />
      <span className="map-card-text">
        <strong>{title}</strong>
        <span>{text}</span>
      </span>
      <span className="map-card-cta">
        {cta}
        <ChevronGlyph direction="right" />
      </span>
    </button>
  );
}

/**
 * Where the reader is on a page this long, and the way to any other chapter.
 * Runs only in the vertical reading: on the board the map already says all this.
 */
export function ChapterBar({ chapters, ui }: { chapters: Chapter[]; ui: OsCopy }) {
  const { state, engine } = useBoard();
  const [current, setCurrent] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const chapter = chapters[current];

  useEffect(() => {
    if (state.board) return;
    const stations = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(stations.indexOf(entry.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    stations.forEach((station) => observer.observe(station));

    let frame = 0;
    const paint = () => {
      frame = 0;
      const root = document.documentElement;
      const range = root.scrollHeight - window.innerHeight;
      barRef.current?.style.setProperty("--read", String(range > 0 ? Math.min(1, window.scrollY / range) : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [state.board]);

  const closeSheet = () => sheetRef.current?.close();

  return (
    <div ref={barRef} className="chapter-bar">
      <button type="button" aria-haspopup="dialog" onClick={() => sheetRef.current?.showModal()}>
        {current > 0 && <span className="chapter-bar-number">{chapter.number}</span>}
        <span className="chapter-bar-label">{chapter.label}</span>
        <span className="chapter-bar-action">
          {ui.chaptersLabel}
          <ChevronGlyph direction="right" />
        </span>
      </button>
      <span aria-hidden className="chapter-bar-progress" />

      <dialog ref={sheetRef} className="chapter-sheet" aria-label={ui.chaptersLabel} onClick={(e) => e.target === e.currentTarget && closeSheet()}>
        <div className="chapter-sheet-body">
          <span aria-hidden className="chapter-sheet-grip" />
          <p>{ui.chaptersLabel}</p>
          <ol>
            {chapters.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={i === current ? "location" : undefined} onClick={closeSheet}>
                  <small>{item.number}</small>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="chapter-sheet-map"
            onClick={() => {
              closeSheet();
              engine()?.openOverlay();
            }}
          >
            <MapGlyph />
            {ui.mapCard.full}
          </button>
        </div>
      </dialog>
    </div>
  );
}
