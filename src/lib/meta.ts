/**
 * Meta Pixel + Conversions API, shared by the browser and the server.
 * The pixel id is public. The Conversions API token is not: it lives only in
 * the server env var META_CAPI_TOKEN and never reaches this file.
 * No content imports here: this file ships to the browser.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1560862149399354";

/** Events the browser may ask the server to repeat. Purchase is never one: only a verified sale sends it. */
export const BROWSER_EVENTS = ["PageView", "InitiateCheckout"] as const;
export type BrowserEvent = (typeof BROWSER_EVENTS)[number];

export interface CheckoutData {
  value: number;
  currency: string;
  content_name: string;
}

export interface Checkout {
  /** Payment link without its query, which the click tracker extends. */
  url: string;
  data: CheckoutData;
}

/** The product behind a link, or null for any link that is not one of these checkouts. */
export function matchCheckout(href: string, checkouts: readonly Checkout[]): CheckoutData | null {
  try {
    const url = new URL(href);
    const path = `${url.origin}${url.pathname}`;
    return checkouts.find((checkout) => checkout.url === path)?.data ?? null;
  } catch {
    return null;
  }
}

/** An id the pixel and the server share, so Meta counts the event once. */
export function newEventId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${random}`;
}

export const purchaseEventId = (sessionId: string) => `purchase_${sessionId}`;
