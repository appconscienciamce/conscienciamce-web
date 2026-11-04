"use client";

import { useEffect, useRef, useState } from "react";
import ElasticSlider from "@/components/elastic-slider";
import type { OsCopy } from "@/content/types";
import { PauseGlyph, PlayGlyph, VolumeHighGlyph, VolumeLowGlyph } from "./glyphs";

const DEFAULT_VOLUME = 40;

/** The slider is kept as upstream wrote it, in untyped JavaScript style. */
const Slider = ElasticSlider as unknown as React.ComponentType<Record<string, unknown>>;

/**
 * Music lives in the menu bar because it is the one surface present on the
 * desktop and inside the map. Nothing plays until the reader asks: the first
 * click on the control opens it and starts the track.
 */
export function SoundControl({ ui }: { ui: OsCopy["sound"] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const started = useRef(false);
  const resumeAfterVideo = useRef(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const play = () => {
    audioRef.current?.play().catch(() => setPlaying(false));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // The map also closes on Escape: this one belongs to the panel.
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onEscape, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onEscape, true);
    };
  }, [open]);

  // A testimonial has a voice to listen to: the music waits for it.
  useEffect(() => {
    const onVideo = (e: Event) => {
      const audio = audioRef.current;
      if (!audio) return;
      if ((e as CustomEvent<{ open: boolean }>).detail.open) {
        resumeAfterVideo.current = !audio.paused;
        audio.pause();
      } else if (resumeAfterVideo.current) {
        resumeAfterVideo.current = false;
        play();
      }
    };
    window.addEventListener("cc:video", onVideo);
    return () => window.removeEventListener("cc:video", onVideo);
  }, []);

  return (
    <div ref={rootRef} className="sys-sound" data-open={open} data-playing={playing}>
      <audio ref={audioRef} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src="/media/audio/interstellar.ogg" type='audio/ogg; codecs="vorbis"' />
        <source src="/media/audio/interstellar.m4a" type='audio/mp4; codecs="mp4a.40.2"' />
      </audio>

      <button
        ref={buttonRef}
        type="button"
        className="sys-sound-button"
        aria-expanded={open}
        aria-controls="sys-sound-panel"
        aria-label={ui.label}
        title={ui.label}
        onClick={() => {
          setOpen(!open);
          if (!started.current) {
            started.current = true;
            play();
          }
        }}
      >
        <span aria-hidden className="sound-bars">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>

      <div id="sys-sound-panel" className="sys-sound-panel">
        <div className="sound-track">
          <button type="button" className="sound-toggle" aria-label={playing ? ui.pause : ui.play} title={playing ? ui.pause : ui.play} onClick={toggle}>
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          <p>
            <strong>{ui.track}</strong>
            <small aria-live="polite">{playing ? ui.playing : ui.paused}</small>
          </p>
        </div>
        <Slider
          value={volume}
          onChange={setVolume}
          ariaLabel={ui.volume}
          formatValue={(value: number) => `${Math.round(value)}%`}
          valuePosition="none"
          leftIcon={<VolumeLowGlyph />}
          rightIcon={<VolumeHighGlyph />}
          thickness={6}
          activeThickness={11}
          restOpacity={0.85}
          maxStretch={30}
          className="sound-slider"
        />
      </div>
    </div>
  );
}
