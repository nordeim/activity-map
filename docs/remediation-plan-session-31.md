# Session 31 — Remediation Plan (mirror E2E + live re-measure → the 404 hydration bug + the hero vh-model redesign + the vibe alignment + the showcase parallax)

Date: 2026-09-29 · Base commit: `37f740f` (main) · Agent: Super Z (session 31)

## 1. Context

Session 30 pushed the 404-surfaces + map-pin/zoom parity (`efdf768` +
`5a7e58e`); the owner added the session log (`37f740f`). This session
re-cloned, re-read every root doc + the session-30 plan + the worklog +
`docs/session_34.md` + `docs/session_35.md` (the raw session-30
conversation log) + the start-server log, re-validated the codebase state
(env `DATABASE_URL="file:../db/custom.db"` with `db/custom.db` recreated at
the repo root via db:push + db:seed, vitest + playwright configs verified,
skills/ excluded), and ran the full baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings
in `scripts/`) · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ ·
**71/71 E2E** ✓. The scandihaven reference repo re-reviewed for the shared
engineering patterns (six-phase workflow, TDD at seams, Tailwind v4
CSS-first rules, clone-app-pat-pro's computed-styles-as-ground-truth).

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-30 CODE.** Verified by DOM signature: the place-404 (the 46px
serif "Place not found" + the 44px ink "Back to Do" pill inside the
chrome), the generic 404 (the 72px font-light slate page, chrome-less, the
r-8 "Go Home"), the map zoom pair (2× 34×34 r999, gap 8, 700-weight), the
pin model (9× 12px ink dots, r50%, 2px white border, the 106×31
"Brass & Marble" label), and the pin-click navigation. Functionally ALL
GREEN: the mobile navbar end-to-end at 390 (52px border-box cream-glass
tab-bar, blur(24px) saturate(1.5), 12px link spans, the active state
moving on tap, the icons at x 304/330/356); the favourites round-trip
(save → 1 card → unsave → the empty state); the booking round-trip
(native-setter fill → "Request sent" → visible under Profile → My
bookings). **ONE BUG FOUND (F1 below): the generic 404 throws a React
#418 hydration error on every visit** (verified on the mirror AND
reproduced on the local production build).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280×900 / 1280×800 / 1280×720 / 768×{720,800,900} / 900×800 / 640×844 /
390×844):** every session-24→30 surface re-verified UNCHANGED (the
planner pill 548×56 cream/35 blur-28 + the popover, the mobile nav
(52px glass, the 126px planner gap, the 358×122 card), the place detail
(h1 82px y≈225, the 61×32 rating pill, the 89×36 Back), the map (the
34×34 zoom pair, the 9 pins 12×12 + the 106×31 labels, the shadowless
stats), the browse chips (38px 12px/600) + cards (392×564 r-28 + the
0 18 44 shadow), the band (h2 89.6px x=142 w=996), the sights/stay grids
(381² / 360² cards, the 1178/1120 grids, 231→210-card variance within the
pinned 205-235), the sights h2 (83.2px center), the footer (pt-64/pb-56 +
the hairline legal row), the legal pages (48px h1s), BOTH 404 surfaces,
the category cards (the 263×~210-231 cards + the 54px View All). The
mobile category carousel: EXACT (card y=577 x=18 306×226, VA y=754
276×36 — identical to the clone).

**Four findings:**

## 3. Findings (verified by DOM measurement + pixel sampling on the live app, 2026-09-29)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The generic 404 throws React #418** (hydration text mismatch) on EVERY unknown-route visit | the console error fires on `/nope-unknown-route` (verified on the mirror AND the local prod build): the static prerender bakes `"_not-found"` as `usePathname()`'s value, the client hydrates with the real path → text mismatch → React discards the server HTML and re-renders client-side | the same (introduced by session-30's R2 — `src/app/not-found.tsx` became a client component using `usePathname()` for the quoted path; the E2E never asserted zero console errors on the 404) |
| F2 | **High** | **The hero is now a VIEWPORT-HEIGHT-RELATIVE model with ROUNDED photo corners** | Desktop (md+): the section `min-height: 100vh; margin-top: -80px` (content-driven height = `714 + 0.28×vh` at lg / `577 + 0.3×vh` at md); the bg `top: calc(-80px + 0.25vh); height: calc(100% + 72px); border-radius: 32px 32px 60% 60% / 32px 32px 80px 80px` (big elliptical rounded BOTTOM corners); the content `margin-top: calc(5rem + 28vh)`; the h1 `-translate-y-1.5` (-6px); the pill `mt-4` (16px); NO shade/blend overlays (the raw image only — pixel-verified: the clone's hero-shade darkens the photo 5-15 RGB points vs the live). Mobile: the bg `border-radius: 0 0 42% 42% / 0 0 48px 48px`; the h1 `clamp(32px, 9.2vw, 38px)` capped at 38px. Measured: h1 y = 267@720 / **290@800** / 319@900; bg = 988/1010/1038 tall at the same heights | the session-22 FIXED model: heights 591/900/938 + mt-73, bg -86/1010 (fixed), square corners, pt-203/290 fixed, pill mt-6 (24px), the h1 clamp(34,9vw,122) UNCAPPED at mobile (35.1 vs the live's 35.88 at 390; **57.6 vs 38 at 640** — 19.6px), the hero-shade + the cream blend div. At 1280×800 the fixed model coincides EXACTLY with the live's formulas (290/1010/938) — the E2E's 800-height assertions pass against both; at ≠800 viewports the clone drifts ±23-29px and lacks the corners |
| F3 | **Med** | **The vibe heading is now CENTER-aligned** | "Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway" (92.16px serif, same text/size): `text-align: center`, the rendered text block spans x 129→1158 (symmetric margins 129/128 at 1280) | `text-left` full-width (the text block spans x 30→1248) — the session-12 measure was left-aligned; the live changed it |
| F4 | **Med** | **The home showcase images carry a 1.16 zoom + a scroll parallax** | the STAY showcase imgs (home only — the /stay browse cards have NO transform): inline `transform: translateY(8%) scale(1.16)` + `transition: transform 260ms ease-out` — the ty interpolates 8% (below the viewport) → 0 (centered) → negative (above), capped ±8% (measured ty: +35.9px far-below, ~0 centered, −32.1 above at 900vh). The SIGHTS imgs: an oversized wrapper `absolute inset-x-0 -inset-y-[16%]` (the img renders 132% of the card height, clipped) carrying the same scroll parallax on the wrapper | the stay imgs render plain `h-[118%] object-cover` (no zoom — the visible crop is 16% wider than the live's); the sights imgs fill the card exactly |

Non-gaps re-verified (keep, document): the /stay browse cards (no
parallax — the home-only `home` prop mechanism already exists), the
planner pill + popover, the mobile nav + planner + detail + favourites,
the map surfaces, the browse chips/cards, the band, the footer, the legal
pages, the 404 DESIGNS (both), the booking-form approximation (the
"Choose dates"/"Choose time" placeholders).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — write the spec extensions first**: (a) `tests/e2e/not-found.spec.ts` — add a zero-console-errors assertion on the generic-404 visit (page errors must be empty after load). (b) `tests/e2e/home.spec.ts` hero geometry — UPDATE the md viewport assertion (768×900: imgH 910-925 — the live's 919, was 965-980) and ADD: the 1280×900 desktop assertions (h1Y 310-328 — the live's 319; imgH 1030-1046 — the live's 1038; imgY ≤ −80 — the live's −85); the bg corner-radius assertions (desktop: the computed borderRadius contains "60%" and "80px"; mobile 390: contains "42%" and "48px"); the mobile h1 font assertion (35-37px at 390 — the live's 35.88; also 37-39px at 640 — the live's 38 cap); the desktop planner-pill gap (h1 bottom → pill top = 16px ±2, was 24). (c) `tests/e2e/home.spec.ts` vibe test — the heading's `text-align` computes `center` and the rendered line extents are symmetric (first-line x ≈ 1280 − last-line right). (d) `tests/e2e/home.spec.ts` showcase test — the home stay img's computed transform contains "1.16"; the sights img wrapper's height ≈ 132% of its card | tests/e2e/not-found.spec.ts, tests/e2e/home.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **The 404 hydration fix (F1)**: mount-gate the pathname in `src/app/not-found.tsx` — `const [attempted, setAttempted] = useState("")` + `useEffect(() => setAttempted(pathname.replace(/^\//, "")), [pathname])`; the server render and the first client render both carry "" (no mismatch), the real path fills in immediately after mount. Keep the design EXACTLY as-is (the slate page) | src/app/not-found.tsx | the R0a assertion GREEN (zero console errors); the existing not-found assertions stay GREEN (Playwright's auto-retry sees the post-mount text) |
| R2 | **The hero vh-model (F2)**: rewrite `src/components/home/Hero.tsx` — the section `md:-mt-[80px]` (was -73); the backdrop div carries the inline `top: calc(-80px + 0.25vh)`, `height: calc(100% + 72px)`, `border-radius: 32px 32px 60% 60% / 32px 32px 80px 80px` at md+ (inline style + a `today-hero-bg` class for the mobile override) and `inset-x-0 top-0 bottom-0` at mobile; the content wrapper `md:h-[calc(577px+30vh)] lg:h-[calc(714px+28vh)]` (was 900/938 fixed) + `md:pt-[calc(5rem+28vh)]` (was pt-290); the h1 gains `today-hero-title md:-translate-y-1.5`; the pill `md:mt-4` (was mt-6); REMOVE the hero-shade overlay + the bottom blend div (the live renders the raw image — pixel-verified). Add the mobile media rule to `src/app/globals.css`: `.today-hero-title { font-size: clamp(32px, 9.2vw, 38px) !important; }` + `.today-hero-bg { border-radius: 0 0 42% 42% / 0 0 48px 48px; }` under `@media (max-width: 767px)` (mirroring the live's own override block) | src/components/home/Hero.tsx, src/app/globals.css | the R0b assertions GREEN (the 900/640 viewports track; the 800-viewport values stay 290/1010/938 — the existing assertions unchanged); the mobile h1 35.88@390 + 38@640 |
| R3 | **The vibe heading center (F3)**: `src/components/home/StayShowcase.tsx` — the heading block `text-left` → `text-center` (the LetterReveal h2 centers; the subtitle already centered) | src/components/home/StayShowcase.tsx | the R0c assertion GREEN (text-align center + symmetric extents) |
| R4 | **The showcase zoom + parallax (F4)**: `src/components/places/StayCard.tsx` (home variant only) — the img carries `style={{ transform: "translateY(8%) scale(1.16)", transition: "transform 260ms ease-out" }}` + `data-parallax-img`; `src/components/home/StayShowcase.tsx` + `src/components/home/HighlightedSights.tsx` — a shared passive scroll listener (rAF-throttled, `prefers-reduced-motion` respected) that sets each parallax element's `translateY = clamp(dist × 0.05, ±8% × h)` (dist = element-center − viewport-center); the sights' imgs gain the oversized wrapper `absolute inset-x-0 -inset-y-[16%]` carrying the transform (replacing the plain h-full fill) | src/components/places/StayCard.tsx, src/components/home/StayShowcase.tsx, src/components/home/HighlightedSights.tsx | the R0d assertions GREEN (scale 1.16 + the 132% wrapper); scrolling changes the ty (verified manually); the /stay browse cards stay transform-free |
| R5 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 71+ E2E; re-measure every remediated surface against the live on the local server (the 404 with zero errors; the hero at 800/900/720 + the corners; the centered vibe; the 1.16 crops); capture the dev-server screenshots into `docs/screenshots/`; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog + write `docs/session_36.md`; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- The hero height formulas are FITTED to the live's rendered values at
  720/800/900 viewport heights (lg: `714 + 0.28vh`; md: `577 + 0.3vh` —
  ±2px at the sampled points). At extreme viewports (short phones in
  landscape, 4K-tall windows) the content-driven live may deviate from
  the fitted line — the E2E pins 390/640/768/1280 where the fit is exact.
- The category cards keep the fixed `md:-mt-[261px]` overlap; with the
  wrapper now scaling, the cards track the live within ±13px at 720-900
  (the 800 E2E viewport is exact; the live's own card position is
  non-linear in vh — a fitted -mt would trade exactness at 800 for
  exactness elsewhere).
- The mobile h1 clamp override needs `!important` to beat the inline
  style (CSS `!important` wins over inline styles — the same mechanism
  the live itself uses).
- The parallax scroll listener must be passive + rAF-throttled and must
  respect `prefers-reduced-motion` (the LetterReveal precedent); the
  initial SSR render carries the live's base `translateY(8%) scale(1.16)`
  so there is no hydration mismatch.
- Removing the hero-shade brightens the photo — the h1 keeps its
  `text-shadow` (the live's own legibility model).
- The E2E md assertion change (imgH 965-980 → 910-925) reflects the
  live's CURRENT md box (919 at 768×900 — the live's md section is
  content-driven `577+0.3vh`, not the old fixed 900+72).

## 6. Execution record (2026-09-29, post-delivery)

All five remediation rows executed in TDD order (RED confirmed on the
unmodified tree — every touched spec failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the
  zero-console-errors assertion on the generic 404 (`not-found.spec.ts`,
  filtering the browser's own "Failed to load resource: … 404" network log
  — the page itself IS the 404 response); the hero geometry extensions
  (`home.spec.ts` — the 1280×900 vh-model values (h1 310-328, img
  1030-1046), the md re-measure (imgH 910-925 at 768×900 — the live's
  content-driven 919), the bg corner-radius assertions (60%/80px at md+,
  42%/48px below md), the 22px rect pill gap (the 16px margin + the h1's
  −6px translate), and the NEW mobile test (the h1 font 35-37px at 390 /
  37-39px at 640 — the live's 35.88/38px cap); the vibe center assertions
  (text-align center + the symmetric letter extents ±12); the showcase
  assertions (the stay img transform "1.16" + the sights wrapper at
  125-140% of its card).
- **R1** — the 404 hydration fix: `src/app/not-found.tsx` now reads
  `window.location.pathname` through `useSyncExternalStore`
  (`getServerSnapshot` returns `""`) — the server render AND the hydration
  pass both carry "" so there is NO text mismatch, and React swaps the
  real path in after mount. (The first implementation used a
  mount-gated `useState` + `useEffect`, but the new
  `react-hooks/set-state-in-effect` lint rule rejected it — the store
  pattern is the sanctioned client-only-value solution and dropped the
  `usePathname` dependency entirely.) Verified on the local production
  build: zero page/console errors, the quoted path renders.
- **R2** — the hero vh-model: `Hero.tsx` rewritten (the section
  `md:-mt-[80px]`; the bg div carrying the inline `top:
  calc(-80px+0.25vh)`, `height: calc(100%+72px)`, and the desktop radius
  32/32/60%60%/32/32/80/80; the content wrapper
  `md:h-[calc(577px+30vh)] lg:h-[calc(714px+28vh)]` +
  `md:pt-[calc(5rem+28vh)]`; the h1 `today-hero-title` +
  `md:-translate-y-1.5`; the pill `md:mt-4`; the img switched to the
  live's FILL model (`block h-auto min-h-full w-full` + the inline
  `width: 100vw; max-width: none; object-position: center top`); the
  hero-shade + the bottom blend div REMOVED — the raw image) +
  `globals.css` gained the `@media (max-width: 767px)` block (the h1
  `clamp(32px,9.2vw,38px) !important` + the bg pinned to the 591px phone
  box with the `0 0 42% 42% / 0 0 48px 48px` radius, `!important` over
  the inline styles — mirroring the live's own override mechanism) and
  LOST the now-dead `@utility hero-shade`. Side-by-side: at 1280×900
  every metric EXACT (h1 y=319, section −7/966, bg −85/1038, the radius
  string, the pill y=456); at 1280×800 EXACT (h1 290/291, section 938);
  at 390×844 EXACT (h1 203/35.88px, section 591, bg radius, pill 365);
  at 640 the h1 caps at 38px (was 57.6); the VLM hero comparison found
  "no discernible differences — 0px" (the corners, the tone, the cards).
- **R3** — the vibe centering: the heading block `px-[18px]` +
  `text-center`, the h2 `mx-auto max-w-[94vw]` — the h2 box lands 1203
  @x=38 at 1280 with the EXACT live line breaks ("…Select / …Your /
  Getaway" at x=123/136/263, all three line centers at exactly x=640 —
  DOM-verified; the VLM confirmed the centered rendering).
- **R4** — the showcase zoom + parallax: the shared
  `src/components/home/useParallax.ts` hook (a passive rAF-throttled
  scroll/resize listener per section driving every `[data-parallax]`
  element — `translateY = clamp(dist × 0.05, ±8% × height)` composed
  with the element's own `data-parallax` scale factor); the StayCard's
  HOME variant renders the img with the base
  `translateY(8%) scale(1.16)` + the `data-parallax="1.16"` tag (the
  browse variant keeps the plain fill + the session-6 hover model —
  the live's browse cards are transform-free, verified);
  `HighlightedSights` wraps each img in the oversized
  `absolute inset-x-0 -inset-y-[16%]` div carrying the base
  `translateY(8%)` (no scale — the wrapper IS the zoom). Both sections
  became client components to own their listeners. Verified: the ty
  interpolates +41.7 (below) → +13.5 (near) → −32.5 (above) at 900vh —
  matching the live's measured ±8% choreography; the card at 442px wide
  (the live's 441).
- **En-route lesson** — the first vibe implementation (`text-center` on
  the old `px-4 sm:px-6` container) centered the lines but produced
  WIDER line breaks than the live (the widest line 1226 vs the live's
  1034): the live's h2 box is 1203 (px-18 container + `max-w-[94vw]` +
  auto margins), not the full 1232 — the line BREAKS are part of the
  contract, not just the alignment.
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **73/73 E2E** ✓
  (the zero-console-errors 404 spec + the hero vh/radius/cap contracts +
  the vibe + showcase extensions; the full suite re-run after the final
  vibe px-18/max-w-94vw tweak).
- **57 screenshots** (8 new — the vh-model hero at 1280×900 + 1280×800,
  the mobile hero at 390, the capped 640 h1, the centered vibe, the
  stay parallax zoom, the sights oversize crop, the hydration-clean
  generic 404 — VLM-verified via `scripts/capture-screens-v12-session31.mjs`,
  which asserts zero console errors on the 404 capture);
  `.env.example` re-verified (covers every code-referenced var:
  DATABASE_URL, AUTH_SECRET, DEBUG_DBPATH + the reserved
  NEXT_PUBLIC_SITE_URL); docs aligned (README, AGENTS, CLAUDE, PAD
  v2.10, activity-map_SKILL v1.18.0, this plan, the worklog,
  docs/session_36.md).
