import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  // A version under review: only people with the link should reach it.
  robots: { index: false, follow: false },
};

export default function EventoPage() {
  return <Landing variant="evento" />;
}
