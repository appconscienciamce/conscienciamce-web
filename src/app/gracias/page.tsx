import type { Metadata } from "next";
import { ThanksPage } from "@/components/thanks/thanks-page";
import { thanks } from "@/content/thanks";

export const metadata: Metadata = {
  title: thanks.seo.title,
  // Reached after paying: it has no place in a search result.
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return <ThanksPage variant="current" />;
}
