"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useBoard } from "@/components/os/board-provider";

/** three.js is heavy and only the board uses it: it never joins the first load. */
const PaperCrumple = dynamic(() => import("./paper-crumple"), { ssr: false });

const PREPARE_DELAY = 1500;
const TEXTURE_SCALE = 3;
const STAGE_MARGIN = 110;
const HOLE_PITCH = 28;
const HOLE_RADIUS = 5;
const HOLE_OFFSET = 14;
const RULE_Y = 27;

interface Sheet {
  src: string;
  width: number;
  height: number;
}

/**
 * The paper crumples an image, so the note is drawn to one: same size, holes
 * and wrapped text. Layout pixels only, the board scales everything with a transform.
 */
function drawSheet(note: HTMLElement): Sheet | null {
  const paragraph = note.querySelector("p");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!paragraph || !ctx) return null;

  const width = note.offsetWidth;
  const height = note.offsetHeight;
  canvas.width = width * TEXTURE_SCALE;
  canvas.height = height * TEXTURE_SCALE;
  ctx.scale(TEXTURE_SCALE, TEXTURE_SCALE);

  const box = getComputedStyle(note);
  const type = getComputedStyle(paragraph);
  ctx.fillStyle = box.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(21, 21, 21, 0.14)";
  ctx.fillRect(0, RULE_Y, width, 1);

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#000";
  for (let x = HOLE_OFFSET; x < width; x += HOLE_PITCH) {
    ctx.beginPath();
    ctx.arc(x, HOLE_OFFSET, HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  ctx.font = `${type.fontStyle} ${type.fontWeight} ${type.fontSize} ${type.fontFamily}`;
  ctx.fillStyle = type.color;
  ctx.textBaseline = "alphabetic";

  const maxWidth = paragraph.clientWidth;
  const lines: string[] = [];
  let line = "";
  for (const word of (paragraph.textContent ?? "").split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  const fontSize = parseFloat(type.fontSize);
  const lineHeight = parseFloat(type.lineHeight) || fontSize * 1.24;
  const baseline = paragraph.offsetTop + (lineHeight + fontSize * 0.72) / 2;
  lines.forEach((text, i) => ctx.fillText(text, paragraph.offsetLeft, baseline + i * lineHeight));

  return { src: canvas.toDataURL("image/png"), width, height };
}

/**
 * A note the reader can crumple on the board. Until the sheet is ready, and on
 * phones, where holding it would get in the way of scrolling, it is the plain note.
 */
export function CrumpleNote({ text, label, className = "" }: { text: string; label: string; className?: string }) {
  const { state } = useBoard();
  const noteRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const enabled = state.board && !state.overlay;

  useEffect(() => {
    if (!enabled || sheet) return;
    let cancelled = false;
    const prepare = () => {
      void document.fonts.ready.then(() => {
        if (cancelled || !noteRef.current) return;
        setSheet(drawSheet(noteRef.current));
      });
    };
    // After the entrance, so preparing the paper never competes with it.
    const timer = window.setTimeout(prepare, PREPARE_DELAY);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [enabled, sheet]);

  return (
    <div className="crumple">
      <div ref={noteRef} className={`crumple-sheet ${className}`}>
        <p>{text}</p>
      </div>
      {enabled && sheet && (
        <div className="crumple-stage">
          <PaperCrumple
            src={sheet.src}
            alt={label}
            width={sheet.width}
            height={sheet.height}
            sceneHeight={sheet.height + STAGE_MARGIN * 2}
            releaseBehavior="restore"
            crumpleAmount={0.85}
            crumpleDuration={0.55}
            releaseDuration={0.4}
            foldCount={6}
            foldSharpness={0.6}
            wrinkleDepth={0.65}
            shadowOpacity={0.22}
            paperColor="#f1f0eb"
            paperTexture={0.08}
            draggable
            returnToOrigin
          />
        </div>
      )}
    </div>
  );
}
