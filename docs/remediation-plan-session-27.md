# Session 27 — Remediation Plan (deployed-mirror verification + live-source re-measure → the route-stop chrome + the responsive login fields)

Date: 2026-09-28 · Base commit: `e4b5b29` (main) · Agent: Super Z (session 27)

## 1. Context

Session 26 pushed the footer/mobile-home parity (`3610c9b` + `9af6491`);
the suggested next step was a mirror spot-check after the owner redeploys.
This session pulled (new: the owner's start-server log update showing the
server rebuilt + restarted on the session-26 code — routes include
`/privacy-policy`, the DB recreated under `db/`), re-read every root doc +
the session-26 log + the plan + the worklog + the start-server log,
re-validated the codebase state (env, db recreated at the repo root,
configs, skills exclusion), and ran the full baseline gate on the untouched
tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **68/68 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-26 CODE, ALL GREEN.** Verified by DOM signature: the login (inputs
14px/48px at 1280 + the one-button "Need an account? Sign up" row with the
font-medium span), the legal routes (`/privacy-policy` +
`/accessibility-statement` + the legacy redirects), the session-26 footer
(the legal row's `border-t border-black/[0.05] pt-3 sm:pt-5 mt-4 sm:mt-8`
hairline + the `px-5 sm:` pads + the `max-w-[390px]` caps), the session-26
mobile route heading (the trap h2 `absolute top-[68px]` 42.9px lh 43.758
tracking −2.3595 w 359), the session-26 stacking restaurant deck
(`sticky top-[88px]`, first card x=18 w=354 h=490, six cards), the
category track (pad 18/18, gap 12, cards 306×227 at y=578). Functionally:
zero console errors across every page; the mobile navbar end-to-end (52px
border-box tab-bar, 12px links, tap navigation, active-state moves, scroll
persistence); the favourites round-trip (save → 1 card → unsave → the
"No favourites yet" empty state); the booking round-trip (the form submits,
"Request sent" renders, the booking lists under Profile → My bookings).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/390/640):** every session-24/25/26 surface re-verified UNCHANGED — the
hero (h1 y 290, photo −86→924 / 1010px), the desktop nav pill (820×56
@x=230 r999 #E8E6DC), the footer (the legal row hairline + pt 20/mt 32 at
1280 + the sm: switch + the 506×96 nav pill), the category cards (the
matrix(1.15)-scaled row: cards 265 wide at x 229/508/786), the route trap
(the pinned h2 42.9px at viewport 68 mid-trap, the 220vh trap, the heading
section display:none below lg), the desktop route geometry (the stops
column x=672 w=576, the link card 448×201 r-28), the stay/sight containers
(381×381 @x=51 / 360×360 @x=80), the blue band (bg #4D61FF, h 3680, h2
89.6px white), the browses (chips 12/600/#555550/hairline/38, cards r-28 +
`0 18px 44px`), the map command center (sticky top-96 1216×66), the detail
(h1 y 225/82px, card 1152×688 r36, inputs 44/r16/14px, Back 36×89 @y96),
the profile (h1 "sepnetflix2023" y 167 mobile, chrome-less), the
favourites (h1 y 188 mobile), the mobile tab-bar (fixed 52px border-box,
glass rgba(248,247,244,0.62) blur(24) saturate(1.5), 12px links at
−0.12px tracking), the mobile browses (pt-112, chips 44/12/600, sticky
planner top-10), the mobile map shell (358×138 sticky top-10), the mobile
stacking deck (cards pin at 88 mid-scroll, 620 advances, first card
354×490 @x18), the mobile showcase insets (stays 354 @x18, sights 358
@x16), the section headings at both breakpoints (route 42.9px, restaurants
42px, vibe 40px, sights 42px at 390; 89.6/92.16/83.2px at 1280).

**Six findings** — the route stop cards (never re-measured below the
session-20 text-only contract) and the login fields below md:

## 3. Findings (verified by DOM measurement on the live app, 2026-09-28)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The route stop time-pill chrome** — the pill carries a shadow + a hairline border + a PER-STOP category icon + dimmer text | pill `mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-[0_8px_22px_rgba(14,14,14,0.06)]` + inline `border: 1px solid rgba(14,14,14,0.1)`; computed at 390: h 28, w 101, pad 4px 12px, gap 8px, r 9999; the icon a 14×14 lucide svg at `stroke #141413 stroke-width 1.8` — **per stop**: Morning Coffee→coffee, Lunch Break→utensils, Afternoon Culture→palette, Sunset Drinks→martini, Dinner→leaf; the text 12px/400 `letter-spacing 0.05em` **#3A3A3A** (font-neue/Inter) — at BOTH breakpoints | the pill is shadow-less + border-less (`rounded-full bg-white px-3 py-1 text-xs tracking-[0.05em] text-[#141413]`), a GENERIC Clock icon (stroke-width 2), text #141413, h 24 |
| F2 | **Med** | **The route stop link-card gained a hairline border** | `class="group mt-7 block max-w-md rounded-[28px] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(14,14,14,0.10)]"` + inline `border: 1px solid rgba(14,14,14,0.08); box-shadow: rgba(14,14,14,0.08) 0px 8px 28px` — the border renders at BOTH breakpoints (448×201 at 1280, 354-wide at 390) | `mt-7 block max-w-md rounded-[28px] bg-white p-5 shadow-[0_8px_28px_rgba(14,14,14,0.08)]` — no border, no hover translate/shadow |
| F3 | **Med** | **The stop title h2 line-height + bottom margin** | `font-size: clamp(28px, 12vw, 44px); line-height: 1.1; … margin-bottom: 8px` (48.4px at 44 / 52.8px at 48 desktop) — the title sits mb-2 above the link card's mt-7 (36px total) | `text-[44px] font-normal leading-[1.05] tracking-[-0.02em] lg:text-[48px]` (46.2/50.4) with NO margin — the link card's mt-7 alone (28px) |
| F4 | **Med** | **The meta line carries a map-pin icon + the Learn More hover went violet** | the card's meta row `mt-2 flex flex-wrap items-center gap-1.5` with a 14×14 map-pin svg (`stroke #72706A stroke-width 2`) + SEPARATE 13px #72706A spans (Altstadt · 4.8 rating · €€ · Coffee); the Learn More pill `bg-[#141413] px-4 py-3 r-full` with `group-hover:bg-[#571AFF] group-hover:shadow-[0_12px_28px_rgba(87,26,255,0.28)]` | a single 13px text span (no pin icon); the Learn More `bg-ink` with `hover:bg-black` |
| F5 | **Med** | **The login input font is RESPONSIVE — 16px below md** | input class `… text-base … md:text-sm … h-11 sm:h-12 …` — computed at 390: 16px/44px; at 640: 16px/48px; at 1280: 14px/48px | the clone's inputs are `text-sm` (14px) at EVERY breakpoint (h-11 sm:h-12 already correct) — 390 and the 640-767 window render 14px |
| F6 | **Med** | **The login Sign-in button height is RESPONSIVE — 44px below sm** | button class `… px-3 py-2 w-full h-11 sm:h-12 bg-slate-900 …` — computed at 390: h 44; at 640+: h 48 | the clone's button is `h-12` (48px) at every breakpoint — the 390 window renders 48 |

Non-gaps re-verified (keep, document): the Google button (54px/16px at 390)
and the "Sign in to continue" subtitle (`text-sm sm:text-base` — 14/16px)
both already match; the login card height difference (746 vs 784) remains
the documented whitespace non-gap; the desktop stop-card wrapper geometry
(y 1407/1409, x 672, w 576) matches — the live's link card starts ~13px
lower purely as the cumulative result of F1+F3 (taller pill + lh 1.1);
the y-offset drift in the mobile home flow (restaurants 4593→4608, sights
12926→13253) is the documented session-26 deck-flow trade-off.

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `home.spec.ts` route-stop test — extend with the session-27 chrome: the time pill carries a non-zero `box-shadow` + a 1px border + a per-stop icon (the first stop's icon svg renders — `coffee`), the pill text is `#3A3A3A`; the link card carries `border-top-width: 1px`; the h2 line-height ratio ≈1.1 (≥48px at 44px font); (b) `home.spec.ts` — a NEW meta-row assertion: a 14px map-pin svg precedes the neighborhood text; (c) `auth.spec.ts` — extend the login chrome test: at 390 the inputs compute `16px` font + `44px` height and the Sign-in button computes `44px`; at 1280 the inputs stay `14px`/48px and the button 48px | tests/e2e/home.spec.ts, tests/e2e/auth.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **The time-pill chrome (F1)**: the pill gains `border border-[rgba(14,14,14,0.1)] shadow-[0_8px_22px_rgba(14,14,14,0.06)]` + the text color `#141413` → `#3A3A3A`; the generic `Clock` icon is replaced by a PER-STOP icon map: `STOPS` entries gain an `icon` key — Coffee / Utensils / Palette / Martini / Leaf (lucide, 14px `h-3.5 w-3.5`, `strokeWidth={1.8}`, `aria-hidden`) | src/components/home/RecommendedRoute.tsx | the R0a assertions GREEN; the existing route pins stay GREEN (the five stops, the mobile visual, the stop-card x=18/354/rounded-28, the desktop choreography) |
| R2 | **The link-card hairline + hover (F2)**: the stop Link gains `border border-[rgba(14,14,14,0.08)]` + `transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(14,14,14,0.10)]` (the base `0 8px 28px` shadow stays) | src/components/home/RecommendedRoute.tsx | the R0a border assertion GREEN; the desktop/mobile card pins stay GREEN |
| R3 | **The title metrics + meta row (F3+F4)**: the h2 `leading-[1.05]` → `leading-[1.1]` + `mb-2`; the meta single text span becomes the live's `mt-2 flex flex-wrap items-center gap-1.5` row — a 14px MapPin svg (`strokeWidth 2`, `#72706A` via `text-[#72706A]`/stroke currentColor) + the neighborhood span + the `· rating`/`· €€`/`· sub` spans at 13px #72706A; the Learn More hover `hover:bg-black` → `hover:bg-roam hover:shadow-[0_12px_28px_rgba(87,26,255,0.28)]` | src/components/home/RecommendedRoute.tsx | the R0b assertions GREEN; the existing meta-text pins (the 13px #72706A content) stay GREEN |
| R4 | **The responsive login fields (F5+F6)**: the two inputs' `text-sm` → `text-base md:text-sm`; the Sign-in button `h-12` → `h-11 sm:h-12` | src/components/auth/LoginForm.tsx | the R0c assertions GREEN at 390 AND 1280; the session-25 login pins (the 14px inputs at md+, the one-button signup row) stay GREEN |
| R5 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 68+ E2E; re-measure every remediated surface against the live on the production server (the pill shadow/border/icon + h28 at 390; the link border; the h2 lh 48.4/52.8; the meta pin row; the login 16px/44px at 390 + 14px/48px at 1280); refresh the affected screenshots; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- The pill's h-28 (vs the clone's h-24) follows from the icon + lh
  composition; matching the structure (icon 14px + 12px text + py-1) is the
  contract, not hard-coding a height.
- The route-stop spec's existing "shadow-less time pill" pin (session-20)
  MUST be updated in the same RED step — it directly contradicts F1.
- The E2E login specs assert at 1280 (the auth project's desktop context);
  the new 390 assertions need an explicit `setViewportSize` within the test
  (the pattern the mobile-navigation spec already uses).

## 6. Execution record (2026-09-28, post-delivery)

All five remediation rows executed in TDD order (RED confirmed on the
unmodified tree — both touched specs failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the route-stop
  contract extended (the pill's `0 8px 22px /0.06` shadow + the 1px /0.1
  border + the coffee icon at 14px + the #3A3A3A text — the session-20
  "shadow-less" pin REPLACED; the h2 lh ratio 1.08–1.12 + the 6–10px
  bottom margin; the link card's 1px /0.08 border; the meta row's 14px
  map-pin svg at stroke #72706A) and the login chrome test extended with
  the RESPONSIVE window sweep (16px/44px at 390 → 16px/48px + button 48px
  at 640 → 14px/48px at 1280).
- **R1** — the time-pill chrome: `border border-[rgba(14,14,14,0.1)]` +
  `shadow-[0_8px_22px_rgba(14,14,14,0.06)]` + the text #141413 → #3A3A3A
  + the generic Clock replaced by the PER-STOP icon map (STOPS entries
  carry `icon: Coffee/Utensils/Palette/Martini/Leaf`, rendered at
  `h-3.5 w-3.5` strokeWidth 1.8) + `leading-[18px]` (the live's pill
  computes 28×101 at 390 — the clone landed 26 before the leading fix).
- **R2** — the link-card hairline + hover: `border
  border-[rgba(14,14,14,0.08)]` + `transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(14,14,14,0.10)]`.
- **R3** — the title metrics + meta row: `leading-[1.05]` →
  `leading-[1.1]` + `mb-2`; the meta single span became the
  `mt-2 flex flex-wrap items-center gap-1.5` row (a 14px MapPin svg at
  stroke #72706A + `stopMetaParts()` separate spans); the Learn More hover
  `hover:bg-black` → `hover:bg-roam
  hover:shadow-[0_12px_28px_rgba(87,26,255,0.28)]`.
- **R4** — the responsive login fields: the two inputs `text-sm` →
  `text-base md:text-sm`; the Sign-in button `h-12` → `h-11 sm:h-12`.
- **Side-by-side verification on the production server** (both sites
  re-measured at 390/640/1280): the pill 28×101 with the shadow tail
  `rgba(14, 14, 14, 0.06) 0px 8px 22px 0px` + the hairline + the coffee
  icon + #3A3A3A — EXACT at both breakpoints; the h2 48px/52.8 + mb 8px;
  the link card 448×202 with the 1px /0.08 border (the live 448×201); the
  meta spans + pin EXACT; the login 16px/44px + button 44px at 390,
  16px/48px + button 48px at 640, 14px/48px + button 48px at 1280 — all
  EXACT.
- **En-route lesson**: agent-browser 0.38.x renders BLANK element
  screenshots of tall sticky sections (the 3360px route section captured
  as pure cream, correctly sized but unpainted) — the previous sessions'
  captures came from an older agent-browser. The element captures now run
  through Playwright's `locator.screenshot()`
  (`scripts/capture-screens-v8-session27.mjs`) which stitches sticky
  content correctly; the viewport-level refreshes stay on agent-browser.
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **68/68 E2E** ✓.
- **32 screenshots** (3 refreshed — 01-home-highlights, 11-home-route,
  22-login-card — plus the session-27 set: the desktop + mobile
  route-stop chrome, the mobile login fields; VLM-verified via
  `scripts/verify-captures-v8.mjs`); `.env.example` re-verified (covers
  every code-referenced var: DATABASE_URL, AUTH_SECRET, DEBUG_DBPATH +
  the reserved NEXT_PUBLIC_SITE_URL); docs aligned (README, AGENTS,
  CLAUDE, PAD v2.6, activity-map_SKILL v1.14.0, this plan, the worklog).
