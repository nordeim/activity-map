---
name: activity-map
description: >
  Complete engineering skill for the ROAM (Augsburg City Guide) codebase — a
  Next.js 16 + React 19 + Tailwind v4 + Prisma/SQLite clone of
  activity-map.base44.app. Captures every design decision, anti-pattern,
  debugging procedure, and lesson learned from three build/remediation
  sessions so a future agent can extend, debug, or replicate the app without
  re-discovering them.
version: 1.8.0
last_updated: 2026-09-26
project_state: "42 unit + 27 smoke + 56 E2E green; 42 published + 27 home-only + 9 map-demo places; session-20 route-choreography parity on top of session-18/16 (the deployed mirror re-audited — all functional flows green incl. favourites + booking round-trips, mobile nav clean, no Tailwind v4 failure classes — and the live source re-measured at 1280/390: the route stop cards re-typed — the place name an h3 at 20px/600 with the 13px/400 #72706A meta line, the 13px/600 Learn More, the max-w-md 448px desktop link card with the lighter 0 8px 28px/0.08 shadow, and the shadow-less px-3/py-1 12px/400 time pill with the 14px clock; the desktop route split rebuilt 50/50 — the visual panel w-1/2 (640px at 1280) with the stops column lg:px-8 (cards 576 at x=672) and the card SLOT at lg:pt-[237px]; the desktop swap replaced with the live's CONTINUOUS scroll-linked choreography — cards translate up through the slot at i/(N−1) crossings, 0.665px per scroll px, ±380px tent crossfades, 120ms linear inline transitions, exiting cards rise OUT never sink, the inline styles gated by an isDesktop matchMedia state so the mobile flow stays static; the mobile route panel re-padded 28px/18px/48px with mt-7 gaps — cards 354 @x=18; prior session-18 surfaces retained: the heading textures, the detail split, the mobile full-viewport route visual, the flowing restaurant list, the 800px band overlap; observed E2E traps: scrollIntoViewIfNeeded on the 420vh trap is non-deterministic and late-loading images shift the layout — use deterministic window.scrollTo + a re-align pass)"
---

# activity-map — ROAM (Augsburg City Guide) Engineering SKILL

> **How to use this document:** §1–§3 orient you (what this is, what it runs
> on, how to boot it). §4–§8 are the design/data/a11y contracts you must not
> break. §9–§16 are the hard-won failure catalogue — read §9 and §13 before
> touching `db-path.ts`, the Navbar, or the seed. §11 is the pre-ship gate.
> Every claim is verifiable against a specific file or command; nothing here
> is speculative.

---

## Table of Contents

1. [Project Identity & Design Philosophy](#1-project-identity--design-philosophy)
2. [Tech Stack & Environment](#2-tech-stack--environment)
3. [Bootstrapping & Configuration](#3-bootstrapping--configuration)
4. [The Design System (Code-First)](#4-the-design-system-code-first)
5. [Component Architecture & Patterns](#5-component-architecture--patterns)
6. [Client-State Patterns (Hooks Deep Dive)](#6-client-state-patterns-hooks-deep-dive)
7. [Content Management & Seed Data](#7-content-management--seed-data)
8. [Accessibility Implementation](#8-accessibility-implementation)
9. [Anti-Patterns & Common Bugs](#9-anti-patterns--common-bugs)
10. [Debugging Guide](#10-debugging-guide)
11. [Pre-Ship Checklist](#11-pre-ship-checklist)
12. [Lessons Learnt & How to Avoid Them](#12-lessons-learnt--how-to-avoid-them)
13. [Pitfalls to Avoid](#13-pitfalls-to-avoid)
14. [Best Practices](#14-best-practices)
15. [Coding Patterns](#15-coding-patterns)
16. [Coding Anti-Patterns](#16-coding-anti-patterns)
17. [Responsive Breakpoint Reference](#17-responsive-breakpoint-reference)
18. [Z-Index Layer Map](#18-z-index-layer-map)
19. [Color Reference (Complete)](#19-color-reference-complete)
20. [TypeScript Interface Reference](#20-typescript-interface-reference)
- [Appendix A: ADRs](#appendix-a-adrs)
- [Appendix B: Audit History](#appendix-b-audit-history)
- [Appendix C: Live-Site Validation Methodology](#appendix-c-live-site-validation-methodology)
- [Appendix D: Quick Reference Card](#appendix-d-quick-reference-card)

---

## 1. Project Identity & Design Philosophy

**One sentence:** ROAM is a production-grade, self-hosted clone of the hosted
trip-planning app `activity-map.base44.app` — an authenticated Augsburg city
guide with a showcase home page, three category browses, place detail +
booking, an interactive map, favourites, and a profile — running as a single
Next.js app with cookie sessions and SQLite.

**Design thesis:** *measured fidelity, not invention.* Every visual token,
filter chip, heading string, and mobile-chrome behavior was measured from the
live reference app (DOM inspection, computed styles, pixel sampling, VLM
screenshot comparison) before coding. When the live app changed (session 2's
Libre Baskerville + home redesign; session 3's palette/navbar/planner/card
redesign), the clone re-measured and followed. The clone is a mirror, and
mirrors are maintained by re-measuring, not guessing.

**Non-negotiable rules:**

- The live app is the spec. `https://activity-map.base44.app/` (demo login in
  `AGENTS.md`) is reachable; when in doubt, log in and measure again.
- Browses and counts show exactly 12 Eat / 12 Stay / 18 Do published places —
  the home-only showcase rows must never leak into them.
- The 390px mobile top bar fits on ONE line with nothing clipped or covered —
  pinned by `tests/e2e/mobile-navigation.spec.ts` failure classes A–E.
- No external services at runtime: no Redis, no NextAuth, no analytics; place
  imagery from `media.base44.com` + CARTO tiles + Google Fonts are the only
  third-party fetches.

**Anti-generic mandate:** no default Next.js starter look, no shadcn drawer
nav, no `bg-blue-600` accents. The palette is cream/ink/violet `#571AFF` (+
the electric blue band), the display face is Libre Baskerville, and the nav
links are Inter 16px (Poppins was dropped by the live app's session-3
redesign) — all measured, none chosen.

---

## 2. Tech Stack & Environment

Exact versions installed at the documented commit (from `bun pm ls`):

| Layer | Technology | Version | Critical Note |
|---|---|---|---|
| Web framework | next | 16.3.6 | App Router + `output: "standalone"`; Turbopack minifier has a multi-return bug (§9 B3) |
| UI runtime | react / react-dom | 19.3.0 | No `forwardRef`; server components by default |
| Language | typescript | 5.9.3 | `strict: true` EXCEPT `noImplicitAny: false` (intentional) |
| Styling | tailwindcss + @tailwindcss/postcss | 4.3.3 | CSS-first `@theme` — NO `tailwind.config.*` may exist |
| CSS extras | tw-animate-css | 1.4.0 | Animation utilities import in `globals.css` |
| ORM | prisma + @prisma/client | 6.19.3 | SQLite provider; `db push` only (no migrations folder) |
| Map | leaflet / react-leaflet | 1.9.4 / 5.0.0 | Must mount via `next/dynamic` `ssr:false` |
| Icons | lucide-react | 0.525.0 | The only icon source |
| Unit tests | vitest | 5.0.1 | Config matches `*.test.ts` only |
| E2E | @playwright/test | 1.63.0 | Chromium; 1 worker; boots the standalone build |
| Runtime | bun | 1.3.14 | Scripts, seed, standalone server (`npm` works too) |
| Lint | eslint + eslint-config-next | 9.x / 16.3.6 | `eslint .` — excludes `skills/` |

**Scaffold leftovers (unused, low priority):** `zustand`, `z-ai-web-dev-sdk`,
all `@radix-ui/*`, `class-variance-authority`, `tailwindcss-animate`,
`clsx` + `tailwind-merge` (the latter two ARE used by `src/lib/utils.ts`).
Documented in the PAD §10; pruning is a separate hygiene pass — do not
casually remove while making unrelated changes.

**Environment variables (3):**

| Variable | Required | Behavior |
|---|---|---|
| `DATABASE_URL` | yes | `file:../db/custom.db` — RELATIVE, resolves against `prisma/schema.prisma` (like the Prisma CLI). Pinned inline in the `dev`, `start`, `db:push`, `db:seed` scripts. |
| `AUTH_SECRET` | in production | HMAC key for the `roam_session` cookie; falls back to a dev-only constant. Stable across restarts or sessions invalidate. |
| `NEXT_PUBLIC_SITE_URL` | no | Reserved canonical-origin slot (currently unused by app code). |

---

## 3. Bootstrapping & Configuration

```bash
git clone https://github.com/nordeim/activity-map.git
cd activity-map
bun install                    # 485 packages, ~5s
cp .env.example .env           # DATABASE_URL="file:../db/custom.db"
bun run db:push                # schema → <repo>/db/custom.db (creates db/)
bun run db:seed                # 42 published + 27 home-only places + demo user
bun run dev                    # http://localhost:3000
```

Demo login: `sepnetflix2023@outlook.com` / `$Abcd1234` (the reference app's
account, seeded locally with a scrypt hash).

**Config files that matter:**

| File | Role | Gotcha |
|---|---|---|
| `next.config.ts` | standalone output + `remotePatterns` for `media.base44.com`, `z-cdn.chatglm.cn` | Adding an image host goes here, never `unoptimized` |
| `tsconfig.json` | strict, `@/*` → `src/*`, excludes `skills/` | `noImplicitAny: false` is deliberate |
| `vitest.config.ts` | node environment, `*.test.ts` only | E2E `*.spec.ts` files are excluded on purpose |
| `playwright.config.ts` | :3100, 1 worker, own `db/e2e.db`, storageState auth | `webServer` pins `DATABASE_URL` + `AUTH_SECRET` |
| `eslint.config.mjs` | next core-web-vitals + TS | ignores `skills/**` |
| `postcss.config.mjs` | `@tailwindcss/postcss` | nothing else — CSS-first |

**First-run verification:** open `/` → login card → sign in → the home page
must show the traveller-photo hero, the glass planner, "12 Hotels / 12
Places to Eat / 18 Sights to Discover" cards, Recommended Route, the blue
Highlighted Restaurants band, the stay showcase, and Highlighted Sights. If
browses show ≠12/12/18, the seed or the status filter is broken (§9 B6).

---

## 4. The Design System (Code-First)

All tokens live in `src/app/globals.css` under `@theme` (Tailwind v4
CSS-first — a `tailwind.config.*` file must NEVER appear):

```css
@theme {
  --color-cream: #f8f7f4;      /* page canvas (footer matches) */
  --color-cream-deep: #f2f1ee; /* raised cream surfaces */
  --color-surface2: #f2f1ee;   /* tag pills */
  --color-ink: #0e0e0e;        /* primary text, black buttons, markers */
  --color-secondary: #3a3a3a;  /* body copy */
  --color-muted: #888580;      /* muted meta text */
  --color-line: #e8e6dc;       /* navbar bottom border */
  --color-border: #dddbd5;     /* card hairlines */
  --color-roam: #571aff;       /* Learn More / Book Now accent, active marker */
  --color-roam-deep: #4a0fe0;  /* accent hover/pressed */
  --color-electric: #4d61ff;   /* live home's Highlighted Restaurants band */

  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-serif: "Libre Baskerville", ui-serif, Georgia, "Times New Roman", serif;
  --font-nav: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;

  --shadow-card: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  --shadow-float: 0 4px 24px rgba(0, 0, 0, 0.06);
  --shadow-hero: 0 18px 50px -12px rgba(0, 0, 0, 0.25);

  --radius-4xl: 2rem;
}
```

(The legacy `.font-poppins` utility still exists in globals.css but was
redefined to Libre Baskerville — mirroring the live app, which loads no
Poppins at all since its session-3 redesign.)

**Typography hierarchy (roles, from the live app):**

| Role | Font | Weight/size notes |
|---|---|---|
| Display (hero h1, section h2, place titles, 48px route-stop titles) | Libre Baskerville (`font-serif`) | hero: `clamp(34px, 9vw, 122px)`; per-section clamps measured session 3 — browse h1 `clamp(36px, 4.3vw, 55px)` ls −0.06em; detail h1 `clamp(36px, 6.4vw, 82px)`; route `clamp(38px, 6vw, 72px)`; restaurants `clamp(42px, 7vw, 104px)` |
| Nav links | Inter (`font-nav`) | 16px; mobile 700 active `#0E0E0E` / 500 inactive 40%; desktop 400 with active `rgba(14,14,14,0.08)` pill |
| UI body / meta / buttons / card names | Inter (`font-sans` — the body default) | card names 28px tracking −0.04em overlaid on photos; meta 12–13px |

**Custom `@utility` primitives (3):** `bg-grid` (22px graph-paper grid on the
favourites/profile canvases), `no-scrollbar` (the mobile-nav safety valve),
`hero-shade` (the hero legibility gradient). Keyframes: none of our own —
motion is Tailwind transitions + `prefers-reduced-motion` awareness.

**Radius scale:** Tailwind default scale + `--radius-4xl` (2rem). Cards use
`rounded-3xl` (1.5rem); the planner pill and nav pill are `rounded-full`.

**The glass planner pill (measured tokens, TripPlanner.tsx — `variant="glass"`
for the hero, plain white pill for the browse sticky):**
`rounded-full border-white/35 bg-[#F8F7F4]/35 backdrop-blur-[28px]
backdrop-saturate-150` + shadow `0 8px 22px rgba(0,0,0,0.12), inset 0 1px 0
rgba(255,255,255,0.42)`; desktop grid
`[minmax(42px,220px)_minmax(42px,90px)_minmax(42px,170px)_46px]`, wrapping
2×2 at 390px. Segments show a hover-revealed 12px label above the value row;
People/Type are invisible native `<select>` overlays; dates open the
`DateRangePicker` popover; the 46px search button routes to
`/eat|/stay|/do?people&start_date&end_date`.

---

## 5. Component Architecture & Patterns

**The 5-layer model (the Golden Rule: data flows downward only):**

```
Layer 0  Design tokens     globals.css @theme/@utility        (no config files)
Layer 1  Pure seams        lib/{db-path,filters,rate-limit,utils,auth}   (Vitest)
Layer 2  Data access       lib/db.ts singleton + lib/places.ts DTOs      (Prisma)
Layer 3  API routes        app/api/**/route.ts               (envelope + guards)
Layer 4  UI                server components by default; 18 client components
```

A layer never reaches up; the UI receives typed DTOs (`PlaceDTO`),
never Prisma rows.

**Client components (16, exhaustive — `"use client"`):**

| Component | Why client |
|---|---|
| `auth/LoginForm` | form state → POST → `router.refresh()` |
| `layout/Navbar` | `usePathname` active-link logic + hide-on-scroll |
| `home/Hero` | hero composition (planner lives in TripPlanner) |
| `home/RecommendedRoute` | scroll-driven sticky progress (session 3) |
| `home/HighlightedRestaurants` | tap-to-feature strip state |
| `places/CategoryExplorer` | search + chip filter state |
| `places/PlaceCard` | hover choreography + SaveButton mount |
| `places/StayCard` | dark square card + hover buttons (session 3) |
| `places/SaveButton` | optimistic heart toggle |
| `places/BookingForm` | booking-request form → POST |
| `planner/TripPlanner` | shared planner pill state → router push |
| `planner/DateRangePicker` | Su–Sa range popover state |
| `map/MapExplorer` | pills + search; mounts canvas dynamically |
| `map/LeafletCanvas` | react-leaflet (client-only, `ssr:false`) |
| `favourites/FavouritesView` | unsave interactions |
| `profile/ProfileView` | tabs + category filters |

**Server components:** `(app)/page.tsx` (home composition),
`StayShowcase`, `HighlightedSights`, `CategoryCards`,
`SiteFooter`, `LegalPage`, the three category pages, `place/[slug]`,
`login`, `privacy`, `accessibility`, `not-found`.

**The queries boundary (`src/lib/places.ts`):** every DB read goes through
`listPlaces` / `listPlacesForUser` / `getPlaceBySlug` / `countPlaces` /
`listHomePlaces` / `listMapPlaces` / `listFavourites` / `listBookings`; every
payload through `toPlaceDTO` / `toBookingDTO`. Components never touch
Prisma. (`src/lib/planner.ts` owns the pure planner param/date-label
helpers — Vitest-pinned.)

**Auth pattern:** `getSessionUser()` (from `lib/auth.ts`) guards the `(app)`
layout, every API route except `health` + `auth/login`, and injects the
per-user `saved` flags. Login/logout navigate with `router.refresh()` so
server components re-render — never `window.location`.

**Home composition (re-measured session 3, mirrors the live app):** Hero →
CategoryCards (glass cards, black `#141413` VIEW ALL) → RecommendedRoute
(sticky scroll route + progress pill) → HighlightedRestaurants
(`#highlighted-restaurants`, bg-electric) → StayShowcase (`#stay-showcase`)
→ HighlightedSights (`#highlighted-sights`) → SiteFooter (a SIBLING of
`<main>`, so it keeps its `contentinfo` role).


## 6. Client-State Patterns (Hooks Deep Dive)

This codebase deliberately has **zero custom hooks** — state is simple enough
that `useState`/`useMemo` at the component level is the right weight, and a
`usePlaces()`-style abstraction would hide the server/client boundary. The
patterns that replace hooks:

**Pattern — optimistic mutation + server refresh (`SaveButton`):** flip the
heart instantly, POST/DELETE `/api/favourites`, revert on failure, then
`router.refresh()` on success so server-rendered grids re-render with fresh
`saved` flags. This is why an unsave clears the Favourites card without a
navigation. Any new mutation component must follow the same three steps
(optimistic → API → refresh) or lists go stale.

**Pattern — derived filtering (`CategoryExplorer`):** `useMemo` over
`[places, query, activeChips]` calling the PURE seam
`filterPlaces(places, {query, chips, category})` from `lib/filters.ts`.
Filter logic never lives in the component — it lives in the Vitest-tested
seam. Extending chips = extending `filters.ts` + `tests/filters.test.ts`.

**Pattern — dynamic client-only mount (`MapExplorer`):**

```tsx
const LeafletCanvas = dynamic(() => import("./LeafletCanvas"), { ssr: false });
```

`react-leaflet` imports window at module scope; a server-side import crashes
the build (§9 B5). Every future map-adjacent component goes through this
gate.

**Pattern — local selection state (`HighlightedRestaurants`):**
`useState(restaurants[0]?.slug)` for the featured card; the strip buttons set
it. No global store, no context — the state is one click deep.

**Cleanup/SSR safety:** no `EventSource`, `IntersectionObserver`, or timers
are used; the only async boundary is navigation, handled by the router. If
you add effects, they must carry cleanup or the Leaflet strict-mode
double-mount will teach you why.

---

## 7. Content Management & Seed Data

**Data files (the single source of place content):**

| File | Rows | Destination |
|---|---|---|
| `prisma/data/eat.json` | 12 | `status:"published"`, category `eat` |
| `prisma/data/stay.json` | 12 | `status:"published"`, category `stay` |
| `prisma/data/do.json` | 18 | `status:"published"`, category `do` |
| `prisma/data/home.json` | 27 | `status:"home"` — 5 route stops + 6 sights + 16 restaurants |
| `prisma/data/map.json` | 9 | `status:"map"`, `map-*` slugs, real lat/lng from the live bundle |

Field names mirror the reference app's entity API (`sub_category`,
`cover_image_url`, `vibe_tags`, `avg_rating`…) so captured JSON maps 1:1 in
`prisma/seed.ts`. Browse-row coordinates are DETERMINISTIC: neighborhood
anchors (NEIGHBORHOOD_ANCHORS in seed.ts) + a stable FNV hash jitter per slug
— re-seeding never moves markers. Map-row coordinates are REAL (extracted
from the live JS bundle's hardcoded array).

**Adding a new published place:** add a record to the category JSON →
`bun run db:seed` → done (browses, counts, map, search pick it up
automatically; no component changes).

**Adding a new home showcase item:** add a record to the matching
`home.json` array (slug MUST start with `home-route-` / `home-sight-` /
`home-restaurant-` — the prefix plus `status:"home"` IS the selector for
`listHomePlaces`) → re-seed → the section renders it automatically.

**Adding a map demo place:** add a record to `prisma/data/map.json`
(`map-*` slug, real lat/lng) → re-seed → the map page picks it up via
`listMapPlaces()`; browses stay untouched.

**Idempotency contract:** `db:seed` wipes `booking`, `savedPlace`, `place`,
`user` then re-inserts. It is safe to run any time; it is NOT incremental —
hand-edited DB rows die on the next seed (by design: the JSON files are the
truth).

**Image policy:** entity `cover_image_url`/`gallery_images` point at
`media.base44.com` (the reference CDN; host must be in `next.config.ts`
`remotePatterns`). Only the hero (`public/images/hero-live.jpg`) and the nav
logo (`public/images/roam-logo.png`) are local files, downloaded from the
reference for stability.

---

## 8. Accessibility Implementation

| Item | Implementation | Where to verify |
|---|---|---|
| Body text contrast | ink `#0E0E0E` on cream `#F8F7F4` ≈ 16:1 (AAA) | globals.css tokens |
| Accent contrast | roam `#571AFF` on cream ≈ 6.3:1 (AA); white on electric `#4D61FF` ≈ 4.5:1 (AA) | §19 table |
| Nav inactive | mobile `#0E0E0E` at 40% opacity; desktop ink on white with `rgba(14,14,14,0.08)` active pill | Navbar.tsx |
| Focus rings | Browser default outlines preserved; nothing removes `outline` | globals.css (no `outline: none`) |
| Landmarks | `<header>` (banner), `<nav aria-label="Primary">`, `<main>`, `<footer>` (contentinfo — it is a SIBLING of `<main>`, see §9 B8) | every page |
| Nav aria | active link carries `aria-current="page"`; icon-only links carry `aria-label` | Navbar.tsx |
| Decorative vs meaningful images | card/place images carry `alt={name}`; logo spans are `aria-hidden` + `sr-only` "ROAM" | Navbar.tsx, cards |
| Reduced motion | transitions are subtle Tailwind classes; no autoplaying animation exists | components |
| Touch targets | nav icons 32px; buttons ≥40px (planner cells `min-h-[40px]`) | Navbar/Hero |
| Keyboard map | Leaflet default controls remain active | map view |

The Accessibility Statement at `/accessibility` states the WCAG 2.1 AA target
— keep it truthful: if you add a contrast failure, fix it or amend the page.

---

## 9. Anti-Patterns & Common Bugs

Every entry below was a REAL failure in this project's history, fixed and
(where possible) regression-pinned. Ordered by how likely you are to
re-trigger them.

### B1 — Turbopack production minifier mis-compiles multi-return helpers (CRITICAL)

**Symptom:** the standalone production server opens the WRONG SQLite file
(or `Error code 14: Unable to open the database file`) while `next dev` and
`bun` transpile of the same file work perfectly.
**Root cause:** the Turbopack production minifier dropped a `return repo`
from a multi-return path helper in `db-path.ts` — silently, no build error.
**Fix:** `standaloneRepoRoot()` and friends were restructured as
single-exit functions; `schemaAnchor` upgrades standalone anchors. KEEP THEM
SINGLE-EXIT. Pinned indirectly by E2E (server-on-wrong-DB would fail 20+
checks).
**Lesson:** never add an early-return branch to `db-path.ts` helpers; verify
production behavior (smoke test), not just dev.

### B2 — Parent-directory `.env` / exported shell `DATABASE_URL` hijacks the app (HIGH)

**Symptom:** `db:seed` writes `<workspace>/db/custom.db` instead of
`<repo>/db/custom.db`; the runtime opens a different file than the CLI.
**Root cause:** Bun and some runtimes walk up the directory tree loading
`.env` files, and a parent `.env` (or a shell-profile export) with an
absolute `DATABASE_URL` wins over the repo's relative one.
**Fix:** every script that touches the DB pins the URL inline:
`"db:push": "DATABASE_URL=file:../db/custom.db prisma db push …"`,
same for `dev`, `start`, `db:seed`. Do not "simplify" the pinning away.
**Lesson:** when the DB path is wrong, `env | grep DATABASE_URL` FIRST, then
check parent `.env` files.

### B3 — Quoted `.env` values passed through with quotes (MEDIUM)

**Symptom:** SQLite error 14 on a path that looks correct in logs — because
it is literally `file:"../db/custom.db"` with quotes.
**Fix:** `resolveDatabaseUrl` strips surrounding quotes before the `file:`
branch. Pinned by `tests/db-path.test.ts` (17 checks).
**Lesson:** every new env consumer should strip-then-parse, not parse raw.

### B4 — Mobile nav element covered by a neighbour at 390px (HIGH — the user's headline concern)

**Symptom:** the "Do" link (or a link cluster) is not tappable / visually
overlapped at 390px — Tailwind v4 failure class D.
**Root cause (history):** (1) an icon-bearing wordmark + padded links
overflowed the 390px budget; (2) after switching to the image logo, the
logo's right edge overlapped the first link again; (3) after removing
padding, the links fused with no gaps.
**Fix (current, session 3):** fixed-top cream-glass tab-bar (52px, ≤430px
centered) with the image wordmark's mobile spans capped at 18+62px,
text-only 16px Inter links, three 18px right-cluster icons, and the
`no-scrollbar` horizontal overflow safety valve. (Session 2's variant was a
flat full-width bar with a ≤52px wordmark span — the cap moves with the
measured chrome; the INVARIANT is: wordmark + 4 text links + 3 icons must
fit the 390px budget with zero overlap.)
**Variant (session 3, same symptom class):** a bare `grid` (no
`grid-cols-*`) in `HighlightedRestaurants` let a 2400px CDN image size an
implicit auto track to 2416px — `document.scrollWidth` exploded and dragged
the FIXED navbar's containing block off the 390px viewport (header landed at
x=565). Fix: `grid-cols-1`. Lesson: fixed-position chrome goes off-screen
whenever ANY ancestor expands the scroll width — check
`document.scrollWidth === viewport width` first.
**Pin:** `tests/e2e/mobile-navigation.spec.ts` computes pairwise link-box
intersections at 390px and fails on ANY overlap >1px. ALWAYS re-run it after
touching the Navbar.

### B5 — react-leaflet imported in a server component (BUILD BREAKER)

**Symptom:** build crash on window access.
**Fix:** `MapExplorer` (client) mounts `LeafletCanvas` via
`next/dynamic` with `ssr: false`. The import chain is the contract.

### B6 — Home-only rows leaking into browses/counts (DATA CORRUPTION CLASS)

**Symptom:** Eat shows 13 cards, "12 Places to Eat" card shows 13, or the
map shows route-stop markers.
**Root cause:** a new query forgetting `status: "published"`, or a home row
seeded without `status: "home"`.
**Pin:** `tests/e2e/home.spec.ts` "browses stay unpolluted" (12/12/18 link
counts) + the browse card-count checks.
**Contract:** `listPlacesForUser`/`countPlaces` filter published;
`getPlaceBySlug` deliberately does NOT filter (home links must resolve);
`listHomePlaces` selects by slug prefix + status home.

### B7 — Favourites card persists after unsave (STALE UI)

**Symptom:** un-saving leaves the card until manual reload.
**Fix:** `SaveButton` calls `router.refresh()` after a successful toggle so
server components re-render. Any new mutation must do the same.

### B8 — `<footer>` inside `<main>` loses its landmark (A11Y)

**Symptom:** `getByRole("contentinfo")` finds nothing; screen readers get no
footer landmark.
**Fix:** `SiteFooter` renders as a sibling of `<main>` in
`(app)/page.tsx`. Keep it there.

### B9 — Playwright `goto("/")` times out at 45s on slow CDN (FLAKE)

**Symptom:** E2E failures only in full runs, all in `page.goto` waiting for
`load`; the home page now pulls ~35 CDN card images.
**Fix:** spec navigations use `waitUntil: "domcontentloaded"` (assertions
auto-wait for hydration). Applied across `home.spec.ts`,
`mobile-navigation.spec.ts`, the favourites round-trip.
**Lesson:** never gate a spec on the `load` event of a CDN-heavy page.

### B10 — Strict-mode locator ambiguity (SPEC BUG CLASS)

**Symptom:** `getByText("Volta")` resolves to 2 elements (heading + strip
button) → strict mode violation, not an app bug.
**Fix:** prefer role-scoped, `exact: true`, or `.first()` locators; scope by
section ids (`#highlighted-restaurants`, `#stay-showcase`,
`#category-cards`).

---

## 10. Debugging Guide

| Symptom | Cause | Fix |
|---|---|---|
| `Error code 14: Unable to open the database file` (prod) | B1/B2/B3 chain: wrong file resolved, hijacked env, or quoted URL | Check `env | grep DATABASE_URL`; check parent `.env`; run `./scripts/smoke-test.sh` (it pins the env); keep db-path single-exit |
| Seed writes db outside the repo | exported/shell `DATABASE_URL` wins | `bun run db:seed` (pinned); verify with `ls db/` inside the repo |
| Logins loop back to `/login` after restart | `AUTH_SECRET` changed → old cookies fail HMAC | keep the secret stable; e2e pins `AUTH_SECRET` in playwright.config.ts |
| Login suddenly 429 | rate limiter (10/IP/15 min) tripped | wait `Retry-After` or restart the process (in-memory buckets) |
| Mobile nav link untappable at 390px | B4 class (wordmark too wide / no gaps / under-layer) | re-run `bunx playwright test tests/e2e/mobile-navigation.spec.ts`; check the link-box printout in the failure message |
| Home shows wrong card counts | B6 (status filter / seed drift) | `DATABASE_URL=file:../db/custom.db bun -e '…place.groupBy({by:["status"],_count:true})'` → expect `{published:42, home:27}` |
| E2E fails only in full runs at `goto` | B9 CDN flake | confirm `waitUntil: "domcontentloaded"` on that navigation |
| E2E strict-mode violation | B10 ambiguous locator | role-scope or `exact:true` |
| Build crashes on `window` | react-leaflet reached a server component | route through `next/dynamic` `ssr:false` |
| Images 404/blocked | host missing from `remotePatterns` | add the host in `next.config.ts` (never `unoptimized`) |
| `bunx prisma` behaves differently from the app | CLI resolves relative URLs against `prisma/` too, but your env differs | both paths converge on `db-path.ts`; test with `bun run test` (17 db-path checks) |

**Live-site re-measurement (when the reference app changes):** log in with
the demo account, `agent-browser eval` the DOM (computed styles, link
boxes, innerText), sample pixels for colors, VLM-compare screenshots — then
update tokens/data and re-pin with specs. See Appendix C.

---

## 11. Pre-Ship Checklist

Run IN ORDER from the repo root; every step must be green:

```bash
bun run lint          # eslint . — zero errors
bun run typecheck     # tsc --noEmit
bun run test          # vitest — 42 checks (17 db-path + 15 filters + 10 planner)
bun run build         # next build + standalone assembly
./scripts/smoke-test.sh   # 27 API checks against a fresh prod server
bun run test:e2e      # 35 Playwright checks (needs the build)
git status --short    # review the diff — no stray db/*.db, .env, or keys
```

**Security review (quick pass):** no `console.log` of secrets; no new
`remotePatterns` host without need; `AUTH_SECRET` non-empty in production
env; rate limiter untouched; no `dangerouslySetInnerHTML` introduced;
API envelope unchanged (`{ok,data}|{ok,error}` + real status codes).

**Visual review:** the 14 screenshots in `docs/screenshots/` are the
regression baseline — re-capture (`docs/screenshots/*`) when UI changes are
intentional, and eyeball 390px first (that is where every layout bug in
this project's history lived).

**Documentation review:** if commands/counts changed, update `AGENTS.md`
(the gate line), `CLAUDE.md`, `README.md` (testing table), and this SKILL's
`project_state` header. Drifted docs are worse than none.


## 12. Lessons Learnt & How to Avoid Them

1. **Measure, then build (L1).** Session 1 built from measured DOM/pixels and
   shipped in one pass. Sessions 2 AND 3 found the live app had been
   redesigned (fonts/home sections; then palette/navbar/planner/cards) — the
   fix was the same discipline: re-login, re-measure, re-pin. Avoid by
   treating the live app as a living spec and budgeting a measurement pass
   before every parity claim.
2. **The production build is a different program (L2).** Turbopack's
   minifier broke code that `next dev` and `bun` transpiled correctly (B1).
   Avoid by never trusting dev-mode verification alone — the smoke suite
   exists to exercise the standalone build.
3. **Environment inheritance is hostile (L3).** A parent `.env` and a
   shell-profile export both hijacked `DATABASE_URL` on different days (B2).
   Avoid by pinning env inline in every DB-touching script and suspecting
   the environment first when paths go wrong.
4. **390px is where layouts die (L4).** Four separate mobile-nav/layout bugs
   (B4 + session 3's 2416px grid blowout) across three sessions, all caught
   by the same spec. Avoid by re-running `mobile-navigation.spec.ts` after
   ANY Navbar/token change and thinking in px budgets (logo 18+62px + 4
   text links + 3 icons ≈ 18px < 390).
5. **Status fields are cheaper than new tables (L5).** The home showcase
   needed 27 place-like rows and the map needed 9 demo rows that must NOT
   pollute browses. `status:"home"` / `status:"map"` on the existing Place
   model + query-level filters solved it with zero schema change. Avoid
   duplicating models when a lifecycle field will do.
6. **Pin the semantics you measured (L6).** Chips, headings, counts, one-line
   nav — all pinned as specs. Every pin converted a later "does it still
   match?" question into a 90-second test run.
7. **Flakes are bugs in the spec, too (L7).** The CDN `load`-event timeouts
   (B9) masqueraded as app failures. `waitUntil: "domcontentloaded"` plus
   auto-waiting assertions is the durable pattern.
8. **Strict mode is a feature (L8).** The `getByText` ambiguities (B10)
   forced role-scoped locators, which survive content additions better.
   Write locators like the accessibility tree sees the page.

---

## 13. Pitfalls to Avoid

- **Don't add `tailwind.config.*`** — Tailwind v4 is CSS-first; tokens go in
  `globals.css` `@theme`. A config file silently overrides/conflicts.
- **Don't add early returns to `db-path.ts` helpers** (B1 single-exit rule).
- **Don't construct `PrismaClient` anywhere except `lib/db.ts`** — the
  singleton also holds the connection lifecycle.
- **Don't query places without `status:"published"`** unless it is
  `getPlaceBySlug`/`listHomePlaces`/`listMapPlaces` (B6).
- **Don't import `react-leaflet` outside the `ssr:false` dynamic gate** (B5).
- **Don't widen the mobile wordmark span past 62px** or add mobile link
  padding — the 390px budget is fully allocated (B4).
- **Don't use a bare `grid` (no `grid-cols-*`)** — implicit auto tracks size
  to CONTENT, so one wide CDN image blows out `document.scrollWidth` and
  drags fixed-position chrome off-screen at mobile emulation widths
  (session 3's HighlightedRestaurants fix: `grid` → `grid-cols-1`).
- **Don't remove the `no-scrollbar` overflow on the nav links row** — it is
  the safety valve that converts overflow into scroll instead of overlap.
- **Don't hand-roll price/€/duration formatting** — `lib/utils.ts`
  (`formatPrice`, `priceRangeSymbols`, `formatDuration`) owns display
  formatting.
- **Don't parse `vibeTags`-style columns inline** — `toPlaceDTO` is the only
  sanctioned JSON-array parser.
- **Don't use `window.location` for auth navigation** — `router.refresh()`
  keeps the server-rendered shell consistent (B7).
- **Don't commit `db/*.db`, `.env`, or any key file** — all gitignored;
  the SSH push key lives OUTSIDE the repo and is shredded after use.
- **Don't create git branches** — `main` only, Conventional Commits, push via
  `docs/ssh_git_wrapper_v3.py` (runbook: `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`).
- **Don't gate specs on the `load` event** of CDN-heavy pages (B9).
- **Don't bump the rate limiter to "fix" test failures** — share one login
  via storageState like the existing setup project does.

---

## 14. Best Practices

- **TDD on pure seams:** change `filters.ts`/`db-path.ts` by extending
  `tests/*.test.ts` first (RED), then implementing (GREEN). Both suites run
  in <1s.
- **Server components by default;** add `"use client"` only for interactivity,
  and keep the 16-component inventory in this file current.
- **DTO at the boundary:** every API payload is `PlaceDTO`/`BookingDTO`;
  serialization happens only in `lib/places.ts`.
- **Deterministic seeds:** neighborhood anchors + slug-hash jitter keep
  coordinates stable across reseeds — never `Math.random()` in the seed.
- **Inline-pinned env in scripts** for every DB-touching command (B2).
- **Section ids as spec scopes:** `#category-cards`, `#highlighted-restaurants`,
  `#stay-showcase`, `#highlighted-sights` — keep them stable; specs depend
  on them.
- **Descriptive aria over visual-only labeling:** icon links carry
  `aria-label`; the logo pair is `aria-hidden` with an `sr-only` "ROAM".
- **Left-aligned lists** (no `justify` on bullets), single-column text flow,
  no artificial "End of document" markers.
- **English UI copy** (the live app's language), Conventional Commit
  messages, and doc updates in the same commit as the behavior change.

---

## 15. Coding Patterns

### Pattern — API route (auth → validate → business → envelope)

```ts
// src/app/api/favourites/route.ts (shape)
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const placeId = body?.placeId;
  if (typeof placeId !== "string") {
    return NextResponse.json({ ok: false, error: "MISSING_PLACE_ID" }, { status: 400 });
  }
  // ... Prisma upsert, then:
  return NextResponse.json({ ok: true, data: { placeId } }, { status: 201 });
}
export const dynamic = "force-dynamic";
```

### Pattern — server page composing showcase sections

```tsx
// src/app/(app)/page.tsx (shape)
const [counts, route, sights, restaurants, stays] = await Promise.all([
  countPlaces(),
  listHomePlaces("home-route-"),
  listHomePlaces("home-sight-", uid),
  listHomePlaces("home-restaurant-"),
  listPlacesForUser(uid ?? "", "stay"),
]);
```

Parallel `Promise.all` — five independent queries never serialize.

### Pattern — schema-anchored SQLite resolution (single-exit!)

```ts
// src/lib/db-path.ts — the contract pinned by 17 unit checks:
// relative file: URLs resolve against the anchor dir holding
// prisma/schema.prisma (like the Prisma CLI); absolute/quoted/foreign URLs
// pass through. Helpers are SINGLE-EXIT on purpose (B1).
export function resolveDatabaseUrl(envValue?: string, anchors: string[] = []): string
```

### Pattern — pure filter seam

```ts
// src/lib/filters.ts + tests/filters.test.ts
filterPlaces(places, { query, chips, category })  // AND-composed chips;
// special eat chips (Open now / Near me / Under €100 / Trending) + tag chips;
// query matches name/neighborhood/subCategory/description/tags
```

### Pattern — HMAC stateless session

```ts
// src/lib/auth.ts
hashPassword(pw)            // scrypt salt:hash
createSessionCookie(user)   // HMAC-SHA256 payload, 7-day TTL, httpOnly/lax
getSessionUser()            // reads + verifies the roam_session cookie
```

---

## 16. Coding Anti-Patterns

- `import { PrismaClient } from "@prisma/client"` in a component/route —
  use `import { db } from "@/lib/db"`.
- Leaking Prisma rows into JSON — serialize through `toPlaceDTO`.
- `<img>` with a non-allowlisted host — extend `remotePatterns` instead of
  `unoptimized`.
- `forwardRef` wrappers — React 19 passes `ref` as a prop.
- Global state libraries for local concerns — this app deliberately has none
  (zustand in package.json is an unused scaffold leftover).
- `aria-label` text that duplicates visible text (double announcement).
- New env vars read via raw `process.env.X` in components — env consumption
  belongs to server seams; client code sees only `NEXT_PUBLIC_*`.
- Early-return pyramids in `db-path.ts` (B1), `justify` alignment on lists,
  and hand-rolled `€` string building (`"€".repeat(n)` — use
  `priceRangeSymbols`).

---

## 17. Responsive Breakpoint Reference

Tailwind default scale (no custom breakpoints). Usage counts in the codebase:
`sm:` ≈111, `md:` ≈27, `lg:` ≈8, `xl:` ≈1.

| Breakpoint | What changes |
|---|---|
| base (<640px, design target 390×844) | Nav = FIXED-TOP cream-glass tab-bar (52px, ≤430px centered, blur, border-b `rgba(14,14,14,0.08)`): image wordmark (18+62px spans), 4 text-only 16px Inter links (700 active / 500 @40% inactive), right cluster = pin/heart/user 18px icons; home hero slides under the glass. Planner pill wraps 2×2. Cards 1-col. |
| `sm:` 640px+ | (chips/grids step up; nav unchanged until `md`) |
| `md:` 768px+ | Nav becomes in-flow sticky transparent header wrapping the full-width WHITE `h-14` bar (border-b `#E8E6DC`): 16px Inter icon+text links, active `rgba(14,14,14,0.08)` pill, heart + avatar right cluster, hide-on-scroll choreography. Display headings step up; grids widen. |
| `lg:` 1024px+ | Stay showcase 3-col; highlighted restaurants = featured card beside strip. |
| `xl:` 1280px+ | Max content widths (1000–1100px) — the page never stretches full-bleed. |

**Mobile testing rule:** every layout-affecting change gets a 390px check —
`screenshot` at 390×844 plus the mobile-nav spec. The E2E suite runs 390 /
640 / 1280 viewports explicitly.

---

## 18. Z-Index Layer Map

| Layer | Element | Location | Purpose |
|---|---|---|---|
| 0 | `.leaflet-container` | globals.css | Map canvas stays under UI |
| 10 | Hero content, CategoryCards, Route time chips, Map status badge | components | Section content over decorative/backdrop layers |
| 40 | Sticky Navbar `<header>` | Navbar.tsx | The only sticky chrome |
| 100+ | (reserved) Leaflet popups/controls use Leaflet's own internal scale | — | never fight them; keep app chrome below |

Rules: the navbar (40) is the app's ceiling; overlays inside sections stay
at 10; anything needing 50+ must justify itself against the Leaflet popup
stack. There are no portals/modals in the app today.

---

## 19. Color Reference (Complete)

| Token | Hex | RGB | Tailwind class | Usage | Contrast |
|---|---|---|---|---|---|
| cream | `#F8F7F4` | 248 247 244 | `bg-cream` | page canvas (footer matches) | — |
| cream-deep / surface2 | `#F2F1EE` | 242 241 238 | `bg-cream-deep`, `bg-surface2` | raised cream, tag pills | ink on it ≈15:1 AAA |
| ink | `#0E0E0E` | 14 14 14 | `text-ink`, `bg-ink` | primary text, black buttons, markers | on cream ≈16:1 AAA |
| secondary | `#3A3A3A` | 58 58 58 | `text-secondary` | body copy | on cream ≈11:1 AAA |
| muted | `#888580` | 136 133 128 | `text-muted` | muted meta text | on cream ≈3.5:1 AA-large |
| line | `#E8E6DC` | 232 230 220 | `border-line` | navbar bottom border | — |
| border | `#DDDBD5` | 221 219 213 | `border-border` | card hairlines | — |
| roam | `#571AFF` | 87 26 255 | `text-roam`, `bg-roam` | Learn More / Book Now accent, active marker | on cream ≈6.3:1 AA; white on it ≈7:1 AAA |
| roam-deep | `#4A0FE0` | 74 15 224 | `text-roam-deep` | accent hover/pressed | on cream ≈8:1 AAA |
| electric | `#4D61FF` | 77 97 255 | `bg-electric` | home Highlighted Restaurants band | white on it ≈4.5:1 AA |
| VIEW ALL black | `#141413` | 20 20 19 | `bg-[#141413]` | category-card VIEW ALL pills | white on it ≈17:1 AAA |
| mobile nav inactive | `rgba(14,14,14,.4)` | — | `text-[#0e0e0e]/40` | inactive mobile tab-bar links | — |
| desktop active pill | `rgba(14,14,14,.08)` | — | `bg-[rgba(14,14,14,0.08)]` | active desktop nav link pill | — |
| amber (stars) | `text-amber-300` | — | `text-amber-300` | star ratings on the blue band | decorative |

Opacity variants: `black/5` borders, `black/50–/65` meta text,
`white/35` glass borders, `bg-[#F8F7F4]/35` glass fill. Selection highlight
`rgba(87,26,255,0.18)`. No other colors are sanctioned; adding one means
adding a token in `@theme` first.

---

## 20. TypeScript Interface Reference

`src/types/index.ts` (verbatim shapes):

```ts
export type PlaceCategory = "eat" | "stay" | "do";

export interface PlaceDTO {
  id: string; slug: string; name: string;
  category: PlaceCategory;
  subCategory: string | null;
  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;
  galleryImages: string[];
  priceRange: number | null;      // 1..4 → €..€€€€
  price: number | null;           // do: ticket price
  priceLabel: string | null;      // do: display label e.g. "Free", "€12"
  nightlyPrice: number | null;    // stay: per-night price
  currency: string;
  avgRating: number; reviewCount: number;
  isBookable: boolean;
  neighborhood: string | null; address: string | null;
  openingHours: string | null; durationMin: number | null;
  minParty: number | null; maxParty: number | null;
  vibeTags: string[]; cuisineTags: string[]; amenities: string[];
  roomTypes: string[]; highlights: string[]; tags: string[];
  lat: number | null; lng: number | null;
  saved: boolean;                 // per-user, resolved server-side
}

export interface BookingDTO {
  id: string; placeId: string;
  placeSlug: string; placeName: string;
  placeCategory: PlaceCategory;
  coverImageUrl: string | null; neighborhood: string | null;
  startDate: string | null; endDate: string | null;
  guests: number; status: string;
  createdAt: string;
}

export interface CategoryMeta {
  key: PlaceCategory; href: string; label: string;
  eyebrow: string; title: string; subtitle: string;
  searchPlaceholder: string;
}
```

Session payload (lib/auth.ts): `{ uid, email, name }` signed into the
`roam_session` cookie. API envelope:
`{ ok: true, data: T } | { ok: false, error: string }`.

---

## Appendix A: ADRs

| # | Decision | Rationale |
|---|---|---|
| ADR-1 | Single Next.js app, standalone output, SQLite | Zero-config local story; mirrors scandihaven infra conventions |
| ADR-2 | Hand-rolled HMAC cookie auth (no NextAuth) | No external identity dependency; matches the reference login flow |
| ADR-3 | Tailwind v4 CSS-first tokens in `globals.css` | The reference stack; avoids the config-file failure classes |
| ADR-4 | Prisma `db push` + deterministic JSON seed (no migrations) | Data is content, not state; reseeding is the update path |
| ADR-5 | Leaflet via `next/dynamic ssr:false` | Only stable SSR-safe react-leaflet pattern |
| ADR-6 | `status:"home"` rows for the home showcase, `status:"map"` for the demo pins | Zero schema change; browses stay pure; home/map links resolve |
| ADR-7 | Local hero + logo assets, CDN entity imagery | Stability of the chrome vs. freshness of the content |
| ADR-8 | Shared E2E storageState login | Login rate limiter makes per-test logins self-DoS |
| ADR-9 | Shared TripPlanner component routing into browses (session 3) | The live app's search goes to `/eat|/stay|/do?people&dates`, not the map |
| ADR-10 | Booking-request fields on the Booking model (session 3) | The live detail form captures name/surname/time/phone/email/message |

## Appendix B: Audit History

| Date | Pass | Findings → Fixes | Tests |
|---|---|---|---|
| Session 1 (build) | Full gate | Turbopack minifier bug → single-exit db-path; parent `.env` hijack → pinned scripts; quoted env values → strip; SaveButton staleness → `router.refresh()`; mobile-nav class D overlap → text-only compact links | 32 unit · 27 E2E · 27 smoke green |
| Session 2 (parity remediation) | Full gate + live re-measure | Live app redesign → Libre Baskerville/Poppins/fonts, image logo, glass planner hero, 4 new home sections + footer + legal pages (27 home rows); mobile overlap recurred after logo swap → 52px wordmark cap + 12px gaps; CDN load flakes → `domcontentloaded`; footer landmark → sibling of main; db:push/db:seed env pinning | 32 unit · 35 E2E · 27 smoke green |
| Session 3 (re-measure + remediation) | Full gate + live re-measure | Live app evolved again → 14 findings (docs/remediation-plan-session-3.md): palette/ink/violet retint, Poppins dropped (nav Inter), navbar redesign (glass tab-bar + white bar), TripPlanner + DateRangePicker routing into browses, sticky scroll route, card redesigns (overlaid names, active+dimmed €, dark stay cards), booking-request form + Booking fields, 9 map demo rows, profile redesign. E2E root causes fixed: HighlightedRestaurants bare `grid` → 2416px overflow dragging fixed nav off-screen (grid-cols-1); Navbar `<nav aria-label>` landmark scope; Tailwind v4 `text-[#0e0e0e]/40` compiles to `color-mix()` not `rgba()` (use explicit rgba classes in CSS assertions); getByLabel double-match (label wrapping a labeled select); BookingForm `Name*` accessible name (aria-label on input); profile `.or()` locator strict-mode conflict (`.first()`) | 42 unit · 35 E2E · 27 smoke green |

## Appendix C: Live-Site Validation Methodology

1. `agent-browser open https://activity-map.base44.app/login` → login with
   the demo account.
2. DOM-measure: `eval` computed styles (fonts, colors, radii), link boxes at
   390px and 1280px, `document.body.innerText` for content inventories.
3. Capture screenshots (desktop + 390px; `--full` for long pages).
4. VLM-compare reference vs clone screenshots (parity score + difference
   list) — then VERIFY every VLM claim against the DOM (VLMs misread
   small text and dev-tool badges; DOM is the truth).
5. Diff entity data via the app's authenticated REST (`/api/apps/<id>/entities/<E>`).
6. Update tokens/data → write the RED spec → implement → GREEN → re-capture
   screenshots into `docs/screenshots/`.

## Appendix D: Quick Reference Card

| Need | Where |
|---|---|
| Tokens | `src/app/globals.css` `@theme` |
| DB singleton | `src/lib/db.ts` (import `{ db }`) |
| URL resolution contract | `src/lib/db-path.ts` + `tests/db-path.test.ts` |
| Queries/DTOs | `src/lib/places.ts` (`listHomePlaces`, `listMapPlaces`, `toPlaceDTO`) |
| Auth | `src/lib/auth.ts` + `src/lib/rate-limit.ts` |
| Filters | `src/lib/filters.ts` + `tests/filters.test.ts` |
| Planner helpers | `src/lib/planner.ts` + `tests/planner.test.ts` |
| Nav (mobile hazard zone) | `src/components/layout/Navbar.tsx` |
| Home sections | `src/components/home/{Hero,CategoryCards,RecommendedRoute,HighlightedRestaurants,StayShowcase,HighlightedSights}.tsx` + `layout/SiteFooter.tsx` |
| Planner | `src/components/planner/{TripPlanner,DateRangePicker}.tsx` |
| Seed data | `prisma/data/{eat,stay,do,home,map}.json` + `prisma/seed.ts` |
| E2E specs | `tests/e2e/{auth,browse,home,mobile-navigation}.spec.ts` |
| Smoke suite | `scripts/smoke-test.sh` (27 checks) |
| Screenshots baseline | `docs/screenshots/` (14 captures) |
| Remediation record | `docs/remediation-plan.md` (session 2) · `docs/remediation-plan-session-3.md` (session 3) |
| Push runbook | `docs/how-to-git-push-using-ssh-wrapper_SKILL.md` + `docs/ssh_git_wrapper_v3.py` |
