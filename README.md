# ROAM — Augsburg City Guide

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![SQLite](https://img.shields.io/badge/DB-SQLite-003b57?logo=sqlite)

A production-grade, self-hosted clone of the reference trip-planning app at `activity-map.base44.app` — rebuilt as a single Next.js application with cookie-session auth, a full browse → detail → booking flow, an interactive map, and the 42 real places captured from the live app.

## Overview

The reference app is an Augsburg city guide: a photographic hero with a frosted glass trip-planner pill (hover-revealed labels, a react-day-picker-style date-range popover, and a search that routes into the category browses with `people`/`start_date`/`end_date` params), glass category cards, the scroll-driven **Recommended Route** itinerary, a blue **Highlighted Restaurants** band with a featured card and restaurant strip, the full **Choose Your Vibe** stay showcase, the **Highlighted Sights** grid, three category browses (Eat / Stay / Do) with search, measured filter chips, and a sticky white planner pill, redesigned place detail pages with a booking-request form, a Leaflet map over the whole city (9 demo places, as on the live app), favourites, and a redesigned profile with trips and bookings — all behind an email/password login. This repo reproduces that experience end-to-end: same visual design tokens (re-measured session 3: cream `#F8F7F4`, ink `#0E0E0E`, violet `#571AFF`, Libre Baskerville display serif + Inter for UI and nav), same filter semantics, same entity data, but running locally as a standalone Next.js 16 server with a Prisma/SQLite store and zero external services.

| Desktop home | Mobile browse |
|---|---|
| ![Home — hero, trip planner, category cards](docs/screenshots/01-home-highlights.png) | ![Mobile Eat view](docs/screenshots/10-mobile-eat.png) |

Fourteen production captures live in [`docs/screenshots/`](docs/screenshots/): home, the four new home sections (route, restaurants, stays, sights), Eat, Stay, Do, map, place detail, favourites, profile, and two mobile views.

## Key Features

| Feature | Description |
|---------|-------------|
| 🧭 **Home, re-measured + remediated (session 3)** | Traveller-photo hero with the huge Libre Baskerville wordmark, the frosted GLASS planner pill (Select dates · People 1–8 · Restaurants/Hotels/Attractions · search), glass category cards (frosted white/34, radius 20) with black `#141413` VIEW ALL pills and corrected Altstadt/Fun subtitles |
| 🗓 **Recommended Route** | The scroll-driven sticky itinerary — 140vh heading trap, sticky SVG route visual with a scroll-synced progress pill ("0% of your day planned"), and the white rounded-28 stop panel: 48px Libre Baskerville titles, `9:00 AM` times, stacked `·`-prefixed meta |
| 💙 **Highlighted Restaurants** | The vivid blue band (`#4D61FF`): tap-to-feature restaurant strip (16 tables) + the featured card with Book a Table / Learn More |
| 🛏 **Choose Your Vibe** | The full twelve-stay showcase with street addresses, € symbols · ★ ratings, and Learn More + Book Now actions |
| 🏛 **Highlighted Sights** | Six calm stops (Fuggerei → Schaezlerpalais) with rating badges, heart overlays, and the More Things to Do hand-off |
| 🔍 **Trip planner (shared component)** | `TripPlanner` + `DateRangePicker` (Su–Sa popover, from/to optional, `DD/MM/YYYY — DD/MM/YYYY`): search routes to `/eat|/stay|/do?people=N&start_date=…&end_date=…` (Hotels → `/stay`, Attractions → `/do`); on browse pages it re-renders as a sticky white pill pre-filled from the URL — pure helpers unit-tested in `src/lib/planner.ts` |
| 🍽 **Eat / Stay / Do browses** | Server-rendered grids of the 42 captured places with live search and **data-measured filter chips** (eat: Open now / Near me / Under €100 / Trending + cuisine tags; stay & do: the entities' own tags) that AND-compose. Cards re-measured session 3: eat/do names overlaid on `h-[372px]` photos (28px Inter, tracking −0.04em) with tag pills, violet `#571AFF` Learn More, and ACTIVE+DIMMED price symbols; stay cards are dark `aspect-square` composites with ghost Learn More + white Book Now on hover; date-range params filter the grids |
| 🏛 **Place detail + booking request** | 82px-clamp h1, "About this place" + tag pills, gallery, rating, highlights, and the booking-request form (Name*, Surname*, Dates, Time, Phone, Email*, Message → `Book Now` violet `h-12`) posting to `/api/bookings`; request fields persisted on the `Booking` model and bookings visible on the profile |
| 🗺 **Interactive map** | Leaflet map with CARTO basemap fed by the 9 demo places the live app hardcodes (status `"map"`, real lat/lng, `map-*` slugs): black dot markers (violet when active), category pills (All Places / Restaurants / Hotels / Sights), stats pills, geolocation notice with Augsburg fallback, "Places on the map" list section, live search, and popups linking into place pages |
| ❤️ **Favourites** | One-tap save/unsave on cards and detail pages, with a dedicated Favourites view and an illustrated empty state |
| 👤 **Profile** | Redesigned session 3: PROFILE eyebrow, "Explorer" title, "Your Roam account", "Augsburg", 0-day-streak + Explorer badge, Saved-places count, TRIPS/My bookings, Upcoming/Past/All tabs + Eat/Stay/Do filters, and the "No upcoming reservations. Time to explore." empty state |
| 📄 **Legal pages** | Privacy policy and Accessibility Statement (the footer's measured links), rendered as real public routes |
| 🔐 **Cookie-session auth** | scrypt password hashing + HMAC-SHA256-signed stateless cookies, login rate limiting (10/IP/15 min), auth-gated route group with server-side redirects |
| 📱 **Mobile-first chrome** | Measured 390px fixed-top cream-glass tab-bar (52px, ≤430px centered, text-only 16px Inter links — active 700/`#0E0E0E`, inactive 500/40%, three 18px right icons: MapPin/Heart/User; the home hero slides under the glass) that becomes the sticky transparent header + full-width white `h-14` bar (border-b `#E8E6DC`, Inter 16px icon+text links, active `rgba(14,14,14,0.08)` pill, hide-on-scroll choreography) from `md` up — regression-pinned by E2E against the five known Tailwind v4 mobile-nav failure classes |

## Architecture

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Web framework | Next.js (App Router, standalone output) | 16 | Pages, API route handlers, server components |
| UI runtime | React | 19 | Server components by default; 16 client components |
| Language | TypeScript | 5 (strict, `noImplicitAny` off) | Type-safe app + typed API DTOs |
| Styling | Tailwind CSS | 4 (CSS-first, no config file) | `@theme` tokens + `@utility` primitives |
| Fonts | Libre Baskerville + Inter | — | Serif display + UI/nav sans (Google Fonts; Poppins was removed by the live app's session-3 redesign — `.font-poppins` now maps to the serif) |
| Map | Leaflet + react-leaflet | 1.9 / 5 | Map view, `ssr:false` dynamic mount |
| ORM | Prisma | 6 | Schema, client, seed |
| Database | SQLite (PostgreSQL switchable) | — | Zero-config local store |
| Unit tests | Vitest | 5 | 42 checks on the pure seams |
| E2E tests | Playwright | 1.63 | 35 checks against the production build |
| Runtime | Bun (npm-compatible) | ≥1.4 | Install, dev, seed, server |

```mermaid
flowchart TB
    B[Browser] --> S[Next.js standalone server :3000]
    S --> DB[(SQLite db/custom.db via Prisma — 42 published + 27 home-only + 9 map-demo places)]
    S --> CDN1[media.base44.com — place imagery]
    S --> CDN2[CARTO basemap tiles + Google Fonts]
```

## File Hierarchy

```
📂 src/
 ┣ 📂 app/
 ┃ ┣ 📂 (app)/            ← auth-gated route group (layout redirects to /login)
 ┃ ┃ ┣ 📄 page.tsx        ← Home: hero + planner + category cards + Recommended Route
                             + blue restaurants + stay showcase + sights + footer
 ┃ ┃ ┣ 📄 eat|stay|do/    ← Category browses (server components, searchParams-aware)
 ┃ ┃ ┣ 📄 place/[slug]/   ← Place detail + booking-request form
 ┃ ┃ ┣ 📄 map/ favourites/ profile/
 ┃ ┣ 📂 api/              ← health, auth/*, places, places/[slug], favourites, bookings
 ┃ ┣ 📄 login/            ← Real login route (public)
 📃 privacy/ accessibility/ ← Public legal pages (the footer's measured links)
 ┃ ┣ 📄 globals.css       ← Tailwind v4 @theme tokens + @utility primitives
 ┃ ┗ 📄 layout.tsx        ← Root layout, fonts, metadata
 ┣ 📂 components/         ← Navbar + SiteFooter + LegalPage, Hero, CategoryCards,
                          RecommendedRoute (sticky scroll), HighlightedRestaurants,
                          StayShowcase, HighlightedSights, CategoryExplorer, PlaceCard,
                          StayCard, planner/ (TripPlanner + DateRangePicker), BookingForm,
                          MapExplorer + LeafletCanvas, FavouritesView, ProfileView, LoginForm
 ┣ 📂 lib/                ← auth, db, db-path, filters, planner, places
                          (listHomePlaces + listMapPlaces), rate-limit, utils
 ┗ 📂 types/              ← PlaceDTO / BookingDTO / PlaceCategory
📂 prisma/                ← schema.prisma, seed.ts, data/{eat,stay,do,home,map}.json
                              (captured entities + home-only showcase rows + 9 map-demo places)
📂 tests/                 ← db-path + filters (Vitest), e2e/ (Playwright: auth, browse, home parity, mobile-nav)
📂 scripts/               ← smoke-test.sh (27-check API suite)
📂 docs/                  ← DEPLOYMENT.md, remediation-plan.md, Tailwind-V4-Validation-Report.md,
                              screenshots/ (14 captures), SSH push runbook
```

## Quick Start

Requires Bun ≥1.4 (or npm/node ≥20) .

1. Clone and install:

   ```bash
   git clone https://github.com/nordeim/activity-map.git
   cd activity-map
   bun install
   ```

2. Configure and seed the database:

   ```bash
   cp .env.example .env
   bun run db:push     # apply the schema (db/e2e-agnostic, no migrations folder)
   bun run db:seed     # 78 places (42 published + 27 home-only + 9 map-demo) + the demo user
   ```

3. Start the dev server:

   ```bash
   bun run dev
   ```

**Verify setup:** open `http://localhost:3000` → you land on the login card; sign in with `sepnetflix2023@outlook.com` / `$Abcd1234` → the Highlights page renders the traveller-photo hero, the glass planner (pick dates in the popover, then Search → `/eat?people=…&start_date=…`), the glass category cards, and the full home showcase (sticky route, restaurants, stays, sights).

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | `file:../db/custom.db` (relative URLs resolve against `prisma/schema.prisma`) or a PostgreSQL string — see `.env.example` |
| `AUTH_SECRET` | **In production** | HMAC key for session cookies; generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | No | Reserved canonical-origin slot |

## Testing

| Layer | Command | Checks | Notes |
|-------|---------|--------|-------|
| Unit | `bun run test` | 42 | Vitest — db-path resolution contract, filter semantics, and planner param/date-label helpers |
| E2E | `bun run build && bun run test:e2e` | 35 | Playwright drives the production standalone server on :3100 with its own seeded DB |
| Smoke | `bun run build && ./scripts/smoke-test.sh` | 27 | Boots a fresh production server and exercises the whole API surface |

The full pre-push gate is `lint → typecheck → test → build → smoke → e2e` (see `AGENTS.md`).

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | — | Liveness probe |
| `/api/auth/login` | POST | — | Credential check → session cookie (rate-limited: 10/IP/15 min) |
| `/api/auth/logout` | POST | ✔ | Clears the session |
| `/api/auth/me` | GET | ✔ | Current session payload |
| `/api/places` | GET | ✔ | Places with per-user `saved` flags (`?category=eat\|stay\|do`) |
| `/api/places/[slug]` | GET | ✔ | One place |
| `/api/favourites` | GET / POST / DELETE | ✔ | List / save / unsave |
| `/api/bookings` | GET / POST | ✔ | List / create (guests clamped server-side) |

All responses use the envelope `{ ok: true, data } | { ok: false, error }`.

## Design System

Re-measured from the live app session 3 (`src/app/globals.css` `@theme`):

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cream` | `#F8F7F4` | Page canvas (footer matches) |
| `--color-cream-deep` / `--color-surface2` | `#F2F1EE` | Raised cream surfaces, tag pills |
| `--color-ink` | `#0E0E0E` | Primary text, black buttons, map markers |
| `--color-secondary` | `#3A3A3A` | Body copy |
| `--color-muted` | `#888580` | Muted meta text |
| `--color-line` | `#E8E6DC` | Navbar bottom border |
| `--color-border` | `#DDDBD5` | Card hairlines |
| `--color-roam` | `#571AFF` | Learn More / Book Now accent, active map marker, selection |
| `--color-roam-deep` | `#4A0FE0` | Accent hover/pressed |
| `--color-electric` | `#4D61FF` | The home "Highlighted Restaurants" blue band |

Typography: **Libre Baskerville** (serif display — every h1/h2, with per-section `clamp()` scales measured at 1280/768/390) + **Inter** (UI sans AND nav links — the live app dropped Poppins in its session-3 redesign; the legacy `.font-poppins` utility now maps to Libre Baskerville), all via Google Fonts. VIEW ALL pills are near-black `#141413` on the glass category cards. Motion respects `prefers-reduced-motion`. Map markers are 16px black dots with a white ring (22px violet when active); popups follow the app's radius scale.

## Deployment

Single-process standalone build + SQLite — no Docker or external services required. Full guide (absolute `DATABASE_URL`, reverse proxy, updating, troubleshooting): [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

```bash
bun run build
bun run start        # NODE_ENV=production bun .next/standalone/server.js
```

## Project Status

| Phase | Status | Key Deliverables |
|-------|--------|------------------|
| Reference analysis | ✅ Complete | Live app explored; entity data captured (12 eat / 12 stay / 18 do); design tokens measured |
| Application build | ✅ Complete | Full route group, API surface, Leaflet map, auth, seed |
| Mobile navigation fix | ✅ Complete | Tailwind v4 failure classes addressed + E2E-pinned (5 classes, 8 checks) |
| Verification | ✅ Complete | lint ✓ typecheck ✓ 42 unit ✓ 35 E2E ✓ 27 smoke ✓ |
| Documentation | ✅ Complete | AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md, 14 screenshots |
| Session 2 remediation | ✅ Complete | Live-app parity pass — fonts/logo/hero, home showcase (route, blue restaurants, stays, sights, footer, legal pages), env pinning; gates re-verified (32 unit · 27 smoke · 35 E2E) |
| Session 3 remediation | ✅ Complete | Live-app re-measure (14 findings, `docs/remediation-plan-session-3.md`): tokens `#F8F7F4/#0E0E0E/#571AFF`, Poppins→Inter nav, flat-white desktop navbar + cream-glass mobile tab-bar, TripPlanner + DateRangePicker routing into browses, redesigned eat/do/stay cards, sticky-route redesign, booking-request form + schema fields, 9 demo map places, profile redesign; gates re-verified (42 unit · 27 smoke · 35 E2E) |
| Session 4 recovery | ✅ Complete | Interrupted-hand-off repair (`docs/remediation-plan-session-4.md`): restored the deleted `(app)` route-group layout (auth gate + Navbar), home page, and `/api/auth/login` route (orphaned duplicate at `/api/auth` removed); live-app parity re-verified (mobile 390px chrome matches reference); 14 screenshots refreshed; all gates green (42 unit · 27 smoke · 35 E2E) |

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Error code 14: Unable to open the database file` | Server started outside the repo, or a stray parent `.env` injected an absolute `DATABASE_URL` | Start via `bun run start` / `bun run dev` (both pin the URL); set an absolute `file:` URL in production |
| Standalone server uses the wrong database after a rebuild | Turbopack's production minifier mis-compiles multi-return path helpers | Already mitigated — `src/lib/db-path.ts` uses single-exit forms; keep them that way |
| Login rejected with 429 | Rate limiter (10 attempts/IP/15 min) | Wait for `Retry-After` or restart the process (in-memory buckets) |
| Logins loop back to `/login` after a restart | `AUTH_SECRET` changed between restarts | Keep the secret stable |

## Contributing

- TDD where a pure seam is involved: extend `tests/*.test.ts` first (RED), implement (GREEN), refactor.
- Tailwind v4: CSS-first — add tokens to `@theme` in `src/app/globals.css`, never a `tailwind.config.*` file.
- React 19: no `forwardRef`; server components by default.
- Conventional Commits, `main` only, push via `docs/ssh_git_wrapper_v3.py` (runbook in `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`).
