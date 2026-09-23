# AGENTS.md — ROAM (Augsburg City Guide)

Single Next.js 16 App Router app that clones `activity-map.base44.app`: an auth-gated city guide with a trip-planner home page, Eat / Stay / Do browse views with measured filter chips, place detail with booking, a Leaflet map view, favourites, and a profile with trips + bookings. Prisma/SQLite persistence, cookie-session auth. Clone remote: `https://github.com/nordeim/activity-map.git`; pushes go to the SSH remote via `docs/ssh_git_wrapper_v3.py`.

## Commands

| Task | Command |
|------|---------|
| Install | `bun install` (or `npm install`) |
| Dev server (port 3000) | `bun run dev` |
| Production build | `bun run build` |
| Production server | `bun run start` |
| Lint | `bun run lint` |
| Type check | `bun run typecheck` |
| Unit tests (32 checks) | `bun run test` |
| Browser E2E (27 checks; needs a build) | `bun run test:e2e` |
| Prisma client after schema change | `bunx prisma generate` |
| Recreate DB from schema | `bun run db:push` |
| Seed the guide (42 places + demo user) | `bun run db:seed` |
| End-to-end smoke suite (27 checks; needs a build) | `./scripts/smoke-test.sh` |

**Gate order before every push:** `bun run lint` → `bun run typecheck` → `bun run test` (32) → `bun run build` → `./scripts/smoke-test.sh` (27, all must pass) → `bun run test:e2e` (27 Playwright checks — boots the standalone server on :3100 against its own `db/e2e.db`). There is no hosted CI; the local gate is the only gate.

First-run setup: `bun install && cp .env.example .env && bun run db:push && bun run db:seed && bun run dev`. Demo login: `sepnetflix2023@outlook.com` / `$Abcd1234` (the reference app's account, seeded locally).

## Architecture facts you would otherwise guess wrong

- **Everything except `/login` and `/api` lives in the `src/app/(app)/` route group**, whose `layout.tsx` resolves the session server-side and `redirect("/login")`s unauthenticated visitors. `/login` is a real route (server component) that bounces authenticated visits back to `/`. Do not add unguarded pages outside the group.
- **The API envelope is `{ ok: true, data } | { ok: false, error: "<message>" }`** with real HTTP status codes (401/400/404/429/201). Follow the existing route handlers' shape; do not introduce a nested error object.
- **Auth is hand-rolled** (`src/lib/auth.ts`): scrypt password hashes + HMAC-SHA256-signed stateless cookie `roam_session` (7-day TTL, httpOnly/lax, secure in production, keyed by `AUTH_SECRET`). `getSessionUser()` guards every route handler and the app layout. No NextAuth, no JWTs, no middleware. Login is rate-limited (`src/lib/rate-limit.ts`): 10 attempts/IP/15 min fixed window → `429` with `Retry-After`; in-memory, single-node only.
- **Auth navigation uses `router.refresh()`, not `window.location`** — login success and logout re-resolve the session server-side so the shell swaps without a full reload.
- **SQLite path normalization (`src/lib/db-path.ts`) is load-bearing.** A RELATIVE `file:` DATABASE_URL resolves against the first anchor directory carrying `prisma/schema.prisma` — like the Prisma CLI — so `file:../db/custom.db` means `<repo>/db/custom.db` regardless of CWD. Three traps are already solved; don't reintroduce them: (1) `next build` copies `prisma/schema.prisma` into `.next/standalone`, so a plain CWD rule would resolve against BUILD OUTPUT — `candidateRoots()` skips standalone subtrees and upgrades an in-repo standalone anchor to the repo root; (2) the **Turbopack production minifier mis-compiles multi-return helpers** (it dropped a `return repo` in a multi-return variant, silently) — `standaloneRepoRoot()` and friends are single-exit ON PURPOSE, keep them that way; (3) some `.env` loaders pass quotes through — `resolveDatabaseUrl` strips them. Contract pinned by `tests/db-path.test.ts` (17 checks). Always `import { db } from "@/lib/db"`; never construct `PrismaClient` directly.
- **The dev/start/smoke scripts pin `DATABASE_URL` explicitly.** A stray parent-directory `.env` with an absolute path once hijacked the runtime — keep the pinning.
- **Standalone server must start from the project root** (`output: "standalone"` in `next.config.ts`). npm/bun scripts guarantee the working directory; running `server.js` from elsewhere breaks SQLite resolution.
- **Schema changes use `db push`, not migrations** (`prisma/migrations/` does not exist). `bun run db:seed` is idempotent — it wipes and reseeds domain tables from `prisma/data/{eat,stay,do}.json` (the 12+12+18 places captured from the live app) with deterministic per-neighborhood coordinates.
- **Server Components by default; `"use client"` only where interactivity demands it** (the 11 client components: LoginForm, Navbar, Hero, CategoryExplorer, PlaceCard, SaveButton, BookingForm, MapExplorer, LeafletCanvas, FavouritesView, ProfileView). Category pages are server components that query Prisma directly and hydrate the client explorer.
- **Leaflet must never render on the server** — `MapExplorer` mounts `LeafletCanvas` through `next/dynamic` with `ssr: false`. Importing `react-leaflet` in a server component crashes the build.
- **Tailwind v4 is CSS-first: there is NO `tailwind.config.*`.** Design tokens live in `src/app/globals.css` under `@theme` (`--color-cream/-ink/-roam`, `--font-sans/-serif`, shadows, `--radius-4xl`) plus `@utility` primitives (`bg-grid`, `no-scrollbar`, `hero-shade`). Extend the theme there, not in a config file. The known v4 mobile-nav failure classes (no-nav / invisible / clipped / under-layer / breakpoint mismatch) are regression-pinned by `tests/e2e/mobile-navigation.spec.ts`; the Navbar keeps the `no-scrollbar` horizontal overflow as a safety valve — don't remove it.
- **Mobile chrome differs from desktop by design** (measured from the reference): below `sm` the navbar is a full-width flat top bar with TEXT-ONLY links (icons hidden), Map folded into the right-cluster pin; from `sm` up it becomes the floating white pill with icons + avatar chip. Don't "fix" the asymmetry.
- **Filter chips are data-measured, not invented** (`src/lib/filters.ts`): eat gets four special chips (Open now / Near me / Under €100 / Trending) plus tag chips; stay/do chips literally mirror the reference entities' tags. Chips AND-compose; the text query matches name/neighborhood/sub-category/description/tags. Pure seam — extend `tests/filters.test.ts` when you extend it.
- **Remote images are limited to `media.base44.com` and `z-cdn.chatglm.cn`** (`next.config.ts` `remotePatterns`) — the reference app's media CDN. Add hosts there, never `unoptimized`.
- **TypeScript is strict except `noImplicitAny: false`** (kept intentionally). `tsconfig.json` and ESLint both exclude `skills/`.

## Conventions that differ from defaults

- Prices format via `src/lib/utils.ts` (`formatPrice` en-IE EUR, `priceRangeSymbols` 1–4 → €..€€€€, `formatDuration` minutes → "2 h"). Don't hand-roll display formatting in components.
- Place rows store JSON arrays in plain string columns (`vibeTags`, `galleryImages`, …) — SQLite has no array type; `toPlaceDTO` in `src/lib/places.ts` is the only sanctioned parser, and every API payload uses the `PlaceDTO` shape from `src/types/index.ts` (including the per-user `saved` flag).
- Bookings clamp guests to the place's `minParty`/`maxParty` server-side; the profile view groups bookings with place names client-side.
- E2E auth is shared: the Playwright `setup` project signs in ONCE into `tests/e2e/.auth/user.json` (storageState) because per-test logins would trip the rate limiter. `auth.spec.ts` opts out with an empty storageState to test the logged-out surface.

## Git

- **`main` only.** No feature branches.
- Conventional Commits: `feat: …`, `fix: …`, `docs: …`.
- Never commit `.env`, `*.key`, `db/*.db`, or `node_modules/` (all gitignored).
- Push through the SSH wrapper from the repo root: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo> --remote git@github.com:nordeim/activity-map.git` — runbook: `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.
