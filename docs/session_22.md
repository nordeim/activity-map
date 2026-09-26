# Session 22 — deployed-mirror re-audit, live re-measure, the hero-framing + nav-glass + letter-spacing parity, TDD, screenshots, docs, commit + push

Base: `origin/main` @ `64e5148` (git clone over the reset workspace — the owner's
commits added `docs/session_21.md`, the session-20 audit documentation, and the
start-server-log update showing the deployed mirror rebuilt/restarted WITH the
session-20 code). Prompt: clone/refresh → review all root docs +
`docs/session_20.md`, `docs/remediation-plan-session-20.md`, `worklog.md`,
`docs/session_21.md`, `docs/start_server_log.txt` → validate against the
codebase → run browser E2E against the deployed
`https://activity-map.jesspete.shop/` → parity with `activity-map.base44.app`
(with particular attention to the mobile navigation menu + possible Tailwind
v4 bugs) → env + db validation → vitest/playwright validation → remediation
plan → TDD execution → screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_20.md, remediation-plan-session-20.md,
  worklog.md, session_21.md, start_server_log.txt; the repo skills catalog
  consulted (agent-browser / tdd / tailwind-patterns / clone-app-pat-pro — the
  v4 mobile-nav failure classes stay pinned in
  `tests/e2e/mobile-navigation.spec.ts`).
- Baseline gates on the untouched tree: lint ✓ (the 2 pre-existing warnings)
  typecheck ✓ 42 unit ✓ build ✓ **56/56 E2E** ✓ 27/27 smoke ✓; `db/` recreated
  at the repo root (42+27+9 places + demo user via `db:push` + `db:seed`);
  `.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"` — the
  npm scripts pin it inline); vitest + playwright configs present and
  functional; no stray parent `.env` trap.
- The deployed mirror is UP and **running the session-20 code** (verified live
  by signature: the h3 20px/600 stop cards, the 448px max-w-md link cards at
  x=672, the 640×800 visual panel, the absolute top-400 choreography with
  0.12s linear transitions).

## 2. Dual-site browser audit (agent-browser, logged in on both)

**Deployed-mirror functional audit — all green:** every page loads with ZERO
console errors (/, /eat, /stay, /do, /map, /favourites, /profile, a place
detail, /privacy, /accessibility); the mobile navbar works end-to-end (the
fixed 52px cream-glass header, icon x-positions 304/330/356 identical to the
live, one-line 12px links, fixed positioning survives scroll, tap navigation
moves the active state, no horizontal overflow at 390 — no Tailwind v4 failure
classes); the desktop floating pill is exact (820×56 at x=230, radius 999,
#E8E6DC border); the favourites save/unsave round-trip works (POST 201 →
visible → DELETE 200 → state restored); the booking round-trip works (POST 201
→ visible in the bookings list — the owner's redeploy wipes it); the
session-20 surfaces all render.

**Live-source re-measure (logged in; DOM audits at 1280/768/390):** every
surface re-verified UNCHANGED against the session-20 records — the desktop
pill, the mobile nav (12px Inter spans 700/500, icons 304/330/356), the
browse/map headings + textures + chips (38px/12px/600), the browse cards, the
detail split (h1 y=225 82px, the 1152×688 r-36 card, 44px/16px inputs), the
map page (41px pills, the 620px canvas, 9 cards at h≈119), the profile
(chrome-less, h1 72px y=203, the email line), the category cards (306×227
mobile, scrollWidth 978), the mobile planner, the stay showcase (12×381
squares), the sights, the mobile restaurant flow (354 cards, 130px gaps), the
blue band (800px overlap EXACT), the favourites page (the dormant display:none
eyebrow re-confirmed), the login chrome, the hero h1 anchors (y=203@390 /
290@1280, x=24), the route stop cards + the 50/50 split + the continuous
choreography — EXCEPT **5 deltas** (`docs/remediation-plan-session-22.md`):

- **F1 (High)**: the desktop hero photo FRAMING — the live's
  `.today-hero-section` pulls itself up (mt −80px, landing at page y≈−8) and
  its `.today-hero-bg` is ABSOLUTE with inset −78px 0 6px → the photo box
  spans page −86→924 at 1280 (1010px, cover-cropped ≈7.7% more zoomed than the
  clone's 938px full-container box); at 768 the box is 972px (−86→886). The
  clone rendered the image box exactly to its 900/938 container.
- **F2 (Med)**: the mobile-nav glass — the live's `.tab-bar` renders
  `rgba(248,247,244,0.62)` + `backdrop-filter: blur(24px) saturate(1.5)`;
  the clone had `bg-cream/60` + `backdrop-blur-[20px]`.
- **F3 (Low)**: the nav link letter-spacing — the live's desktop 13px spans
  carry +0.01em (0.13px) and the mobile 12px spans −0.01em (−0.12px); the
  clone rendered `normal` on both.
- **F4 (Low)**: the route stop-card h3 carries −0.02em (−0.4px at 20px).
- **F5 (Low)**: the route time-pill text carries +0.05em (0.6px at 12px).

## 3. TDD remediation (specs extended first — RED verified on all five
contracts against the unmodified tree: the hero img 938 vs the expected
1000–1020; the glass blur(20px) vs the expected blur(24px) saturate(1.5); the
three tracking NaNs — then GREEN after R1–R5)

- R1 **Hero framing (F1)**: the Hero restructured — the section gains
  `md:-mt-[73px]` (the pull under the 73px in-flow sticky header, moved from
  the old container); the backdrop is ABSOLUTE at EVERY breakpoint
  (`absolute inset-x-0 top-0 bottom-0 overflow-hidden md:-top-[86px]
  md:bottom-[14px]` — the live's inset translated into the clone's page space
  where the section sits at y=0); the in-flow CONTENT layer carries the
  591/900/938 heights with the unchanged pt-203/pt-290 anchors. En-route trap
  (caught by the mobile hero spec in the GREEN phase): the mobile backdrop
  must be absolute — an in-flow backdrop + a separate in-flow content layer
  STACKS the two 591px boxes (the h1 landed at y=794).
- R2 **Nav glass (F2)**: `bg-[rgba(248,247,244,0.62)] backdrop-blur-[24px]
  backdrop-saturate-[1.5]` — the two backdrop utilities compose into ONE
  `blur(24px) saturate(1.5)` declaration (verified computed; the plan's
  arbitrary-fallback risk did not materialize); `md:backdrop-saturate-none`
  added to the desktop reset.
- R3 **Nav tracking (F3)**: the link base gains `tracking-[-0.01em]` with
  `md:tracking-[0.01em]` (−0.12px @12px / +0.13px @13px); the desktop Map
  link matches.
- R4 **Route h3 (F4)**: `tracking-[-0.02em]` (−0.4px @20px).
- R5 **Time pill (F5)**: `tracking-[0.05em]` (0.6px @12px).

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓ 27/27
  smoke ✓ **58/58 E2E** ✓ (two new contracts — the tab-bar glass + the mobile
  link tracking — and three extended ones: the hero geometry @1280/768, the
  route h3/pill tracking, the desktop pill link tracking).
- Side-by-side DOM verification against the live's measured values — **every
  remediated surface EXACT**: the hero img box y=−86 h=1010 w=1280 @1280
  (live: −86/1010.2/1280); y=−86 h=972 @768 (live: −86/972); y=0 h=591 @390
  (live: 0/591); the h1 y=290 @1280 / y=203 x=24 @390 (unchanged anchors);
  the glass bg `rgba(248,247,244,0.62)` + `blur(24px) saturate(1.5)` EXACT;
  the desktop nav ls 0.13px / mobile −0.12px / route h3 −0.4px / time pill
  0.6px — all four EXACT.
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; the Moss &
  Marble favourite saved for 07 after a fresh dev login).
- Docs aligned: README (the home feature row + the session-22 status row),
  AGENTS (the navbar glass + tracking facts + the hero framing + 58 E2E),
  CLAUDE (the mobile chrome + the testing map), PAD (v2.1 revision),
  activity-map_SKILL (v1.9.0), the session-22 remediation plan, this session
  log, the worklog. `.env.example` re-verified (DATABASE_URL / AUTH_SECRET /
  NEXT_PUBLIC_SITE_URL / DEBUG_DBPATH cover every code-referenced env var;
  `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root).
