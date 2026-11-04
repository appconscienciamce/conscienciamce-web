"use client";

import { useEffect, useRef, useState } from "react";
import { useBoard } from "./board-provider";

export interface MenuEntry {
  label: string;
  href: string;
  /** Right-aligned hint, where a native menu shows its shortcut. */
  hint?: string;
  /** Marks the entry with a check while this chapter is on screen. */
  station?: number;
}

export interface MenuGroup {
  label: string;
  href: string;
  items?: MenuEntry[];
}

/**
 * Menu bar with native manners: click to open, then hovering another title
 * switches to it. Entries are plain links, so the engine routes them like any
 * other anchor. Arrows, Home and End are added on top of the links.
 */
export function MenuBar({ groups, label }: { groups: MenuGroup[]; label: string }) {
  const { state } = useBoard();
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const titles = useRef<(HTMLButtonElement | null)[]>([]);
  const focusFirst = useRef(false);

  useEffect(() => {
    if (open === null) return;
    if (focusFirst.current) {
      focusFirst.current = false;
      rootRef.current?.querySelector<HTMLElement>(`#sys-menu-${open} a`)?.focus();
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    // On the window, because Safari does not focus a clicked button: the key
    // would never pass through the menu, and the map would close instead.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(null);
      titles.current[open]?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onEscape, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onEscape, true);
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("ul a"));
    const at = links.indexOf(document.activeElement as HTMLElement);
    const inMenu = at >= 0;

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const menus = groups.flatMap((group, i) => (group.items ? [i] : []));
      const step = e.key === "ArrowRight" ? 1 : -1;
      const next = menus[(menus.indexOf(index) + step + menus.length) % menus.length];
      e.preventDefault();
      titles.current[next]?.focus();
      if (open !== null) setOpen(next);
      return;
    }
    if (e.key === "ArrowDown" && !inMenu) {
      e.preventDefault();
      focusFirst.current = true;
      if (open === index) links[0]?.focus();
      setOpen(index);
      return;
    }
    if (!inMenu) return;
    const moves: Record<string, number> = {
      ArrowDown: (at + 1) % links.length,
      ArrowUp: (at - 1 + links.length) % links.length,
      Home: 0,
      End: links.length - 1,
    };
    if (moves[e.key] === undefined) return;
    e.preventDefault();
    links[moves[e.key]].focus();
  };

  return (
    <nav ref={rootRef} className="sys-menus" aria-label={label}>
      <ul>
        {groups.map((group, i) =>
          group.items ? (
            <li
              key={group.href}
              className="sys-menu"
              data-open={open === i}
              onKeyDown={(e) => onKeyDown(e, i)}
              onBlur={(e) => e.relatedTarget && !e.currentTarget.contains(e.relatedTarget) && open === i && setOpen(null)}
            >
              <button
                ref={(el) => {
                  titles.current[i] = el;
                }}
                type="button"
                aria-expanded={open === i}
                aria-controls={`sys-menu-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                onPointerEnter={() => open !== null && setOpen(i)}
              >
                {group.label}
              </button>
              <ul id={`sys-menu-${i}`} className="sys-drop" onClick={() => setOpen(null)}>
                {group.items.map((item) => {
                  const current = state.board && state.open && item.station === state.station;
                  return (
                    <li key={item.href}>
                      <a href={item.href} aria-current={current ? "location" : undefined} tabIndex={open === i ? 0 : -1}>
                        <span aria-hidden className="sys-check" />
                        {item.label}
                        {item.hint && <small>{item.hint}</small>}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ) : (
            <li key={group.href} className="sys-menu" onPointerEnter={() => open !== null && setOpen(null)}>
              <a href={group.href}>{group.label}</a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
