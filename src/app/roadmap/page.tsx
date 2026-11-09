import type { Metadata } from "next";
import { RoadmapPage } from "@/components/thanks/thanks-page";
import { roadmapPage } from "@/content/thanks";

export const metadata: Metadata = {
  title: roadmapPage.seo.title,
  // Shared by link with the buyers: not for search results.
  robots: { index: false, follow: false },
};

export default function RoadmapRoute() {
  return <RoadmapPage />;
}
