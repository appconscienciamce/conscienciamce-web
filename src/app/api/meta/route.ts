import { BROWSER_EVENTS, type BrowserEvent } from "@/lib/meta";
import { checkoutFor } from "@/lib/meta-offer";
import { clickId, clientIp, sendMetaEvent } from "@/lib/meta-capi";

/**
 * Repeats a pixel event through the Conversions API. Only page views and
 * checkout starts: the value of a checkout comes from the link, never from the
 * request, and purchases are sent only by the thank-you pages after the
 * backend confirms the sale.
 */
export async function POST(request: Request) {
  let input: { event_name?: unknown; event_id?: unknown; url?: unknown; href?: unknown };
  try {
    input = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const name = input.event_name;
  const id = input.event_id;
  const url = input.url;
  if (
    typeof name !== "string" ||
    !BROWSER_EVENTS.includes(name as BrowserEvent) ||
    typeof id !== "string" ||
    id.length > 100 ||
    typeof url !== "string" ||
    url.length > 2000
  ) {
    return new Response(null, { status: 400 });
  }

  // The page must be on this site.
  let pageUrl: URL;
  try {
    pageUrl = new URL(url);
    if (pageUrl.host !== new URL(request.url).host) return new Response(null, { status: 400 });
  } catch {
    return new Response(null, { status: 400 });
  }

  let custom_data: Record<string, unknown> | undefined;
  if (name === "InitiateCheckout") {
    const checkout = typeof input.href === "string" ? checkoutFor(input.href) : null;
    if (!checkout) return new Response(null, { status: 400 });
    custom_data = { ...checkout };
  }

  const cookies = new Map(
    (request.headers.get("cookie") ?? "").split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")] as const;
    }),
  );

  await sendMetaEvent({
    event_name: name,
    event_id: id,
    event_source_url: pageUrl.href,
    ip: clientIp(request.headers.get("x-forwarded-for")),
    userAgent: request.headers.get("user-agent"),
    fbp: cookies.get("_fbp") || null,
    fbc: clickId(cookies.get("_fbc") || undefined, pageUrl.href),
    custom_data,
  });

  return new Response(null, { status: 204 });
}
