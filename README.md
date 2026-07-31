# Consciencia MCE — Web

Marketing site for Consciencia MCE, ported from WordPress/Elementor to Next.js.

This repository holds **only the public website**. The product apps live in
separate repositories (`mce-v3`, `mce-2.0`) so site content can ship without
triggering an application deploy, and vice versa.

## Approach: faithful port

This is a **1:1 port**, not a redesign. The original Elementor markup, CSS and
scripts are preserved so the page renders exactly as it did on WordPress:

- Section markup is embedded verbatim in each component under
  `src/components/sections/`, injected with `dangerouslySetInnerHTML`.
- The original stylesheets are served untouched from `public/wp-content/` and
  linked in their original order in `layout.tsx`. **Cascade order is
  load-bearing — do not reorder that list.**
- The page's own scripts (VSL player, Three.js wave, testimonial popup, GSAP
  scroll animations, Lenis smooth scroll) are served from `public/js/` and
  loaded `afterInteractive` so the DOM exists before they run.

WordPress-only scripts (`elementorFrontendConfig`, `wp.i18n`, FlyingPress
lazy-loader) were dropped: they configure a backend that no longer exists.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3002
```

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Port `3002` avoids colliding with the app frontend (`3001`).

## Structure

```
src/
  app/
    layout.tsx            # stylesheet order + body classes from the original
    page.tsx              # composes the 10 sections in document order
    elementor-inline.css  # the page's inline <style> blocks
  components/
    sections/             # one component per section, markup verbatim
    page-scripts.tsx      # vendor libs + page scripts, in load order
public/
  wp-content/             # original assets at their original paths
  js/                     # the page's own scripts
```

## Editing content

Copy lives inside the markup strings in `src/components/sections/`. Find the
text and edit it in place. Keep the surrounding markup and class names intact —
the CSS targets those classes.

## Verification

The port was checked against the original: all 40 Elementor elements present
(none missing, none extra) and all 69 referenced assets resolve.

## Deviations from the original

- **Hero video removed.** The `<video>` element pointing at `back.mp4` was
  dropped at the owner's request; the asset is not in this repo.

## Pending

- [ ] The hero CTA points at `https://www.typeform.com/` (a placeholder in the
      original build) — set the real booking URL.
- [ ] Vendor libraries (GSAP, Three.js, Lenis, particles.js) are served as
      static files copied from the WordPress cache. Consider installing them as
      npm dependencies so they can be versioned and updated.
- [ ] No responsive/cross-browser pass has been done on the port yet.
