import type { Metadata } from "next";
import { ThanksPage } from "@/components/thanks/thanks-page";
import { thanks } from "@/content/thanks";

export const metadata: Metadata = {
  title: thanks.seo.title,
  robots: { index: false, follow: false },
};

export default function EventoThanksPage() {
  return <ThanksPage variant="classic" />;
}
