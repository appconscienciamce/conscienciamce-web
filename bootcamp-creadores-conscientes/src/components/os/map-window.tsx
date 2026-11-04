"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter, OsCopy } from "@/content/types";
import { EDGES, STATIONS, WORLD } from "@/lib/board/layout";
import { CtaContent } from "@/components/cta-content";
import { useBoard } from "./board-provider";
import { ChevronGlyph, CloseGlyph, FolderGlyph, MaximizeGlyph, MinimizeGlyph, RestoreGlyph, SidebarGlyph } from "./glyphs";

/** Chapter 00 is the portal; chapters 01–07 are the numbered journey. */
const LAST_CHAPTER = String(STATIONS.length - 1).padStart(2, "0");

export function MapWindow({
  ui,
  chapters,
  ctaHref,
  ctaLabel,
  children,
}: {
  ui: OsCopy;
  chapters: Chapter[];
  ctaHref: string;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  const { state, engine } = useBoard();
  const { open, mode, station, maximized, overlay } = state;
  const [resumeStation, setResumeStation] = useState<number | null>(null);
  const [sidebar, setSidebar] = useState(true);
  const openerRef = useRef<HTMLButtonElement>(null);
  const exploring = mode === "explore";
  const chapter = chapters[station];

  useEffect(() => {
    engine()?.setSidebar(sidebar);
  }, [engine, sidebar]);

  // "Continue" only stands for the minimize that offered it.
  useEffect(() => {
    if (open) setResumeStation(null);
  }, [open]);

  const closeMap = (remember: boolean) => {
    setResumeStation(remember && station > 0 ? station : null);
    engine()?.close();
  };

  // Focus follows the window, without stealing it from wherever the reader is:
  // scrolling back to the desktop also closes the map.
  const windowRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const wasOverlay = useRef(false);
  const guidedRef = useRef<HTMLButtonElement>(null);
  const wasExploring = useRef(false);

  // Leaving Explore removes or disables the controls that may hold the focus.
  useEffect(() => {
    const active = document.activeElement as HTMLButtonElement | null;
    const lost = !active || active === document.body || active.disabled;
    if (wasExploring.current && !exploring && open && !overlay && lost) guidedRef.current?.focus({ preventScroll: true });
    wasExploring.current = exploring;
  }, [exploring, open, overlay]);

  useEffect(() => {
    const active = document.activeElement;
    const focusWasInside = active === document.body || !!windowRef.current?.contains(active);
    if (overlay && !wasOverlay.current) closeRef.current?.focus({ preventScroll: true });
    else if (!overlay && wasOverlay.current) document.querySelector<HTMLElement>(".view-map")?.focus({ preventScroll: true });
    else if (wasOpen.current && !open && focusWasInside) openerRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
    wasOverlay.current = overlay;
  }, [open, overlay]);

  return (
    <div
      ref={windowRef}
      className="map-window"
      data-board="win"
      data-open={open}
      role={overlay ? "dialog" : "region"}
      aria-modal={overlay || undefined}
      aria-label={ui.windowTitle}
    >
      <div className="win-bar" data-board-ui>
        <div className="win-controls">
          <div className="traffic" data-active={open || overlay}>
            <button
              ref={closeRef}
              type="button"
              className="tl tl-close"
              disabled={!open && !overlay}
              aria-label={overlay ? ui.closeMap : ui.close}
              title={overlay ? ui.closeMap : ui.close}
              onClick={() => closeMap(false)}
            >
              <CloseGlyph />
            </button>
            {!overlay && (
              <>
                <button type="button" className="tl tl-min" disabled={!open} aria-label={ui.minimize} title={ui.minimize} onClick={() => closeMap(true)}>
                  <MinimizeGlyph />
                </button>
                <button
                  type="button"
                  className="tl tl-max"
                  disabled={!open}
                  aria-label={maximized ? ui.restore : ui.maximize}
                  aria-pressed={maximized}
                  title={maximized ? ui.restore : ui.maximize}
                  onClick={() => engine()?.toggleMaximized()}
                >
                  {maximized ? <RestoreGlyph /> : <MaximizeGlyph />}
                </button>
              </>
            )}
          </div>
          {!overlay && (
            <button
              type="button"
              className="win-tool"
              disabled={!open}
              aria-expanded={sidebar}
              aria-label={sidebar ? ui.hideIndex : ui.index}
              title={sidebar ? ui.hideIndex : ui.index}
              onClick={() => setSidebar(!sidebar)}
            >
              <SidebarGlyph />
            </button>
          )}
        </div>
        <p className="win-title">{ui.windowTitle}</p>
        <div className="win-actions">
          {open ? (
            <a href={ctaHref} data-track="cta_click" className="btn btn-solid win-cta">
              <CtaContent label={ctaLabel} />
            </a>
          ) : (
            <button
              ref={openerRef}
              type="button"
              className="win-open"
              data-track="hero_cta_click"
              onClick={() => {
                if (resumeStation === null) return engine()?.openMap();
                engine()?.goTo(chapters[resumeStation].id);
              }}
            >
              {resumeStation === null ? ui.openMap : `${ui.resume} ${chapters[resumeStation].number}`}
            </button>
          )}
        </div>
      </div>

      <div className="board-view" data-board="viewport">
        <div className="world" id="mapa" data-board="world">
          {children}
        </div>

        <div className="board-ui" data-board-ui data-sidebar={sidebar}>
          <IdeaIndex ui={ui} chapters={chapters} station={station} open={sidebar} />

          {exploring && !overlay && (
            <div className="explore-pill">
              <span>{ui.exploreHint}</span>
              <button type="button" onClick={() => engine()?.resumeGuided(false)}>
                {ui.backToTour}
              </button>
              <button type="button" onClick={() => engine()?.resumeGuided(true)}>
                {ui.continueFrom} {chapter?.number}
              </button>
            </div>
          )}

          <div className="status-bar">
            {!overlay && (
              <div className="mode-switch" role="group" aria-label={`${ui.guided} / ${ui.explore}`}>
                <button ref={guidedRef} type="button" aria-pressed={!exploring} onClick={() => engine()?.setMode("guided")}>
                  {ui.guided}
                </button>
                <button type="button" aria-pressed={exploring} onClick={() => engine()?.setMode("explore")}>
                  {ui.explore}
                </button>
              </div>
            )}

            <div className="story-nav">
              {!exploring && (
                <button type="button" aria-label={ui.prev} title={ui.prev} onClick={() => engine()?.step(-1)}>
                  <ChevronGlyph direction="left" />
                </button>
              )}
              <p aria-live="polite">
                {station > 0 && (
                  <span>
                    {ui.chapter} {chapter?.number} / {LAST_CHAPTER}
                  </span>
                )}
                <em>{chapter?.label}</em>
              </p>
              {!exploring && (
                <button type="button" aria-label={ui.next} title={ui.next} onClick={() => engine()?.step(1)}>
                  <ChevronGlyph direction="right" />
                </button>
              )}
              <span className="story-progress" aria-hidden>
                <span data-hud="progress" />
              </span>
            </div>

            <div className="view-tools">
              <span className="view-coords" data-hud="coords" />
              {exploring && (
                <button type="button" aria-label={ui.zoomOut} title={ui.zoomOut} onClick={() => engine()?.zoomBy(0.8)}>
                  −
                </button>
              )}
              <button
                type="button"
                aria-label={ui.zoomReset}
                title={ui.zoomReset}
                className="view-zoom"
                disabled={!exploring}
                onClick={() => engine()?.zoomReset()}
                data-hud="zoom"
              />
              {exploring && (
                <button type="button" aria-label={ui.zoomIn} title={ui.zoomIn} onClick={() => engine()?.zoomBy(1.25)}>
                  +
                </button>
              )}
              <button type="button" className="view-fit" onClick={() => engine()?.fitMap()}>
                {ui.fit}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The idea index: a file menu that travels to any part of the board. */
function IdeaIndex({ ui, chapters, station, open }: { ui: OsCopy; chapters: Chapter[]; station: number; open: boolean }) {
  return (
    <nav className="idea-index" data-open={open} inert={!open} aria-label={ui.index}>
      <header>
        <p>{ui.index}</p>
      </header>
      <div className="idea-list" data-hud="rail" style={{ "--rows": chapters.length } as React.CSSProperties}>
        <span aria-hidden className="idea-rail" />
        <ol>
          {chapters.map((chapter, i) => (
            <li key={chapter.id} data-seen={i <= station}>
              <a href={`#${chapter.id}`} aria-current={i === station ? "location" : undefined}>
                <FolderGlyph />
                <span>
                  <small>{chapter.number}</small>
                  {chapter.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <Minimap ui={ui} chapters={chapters} station={station} />
    </nav>
  );
}

function Minimap({ ui, chapters, station }: { ui: OsCopy; chapters: Chapter[]; station: number }) {
  return (
    <div className="minimap">
      <svg viewBox={`${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`} preserveAspectRatio="none" role="group" aria-label={ui.minimap}>
        {EDGES.slice(0, STATIONS.length - 1).map((edge) => (
          <path key={edge.d} d={edge.d} className="mini-edge" />
        ))}
        {STATIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-label={chapters[i].label}>
            <title>{chapters[i].label}</title>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} className={i === station ? "mini-station is-active" : "mini-station"} />
          </a>
        ))}
        <rect data-hud="mini" className="mini-view" />
      </svg>
    </div>
  );
}

/** Small screens: the map is opt-in and full screen, never the default reading. */
export function ViewMapButton({ label }: { label: string }) {
  const { engine } = useBoard();
  return (
    <button type="button" className="view-map" onClick={() => engine()?.openOverlay()}>
      {label}
    </button>
  );
}

