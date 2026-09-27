# Session 24 — Remediation Plan (deployed-mirror + live-source dual audit → the filter-shell design system: chips, card shells, the map command center, the mobile section contract)

Date: 2026-09-27 · Base commit: `7dba315` (main) · Agent: Super Z (session 24)

## 1. Context

Session 23 pushed the footer + tab-bar + page-bottom parity (`97969ba` +
`346f4ad` + `7dba315`); the owner redeployed the mirror with the session-23
code (verified this session by DOM signature: the footer glass pill 506×96
@x=387 with the 1px #E8E6DC border + `blur(40px) saturate(1.5)`, the 52px
border-box tab-bar, the mobile footer 350/104×78/pad 32-24, and every
page-bottom chain on contract). This session re-cloned, reviewed every root
doc + the session 23/24 logs + the worklog + the start-server log, ran the
full baseline gate, then executed the dual-site browser audit.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **61/61 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`, running the session-23
code):** functionally ALL GREEN — every page loads with ZERO console errors;
the mobile navbar works end-to-end (fixed cream-glass tab-bar 52px, tap
navigation, icon actions, scroll persistence, no overflow at 390); the
favourites round-trip (save 201 → visible → unsave → 0 cards); the booking
round-trip (submit → "Request sent" → visible under Profile → My bookings);
every session-23 contract re-verified EXACT (footer glass pill, tab-bar 52,
the home 32/0 + 22/32 chains, the browse/map/detail 96px chains).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/390):** every session-22/23 surface re-verified UNCHANGED — the hero
(−86/1010 @1280, 0/591 @390, h1 y=290/203), the desktop pill (820×56 @x=230,
r999, #E8E6DC), the mobile glass (rgba(248,247,244,0.62) + blur(24px)
saturate(1.5), spans 12px ls −0.12px), the footer glass pill, the route h3s
(20px/600/−0.4px), the stay h3s (18px/500/−0.54px), the sights grid
(1120/360), the blue band #4D61FF, the eat h1 (y=168/55px), the detail split
(h1 y=225/82px, card 1152×688 r36, inputs 44/16px), the profile
(chrome-less, h1 72px y=203), the login chrome — EXCEPT the findings below.
**The live has evolved a "filter-shell" design system** (a mobile-override
stylesheet: `.roam-app section.relative.overflow-*` paddings, sticky
`.planner-filter-shell`/`.discover-filter-shell` wrappers, 600-weight filter
pills with hairline borders) that the clone has never measured.

## 3. Findings (verified by DOM measurement on the live app, 2026-09-27)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **Filter chips (eat/stay/do)** — weight/color/border/mobile height/active bg | 12px/**600**; inactive **#555550** on white with a **1px rgba(14,14,14,0.08) border**; pad 10px 16px (content height 38 at md); **min-height 44px below md** (touch targets); ACTIVE = **violet #571AFF bg + white text** (600) | 12px/500; inactive ink/#3A3A3A, no border; fixed `h-[38px]` at every width; active **ink** bg; px-4 |
| F2 | **High** | **Browse card shell (eat/do grids + favourites)** — never measured since session 3 | the `article` carries **bg white + border 1px rgba(14,14,14,0.08) + radius 28 (md) / 24 (phones) + shadow `0 18px 44px rgba(14,14,14,0.08)`** — a floating card; internals identical (h-[372px] photo, p-5 body, `min-h-[190px]` row) | flat composite — the article has NO radius/border/shadow/bg |
| F3 | **High** | **Map search/filter shell REDESIGNED** (since session 12) | a STICKY shell (`.discover-filter-shell` — sticky **top-10 phones / top-96 md**) wrapping an inner **r-30/r-34 glass** (bg **white/92 phones / white/78 md**, border 1px **white/70**, pad 10/8, shadow `0 8px 22px rgba(0,0,0,0.10)`) containing the ORIGINAL search pill (h-48, r-full, black/5, cream) + the filter button; the category pills a centered row BELOW (mt 14 phones / 52px gap md) at **44px phones / 41px md, weight 600**; the shell is FULL-WIDTH (1216 @1280) | static cream/55 h-48 pill (max-w-1138), the pills 41px/**500** below with `mt-4`; nothing sticky |
| F4 | **Med** | **Mobile heading-section contract** — the live's uniform override `padding: 112px 16px 22px` on first sections | browses/map/favourites/detail sections all compute **pt 112 / px 16 / pb 22** on phones (content under the fixed glass bar): h1 y = **112** (browses/map), **188** (favourites), Back-pill y = **112** (detail) | spacer(52) + pt-16/px-16/pb-8 → h1 y **116** (browses/map) / **192** (favourites); detail pt-4 → Back y **68**; favourites px-5 (20) |
| F5 | **Med** | **Browse planner stickiness + chrome** | phones: the shell is **sticky top-10**, card pad **10**, hairline white/70; md: sticky **top-96**, card pad **6 (p-1.5)**, **solid white**, border white/70, shadow `0 8px 22px rgba(0,0,0,0.10)` (+ inset), h **68**; the chips row follows at **mt 14** | phones: static (session-8 "NOT sticky"), pad 12, no border; md: sticky top-**76**, pad 10, white/92, no border, shadow 0 2 12, h 72; chips row mt-4 (16) |
| F6 | **Med** | **Detail Back pill** | **36px tall, 89 wide**, 14px/600, pad **8px 16px**, white, r-full, no border | 40 tall, 103 wide, `py-2.5 pl-5 pr-7`, shadow-float |
| F7 | **Low** | **Heart disc on cards** | **36×36** (`w-9 h-9`, svg 16) — the AGENTS.md "36px black/45 disc" is right; the code drifted | `h-11 w-11` = **44×44** |
| F8 | **Low** | **Map pills weight** | **600** (h 41 md / 44 phones; the violet-tinted ACTIVE + hairline inactive ALREADY match) | `font-medium` = 500 |
| F9 | **Low** | **Favourites empty state** | r-28, border **rgba(14,14,14,0.08)**, **NO shadow**, **px 0**, py-16, icon circle 48 | `shadow-card`, px-6, border black/8 |
| F10 | **Low** | **Browse grid gap (phones)** | **18px** | `gap-5` = 20px (md 20 ✓ matches) |

Non-gaps re-verified (keep, document): the desktop section paddings
(`96px 32px 32px` — the clone's md values match EXACTLY, only the mobile
override differs); the map pills' active/inactive COLORS (already
session-16-correct); the chips' gap-2 row and the `-mx` bleed (equivalent);
the search input's inner pill design on the map (the live nests the ORIGINAL
pill inside the new shell — the clone's pill is already correct); the
planner's internal field pills (r-22 cream rows — unchanged); the dormant
eyebrow P above every browse h1 (h=0 — consistent with the live's DOM).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `browse.spec.ts` — new contract "the filter chips match the live (session-24)": @1280 the "Open now" chip fontWeight 600, color rgb(85,85,80), borderTopWidth 1px + color rgba(14,14,14,0.08); clicking it turns the bg rgb(87,26,255); @390 the chip height 44; (b) `browse.spec.ts` — new contract "the browse cards carry the live's floating shell (session-24)": @1280 the first article radius 28px, borderTopWidth 1px rgba(14,14,14,0.08), boxShadow containing "0px 18px 44px", backgroundColor white; @390 radius 24px; (c) `browse.spec.ts` — new contract "the map search shell is the live's sticky command center (session-24)": @1280 the shell (the rounded-full search pill's rounded-34 ancestor) position sticky, top 96px, radius 34px, backgroundColor with α (white/78), borderTopWidth 1px + white-ish; the pills fontWeight 600; (d) `browse.spec.ts` — new contract "the mobile heading sections sit at the live's 112px contract (session-24)": @390 the eat h1 y 108–116, the favourites h1 y 184–192, the detail Back pill height 36; (e) `browse.spec.ts` — extend the card test: the save button 36×36 | tests/e2e/browse.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **Chips (F1)**: `h-[38px] px-4 text-xs font-medium` → `min-h-[44px] md:min-h-[38px] px-4 py-[10px] text-xs font-semibold border`; inactive `bg-white text-[#555550] border-[rgba(14,14,14,0.08)]` (drop the special-chip ink override); active `bg-roam text-white border-[rgba(14,14,14,0.08)]` (violet, not ink) | `src/components/places/CategoryExplorer.tsx` | the R0a spec GREEN; the existing 38px@1280 pin stays GREEN (content height 38: 10+16+10+2) |
| R2 | **Card shell (F2 + F7)**: the article `group h-full` → `group h-full overflow-hidden rounded-[24px] border border-[rgba(14,14,14,0.08)] bg-white shadow-[0_18px_44px_rgba(14,14,14,0.08)] md:rounded-[28px]`; SaveButton `h-11 w-11` → `h-9 w-9` | `src/components/places/PlaceCard.tsx`, `src/components/places/SaveButton.tsx` | the R0b/R0e specs GREEN; the photo/body internals stay GREEN (the shell is additive; border-box keeps the column width) |
| R3 | **Map command center (F3 + F8)**: wrap the existing search pill + filter button in `sticky top-[10px] z-30 md:top-24` + inner `rounded-[30px] border border-white/70 bg-white/92 p-2.5 shadow-[0_8px_22px_rgba(0,0,0,0.10)] md:rounded-[34px] md:bg-white/78 md:p-2`; the pills row moves below the shell: `mt-[14px] flex justify-center gap-2 md:mt-[52px]`-equivalent (measure on the dev server — target pills-gap 52px @1280 / 14px @390 from the shell bottom); pills `h-[41px] px-5 font-medium` → `min-h-[44px] md:h-[41px] px-4 font-semibold`; the wrapper's `max-w-[1138px]` → full-width (the section's px-4/md:px-8 bounds it) | `src/components/map/MapExplorer.tsx` | the R0c spec GREEN; the 9-cards/canvas-620/stats pins stay GREEN |
| R4 | **Mobile section contract (F4)**: browses + map `px-4 pb-8 pt-16` → `px-4 pb-[22px] pt-[60px]`; favourites `px-5 pb-8 pt-16` → `px-4 pb-[22px] pt-[60px]`; detail `px-4 pt-4` → `px-4 pt-[60px]` (all `md:*` unchanged — desktop verified identical); the browse grid `gap-5` → `gap-[18px] md:gap-5` | `src/components/places/CategoryExplorer.tsx`, `src/components/map/MapExplorer.tsx`, `src/components/favourites/FavouritesView.tsx`, `src/app/(app)/place/[slug]/page.tsx` | the R0d spec GREEN (@390 h1 y 112/188, Back y 112); the desktop pins (h1 y 160–176 / 225 / 244) stay GREEN |
| R5 | **Planner stickiness + chrome (F5)**: the shell `relative md:sticky md:top-[76px] md:z-40` → `sticky top-[10px] z-30 md:top-24`; the card mobile `p-3` → `p-2.5` + `border border-white/70`; desktop `md:p-2.5` → `md:p-1.5 md:bg-white md:shadow-[0_8px_22px_rgba(0,0,0,0.10)]`; the chips row wrapper `mt-4` → `mt-[14px] md:mt-5` | `src/components/planner/BrowsePlanner.tsx`, `src/components/places/CategoryExplorer.tsx` | the unified-card spec stays GREEN (r-30 + shadow /0.1 pins); dev-server side-by-side: sticky at 10px @390 / 96px @1280, h 68 @1280 |
| R6 | **Back pill (F6)**: `py-2.5 pl-5 pr-7 … shadow-float` → `py-2 px-4 text-sm font-semibold` (h 36: 8+20+8; keep the shadow — re-measure on the dev server, drop if the live renders none) | `src/app/(app)/place/[slug]/page.tsx` | the R0d Back-height pin GREEN |
| R7 | **Favourites empty state (F9)**: `rounded-[28px] border border-black/[0.08] bg-white px-6 py-16 … shadow-card` → `rounded-[28px] border border-[rgba(14,14,14,0.08)] bg-white py-16` (no shadow, no px) | `src/components/favourites/FavouritesView.tsx` | dev-server side-by-side vs the live's empty card |
| R8 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 61+ E2E; re-measure every remediated surface against the live on the dev server (chips weight/border/active-violet/44px, the card shell r-28/24 + hairline + 18/44 shadow, the map shell sticky/r-34/glass + pills 600, h1 y 112/188 @390 + the desktop pins unchanged, the Back pill 36×89, the planner sticky 10/96 + pad 10/6 + h 68, the empty state); refresh the affected screenshots; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks & guards

- **Tailwind v4 CSS-first**: every change is an arbitrary-value or stock
  utility — no `tailwind.config.*`; the mobile-nav safety valve
  (`no-scrollbar`) and the five failure-class pins stay untouched; the new
  assertions are additive — the existing pin set must keep passing.
- **The sticky mobile planner (R5)** introduces the first mobile-sticky
  element outside the tab-bar: the shell z-30 stays UNDER the tab-bar (z-40)
  and the date popover (z-30000) — verify no overlap at 390 after the change
  (the chips row must remain tappable below the stuck planner).
- **The card shell (R2)** changes the article's box model (border-box + the
  2px border): the grid columns keep their width; the photo's h-[300/372px]
  and the body's p-5 are UNCHANGED (the live nests the identical internals);
  the `overflow-hidden` clips the hover scale + the rounded photo corners.
- **The map shell (R3)** restructures MapExplorer's filter area — the
  Leaflet canvas, the stats row, the 9-card list and their pins are untouched;
  the search input keeps its aria-label ("Search the map") so the existing
  locator-based pins survive; the `max-w-[1138px]` removal must be verified
  at 1280 (full-width 1216) — the E2E pin asserts width > 1000 (still true).
- **R4's pt-[60px] arithmetic** (52px spacer + 60px = the live's 112px):
  every mobile heading was measured on BOTH sites; do not eyeball — re-measure
  after the change (the session-23 lesson: probe artifacts happen; the dev
  server is the source of truth). The favourites' mobile px-5 → px-4 rides
  the same edit (the live's section.px-5 override computes to 16px).
- **Do not regress**: 42 unit, the API envelope, the seed counts, browse
  purity, Leaflet `ssr:false`, single-exit db-path helpers, the `.env`
  pinning, the shared E2E storageState, the rate limiter, the login
  white-body inline style, the profile `(bare)` contract, the footer
  session-23 contract, the tab-bar 52px + glass pins, the hero geometry, the
  route choreography, the stay showcase, the sights grid, the desktop
  heading pins (y 168/225/244 — the mobile edits must not touch the md:
  classes).

## 6. Execution record (2026-09-27, post-push state)

All eight remediation rows executed in TDD order (RED confirmed on the
unmodified tree → GREEN on the modified tree):

- **R0** — the five contracts added; all five verified RED first (plus one
  locator fix: `Favourites` exact-match, and the oklab-α border assertion
  rewritten to parse the alpha per the documented gotcha).
- **R1** — the chips: `min-h-[44px] md:min-h-[38px] px-4 py-[10px] text-xs
  font-semibold border` with the hairline + #555550 inactive + the violet
  active; measured EXACT @390 (44/600/#555550/1px) and @1280 (38/600).
- **R2** — the card shell + the 36px heart disc + the 16px svg; measured
  EXACT (r-24/28, hairline, `0 18px 44px /0.08`, 392 wide @1280, heart 36,
  grid gap 18 phones).
- **R3** — the map command center: sticky top-10/96, r-30/34 glass
  (white/92 phones / white/78 md), white/70 hairline, `0 8px 22px /0.10`,
  the 56/48px cream/55 filter button (one responsive correction caught by
  the side-by-side: the button is 56 only on phones), the pills row below at
  14/52px gaps, pills 44/41 at weight 600. Measured EXACT.
- **R4** — the mobile section contract: browses/map/favourites
  `pt-[60px] pb-[22px]` + the favourites' full-bleed texture (the main's px
  removed, the section owns it) + the detail `pt-[60px]`; every h1 anchor
  EXACT (112/112/188; the Back pill 112).
- **R5** — the planner: sticky at both breakpoints, the chrome matched
  (pad 10/6, solid white + white/70 + `0 8 22 /0.10` at md, h 68 EXACT; the
  mobile card 270 EXACT after grouping date+people at the 6px gap and the
  56px phone buttons).
- **R6** — the Back pill: 36×89 @y=112, no shadow — EXACT.
- **R7** — the favourites empty state: shadowless, px-0, 358@x=16 — EXACT.
- **R8** — gates: lint ✓ (2 pre-existing warnings) · typecheck ✓ · 42 unit
  ✓ · build ✓ · 27/27 smoke ✓ · **66/66 E2E** ✓ (5 new contracts; every
  prior pin green — one stale pin CORRECTED en-route: the session-10
  "44×44 heart" reading had encoded the clone's own drift; the live
  measures 36 on BOTH the browse cards and the detail hero).
- 20 screenshots (14 refreshed via capture-screens-v3 + crop-sections-v3;
  3 footer captures re-run via capture-screens-v4-footer; 3 NEW filter-shell
  captures via capture-screens-v5-shell: the desktop + mobile map command
  center + the mobile browse filter shell — VLM-verified). `.env.example`
  re-verified (covers every code-referenced var). Docs aligned: README,
  AGENTS, CLAUDE, PAD (v2.3), activity-map_SKILL (v1.11.0), this plan, the
  worklog.
