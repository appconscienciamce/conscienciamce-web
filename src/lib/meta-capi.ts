import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "./meta";

/**
 * Meta Conversions API (server side). Repeats what the pixel sees, so events
 * still count when a browser blocks the pixel. Shares event ids with the
 * pixel, and Meta keeps one of each pair.
 */

const GRAPH = "https://graph.facebook.com/v24.0";

export interface ServerEvent {
  event_name: string;
  event_id: string;
  event_source_url: string;
  /** Visitor context, read from the request. */
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  email?: string | null;
  custom_data?: Record<string, unknown>;
}

const sha256 = (value: string) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

/** The _fbc value: the cookie, or one built from the ad click id in the URL when the pixel has not set it yet. */
export function clickId(cookie: string | undefined, pageUrl: string): string | null {
  if (cookie) return cookie;
  try {
    const fbclid = new URL(pageUrl).searchParams.get("fbclid");
    if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  } catch {
    /* no URL, no click id */
  }
  return null;
}

/** First address of x-forwarded-for, which Vercel sets to the visitor. */
export function clientIp(forwardedFor: string | null): string | null {
  return forwardedFor?.split(",")[0]?.trim() || null;
}

/** Sends one event. Never throws: tracking must not break a page. */
export async function sendMetaEvent(event: ServerEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;

  const user_data: Record<string, unknown> = {};
  if (event.ip) user_data.client_ip_address = event.ip;
  if (event.userAgent) user_data.client_user_agent = event.userAgent;
  if (event.fbp) user_data.fbp = event.fbp;
  if (event.fbc) user_data.fbc = event.fbc;
  if (event.email) user_data.em = [sha256(event.email)];

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.event_id,
        event_source_url: event.event_source_url,
        action_source: "website",
        user_data,
        ...(event.custom_data && { custom_data: event.custom_data }),
      },
    ],
  };
  // Set it while checking events in Events Manager > Test events; remove it after.
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const response = await fetch(`${GRAPH}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) console.error("Meta CAPI", response.status, (await response.text()).slice(0, 300));
  } catch (error) {
    console.error("Meta CAPI", error);
  }
}
