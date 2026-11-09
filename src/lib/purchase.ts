/**
 * Purchase check for the thank-you pages. Stripe sends the buyer back with
 * `?session_id=cs_…`; the MCE backend answers whether that session is a
 * recorded purchase, and with whose email. Runs on the server, so a visitor
 * without a purchase never receives the page's content.
 */

const ENDPOINT = "https://api.conscienciamce.com/api/bootcamp/session";

/** The ids Stripe gives to a Checkout Session. Anything else is not even asked. */
export const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

export interface Buyer {
  email: string;
  name: string | null;
  tier: "general" | "vip";
}

/** The buyer behind a session, or null while the purchase is not recorded (or never was). */
export async function findBuyer(sessionId: string): Promise<Buyer | null> {
  if (!SESSION_ID.test(sessionId)) return null;
  try {
    const response = await fetch(`${ENDPOINT}?id=${encodeURIComponent(sessionId)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { data?: { email?: unknown; name?: unknown; tier?: unknown } };
    const data = body.data;
    if (!data || typeof data.email !== "string") return null;
    return {
      email: data.email,
      name: typeof data.name === "string" ? data.name : null,
      tier: data.tier === "vip" ? "vip" : "general",
    };
  } catch {
    return null;
  }
}
