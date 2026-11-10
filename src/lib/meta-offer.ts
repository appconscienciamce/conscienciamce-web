import { bootcamp } from "@/content/bootcamp";
import { type Checkout, type CheckoutData, matchCheckout } from "./meta";

/** What each payment link of the landing sells, read from the content. */

const { offer, editorial } = bootcamp;

function amount(label: string): number {
  return Number(label.replace(/[^\d,.]/g, "").replace(",", "."));
}

const general: CheckoutData = {
  value: offer.price.amount,
  currency: offer.price.currency,
  content_name: "Bootcamp Creadores Conscientes",
};

const vip: CheckoutData = {
  value: amount(editorial.vip.price),
  currency: offer.price.currency,
  content_name: "Bootcamp Creadores Conscientes VIP",
};

export const CHECKOUTS: readonly Checkout[] = [
  ...(offer.checkoutUrl ? [{ url: offer.checkoutUrl, data: general }] : []),
  ...(editorial.vip.url ? [{ url: editorial.vip.url, data: vip }] : []),
];

export const checkoutFor = (href: string) => matchCheckout(href, CHECKOUTS);

/** What a sale is worth, by the tier the MCE backend recorded. */
export const purchaseData = (tier: "general" | "vip") => (tier === "vip" ? vip : general);
