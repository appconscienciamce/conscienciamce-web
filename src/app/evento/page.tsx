import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  // The previous version, kept for later: only people with the link should reach it.
  robots: { index: false, follow: false },
};

export default function EventoPage() {
  return <Landing variant="classic" />;
}
