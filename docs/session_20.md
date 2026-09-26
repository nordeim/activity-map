# Session 20 — deployed-mirror re-audit, live re-measure, the route-choreography parity (stop-card typography, the 50/50 desktop split + continuous scroll-linked swap, the mobile panel paddings), TDD, screenshots, docs, commit + push

Base: `origin/main` @ `a2de5ab` (git pull over the persisted workspace — the owner's
`update session log` commit added `docs/session_19.md`, the previous agent's narration,
and the start-server-log update showing the deployed mirror rebuilt/restarted WITH the
session-18 code). Prompt: refresh → review all root docs + `docs/session_18.md`,
`docs/remediation-plan-session-18.md`, `worklog.md`, `docs/session_19.md`,
`docs/start_server_log.txt` → validate against the codebase → run browser E2E against the
deployed `https://activity-map.jesspete.shop/` → parity with `activity-map.base44.app` →
mobile-nav / Tailwind v4 attention → env + db validation → vitest/playwright validation →
remediation plan → TDD execution → screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_18.md, remediation-plan-session-18.md, worklog.md,
  session_19.md, start_server_log.txt; scandihaven patterns confirmed (the sibling clone
  persisted from session 18 — same stack family); repo skills catalog consulted
  (agent-browser / tdd / tailwind-patterns / clone-app-pat-pro — the v4 mobile-nav failure
  classes stay pinned in `tests/e2e/mobile-navigation.spec.ts`).
- Baseline gates on the untouched tree: lint ✓ (the 2 pre-existing warnings) typecheck ✓
  42 unit ✓ build ✓ **56/56 E2E** ✓ 27/27 smoke ✓; `db/` at the repo root (42+27+9 places
  + demo user); `.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"` — the
  npm scripts pin it inline); vitest + playwright configs present and functional; the
  documented stray parent `.env` trap was NOT present this session.
- The deployed mirror is UP and **running the session-18 code** (verified live: the eat
  heading texture 1280×394 @18px/40%, the detail split grid 676.8px/451.2px gap-24 with
  the rounded-28 aside and the 16px fields, the mobile full-viewport route visual with
  zero visible chips).

## 2. Dual-site browser audit (agent-browser, logged in on both)

**Deployed-mirror functional audit — all green:** every page loads with ZERO console
errors; the mobile navbar works end-to-end (the fixed 52px cream-glass header, icon
x-positions 304/330/356 identical to the live, one-line 12px links, fixed positioning
survives scroll, tap navigation moves the active state, no horizontal overflow at 390 —
no Tailwind v4 failure classes); the desktop floating pill is exact (820×56 at x=230,
radius 999, #E8E6DC border); the favourites save/unsave round-trip works (POST 201 →
visible → DELETE 200 → state restored); the booking round-trip works (POST 201 →
"Audit Session20" visible under Profile → My bookings — the owner's redeploy wipes it);
the session-18 surfaces all render (the heading textures, the detail split, the mobile
route visual 390×844 sticky, the flowing restaurant list at 620px advances, the 800px
band overlap).

**Live-source re-measure (logged in; DOM audits at 1280/390):** every surface re-verified
UNCHANGED against the session-18 records — desktop pill, mobile nav, browse/map headings
+ textures + chips, browse cards, the detail split, the map page + list cards, the
profile, the category cards, the mobile planner, the stay showcase, the sights, the mobile
restaurant flow, the desktop band overlap (800px EXACT), the favourites page, the login
chrome, the hero anchors — EXCEPT the **Recommended Route stop cards**, which re-measured
to a smaller typography scale, a narrower link card, a 50/50 desktop split, and a
CONTINUOUS scroll-linked swap choreography (4 findings, `docs/remediation-plan-session-20.md`):

- **F1 (High)**: the place name is an h3 at **20px/600** (line-height 30px, #141413) with
  the meta line at **13px/400 #72706A** (mt-2) and the Learn More text at **13px/600** —
  the clone rendered 30px/16px-#0e0e0e/14px.
- **F2 (High)**: the desktop split is **50/50** — the visual panel 640px (svg 640×800)
  and the waypoint panel 640px (`px-8 lg:px-12`, cards 576 @x=672); the card SLOT sits at
  **y=237** from the sticky top; the cards translate upward **CONTINUOUSLY** with scroll
  (0.665px per scroll px; card i crosses the slot at ~620px scroll intervals ≈ every 25%
  of trap progress; tent-fades ±380px around the slot; 120ms linear transitions) — the
  exiting cards rise OUT (never sink). The clone had `w-[46%]`, cards at y=96, and a
  discrete crossfade (translate-y-10 dip + 500ms).
- **F3 (Med)**: the mobile route panel pads **`28px 18px 48px`** (cards 354 @x=18 with
  ~28px gaps, mt-7); the desktop link card is **max-w-md** (448px, left-aligned).
- **F4 (Low)**: the time pill is `px-3 py-1` (101×28) with **12px/400** text, a **14px**
  clock icon, and **NO shadow**; the link card is `mt-7 p-5` with the lighter
  `0 8px 28px rgba(14,14,14,0.08)` shadow.

## 3. TDD remediation (specs updated first — RED verified: the time-pill weight
assertion failed exactly as expected, then GREEN after R1–R6)

- R1 **Typography**: the place name became `<h3 class="text-[20px] font-semibold
  leading-[30px] text-[#141413]">`; the meta line `mt-2 text-[13px] font-normal
  text-[#72706A]` (en-route lesson: the live's computed rgb(114,112,106) is #72706A, NOT
  #72706C — 0x6A vs 0x6C, a 2-blue-channel miss the first GREEN run caught); the
  description `mt-4`; the Learn More text `text-[13px] font-semibold`.
- R2 **Link card + pill chrome**: the link `mt-7 max-w-md rounded-[28px] bg-white p-5
  shadow-[0_8px_28px_rgba(14,14,14,0.08)]` (no sm:p-6); the time pill `mb-4 inline-flex
  gap-2 rounded-full bg-white px-3 py-1 text-xs font-normal` with the Clock at h-3.5
  w-3.5, NO shadow; the h2 keeps mt-0 (the pill's mb-4 spaces it).
- R3 **Desktop split 50/50**: the visual panel `w-[46%]` → `w-1/2`; the stops column
  `lg:px-12` → `lg:px-8` (cards 576 full-width @x=672 — the live's −mx-4 equivalent).
- R4 **The continuous choreography**: the column gains `lg:pt-[237px]` (the card slot);
  each article gets scroll-linked inline `transform: translateY(relPx)` + `opacity` where
  `rel = (i/(N−1) − p) × trapScrollPx × 0.665` and `opacity = clamp(1 − |rel|/380, 0, 1)`,
  applied ONLY at lg (an `isDesktop` matchMedia state gates the inline styles — the mobile
  flow stays static), rAF-throttled with the existing progress, `transition: opacity
  120ms linear, transform 120ms linear`; the `lg:translate-y-10`/`duration-500` swap
  classes removed; `data-active` stays (the nearest-slot card — `round()`, not `floor()`).
- R5 **Mobile panel paddings**: the stops container `px-4 pb-24 pt-6 sm:px-6` →
  `px-[18px] pb-12 pt-[28px] md:px-8`; the mobile card gaps `mt-10` → `mt-7`.

En-route traps (documented in CLAUDE.md + the session-20 plan): `scrollIntoViewIfNeeded`
on the 420vh trap is NON-DETERMINISTIC (it centered the tall element mid-viewport at
p=0.5 in full-suite runs — the E2E now uses deterministic `window.scrollTo` probes); the
meta-line color arithmetic (#72706A vs #72706C); late-loading images above the route
shift the layout after a programmatic scroll (the E2E re-aligns once before measuring the
slot and asserts the designed `lg:pt-[237px]` computed value + a tolerant runtime range).

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓ 27/27 smoke ✓
  **56/56 E2E** ✓ (the route contract extended in place: the h3 20px/600 + 13px #72706A
  meta + 13px Learn More + max-w-md 448px desktop link card + shadow-less 12px/400 pill +
  the 630–650px visual panel + the designed 237px slot + the intermediate-opacity
  crossfade + card 0 exiting upward + the mobile link-card x=18/354-wide).
- Side-by-side DOM verification against the live's measured values: the visual panel 640
  EXACT; the slot 237 EXACT; the link card 448 EXACT; the h3 20px/600/30px EXACT; the
  meta 13px rgb(114,112,106) EXACT; the pill 12px/400 no-shadow + the 14px clock EXACT;
  the choreography samples at offsets 0/200/400/600/800 match the live's recorded y/o
  within 3–17px and **0.02 opacity** (0.65/0.66, 0.30/0.32, 0.58/0.60, 0.93/0.94,
  0.72/0.72); the mobile panel `28px 18px 48px` EXACT with cards 354@x18 and 28px gaps
  EXACT.
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; reseed → fresh
  login → the Moss & Marble favourite saved for 07 after the documented reseed flow).
- Docs aligned: README (the route feature row + the session-20 status row), AGENTS (the
  route choreography facts), CLAUDE (the testing map + the architecture bullet + the
  E2E traps), PAD (v2.0 revision), activity-map_SKILL (v1.8.0), the session-20
  remediation plan, this session log, the worklog. `.env.example` re-verified
  (DATABASE_URL / AUTH_SECRET / NEXT_PUBLIC_SITE_URL / DEBUG_DBPATH cover every code
  reference).
