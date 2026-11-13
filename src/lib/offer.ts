import { bootcamp } from "@/content/bootcamp";
import type { ClaimId, Detail } from "@/content/types";

/**
 * Editorial gate. Decides what each claim, price or detail shows:
 *  - "approved": publish as written.
 *  - "pending":  draft preview only — show it, flagged, so reviewers see it.
 *  - "fallback": production with an unapproved claim — use the safe text.
 */
export type GateState = "approved" | "pending" | "fallback";

const { offer, claims } = bootcamp;

export const isDraft = offer.status === "draft";

export function resolveClaim(id: ClaimId) {
  const claim = claims[id];
  if (offer.approvedClaims.includes(id)) {
    return { text: claim.text, state: "approved" as GateState, needs: claim.needs };
  }
  if (isDraft) return { text: claim.text, state: "pending" as GateState, needs: claim.needs };
  return { text: claim.fallback, state: "fallback" as GateState, needs: claim.needs };
}

/** Price is visible when approved, or flagged in draft. Hidden otherwise. */
export function resolvePrice(): { label: string; state: GateState } | null {
  const { price } = offer;
  if (price.approved) return { label: price.label, state: "approved" };
  if (isDraft) return { label: price.label, state: "pending" };
  return null;
}

/**
 * Logistics rows. Approved rows always show. In draft, missing values show
 * as "A confirmar" (flagged). In production, unapproved rows are dropped.
 */
export function resolveLogistics(): { label: string; value: string; state: GateState }[] {
  return offer.logistics.flatMap((d: Detail) => {
    if (d.approved && d.value) return [{ label: d.label, value: d.value, state: "approved" as GateState }];
    if (isDraft) return [{ label: d.label, value: d.value ?? "A confirmar", state: "pending" as GateState }];
    return [];
  });
}

/** Checkout is live only with a real URL, an approved offer and a confirmed price. */
export const checkoutLive = Boolean(offer.checkoutUrl) && offer.status === "approved" && offer.price.approved;

/** Anchor of the "registration opening soon" notice. */
export const REGISTRATION_ANCHOR = "inscripcion";

export const ctaHref = checkoutLive ? offer.checkoutUrl! : `#${REGISTRATION_ANCHOR}`;

/** On the paid-traffic page only the ticket links to the checkout: every other button scrolls to it. */
export const ADS_TICKET_ANCHOR = "entrada";
export const ADS_TICKET_HREF = `#${ADS_TICKET_ANCHOR}`;

/** The price with its cents, from the amount: "USD 36,90". Null while the price must stay hidden. */
export function priceExact(): string | null {
  if (!resolvePrice()) return null;
  const { currency, amount } = offer.price;
  return `${currency} ${amount.toFixed(2).replace(".", ",")}`;
}

/** The buy button of the paid-traffic page: "Quiero participar · USD 36,90". */
export function adsCtaLabel(): string {
  const price = priceExact();
  return price ? `${bootcamp.cta.label}${bootcamp.ads.ctaJoin}${price}` : bootcamp.cta.label;
}

/** "Quedan 120 lugares", from a real count. */
export function seatsLine(left: number): string {
  const { seats } = bootcamp.ads;
  return left === 1 ? seats.one : seats.many.replace("{n}", String(left));
}
