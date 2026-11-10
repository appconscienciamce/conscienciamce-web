"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { type BrowserEvent, type Checkout, matchCheckout, META_PIXEL_ID, newEventId } from "@/lib/meta";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Meta's base code, as a function: the queue exists before fbevents.js arrives. */
function pixel(): Fbq {
  if (window.fbq) return window.fbq;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue!.push(args);
  } as Fbq & { push: unknown; loaded: boolean; version: string };
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  n("init", META_PIXEL_ID);
  return n;
}

/** Same event to the server, with the same id. Never waits, never throws. */
function relay(event_name: BrowserEvent, event_id: string, href?: string) {
  try {
    void fetch("/api/meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name, event_id, url: window.location.href, href }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* tracking never breaks the page */
  }
}

/**
 * Goes once in the root layout. A PageView on every route (also client-side
 * navigation) and an InitiateCheckout on every click to this landing's Stripe
 * links, each sent by the pixel and by the server.
 */
export function MetaPixel({ checkouts }: { checkouts: readonly Checkout[] }) {
  const route = usePathname();

  useEffect(() => {
    if (!route) return;
    try {
      const id = newEventId("pv");
      pixel()("track", "PageView", {}, { eventID: id });
      relay("PageView", id);
    } catch {
      /* tracking never breaks the page */
    }
  }, [route]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      try {
        const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
        if (!link) return;
        const checkout = matchCheckout(link.href, checkouts);
        if (!checkout) return;
        const id = newEventId("ic");
        pixel()("track", "InitiateCheckout", checkout, { eventID: id });
        relay("InitiateCheckout", id, link.href);
      } catch {
        /* the link works anyway */
      }
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("auxclick", onClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, [checkouts]);

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}

/** The browser half of a purchase. The server sends the other half with the same id. */
export function MetaPurchase({ eventId, value, currency }: { eventId: string; value: number; currency: string }) {
  useEffect(() => {
    try {
      // A reload of the thank-you page is not a second sale.
      const key = `meta_${eventId}`;
      if (window.localStorage.getItem(key)) return;
      pixel()("track", "Purchase", { value, currency }, { eventID: eventId });
      window.localStorage.setItem(key, "1");
    } catch {
      /* storage blocked: Meta still drops the copy by its id */
    }
  }, [eventId, value, currency]);
  return null;
}
