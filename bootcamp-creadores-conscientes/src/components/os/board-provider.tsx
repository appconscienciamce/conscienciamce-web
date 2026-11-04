"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BoardEngine, type BoardState } from "@/lib/board/engine";
import { STATIONS } from "@/lib/board/layout";
import { track, type TrackEvent } from "@/lib/analytics";

interface BoardContextValue {
  state: BoardState;
  engine: () => BoardEngine | null;
}

const initial: BoardState = { board: false, open: false, mode: "guided", station: 0, maximized: false, overlay: false };

const BoardContext = createContext<BoardContextValue>({ state: initial, engine: () => null });

export const useBoard = () => useContext(BoardContext);

/** Lays out on the server, measures on the client before the first paint. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Mounts the single viewport controller and routes in-page links through it. */
export function BoardProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<BoardEngine | null>(null);
  const [state, setState] = useState<BoardState>(initial);

  useIsoLayoutEffect(() => {
    const query = (name: string) => document.querySelector<HTMLElement>(`[data-board="${name}"]`)!;
    const engine = new BoardEngine(
      {
        track: query("track"),
        stage: query("stage"),
        win: query("win"),
        viewport: query("viewport"),
        world: query("world"),
      },
      setState,
      (station) => track("chapter_view", { chapter: STATIONS[station].id }),
      (open) => open && track("board_open"),
    );
    engineRef.current = engine;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const tracked = target.closest<HTMLElement>("[data-track]");
      if (tracked) track(tracked.dataset.track as TrackEvent);

      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || e.defaultPrevented) return;
      const id = link.getAttribute("href")!.slice(1);
      if (engine.goTo(id)) {
        e.preventDefault();
        window.history.replaceState(null, "", `#${id}`);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const value = useMemo(() => ({ state, engine: () => engineRef.current }), [state]);

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
