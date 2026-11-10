import { after } from "next/server";
import { cookies, headers } from "next/headers";
import { bootcamp } from "@/content/bootcamp";
import { purchaseEventId } from "./meta";
import { purchaseData } from "./meta-offer";
import { clickId, clientIp, sendMetaEvent } from "./meta-capi";
import type { Buyer } from "./purchase";

/**
 * Server half of a confirmed sale, sent after the page is out so it never
 * delays it. Returns what the browser half needs.
 */
export async function trackPurchase(sessionId: string, buyer: Buyer, path: string) {
  const data = purchaseData(buyer.tier);
  const eventId = purchaseEventId(sessionId);
  // Request data must be read before after(): it is gone inside the callback.
  const [head, jar] = await Promise.all([headers(), cookies()]);
  const url = `${bootcamp.seo.url ?? `https://${head.get("host")}`}${path}`;
  const event = {
    event_name: "Purchase",
    event_id: eventId,
    event_source_url: url,
    ip: clientIp(head.get("x-forwarded-for")),
    userAgent: head.get("user-agent"),
    fbp: jar.get("_fbp")?.value ?? null,
    fbc: clickId(jar.get("_fbc")?.value, url),
    email: buyer.email,
    custom_data: { ...data, order_id: sessionId },
  };
  after(() => sendMetaEvent(event));
  return { eventId, value: data.value, currency: data.currency };
}
