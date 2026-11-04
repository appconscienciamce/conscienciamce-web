# Bootcamp — Creadores Conscientes · Landing

Sales landing for Santiago Gómez & Oriana Safenreider's two-day live bootcamp.
Separate from `conscienciamce-web` on purpose: it ships on its own and touches nothing in Consciencia MCE.

## Run

```bash
npm install
npm run dev        # http://localhost:3010
npm run build && npm start

# Preview next to a running dev server. `next dev` and `next build` must not
# share a folder: dev overwrites .next and the production server loses its CSS.
# PowerShell:
$env:NEXT_DIST_DIR=".next-preview"; npx next build; npx next start -p 3010
npm run typecheck
```

## Where things live

```
src/
  content/
    bootcamp.ts      # ALL copy + editorial controls (status, price, logistics, claims, checkout)
    types.ts         # content model
  lib/offer.ts       # editorial gate: decides what is shown, flagged or replaced
  components/
    sections/        # one file per section, in page order (see app/page.tsx)
    editorial.tsx    # CTA, claim/price rendering, pending markers, images, niche, wall label
    video-card.tsx   # testimonial poster that mounts the YouTube iframe on click
    sticky-cta.tsx   # pill shown when no other CTA is on screen
    motion-controller.tsx  # single observer for reveals
  app/globals.css    # tokens, surfaces, shapes, motion rules
public/media/
  santiago/ clients/ brand/  # copied from conscienciamce-web
  art/                       # public-domain paintings (Wikimedia Commons)
```

## Editorial controls (`bootcamp.offer`)

- `status: "draft" | "approved"`. Draft shows a preview banner, flags unapproved data in sanguine, and sets `noindex`.
  Approved hides anything not approved, or swaps it for the claim's `fallback`.
- `approvedClaims`: ids from `claims` cleared for publication.
- `price` and each row of `logistics` have their own `approved` flag.
- `checkoutUrl`: CTAs link to it only when it is set **and** status is `approved`.
  Otherwise they scroll to the "Inscripciones próximamente" notice (`#inscripcion`). There is never a fake purchase.

Open items for production: see `PENDIENTES_SANTIAGO.md`.

## Design notes

Concept: **La Restauración**. Under the industry noise there is an original work, which is literally Day 1 of the bootcamp ("vaciarse", "volver a la fuente"). The whole page is a restoration the reader performs.

| Section | Component (`src/components/experience/`) | Interaction |
|---|---|---|
| Hero | `restoration-hero` | Editorial MARKETING title sized to the free width, offer and images in normal flow. The scroll shrinks the title and moves the images inside their frames |
| Outcomes | `gallery-walk` | Pinned wall that slides sideways with the scroll |
| Audience | `authenticity-test` | Self-assessment with a stamped verdict. Runs only in the browser, nothing is stored |
| Interlude | `circle-reveal` | A circular painting grows to fill the screen |
| Manifesto | `scrub-words` | Words come out of the dark with the scroll |
| Pilar | `stratigraphy` | The eight layers open in 3D as a paint cross-section |
| Two days | `day-wipe` | Day 1 is wiped away into Day 2 (desktop; stacked on mobile) |
| Proof | `work-table` | Draggable prints (hover devices only, so touch never traps the scroll) |
| Investment | `creation-touch` | The painting is split on the gap between the fingers; the hands meet with the scroll and the ticket rises |

Rules that keep this safe:

- Native scroll and `position: sticky`. Nothing hijacks the wheel, and scrolling back undoes everything except the cleaning, which is one-way on purpose.
- Client components never import `content/bootcamp.ts`. Gated text is resolved on the server and passed as props, so an unapproved figure can never ship in the JS bundle.
- Reduced motion is handled in CSS (`.rm-final`, `.rm-hide`), not only in JS: the server renders the scroll start state inline and hydration does not remove it.
- `hero.noise`, palette and type: see `globals.css`. Surfaces are flat; the only saturated tones are the pigments in the cross-section and the paintings themselves.
