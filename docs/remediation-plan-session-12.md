# Session 12 — Remediation Plan (live-app re-measure + evolution parity)

Date: 2026-09-25 · Base commit: `ebef0ce` (main) · Agent: Super Z (session 12)

## 1. Context

Session 10 achieved residual-gap parity and pushed (`2ee6e0b` + `b03437a`); the owner
added `docs/session_11.md` (session-10 narration, `e9cb0a5`), reference capture
scripts (`cfc68ad`), and the start-server log + dependency pinning (`ebef0ce`).
Baseline on the untouched tree is green: lint ✓ typecheck ✓ 42 unit ✓ build ✓
54/54 E2E ✓; `db/` at the repo root (42+27+9 places + demo user);
`.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"`); vitest +
playwright configs present and functional.

A fresh live re-measure (logged in; DOM audits at 1280/768/390 + VLM comparisons
— the session-10 playbook) found the live app's core chrome STABLE (navbar, hero
geometry, route stops, restaurant deck, sights, category-card rows, eat grid,
login card) but EVOLVED on five surfaces: the home stay showcase was re-ordered,
the profile was redesigned into two glass cards, the map chrome widened, the
vibe heading went full-width left-aligned, and the favourites page regained its
grid texture. The deployed mirror `https://activity-map.jesspete.shop/` is
currently DOWN (Cloudflare 404 — origin unreachable; reported, out of scope for
this repo).

Non-gaps re-verified first: mobile navbar (52px cream-glass tab-bar, 12px
links, icon positions x≈304/330/356, one-line layout, tap navigation) ✓,
desktop floating white pill (820×56, 13px links, border #E8E6DC) ✓, hero
geometry (photo 591/938, h1 y=203/290, planner y=373-374/432-434) ✓, route
section (text-only cards, 0 imgs, titles match) ✓, restaurants (16-img desktop
canvas carousel — documented deviation; mobile 6-card deck) ✓, sights (6 square
cards, same order) ✓, category-card row content (3 two-line rows, live icon
set, exact titles/subtitles) ✓, eat grid (3-col, 12 cards, 392-397px) ✓,
map stats pills ✓, login card (448px, system h1 30px, logo 96px, slate-900
button 48px radius 12) ✓, favourites h1 55px ✓.

## 2. Findings (verified by DOM measurement on the live app, 2026-09-25)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | Home stay showcase ORDER re-shuffled | Section titles in order: Courtyard Stay, Terra Boutique, Brass & Marble, Canal Hideaway, Maison Altstadt, Garden Suite, River House, Rooftop Atelier, Velvet Residence, Cloud Nine Hotel, The Linen House, Arcade Rooms | browse order: Garden Suite, Cloud Nine Hotel, Brass & Marble, … (matches the live's /stay BROWSE page, not the home showcase) |
| F2 | **Med** | "Choose Your Vibe" heading block geometry | h2 x=38 w=1203 (full-width, LEFT-aligned), color #1A1A1A; subtitle 14px #888580 centered (w=420); grid x=51 w=1178; grid wrapper pt=112px pb=144px | h2 x=280 w=720 (max-w-3xl, centered); subtitle 16px black/60; grid x=92 w=1096 (max-w-1144); section py-16 sm:py-24 |
| F3 | **Info** | Deployed mirror down | `https://activity-map.jesspete.shop/` → HTTP 404 via Cloudflare (origin unreachable) | n/a — owner-side deployment issue, flagged in the session log |
| F4 | **Med** | Map page chrome | search bar full-width 1138px (x=41) with `border border-black/5`, h-48; pills h=41 fs=12 (All Places 109px); map canvas h=620 | search 516px centered (no border); pills h=44 fs=14; map canvas h=494 |
| F5 | **High** | Profile page redesigned into TWO glass cards | container 896px; row 1 = back + Sign out (46px, mb-8); CARD 1 `rounded-[36px] border border-white/70 bg-white/78 p-5 shadow-…` h=334 (Profile eyebrow 12px/600 #72706C → H1 = account NAME "Explorer" 72px → "Your Roam account" 16px #555550 → Augsburg + 0 day streak + Explorer badge chips → heart Saved-places 154×44); CARD 2 `rounded-[32px]` h=422 mt-8 (Trips eyebrow → "My bookings" H2 36px + 0 count → Upcoming/Past tabs FULL-WIDTH 411×44 12px → All/Eat/Stay/Do filters 38h 12px → empty state) | single 960px flat container; H1 = username "sepnetflix2023" 55px; email line under it; "My bookings 0" as a 14px span; compact 36h tabs/filters 14px |
| F6 | **Med** | Favourites page regained the grid texture | grid overlay div `absolute inset-0 pointer-events-none opacity-40` — `linear-gradient(rgba(20,20,19,0.055) 1px, transparent 1px), linear-gradient(…)` size 18px 18px; subtitle "All saved restaurants, hotels…" 14px #3A3A3A | no grid (removed session-10); subtitle 16px black/60 |
| F7 | **Low** | Login page body background | body bg WHITE `rgb(255,255,255)` | body bg cream #F8F7F4 (only the main is white — cream shows on overscroll) |
| F8 | **Low** | Browse chrome sizing | filter chips h=38 fs=12; planner search input w=648; planner fields 54/48 | chips h=40 fs=14; search w=765; planner 52/44 |
| F9 | **Low** | Category-card total height | cards 231px (hotels/sights) / 210px (eat — its View All clips to 41px, a live quirk); padding 14px top / 12px bottom; View All mt≈12 | cards 262px uniform; padding 16px; View All mt-20 |
| F10 | — | Deliberate deviations (keep) | restaurants desktop canvas carousel; category-card hover ticker structure; entity-ID place URLs; live mobile carousel has NO snap classes | DOM carousel; static rows; slug URLs; snap carousel (enhancement) |

## 3. Plan (TDD — update the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **Stay showcase order**: pin the live's home order — sort the published stays by a `HOME_STAY_ORDER` slug map (a module constant beside the home page) before feeding `StayShowcase`; the /stay browse order is untouched | `src/app/(app)/page.tsx` | updated `home.spec.ts` stay test: first card = "Courtyard Stay", the full 12-title order matches the live's |
| R2 | **Profile redesign**: two glass cards in an 896px container — card 1 `rounded-[36px] border border-white/70 bg-white/78 p-5` (Profile eyebrow 12px/600 #72706C, H1 = user NAME 72px, "Your Roam account" 16px #555550, Augsburg/streak/badge chips, heart Saved-places); card 2 `rounded-[32px] mt-8` (Trips eyebrow, "My bookings" H2 36px + count, FULL-WIDTH Upcoming/Past tabs 44px/12px, All/Eat/Stay/Do 38px/12px, empty state). Seed user name → "Explorer"; Navbar avatar initial derives from the EMAIL (the live shows "S") | `src/components/profile/ProfileView.tsx`, `prisma/seed.ts`, `src/app/(app)/layout.tsx`, `src/components/layout/Navbar.tsx` | updated `browse.spec.ts` profile tests: h1 "Explorer" 72px, "Your Roam account" present, email NOT shown, My bookings is a 36px h2, tabs 44px, avatar "S" (unchanged) |
| R3 | **Map chrome**: search bar `h-12 max-w-[1138px]` full-width WITH `border border-black/5`; pills `h-[41px] text-[12px]`; map canvas `h-[620px]` (desktop) | `src/components/map/MapExplorer.tsx` | updated map test: search ≈ full-width (w > 1000 at 1280), pills h 41, map height 620 |
| R4 | **Vibe heading geometry**: heading block full-width LEFT-aligned (`text-left`, container px only — drop max-w-3xl centering), color #1A1A1A on the LetterReveal target; subtitle 14px #888580 (kept centered); grid container `max-w-[1178px]`; wrapper `pt-[112px] pb-[144px]` | `src/components/home/StayShowcase.tsx`, `src/components/home/LetterReveal.tsx` (INK constant) | updated home spec: h2 x < 100 at 1280 (left), w > 1100, subtitle fs 14, grid w ≈ 1178 |
| R5 | **Favourites grid texture**: re-add an overlay `absolute inset-0 pointer-events-none opacity-40` with 18px-crossing gradients `rgba(20,20,19,0.055)`; subtitle 14px #3A3A3A | `src/components/favourites/FavouritesView.tsx` | updated favourites test: a grid background-image is present on main, subtitle color rgb(58,58,58) |
| R6 | **Login body white**: set the document body to white while the login page is mounted (client effect in LoginForm, cleaned up on unmount) | `src/components/auth/LoginForm.tsx` | updated auth test: `document.body` background-color = rgb(255,255,255) on /login |
| R7 | **Browse chrome sizing**: chips `h-[38px] text-xs`; planner search input max-width tuned so the desktop row ≈ live proportions | `src/components/places/CategoryExplorer.tsx`, `src/components/planner/BrowsePlanner.tsx` | updated browse spec: chip height 38, font-size 12 |
| R8 | **Category-card compaction**: card padding `pt-[14px] pb-[12px]` (keep 16px sides), View All `mt-3` (12px) → total ≈ 231px; keep uniform cards (the live's clipped eat-card VA is a quirk, not a design) | `src/components/home/CategoryCards.tsx` | updated home spec: desktop card height ≈ 231 ± 6 |
| R9 | Full gates → refresh the 14 screenshots → docs (README/AGENTS/CLAUDE/PAD/SKILL/session log/worklog) → single commit + SSH-wrapper push | everything | all gates green; screenshots variance-checked; docs consistent |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all new classes via `@theme` tokens/arbitrary values
  only; NO `tailwind.config.*`; keep explicit `rgba()`/hex utilities where specs
  assert computed colors (α-modifiers compile to `color-mix()`/oklab()).
- **Mobile nav safety valve untouched**: the `no-scrollbar` row, the ≤62px
  wordmark span, and the five v4 failure-class pins stay green; no navbar
  layout changes (the initial-source switch only changes the disc's letter).
- **The seed change (name "Explorer") requires `db:push` + `db:seed` reruns**
  for the dev and e2e databases; the E2E global-setup re-seeds `db/e2e.db`
  automatically, but the dev DB needs a manual re-seed before screenshots.
- **Profile tests are order-sensitive**: `browse.spec.ts` runs a booking flow
  before the profile tests; keep assertions resilient to "0 or N" counts
  (the existing `.or(...)` pattern).
- **Map canvas height** must stay responsive below md (the live's 620px is the
  desktop value; mobile keeps its existing measured height).
- **Do not regress** the pinned contracts: 42 unit, API envelope, seed counts
  (12/12/18 + 27 home + 9 map), browse purity, Leaflet `ssr:false`, single-exit
  db-path helpers, `.env`/`.env.example` pinning, shared E2E storageState,
  rate-limiter behaviour.
- The restaurants carousel keeps the DOM-transform deviation; only the surfaces
  listed above change.
