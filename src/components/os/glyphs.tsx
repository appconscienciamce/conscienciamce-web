/** Monochrome glyphs of the operating system. Decorative: labels live on the controls. */

/** Sidebar toggle of a native window toolbar. */
export function SidebarGlyph() {
  return (
    <svg viewBox="0 0 18 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="1" y="1" width="16" height="12" rx="2.6" />
      <path d="M6.6 1v12" />
      <path d="M3 4h1.8M3 6.4h1.8M3 8.8h1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Wi-Fi and control center: scenery of the menu bar, not controls. */
export function StatusGlyphs() {
  return (
    <span className="sys-glyphs" aria-hidden>
      <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M1.4 4.2a9.4 9.4 0 0 1 13.2 0" />
        <path d="M3.8 6.8a6 6 0 0 1 8.4 0" />
        <path d="M6.2 9.3a2.6 2.6 0 0 1 3.6 0" />
      </svg>
      <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="1" y=".8" width="14" height="4.6" rx="2.3" />
        <rect x="1" y="6.6" width="14" height="4.6" rx="2.3" />
        <circle cx="4" cy="3.1" r="1.1" fill="currentColor" />
        <circle cx="12" cy="8.9" r="1.1" fill="currentColor" />
      </svg>
    </span>
  );
}

export function MapGlyph() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 5 7 3l6 2 4.5-2v12L13 17l-6-2-4.5 2z" />
      <path d="M7 3v12M13 5v12" />
    </svg>
  );
}

export function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="currentColor">
      <path d="M4.5 2.6v10.8c0 .5.6.9 1 .6l8.4-5.4c.4-.2.4-.8 0-1L5.5 2c-.4-.3-1 .1-1 .6z" />
    </svg>
  );
}

export function PauseGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="currentColor">
      <rect x="3.5" y="2.2" width="3.2" height="11.6" rx="1" />
      <rect x="9.3" y="2.2" width="3.2" height="11.6" rx="1" />
    </svg>
  );
}

export function VolumeLowGlyph() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8v4h3l4 3.4V4.6L6 8z" fill="currentColor" />
      <path d="M13 8a3 3 0 0 1 0 4" />
    </svg>
  );
}

export function VolumeHighGlyph() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8v4h3l4 3.4V4.6L6 8z" fill="currentColor" />
      <path d="M13 8a3 3 0 0 1 0 4" />
      <path d="M15.2 5.6a6.2 6.2 0 0 1 0 8.8" />
    </svg>
  );
}

export function FolderGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 50" className={className} aria-hidden fill="none">
      <path d="M3 9.5C3 6.5 5 4 8 4h15c1.6 0 3 .7 4 2l2.6 3.2c.7.9 1.7 1.4 2.8 1.4H56c3 0 5 2.2 5 5V41c0 3-2 5-5 5H8c-3 0-5-2-5-5z" fill="#222222" stroke="#ADADAD" strokeWidth="1.2" />
      <path d="M3 18h58" stroke="#ADADAD" strokeOpacity=".4" strokeWidth="1" />
    </svg>
  );
}

export function FileGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={className} aria-hidden fill="none">
      <path d="M2 1.5h7.5L14 6v12.5H2z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M9.5 1.5V6H14" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function CloseGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
    </svg>
  );
}

export function MinimizeGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2.5 9h7" />
    </svg>
  );
}

/** The two triangles of the green light. */
export function MaximizeGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden fill="currentColor">
      <path d="M3 3h4.2L3 7.2zM9 9H4.8L9 4.8z" />
    </svg>
  );
}

export function RestoreGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden fill="currentColor">
      <path d="M5.4 5.4H1.8l3.6-3.6zM6.6 6.6h3.6l-3.6 3.6z" />
    </svg>
  );
}

const CHEVRONS = { left: "M7.5 2.5L4 6l3.5 3.5", right: "M4.5 2.5L8 6 4.5 9.5", down: "M2.5 4.5L6 8l3.5-3.5" };

export function ChevronGlyph({ direction }: { direction: keyof typeof CHEVRONS }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d={CHEVRONS[direction]} />
    </svg>
  );
}

/** Hand-drawn stroke under a word. */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 14" className={className} aria-hidden fill="none" preserveAspectRatio="none">
      <path d="M2 9C40 4 78 3 112 5s70 3 106-1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
