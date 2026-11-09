import type { Metadata } from "next";
import { ThanksLocked, ThanksPage } from "@/components/thanks/thanks-page";
import { thanksVip } from "@/content/thanks";
import { findBuyer } from "@/lib/purchase";

export const metadata: Metadata = {
  title: thanksVip.seo.title,
  // Reached after paying: it has no place in a search result.
  robots: { index: false, follow: false },
};

// Each visit checks its own purchase: nothing of this page is cached or prerendered.
export const dynamic = "force-dynamic";

export default async function GraciasVipPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; intento?: string }>;
}) {
  const { session_id: sessionId, intento } = await searchParams;
  if (!sessionId) return <ThanksLocked state="missing" />;
  const buyer = await findBuyer(sessionId);
  if (!buyer) return <ThanksLocked state="pending" attempt={Number(intento) || 0} />;
  return <ThanksPage variant="current" vip buyer={buyer} />;
}
