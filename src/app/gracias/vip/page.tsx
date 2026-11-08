import type { Metadata } from "next";
import { ThanksPage } from "@/components/thanks/thanks-page";
import { thanksVip } from "@/content/thanks";

export const metadata: Metadata = {
  title: thanksVip.seo.title,
  // Reached after paying: it has no place in a search result.
  robots: { index: false, follow: false },
};

export default function GraciasVipPage() {
  return <ThanksPage variant="current" vip />;
}
