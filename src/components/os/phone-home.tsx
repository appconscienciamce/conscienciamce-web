"use client";

import Image from "next/image";
import { useEffect } from "react";
import { closeApp, isPhoneOs, openApp, startPhoneOs } from "@/lib/phone-os";
import { useBoard } from "./board-provider";
import { ChevronGlyph, MapGlyph } from "./glyphs";
import { MacFolder } from "./mac-folder";
import { MapArt } from "./mobile-chrome";

export type PhoneIcon = { kind: "folder" } | { kind: "note" } | { kind: "help" } | { kind: "photo"; src: string } | { kind: "video"; videoId: string };

export interface PhoneApp {
  id: string;
  label: string;
  icon: PhoneIcon;
}

function Icon({ icon }: { icon: PhoneIcon }) {
  switch (icon.kind) {
    case "photo":
      return <Image src={icon.src} alt="" width={132} height={132} quality={90} />;
    case "video":
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${icon.videoId}/mqdefault.jpg`} alt="" loading="lazy" />
          <span aria-hidden className="phone-icon-play" />
        </>
      );
    case "note":
      return <span aria-hidden className="phone-icon-note" />;
    case "help":
      return <span aria-hidden className="phone-icon-help">?</span>;
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
      onClick={(e) => {
        e.preventDefault();
        openApp(app.id, { icon: e.currentTarget.querySelector<HTMLElement>(".phone-icon") });
      }}
    >
      <span className="phone-icon">
        <Icon icon={app.icon} />
      </span>
      <span className="phone-label">{app.label}</span>
    </a>
  );
}

/** The first screen on a phone: the apps of the bootcamp, on a dark canvas. */
export function PhoneHome({
  apps,
  dock,
  mapLabel,
  enroll,
  widget,
}: {
  apps: PhoneApp[];
  dock: PhoneApp[];
  mapLabel: string;
  enroll: { label: string; src: string };
  widget: { title: string; text: string };
}) {
  const { engine } = useBoard();

  useEffect(() => {
    if (isPhoneOs()) return startPhoneOs();
  }, []);

  return (
    <nav className="phone-home" aria-label={mapLabel}>
      <ul className="phone-grid">
        {apps.map((app) => (
          <li key={app.id}>
            <AppIcon app={app} />
          </li>
        ))}
      </ul>

      <button type="button" className="phone-widget" onClick={() => engine()?.openOverlay()}>
        <span className="phone-widget-art">
          <MapArt />
        </span>
        <span className="phone-widget-text">
          <strong>{widget.title}</strong>
          <span>{widget.text}</span>
        </span>
        <ChevronGlyph direction="right" />
      </button>

      <ul className="phone-dock">
        <li>
          <button type="button" className="view-map phone-app" onClick={() => engine()?.openOverlay()}>
            <span className="phone-icon" data-solid>
              <MapGlyph />
            </span>
            <span className="phone-label">{mapLabel}</span>
          </button>
        </li>
        {dock.map((app) => (
          <li key={app.id}>
            <AppIcon app={app} />
          </li>
        ))}
        <li>
          <AppIcon app={{ id: "inscripcion", label: enroll.label, icon: { kind: "photo", src: enroll.src } }} />
        </li>
      </ul>
    </nav>
  );
}

/** Title bar of a chapter when it runs as an app. The system's own chrome stays above it. */
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
