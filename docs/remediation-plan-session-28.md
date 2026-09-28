# Session 28 — Remediation Plan (deployed-mirror verification + live-source re-measure → the date-picker popover + the stay-showcase pills + the booking-form labels)

Date: 2026-09-28 · Base commit: `cb6e463` (main) · Agent: Super Z (session 28)

## 1. Context

Session 27 pushed the route-stop/login parity (`644d97e` + `3256faa`); the
owner then rebuilt + restarted the server (the start-server log update
`e4b5b29` + `cb6e463` adding `docs/session_29.md` — the session-27 agent
log). This session pulled, re-read every root doc + the session-27 plan +
the worklog + `docs/session_29.md` + the start-server log (`docs/session_28.md`
does not exist — the session files jump 27 → 29), re-validated the codebase
state (env `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root,
vitest + playwright configs working, skills exclusion), and ran the full
baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **68/68 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-27 CODE, ALL GREEN.** Verified by DOM signature: the route stop time
pill (h 28, the `0 8px 22px /0.06` shadow + the 1px /0.1 hairline + the
`lucide-coffee` icon at stroke-width 1.8 + the #3A3A3A 12px text), the stop
link card (the 1px /0.08 border + the hover-lift classes), the lh-1.1
`mb-2` h2, the MapPin meta row, the responsive login (14px/48px at 1280).
Functionally ALL GREEN: zero console errors across every page; the mobile
navbar end-to-end (52px border-box tab-bar, 12px links at −0.12px tracking,
tap navigation with the active state moving, scroll persistence); the
favourites round-trip (save → 1 card → unsave → the empty state); the
booking round-trip ("Request sent" + visible under Profile → My bookings);
the legal routes + legacy redirects.

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/390):** every session-24/25/26/27 surface re-verified UNCHANGED — the
route stop cards (the pill 28×101 with the shadow tail + coffee icon + the
h2 48px/52.8 + mb 8 + the link card 448×201 with the 1px /0.08 border + the
meta pin row + the violet Learn More hover), the hero + planner (h1 y 290,
the 548×56 4-segment glass pill with 46px segments), the footer, the
category cards, the trap heading, the stacking deck, the showcase insets,
the browses (the card shell + ALL internals: 28px titles, 12px white/75
eyebrows, 14px #888580 neighborhoods, 13px #72706A prices with the
active+dimmed split, the 36px heart, the 56×28 white rating pill), the
sights cards (360px, the hover-revealed violet pill), the stay grid (the
12-slug ORDER + the 381px column-major geometry), the detail (h1 y 225/82px,
card 1152×688 r36, Back 89×36 @y96, About 34px, the 28px surface2 tag
pills, the 44px/r16 form fields, the violet 48px Book Now), the profile
(h1 y 203/72px, the 34px chips, the 38px tabs, the 44×44 white/80 Go back),
the map (sticky top-96 1216×66 shell, "Try: romantic hotels", the 620px
canvas), the mobile tab-bar + nav text + planner card + headings.

**Four findings** — the trip-planner DATE-RANGE POPOVER (never re-measured
below the session-3 model), the home stay-showcase pill height (pinned at
41px since session 6), and the booking-form labels (pinned at 14px ink
since session 14):

## 3. Findings (verified by DOM measurement on the live app, 2026-09-28)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The DateRangePicker popover internals** — the whole popover chrome + header + month grid re-measured for the first time since session 3 | container 510×371 at desktop (358×429 at 390), `rounded-[40px] border border-black/10 bg-white p-3` (pad **12px**), shadow `0 18px 52px /0.16`; the from/to header `mb-2 grid gap-2 sm:grid-cols-2` of SELF-CONTAINED white pill fields (238×50 desktop / 332×50 mobile, `rounded-full border border-black/10 bg-white px-4 py-2`) each carrying the label (`from`/`to`, 12px/500 #8A8780) + the value ("Select date"/"Optional" → "15/09/2026", 12px/600 #141413) + a 14px calendar svg INSIDE; the month grid `.rdp` wrapper `rounded-[32px] border border-black/10 bg-white p-3` (12px); the month label **14px/500**; the nav buttons **28×28**; the weekday row **12.8px/400 #737373**; the day cells 32×32 with the SELECTED day `bg #571AFF` white text weight **400** and the IN-RANGE days bg **#F7F4FF** with **#571AFF text**; the PREV-MONTH trailing days render (30, 31) in the first row; **NO "Done" button** (outside-click closes) | the clone's popover is `w-[min(420px,…)]` (420 at desktop), `p-4` (16px); the header is a flex row with the labels BESIDE h-10 (40px) CREAM pill fields (no icons inside); the month label 14px/**600**; the nav buttons 32×32; the weekdays 12px/**500** muted; the selected day 600 weight; the in-range text ink; NO trailing prev-month days; a "Done" button renders at the bottom |
| F2 | **Med** | **The home stay-showcase pills** — 34px with a bordered Book Now | the live's pills carry the inline `height: 34px` + `border-radius: 999px` (the visible height computes 34 — the 51px reads on some cards are the live's own flex-stretch quirk); the Learn More `border 1px rgba(255,255,255,0.36) bg rgba(255,255,255,0.08)` 12px/600; the Book Now `bg white` 12px/700 **+ `border 1px rgba(255,255,255,0.92)`**; pill w 168–171 — the /stay BROWSE variant stays 36px borderless (verified) | the home variant forces `style={{ height: 41 }}` (41px); the Book Now carries NO border; the browse variant (h-9 36px borderless) is correct |
| F3 | **Med** | **The booking-form labels** — 12px/600 #3A3A3A with plain asterisks + the field border #DDDBD5 | labels "Name* / Surname* / Dates* / Time* / Phone / Email* / Message" at **12px/600 #3A3A3A** — the asterisk INLINE in the same color (no violet span); the inputs' border `rgb(221,219,213)` = the `--color-border` token #DDDBD5; the field font 14px; the picker buttons ("Choose dates"/"Choose time") 44px white r-16; the Book Now 385×48 violet r-full | the clone's labels are `text-sm font-semibold text-ink` (14px/600 #0E0E0E) with VIOLET asterisk spans (`text-roam`); the fields `border-black/10`; the picker/Book Now chrome matches |
| F4 | **Low** | **The profile stat-chip horizontal padding** | the live's chips (Augsburg 110×34 / streak 124×34 / Explorer 101×34) compute `padding: 8px 16px` | the clone's chips are `px-3.5` (14px) — a 2px/side difference |

Non-gaps re-verified (keep, document): the browse stay pills (36px
borderless — the clone's h-9 base is correct); the sights Learn More
(324×36 violet 700, hover-revealed — exact); the price ACTIVE+DIMMED split
(the empty 13px opacity-0.3 span on a 4-symbol place confirms the same
structure); the rating pill 56×28 white 6/10; the heart 36×45-disc; the
popover width cap at mobile (358 at 390 = `calc(100vw-32px)`); the
DD/MM/YYYY value format; the mobile nav's 16px `a` wrapper font with the
12px inner text spans (the session-29 pre-verified non-gap).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `home.spec.ts` — a NEW "the trip-planner date-range popover matches the live re-measure (session 28)" test: the popover opens (click "Choose trip dates") at `w ≈ 510` (1280 viewport), `padding 12px`, the two from/to fields are self-contained pills computing `h 50` with `bg white` + a 1px border, each containing the label + value + a calendar svg; NO "Done" button exists; the month label computes 14px + weight 500; the nav buttons compute 28×28; the weekday cells compute 12.8px + weight 400; the selected day carries the violet bg + weight 400; a PREV-MONTH trailing day renders in the first row. (b) `home.spec.ts` — extend the stay-showcase test: the Learn More + Book Now pills compute `h 34` (1280) and the Book Now carries a non-zero border-top-width. (c) `browse.spec.ts` — extend the booking-form test: the "Name" label computes `12px` font + `rgb(58, 58, 58)` color and the field border computes `rgb(221, 219, 213)` | tests/e2e/home.spec.ts, tests/e2e/browse.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **The popover container + header (F1a–d)**: the container `w-[min(420px,…)] p-4` → `w-[min(510px,calc(100vw-32px))] p-3`; the header flex → the live's `mb-2 grid gap-2 sm:grid-cols-2` of self-contained fields: each a `flex h-[50px] items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2` pill carrying the label span (12px/500 #8A8780), the value span (12px/600 ink), and a 14px Calendar svg; remove the "Done" button row (outside-click already closes) | src/components/planner/DateRangePicker.tsx | the R0a assertions GREEN |
| R2 | **The month grid chrome (F1e–j)**: the month label `font-semibold` → `font-medium` (500); the nav buttons `h-8 w-8` → `h-7 w-7` (28px); the weekday cells `text-xs font-medium text-muted` → `text-[12.8px] font-normal text-[#737373]`; the selected day `font-semibold` → `font-normal`; the in-range `bg-roam/10 text-ink` → `bg-[#F7F4FF] text-roam`; render the PREV-MONTH trailing days as grayed non-interactive spans in the leading cells | src/components/planner/DateRangePicker.tsx | the R0a month-grid assertions GREEN |
| R3 | **The home stay pills (F2)**: drop the `style={{ height: 41 }}` home override (the pills return to the live's 34px — `h-[34px]`), add `border border-white/[0.92]` to the home Book Now; keep the browse variant at h-9 borderless | src/components/places/StayCard.tsx | the R0b assertions GREEN; the browse pins (if any) stay GREEN |
| R4 | **The booking-form labels (F3)**: the label class `text-sm font-semibold text-ink` → `text-xs font-semibold text-[#3a3a3a]`; the asterisk `text-roam` spans → plain inline `*` in the label color; the fields `border-black/10` → `border-[#DDDBD5]` | src/components/places/BookingForm.tsx | the R0c assertions GREEN; the existing form pins (the 44px/r16 fields, the 48px Book Now) stay GREEN |
| R5 | **The profile chip padding (F4)**: `px-3.5` → `px-4` on the three stat chips | src/components/profile/ProfileView.tsx | visual spot-check; no existing pin contradicts |
| R6 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 68+ E2E; re-measure every remediated surface against the live on the dev server (the popover 510/pad-12/50px fields/no-Done/14px-500/28px-navs/12.8px-weekdays/400-weight-selected/#F7F4FF-in-range/trailing-days; the pills 34 + the Book Now border; the labels 12px #3A3A3A); capture the dev-server screenshots (incl. the popover) into `docs/screenshots/`; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- The popover width 510 at desktop must still cap at mobile (`calc(100vw-32px)` → 358 at 390) — the `min()` keeps both.
- Removing the "Done" button leaves outside-click as the only close path (the live's model); the picker already implements the mousedown-outside close, and Escape is not on the live either.
- The 12.8px weekday font is the live's computed value (0.8rem); `text-[12.8px]` pins it exactly.
- The stay pill height dropping 41 → 34 changes the card's overlay stack; the E2E stay-card pins (the titles/geometry) must stay green — the pills are hover-revealed and do not affect the resting geometry.
- The prev-month trailing days must not be clickable (grayed, non-interactive) — a11y parity with react-day-picker's disabled outside-days.

## 6. Execution record (2026-09-28, post-delivery)

All six remediation rows executed in TDD order (RED confirmed on the
unmodified tree — all three touched specs failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the NEW
  `home.spec.ts` date-picker contract (the popover 504–516 wide at 1280 +
  pad 12 + radius 40 + the self-contained 50px white from/to fields with
  the calendar icon + NO Done button + the month label 14px/500 + the
  28×28 navs + the 12.8px/400 #737373 weekdays + the gray #737373
  trailing-day button + the weight-400 violet selected day + the
  #F7F4FF/violet in-range day + the 358px mobile cap), the stay-showcase
  test extended (the pills 32–36 tall + the Book Now border 1px), and the
  booking-form test extended (the labels 12px/600 rgb(58,58,58) + the
  field border rgb(221,219,213)).
- **R1** — the popover container + header: `w-[min(510px,calc(100vw-32px))]`
  + `p-3` + the shadow `0 18px 52px /0.16`; the header rebuilt as the
  live's `mb-2 grid gap-2 sm:grid-cols-2` of self-contained
  `h-[50px] rounded-full border-black/10 bg-white px-4 py-2` fields
  carrying the 12px/500 #8A8780 label + the 12px/600 #141413 value + a
  14px Calendar icon; the "Done" button removed.
- **R2** — the month-grid chrome: the label `font-medium` (500), the navs
  `h-7 w-7` (28), the weekdays `text-[12.8px] font-normal text-[#737373]`,
  the selected day `font-normal`, the in-range `bg-[#F7F4FF] text-roam`,
  the PREV-MONTH trailing days as gray #737373 buttons, and the day-row
  gap `gap-y-2` (the live's 40px row pitch — the clone's first landing
  was 349px tall vs the live's 371 before the gap fix).
- **R3** — the home stay pills: the `style={{ height: 41 }}` override
  dropped for the `h-[34px]` variant classes + the Learn More
  border/bg pinned to white/[0.36] and white/[0.08] + the Book Now gained
  `border border-white/[0.92]`; the browse variant kept at `h-9`
  borderless.
- **R4** — the booking-form labels: `text-sm font-semibold text-ink` →
  `text-xs font-semibold text-[#3a3a3a]` with the asterisks inlined (the
  violet `text-roam` spans removed); the fields
  `border-black/10` → `border-[#DDDBD5]`.
- **R5** — the profile chips: `px-3.5` → `px-4` (the chips now compute
  110/125/102 × 34 — the live's 110/124/101 × 34).
- **En-route fix (the E2E run surfaced it)**: the hero content wrapper's
  `z-10` CAPPED the popover's `z-[30000]` inside a stacking context that
  the category section's own `relative z-10` (later in the DOM) painted
  OVER — the day-cell clicks were intercepted ("subtree intercepts
  pointer events"). The wrapper drops the z-index; the absolute backdrop
  sibling + plain DOM order keep the content layering identical (every
  hero E2E pin stayed green).
- **Side-by-side verification on the dev server** (both sites re-measured):
  the popover 510×369 at 1280 (the live 510×371) with the pad-12 chrome +
  the 238×50 fields + the 40px row pitch + the mobile 358×427 @x=16 (the
  live 358×429) — EXACT within 2px; the stay pills 168×34 with both
  borders; the labels 12px/600 rgb(58,58,58) + the rgb(221,219,213)
  borders; the chips 110/125/102 × 34.
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **69/69 E2E** ✓.
- **37 screenshots** (5 new — the desktop popover + the selected-range
  state + the mobile popover + the stay-card pills + the booking-form
  labels — VLM-verified via `scripts/capture-screens-v9-session28.mjs`);
  `.env.example` re-verified (covers every code-referenced var:
  DATABASE_URL, AUTH_SECRET, DEBUG_DBPATH + the reserved
  NEXT_PUBLIC_SITE_URL); docs aligned (README, AGENTS, CLAUDE, PAD v2.7,
  activity-map_SKILL v1.15.0, this plan, the worklog).
