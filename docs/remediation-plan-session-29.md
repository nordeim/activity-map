# Session 29 — Remediation Plan (deployed-mirror verification + live-source re-measure → the restaurant-band redesign + the map-list card chrome + the detail rating pill)

Date: 2026-09-28 · Base commit: `8000452` (main) · Agent: Super Z (session 29)

## 1. Context

Session 28 pushed the date-picker/stay-pill/booking-label parity (`36104e2` +
`e79065e`); the owner then rebuilt + restarted the server (the start-server log
update `8000452` adding `docs/session_31.md` — the session-28 agent log). This
session pulled, re-read every root doc + the session-28 plan + the worklog +
`docs/session_30.md` + `docs/session_31.md` + the start-server log,
re-validated the codebase state (env `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root, vitest + playwright configs working, skills
exclusion), and ran the full baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **69/69 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-28 CODE, ALL GREEN.** Verified by DOM signature: the date-range
popover (510×369 with the `mb-2 grid gap-2 sm:grid-cols-2` header of
self-contained 238×50 field pills carrying calendar icons, NO Done button).
Functionally ALL GREEN: zero console errors across every page; the mobile
navbar end-to-end (52px border-box tab-bar, 12px links, tap navigation with
the active state moving — Eat/Stay + the MapPin icon → /map); the favourites
round-trip (save → 1 card → unsave → the empty state); the booking
round-trip ("Request sent" + visible under Profile → My bookings).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/640/390):** every session-24–28 surface re-verified UNCHANGED — the
date-picker popover (510×371, same header/grid chrome), the home stay pills
(168×34, inline height 34, both borders), the browse chips (38px content
height, 12px/600, 1px hairline, white), the browse card rating pills (56×28,
pad 6/10, 13px star), the place-detail structure (h1 82px @y225, card
1152×688 r36, Back 89×36, About 34px/400, the 28px surface2 tag pills), the
mobile nav at 390/640 (52px border-box, 12px links, the 430px cap at 640),
the sights grid at 640 (cards + the 572×36 violet 12px/700 hover pill), the
mobile restaurant deck (354×490 cards @x=18, 620px advances, the stacking
pin at y=88 via the live's own JS transforms — the clone's CSS-sticky model
is the documented visual equivalent), the blue band bg #4D61FF, the map
command center (1216×66 sticky shell, 41px 12px/600 pills), and the map
section heading + subtitle.

**Eight findings** — the desktop RESTAURANT BAND (never re-measured as a
whole below the session-6/18 models — the heading layer, the names
watermark, and the featured card have all been redesigned on the live), the
map "Places on the map" list-card chrome (last swept session-16), the map
stats pills, and the detail hero rating pill:

## 3. Findings (verified by DOM measurement on the live app, 2026-09-28)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The band heading layer** — a sticky, vertically + horizontally CENTERED column that fades out | the heading renders as its own sticky layer (`position: sticky; top: 0; height: 100vh; margin-bottom: -100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; z-index: 8`): the h2 `clamp(46px, 7vw, 104px)` (89.6px @1280) `line-height: 1.02; letter-spacing: -0.055em; text-align: center` white Libre Baskerville 400 with the white View All pill BELOW it (gap 24): `height: 44px; padding: 0 24px; border-radius: 999px; background: white; color: #141413; font-size: 13px; font-weight: 600; letter-spacing: 0.02em`; the layer FADES OUT through the first ~45% of the band trap (`opacity` 1 @progress 21%, 0.63 @35%, 0 @49% — a ~120ms linear transition), pointer-events off when hidden | a horizontal row `mx-auto flex max-w-[1000px] items-end justify-between gap-4 px-6 pt-20`: the h2 LEFT (`text-[42px]` min clamp) + the View All RIGHT (`px-5 py-2.5 text-sm` 14px/600); never fades |
| F2 | **High** | **The names watermark** — a centered FIVE-NAME sliding window, uniform Inter | exactly FIVE name spans in the DOM (2 before + the active + 2 after, circular wrap — Granary/Faro/Volta/Roux/Aura at rest): one centered row (`display: flex; align-items: center; justify-content: center; gap: 34px`) — the row centers AS A GROUP (546px wide @1280 → x=367, the active lands near — not exactly at — the viewport center); every name `font-size: clamp(...)` = 33.28px @1280, `font-family: Inter` (NOT serif), `font-weight: 400`, `letter-spacing: -0.02em`; the ACTIVE name solid white, the rest `rgba(255,255,255,0.32)`; the row sits at the viewport's vertical center (y≈369-400 @800); the window SNAPS one step as the active changes (step boundaries sampled at trap offsets 800/900/1000/1100) | a static flex-wrap row of ALL 16 names: the active `text-[clamp(64px,8vw,104px)]` font-serif solid, the rest `text-[clamp(40px,5vw,64px)]` font-serif `text-white/15`; never moves |
| F3 | **High** | **The featured detail card** — a compact centered bottom card, NO name, fades in | `position: absolute; left: 50%; bottom: 9vh; transform: translateX(-50%); min-width: 330px; padding: 16px; border-radius: 28px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(18px); box-shadow: 0 18px 48px rgba(0,0,0,0.35); text-align: center` (measured 330×130 @1280): the ADDRESS line `12px, letter-spacing: 0.04em, color: rgba(255,255,255,0.56)`, `margin-bottom: 8px`, centered + truncated; the meta row centered `gap: 14px, font-size: 13px` — the € symbols (white) + a 4px dot `rgba(255,255,255,0.35)` + `★★★★★` gold `#F7D774` `letter-spacing: 0.08em` + the rating `rgba(255,255,255,0.86)`; the buttons row `margin-top: 12px; gap: 8px` — TWO `flex: 1 1 0%; height: 38px; padding: 0 14px; border-radius: 999px` buttons: Book a Table `background: white; border: 1px solid rgba(255,255,255,0.28); color: #141413; 12px/600` and Learn More `background: rgba(255,255,255,0.08); 12px/500` white; NO restaurant name inside (the name lives in the watermark only); the card's `opacity` fades IN as the heading fades out (0 @progress 21%, 1 @49%) | `bottom-10` + `max-w-[560px]` + `p-6` + `bg-white/12` + NO border + `backdrop-blur-xl` + left-aligned content: the NAME h3 `font-serif text-3xl` + the address `text-sm text-white/75` + the meta `text-sm gap-2` + two `px-5 py-2.5 text-sm font-semibold` (14px) buttons (`gap-3`); always visible |
| F4 | **Med** | **The map list-card eyebrow** — a cream PILL | the eyebrow is `inline-flex items-center gap-1.5 rounded-full bg-[#F8F7F4] px-[10px] py-[4px]` — measured 65×26 for "Hotel", `background: rgb(248,247,244)`, `border-radius: 9999px`, `12px/600 #555550, letter-spacing: 0.96px, uppercase`; the eyebrow row itself `mb-3 flex items-center justify-between gap-2` (a 12px bottom margin, no fixed height) | the eyebrow is plain text `text-xs font-semibold uppercase tracking-[0.08em] text-[#555550]` on a fixed `h-[26px]` row |
| F5 | **Med** | **The map list-card neighborhood** — a MapPin icon line | the row is `mt-2 flex items-center gap-1 truncate` carrying a 12×12 MapPin svg (`color: rgb(136,133,128)`, `stroke-width: 2`) BEFORE the 12px `#888580` text | `mt-2 text-xs text-[#888580]` — no icon |
| F6 | **Low** | **The map list grid gap** | the grid computes `gap: 12px` (3-col @1280 → 397px cards; 1-col @390 → 358px cards) | `gap-4` (16px → 394.7px cards @1280) |
| F7 | **Low** | **The map stats pills** | `rounded-full bg-white px-3 py-2` (119×32, 12px text) with NO box-shadow | carries `shadow-[0_6px_16px_rgba(14,14,14,0.08)]` |
| F8 | **Low** | **The detail hero rating pill** | 61×32 — `padding: 8px 12px`, the star 14px (ink fill), the number 12px/700 | 56×28 — `px-2.5 py-1.5` (10px/6px), the star 13px |

Non-gaps re-verified (keep, document): the date-picker popover (session-28
EXACT — 510×371 live vs 369 clone); the home stay pills (168×34, both
borders); the browse chips + card rating pills; the place-detail structure;
the mobile nav at 390/640; the sights grid + hover pill at 640; the mobile
restaurant deck (354×490 @x=18, 620px advances, stacking pin y=88 via the
live's JS transforms — the clone's CSS-sticky is the documented equivalent);
the band bg + trap height (3680 ≈ 460vh); the floating tilted photo
collage; the map command center + pills; the map section heading/subtitle;
the map list-card shell (r24/white/1px-black-8 hairline, pad 16, h≈119) and
its 15px/600 title; the profile + login + legal surfaces (sessions 25–28
pins all green in the baseline E2E run).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `home.spec.ts` — REWORK the "highlighted restaurants: blue section, glass detail card, View All" test to the new live contract: at the trap's start the h2 is horizontally centered (h2 center ≈ viewport center ±6) with the View All rendering BELOW the h2's bottom edge (h 42-46, 13px font); the names watermark renders exactly 5 spans with UNIFORM font sizes (the active + a faint one compute the same px size) in Inter (NOT Libre Baskerville), the active solid white (no alpha channel in its color), the faint ones white/0.32; NO h3 renders inside the featured card (no name); the featured card computes min-width ≥ 325, pad 16, a 1px border, and its two buttons compute h 38; the fade choreography — at the trap's head the heading layer is visible and the card opacity 0, scrolled deep the card is visible. (b) `browse.spec.ts` — extend the map test: the "Places on the map" card eyebrow computes `rgb(248, 247, 244)` bg + a full radius + h 24-28; the neighborhood line contains an svg (the MapPin); the grid gap computes 12px; the map stats pills carry NO box-shadow (the shadow string is "none"); (c) `browse.spec.ts` — extend the detail photo-overlay test: the `[data-photo-rating]` pill computes h 30-34, w 55-65, and its star svg ≥ 14px | tests/e2e/home.spec.ts, tests/e2e/browse.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **The band heading layer (F1)**: replace the `mx-auto flex max-w-[1000px] … pt-20` row with an absolute inset-0 flex COLUMN (`items-center justify-center gap-6`, z-8) carrying the centered h2 (`text-center text-[clamp(46px,7vw,104px)] leading-[1.02] tracking-[-0.055em]`) + the View All pill below (`inline-flex h-11 items-center rounded-full bg-white px-6 text-[13px] font-semibold tracking-[0.02em] text-[#141413]`); drive `opacity` + `pointer-events` from the band progress: `headingOpacity = clamp((45 − p) / 15)` (1 below p30, 0 above p45) with a 120ms linear transition | src/components/home/HighlightedRestaurants.tsx | the R0a heading assertions GREEN; every prior band pin (the trap overlap, the View All href) stays GREEN |
| R2 | **The names watermark (F2)**: replace the all-16 static flex-wrap row with a FIVE-NAME sliding window — `windowOf(activeIndex)` = indices `[(i−2+len)%len, (i−1+len)%len, i, (i+1)%len, (i+2)%len]` rendered in one centered row (`flex items-center justify-center gap-[34px]`, vertically centered via `top-1/2 -translate-y-1/2`): every name `font-sans text-[clamp(24px,2.6vw,40px)] font-normal tracking-[-0.02em]` (Inter, uniform), the active `text-white`, the rest `text-white/[0.32]`; keep the `aria-hidden` + `pointer-events-none` wrapper | src/components/home/HighlightedRestaurants.tsx | the R0a watermark assertions GREEN |
| R3 | **The featured card (F3)**: rebuild the card to the compact centered model — `absolute bottom-[9vh] left-1/2 z-10 -translate-x-1/2 min-w-[330px] rounded-[28px] border border-white/[0.16] bg-white/[0.08] p-4 text-center shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-[18px]` with `cardOpacity = clamp((p − 30) / 15)` (0 below p30, 1 above p45): the address line (`mb-2 truncate text-xs tracking-[0.04em] text-white/[0.56]`), the centered meta row (`flex items-center justify-center gap-[14px] text-[13px] text-white/[0.86]` — € symbols + the 4px `bg-white/[0.35]` dot + `★★★★★` `tracking-[0.08em] text-[#F7D774]` + the rating), and the buttons row (`mt-3 flex items-center gap-2`): Book a Table `flex h-[38px] flex-1 items-center justify-center rounded-full border border-white/[0.28] bg-white px-[14px] text-xs font-semibold text-black` + Learn More `flex h-[38px] flex-1 items-center justify-center rounded-full bg-white/[0.08] px-[14px] text-xs font-medium text-white`; DROP the name h3 + the address/meta text-sm rows from the card | src/components/home/HighlightedRestaurants.tsx | the R0a card assertions GREEN; the Book a Table href pin stays GREEN |
| R4 | **The map list-card chrome (F4+F5+F6)**: the eyebrow → `inline-flex items-center gap-1.5 self-start rounded-full bg-cream px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#555550]` (the live's 4px/10px pad ≈ py-1 px-2.5) and the eyebrow row `flex items-center justify-between gap-2 mb-3` (drop the fixed `h-[26px]`); the neighborhood row → `mt-2 flex items-center gap-1 truncate text-xs text-[#888580]` carrying `<MapPin className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />` (12px, #888580); the grid `gap-4` → `gap-3` (12px) | src/components/map/MapExplorer.tsx | the R0b assertions GREEN; the existing map pins (the four-row text-only contract, the interleaved order, the sub-category eyebrows) stay GREEN |
| R5 | **The map stats pills (F7)**: drop `shadow-[0_6px_16px_rgba(14,14,14,0.08)]` from the three stats spans (keep `rounded-full bg-white px-3 py-2`) | src/components/map/MapExplorer.tsx | the R0b no-shadow assertion GREEN |
| R6 | **The detail hero rating pill (F8)**: `px-2.5 py-1.5` → `px-3 py-2` and the star `h-[13px] w-[13px]` → `h-3.5 w-3.5` (14px) | src/app/(app)/place/[slug]/page.tsx | the R0c assertions GREEN; the existing pill pins (bg white, the 4.8 text) stay GREEN |
| R7 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 69+ E2E; re-measure every remediated surface against the live on the local server (the heading column centering + fade, the 5-name window, the 330px card + 38px buttons, the map card eyebrow pill + MapPin + 12px gap + shadowless stats, the 61×32 rating pill); capture the dev-server screenshots into `docs/screenshots/`; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog + write `docs/session_32.md`; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- The heading/card crossfade windows (p30→p45) are sampled approximations of
  the live's opacity curve — the E2E asserts the END STATES (visible at the
  head, swapped deep in), not intermediate values, so minor curve differences
  stay unpinned.
- The 5-name window re-renders (snaps) on active change rather than sliding —
  every sampled static state matches the live exactly; the live's slide
  animation is a motion nuance beyond the deterministic contract.
- Dropping the name h3 from the featured card changes the mobile deck? No —
  the mobile deck (`article` cards with h3 names) is a separate branch below
  md and stays untouched; only the desktop stage changes.
- The existing E2E pin `getByRole("heading", { name: "Volta" })` inside the
  band must be reworked — the name no longer renders as a heading on desktop
  (it renders as a plain span in the names window). The mobile deck's h3
  headings are unaffected (they live in the hidden-on-desktop branch).
- The map eyebrow pill's `gap-1.5` inner gap: the live's class carries
  `gap-1.5` but renders text-only (no icon inside the pill) — keep the pill
  text-only, the gap is inert.
- `text-black` on the Book a Table button: the live computes `color:
  rgb(0,0,0)` — pure black, not #141413.
- The names window at `len < 5` (never in practice — 16 seeded) would
  de-duplicate; the seeded data guarantees 16, and the slice handles it.

## 6. Execution record (2026-09-28, post-delivery)

All seven remediation rows executed in TDD order (RED confirmed on the
unmodified tree — all three touched specs failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the REWORKED
  `home.spec.ts` band contract (the h2 centered ±6 + the View All below at
  h 42-46 + 13px + the h2 min clamp 46 + the 5-span names window with
  uniform Inter font + solid/faint colors + the Granary-wrapping order + the
  featured card's no-heading/min-w-325/pad-16/1px-border/38px-buttons/
  equal-widths + the crossfade end states), the map list-card extensions
  (the cream-pill eyebrow bg + full radius + h 24-28 + the hood svg 12px +
  the grid gap 12px), and the detail rating-pill extension (h 30-34 + the
  star ≥ 14). En-route test fix: the two flex-1 buttons' equal-width pin
  needed ±2px tolerance (the fractional flex split rounds 143/145).
- **R1** — the heading layer: `absolute inset-0 z-[8] flex flex-col
  items-center justify-center gap-6` carrying the centered h2
  `text-[clamp(46px,7vw,104px)] leading-[1.02] tracking-[-0.055em]` + the
  View All `inline-flex h-11 px-6 text-[13px] font-semibold
  tracking-[0.02em]`; `opacity` + `pointerEvents` driven by
  `headingOpacity = 1 − cardFade` with a 100ms linear transition.
- **R2** — the names watermark: the FIVE-name window
  `[-2,-1,0,1,2].map(k => restaurants[(i+k+len)%len])` in one centered row
  (`gap-[34px] font-sans text-[clamp(24px,2.6vw,40px)] font-normal
  tracking-[-0.02em]`), the middle span `text-white`, the rest
  `text-white/[0.32]`.
- **R3** — the featured card: `bottom-[9vh] left-1/2 -translate-x-1/2
  min-w-[330px] rounded-[28px] border-white/[0.16] bg-white/[0.08] p-4
  text-center shadow-[0_18px_48px_rgba(0,0,0,0.35)]
  backdrop-blur-[18px]` with the address line + the centered meta row
  (€ + the 4px dot + ★★★★★ #F7D774 + the rating at gap-[14px] 13px) + two
  `flex h-[38px] flex-1` buttons (Book a Table white + 1px white/0.28
  border 12px/600 black; Learn More white/0.08 12px/500); the name h3 +
  the address/meta text-sm rows dropped; `opacity = cardFade`.
- **R4** — the map list card: the eyebrow `inline-flex items-center gap-1.5
  self-start rounded-full bg-cream px-2.5 py-1 text-xs font-semibold
  uppercase leading-[18px] tracking-[0.08em] text-[#555550]` on an
  `mb-3` row (the fixed h-[26px] dropped); the hood line `mt-2 flex
  items-center gap-1 truncate` with the 12px MapPin; the grid `gap-3`.
- **R5** — the stats pills: the `shadow-[0_6px_16px_rgba(14,14,14,0.08)]`
  dropped from the three spans.
- **R6** — the detail rating pill: `px-2.5 py-1.5` → `px-3 py-2` + the
  star `h-[13px] w-[13px]` → `h-3.5 w-3.5`.
- **Side-by-side verification on the local server** (both sites
  re-measured): the band h2 x=142/w=996/center=640 — EXACT vs the live;
  the View All 44px/13px below the h2; the names window 5 spans at
  33.28px uniform Inter with the active solid; the featured card 330×128
  centered at 640 with pad 16/border 1px/blur 18/buttons 145×143×38
  (12px/600 + 12px/500) — the live 330×130/buttons 144×144×38 — EXACT
  within 2px; the map card eyebrow 65×26 cream pad 4/10 + the 12px MapPin
  #888580 + the grid 3-col gap 12px; the detail pill 61×32 pad 8/12 star
  14 — EXACT.
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **69/69 E2E** ✓.
- **43 screenshots** (6 new — the desktop band heading + card states, the
  map list card + grid, the detail rating pill, the mobile map card —
  VLM-verified via `scripts/capture-screens-v10-session29.mjs`);
  `.env.example` re-verified (covers every code-referenced var:
  DATABASE_URL, AUTH_SECRET, DEBUG_DBPATH + the reserved
  NEXT_PUBLIC_SITE_URL); docs aligned (README, AGENTS, CLAUDE, PAD v2.8,
  activity-map_SKILL v1.16.0, this plan, the worklog, docs/session_32.md).
