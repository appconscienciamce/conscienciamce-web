import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import "../ads.css";

// The ad landing repeats the content of `/`: it must not compete with it in search.
export const metadata: Metadata = {
  alternates: { canonical: "/v2" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Landing variant="current" ads />;
}
