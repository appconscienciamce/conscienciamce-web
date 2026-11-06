"use client";

import Image from "next/image";
import { useEffect } from "react";
import { closeApp, isPhoneOs, openApp, startPhoneOs } from "@/lib/phone-os";
import { startCanvas } from "@/lib/phone-canvas";
import { startCarousels } from "@/lib/phone-carousels";
import { startPull } from "@/lib/phone-pull";
import { ChevronGlyph } from "./glyphs";
import { MacFolder } from "./mac-folder";

export type PhoneIcon = { kind: "folder" } | { kind: "note" } | { kind: "photo"; src: string };

export interface PhoneApp {
  id: string;
  label: string;
  icon: PhoneIcon;
}

function Icon({ icon }: { icon: PhoneIcon }) {
  switch (icon.kind) {
    case "photo":
      return <Image src={icon.src} alt="" width={132} height={132} quality={90} />;
    case "note":
      return <span aria-hidden className="phone-icon-note" />;
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
  label,
  scrollLabel,
}: {
  apps: PhoneApp[];
  label: string;
  scrollLabel: string;
}) {
  useEffect(() => {
    if (!isPhoneOs()) return;
    const stopApps = startPhoneOs();
    const stopCanvas = startCanvas();
    const stopPull = startPull();
    const stopCarousels = startCarousels();
    return () => {
      stopApps();
      stopCanvas();
      stopPull();
      stopCarousels();
    };
  }, []);

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
