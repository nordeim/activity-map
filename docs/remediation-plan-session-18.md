# Session 18 — Remediation Plan (deployed-mirror + live-source dual audit → heading-grid texture, place-detail restructure, mobile-route visual, mobile-restaurant flow, band-overlap rhythm)

Date: 2026-09-26 · Base commit: `9927947` (main) · Agent: Super Z (session 18)

## 1. Context

Session 16 achieved profile/map parity and pushed (`7907027` + `3e29198`); the owner added
`docs/session_17.md` (the previous agent's narration) and the start-server-log update (`9927947`)
— the deployed mirror was rebuilt and restarted WITH the session-16 code (verified live: the
chrome-less profile, the four-row map list). Baseline on the untouched tree:
lint ✓ (2 pre-existing warnings) typecheck ✓ 42 unit ✓ build ✓ **56/56 E2E** ✓ 27/27 smoke ✓;
`db/` at the repo root; `.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"`
pinned inline in dev/start/db:push/db:seed); vitest + playwright configs functional; the stray
parent `.env` (the documented session-2 hijack) neutralized before seeding.

**Deployed-mirror functional audit (all green):** every page loads with zero console errors;
the mobile navbar works end-to-end (52px fixed cream-glass tab-bar, icon x-positions 304/330/356
identical to the live, one-line 12px links, fixed positioning survives scroll, tap navigation
moves the active state, no overflow at 390 — no Tailwind v4 failure classes); the desktop pill
is exact (820×56 at x=230, radius 999, #E8E6DC border, 13px icon+text links); the map list cards
match the session-16 four-row contract (9 × 395×117, the interleaved order, sub-category
eyebrows, neighborhoods); the favourites save/unsave round-trip works (state restored); the
booking round-trip works (request persisted + visible under Profile → My bookings); the profile
is chrome-less with the grid overlay (h1 y=201).

**Live-source re-measure (logged in; DOM audits at 1280/390):** most surfaces re-verified
UNCHANGED against the session-16 records — mobile nav (inner span 12px/500, icons 304/330/356),
desktop pill (820×56, r999, white, #E8E6DC, 13px spans), profile (chrome-less, h1
"sepnetflix2023" y=203, 72px Libre Baskerville, grid overlay), map cards (397×119, the exact
interleaved sequence + eyebrows), map chrome (1216 search, 41px pills, 622 canvas), browse
headings (h1 y=168, chips 38px/12px, 12 cards), category cards (263×231 r20, rows 156, cells
34×35, VA 229×54 hanging 39px below; mobile 306×227 r24), mobile planner (358 at x=16, r30,
gap-1), stay showcase (1178 grid, 381px, gap 18, column-major Courtyard|Maison|Velvet), sights,
login (white body, system-font 30px h1, #0F172A button), hero anchors (h1 y=290, section 938),
desktop route (progress pill "33% of your day planned", 576×326 swap card, 3333px trap), desktop
restaurants band (3680px). The live re-measure found **6 actionable findings** (below).

## 2. Findings (verified by DOM measurement on the live app, 2026-09-26)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The 18px graph-paper grid texture now rides EVERY heading section** — eat/stay/do (h 385–405 at 1280), map (h 413), and the place-detail hero section (h 772 desktop / 667 mobile) | `div.absolute inset-0 pointer-events-none opacity-40` with the 18px/18px linear-gradient(rgba(20,20,19,0.055)) pair inside each `section.relative.overflow-visible.px-5.pt-16.pb-8` (browse/map) and the detail hero `px-5 pt-4 md:px-8 md:pt-6` | Only favourites (scoped, overflow-hidden) + profile (fixed full-page) carry the overlay — the browse/map/detail headings are plain cream |
| F2 | **High** | **The place-detail restructured: the rounded-36 card ends after the hero photo** — "About this place" + the form moved BELOW the card into a separate two-column grid | Card 1152×688 = eyebrow + h1 + meta + photo ONLY; below it `section.px-5.pt-8.md:px-8` wraps `div.mx-auto.grid.max-w-6xl.gap-6.lg:grid-cols-[1.2fr_0.8fr]` with the About column + `aside.scroll-mt-24.rounded-[28px].bg-white.p-6.md:p-8` (the Book Now card, 451px wide); mobile: the grid is single-column, the aside 358 at x=16 | One big card contains header + photo + About + form (`p-6 md:p-10 gap-10 lg:grid-cols-[7fr_5.5fr]`, form ≈454); the Book Now heading is an h2 inside the form |
| F3 | **Med** | **Booking-form fields are radius 16px** | Every input 44px h with `border-radius: 16px`; the textarea 106px/16px; the submit 48px/9999px violet | Inputs `rounded-full` (9999px); the textarea `rounded-[20px]`; submit full ✓ |
| F4 | **Med** | **The mobile route pins a full-viewport route visual** — the winding-path SVG (390×844, numbered nodes) is STICKY for ~208vh before the stop cards flow; NO mobile progress chip; no dashed timeline; the stop link-cards are rounded-28 with 30px place titles | `.route-map-section` 3741px = sticky SVG region (1755px) + waypoint panel (1985px, 5 cards: time pill 101×28 + serif h2 + rounded-28 card with 30px h3 + meta row); zero "planned" text at 390; desktop route UNCHANGED (progress pill + 576px swap verified) | The visual is `hidden lg:block` (46% panel); mobile shows a progress chip ("N% of your day planned") + a dashed timeline + rounded-24 cards with 20px titles; mobile route ≈1974px |
| F5 | **Med** | **The mobile restaurant section flows as a plain list** — 6 cards (490px) at 620px advances with ~130px gaps, `position: static` (no sticky stacking) | `.mobile-restaurant-stack` 3514px; cards at y 4708/5328/5948/6568/7188/7808, all static, marginBottom 0 | The clone keeps the session-8 sticky-stacking deck (`sticky top-[64px]` + `marginBottom: -290`), h=1738 |
| F6 | **Med** | **The desktop blue band starts at the route sticky's release point** — overlapping the route box's tail ~800px (band y=3703 while the route box ends 4503; the sticky releases exactly at 3703) | Blue band y=3703, h=3680; route trap 3333 from y=1170 (release = 1170+3333−800 = 3703) | The band starts at the route box's end (y=4540) — no overlap |
| F7 | Low | Hero photo top-crop nuance: the live's img is 1010px tall at top −86 (section mt −80, img overflows the section top); the clone's img is 938 at top 0. Same section height (938) and h1 y (290) | measured both | **Deliberate deviation** — the visible anchors match; the crop difference is the img's top 78px under the header. Documented, not remediated |
| F8 | — | Non-gaps / deliberate deviations (keep) | every surface in §1; entity-ID place URLs; the restaurants desktop DOM carousel; the CARTO api-key watermarks on the live's route tiles (live-site quirk); the hosted SavedPlace POST 403 (session-14 live-site bug) | unchanged |

## 3. Plan (TDD — update/extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **Grid texture on the browse/map/detail headings (F1)**: wrap each heading block in `relative` + the proven overlay div (the favourites' exact arbitrary-value pattern — `pointer-events-none absolute inset-0 opacity-40 [background-image:…] [background-size:18px_18px]`); browse/map keep `overflow-visible` sections like the live; the detail hero section gains the overlay as its first child | `src/components/places/CategoryExplorer.tsx`, `src/components/map/MapExplorer.tsx`, `src/app/(app)/place/[slug]/page.tsx` | browse.spec.ts: new assertions — an `.opacity-40` overlay with the 18px background-size exists inside each heading section on /eat (390 + 1280) and /map; home.spec untouched |
| R2 | **Place-detail restructure (F2)**: the `article.rounded-36` closes after the photo section; a NEW `section.px-5.pt-8.md:px-8` wraps `div.mx-auto.grid.max-w-6xl.gap-6.lg:grid-cols-[1.2fr_0.8fr]` carrying (a) the About column (34px h2 + description + tags — content unchanged) and (b) the BookingForm rendered as `aside.scroll-mt-24.rounded-[28px].bg-white.p-6.md:p-8` (the Book Now heading becomes an h3, the request line its 14px #888580 subtitle, the form itself unstyled `mt-6.space-y-4`) | `src/app/(app)/place/[slug]/page.tsx`, `src/components/places/BookingForm.tsx` | browse.spec.ts detail tests updated: the article contains the photo but NOT "About this place"; the About h2 sits BELOW the card; the `#book-now` aside is a sibling card (rounded-28, hairline, no shadow) OUTSIDE the article; the grid gap 24px; the aside ≈451px at 1280; mobile: single column, aside 358 at x=16 |
| R3 | **Form field radius (F3)**: inputs `rounded-full` → `rounded-[16px]`; the textarea `rounded-[20px]` → `rounded-[16px]`; the submit stays `rounded-full` | `src/components/places/BookingForm.tsx` | browse.spec.ts: the Name input and the Message textarea both `border-radius: 16px`; the submit pill stays 9999 (numeric > 1000) |
| R4 | **Mobile route visual (F4)**: add a mobile-only sticky full-viewport SVG region (`relative h-[208vh] lg:hidden` wrapping `sticky top-0 h-screen w-full overflow-hidden` + the same winding-path SVG full-bleed) BEFORE the desktop sticky flex; DROP the mobile progress chip + the mobile dashed timeline; the stop link-cards `rounded-[24px]` → `rounded-[28px]` and the place-name span 20px → 30px (h3 semantics like the live); the desktop arrangement (46% panel + progress pill + 576px swapping stack) untouched | `src/components/home/RecommendedRoute.tsx` | home.spec.ts route tests updated: at 390 an `svg` ≥390px wide is visible in the route section; the mobile chip "of your day planned" has count 0 at 390 and ≥1 at 1280; the stop cards carry rounded-28; the five timed stops + text-only + Learn More contracts stay green; at 1280 the trap/swap assertions stay green |
| R5 | **Mobile restaurants flow (F5)**: replace the sticky-stacking deck with the live's flowing list — remove `sticky top-[64px]` + the −290 marginBottom; cards stack vertically with the live's ~130px gap (`space-y-[130px]`-equivalent via margin); the deck keeps its white 42px serif heading + the 6 restaurants; desktop carousel untouched | `src/components/home/HighlightedRestaurants.tsx` | home.spec.ts mobile-deck test updated: 6 cards, all `position: static` (no sticky), consecutive card tops ~620px apart (±40), each 490±30 tall; the desktop carousel assertions stay green |
| R6 | **Desktop band overlap (F6)**: the restaurants section gains `-mt-[800px]` (lg only) + `relative z-0` so the band rises over the route box's tail exactly as the live (band top ≈ the sticky release point); verify the route's pinned visual never clips mid-swap | `src/components/home/HighlightedRestaurants.tsx` (or the home page wrapper) | home.spec.ts: at 1280 the blue band's top < the route trap's bottom (overlap 700–900px); the route swap-card choreography assertions stay green |
| R7 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → E2E (extended); re-measure every remediated surface against the live; refresh the 14 screenshots (dev server, reseeded DB, favourite saved for 07); align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/session log/worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all changes via arbitrary values / existing tokens; no
  `tailwind.config.*`; the mobile-nav safety valve (`no-scrollbar`, ≤62px wordmark, five
  failure-class pins) untouched; the overlay reuses the favourites' proven arbitrary-value
  pattern (already E2E-pinned against the v4 minifier).
- **R2 restructure** keeps the URL, the Back pill, the card chrome (rounded-36 shadow-only),
  the photo tiers (260/420/460), the rating/heart overlays, and the form's fill/submit flow
  (`#book-now` stays on the form; the aside wraps it) — the booking round-trip spec must stay
  green unchanged except the card-geometry assertions.
- **R4/R5/R6 touch scroll choreography pinned by existing specs** — update those contracts in
  the same RED pass, and re-run the FULL E2E (not just targeted) before the gates; keep
  `workers: 1` and close stray browser daemons before runs (the session-14 4GB lesson).
- **Do not regress**: 42 unit, the API envelope, seed counts (12/12/18 + 27 home + 9 map),
  browse purity, Leaflet `ssr:false`, single-exit db-path helpers, `.env` pinning, the shared
  E2E storageState, the rate limiter, the login white-body inline style, the favourites scoped
  overlay, the profile `(bare)` contract.
- The deployed mirror now carries one "Audit Session18" booking (the round-trip proof) — the
  owner's redeploy wipes it (`rm -rf db/custom.db` + reseed per the start-server log).
