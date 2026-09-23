---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# ROAM — Augsburg City Guide

A production-grade, self-hosted clone of `activity-map.base44.app`: an authenticated city guide for Augsburg with a trip-planner home page, Eat / Stay / Do browse views, place detail with booking, an interactive Leaflet map, favourites, and a profile with trips and bookings. Maintained by nordeim; cloned and rebuilt to be locally deployable with zero external services.

**Tech Stack**: Next.js 16 (App Router, standalone output), React 19, TypeScript 5, Tailwind CSS 4 (CSS-first), Prisma 6 + SQLite, Leaflet, Vitest, Playwright. Fonts: Libre Baskerville (display serif) + Inter (UI sans AND nav — re-measured session 3; the live app dropped Poppins).

## Core Identity & Purpose

ROAM solves one problem: the reference trip-planning app is locked behind a hosted platform. This repo reproduces it — every view, the measured filter semantics, the visual design tokens, and the 42 seeded places captured from the live app plus its 27 home-only showcase rows (route, sights, restaurants) and 9 map-demo rows — as a single Next.js application with cookie-session auth and a SQLite store, so it runs anywhere with `bun install && bun run db:push && bun run db:seed`.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** — Never make surface-level assumptions; measure the reference behavior (screenshots, DOM, pixel sampling) before coding.
2. **PLAN** — Create a detailed plan with sequential phases; present for confirmation.
3. **VALIDATE** — Obtain explicit approval before implementation.
4. **IMPLEMENT** — Modular, testable components; document alongside code.
5. **VERIFY** — Run the full gate (lint → typecheck → unit → build → smoke → E2E) before delivery.
6. **DELIVER** — Complete handoff with instructions.

### Project-Specific Principles

- **Fidelity to the measured reference**: design tokens, chip semantics, and mobile chrome come from the live app, not invention. When in doubt, re-measure.
- **Zero-config local story**: SQLite + file-based sessions; no Redis, no external auth, no CI dependency.
- **Pure seams are unit-tested**: display and resolution logic lives in `src/lib/*` pure functions with Vitest coverage, not inline in components.

## Implementation Standards

### Next.js 16 Specific

- App Router conventions (`src/app/`); Server Components by default, `"use client"` only for interactivity (the 16 client components: LoginForm, Navbar, Hero, RecommendedRoute, HighlightedRestaurants, CategoryExplorer, PlaceCard, StayCard, SaveButton, BookingForm, TripPlanner, DateRangePicker, MapExplorer, LeafletCanvas, FavouritesView, ProfileView).
- Route handlers for the API surface (`src/app/api/**/route.ts`), `export const dynamic = "force-dynamic"` on session-scoped routes.
- Leaflet mounts through `next/dynamic` with `ssr: false` — `react-leaflet` in a server component crashes the build.
- Remote images restricted via `next.config.ts` `remotePatterns` (`media.base44.com`, `z-cdn.chatglm.cn`).

### TypeScript

- `strict: true` with one intentional exception: `noImplicitAny: false`. Prefer `unknown` over `any` in new code anyway.
- Path alias `@/*` → `src/*` (tsconfig + vitest both configure it).
- API payloads are typed by `src/types/index.ts` (`PlaceDTO`, `BookingDTO`, `PlaceCategory`) — serialize at the boundary in `src/lib/places.ts`, never leak Prisma rows.

### Tailwind CSS 4

- **CSS-first configuration — there is NO `tailwind.config.*`.** Tokens are `@theme` variables in `src/app/globals.css` (re-measured session 3): `--color-cream #F8F7F4`, `--color-cream-deep`/`--color-surface2 #F2F1EE`, `--color-ink #0E0E0E`, `--color-roam #571AFF`, `--color-electric #4D61FF` (the live home's blue band), `--color-secondary #3A3A3A`, `--color-muted #888580`, `--color-line #E8E6DC`, `--color-border #DDDBD5`, `--font-sans` (Inter), `--font-serif` (Libre Baskerville — the live app's display serif), `--font-nav` (Inter — the live app dropped Poppins), `--shadow-card/-float/-hero`, `--radius-4xl`.
- Custom primitives are `@utility` definitions: `bg-grid`, `no-scrollbar`, `hero-shade`.
- Mobile navigation is the known v4 hazard — failure classes (no-nav / invisible / clipped / under-layer / breakpoint mismatch) are regression-pinned by `tests/e2e/mobile-navigation.spec.ts`. The Navbar's `no-scrollbar` overflow safety valve must stay.
- Mobile chrome (measured session 3): below `md`, a fixed-top cream-glass tab-bar (52px, ≤430px centered, text-only 16px Inter links, MapPin/Heart/User right icons; the home hero slides under the glass); from `md`, a sticky transparent header wrapping the full-width white `h-14` bar (border-b `#E8E6DC`, icon+text links, active `rgba(14,14,14,0.08)` pill, hide-on-scroll choreography). Do not "fix" the asymmetry.

### React 19

- No `forwardRef`; function components with props.
- State: local `useState`/`useMemo` only — no Zustand, no React Query, no server actions. Navigation refreshes via `router.refresh()` after mutations (favourites, bookings) so server components re-render with fresh data.

## Development Workflow

### Environment Setup

```bash
bun install
cp .env.example .env
bun run db:push     # apply schema (db push — no migrations folder)
bun run db:seed     # 78 places (42 published + 27 home-only + 9 map-demo) + demo user (wipes domain tables)
bun run dev         # http://localhost:3000
```

Demo login: `sepnetflix2023@outlook.com` / `$Abcd1234`.

### Build Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Development server (port 3000, pinned `DATABASE_URL`) |
| `bun run build` | Production build + standalone assembly |
| `bun run start` | Production standalone server |
| `bun run lint` | ESLint (next core-web-vitals + typescript) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Vitest unit suite (42 checks) |
| `bun run test:e2e` | Playwright E2E (35 checks; requires a build) |
| `bun run db:push` / `db:generate` / `db:seed` | Prisma schema / client / seed |

### Database (Prisma)

```bash
bunx prisma generate    # regenerate client after schema edits
bun run db:push         # schema → SQLite (no migrations folder by design)
bun run db:seed         # idempotent: wipes + reseeds domain tables
```

Schema changes go through `db push`, never `prisma migrate` — `prisma/migrations/` intentionally does not exist.

## Testing Strategy

### Test Pyramid

- **Unit (Vitest, 42 checks)**: pure seams — `tests/db-path.test.ts` (17: SQLite URL resolution contract, quote-stripping, standalone anchors), `tests/filters.test.ts` (15: chip AND-composition, special chips, search haystack), and `tests/planner.test.ts` (10: planner query params, browse-target routing, date-range label formatting).
- **E2E (Playwright, 35 checks)**: boots the PRODUCTION standalone server on :3100 against its own `db/e2e.db` (schema-pushed + seeded by the global setup). Suites: `auth.spec.ts` (logged-out surface + login flow), `browse.spec.ts` (planner submit → category params, sticky planner pill, redesigned cards, detail booking-request round-trip, favourites round-trip, map 9 demo places, profile tabs), `home.spec.ts` (glass planner + category-card glass/black VIEW ALL, sticky Recommended Route, blue restaurants, stay showcase, sights, footer, home-place detail resolution, browse purity), `mobile-navigation.spec.ts` (the five v4 failure classes + tap navigation at 390 / 640 / 1280).
- **Smoke (bash, 27 checks)**: `./scripts/smoke-test.sh` against a fresh production server — health, auth, rate limiting, places, favourites, bookings, 404s.

### Test Commands

```bash
bun run test        # 42 unit checks
bun run build && bun run test:e2e   # 35 E2E checks
bun run build && ./scripts/smoke-test.sh   # 27 smoke checks
```

### Testing Rules

- E2E auth is shared: the `setup` project signs in once into `tests/e2e/.auth/user.json` (storageState) — per-test logins would trip the 10/15-min rate limiter. `auth.spec.ts` opts out with an empty storageState deliberately.
- Extend `tests/filters.test.ts` when changing `src/lib/filters.ts`; extend `tests/db-path.test.ts` when changing `src/lib/db-path.ts`; extend `tests/planner.test.ts` when changing `src/lib/planner.ts`. These contracts are the point, not the coverage number.
- Playwright runs single-worker (`workers: 1`) — the specs share one seeded SQLite file. Don't parallelize without isolating databases.

## Code Quality Standards

### Linting & Formatting

```bash
bun run lint && bun run typecheck
```

`eslint.config.mjs` extends `next/core-web-vitals` + `next/typescript` with several `@typescript-eslint` rules relaxed (scaffold default — match the existing style rather than re-tightening mid-feature). ESLint and tsconfig exclude `skills/`.

## Git & Version Control

### Branching Strategy

- `main` only — no feature branches.

### Commit Standards

- Conventional Commits: `feat: …`, `fix: …`, `docs: …`; atomic commits.
- Never commit `.env`, `*.key`, `db/*.db`, `node_modules/`.
- Push through the SSH wrapper from the repo root: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo> --remote git@github.com:nordeim/activity-map.git` (runbook: `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`). The gate order in AGENTS.md is the precondition.

## Error Handling & Debugging

### Error Handling Approach

- API failures return `{ ok: false, error: "<message>" }` with real status codes (401 unauthenticated, 400 validation, 404 unknown place/booking, 429 rate-limited) — never a bare 500 for domain errors.
- Client components degrade gracefully: the map filters to a no-results state, booking clamps guests to `minParty`/`maxParty`, the favourites empty state renders an illustration + CTA (reference parity).
- `resolveDatabaseUrl` never throws on odd input — it normalizes (quote-stripping, absolute-path passthrough) and falls back to the documented default.

### Debugging Tools

- `DEBUG_DBPATH=1` env prints every db-path anchor candidate and schema check to the server log — the first stop for SQLite `Error code 14`.
- `dev.log` / `server.log` capture dev/production stdout via the npm scripts' `tee`.
- E2E failures retain traces and screenshots (`trace: "retain-on-failure"` in `playwright.config.ts`).

## Communication & Documentation

- Explain "why", not just "what": measured values cite their source (reference screenshot, DOM query, pixel sample).
- `AGENTS.md` is the compact operator file; `Project_Architecture_Document.md` is the full engineering reference; `docs/DEPLOYMENT.md` covers production; `docs/Tailwind-V4-Validation-Report.md` records the v4 findings; `docs/screenshots/` holds the production captures.

## Project-Specific Standards

### Architecture

- **Auth gate at the layout**: `src/app/(app)/layout.tsx` resolves the session server-side and redirects to `/login`; `/login` and `/api` are the only public surfaces. Every route handler re-checks `getSessionUser()`.
- **Category pages are server components** that query Prisma (`src/lib/places.ts`) and hydrate `CategoryExplorer` (client) with DTOs; the explorer owns search + chip state in the URL-free local state. The shared `TripPlanner` renders as the Hero's glass pill (home) and the browse sticky white pill (pre-filled from `searchParams`: `people`/`start_date`/`end_date`); its submit routes to the category pages with those params and the grids date-filter accordingly.
- **MapExplorer** (client) receives the 9 `status: "map"` demo places (the live app's map is a hardcoded array, not entity-fed), owns the category pills + search, and mounts `LeafletCanvas` via `next/dynamic({ ssr: false })`.

### API Design

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Liveness probe (public) |
| `/api/auth/login` | POST | Rate-limited credential check → session cookie |
| `/api/auth/logout` | POST | Clears the session cookie |
| `/api/auth/me` | GET | Current session payload |
| `/api/places` | GET | All places (optional `?category=eat\|stay\|do`), per-user `saved` flags |
| `/api/places/[slug]` | GET | One place by slug |
| `/api/favourites` | GET / POST / DELETE | List / save / unsave (auth required) |
| `/api/bookings` | GET / POST | List / create bookings, guests clamped server-side (auth required) |

### Database / Data Layer

- Models: `User`, `Place` (category eat/stay/do + JSON-array string columns), `SavedPlace` (unique per user+place), `Booking` (status confirmed/cancelled + the session-3 request-form fields `name`/`surname`/`time`/`phone`/`email`/`message`). See `prisma/schema.prisma`.
- `import { db } from "@/lib/db"` — the Prisma singleton with runtime URL resolution. **Never construct `PrismaClient` directly**: the standalone server's SQLite path depends on `src/lib/db-path.ts` anchor logic.
- Seed data (`prisma/data/{eat,stay,do,home,map}.json`) was captured from the live app's entity API (the home/map files mirror the live page's showcase and hardcoded-map arrays); browse-row coordinates are deterministic per neighborhood (see `prisma/seed.ts`).

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | SQLite `file:` URL (relative → resolved against `prisma/schema.prisma`) or PostgreSQL string | `file:../db/custom.db` |
| `AUTH_SECRET` | HMAC key for session cookies — **required in production** (`openssl rand -hex 32`) | 64-hex string |
| `NEXT_PUBLIC_SITE_URL` | Reserved canonical-origin slot (scaffold) | `http://localhost:3000` |

## Anti-Patterns to Avoid

- **Multi-return helper functions in `src/lib/db-path.ts`** — the Turbopack production minifier demonstrably drops a `return` in that shape; keep single-exit forms.
- **Plain-CWD SQLite resolution** — the Next tracer copies `prisma/schema.prisma` into `.next/standalone`; never resolve against `process.cwd()` alone.
- **Importing `react-leaflet` outside the dynamic, `ssr: false` boundary** — instant build crash.
- **Per-test logins in E2E** — trips the rate limiter; use the shared storageState.
- **A `tailwind.config.*` file** — Tailwind v4 here is CSS-first; the config file would silently split the theme.
