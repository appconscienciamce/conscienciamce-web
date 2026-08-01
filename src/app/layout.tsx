import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './tailwind.css';

/**
 * Instrument Sans replaces Inter across the page. The ported stylesheets
 * declare Inter in 26 places, so rather than editing each one the family is
 * exposed as a variable and overridden in revision-2026.css.
 */
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

/**
 * Faithful port of the original WordPress/Elementor page.
 *
 * The original stylesheets are served untouched from /public/wp-content and
 * linked here in their original order — cascade order is load-bearing, so this
 * list must not be reordered or de-duplicated.
 */
const STYLESHEETS = [
  'a3377ace0428.style.min.css',
  'af4b9638d699.reset.css',
  'a480d2bf8c52.theme.css',
  '86dbb47955bb.header-footer.css',
  '4fb5f7fc5e41.frontend.min.css',
  'e80e71f82b32.post-7.css',
  'c3be9e612baf.widget-heading.min.css',
  '12045858d487.widget-image.min.css',
  'c5fd583e176f.widget-icon-box.min.css',
  'f2dfb34b671e.post-1000.css',
  '7b8218e935ec.03ee56d594bf.google-font.css',
  '661b80147a10.3071dd56f341.google-font.css',
  '8b4e2067e557.ecf151c7e125.google-font.css',
  'lenis.css',
];

/**
 * Our own styles, loaded after everything above so they can override the
 * ported Elementor rules. Served from /public rather than imported — see the
 * note in the head below.
 */
const OVERRIDES = ['elementor-inline.css', 'revision-2026.css'];

const BODY_CLASS = [
  'wp-singular page-template page-template-elementor_canvas page page-id-1000',
  'wp-embed-responsive wp-theme-hello-elementor hello-elementor-default',
  'elementor-default elementor-template-canvas elementor-kit-7',
  'elementor-page elementor-page-1000',
].join(' ');

export const metadata: Metadata = {
  metadataBase: new URL('https://conscienciamce.com'),
  title: 'Consciencia MCE',
  description:
    'Construye Éxito Integral trabajando 1 a 1 conmigo mientras reprogramas tu identidad y crecemos tu negocio con propósito y libertad real.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Consciencia MCE',
    title: 'Consciencia MCE',
    images: ['/wp-content/uploads/2026/02/sello-mce.webp'],
  },
  icons: {
    icon: '/wp-content/uploads/2026/04/cropped-mce-32x32.webp',
    apple: '/wp-content/uploads/2026/04/cropped-mce-180x180.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={instrumentSans.variable}>
      <head>
        {STYLESHEETS.map((file) => (
          <link
            key={file}
            rel="stylesheet"
            href={`/wp-content/cache/flying-press/${file}`}
          />
        ))}

        {/* Our styles are served from /public and linked here, after the
            ported ones, so they win the cascade. Importing them as modules
            does NOT work: Next hoists imported CSS above anything rendered
            in <head>, which put these first and let Elementor override
            every rule. */}
        {OVERRIDES.map((file) => (
          <link key={file} rel="stylesheet" href={`/css/${file}`} />
        ))}
      </head>
      <body className={BODY_CLASS}>{children}</body>
    </html>
  );
}
