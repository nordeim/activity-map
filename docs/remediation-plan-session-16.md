# Session 16 — Remediation Plan (deployed-mirror + live-source dual audit → profile chrome-less redesign, map list parity, planner/category-card geometry)

Date: 2026-09-26 · Base commit: `e2742df` (main) · Agent: Super Z (session 16)

## 1. Context

Session 14 achieved deployed-mirror parity and pushed (`9d42848` + `04558d7`); the owner added
`docs/session_15.md` (the previous agent's narration) and the start-server-log update (`e2742df`)
— the deployed mirror was rebuilt and restarted WITH the session-14 code. Baseline on the
untouched tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓ **54/54 E2E** ✓; `db/` at the repo root;
`.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"`); vitest + playwright
configs functional.

The deployed mirror `https://activity-map.jesspete.shop/` is UP and serving the session-14
code (verified: profile h1 "sepnetflix2023", column-major stay grid 381px, text-only map
list). This session ran the full browser audit against BOTH the deployed clone and the live
source `https://activity-map.base44.app/` (logged in with the demo account, DOM audits at
1280/390 via agent-browser).

**Deployed-mirror functional audit (all green):** every page loads with zero console errors;
the mobile navbar works end-to-end (52px fixed cream-glass tab-bar, icon x-positions
304/330/356 identical to the live, fixed positioning survives scroll, tap navigation moves
the active state, no horizontal overflow at 390); the desktop floating pill is exact
(820×56 at x=230, radius 999, #E8E6DC border, 13px links, active 700 ink / inactive 500
#555550); the favourites save/unsave round-trip works; the booking round-trip works (request
persisted + visible under Profile → My bookings). No Tailwind v4 mobile-nav failure classes.

Non-gaps re-verified against the live (within tolerance): eat heading (h1 y=168/169, x=32,
55px, subtitle 14px rgb(58,58,58)), browse chips (38px/12px, identical labels), browse cards
(390/392 × 562), map chrome (41px pills, 618/620px canvas, full-width search), favourites
heading (h1 y=244/245, scoped 18px overlay 299/287), place detail (h1 y=225/229, form card
rounded-28 hairline no-shadow, Book Now 18px, single-column 44px fields), stay showcase
(column-major, 381px cards at x=51, row 1 = Courtyard | Maison | Velvet), sights (360px at
x=80), hero (h1 x=24 both breakpoints, y=203/290, 591px mobile photo), route stops
(text-only, 0 imgs), restaurants band (3680px), login chrome (E2E-pinned).

## 2. Findings (verified by DOM measurement on the live app, 2026-09-26)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The profile page has NO app chrome** — no navbar at any breakpoint, no footer; the only controls are the floating Back + Sign out buttons | `/profile` DOM contains ZERO `header`/`nav`/`footer` elements (mobile 390 AND desktop 1280); every other page (home/eat/stay/do/map/favourites/place) keeps the full chrome; VLM screenshot check confirms | The clone renders the Navbar + SiteFooter on /profile via the `(app)` layout |
| F2 | **High** | **The profile page carries a FULL-PAGE graph-paper grid texture** | `div.pointer-events-none fixed inset-0 opacity-40` with `linear-gradient(rgba(20,20,19,0.055) 1px, transparent 1px)` × 2 at `18px 18px` — covers the entire viewport behind the cards | Plain cream page (the component comment explicitly says "no grid") |
| F3 | **High** | Profile page geometry | outer `min-h-screen px-5 pb-24 pt-10 md:px-8 md:pt-16` → main `relative mx-auto max-w-4xl` (896) with direct children: back row at y=64 (`Go back` button 44×44 + `Sign out` 114×46, both `bg-white/80`, radius 999, pad 12/16) → identity section y=142 (pad 32, rounded-36, h=334) → bookings section (mt-8, rounded-32, pad 28); h1 y=203 desktop / y=167 mobile | main `min-h-[calc(100dvh-84px)] px-4 pb-20 pt-8 sm:px-6 sm:pt-12` + inner `mx-auto max-w-[896px]` wrapper; back row at y=122; h1 y=258 desktop / 209 mobile |
| F4 | **Med** | Profile identity alignment + chip icons | identity text block `text-center md:text-left` (mobile: h1/email/chips/Saved-places all centered); chips carry lucide **map-pin / sun / heart** (Augsburg / 0 day streak / Explorer) | identity block is left-aligned at every breakpoint; chips carry map-pin / **flame** / **compass** |
| F5 | **Med** | Bookings count badge | the total booking count renders right-aligned beside "My bookings" (12px/600) | no count badge |
| F6 | **High** | Map "Places on the map" card layout — 4 rows with the neighborhood | card 397×119 (desktop) / 358×119 (mobile), pad 16, radius 24: (1) eyebrow row with the price JUSTIFIED right — eyebrow 12px/600 #555550 + price 13px #72706C; (2) title 15px/600 ink; (3) **neighborhood 12px #888580** | 3 rows: eyebrow, title, price below the title — missing the neighborhood line, price misplaced, card h=98 |
| F7 | **High** | Map list card eyebrow for do-places | the eyebrow is the SUB-CATEGORY uppercase: `LANTERN WALK` / `ROOFTOP MUSIC` / `ART WORKSHOP` (eats show `RESTAURANT`, stays `HOTEL`) | every do-place renders the generic `SIGHT` eyebrow |
| F8 | **Med** | Map list order (the live's hardcoded array) | brass-marble → ember-garden → cloud-nine → fuggerei-afterglow → orbit-osteria → canal-hideaway → perlach-sessions → saffron-radio → canal-studio (interleaved; the live's hrefs use the same `map-*` slugs) | seed order groups by category (all eats, then stays, then dos) |
| F9 | **Med** | Mobile planner card geometry | white card 358×124 at x=16 (16px viewport margins — WIDER than the px-6 hero content), radius 30, p-2, grid `gap-1` (4px) → date segment 258px | card 342 at x=24 (inherits the px-6 content padding), grid `gap-1.5` (6px) → date segment 244px |
| F10 | **Med** | Category cards: taller rows + View All hanging outside (desktop) | desktop glass card 263×231, pad 14/14/12, heading row 32px, rows container 156px (3 rows ≈46px, icon cells 34×35 radius 8, bg white/48); the View All (h=54, w=229, near-black #141413, radius 999) hangs BELOW the card's bottom edge (half-overlap); mobile card 306×227 **radius 24**, violet VA inside | desktop card 263×248, rows 36px, icon cells 28×28, VA inside at the card bottom; mobile card 306×230 radius 20 |
| F11 | — | Non-gaps / deliberate deviations (keep) | eat/map/favourites/detail/home surfaces as listed in §1; entity-ID place URLs; the restaurants desktop DOM carousel; slug URLs | unchanged |

## 3. Plan (TDD — update/extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **Profile page leaves the app chrome**: move `/profile` out of the `(app)` group into a new `(bare)` route group whose layout gates auth (same `getSessionUser` + redirect) but renders NO Navbar and NO SiteFooter | new `src/app/(bare)/layout.tsx`, move `src/app/(app)/profile/page.tsx` → `src/app/(bare)/profile/page.tsx` | mobile-navigation.spec.ts gains a profile-chrome check: no `nav[aria-label=Primary]`, no footer on /profile; the navbar still renders on every other page |
| R2 | **Profile page structure + full-page grid**: ProfileView main → `relative mx-auto max-w-4xl px-5 pb-24 pt-10 md:px-8 md:pt-16` (drop the inner 896 wrapper — children become direct main children); add the fixed full-page 18px grid overlay (`pointer-events-none fixed inset-0 opacity-40`, lines rgba(20,20,19,0.055), size 18×18) as the page's first element; Back button → `Go back` 44×44 `bg-white/80`; Sign out → 114×46 `bg-white/80` pad 12/16 | `src/components/profile/ProfileView.tsx` | browse.spec.ts profile tests: h1 y 195–212 at 1280 (live 203) and 160–175 at 390 (live 167); a fixed grid overlay with background-size 18px exists; back row tops the main |
| R3 | **Profile identity alignment + icons**: identity text block `text-center md:text-left`; the Saved-places button centers on mobile (`mx-auto md:mx-0`); chip icons → `Sun` (streak) and `Heart` (Explorer) | `src/components/profile/ProfileView.tsx` | browse.spec.ts: the identity block's text-align center at 390 / left at 1280; E2E chip text unchanged |
| R4 | **Bookings count badge**: render `bookings.length` right-aligned beside the "My bookings" h2 (12px/600) | `src/components/profile/ProfileView.tsx` | browse.spec.ts: the count element visible beside the h2 |
| R5 | **Map list cards → the live's 4-row layout**: card keeps `rounded-[24px] border-[rgba(14,14,14,0.08)] bg-white p-4`; row 1 = flex justify-between (eyebrow 12px/600 #555550 + price 13px #72706C); row 2 = title 15px/600 ink; row 3 = neighborhood 12px #888580 (falls back to "Augsburg") | `src/components/map/MapExplorer.tsx` | browse.spec.ts map test: card h ≈ 105–125, the neighborhood text present, price on the eyebrow row (same y within 6px), 0 imgs |
| R6 | **Map list eyebrow for do-places**: eyebrow = `eat→RESTAURANT`, `stay→HOTEL`, `do→subCategory.toUpperCase()` (LANTERN WALK / ROOFTOP MUSIC / ART WORKSHOP) | `src/components/map/MapExplorer.tsx` | browse.spec.ts: the three event eyebrows present, no "SIGHT" eyebrow |
| R7 | **Map list order → the live's interleaved array**: reorder `prisma/data/map.json` to brass-marble, ember-garden, cloud-nine, fuggerei-afterglow, orbit-osteria, canal-hideaway, perlach-sessions, saffron-radio, canal-studio | `prisma/data/map.json` | browse.spec.ts: the list's first three titles read Brass & Marble, Ember Garden, Cloud Nine Hotel |
| R8 | **Mobile planner card geometry**: the glass-variant TripPlanner widens past the hero's px-6 content at mobile (`-mx-2` → x=16, w=358) and the mobile grid gap → `gap-1` (4px) | `src/components/planner/TripPlanner.tsx`, possibly `src/components/home/Hero.tsx` | home.spec.ts: planner card x=16 w≈358 at 390; the mobile-nav planner-fit check stays green |
| R9 | **Category cards (desktop rows + hanging View All + mobile radius)**: desktop rows → `h-[46px]` with `gap-[9px]` (container 156px), icon cells → 34×35 `rounded-[8px]`, View All moves OUT of the glass card (absolute, hanging below the bottom edge, w-[229px] h-[54px], #141413, radius 999) with the row gaining bottom clearance; mobile cards → `rounded-[24px]`; the mobile VA stays inside (violet h-9) | `src/components/home/CategoryCards.tsx`, `src/app/(app)/page.tsx` (row clearance) | home.spec.ts: desktop card h 225–240 (live 231), rows container ≈156, icon cell 34×35, VA outside (VA bottom > card bottom); mobile card radius 24 |
| R10 | Full gates (lint → typecheck → 42 unit → build → 27 smoke → E2E) → side-by-side re-measure vs the live → refresh the 14 screenshots → docs (README/AGENTS/CLAUDE/PAD/SKILL/session log/worklog) → `.env.example` re-verify → single commit + SSH-wrapper push | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all changes via arbitrary values / existing tokens; no
  `tailwind.config.*`; the mobile-nav safety valve (`no-scrollbar` row, ≤62px wordmark span,
  five failure-class pins) untouched. The profile's grid overlay reuses the favourites
  overlay's exact arbitrary-value pattern (already proven against the v4 minifier).
- **R1 route-group move** keeps the URL `/profile` identical (route groups don't affect the
  URL path); the `(bare)` layout MUST re-check the session (same redirect contract as the
  `(app)` layout) — the auth gate cannot weaken. The `not-found`/metadata behavior is
  unchanged (page file moves with its `export const metadata`).
- **R7 seed reorder** requires `db:push` + `db:seed` reruns for the dev DB (the E2E
  global-setup reseeds `db/e2e.db` itself); the map MARKERS keep their real lat/lng (only
  the list/seed order changes); `listMapPlaces` ordering is seed-order-driven — verify no
  other consumer depends on the old order.
- **R8** widens the planner by negative margins at mobile ONLY (`-mx-2 md:mx-auto`); the
  390px overflow pin (mobile-navigation.spec.ts "the hero planner fits the 390px canvas")
  guards against regressing the tab-bar overlap.
- **R9** keeps the mobile variant untouched except the radius (VA inside, violet, h-9 — the
  live matches there); the desktop VA hangs BELOW the card into the hero/route boundary —
  the home page's category row gains ~30px bottom clearance so the pinned route heading
  never overlaps.
- **Do not regress** the pinned contracts: 42 unit, API envelope, seed counts (12/12/18 +
  27 home + 9 map), browse purity, Leaflet `ssr:false`, single-exit db-path helpers,
  `.env`/`.env.example` pinning, shared E2E storageState, rate-limiter behaviour, the login
  white-body inline style (unlayered-rule gotcha), the favourites scoped overlay.
- Resource note (session-14 lesson): close stray browser sessions + the dev server before
  E2E suite runs — the 4GB sandbox cannot run several Chromium daemons concurrently.
