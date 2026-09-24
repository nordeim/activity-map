# Session 4 — Remediation Plan (interrupted-session recovery + parity re-verification)

Date: 2026-09-24 · Base commit: `bfb14b5` (main) · Agent: Super Z (session 4)

## 1. Context

Session 3 completed the WS1–WS8 parity remediation and committed locally (`853414b`), but the push
never happened (the deploy key was absent that day). The remote instead received two owner commits
(`22342d5`, `d6c64b3` — both "remeditation round 3") plus `bfb14b5` ("update session logs", which
added `docs/session_3.md`). The owner's commit `d6c64b3` carried most session-3 source changes but
**deleted three load-bearing files** — the interruption this session inherits.

## 2. Findings (all verified by execution, not inspection alone)

| # | Severity | Finding | Evidence |
|---|----------|---------|----------|
| F1 | **Critical** | `src/app/(app)/page.tsx` (the home page) is deleted → `/` returns **404** | `curl http://localhost:3000/ → 404`; build output has no `/` route |
| F2 | **Critical** | `src/app/(app)/layout.tsx` is deleted → no auth gate (unauthenticated visits crash with `user!.uid` on a null user → **500**) and no Navbar chrome on any page | `curl /eat → 500`; Navbar component exists but `rg Navbar src/` shows zero call sites |
| F3 | **Critical** | `src/app/api/auth/login/route.ts` is deleted; an orphan `src/app/api/auth/route.ts` holds a **byte-identical** copy at the wrong path. LoginForm, `tests/e2e/auth.setup.ts`, `auth.spec.ts`, and `scripts/smoke-test.sh` all POST `/api/auth/login` → **404**, so login is broken end-to-end | `curl -X POST /api/auth/login → 404`; `diff` of the two files: identical |
| F4 | Info (false alarm, verified) | Suspicious grid template classes (`lg:grid-cols-inmax(0,420px)…`) turned out to be a **terminal display artifact**: the `[m` in the canonical `grid-cols-[minmax(…)]` is stripped when bash renders output (an ANSI-reset-like sequence). Byte-level hex dumps of `HighlightedRestaurants.tsx:39` and `TripPlanner.tsx:84` confirm both classes are the canonical well-formed `grid-cols-[minmax(…)]`, and the generated CSS rule `grid-template-columns:minmax(0,420px) minmax(0,1fr)` is correct. No change needed — and no change made (guardrail against display-mangling false positives: verify with hex dumps, never terminal echo) | Python `content.find(b'grid-cols-inmax') → -1`; hex `…636f6c732d5b6d696e6d6178…` decodes `cols-[minmax` |
| F5 | Info | `.env` / `.env.example` already carry `DATABASE_URL="file:../db/custom.db"`; `db/` recreated at the repo root and seeded (42 published + 27 home-only + 9 map-demo + demo user) | `bunx prisma db push` + seed output |
| F6 | Info | `vitest.config.ts` (42 checks) and `playwright.config.ts` (35 checks, standalone :3100, own `db/e2e.db`) are present and functional — the "add vitest and playwright" instruction is satisfied by validating them, not re-adding | `bun run test → 42 passed` |
| F7 | Info | Sandbox env traps reappeared (parent `.env` + shell `DATABASE_URL` absolute path). Parent `.env` neutralized (session-2 fix); npm scripts pin the URL inline so the runtime is safe | `cat /home/z/my-project/.env` after neutralization |

Live-app parity spot-check (login re-verified 2026-09-24): the reference still renders the
session-3 chrome — 390px fixed 52px cream-glass tab-bar with 8 links (logo, Highlights, Eat,
Stay, Do, Map, Favourites, Profile), Inter nav font, ink `rgb(14,14,14)` — matching the clone's
Navbar contract (`tests/e2e/mobile-navigation.spec.ts`). No new live redesign to chase.

## 3. Root cause

The interrupted hand-off: session 3's local commit was never pushed; the owner re-pushed the work
as two manual commits and, in the process, the route-group layout, the home page, and the login
route handler were dropped (the login handler surviving only as a renamed duplicate at
`/api/auth`). Everything else — 16 client components, lib seams, prisma data, all 42 unit and
35 E2E checks — is intact at `bfb14b5`, so the remediation is a **surgical restoration**, not a
rebuild.

## 4. Plan (TDD — the existing suites are the RED tests)

The E2E suite cannot even authenticate right now (`auth.setup.ts` POSTs `/api/auth/login` → 404),
and the mobile-navigation spec's `beforeEach` navigates to `/` → 404. Those failures are the
reproduced defect; the same probes must go green after the fix.

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | Restore the login route at the documented path and delete the orphan duplicate | `src/app/api/auth/login/route.ts` (restore), `src/app/api/auth/route.ts` (delete) | `curl -X POST /api/auth/login → 200` + cookie; smoke checks 2–3 |
| R2 | Restore the auth-gating app layout (session redirect + Navbar) | `src/app/(app)/layout.tsx` (restore from `22342d5`) | logged-out `/eat` redirects to `/login` (no 500); Navbar visible after login |
| R3 | Restore the home page (hero, category cards, route, restaurants, stays, sights, footer) | `src/app/(app)/page.tsx` (restore from `22342d5`) | `/ → 200`; `home.spec.ts` 8 checks; `browse.spec.ts` home block |
| R4 | ~~Normalize grid template classes~~ **Resolved as no-op** — hex-dump verification proved the classes are already canonical; the "malformation" was terminal display mangling | none (no change) | n/a — documented as the F4 false-alarm lesson |
| R5 | Full gate re-run on the exact tree | lint → typecheck → 42 unit → build → 27 smoke → 35 E2E | all green |
| R6 | Mobile-navigation verification at 390px (Tailwind v4 failure classes A–E) | dev server + agent-browser | no horizontal overflow (`scrollWidth == 390`), nav links tap-navigate, bar x=0/w≤390 |
| R7 | Refresh `docs/screenshots/` (14 captures) from the remediated dev server | `docs/screenshots/*.png` | files refreshed, non-blank (variance check) |
| R8 | Documentation alignment: README project-status row, AGENTS command table (unchanged paths), worklog session-4 entry, `docs/session_4.md` log | root docs + worklog | no stale references |
| R9 | Commit (main only, Conventional Commits) + SSH-wrapper push | `docs/ssh_git_wrapper_v3.py` | remote `refs/heads/main` == local HEAD |

## 5. Risks & guards

- **Do not "improve" the restored files**: they are the session-3-verified implementations; the
  E2E suite pins their contracts (e.g. `grid-cols-1` on the restaurants band is the mobile
  overflow guard — keep it).
- **Tailwind v4**: keep CSS-first (`@theme` in `globals.css`); no `tailwind.config.*`; keep the
  explicit `rgba(...)` utilities in Navbar (α-modifiers compile to `color-mix()`).
- **Env traps**: keep the inline `DATABASE_URL` pins in `dev`/`start`/`db:push`/`db:seed`; the
  parent `.env` stays neutralized; never commit `.env` or `db/*.db`.
- **E2E rate limiter**: one shared login via `auth.setup.ts` (storageState) — never per-test.
