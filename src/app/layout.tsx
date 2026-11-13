import type { Metadata, Viewport } from "next";
import { Averia_Serif_Libre, DM_Mono, DM_Sans } from "next/font/google";
import { MetaPixel } from "@/components/meta-pixel";
import { SierraTracking } from "@/components/sierra-tracking";
import { bootcamp } from "@/content/bootcamp";
import { CHECKOUTS } from "@/lib/meta-offer";
import { BOARD_QUERY, REDUCED_MOTION_QUERY } from "@/lib/board/layout";
import "./globals.css";
import "./editorial.css";

// All families are SIL Open Font License, self-hosted by next/font.
const averia = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-averia",
});

// Only the price on the ticket, far from the first screen: it must not delay the title.
const averiaBold = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  preload: false,
  variable: "--font-averia-bold",
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
  // Lets the page reach behind the notch; the chrome keeps clear with safe-area insets.
  viewportFit: "cover",
};

// Picks the layout before first paint so the board never flashes as a document.
// Without JS the page stays the vertical reading, with all the content.
// /v2 (paid traffic) is the one vertical reading at every width: it never gets the board, and always the phone window.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var p=location.pathname,l=p==='/'||p==='/evento'||p==='/v2';if(p==='/v2'){d.classList.add('ads','phone-os');return}if(l&&matchMedia(${JSON.stringify(
  BOARD_QUERY,
)}).matches&&!matchMedia(${JSON.stringify(REDUCED_MOTION_QUERY)}).matches)d.classList.add('board-on');else if(l&&(matchMedia('(hover: none)').matches||innerWidth<900))d.classList.add('phone-os')})()`;

const clarityScript = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","zc031ci1h2");`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${averia.variable} ${averiaBold.variable} ${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Microsoft Clarity (heatmaps and recordings), in the <head> as Clarity asks. The tag loads async, so it does not block the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: clarityScript }} />
      </head>
      <body>
        {children}
        {/* Visitas y clics al checkout para el panel de synx build. */}
        <SierraTracking />
        <MetaPixel checkouts={CHECKOUTS} />
      </body>
    </html>
  );
}
