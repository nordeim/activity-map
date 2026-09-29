# Session 33 — Remediation Plan (mirror E2E + live re-measure → the desktop footer pill's scroll-linked growth + the link hover treatment)

Date: 2026-09-29 · Base commit: `2432bc9` (main) · Agent: Super Z (session 33)

## 1. Context

Session 32 pushed the mobile-nav shrink-wrap + press-shrink + the desktop
footer-pill growth (`8d588bf` + `69bf401`); the owner added the session-32 logs
(`2432bc9`). This session re-cloned, re-read every root doc + the session-32
plan + the worklog + `docs/session_38.md` + `docs/session_39.md` + the
start-server log, re-validated the codebase state (env
`DATABASE_URL="file:../db/custom.db"` with `db/custom.db` at the repo root,
vitest + playwright configs verified, `skills/` excluded), and ran the full
baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings
in `scripts/`) · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ ·
**76/76 E2E** ✓ — the codebase matches every session-32 documentation claim.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-32 CODE.** Verified by DOM signature: the desktop footer pill
646×118 @x=317 with the 92×92 tiles + 24px icons + 12px/600 labels; the
mobile nav shrink-wrap (121/192/222/259 at 390; 246/317/347/384 at 640) with
`press-shrink` on every link; the 52px border-box tab-bar. Functionally ALL
GREEN: zero console errors swept across 11 pages (/, /eat, /stay, /do, /map,
/favourites, /profile, a place detail, both legal pages, /login, the 404);
the mobile nav end-to-end (tap navigation with the active state moving, the
MapPin/Heart/User icon actions); the favourites round-trip (save → 1 card →
unsave → the empty state); the booking round-trip (native-setter fill →
"Request sent" → visible under Profile → My bookings). **No bugs found.**

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280×900 / 768×844 / 640×844 / 390×844):** every session-24→32 surface
re-verified UNCHANGED — the hero vh-model EXACT at 1280×900 (h1 y=319/115.2px,
section −7/966, bg −85/1038 with the radius string) and at 390×844 (h1
y=203/35.9px, hero 0/591, bg `0px 0px 42% 42% / 0px 0px 48px 48px`); the vibe
heading centered (1203 @x=38, center 640); the showcase 1.16 zoom + parallax
(matrix(1.16, …)); the planner pill (548×56); the mobile planner card
(358×124 @y=365); the mobile category carousel (306×227 @x=18 y=578); the
desktop category cards (263×215 @x=231/508/786); the desktop floating pill
(820×56 @x=230, r-999, white) with the links EXACT (433/559/639/727/805); the
band (h2 89.6px x=142 w=996); the browse page (h1 y=169/55px, chips 38px/12px
600 r-999 hairline, cards 392×564); the place detail (h1 y=226/82px, the
61×32 rating pill, the 89×36 Back); the map (2× 34×34 r999 zoom, 9× 12×12
pins); the generic 404 (the 72px slate-300 "404" on the slate-50 container
with the quoted path); the footer legal row + pads (pt-64/pb-56, the 1px
black/[0.05] top hairline, © 12px #8A8780); the MOBILE footer pill (350×182
@x=20, r-28, pad 8/10, gap 8, 3-col grid, 104×78 links — EXACT at 390 and
117×78 at 640); the home stay pills (34px Book Now with the 1px border); the
route time pills (28×101 with the 0 8px 22px /0.06 shadow); the favourites
h1 y=245; the profile chrome-less contract (h1 y=203, the username).

**Four findings** (all in the footer block; everything else swept clean):

## 3. Findings (verified by DOM measurement on the live app, 2026-09-29)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The desktop footer pill (md+) is a SCROLL-LINKED CONTINUOUS GROWTH driven by the footer's visible fraction** — compact while offscreen, interpolating linearly to grown as the footer scrolls into view, shrinking back when it leaves | The pill renders inline styles updated on scroll: `gap 8+4p`, `padding (8+4p)px (10+6p)px`, `border-radius 28+6p`, the links `width 74+18p × height 78+14p`, `border-radius 18+6p`, the icons `20+4p`, the labels `11+1p` — where `p = clamp((viewportBottom − footerTop)/footerHeight, 0, 1)` (fit to ±0.02 across 10 sampled scroll positions at 1280×900: y=1000→506/gap 8, y=901→537/gap 8.9, y=825→572/gap 9.9, y=675→640/gap 11.8, rest→646/gap 12). The transitions smooth the per-frame updates: the pill `transition: gap 120ms linear, padding 120ms linear, border-radius 120ms linear`; the link `transition: width 120ms linear, height 120ms linear, border-radius 120ms linear, transform 300ms, background 300ms, color 300ms, box-shadow 300ms`. Settled states: compact **506×96** (r-28, pad 8/10, gap 8, links 74×78 r-18, icons 20px, labels 11px) ↔ grown **646×118** (r-34, pad 12/16, gap 12, links 92×92 **r-24**, icons 24px, labels 12px). Same behavior at 768. **Below md the pill NEVER grows** (the mobile 3-col model, transition `none` — verified static at 390 at top + bottom) | The pill renders the grown model STATICALLY (646×118 at all times — the session-32 classes `md:rounded-[34px] md:gap-3 md:py-3 md:px-4` + `md:h-[92px] md:w-[92px]`); no reveal, no compact state, the grown link radius 18 (not 24) |
| F2 | **Med** | **The footer links carry a VIOLET HOVER treatment at BOTH breakpoints** — translate + scale + the #571AFF fill + white text + the violet glow | Measured with a real pointer at 1280 (grown) and 390: `transform: matrix(1.1, 0, 0, 1.1, 0, -12)` (scale 1.1 + translateY −12 = `hover:-translate-y-3 hover:scale-110`), `background rgb(87, 26, 255)`, `color rgb(255, 255, 255)`, `borderColor rgb(87, 26, 255)`, `box-shadow … rgba(87, 26, 255, 0.28) 0px 16px 34px`; the svg carries its own `group-hover:scale-110` with `transition-transform duration-300` (measured matrix(1.1) on the svg). The link class list: `transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-110 hover:border-[#571AFF] hover:bg-[#571AFF] hover:text-white hover:shadow-[0_16px_34px_rgba(87,26,255,0.28)]` (the inline transition list wins at md+; at mobile the computed reads `transform 0.3s, background 0.3s, color 0.3s, box-shadow 0.3s`) | No hover classes at all — bare `transition-colors` on the link, nothing on the svg |
| F3 | **Low** | **The pill carries a soft box-shadow at BOTH breakpoints** | `box-shadow: rgba(14, 14, 14, 0.08) 0px 2px 12px 0px` (inline on the pill; verified at 1280 and 390) | No shadow on the footer pill |
| F4 | **Low** | **The icon stroke + the label tracking** | All six icons carry `stroke-width="2.1"` (verified in both states); the labels `tracking-[-0.01em]` (−0.12px at 12px, −0.11px at 11px, measured in both states) | `strokeWidth={1.8}`; no tracking on the label |

Non-gaps re-verified (keep, document): the grown pill's `items-end` (uniform
tiles — no visual delta, adopted for faithfulness); the label spacing
mechanism (the live's `mt-2` on the span vs the clone's `gap-2` on the link —
identical 8px); the two zero-entries in the live's serialized hover shadow
(the platform's composition artifacts — pinned by substring); the mobile pill
static + transition `none`; the legal row + footer pads exact.

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — rewrite the footer test first**: `tests/e2e/home.spec.ts` footer test — (a) at page load (footer offscreen) measure the COMPACT model (navW 500–512, navH 93–99, radius 28px, pad `8px 10px`, gap 8px, links 72–76 × 76–80, icon 19–21, label 11px/600); (b) scroll to the page bottom (expect.poll for the 120ms transition to settle) → the GROWN model (navW 640–652, navH 115–121, radius 34px, pad `12px 16px`, gap 12px, links 90–94 square, the link radius 23–25, icon ≥23, label 12px/600) — the existing grown assertions kept, moved after the scroll; (c) the INTERPOLATION pin — scroll to the footer's half-visibility (footerTop − vh + height/2) → poll gap to 9.6–10.4 and linkW to 81–85 (the continuous model, not a binary toggle); (d) the transition contracts — the pill's `transition` contains `gap 120ms linear` (md); the link's contains `width 120ms linear` AND `transform 300ms` (md); at 390 the link's reads exactly the 4-prop hover list (`transform 0.3s, background 0.3s, color 0.3s, box-shadow 0.3s`); (e) the pill's shadow `rgba(14, 14, 14, 0.08) 0px 2px 12px` at 1280 AND 390; (f) the HOVER contract — hover the first link (grown, 1280) → the computed transform `matrix(1.1, 0, 0, 1.1, 0, -12)`, bg `rgb(87, 26, 255)`, color `rgb(255, 255, 255)` + the svg's own `matrix(1.1, 0, 0, 1.1, 0, 0)`; (g) the icon `stroke-width` attribute "2.1" + the label letter-spacing −0.12px at 12px; (h) the mobile (390) block unchanged + the link 102–106 × 76–80 | tests/e2e/home.spec.ts | RED confirmed: the compact/interpolation/transition/shadow/hover/stroke/tracking/link-radius assertions all fail against the unmodified tree (the grown-only assertions still pass where they run post-scroll) |
| R1 | **The scroll-linked growth (F1)**: `src/components/layout/SiteFooter.tsx` becomes a client component — a rAF-throttled passive scroll/resize handler sets `--footer-p` (the footer's visible fraction, clamped 0–1) on the footer element; the pill/nav at md+ interpolates via arbitrary-value calcs (`md:gap-[calc(8px+var(--footer-p,0)*4px)]`, `md:rounded-[calc(28px+var(--footer-p,0)*6px)]`, `md:py-[calc(8px+var(--footer-p,0)*4px)] md:px-[calc(10px+var(--footer-p,0)*6px)]`); the links (`md:h-[calc(78px+var(--footer-p,0)*14px)] md:w-[calc(74px+var(--footer-p,0)*18px)] md:rounded-[calc(18px+var(--footer-p,0)*6px)]`); the icons (`md:h-[calc(20px+var(--footer-p,0)*4px)] md:w-[calc(20px+var(--footer-p,0)*4px)]`); the labels (`md:text-[calc(11px+var(--footer-p,0)*1px)]`). `src/app/globals.css` gains `@utility footer-pill-transition` (`transition: gap 120ms linear, padding 120ms linear, border-radius 120ms linear`) used as `md:footer-pill-transition` + `@utility footer-link-transition` (mobile: `transform 300ms, background 300ms, color 300ms, box-shadow 300ms`) with the unlayered md media override adding `width 120ms linear, height 120ms linear, border-radius 120ms linear` — the live's own lists. The mobile classes untouched (the static 3-col grid — the var is inert below md). SSR renders p=0 (the compact model — the live's own initial state) | src/components/layout/SiteFooter.tsx, src/app/globals.css | The R0c/R0d assertions GREEN (the interpolation + the transition lists); the existing mobile-nav + browse footer tests stay GREEN |
| R2 | **The hover treatment + the chrome details (F2–F4)**: the links gain `footer-link-transition hover:-translate-y-3 hover:scale-110 hover:border-[#571AFF] hover:bg-[#571AFF] hover:text-white hover:shadow-[0_16px_34px_rgba(87,26,255,0.28)]`; the svg gains `transition-transform duration-300 group-hover:scale-110` + `strokeWidth={2.1}`; the span gains `tracking-[-0.01em]`; the pill gains `shadow-[0_2px_12px_rgba(14,14,14,0.08)]` + `md:items-end` | src/components/layout/SiteFooter.tsx | The R0e–R0g assertions GREEN (the hover matrix/violet fill, the shadow at both breakpoints, the stroke attribute, the letter-spacing) |
| R3 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 76+ E2E; re-measure the remediated surfaces against the live on the dev server at the same scroll states (compact at top, the midpoint sample, grown at bottom, the hover state); capture the dev-server screenshots into `docs/screenshots/`; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog + write `docs/session_40.md`; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- The CSS-var interpolation must stay INERT below md: the `md:`-scoped calcs
  guarantee it — the mobile pill's classes are untouched and the var is only
  read by md+ arbitrary values (the live's own mobile CSS similarly overrides
  its inline styles).
- The 120ms transitions mean post-scroll measurements need settling: the
  E2E uses `expect.poll` (and the side-by-side the same), never an instant
  read after `scrollTo`.
- The compact state at md+ changes the OFFSCREEN page height by ~22px: the
  footer's own pads (pt-64/pb-56) are constant and the page-bottom spacing
  contracts measure to the footer's TOP edge — unaffected. The live shows the
  same behavior (its own document height differs between scroll states).
- The `hover:scale-110` + `hover:-translate-y-3` compose into ONE transform
  (`matrix(1.1, 0, 0, 1.1, 0, -12)`) — Tailwind composes the translate/scale
  utilities through `--tw-translate-y`/`--tw-scale`; the E2E asserts the
  matrix string, so the class ORDER in the string doesn't matter, but the
  composed result must match exactly.
- Two `transition` shorthands on one element are competing declarations
  (the session-32 lesson): the link's transition comes from ONE utility
  (`footer-link-transition`) — the old `transition-colors` class must be
  REMOVED (its color entry is already inside the utility's list).
- The label font-size and the icon sizes snap per scroll frame (no
  font-size/width transition in the lists) — matching the live's own
  per-frame re-render; the pill/link box values transition smoothly.
- `page.goto` at 1280 renders the footer offscreen (compact) — any spec
  asserting the grown geometry MUST scroll first; the browse.spec.ts /
  mobile-navigation.spec.ts footer checks are existence-only (verified) and
  stay green in both states.

## 6. Execution record (2026-09-29, post-delivery)

All remediation rows executed in TDD order (RED confirmed on the unmodified
tree — every touched spec failing — then GREEN):

- **R0** — the footer test rewritten and RED-verified: the compact block
  (navW 500–512, navH 93–99, r-28, pad `8px 10px`, gap 8px, links 72–76 ×
  76–80 r-18, icon 19–21, label 11px/600) failed at the first assertion
  (the tree rendered 646 statically); the transition contracts failed
  ("none"); the shadow/stroke/tracking/hover/link-radius-24 assertions all
  failed. En-route spec fixes: (a) Chromium serializes the computed
  transition shorthand in SECONDS — the assertions use `0.12s`/`0.3s`, not
  `120ms`/`300ms`; (b) the interpolation midpoint needed the pointer moved
  off the link first (`page.mouse.move(0, 0)` + 400ms) — the lingering
  hover's 1.1 scale inflated the mid-transition link width (85.13 > 85 —
  the full-suite flake, fixed).
- **R1** — the scroll-linked growth: `SiteFooter.tsx` became a client
  component — a rAF-throttled passive scroll/resize handler writes
  `--footer-p` (the footer's visible fraction, clamped 0–1) on the footer
  element; the md+ calc classes interpolate the geometry (`md:gap-[calc(8px
  + var(--footer-p,0) * 4px)]`, `md:rounded-[calc(28px + …*6px)]`,
  `md:py-[calc(8px + …*4px)] md:px-[calc(10px + …*6px)]`, the links
  `md:h-[calc(78px + …*14px)] md:w-[calc(74px + …*18px)]
  md:rounded-[calc(18px + …*6px)]`, the icons `…20px + …*4px`, the labels
  `md:text-[calc(11px + …*1px)]`); `globals.css` gained
  `@utility footer-pill-transition` (gap/padding/border-radius 120ms
  linear) used as `md:footer-pill-transition` + `@utility
  footer-link-transition` (the mobile 4-prop hover list) with the UNLAYERED
  md media override composing the growth entries — the live's own lists.
  The mobile classes untouched (the var inert below md; a base
  `transition-none` added so the mobile pill's computed transition reads
  "none" like the live's — Chrome's initial value is "all").
- **R2** — the hover + the chrome details: the links carry
  `footer-link-hover` (the unguarded custom utility writing the composed
  `transform: translateY(-12px) scale(1.1)` + the #571AFF fill + white text
  + the violet glow — one matrix like the live, NOT v4's separate
  translate/scale properties which would escape the transform transition
  entry) with the svg's own `&:hover > svg { scale: 1.1 }` (unguarded —
  v4's group-hover variant is @media (hover: hover)-wrapped and would not
  apply on touch-capable probes where the live's does); the icons'
  `strokeWidth={2.1}`; the labels' `tracking-[-0.01em]`; the pill's
  `shadow-[0_2px_12px_rgba(14,14,14,0.08)]` + `md:items-end`.
- **Side-by-side verification on the dev server** (the same scroll states
  as the live): the compact 506×96/gap 8/pad 8/10/r-28/links 74×78
  r-18/icons 20px/labels 11px (the live identical); the mid-growth gap
  9.9992/link 83×85 at the half-visibility (the live 9.976/83/85); the
  grown 646×118/gap 11.996/pad 12/16/r-33.994/links 92×92 r-23.994/icons
  24/labels 11.999 (the live 646×118/12/12-16/34/92×92 r-24/24/12); the
  hover `matrix(1.1, 0, 0, 1.1, 0, -12)` over `rgb(87, 26, 255)` with the
  `rgba(87, 26, 255, 0.28) 0px 16px 34px` glow (the live identical).
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **76/76 E2E** ✓ (the
  rewritten footer contract: compact + transitions + shadow + stroke +
  tracking + grown + link-radius-24 + hover + interpolation + the mobile
  static model; the whole suite re-run — zero regressions).
- **66 screenshots** (5 new — the compact pill, the mid-growth
  interpolation, the grown pill, the violet hover, the mobile pill with the
  shadow — captured via `scripts/capture-screens-v14-session33.mjs`
  against the dev server, the rendered geometry re-verified on the
  captured state via `scripts/verify-captures-v14-session33.mjs`: compact
  506/74, mid gap 10.00/link 83, grown 646, hover matrix+violet — all OK);
  `.env.example` re-verified (covers every code-referenced var:
  DATABASE_URL, AUTH_SECRET, DEBUG_DBPATH + the reserved
  NEXT_PUBLIC_SITE_URL); docs aligned (README, AGENTS, CLAUDE, PAD v2.12,
  activity-map_SKILL v1.20.0, this plan, the worklog, docs/session_40.md).
