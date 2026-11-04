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
