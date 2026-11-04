"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBoard } from "@/components/os/board-provider";
import { CloseGlyph } from "@/components/os/glyphs";

const OPEN_MS = 420;
const CLOSE_MS = 260;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

/** Everything behind the video window while it is open. */
const BOARD_BACKGROUND = ".world,.board-ui,.win-bar,.sys-bar,.site-footer,.skip-link";
const PAGE_BACKGROUND = ".track,.thanks-shell,.site-footer,.flow-bar,.view-map,.skip-link";

/** Keys that scroll the page while focus sits on the window's only control. */
const SCROLL_KEYS = new Set(["PageUp", "PageDown", "Home", "End", " "]);

/** The transform that lays the window over the poster it came from. */
function fromPoster(poster: HTMLElement, win: HTMLElement) {
  const a = poster.getBoundingClientRect();
  const b = win.getBoundingClientRect();
  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${a.width / b.width})`;
}

/**
 * Testimonial video as a poster until clicked. Six iframes on load would be
 * heavy for a section many readers skim, so each one mounts on demand, in a
 * window that lives outside the scaled board: at low zoom a video inside its
 * card would be too small to watch. Uses youtube-nocookie so nothing is set
 * before the reader presses play.
 */
export function VideoCard({
  name,
  videoId,
  closeLabel,
  caption = true,
  windowTitle = `Testimonio de ${name}`,
  playLabel = `Reproducir el testimonio de ${name}`,
}: {
  name: string;
  videoId: string;
  closeLabel: string;
  caption?: boolean;
  windowTitle?: string;
  playLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const posterRef = useRef<HTMLButtonElement>(null);

  return (
    <figure className="video-card">
      <div className="video-frame">
        <button ref={posterRef} type="button" onClick={() => setOpen(true)} aria-label={playLabel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" draggable={false} />
          <span aria-hidden className="video-play">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
        </button>
      </div>
      <noscript>
        <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">
          {playLabel}
        </a>
      </noscript>
      {caption && <figcaption>{name}</figcaption>}
      {open && <VideoWindow title={windowTitle} videoId={videoId} closeLabel={closeLabel} posterRef={posterRef} onClosed={() => setOpen(false)} />}
    </figure>
  );
}

function VideoWindow({
  title,
  videoId,
  closeLabel,
  posterRef,
  onClosed,
}: {
  title: string;
  videoId: string;
  closeLabel: string;
  posterRef: React.RefObject<HTMLButtonElement | null>;
  onClosed: () => void;
}) {
  const { state } = useBoard();
  const scrimRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const opening = useRef<Animation | null>(null);
  const onBoard = useRef(document.documentElement.classList.contains("board-on"));
  const boardAtOpen = useRef(state.board);
  const [host] = useState(() => (onBoard.current ? document.querySelector('[data-board="viewport"]') : null) ?? document.body);
  const label = `${closeLabel}: ${title}`;

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const win = windowRef.current;
    const poster = posterRef.current;
    if (!win || !poster || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onClosed();
    scrimRef.current?.setAttribute("data-closing", "true");
    // Still flying in: going back along the same path is the honest way out,
    // and measuring now would read a window that is mid-transform.
    if (opening.current?.playState === "running") {
      opening.current.reverse();
      opening.current.finished.then(onClosed, onClosed);
      return;
    }
    win
      .animate([{ transform: "none", opacity: 1 }, { transform: fromPoster(poster, win), opacity: 0 }], {
        duration: CLOSE_MS,
        easing: EASING,
        fill: "forwards",
      })
      .finished.then(onClosed, onClosed);
  };

  useLayoutEffect(() => {
    const win = windowRef.current;
    const poster = posterRef.current;
    if (!win || !poster || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    opening.current = win.animate([{ transform: fromPoster(poster, win), opacity: 0.4 }, { transform: "none", opacity: 1 }], {
      duration: OPEN_MS,
      easing: EASING,
    });
  }, [posterRef]);

  useEffect(() => {
    const background = Array.from(document.querySelectorAll<HTMLElement>(onBoard.current ? BOARD_BACKGROUND : PAGE_BACKGROUND));
    const poster = posterRef.current;
    // The phone map already keeps some of these inert: give back what was found.
    const previous = background.map((el) => el.inert);
    background.forEach((el) => (el.inert = true));
    closeRef.current?.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent("cc:video", { detail: { open: true } }));

    // Capture: the board listens on window and would take these keys first.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key.startsWith("Arrow")) {
        e.stopPropagation();
        e.preventDefault();
      } else if (SCROLL_KEYS.has(e.key) && !(e.target as Element).closest("button")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey, true);

    // Pinned rather than overflow: hidden, which would drop the scrollbar and
    // shift the layout. A wheel over the iframe can only be undone, not blocked.
    const pinnedY = window.scrollY;
    const onScroll = () => {
      if (window.scrollY !== pinnedY) window.scrollTo(0, pinnedY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const scrim = scrimRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    scrim?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll);
      scrim?.removeEventListener("wheel", onWheel);
      background.forEach((el, i) => (el.inert = previous[i]));
      window.dispatchEvent(new CustomEvent("cc:video", { detail: { open: false } }));
      poster?.focus({ preventScroll: true });
    };
    // Runs once per window; `close` only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Crossing the breakpoint rebuilds the layout this window is attached to.
  useEffect(() => {
    if (state.board !== boardAtOpen.current) onClosed();
  }, [state.board, onClosed]);

  return createPortal(
    <div
      ref={scrimRef}
      className="video-scrim"
      data-board-ui
      data-on-board={onBoard.current}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div ref={windowRef} className="video-window" role="dialog" aria-modal aria-label={title}>
        <div className="video-window-bar">
          <span className="traffic" data-active="true">
            <button ref={closeRef} type="button" className="tl tl-close" aria-label={label} title={label} onClick={close}>
              <CloseGlyph />
            </button>
            <span aria-hidden className="tl tl-off" />
            <span aria-hidden className="tl tl-off" />
          </span>
          <span className="video-window-title">{title}</span>
        </div>
        <div className="video-window-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    host,
  );
}
