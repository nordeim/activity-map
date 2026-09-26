# Session 18 — deployed-mirror re-audit, live re-measure, the heading-grid texture + detail split + mobile-route visual parity, TDD, screenshots, docs, commit + push

Base: `origin/main` @ `9927947` (git clone — the workspace had been reset;
the owner's `update session log` commit added `docs/session_17.md`, the
previous agent's narration, and showed the deployed mirror rebuilt/restarted
WITH the session-16 code). Prompt: refresh → review all root docs +
`docs/session_16.md`, `docs/remediation-plan-session-16.md`, `worklog.md`,
`docs/session_17.md`, `docs/start_server_log.txt` → validate against the
codebase → run browser E2E against the deployed `https://activity-map.jesspete.shop/`
→ parity with `activity-map.base44.app` → mobile-nav / Tailwind v4 attention →
env + db validation → vitest/playwright validation → remediation plan → TDD
execution → screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_16.md, remediation-plan-session-16.md,
  worklog.md, session_17.md, start_server_log.txt; scandihaven patterns
  confirmed same stack (cloned to a sibling dir for reference; the in-repo
  `scandihaven_SKILL.md` carries the same lessons); repo skills catalog
  consulted (agent-browser / tdd / tailwind-patterns / clone-app-pat-pro —
  the v4 mobile-nav failure classes stay pinned in
  `tests/e2e/mobile-navigation.spec.ts` and the Tailwind-V4-Validation-Report).
- Baseline gates on the untouched tree: lint ✓ (the 2 pre-existing warnings)
  typecheck ✓ 42 unit ✓ build ✓ **56/56 E2E** ✓ 27/27 smoke ✓; `db/` at the
  repo root (42+27+9 places + demo user); `.env`/`.env.example` correct
  (`DATABASE_URL="file:../db/custom.db"` — the npm scripts pin it inline);
  vitest + playwright configs present and functional. The documented stray
  parent `.env` (session-2 hijack) was present again — neutralized before
  seeding.
- The deployed mirror is UP and **running the session-16 code** (verified:
  the chrome-less profile with h1 y=201, the four-row map list 395×117 in
  the interleaved order, the 358px mobile planner).

## 2. Dual-site browser audit (agent-browser, logged in on both)

**Deployed-mirror functional audit — all green:** every page loads with ZERO
console errors; the mobile navbar works end-to-end (52px fixed cream-glass
tab-bar, icon x-positions 304/330/356 identical to the live, one-line 12px
links, fixed positioning survives scroll, tap navigation moves the active
state, no horizontal overflow at 390, no Tailwind v4 failure classes); the
desktop floating pill is exact (820×56 at x=230, radius 999, #E8E6DC border,
13px links); the favourites save/unsave round-trip works (state restored);
the booking round-trip works (request persisted + visible under Profile →
My bookings — "Moss & Marble · 5 Oct 2026 · 19:00 · Audit Session18"); the
map list matches the session-16 contract.

Non-gaps re-verified against the live (within tolerance): mobile nav (inner
span 12px/500), desktop pill internals, profile (chrome-less, h1 y=203, the
grid overlay), map cards (397×119, the exact eyebrow sequence), map chrome
(1216 search, 41px pills, 622 canvas), browse headings/chips/cards, category
cards (263×231 + hanging VA; mobile 306×227 r24), mobile planner (358@x=16),
stay showcase (1178/381/column-major), sights, login, hero anchors, desktop
route choreography (progress pill + 576 swap card), restaurants band height.

The live re-measure then found **6 actionable findings**
(`docs/remediation-plan-session-18.md`):

- **F1 (High)**: the 18px graph-paper grid texture now rides EVERY heading
  section — eat/stay/do (h 385–405) + map (h 413) as FULL-BLEED sections
  that WRAP the planner + chips / search + pills, and the place-detail hero
  (h 772/667). The clone only had it on favourites + profile.
- **F2 (High)**: the place-detail restructured — the rounded-36 card ends
  after the hero photo; "About this place" + the form live BELOW in a
  separate `px-5 pt-8 md:px-8` section wrapping `mx-auto grid max-w-6xl
  gap-6 lg:grid-cols-[1.2fr_0.8fr]`; the form is a separate
  `aside.scroll-mt-24.rounded-[28px].bg-white.p-6.md:p-8` card (451px).
- **F3 (Med)**: the booking-form fields are radius 16px (the live moved off
  rounded-full); the textarea 16px; the submit stays a full pill.
- **F4 (Med)**: the mobile route pins a FULL-VIEWPORT winding-path SVG
  (sticky ~208vh) BEFORE the stop cards flow — NO mobile progress chip, no
  dashed timeline; the stop link-cards are rounded-28 with 30px titles.
- **F5 (Med)**: the mobile restaurant section FLOWS six static cards
  (490px, 620px advances, ~130px gaps — position: static) — the live
  dropped the session-8 sticky-stacking deck.
- **F6 (Med)**: the desktop blue band starts at the route sticky's release
  point (y=3703 while the route box ends 4503 — an 800px overlap).
- F7 (Low, deviation): the hero photo's top-crop nuance (the live's img is
  1010px at top −86; the clone's 938 at top 0 — same section height and h1
  y). F8: deliberate deviations kept.

## 3. TDD remediation (specs updated first — RED verified with targeted runs: 8 failures as expected, then GREEN)

- R1 **The heading texture**: the eat/stay/do + map headings became FULL-BLEED
  `relative overflow-visible` sections (`px-4 pb-8 pt-16 md:px-8 md:pt-24`)
  carrying the 18px graph-paper overlay (the favourites' proven
  arbitrary-value pattern) and WRAPPING the planner + chips / search +
  pills (the chips row bleeds via `-mx-4 md:-mx-8`); the grids moved into
  padded wrapper divs below.
- R2 **The detail split**: the hero section (`px-4 pt-4 md:px-8 md:pt-6`)
  gained the overlay and the rounded-36 card now closes after the photo; a
  new `px-4 pt-8 md:px-8` section wraps the `[data-detail-grid]`
  (`mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]`) with the
  About column + the BookingForm rendered as `aside#book-now-card`
  (scroll-mt-24 rounded-28, hairline, no shadow, p-6/md:p-8, the 18px
  "Book Now" h3 + the 14px #888580 request line); `#book-now` stays on the
  inner form so the fill/submit flow is untouched.
- R3 **Field radii**: the inputs + textarea moved to `rounded-[16px]`; the
  submit stays `rounded-full`.
- R4 **The mobile route visual**: a mobile-only `h-[208vh] lg:hidden` region
  pins the full-viewport winding-path SVG (the same numbered-waypoint
  rendering, `mobileTrapRef` driving the violet fill across the region's
  scroll); the mobile progress chip + dashed timeline REMOVED; the stop
  link-cards `rounded-[28px]` with 30px place titles; the desktop
  arrangement untouched.
- R5 **The mobile restaurant flow**: the sticky-stacking deck replaced with
  the live's flowing list — static `rounded-[28px]` cards with 130px
  bottom margins (620px advances).
- R6 **The band overlap**: `#highlighted-restaurants` gained
  `relative z-10 lg:-mt-[800px]` — its top now starts exactly at the route
  sticky's release point (band top 3740 == trap end 4540 − 800), matching
  the live's choreography.

En-route findings: the live's browse eyebrow ("Augsburg dining guide", 12px
violet) is `display:none` at BOTH breakpoints — dormant DOM, not rendered
(don't clone it); the live's `px-5` class computes to **16px** at mobile —
the clone uses `px-4` on the restructured sections (h1 x=16, cards 358@x16,
the mobile aside 358@x16 — exact); the reseed invalidates the stateless
session cookie (the favourite POST 500s with the stale cuid — force a fresh
login before the capture favourite); the mobile-overlay height nuance (608
vs the live's 655 — planner-card spacing) and the detail-gutter texture
prominence (the live's overlay is DOM-identical but visually muted beside
the card's shadow) are documented tolerances.

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓
  27/27 smoke ✓ **56/56 E2E** ✓ (the contracts extended in place: the
  browse/map/detail heading overlays, the detail split (the card ends after
  the photo, About below, gap-24, the aside 440–465px, radius-16 fields),
  the mobile route visual (svg ≥390 wide, zero visible chips, rounded-28),
  the mobile flowing list (static, 580–660 advances), the band overlap
  (700–900px)).
- Side-by-side DOM verification against the live's measured values: the
  browse overlays 1280w × 394/372h at 40%/18px (live 385–413); h1 y=169
  (live 168); the detail card 692×1152 (live 688) containing ONLY the
  header+photo; About y=885 (live 909); the grid 1152/gap-24; the aside
  451×r28 (live 451); the inputs 16px; the mobile route 3752px with the
  390×844 svg (live 3741); zero visible chips; the mobile aside 358@x16
  (live exact); the desktop overlap 800px EXACT (band top 3740 == route
  release); the mobile eat h1 x=16 + cards 358@x16 (live exact).
- VLM spot-checks: the eat page "the CLONE has the subtle graph-paper grid
  texture behind the heading area, just like the SOURCE"; the detail card
  structure "Match"; pixel-periodicity analysis confirmed the 18px texture
  on BOTH detail pages (the live's gutter prominence is shadow-muted).
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; reseed →
  forced re-login → the Moss & Marble favourite saved for 07 after the
  stale-cookie POST-500 trap was diagnosed via network monitoring).
- Docs aligned: README (features/status), AGENTS (the texture/detail/
  choreography facts), CLAUDE (testing map + architecture bullet), PAD
  (v1.9 revision), activity-map_SKILL (v1.7.0), this session log, the
  worklog. `.env.example` re-verified (DATABASE_URL / AUTH_SECRET /
  NEXT_PUBLIC_SITE_URL / DEBUG_DBPATH cover every code reference).
