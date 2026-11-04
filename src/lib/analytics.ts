/**
 * Semantic events, ready for a real destination. Nothing is integrated yet:
 * events go to `dataLayer` only if the page has one, and to a `cc:track`
 * DOM event that a future integration (or a test) can listen to.
 */
export type TrackEvent =
  | "hero_cta_click"
  | "pricing_cta_click"
  | "cta_click"
  | "board_open"
  | "chapter_view"
  | "roadmap_submit"
  | "whatsapp_click"
  | "upsell_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...detail });
  window.dispatchEvent(new CustomEvent("cc:track", { detail: { event, ...detail } }));
}
