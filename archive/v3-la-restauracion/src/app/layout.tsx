import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { bootcamp } from "@/content/bootcamp";
import "./globals.css";

// Both families are SIL Open Font License, self-hosted by next/font.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const { seo, offer } = bootcamp;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  ...(seo.url && { metadataBase: new URL(seo.url), alternates: { canonical: "/" } }),
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: seo.siteName,
    locale: seo.locale,
    ...(seo.ogImage && { images: [{ url: seo.ogImage, width: 1200, height: 630 }] }),
  },
  twitter: {
    card: seo.ogImage ? "summary_large_image" : "summary",
    title: seo.title,
    description: seo.description,
  },
  // A draft must never be indexed.
  robots: offer.status === "draft" ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#c4c3b6",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${bodoni.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables motion-only hidden states. Without JS, all content stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
