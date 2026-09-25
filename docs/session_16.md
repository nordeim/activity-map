# Session 16 — deployed-mirror re-audit, live re-measure, the chrome-less profile + map-list parity, TDD, screenshots, docs, commit + push

Base: `origin/main` @ `e2742df` (git clone — the workspace had been reset; the
owner's `update start server log` commit added `docs/session_15.md`, the
previous agent's narration, and showed the deployed mirror rebuilt/restarted
with the session-14 code). Prompt: refresh → review all root docs +
`docs/session_14.md`, `docs/remediation-plan-session-14.md`, `worklog.md`,
`docs/session_15.md`, `docs/start_server_log.txt` → validate against the
codebase → run browser E2E against the deployed `https://activity-map.jesspete.shop/`
→ parity with `activity-map.base44.app` → mobile-nav / Tailwind v4 attention →
env + db validation → vitest/playwright validation → remediation plan → TDD
execution → screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_14.md, remediation-plan-session-14.md,
  worklog.md, session_15.md, start_server_log.txt; scandihaven patterns
  confirmed same stack (repo cloned to a sibling dir for reference; the
  in-repo `scandihaven_SKILL.md` carries the same lessons); repo skills
  catalog consulted (agent-browser / tdd / tailwind-patterns /
  clone-app-pat-pro).
- Baseline gates on the untouched tree: lint ✓ (the 2 pre-existing warnings
  in the owner's audit scripts) typecheck ✓ 42 unit ✓ build ✓ **54/54 E2E** ✓;
  `db/` at the repo root (42+27+9 places + demo user);
  `.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"` — the
  npm scripts pin it inline); vitest + playwright configs present and
  functional.
- The deployed mirror is UP and **running the session-14 code** (verified:
  the profile h1 "sepnetflix2023", the column-major 381px stay grid, the
  text-only map list).

## 2. Dual-site browser audit (agent-browser, logged in on both)

**Deployed-mirror functional audit — all green:** every page loads with ZERO
console errors; the mobile navbar works end-to-end (52px fixed cream-glass
tab-bar, icon x-positions 304/330/356 identical to the live, fixed
positioning survives scroll, tap navigation moves the active state, no
horizontal overflow at 390, no Tailwind v4 failure classes); the desktop
floating pill is exact (820×56 at x=230, radius 999, #E8E6DC border, 13px
links, active 700 ink); the favourites save/unsave round-trip works; the
booking round-trip works (request persisted + visible under Profile → My
bookings); the desktop planner pill matches exactly (548×56 at x=366).

Non-gaps re-verified against the live (within tolerance): eat heading
(h1 y=168/169, x=32, 55px, 14px rgb(58,58,58) subtitle), chips (38px/12px,
identical labels), browse cards (390/392 × 562), map chrome (41px pills,
618/620px canvas, full-width search), favourites heading (h1 y=244/245,
scoped 18px overlay), place detail (h1 y=225/229, rounded-28 hairline form
card, Book Now 18px, single-column 44px fields), stay showcase
(column-major, 381px cards at x=51, row 1 = Courtyard | Maison | Velvet),
sights (360px at x=80), hero (h1 x=24, y=203/290, 591px mobile photo), route
stops (text-only, 0 imgs), restaurants band (3680px), the footer and login
(E2E-pinned).

The live re-measure then found 11 findings (`docs/remediation-plan-session-16.md`):

- **F1 (High)**: the live's `/profile` renders WITHOUT ANY APP CHROME — no
  navbar at either breakpoint, no footer (the DOM carries zero
  header/nav/footer elements; VLM-confirmed) — only the floating Back +
  Sign out buttons. Every other page keeps the full chrome.
- **F2 (High)**: the profile carries a FULL-PAGE fixed graph-paper grid
  overlay (18px crossings, rgba(20,20,19,0.055), 40% opacity,
  pointer-events-none).
- **F3 (High)**: the profile geometry — outer `px-5 pb-24 pt-10
  md:px-8 md:pt-16`, main `max-w-4xl`, back row at the top (Go back 44×44 +
  Sign out 114×46, both white/80) → h1 y=203 desktop / 167 mobile (the clone
  rendered 258/209).
- **F4 (Med)**: the identity block is `text-center md:text-left`; the chip
  icons are map-pin / SUN / HEART (the clone used flame / compass).
- **F5 (Med)**: the total booking count renders beside the "My bookings" h2.
- **F6 (High)**: the map list cards are FOUR rows — eyebrow + €-price on ONE
  justified row, the 15px/600 title, the 12px #888580 NEIGHBORHOOD line
  (card h=119; the clone had 3 rows, price misplaced, h=98).
- **F7 (High)**: the do-places render their SUB-CATEGORY uppercase as the
  eyebrow (LANTERN WALK / ROOFTOP MUSIC / ART WORKSHOP), not "SIGHT".
- **F8 (Med)**: the list order is the live's interleaved array (Brass &
  Marble → Ember Garden → Cloud Nine → Fuggerei Afterglow → Orbit Osteria →
  Canal Hideaway → Perlach Sessions → Saffron Radio → Canal Studio Night);
  the live's hrefs use the same `map-*` slugs.
- **F9 (Med)**: the mobile home planner card is 358px wide at x=16 (16px
  viewport margins — wider than the px-6 hero content) with a 4px grid gap;
  the clone rendered 342 at x=24 with a 6px gap.
- **F10 (Med)**: the desktop category cards grew — 46px rows, 34×35 icon
  cells, the near-black 229×54 View All hanging BELOW the glass card's
  bottom edge (card ≈231px); the mobile carousel cards keep the 36px/28×28
  internals at radius 24.
- **F11 (Info)**: deliberate deviations kept (entity-ID URLs, the
  restaurants DOM carousel).

## 3. TDD remediation (specs updated first — RED verified with targeted runs, then GREEN)

- R1 **Profile leaves the app chrome**: new `src/app/(bare)/` route group —
  the layout re-implements ONLY the auth gate (same `getSessionUser` +
  redirect) with no Navbar/SiteFooter; `git mv` moved the profile page (URL
  unchanged).
- R2 **Profile structure + grid**: the main → `relative mx-auto max-w-4xl
  px-5 pb-24 pt-10 md:px-8 md:pt-16` (the inner 896 wrapper dropped); the
  full-page fixed 18px grid overlay added as the first element (the
  favourites overlay's proven arbitrary-value pattern).
- R3 **Identity + controls**: the identity block `text-center md:text-left`
  (chips + Saved places center on phones); Go back / Sign out became
  white/80 pills (Go back a 44×44 button); chip icons → Sun / Heart.
- R4 **Bookings count**: the h2's right-side count now carries
  `bookings.length` (the total, like the live).
- R5 **Map list cards**: the FOUR-row layout — `h-[26px]` eyebrow+price
  justified row, `mt-3` title, `mt-2` neighborhood (12px #888580) → card
  h≈117 (live 119).
- R6 **Map eyebrows**: `mapListEyebrow()` — eat→RESTAURANT, stay→HOTEL,
  do→subCategory.toUpperCase().
- R7 **Map order**: `prisma/data/map.json` reordered to the live's
  interleaved array (the seed's sortOrder is the array index).
- R8 **Mobile planner**: the glass card escapes the px-6 content — `-mx-2`
  + `w-[calc(100%+16px)]` (w-full caps at the parent width — the first
  attempt moved x without widening) → 358px at x=16; the mobile grid gap →
  4px (`gap-1`).
- R9 **Category cards**: the desktop rows 46px at 9px gaps (156px track)
  with 34×35 icon cells; the desktop View All hangs below the glass
  (`md:absolute md:bottom-[-27px]`, 229×54 — a DOM child of the article so
  the ancestor locator keeps working) with ~40px row clearance; the mobile
  cards keep the 36px/28×28 internals, now `rounded-[24px]`.

En-route findings: `w-full` + negative margins does NOT widen an element
(width:100% resolves against the parent box — the calc() escape is
required); the smoke test's booking round-trip writes into the dev
`db/custom.db` (pre-existing — reseed before screenshot captures, then
re-login: the stateless cookie carries the pre-reseed user cuid, the
documented session-3 trap); the dev DB's smoke-test booking cleared by the
reseed before the captures.

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓
  27/27 smoke ✓ **56/56 E2E** ✓ (the contracts extended in place: the
  chrome-less profile (no nav/footer at 390+1280, the fixed grid overlay,
  h1 y 192–214, the Go back button, the centered-mobile identity, the
  sun/heart icons), the four-row map cards (h 105–128, the neighborhood, the
  price-on-eyebrow-row, the sub-category eyebrows, the interleaved order),
  the 358px mobile planner at x=16, the hanging desktop View All + 46px
  rows + 34×35 cells + the mobile radius 24; the footer-on-every-page list
  dropped /profile).
- Side-by-side DOM verification against the live's measured values: profile
  h1 y=201 (live 203) / mobile 165 (167); no nav/footer at both geometries;
  the grid overlay fixed 18px/40%; the main 896 wide; the sections at
  y=140/495 (live 142/508); the chip icons lucide-map/sun/heart; the map
  first card 395×117 (live 397×119) reading "HOTEL | €€€€ | Brass & Marble
  | Innenstadt"; the eyebrows HOTEL/RESTAURANT/HOTEL/LANTERN WALK/RESTAURANT/
  HOTEL/ROOFTOP MUSIC/RESTAURANT/ART WORKSHOP — the live's exact sequence;
  the planner 358 at x=16 with the 260px date segment (live 258); the
  desktop category card 263×223 (live 231) with the VA hanging (bottom 926
  vs card 900 — hangs ✓), rows 46px, cells 34×35; the mobile card 306×230
  radius 24 (live 227/24). VLM spot-checks: the profile "matches the
  reference's layout" (cards, buttons, grid texture consistent); the mobile
  planner "fits well with consistent margins".
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; a
  favourite saved for 07 after the reseed + re-login); variance-validated;
  the CARTO tile watermarks in 05 remain the documented pre-existing
  free-tier headless behavior.
- Docs aligned: README (features/status/testing), AGENTS (the (bare) group,
  the profile/map facts, gate 56), CLAUDE (testing map + architecture
  bullet), PAD (v1.8 revision), activity-map_SKILL (project_state v1.6.0),
  this session log, the worklog. `.env.example` verified against the code
  (DATABASE_URL / AUTH_SECRET / NEXT_PUBLIC_SITE_URL cover every code
  reference; DEBUG_DBPATH now documented too).
