"use client";

import Image from "next/image";
import { useEffect } from "react";
import { closeApp, isPhoneOs, openApp, startPhoneOs } from "@/lib/phone-os";
import { startCanvas } from "@/lib/phone-canvas";
import { startCarousels } from "@/lib/phone-carousels";
import { startColor } from "@/lib/phone-color";
import { startReveal } from "@/lib/phone-reveal";
import { startPull } from "@/lib/phone-pull";
import { ChevronGlyph } from "./glyphs";
import { MacFolder } from "./mac-folder";

export type PhoneIcon = { kind: "folder" } | { kind: "note" } | { kind: "ticket"; mark?: string } | { kind: "photo"; src: string };

export interface PhoneApp {
  id: string;
  label: string;
  icon: PhoneIcon;
  /** A note on the corner of the icon: a figure, or a lock. */
  badge?: { text: string } | { lock: string };
  /** A folder in another finish, to stand out from the rest. */
  tone?: "gold";
}

function Icon({ icon }: { icon: PhoneIcon }) {
  switch (icon.kind) {
    case "photo":
      return <Image src={icon.src} alt="" width={132} height={132} quality={90} />;
    case "note":
      return <span aria-hidden className="phone-icon-note" />;
    case "ticket":
      return <span aria-hidden className="phone-icon-ticket">{icon.mark && <b>{icon.mark}</b>}</span>;
    default:
      return <MacFolder />;
  }
}

function AppIcon({ app }: { app: PhoneApp }) {
  return (
    <a
      href={`#${app.id}`}
      className="phone-app"
      data-kind={app.icon.kind}
      data-tone={app.tone}
      onClick={(e) => {
        e.preventDefault();
        openApp(app.id, { icon: e.currentTarget.querySelector<HTMLElement>(".phone-icon") });
      }}
    >
      <span className="phone-slot">
        <span className="phone-icon">
          <Icon icon={app.icon} />
        </span>
        {app.badge &&
          ("lock" in app.badge ? (
            <span className="phone-badge is-lock" role="img" aria-label={app.badge.lock}>
              <svg viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="7" width="10" height="7" rx="1.6" fill="currentColor" stroke="none" />
                <path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" />
              </svg>
            </span>
          ) : (
            <span className="phone-badge">{app.badge.text}</span>
          ))}
      </span>
      <span className="phone-label">{app.label}</span>
    </a>
  );
}

function startEditorial() {
  const stopReveal = startReveal();
  const stopColor = startColor();
  return () => {
    stopReveal();
    stopColor();
  };
}

/** The first screen on a phone: the apps of the bootcamp, on a dark canvas. */
export function PhoneHome({
  apps,
  label,
  scrollLabel,
  editorial = false,
}: {
  apps: PhoneApp[];
  label: string;
  scrollLabel: string;
  /** The current page: pieces arrive and photos light up, instead of sideways lists. */
  editorial?: boolean;
}) {
  useEffect(() => {
    if (!isPhoneOs()) return;
    const stopApps = startPhoneOs();
    const stopCanvas = startCanvas();
    const stopPull = startPull();
    const stopReading = editorial ? startEditorial() : startCarousels();
    return () => {
      stopApps();
      stopCanvas();
      stopPull();
      stopReading();
    };
  }, [editorial]);

  return (
    <nav className="phone-home" aria-label={label}>
      <ul className="phone-grid">
        {apps.map((app) => (
          <li key={app.id}>
            <AppIcon app={app} />
          </li>
        ))}
      </ul>

      <a
        href={`#${apps[0].id}`}
        className="scroll-arrow phone-scroll"
        aria-label={`${scrollLabel} ${apps[0].label}`}
        onClick={(e) => {
          e.preventDefault();
          openApp(apps[0].id);
        }}
      >
        <ChevronGlyph direction="down" />
      </a>
    </nav>
  );
}

/** Title bar of a window. The system's own chrome stays above it. */
export function AppBar({ title, back }: { title: string; back: string }) {
  return (
    <div className="app-bar">
      <span aria-hidden className="traffic is-small" data-active="true">
        <span className="tl tl-close" />
        <span className="tl tl-min" />
        <span className="tl tl-max" />
      </span>
      <span className="app-bar-title">{title}</span>
      <button type="button" onClick={() => closeApp()}>
        {back}
      </button>
      <span aria-hidden className="app-bar-progress" />
    </div>
  );
}
