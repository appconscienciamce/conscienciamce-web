import type { Metadata, Viewport } from "next";
import { Averia_Serif_Libre, DM_Mono, DM_Sans } from "next/font/google";
import { bootcamp } from "@/content/bootcamp";
import { BOARD_QUERY, REDUCED_MOTION_QUERY } from "@/lib/board/layout";
import "./globals.css";

// All families are SIL Open Font License, self-hosted by next/font.
const averia = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-averia",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
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
  themeColor: "#080808",
  colorScheme: "dark",
};

// Picks the layout before first paint so the board never flashes as a document.
// Without JS the page stays the vertical reading, with all the content.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');if(location.pathname==='/'&&matchMedia(${JSON.stringify(
  BOARD_QUERY,
)}).matches&&!matchMedia(${JSON.stringify(REDUCED_MOTION_QUERY)}).matches)d.classList.add('board-on')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${averia.variable} ${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
