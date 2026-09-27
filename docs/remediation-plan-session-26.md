# Session 26 — Remediation Plan (deployed-mirror verification + live-source re-measure → the footer legal chrome, the mobile route heading, the showcase insets, the stacking restaurant deck)

Date: 2026-09-27 · Base commit: `5d27c81` (main) · Agent: Super Z (session 26)

## 1. Context

Session 25 pushed the login/legal/category parity (`a9e4f17` + `b644573`);
the suggested next step was a mirror spot-check after the owner redeploys.
This session pulled (new: `docs/session_26.md` + the start-server log update
showing the owner rebuilt + restarted the server on the session-25 code),
re-read every root doc + the session-25 log + the plan + the worklog + the
start-server log, re-validated the codebase state (env, db, configs, skills
exclusion), and ran the full baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **67/67 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-25 CODE, ALL GREEN.** Verified by DOM signature: the login (inputs
14px/48px tall + the one-button "Need an account? Sign up" row with the
font-medium span), the legal routes (`/privacy-policy` +
`/accessibility-statement` rendering the exact chrome — title, the ← Back
home link 14px #8A8780, the 48px Libre Baskerville h1, the 14px/28px
#5F5C56 paras, chrome-less — with the legacy paths redirecting), the
category cards (24px headers, 32×32 cells, gap 14, cards 263×215 at x
232/509/786, the pill 229×54 hanging 48/6), the favourites empty card (576
@x=352 centered), the session-24 chips/card shell/map shell/heart-36,
the 52px tab-bar. Functionally: zero console errors across every page;
the mobile navbar end-to-end; the favourites round-trip; the booking
round-trip (visible under Profile → My bookings).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/390):** every session-24/25 surface re-verified UNCHANGED — the chips,
the card shell, the map command center (both breakpoints), the planner,
the hero (bg −86→924, h1 y 290/203), the desktop nav pill (820×56 @x=230),
the desktop route section (heading 72px @+120, first card y 1526/x 672
448×201), the stay squares (381×381 crop boxes), the sights grid (360×360
aspect-square, 1120 grid), the route h3s (20px/600/−0.4px), the blue band,
the detail split (h1 y 225/82px, card 1152×688 r36, inputs 44/r16/14px,
Back pill 36×89 @y112), the profile, the favourites (h1 y 244, empty 576),
the legal pages, the login, the mobile browses (pt-112, chips 44/600,
sticky planner), the mobile map shell, the desktop/mobile category cards.
**Seven findings** — the footer (never re-measured below the session-23
pill), and the mobile home sections (swept systematically for the first
time since session 20):

## 3. Findings (verified by DOM measurement on the live app, 2026-09-27)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **Med** | **Footer legal-row chrome** — the row carries a top hairline + its own padding + margin | `mt-4 flex w-full flex-col items-center gap-2 border-t border-black/[0.05] pt-3 text-center font-inter text-xs text-[#8A8780] sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-5 sm:text-left` — computed at 390: border-T 1px rgba(0,0,0,0.05), pt 12px, mt 16px, h 53; at 1280: pt 20px, mt 32px, h 37 | no border-t, no pt, no mt — the parent's `gap-4 md:gap-8` spaces it; the legal text sits 13/21px higher and no hairline renders |
| F2 | **Med** | **Footer + legal row switch at `sm:` (640), not `md:` (768)** — and the horizontal padding lives on the footer element | footer `relative overflow-visible px-5 pb-6 pt-8 sm:pb-14 sm:pt-16` (computed at 640: pt 64/pb 56; the inner is BARE — no px); legal row `sm:flex-row sm:justify-between` (row at 640) | footer `bg-cream pt-8 pb-6 md:pt-16 md:pb-14` + inner `px-5 md:px-6` (gap-4 md:gap-8) — at 640-767 the clone renders mobile pads + a column legal row; at 768-1023 the inner is 8px narrower than the live's |
| F3 | **Med** | **Footer pill caps at 390px on phones** — the live's mobile-override stylesheet sets the pill `max-width: 390px`, centered | at 700 viewport: pill 390×182 @x=155 (grid, 3 cols, links 117×78); at 390: 350 (w-full within px-5) | `grid w-full grid-cols-3 … md:flex md:w-fit` — no max-w: the pill is 600 wide at 640-767 |
| F4 | **High** | **The mobile route heading moved INTO the trap** — the live hides its `recommended-route-heading-section` on phones and renders the h2 INSIDE the fixed trap | heading section `display: none` at 390; the trap h2 `pointer-events-none absolute left-1/2 top-[68px] z-20 w-[min(92vw,360px)] -translate-x-1/2 text-center [Libre Baskerville] font-normal` — computed: font clamp(38px, 11vw, 48px) (42.9px @390, 48px capped), lh 43.758 (≈1.02), tracking −2.36px (−0.055em), pins at viewport y=68 (the trap ancestor is position: fixed); the trap zone 220vh (1857px); the stops panel `route-waypoint-panel relative z-10 block px-[18px] pb-10 pt-0` | the h2 renders in the heading section at BOTH breakpoints (`pt-[7.5rem]` → pins at y=120) at a fixed 38px, leading-none, −0.045em; the trap 208vh (1756); the panel `pt-[28px] pb-12`; the h2 vanishes mid-trap (the heading section's box ends at 1978 while the trap runs to 2806) |
| F5 | **High** | **The mobile showcase sections render INSET cards, not full-bleed** | at 390: the stay grid cards 354×354 @x=18 r-24 (px-[18px]); the sights cards 358×358 @x=16 r-24 (px-4); the restaurant deck cards 354×490 @x=18 (the section pad 56px 18px 0px) | the stay grid has NO mobile padding → cards 390×390 @x=0; the sights grid NO padding → 390×390 @x=0; the restaurant deck `px-4 pt-16 pb-16` → 358 @x=16 |
| F6 | **High** | **The mobile restaurant deck became a STICKY STACKING deck** — the live's `mobile-restaurant-stack` pins each card at viewport y=88 and slides the next over it | measured during scroll: at 4600 cards at y 108/728/1348/1968/2588/3208 (flow, 620 apart = 490 card + 130 gap); at 5200 cards 0+1 BOTH at 88; at 7000 five at 88; the deck releases ~7720; each card's parent is an ABSOLUTE 490px slot at 620px intervals (JS-transformed) — the observable contract is the classic sticky-stack | a flowing static list (cards 620 apart, `position: static`) — the session-20 docs record "no sticky stacking", so the live changed after session 20 |
| F7 | **Med** | **The mobile category track chrome** — the live's override pads the track and tightens the gap | computed at 390: the track (`.today-category-cards`, INSIDE the hero) pad 18px 18px 40px, gap 12px, justify flex-start, overflow-x auto, snap x mandatory; cards 306×227 at y=578 (the pill sits INSIDE the rows track — 8px below the last row) | `#category-cards` pad 16/16/8, gap 16px; cards 306×230 at y=559 (the pill mt-3 = 12px below the rows) — the cards ride the hero photo 19px higher than the live's |

Non-gaps re-verified (keep, document): the desktop category cards / stay
squares / sights grid / route section / restaurant band all EXACT (the
section heights match at 3680); the route stop cards 354×223/224 @x=18 both;
the mobile sights/vibe card GAPS (20/18px) both; the mobile restaurant card
chrome (r-28 bg-white, h 490) both; a pre-reload live DOM remount rendered
the mobile route model at 1280 width (its JS matchMedia state) — the
post-reload desktop model matches the clone exactly, so no clone change is
needed there; the login card height (784 vs 746) remains the documented
whitespace non-gap.

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `home.spec.ts` footer test — extend: the legal row carries `border-top: 1px solid rgba(0, 0, 0, 0.05)` + pt 12px @390 / 20px @1280 + mt 16/32px; at 640 the footer pads 64/56 AND the legal row is a `space-between` ROW (the sm: switch) + the pill is 390±4 centered; (b) `home.spec.ts` — NEW test "the mobile route heading pins inside the trap (session-26)": at 390 the heading section is hidden; mid-trap scroll the h2 sits at viewport y 64-72 with font 42-44px; (c) `home.spec.ts` — REWRITE the mobile restaurant deck test to the stacking contract: the first card `position: sticky` with `top: 88px`; mid-deck scroll two adjacent cards share viewport y ≈88; the deck pad px-[18px] (first card x=18, w 350-358); (d) `home.spec.ts` — extend the vibe + sights tests with the mobile insets (stays 354 @x=18, sights 358 @x=16); (e) `home.spec.ts` — extend the category-card test: the mobile track gap 12px + the first card's y 570-585 | tests/e2e/home.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **The footer (F1+F2+F3)**: the legal row gains `mt-4 sm:mt-8 border-t border-black/[0.05] pt-3 sm:pt-5` + the layout switch moves `md:flex-row md:justify-between md:gap-4` → `sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left`; the footer element becomes `px-5 pt-8 pb-6 sm:pt-16 sm:pb-14` (the horizontal padding moves onto the footer; the inner drops `px-5 md:px-6` and `gap-4 md:gap-8` — the legal row's own mt now spaces it); the pill gains `max-w-[390px]` (below md; `md:max-w-none` already resets it) | src/components/layout/SiteFooter.tsx | the R0a spec GREEN; the existing footer pins stay GREEN (the pill 506×96 @1280, the pads 64/56 @1280 + 32/24 @390, the column legal row @390, the inner 1024) |
| R2 | **The mobile route heading (F4)**: the heading section gains `hidden lg:block` (the desktop h2 renders at lg+ only); the trap's sticky h-screen div gains the mobile h2 — `pointer-events-none absolute left-1/2 top-[68px] z-20 w-[min(92vw,360px)] -translate-x-1/2 text-center font-serif text-[clamp(38px,11vw,48px)] leading-[1.02] tracking-[-0.055em] text-[#141413]` (it inherits the trap's lg:hidden visibility so exactly one h2 renders at every width); the trap `h-[208vh]` → `h-[220vh]`; the stops col `pt-[28px]` → `pt-0` and `pb-12` → `pb-10` (the base/mobile pads; the lg: chain untouched) | src/components/home/RecommendedRoute.tsx | the R0b spec GREEN; the existing route pins stay GREEN (the five stops, the mobile visual ≥380×700, the stop cards x=18/354/rounded-28, the desktop choreography + the trap overlap 700-900) |
| R3 | **The showcase insets (F5a+F5b)**: the stay grid ul gains `px-[18px] md:px-0`; the sights grid ul gains `px-4 md:px-0` | src/components/home/StayShowcase.tsx, src/components/home/HighlightedSights.tsx | the R0d spec GREEN; the desktop pins stay GREEN (the 1178 grid, 381 cards, the 1120 sights grid x≈80/360 cards) |
| R4 | **The stacking restaurant deck (F5c+F6)**: the mobile deck wrapper becomes `px-[18px] pt-14 md:hidden` (the live's 56/18/0 pad); each card article gets `sticky top-[88px]` with a `mt-[130px]` flow gap between consecutive cards (the classic sticky-stack: each card pins at viewport y=88 and the next slides over it; the cards stay DOM-ordered so the later card paints above) | src/components/home/HighlightedRestaurants.tsx | the R0c spec GREEN (sticky + top 88 + the stacking observable mid-deck + x=18); the desktop band/overlap pins stay GREEN |
| R5 | **The category track chrome (F7)**: the mobile track `gap-4 px-4 pb-2` → `gap-3 px-[18px] pt-[18px] pb-2`; the mobile View All pill `mt-3` → `mt-2` (8px below the rows, as the live's in-track gap) | src/components/home/CategoryCards.tsx | the R0e spec GREEN; the existing carousel pins stay GREEN (the snap track, the violet pill, r-24, the 306 cards, no 390 overflow) |
| R6 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 67+ E2E; re-measure every remediated surface against the live on the dev server (the footer legal hairline + pt at both breakpoints + the 640 window; the route h2 pin y/font; the stacking deck mid-scroll; the showcase insets; the track chrome); refresh the affected screenshots; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 6. Execution record (2026-09-27, post-delivery)

All six remediation rows executed in TDD order (RED confirmed on the
unmodified tree — all five touched specs failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the footer
  contract extended (the legal-row hairline + pt/mt at 390/1280 + the
  640-window row/pill max-w-390 pins); a NEW route-heading contract (one
  accessible h2 below lg, the 42.9px font, the 220vh trap, the y=68 pin
  mid-trap, the 358-360 width); the mobile restaurant deck test REWRITTEN
  to the stacking contract (sticky/top-88, the 620 advance, the x=18/354
  insets, the mid-deck two-cards-at-88 observable); the stay/sight mobile
  insets (354 @x=18 / 358 @x=16); the category-track chrome (the 12px gap
  + the y 570-585 cards). One spec bug fixed en-route (the oklab()
  border-color serialization — parsed the alpha instead of
  string-comparing).
- **R1** — the footer: the legal row rebuilt with the live's chrome
  (`mt-4 sm:mt-8 border-t border-black/[0.05] pt-3 sm:pt-5` + the sm:
  layout switch + `max-w-[390px] md:max-w-none`); the footer element
  gained `px-5` + the sm: vertical switch; the inner went bare (no px, no
  gap); the pill gained `max-w-[390px]`. Verified EXACT at all three
  widths: 390 (hairline + pt 12/mt 16, the column row, the 350 pill),
  640 (pads 64/56, the space-between row 390 @x=125 with kids at
  125/331 — the live's exact values, the pill 390 @x=125), 1280 (pads
  64/56, mt 32/pt 20/1px, the row w 1024 h 37, the pill 506×96 @x=387,
  the inner 1024).
- **R2** — the route heading: the heading section `hidden lg:block` (the
  desktop 72px h2 at lg+ only); the trap's sticky h-screen div carries
  the mobile h2 (`absolute left-1/2 top-[68px] z-20
  w-[min(92vw,360px)] -translate-x-1/2`, `clamp(38px,11vw,48px)`, lh
  1.02, tracking −0.055em); the trap 208vh → 220vh; the stops col
  pt-[28px]/pb-12 → pt-0/pb-10. Verified EXACT: the trap 1857 (the
  live's 1857), the h2 font 42.9px/lh 43.758/tracking −2.3595px/w 359
  (the live's exact computed values), pinning at viewport y=68 mid-trap,
  exactly one accessible h2 below lg.
- **R3** — the showcase insets: the stay grid ul `px-[18px] md:px-0`
  (cards 354×354 @x=18 — the live's exact values); the sights grid ul
  `px-4 md:px-0` (358×358 @x=16). The desktop pins stay green (the 1178
  grid / the 1120 grid).
- **R4** — the stacking deck: the wrapper `px-[18px] pt-14 md:hidden`
  (the live's 56/18/0 pad); each article `sticky top-[88px]` with the
  existing 130px margins. Verified EXACT: position sticky / top 88px /
  the pad 56px 18px 0px / the cards 354 @x=18 / the advance 620 / the
  mid-deck stacking (cards 0+1 both at viewport 88, card 2 flowing).
- **R5** — the category track: `gap-4 px-4 pb-2` → `gap-3 px-[18px]
  pt-[18px] pb-2`; the mobile pill `mt-3` → `mt-2`. Verified EXACT: pad
  18/18/8, gap 12, the cards 306×226 at y=577 (the live: 306×227 at
  578), scrollW 978 (the session-10 pin preserved).
- **R6** — gates: lint ✓ (2 pre-existing warnings) · typecheck ✓ · 42
  unit ✓ · build ✓ · 27/27 smoke ✓ · **68/68 E2E** ✓ (one full clean
  pass, no flakes). 29 screenshots (17 refreshed via
  capture-screens-v3 + crop-sections-v3 + capture-screens-v4-footer; 4
  NEW session-26 captures via capture-screens-v7-session26: the mobile
  route-trap heading, the mobile stacking deck, the mobile stay insets,
  the mobile category track — VLM-verified, with one VLM claim discarded
  against the DOM). `.env.example` re-verified (covers every
  code-referenced var; DEBUG_DBPATH stays the documented opt-in debug
  flag). Docs aligned: README, AGENTS, CLAUDE, PAD (v2.5),
  activity-map_SKILL (v1.13.0), this plan, the worklog.
- Documented non-gaps: the stacking deck's natural flow runs ~250px
  longer than the live's JS-transformed section (the live overlaps its
  tail into the vibe section — not replicable in pure CSS without
  fragile negative margins; the stacking behavior, pin y, and card
  geometry all match); the route trap starts ~15px later (the track's
  pt-18 flow cost — the live's pb-40 overflows its fixed-height hero
  invisibly); the vibe heading block's mobile pt (the live's 48 vs the
  clone's 112 — swamped by the deck flow delta; the desktop pt-112
  contract is untouched); the vibe heading px (16 vs 18 — invisible, the
  h2 wraps to the same 4 lines); the mobile category card height (226 vs
  227 — 1px rounding).

## 5. Risks & guards

- **Tailwind v4 CSS-first**: every change is a stock or arbitrary-value
  utility — no `tailwind.config.*`; the mobile-nav safety valve and the
  failure-class pins stay untouched.
- **R2's heading split**: the heading section `hidden lg:block` + the trap
  h2 (inside the `lg:hidden` trap) guarantees exactly ONE h2 per width —
  the E2E `getByRole("heading", { name: "Recommended Route" })` resolves
  either way; the desktop choreography (visual panel + slot) is untouched.
- **R4's sticky-stack**: the sticky cards live INSIDE the existing deck
  wrapper — the later cards paint above the earlier ones naturally (DOM
  order); the desktop band (md:block) is untouched. The deck's natural flow
  height (6×490 + 5×130 + the heading ≈ 3760) runs ~248px longer than the
  live's own JS-transformed section (which overlaps its tail into the vibe
  section) — the tail flow delta is documented as a non-gap (the stacking
  behavior, the pin y, and the card geometry all match).
- **R1's breakpoint move (md→sm)**: the only surfaces that change between
  640-767 are the footer pads + the legal row layout + the pill max-width —
  every other sm/md boundary in the app is untouched; the E2E middle-state
  (640) test only pins the tab-bar (unaffected).
- **Do not regress**: 42 unit, the API envelope, the seed counts, browse
  purity, Leaflet ssr:false, single-exit db-path helpers, the .env pinning,
  the shared E2E storageState, the rate limiter, the login white-body inline
  style, the profile (bare) contract, the tab-bar 52px + glass pins, the
  hero geometry, the desktop route choreography, the stay showcase desktop
  grid, the sights desktop grid, the desktop heading pins, the session-24
  filter-shell contracts, the session-25 login/category/favourites/legal
  contracts, the page-bottom spacing chains (the sights pill hands off
  flush to the footer at both breakpoints — the legal row's mt replaces the
  parent gap, so the chain is unchanged).
