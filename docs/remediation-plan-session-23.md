# Session 23 — Remediation Plan (deployed-mirror + live-source dual audit → the footer re-measure, the 1px tab-bar, and the page-bottom spacing parity)

Date: 2026-09-27 · Base commit: `b055131` (main) · Agent: Super Z (session 23)

## 1. Context

Session 22 pushed the hero-framing + nav-glass + letter-spacing parity
(`fb5f78b` + `fbf6b8d`); the owner's commits added `docs/session_23.md` (the
session-22 run log) and the start-server-log update showing the mirror
rebuilt/restarted WITH the session-22 code (verified this session by DOM
signature: hero img y=−86 h=1010 @1280, `blur(24px) saturate(1.5)` glass,
−0.12px mobile link tracking). This session re-cloned, reviewed every root
doc + the session 22/23 logs + the worklog + the start-server log, ran the
full baseline gate, then executed the dual-site browser audit.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ (1 known Turbopack tracing warning) ·
27/27 smoke ✓ · **58/58 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`, running the session-22
code):** functionally ALL GREEN — every page loads with ZERO console errors
(/, /eat, /stay, /do, /map, /favourites, /profile, place detail, /privacy,
/accessibility, /login); the mobile navbar works end-to-end (fixed cream-glass
tab-bar, tap navigation moves the active state, icon actions navigate, fixed
positioning survives scroll, no horizontal overflow at 390 — **no Tailwind v4
failure classes**); the favourites round-trip works (save 201 → visible →
unsave → 0 cards); the booking round-trip works (submit → confirmation →
visible under My bookings — the owner's redeploy wipes it).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/768/390):** every session-22 surface re-verified UNCHANGED — the hero
(img −86/1010/1280 @1280, −85/972 @768, 0/591 @390; h1 y=290/203 x=24), the
desktop pill (820×56 @x=230, r999, #E8E6DC), the nav tracking (desktop
+0.13px, mobile −0.12px computed — the live's inline +0.01em is dead style,
overridden), the route stop cards (h3 20px/600 −0.4px), the time pills
(12px +0.6px, pad 4px 12px), the eat heading (y=168 55px) + chips
(38px/12px/600), the detail split (h1 y=225 82px, 1152×688 r-36, 44px/16px
inputs), the map page (620px canvas, 9 cards), the profile (chrome-less, h1
72px y=203), the login chrome (white body, 30px system h1, #0F172A r-12
submit), the mobile category cards (306×227, scrollWidth 978), the mobile
route cards (354 @x=18) — EXCEPT the findings below. **The footer had never
been re-measured since session 2** — this session's sweep found it drifted.

## 3. Findings (verified by DOM measurement on the live app, 2026-09-27)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **Med** | **Mobile tab-bar total height** — the live's `header.tab-bar` measures **52px border-box** (nav `h-12` 48px + chrome) at every mobile width 390–767 | computed @390/430/500/640/767: h=52, border-b 1px | nav `h-[52px]` + header border-b 1px → **53px** at every width (the session-23 log's open question, now confirmed a real 1px delta) |
| F2 | **High** | **Footer chrome drift** (desktop) — the live renders a COMPACT shrink-wrapped centered glass pill: 506×96, r-28, **border 1px #E8E6DC, backdrop blur(40px) saturate(1.5)**, pad 8px 10px, gap 8px; links 74×78 (icon 20px over 11px/600 text, icon→text gap 8px); inner max-w-**5xl** (1024); footer element pt-64/pb-56; bottom row = **row justify-between** (© 12px #8A8780 left, legal nav right, gap 8px 20px) | measured @1280: nav 506×96 @x=387, computed border/blur/pad; links 74×78, svg 20, span 11px/600; inner 1024; ftr 285h; bottom row justify-between | full-width slab nav 1072×110 r-34 pad-16, NO border, NO blur; links 98×78 (icon 16px, 13px/500→14px/500 text); inner max-w-[1120px]; footer py-9 (36px) on inner + mt-8 (32); bottom row centered column, © 12px black/50 + legal #888580 |
| F3 | **Med** | **Footer mobile chrome** — the live's mobile nav: w-full 350, r-28, border+glass (same as desktop), pad 8px 10px, links 104×78; footer pt-32/pb-24; bottom row column gap-8 12px #8A8780 | measured @390: nav 350×182, links 104×78 @x=31/143/255 y=9/95; ftr 307h pt-32/pb-24; bottom column gap-8 | nav pad 10px all round (links 105 — 1px off), no border/glass; footer pad 0 (inner py-9); bottom gap-2 ✓ layout but colors differ |
| F4 | **Med** | **Page-bottom spacing drift** — live: last sight card → More-pill = **32px** (both breakpoints); pill → footer = **0px desktop / 22px mobile**; browse/map/detail last content → footer = **96px (both breakpoints)**; footer pt-64/32 provides the rest. Clone home: card→pill 48 (mt-12), pill → footer **176px mobile / 176px desktop** (pb-4 + section pb-16 + main pb-16 + mt-8); clone eat: card → footer 112 mobile / 80+32 desktop; clone map: NO bottom padding at all; clone detail: pb-20 (80) | measured chains on both sites, both breakpoints | home pill→footer desktop 176 vs 0 (a visible cream void); eat 112 vs 97 mobile; map missing 96px |

Non-gaps re-verified (keep, document): the desktop header's `padding-top: 1vh`
inline on the live (8px @800h) vs the clone's fixed `pt-[9px]` — the clone's
fixed geometry matches the live EXACTLY at the audited viewports (800h/844h)
and replicating 1vh would destabilize the pinned hero contracts for ≤2px gain
at unaudited heights; the mobile h1 computed size 35.88px (live) vs 35.1px
(clone) — both carry the IDENTICAL `clamp(34px, 9vw, 122px)` rule, the live's
+2.2% is a font-boosting artifact of its animated transform wrapper, and the
h1 y-anchors (203/290) match EXACTLY; the footer legal links carry no
underline on the live (clone matches — hover-only).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `mobile-navigation.spec.ts` — new contract "the tab-bar totals 52px border-box (session-23)": the header's `getBoundingClientRect().height` = 51.5..52.5 @390; (b) `home.spec.ts` — new contract "the footer matches the live (session-23 re-measure)": @1280 the nav pill w 500–512 with r 28px, border-top-width 1px + border-color rgb(232,230,220), backdrop-filter `blur(40px) saturate(1.5)`, pad 8px 10px; the first link w 72–76 with svg h 20 and span 11px/600; the footer paddingTop 64 / paddingBottom 56; the inner max-width 1024; the bottom row flex-row justify-between with 12px #8A8780 text; @390 the footer paddingTop 32 / paddingBottom 24, nav w 349–351 with links 103–105 | tests/e2e/mobile-navigation.spec.ts, tests/e2e/home.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **Tab-bar height (F1)**: the nav's `h-[52px]` → `h-[51px]` (51 + 1px header border-b = 52 border-box). No other surface depends on the mobile bar height (the header is fixed/out-of-flow below md; the h1 anchors ride the section padding) | `src/components/layout/Navbar.tsx` | the R0a spec turns GREEN; the glass/tracking/one-line/pill specs stay GREEN |
| R2 | **Footer rewrite (F2+F3)**: footer `mt-8 bg-cream` → `bg-cream pt-8 pb-6 md:pt-16 md:pb-14` (32/24 mobile, 64/56 desktop); inner `mx-auto flex max-w-[1120px] … gap-7 px-4 py-9 sm:px-6` → `mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-5 md:gap-8 md:px-6` (max-w 1024, row gap 16/32, no py); nav `grid w-full max-w-[350px] grid-cols-3 gap-2 rounded-[28px] bg-white p-2.5 md:flex md:max-w-none md:flex-wrap md:justify-center md:gap-2 md:rounded-[34px] md:p-4` → `grid w-full grid-cols-3 gap-2 rounded-[28px] border border-[#E8E6DC] bg-white py-2 px-2.5 backdrop-blur-[40px] backdrop-saturate-[1.5] md:flex md:w-fit md:max-w-none md:flex-wrap md:justify-center` (border+glass at every breakpoint, r-28, pad 8/10, shrink-wrap at md); links `… md:w-[98px]` + `Icon h-4 w-4` + `text-[13px] font-medium md:text-sm` → `md:w-[74px]` + `Icon h-5 w-5` + `text-[11px] font-semibold` (gap-1 → gap-2, icon 20px, 11px/600); bottom row `flex flex-col items-center gap-2 text-center` → `flex w-full flex-col items-center gap-2 md:flex-row md:justify-between md:gap-4` with © `text-xs text-black/50` → `text-xs text-[#8A8780]` and the legal nav gaining `gap-x-5 gap-y-2 text-xs text-[#8A8780]` (© left / legal right at md, gap 8/20) | `src/components/layout/SiteFooter.tsx` | the R0b spec turns GREEN; the existing legal-line spec stays GREEN |
| R3 | **Page-bottom spacing (F4)**: home `main.pb-16` → `main` (no pb); `HighlightedSights` section `pb-16` → `pb-[22px] md:pb-0` (live mobile 22px / desktop 0) and the More-pill wrapper `mt-12 … pb-4` → `mt-8` (32px gap, no pb); `CategoryExplorer` grid wrapper `pb-20` → `pb-24` (96px); place detail `main.pb-20` → `pb-24` (96px); `MapExplorer` `main.w-full` → `main.w-full pb-24` (96px — the live's map card→footer = 96). Favourites stays stretchy (min-h calc — live is also a stretch artifact, no fixed contract) | `src/app/(app)/page.tsx`, `src/components/home/HighlightedSights.tsx`, `src/components/places/CategoryExplorer.tsx`, `src/app/(app)/place/[slug]/page.tsx`, `src/components/map/MapExplorer.tsx` | side-by-side: home lastCard→pill 32 + pill→nav 64 desktop / 22+32 mobile; eat/map/detail card→nav 160 desktop / 128–129 mobile |
| R4 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 58+ E2E (extended); re-measure every remediated surface against the live (tab-bar 52, footer chrome/pill/glass/links/©-row, the four page-bottom chains); refresh the affected screenshots (footer desktop/mobile at minimum + the re-run capture set); align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the session log/the worklog; verify `.env.example` still covers every code-referenced env var; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks & guards

- **Tailwind v4 CSS-first**: every change is an arbitrary-value or
  stock utility — no `tailwind.config.*`; the mobile-nav safety valve
  (`no-scrollbar`) and the five failure-class pins stay untouched; the two
  NEW assertions are additive only — the existing pin set must keep passing.
- **The backdrop-filter composition** (session-22 lesson): `backdrop-blur-[40px]`
  + `backdrop-saturate-[1.5]` must compose into ONE `blur(40px) saturate(1.5)`
  declaration — verified computed; fallback: an arbitrary
  `[backdrop-filter:blur(40px)_saturate(1.5)]` utility.
- **The footer nav shrink-wrap**: `md:w-fit` must let the pill collapse to
  its content (506 = 6×74 + 5×8 + 2×10 + 2×1); if `w-fit` fights the flex
  parent, an explicit `md:w-[506px]` is the pinned fallback — verify computed.
- **R3 touches five files' bottom paddings** — each page's last-content →
  footer chain was measured on BOTH sites at BOTH breakpoints; do not
  eyeball: re-measure after the change. The favourites page is intentionally
  left stretchy. The `mt-8` on the footer is REMOVED — every page's spacing
  now comes from its own last section + the footer's own pt (the live's
  model: footer inside main, mt 0).
- **Do not regress**: 42 unit, the API envelope, the seed counts, browse
  purity, Leaflet `ssr:false`, single-exit db-path helpers, the `.env`
  pinning, the shared E2E storageState, the rate limiter, the login
  white-body inline style, the favourites scoped overlay, the profile `(bare)`
  contract, the 800px band overlap, the mobile restaurant flow, the route
  choreography, the hero geometry (the footer re-measure must not move any
  y-anchor above it), the mobile-nav glass + tracking pins, the hero
  restructure traps (the mobile backdrop stays ABSOLUTE).
- The deployed mirror carries one "Audit" booking from this session's
  round-trip — the owner's redeploy wipes it (per the start-server log's
  `rm -rf db/` flow).

## 6. Execution record (2026-09-27, post-push state)

All four remediation rows executed in TDD order (RED confirmed on the
unmodified tree → GREEN on the modified tree):

- **R0** — the three contracts added; all three verified RED first.
- **R1** — the tab-bar: `h-[51px]` + the header's 1px border-b = **52
  border-box**, measured 52.0 @390.
- **R2** — the footer rebuilt exactly per the plan; every spec value
  measured EXACT (506×96, r-28, 1px #E8E6DC, `blur(40px) saturate(1.5)` as
  ONE declaration, pad 8px 10px, links 74×78, icon 20, span 11px/600,
  inner 1024, pt-64/pb-56 desktop / pt-32/pb-24 + 350px nav + column legal
  row mobile; the pixel probe confirmed the border renders #E8E6DC on the
  cream canvas).
- **R3** — executed with ONE CORRECTION, caught by a dev-server measurement
  before implementation: the audit's "clone map: NO bottom padding" claim
  was a probe artifact — the map chain already measured **96px** (the inner
  div's pb-16 64px + the footer's mt-8 32px), exactly the live's contract.
  The correct fix therefore compensates the removed footer `mt-8` by
  raising the inner `pb-16` → `pb-24` (96px), NOT the plan's original
  "main pb-24" (which would have stacked 96+64=160px). Lesson recorded in
  the PAD v2.2 revision block: measure a spacing chain on the dev server
  before remediating it.
- **R4** — gates: lint ✓ (2 pre-existing warnings) · typecheck ✓ · 42 unit
  ✓ · build ✓ · 27/27 smoke ✓ · **61/61 E2E** ✓. 17 screenshots (14
  refreshed + `15-desktop-footer` / `16-mobile-footer` /
  `17-desktop-sights-footer-handoff` via `scripts/capture-screens-v4-footer.sh`
  — the smooth-scroll trap fixed with `behavior:'instant'` scrollTo + a
  rect verification before capture). `.env.example` re-verified (covers
  every code-referenced var). Docs aligned: README, AGENTS, CLAUDE, PAD
  (v2.2), activity-map_SKILL (v1.10.0), this plan, the worklog.
