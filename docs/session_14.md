# Session 14 — deployed-mirror browser E2E audit, live re-measure + parity remediation, TDD, screenshots, docs, commit + push

Base: `origin/main` @ `c3bba68` (git clone — the workspace had been reset; the
owner's `update start server log` commits showing the deployed mirror rebuilt
and restarted). Prompt: refresh → review all root docs + `docs/session_12.md`,
`docs/remediation-plan-session-12.md`, `worklog.md`, `docs/session_13.md`,
`docs/start_server_log.txt` → validate against the codebase → run browser E2E
against the deployed `https://activity-map.jesspete.shop/` → parity with
`activity-map.base44.app` → mobile-nav / Tailwind v4 attention → env + db
validation → vitest/playwright validation → remediation plan → TDD execution →
screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_12.md, remediation-plan-session-12.md,
  worklog.md, session_13.md (the owner's session-12 narration), and
  start_server_log.txt; scandihaven patterns confirmed same stack
  (in-repo `scandihaven_SKILL.md`); repo skills catalog consulted
  (agent-browser / tdd / tailwind-patterns / clone-app-pat-pro).
- Baseline gates on the untouched tree: lint ✓ (the 2 pre-existing warnings in
  the owner's audit scripts) typecheck ✓ 42 unit ✓ build ✓ **54/54 E2E** ✓;
  `db/` at the repo root (42+27+9 places + demo user);
  `.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"` — the
  npm scripts pin it inline); vitest + playwright configs present and
  functional.
- **The deployed mirror is UP** (`/` → 307 login redirect, `/api/health` 200
  — it was Cloudflare-404 down through session 12; the owner's restart per
  start_server_log fixed it).

## 2. Dual-site browser audit (agent-browser, logged in on both)

The deployed clone was audited page-by-page (desktop 1280 + mobile 390) and
DOM-diffed against the source app — the first session able to test the
DEPLOYED site. Non-gaps verified on the deployed mirror: the mobile navbar
(52px cream-glass fixed tab-bar, 12px spans, icon x-positions 304/330/356
identical to the live, tap navigation moves the active state, no Tailwind v4
failure classes, no horizontal overflow), the desktop floating pill (820×56
at x=230, radius 999, #E8E6DC border, active 700 ink / inactive 500 #555550
13px spans), all pages load with no console errors (the lazy-image counts
were timing artifacts — the CDN returns 200 for every "broken" URL), the
login flow, and the session-12 surfaces (stay order, two-card profile,
map chrome, chips 38/12, login white body).

The live re-measure then found 11 findings (`docs/remediation-plan-session-14.md`):

- **F1 (High)**: the profile identity changed — the h1 now renders the
  USERNAME "sepnetflix2023" (72px) with the EMAIL as the 16px #555550 line
  ("Your Roam account" is gone from the live).
- **F2 (High)**: the vibe stay grid fills COLUMN-major on the live (3 columns
  × 4 stacked cards — visual row 1 = Courtyard | Maison | Velvet), with
  381px cards at an 18px gap over the BARE 1178px grid (no container
  padding); the clone filled row-major with 363px cards.
- **F3 (Med)**: the map "Places on the map" cards are TEXT-ONLY on the live
  (radius 24, black/8 hairline, no shadow, no photos: eyebrow/title/price);
  the clone rendered 90px image rows.
- **F4 (Med)**: the browse/map heading blocks — the live's sections run
  `px-5 pt-16 md:px-8 md:pt-24` (h1 y=168) with full-width max-w-7xl heading
  containers and 14px #3A3A3A subtitles; the clone ran pt-8→md:pt-16
  (y=137), max-w-3xl, 16px black/60.
- **F5 (Med)**: the booking form — the live leads with the 18px "Book Now"
  heading + the 14px #888580 request subtitle, single-column 44px fields,
  and a hairline-only rounded-28 card, in a ≈56/44 detail split; the clone
  had an 18px request-heading, a 2-col 48px grid, and a shadowed card.
- **F6 (Med)**: the favourites grid overlay is scoped to the live's HEADING
  SECTION (h=299 — the texture stops after the subtitle), with the h1 at
  y=244; the clone overlaid the whole main and sat 39px higher.
- **F7–F9 (Low)**: the hero content px-6 (h1 x=24); the sights grid 1120px
  (360px cards); the detail page's pt-4/md:pt-6 + card p-6/md:p-10 (h1
  y=225).
- **F10 (Info)**: the hosted app's own favourites save is BROKEN — its
  SavedPlace POST returns **HTTP 403** (network capture; the heart toggles
  visually but nothing persists). The clone's save works (E2E round-trip).
  Reported for the owner.
- **F11**: deliberate deviations kept (entity-ID URLs, restaurants DOM
  carousel).

## 3. TDD remediation (specs updated first — RED verified, then GREEN)

- R1 Profile identity: seed user name → "sepnetflix2023"; `ProfileView`
  subtitle renders `user.email`.
- R2 StayShowcase: `md:grid-cols-3 md:grid-rows-4 md:[grid-auto-flow:column]`
  + `gap-[18px]` + the grid wrapper's horizontal padding dropped → 381px
  cards, column-major (DOM order unchanged).
- R3 MapExplorer: text-only list cards (radius 24, eyebrow/title/price, no
  images) under `#places-list`.
- R4 CategoryExplorer + MapExplorer headings: `px-5 pt-16 md:px-8 md:pt-24`,
  max-w-7xl heading, 14px #3A3A3A subtitle.
- R5 BookingForm + detail body: "Book Now" h2 + 14px #888580 subtitle,
  single-column h-11 fields, picker-styled Choose dates/time placeholders,
  hairline rounded-28 card (no shadow), `lg:grid-cols-[7fr_5.5fr]` split,
  card inner `p-6 md:p-10`.
- R6 FavouritesView: the overlay moved INSIDE the overflow-hidden heading
  section; main `px-5 md:px-8`; h1 y=245.
- R7 Hero content `px-6`.
- R8 Sights grid `max-w-[1120px]` bare.
- R9 Detail main `pt-4 md:pt-6`.

En-route fixes (Tailwind v4 gotchas, both documented in AGENTS/CLAUDE):
`border-black/[0.08]` computes as `oklab(0 0 0 / 0.08)` — specs asserting
computed borders need explicit `border-[rgba(14,14,14,0.08)]` utilities
(third sighting of the α-modifier rule); the favourites main+section carried
double pt (192px) — the live's pattern puts pt ONLY on the section; the auth
spec's /login gotos moved to `domcontentloaded` (the CDN `load` flake);
resource note — a full E2E pass with several browser daemons + the dev
server alive exhausted the 4GB sandbox (browser targets crashed) — close
stray sessions before suite runs.

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓
  27/27 smoke ✓ **54/54 E2E** ✓ (the contracts extended in place — the
  profile identity, the column-major stay arrangement + 381px cards, the
  text-only map list, the browse heading geometry + subtitle, the booking
  form chrome, the scoped favourites overlay, the hero px-6, the sights
  1120px grid, the detail h1 y). The Turbopack db-path tracing warning is
  the known pre-existing one.
- Side-by-side DOM verification against the live's values: profile h1
  "sepnetflix2023" 72px + email line; stay grid row 1 = Courtyard | Maison |
  Velvet, 381px cards at x=51; map list 0 imgs/radius 24; browse h1 y=169/x=32
  (live 168/32), subtitle 14px rgb(58,58,58); form Book Now 18px + 44px
  single-col + hairline/no-shadow, detail h1 y=229 (live 225); favourites
  overlay h=287 (live 299) scoped, h1 y=245 (live 244); hero h1 x=24; sights
  grid x=80/360px. VLM spot-checks: profile "matches", stay row order
  confirmed visually.
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; a
  favourite saved for 07); variance-validated. The CARTO tile "API KEY
  REQUIRED" watermarks in 05 are the pre-existing free-tier headless
  behavior (identical in the previous sessions' captures — verified against
  HEAD's 05-map.png).
- Docs aligned: README (features/status), AGENTS (seed user, session-14
  surface facts, the resource + flake lessons), CLAUDE (testing map), PAD
  (v1.7 revision), activity-map_SKILL (project_state v1.5.0), this session
  log, the worklog. `.env.example` verified matching the codebase
  (DATABASE_URL / AUTH_SECRET / NEXT_PUBLIC_SITE_URL cover every code
  reference; DEBUG_DBPATH documented in CLAUDE).
