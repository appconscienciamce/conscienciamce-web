"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useBoard } from "@/components/os/board-provider";

const HalftoneReveal = dynamic(() => import("./halftone-reveal"), { ssr: false });

const PREPARE_DELAY = 1800;

/**
 * A photo printed in dots, with the real one under the pointer. Hover only, so
 * it runs on the board; phones keep the plain photo. Every instance is one more
 * WebGL context: use it sparingly.
 */
export function HalftoneImage({ src, children }: { src: string; children: React.ReactNode }) {
  const { state } = useBoard();
  const [ready, setReady] = useState(false);
  const enabled = state.board && !state.overlay;

  useEffect(() => {
    if (!enabled || ready) return;
    const timer = window.setTimeout(() => setReady(true), PREPARE_DELAY);
    return () => window.clearTimeout(timer);
  }, [enabled, ready]);

  return (
    <div className="halftone-host">
      {children}
      {enabled && ready && (
        <HalftoneReveal
          src={src}
          fit="cover"
          mode="mono"
          shape="dot"
          cellSize={4}
          angle={45}
          inkColor="#151515"
          paperColor="#f1f0eb"
          contrast={1.15}
          revealRadius={64}
          softness={0.6}
          linger={1}
          className="halftone-layer"
        />
      )}
    </div>
  );
}
