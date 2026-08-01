import type { Config } from 'tailwindcss';

/**
 * Tailwind is here to support imported components (Aceternity et al) that are
 * written in utility classes. It is NOT the styling system for this site — the
 * page is a port of a WordPress/Elementor build and its own CSS lives in
 * public/css/revision-2026.css.
 *
 * preflight is off deliberately. The ported reset already defines html, body,
 * *, h1, ul, img and button; Tailwind's base layer redefines the same elements
 * and would change how the ported sections render.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // The page accent, so utilities can reference it.
        accent: 'rgb(47 107 255)',
      },
    },
  },
  plugins: [],
};

export default config;
