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
  lib/
    offer.ts         # editorial gate: decides what is shown or replaced
    analytics.ts     # semantic events (dataLayer + cc:track), nothing integrated yet
    board/
      layout.ts      # stations, stops and edges: geometry only
      camera.ts      # pure camera math
      engine.ts      # BoardEngine: the single owner of the viewport
  components/
    os/              # system bar, desktop, draggable items, map window, sidebar
    board/           # Station, Piece, edges
    stations/        # the content of each station, as real HTML
  app/globals.css    # tokens, vertical reading, board layout
public/media/        # santiago/ clients/ brand/ pilar/ desktop/ (in use)
                     # art/ hero/ items/ belong to V3, kept for the archive
archive/v3-la-restauracion/  # previous design, excluded from type-checking
```

## Editorial controls (`bootcamp.offer`)

- `status: "draft" | "approved"`. Draft sets `noindex` and shows every claim as written, with no marks on the page. Approved swaps any claim that is not in `approvedClaims` for its `fallback` and drops unapproved logistics.
- `price` and each row of `logistics` have their own `approved` flag.
- `checkoutUrl`: CTAs link to it only when it is set **and** status is `approved`. Otherwise they go to the ticket in the last station (`#inscripcion`). There is never a fake purchase.

What is still unapproved lives in `PENDIENTES_SANTIAGO.md`, not on the page.

## Design notes

Concept: **Creative Operating System**. A dark desktop holds a window, and the window opens into the living board.

- **One DOM, two layouts.** Stations are server-rendered HTML. `html.board-on` places them in the world; without it (phones, tablets, no JS, reduced motion) the same elements read as a vertical column.
- **Linear map.** Chapters run left to right, so scrolling down always moves forward. Do not fold the path back: it reads as going backwards.
- **One owner of the viewport.** The document scroll is the source of truth while guided, the pointer while exploring. Only `BoardEngine.paint` writes the world transform. React Flow and GSAP were discarded: this is a fixed graph, and they would add a second owner of the wheel.
- **No scroll hijacking.** Native scroll and `position: sticky`. If the page scrolls while exploring, the document wins and the tour resumes.
- Client components never import `content/bootcamp.ts`: gated text is resolved on the server, so an unapproved figure cannot ship in the JS bundle.

## Third-party pieces

`tech-text.tsx`, `paper-crumple.tsx`, `elastic-slider.tsx` and `halftone-reveal.tsx`, in `src/components/`, are adapted from React Bits. Their license is in `THIRD_PARTY_NOTICES.md`: commercial use is fine, reselling the components is not.

`paper-crumple.tsx` pulls in `three`. It is loaded through `next/dynamic` from `crumple-note.tsx`, on the board only, so it stays out of the first load. Do not import it statically.

`next dev` and `next build` differ a lot in this page's frame rate. Measure animations against a production build.
