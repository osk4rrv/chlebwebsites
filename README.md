# Asterza

Marketing site for Asterza — VPS, game server and Discord bot hosting.

Live: **https://osk4rrv.github.io/chlebwebsites/**

## Stack

React 19 + TypeScript + Vite, `react-router-dom` for routing. No UI library,
no CSS framework, no animation library — everything is hand-written CSS driven
by design tokens.

## Design system

| Concern | Where |
| --- | --- |
| Colour, type scale, spacing, radii, motion | `src/styles/tokens.css` |
| Reset and typographic primitives | `src/styles/base.css` |
| Reusable components | `src/components/*` |
| Page-level compositions | `src/sections/*`, `src/pages/*` |
| All copy, specs, prices, regions | `src/data/*` |

Rules the design holds to:

- One accent colour (signal amber `--c-accent`), used only for CTAs, active
  states, links and technical indicators. Green/amber/red appear only as
  functional status.
- Hairlines (`--c-line`) are the primary structural device. Two elements on the
  whole site carry a shadow, both of them product surfaces.
- Radii top out at 5px. Nothing is a pill.
- Monospace (`IBM Plex Mono`) is reserved for technical values: regions,
  latency, specs, IDs, prices, deploy state. Prose is `Archivo`.
- Sections deliberately vary in rhythm — rail + body, full-bleed, dense table,
  editorial two-column. No repeated "headline → 3 cards" pattern.

## Content

Every price, spec, region and metric lives in `src/data/`. Changing the product
line-up or the price list means editing data, not JSX:

- `plans.ts` — plan matrix for all three families, plus what's bundled
- `products.ts` — per-product page copy
- `regions.ts` — regions, latency, capacity, network facts
- `status.ts` — status page components, uptime history, incidents
- `docs.ts` — documentation articles as content blocks
- `site.ts` — company facts, nav, headline metrics, spec sheet, FAQ

## Local development

```bash
npm install
npm run dev          # http://localhost:5173/chlebwebsites/
npm run build        # type-check, build, emit dist/ + 404.html
npm run lint
npm run shots        # layout review screenshots at 3 viewports
```

`npm run shots` serves `dist/` and captures viewport slices of each route to
`.kiro/artifacts/screenshots/`. Pass routes and `--vp=mobile` to narrow it.

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`, which lints, builds and
force-pushes `dist/` to the `gh-pages` branch. GitHub Pages serves that branch
from its root.

The site is served from a project subpath, so `vite.config.ts` sets
`base: "/chlebwebsites/"` and the router picks that up via
`import.meta.env.BASE_URL`. To host at a domain root instead — for example
pointing `asterza.vip` at Pages — build with:

```bash
BASE_PATH=/ npm run build
```

and add a `CNAME` file containing the domain to `public/`.

`postbuild` copies `index.html` to `404.html` so client-side routes survive a
direct hit on a deep link.

## Notes

The sign-up and log-in forms validate but do not create accounts — there is no
billing backend attached to this deployment, and the forms say so rather than
pretending to succeed.
