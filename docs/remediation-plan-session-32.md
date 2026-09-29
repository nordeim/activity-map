# Session 32 — Remediation Plan (mirror E2E + live re-measure → the mobile nav link-group model + the desktop footer pill growth)

Date: 2026-09-29 · Base commit: `440fa17` (main) · Agent: Super Z (session 32)

## 1. Context

Session 31 pushed the 404 hydration fix + the hero vh-model + the vibe
centering + the showcase parallax (`38c70f4` + `cfa147a`); the owner added the
raw session-31 conversation log (`440fa17`, `docs/session_37.md`) and
redeployed the mirror with the session-31 code (per `docs/start_server_log.txt`
— the production build + start log). This session re-cloned, re-read every
root doc + the session-31 plan + the worklog + `docs/session_36.md` +
`docs/session_37.md` + the start-server log, re-validated the codebase state
(env `DATABASE_URL="file:../db/custom.db"` with `db/custom.db` at the repo
root, vitest + playwright configs verified, `skills/` excluded), and ran the
full baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings
in `scripts/`) · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ ·
**73/73 E2E** ✓ — the codebase matches every session-31 documentation claim.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-31 CODE.** Verified by DOM signature: the hero vh-model (h1 y=319 at
1280×900, section −7/966, bg −85/1038, radius `32px 32px 60% 60% / 32px 32px
80px 80px`), the vibe heading centered (1203 @x=38), the showcase parallax
(matrix(1.16, …, 41.68)), and the generic 404 hydration fix (zero page errors
on an unknown route, the quoted path rendering). Functionally ALL GREEN: zero
console errors swept across 11 pages (/, /eat, /stay, /do, /map, /favourites,
/profile, a place detail, both legal pages, /login, the 404); the mobile
navbar end-to-end at 390 (52px border-box glass tab-bar — header
rgba(248,247,244,0.62) + blur(24px) saturate(1.5), the 12px link spans, the
icons at x 304/330/356, tap navigation with the active state moving, the
MapPin/Heart/User icon actions); the favourites round-trip (save → 1 card →
unsave → the empty state); the booking round-trip (native-setter fill →
"Request sent" → visible under Profile → My bookings). **No bugs found.**

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280×900 / 768×844 / 640×844 / 390×844):** every session-24→31 surface
re-verified UNCHANGED — the hero vh-model EXACT at 1280×900 (h1 y=319/115.2px,
section −7/966, bg −85/1038 with the radius string) and at 390×844 (h1
y=203/35.88px, bg 0/591 with `0px 0px 42% 42% / 0px 0px 48px 48px`); the vibe
heading centered (1203 @x=38); the showcase 1.16 zoom + parallax; the planner
pill (548×56, cream/35, blur-28); the mobile planner card (358×124 at the
126px gap) + the mobile category carousel (card 306×227 @x=18 y=578, VA
276×36 — ±1px of the session-31 record); the desktop category cards (263×215
at x=232/509/786 — the live's ARTICLES measure identical to the clone's
cards; the earlier "229×211 @x=249" read was the live's padded inner div, not
the card outline); the desktop floating pill + its links EXACT (Highlights
433/122, Eat 559/76, Stay 639/84, Do 727/74, Map 805/84 — the 13px/700/
+0.01em model); the band (h2 89.6px x=142 w=996); the browse page (h1 y=169,
chips 38px/12px/600 r-999 hairline, cards 392×564); the place detail (h1
y=226/82px, the 61×32 rating pill, the 89×36 Back); the map (2× 34×34 r999
zoom, 9× 12×12 pins); BOTH 404 designs (the slate generic — zero console
errors; the 46px in-app place-404); the footer legal row; the footer element
pads (pt-64/pb-56 desktop, pt-32/pb-24 at 390); the MOBILE footer pill (the
3-col grid 350×182 @x=20 at 390, r-28, gap 8, pad 8/10, 104×78 links with
20px icons + 11px/600 labels — EXACT).

**Two findings:**

## 3. Findings (verified by DOM measurement on the live app, 2026-09-29)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **Med** | **The mobile tab-bar's middle link group is now SHRINK-WRAPPED (`min-w-0 mr-2`), not flex-1-centered** — the four text links sit 4px further LEFT; the nav links also carry a `press-shrink` touch feedback + 44px min-height tap targets | At 390: the nav `flex items-center justify-between w-full px-4 h-12`; the middle group `flex items-center justify-center gap-3 min-w-0 mr-2` (NO flex-1) → the links measure x=**121**/192/222/259 (Highlights/Eat/Stay/Do; the logo 16/84 and the icons 304/330/356 unchanged). At 640: **246**/317/347/384. The links compute `min-height: 44px` (tap targets; the logo link too), the nav renders h-12 (48px) at y=2 inside the same 52px border-box header, and every nav link carries `press-shrink` (`transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s` + `:active { transform: scale(0.97) }`) | the middle group `no-scrollbar flex min-w-0 flex-1 items-center justify-center overflow-x-auto` → the links measure x=**125**/196/226/263 at 390 (flex-1 centers the group's 153px content inside the 204px share between the logo and the icons); no press feedback; the links are h-full (51px — LARGER tap targets than the live's 44px, so accessibility is not lost) |
| F2 | **Med** | **The desktop footer pill has GROWN (md+)** — bigger tiles, bigger icons, bigger radius | At md+ (768 and 1280): the pill renders **646×118** (r **34**, border 1px #E8E6DC, backdrop blur(40px) saturate(1.5), pad **12px 16px**, gap **12px**, one row of 6); the links are **92×92** tiles (1px black/0.04 border, white/0.55 bg, r-18) carrying **24px** icons over **12px**/600 labels (icon↔label gap 8) | the pill renders **506×96** (r 28, pad 8px 10px, gap 8) with **74×78** links, **20px** icons, **11px**/600 labels. The MOBILE (<md) pill is UNCHANGED on the live (the 3-col grid, max-w 390, r-28, gap 8, pad 8/10, ~104×78 links at 390, 117×78 at 640) — the clone matches it EXACTLY |

Non-gaps re-verified (keep, document): the mobile footer pill + the legal
row (exact at 390/640); the 52px border-box tab-bar header + its glass; the
desktop pill links; the desktop nav link positions; the hero/vibe/parallax
contracts; the planner + category cards + band + browse + detail + map + 404s
+ legal pages. The live's `min-height: 44px` on links / `50px` on buttons
applies SELECTIVELY (nav links yes; the VA pills no; some buttons yes) —
the clone's nav links are h-full (51px ≥ 44px), so the tap-target contract
is already met; the invisible deltas (nav h-12 at y=2 vs the clone's 51px
flush nav — the same 52px border-box header, the text center ±0.5px) are
recorded as measured non-gaps.

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — write the spec extensions first**: (a) `tests/e2e/mobile-navigation.spec.ts` — add a test pinning the text-link x positions at 390 (Highlights 119–123, Eat 190–194, Stay 220–224, Do 257–261 — the live's 121/192/222/259) and at 640 (Highlights 244–248, Eat 315–319, Stay 345–349, Do 382–386 — the live's 246/317/347/384) + the logo/icon anchors (16/304/330/356 at 390); add the press-shrink assertions (every nav link carries the class; the computed `transition-duration` 0.18s + `transition-timing-function` cubic-bezier(0.22, 1, 0.36, 1)). (b) `tests/e2e/home.spec.ts` footer test — UPDATE the desktop pill assertions to the live's growth (navW 640–652 — the live's 646; radius 34px; pad `12px 16px`; the links 90–94 wide and 90–94 tall; the icon ≥23px; the label 12px/600) while keeping the mobile assertions unchanged (350×182 grid — already pinned 348–352) | tests/e2e/mobile-navigation.spec.ts, tests/e2e/home.spec.ts | RED confirmed: every new/updated assertion fails against the unmodified tree |
| R1 | **The mobile nav link group (F1)**: `src/components/layout/Navbar.tsx` — the middle group drops `flex-1` and gains `mr-2` (shrink-wrapped like the live's `min-w-0 mr-2`; the `no-scrollbar`/`overflow-x-auto`/`min-w-0`/`justify-center`/`gap-3` safety valve stays); add the `press-shrink` class to the nav links (the logo link, the text links, the Map fold link, the right-cluster icon links). `src/app/globals.css` — add the `@utility press-shrink` (transition `transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s`) + the `:active` rule (`transform: scale(0.97)`) — the live's own utility, verbatim | src/components/layout/Navbar.tsx, src/app/globals.css | the R0a assertions GREEN (the links land 121/192/222/259 at 390 — the shrink-wrap + mr-2 geometry: 358 − (84 + 154 + 8 + 70) = 42 → two 21px justify-between gaps put the group at x=121; the icons stay at 304/330/356); the existing mobile-nav tests stay GREEN (one line, no overlap, the 52px header, the glass, the tracking, taps, the 430 cap) |
| R2 | **The desktop footer pill growth (F2)**: `src/components/layout/SiteFooter.tsx` — at md+: the links `md:h-[92px] md:w-[92px]`, the icon `md:h-6 md:w-6` (24px), the label `md:text-[12px]`, the pill `md:rounded-[34px] md:py-3 md:px-4 md:gap-3` (pad 12/16, gap 12). The mobile classes untouched (the grid 3-col, max-w-390, r-28, py-2 px-2.5, gap-2, h-[78px] links, h-5 icons, 11px labels). Resulting pill: 6×92 + 5×12 + 2×16 + 2×1 = **646 × 118** | src/components/layout/SiteFooter.tsx | the R0b assertions GREEN (646×118, r-34, pad 12/16, the 92×92 tiles with 24px icons over 12px/600 labels); the mobile footer assertions stay GREEN (350×182, the 104×78 links) |
| R3 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 73+ E2E; re-measure every remediated surface against the live on the local server (the link x positions at 390/640; the footer pill at 768/1280 + the mobile footer); capture the dev-server screenshots into `docs/screenshots/`; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog + write `docs/session_38.md`; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- Dropping `flex-1` from the middle group removes the "fill the space"
  behavior — the no-scrollbar overflow safety valve must survive: `min-w-0`
  + `overflow-x-auto` keep the group scrollable (not sliding under the logo
  or the icons) when the viewport is too narrow for the four links. The
  live's own group carries exactly these classes (`min-w-0` + the centering)
  — the clone adds `overflow-x-auto` + `no-scrollbar` on top, which only
  activates below ~360px.
- The shrink-wrap moves the links 4px LEFT; nothing on the row overlaps (the
  logo ends at 100, the group starts at 121 — a 21px gap; the icons stay
  right). The overlap/one-line specs re-run in the full gate.
- The press-shrink `:active` transform must not disturb the E2E's
  click-driven navigations — the transform only applies DURING the press
  (Playwright's click completes before any measurement), and the transition
  list composes with the existing `transition-colors` on the text links (the
  live's own links carry both).
- The footer pill at 768 renders 646 wide inside the 728px max-w-5xl inner —
  it fits with 41px margins either side; `md:flex-wrap` stays as the safety
  for 768's padding edge cases (the live's own pill doesn't wrap there).
- The footer pill grows INSIDE the footer's own padding (pt-64/pb-56) — no
  page-bottom spacing contract changes (the browse 96px last-card→footer
  margin is measured to the footer's TOP edge).
- The E2E footer link-width assertion window (90–94) must tolerate the
  fractional rendering the live itself shows (92.0 measured; the live's own
  computed values run 91.99–92.01 at the sampled DPR).

## 6. Execution record (2026-09-29, post-delivery)

All remediation rows executed in TDD order (RED confirmed on the unmodified
tree — every touched spec failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the shrink-wrapped
  link-position tests at 390 (Highlights 119–123 / Eat 190–194 / Stay 220–224
  / Do 257–261 + the logo 16 / icons 304/330/356 anchors) and at 640
  (244–248 / 315–319 / 345–349 / 382–386); the press-shrink contract (the
  class on the logo + a text link + an icon link + the computed
  `transition-duration` 0.18s + `cubic-bezier(0.22, 1, 0.36, 1)`); the footer
  test updated to the grown desktop pill (navW 640–652, navH 115–121, radius
  34px, pad `12px 16px`, gap 12px, the links 90–94 square, the icon ≥23px,
  the label 12px/600) with the mobile assertions unchanged. En-route spec
  fix: the first text-link filter required an svg-less anchor — the clone's
  text links carry HIDDEN desktop icons (`hidden md:block`), so the selection
  moved to label-based lookups.
- **R1** — the mobile nav link group: `Navbar.tsx`'s middle group dropped
  `flex-1` and gained `mr-2 md:mr-0` (the live's own shrink-wrap; the
  `no-scrollbar`/`min-w-0`/`justify-center`/`gap-3` safety valve stays);
  every nav link (the logo, the four text links, the Map fold link, the three
  icon actions) carries `press-shrink`; `globals.css` gained the `@utility
  press-shrink` + the UNLAYERED `.press-shrink:active { transform:
  scale(0.97) }` rule (the unlayered placement beats every @layer utility —
  the map-zoom-override mechanism). The 200ms color transition moved from
  the anchor to the LABEL span (the live's own split — two `transition`
  shorthands on one element are competing declarations and CSS would silently
  drop one of them). Verified: the links land 121/192/222/259 at 390 and
  246/317/347/384 at 640 — EXACT against the live.
- **R2** — the desktop footer pill growth: `SiteFooter.tsx` at md+ renders
  `md:rounded-[34px] md:gap-3 md:py-3 md:px-4` with the links
  `md:h-[92px] md:w-[92px]` carrying `md:h-6 md:w-6` icons over
  `md:text-[12px]` labels; the mobile classes untouched. Verified: the pill
  renders 646×118 @x=317 at 1280 and at 768 with the 92×92 tiles in one row
  — EXACT against the live; the mobile pill re-verified UNCHANGED (350×182
  @x=20 at 390, the 104×78 tiles).
- **Side-by-side verification** — every remediated surface measured on the
  local production build AND the dev server: the mobile nav links
  121/192/222/259 (the live 121/192/222/259); the 640 state 246/317/347/384
  (the live 246/317/347/384); the desktop footer pill 646×118/r-34/pad
  12px 16px/gap 12 with the 92×92 tiles + 24px icons + 12px/600 labels (the
  live identical); the mobile footer 350×182/r-28/pad 8/10/gap 8/104×78
  (unchanged, the live identical).
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **76/76 E2E** ✓ (the
  new shrink-wrap + press-shrink + footer contracts; the whole suite
  re-run — zero regressions).
- **61 screenshots** (4 new — the shrink-wrapped mobile nav at 390 + 640,
  the grown 646×118 desktop footer pill, the unchanged mobile footer for
  the record — captured via `scripts/capture-screens-v13-session32.mjs`
  against the dev server, geometry re-verified on the captured state);
  `.env.example` re-verified (covers every code-referenced var:
  DATABASE_URL, AUTH_SECRET, DEBUG_DBPATH + the reserved
  NEXT_PUBLIC_SITE_URL); docs aligned (README, AGENTS, CLAUDE, PAD v2.11,
  activity-map_SKILL v1.19.0, this plan, the worklog, docs/session_38.md).
