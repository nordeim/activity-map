# Session 30 — Remediation Plan (deployed-mirror verification + live-source re-measure → the 404 surfaces + the map pin/zoom chrome)

Date: 2026-09-29 · Base commit: `47ba2be` (main) · Agent: Super Z (session 30)

## 1. Context

Session 29 pushed the restaurant-band + map-card parity (`b98a951` + `c899d2f`);
the owner then rebuilt + restarted the server (the start-server log update at
`06:25 Sep 28` — the mirror now runs the session-29 code — plus the raw session
log `docs/session_33.md` at `0cd22a0`/`47ba2be`). This session re-cloned,
re-read every root doc + the session-29 plan + the worklog + `docs/session_32.md`
+ `docs/session_33.md` + the start-server log, re-validated the codebase state
(env `DATABASE_URL="file:../db/custom.db"` with `db/custom.db` recreated at the
repo root via db:push + db:seed, vitest + playwright configs verified, skills
excluded), and ran the full baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings
in `scripts/`) · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **69/69
E2E** ✓. The scandihaven reference repo was re-reviewed for the shared
engineering patterns (six-phase workflow, TDD at public seams, Tailwind v4
CSS-first rules) and the skills catalog consulted (clone-app-pat-pro's
computed-styles-as-ground-truth gate, agent-browser, tdd, tailwind-patterns,
nextjs16-tailwind4's mobile-nav failure taxonomy).

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH
SESSION-29 CODE, ALL GREEN.** Verified by DOM signature: the restaurant band
(the h2 x=142/w=996/center=640 centered column + the FIVE-name window at
uniform Inter + the 330px compact featured card with pad 16/border 1px/blur
18/h-38 buttons) + the map list-card cream-pill eyebrow (65×26, pad 4/10) +
the 61×32 detail rating pill. Functionally ALL GREEN: zero console errors
across every page (home, eat, stay, do, map, favourites, profile, place
detail, both legal pages); the mobile navbar end-to-end at 390 (the 52px
border-box cream-glass tab-bar, 12px link spans at −0.12px tracking, the
active 700 state moving on tap, the MapPin/Heart/User icon actions); the
favourites round-trip (save → 1 card → unsave → empty state); the booking
round-trip (native-setter fill → "Request sent" → visible under Profile → My
bookings).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/640/390):** every session-24→29 surface re-verified UNCHANGED — the
planner pill chrome (548×56, cream/35, blur 28, the `0 8px 22px /0.12` +
inset `white/0.42` shadow, 46px segments, 218×46 dates button, hover-revealed
12px/500 labels), the 510×371 date popover (opens on click; the full pointer
event sequence required for synthetic clicks), the band trio (heading 89.6px
x=142/center=640, names 33.28px ×5 uniform Inter 400, card 330×130 pad 16),
the map list cards (397×119 r24, the cream-pill eyebrow, MapPin 12px, gap 12),
the detail hero rating pill (61×32 pad 8/12 star 14), the mobile nav at 390
(52px glass, 12px spans 700/500, ROAM 84px @x=16, icons @304/330/356), the
mobile planner card (358 @x=16, white/94, r30), the mobile detail (h1 50.7px
y=225, Back 89×36 y=112), the mobile favourites/eat headings (y=188/112),
the legal pages (48px h1, ← Back home 14px #8A8780, 14px/28px #5F5C56 paras,
no nav/footer), the home h1 (115.2px y=290 both sites), the sights/stay grids
(18 square cards), the map stats pills (119×32/74×32 white, shadowless), the
map canvas (620px), the category-pill filtering (Hotels → 3 markers + 3
cards), the About section (28px surface2 tag pills, 14px/28px #3A3A3A body),
and the booking form (Name*/Surname*/Dates*/Time*/Phone/Email*/Message).

**Five findings** — the two 404 surfaces (never swept as a whole) and the
map's pin/zoom chrome (last swept session 3/8; the AGENTS.md's "circular
zoom controls" claim and the 16px/22px-violet marker model are both stale vs
the live):

## 3. Findings (verified by DOM measurement on the live app, 2026-09-29)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The place-404 page** — an in-app design with the chrome | `min-h-screen bg-[#F8F7F4] px-5 py-24 text-center`: the h1 "Place not found" 46px Libre Baskerville 400 tracking −0.05em ink (#0E0E0E) + `mt-6 inline-flex h-11 rounded-full bg-[#0E0E0E] px-6 text-sm font-semibold` "Back to Do" pill → `/do`; renders WITH the navbar + footer (inside the app chrome) | the generic root `not-found.tsx` renders for place 404s too: "Off the map" 36px + a white compass disc + the description + "Back to the guide" pill → `/` |
| F2 | **Med** | **The generic unknown-route 404** — the platform's slate default | `min-h-screen flex items-center justify-center p-6 bg-slate-50` wrapping `max-w-md text-center space-y-6`: the h1 "404" `text-7xl font-light text-slate-300` (72px/300 #CBD5E1) + a `h-0.5 w-16 bg-slate-200` divider (64×2 #E2E8F0) + "Page Not Found" `text-2xl font-medium text-slate-800` (24px/500) + the para `text-slate-600 leading-relaxed` quoting the attempted path + a "Go Home" button `px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg` (white, 1px #E2E8F0 border, r8) — chrome-less (no nav/footer) | the custom cream "Off the map" page (compass disc, serif 36px, "Back to the guide" ink pill) — a different design, and it carries a `Compass` icon the live's platform page never renders |
| F3 | **Med** | **The map zoom controls** — circular, separated, 34px | the stack renders 34×76 at (10,10) with `gap: 8px` between TWO separate buttons (not Leaflet's joined pair): each 34×34 white, `border-radius: 999px`, `1px solid rgba(14,14,14,0.1)` border, ink #0E0E0E text at 22px/700, `line-height: 32px`, the stack itself shadowless | Leaflet's DEFAULT controls untouched: 30×30, `border-radius: 2px 2px 0px 0px`, joined stack (radius 4), 26px glyphs — the AGENTS.md's own "circular zoom" claim (session-8) does not match the code |
| F4 | **Med** | **The map pin model** — 12px dots with hover-reveal NAME LABELS | `.activity-map-pin` renders a 12px dot: `border-radius: 50%; background: #0E0E0E; border: 2px solid #FFFFFF; box-shadow: 0 4px 10px rgba(14,14,14,0.16); transition: all 180ms cubic-bezier(0.22,1,0.36,1)`; on hover the dot `transform: scale(1.32)` + `box-shadow: 0 8px 18px rgba(14,14,14,0.24)`; each pin carries a LABEL pill `.activity-map-pin-label` (`position: absolute; left: 50%; bottom: calc(100% + 9px); transform: translate(-50%, 4px) scale(0.96); opacity: 0; pointer-events: none; white-space: nowrap; border-radius: 999px; background: white; color: #0E0E0E; padding: 7px 11px; Inter 12px/700; box-shadow: 0 10px 26px rgba(14,14,14,0.16); transition: opacity 160ms, transform 160ms`) + a `::after` 5px white triangle at the label's bottom center — on hover `opacity: 1; transform: translate(-50%, 0) scale(1)`; measured label 106×31 for "Brass & Marble"; NO violet/active state exists in the live's CSS at all | 16px dots (`.roam-marker`: 16×16, 2.5px white border, shadow `0 2px 8px /0.35`) with a violet 22px `[data-active]` state; no name labels anywhere |
| F5 | **Med** | **The pin click behavior** — direct navigation, no popup | clicking a pin navigates IMMEDIATELY to `/place/map-brass-marble` (verified: the URL changed on click; no `.leaflet-popup` in the DOM) | the click sets `activeSlug` → the marker binds + opens a Leaflet POPUP ("Brass & Marble / Design Hotel · Innenstadt") that then links onward |

Non-gaps re-verified (keep, document): the planner pill + popover chrome
(session-28 EXACT), the mobile nav/planner/detail/favourites surfaces, the
legal pages, the map command center + stats + canvas, the band + map cards +
detail pill (session-29 EXACT), the home geometry (h1 115.2px y=290 both
sites), the category-pill filtering (markers + list both filter), the About
section pills, and the booking form's text-input dates/time fields (a
documented approximation of the live's picker buttons — the placeholders
carry the live's "Choose dates"/"Choose time" text).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — write the spec extensions first**: (a) `tests/e2e/browse.spec.ts` — extend the map test block: the zoom stack computes two buttons of 34×34 with `borderRadius` ≈ 999px (≥ 100) and a `gap` of 8px; every marker icon computes 12×12 with a white 2px border and carries a `.roam-marker-label` child whose text matches the place name; clicking a marker NAVIGATES (the URL becomes `/place/map-brass-marble`) and no `.leaflet-popup` exists. (b) NEW `tests/e2e/not-found.spec.ts` — (1) an invalid place slug renders, INSIDE the app chrome (nav + footer present), the "Place not found" h1 at 44–48px serif ink + a "Back to Do" pill (h 44, bg #0E0E0E, href `/do`); (2) an unknown route (e.g. `/nope-xyz`) renders the platform slate 404: the "404" h1 at 72px with `#CBD5E1` color, a 64×2 divider, "Page Not Found" at 24px, a "Go Home" action → `/`, NO nav and NO footer | tests/e2e/browse.spec.ts, tests/e2e/not-found.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **The place-404 (F1)**: add `src/app/(app)/place/[slug]/not-found.tsx` — the in-app design: `min-h-screen bg-cream px-5 py-24 text-center` carrying the `font-serif text-[46px] font-normal tracking-[-0.05em] text-ink` h1 "Place not found" + `mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white` Link "Back to Do" → `/do`; renders inside the `(app)` layout so the nav + footer stay (Next renders the nearest route-level not-found inside its layout) | src/app/(app)/place/[slug]/not-found.tsx | the R0b-1 assertions GREEN |
| R2 | **The generic 404 (F2)**: rewrite `src/app/not-found.tsx` as a client component (usePathname for the quoted path) rendering the platform slate design: `min-h-screen flex items-center justify-center p-6 bg-slate-50` wrapping `max-w-md w-full text-center` — the `text-7xl font-light text-slate-300` "404" h1, the `h-0.5 w-16 bg-slate-200 mx-auto` divider, the `text-2xl font-medium text-slate-800` "Page Not Found", the `text-slate-600 leading-relaxed` para `The page "…" could not be found in this application.`, and the `Go Home` action (`px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50`) → `/` | src/app/not-found.tsx | the R0b-2 assertions GREEN |
| R3 | **The zoom controls (F3)**: style Leaflet's default control via `globals.css` — `.leaflet-container .leaflet-control-zoom { display: flex; flex-direction: column; gap: 8px; box-shadow: none; border-radius: 0; }` + `.leaflet-container .leaflet-control-zoom a { width: 34px; height: 34px; line-height: 32px; border-radius: 999px; border: 1px solid rgba(14,14,14,0.1); background: white; color: #0E0E0E; font-size: 22px; font-weight: 700; }` + the hover state (`background: #F8F7F4`) | src/app/globals.css | the R0a zoom assertions GREEN; the existing map pins (canvas, stats, pills) stay GREEN |
| R4 | **The pin model (F4)**: rebuild the marker divIcon html to `<span class="roam-marker"><span class="roam-marker-label">NAME</span></span>` with `iconSize: [12, 12]` / `iconAnchor: [6, 6]`; rewrite the `.roam-marker` CSS to the live's contract: 12×12, `border-radius: 50%`, `background: #0E0E0E`, `border: 2px solid #FFFFFF`, `box-shadow: 0 4px 10px rgba(14,14,14,0.16)`, `transition: all 180ms cubic-bezier(0.22,1,0.36,1)`, hover `transform: scale(1.32)` + `box-shadow: 0 8px 18px rgba(14,14,14,0.24)`; the label CSS: `position: absolute; left: 50%; bottom: calc(100% + 9px); transform: translate(-50%, 4px) scale(0.96); opacity: 0; pointer-events: none; white-space: nowrap; border-radius: 999px; background: white; color: #0E0E0E; padding: 7px 11px; font: 700 12px Inter; box-shadow: 0 10px 26px rgba(14,14,14,0.16); transition: opacity 160ms, transform 160ms;` + the `::after` 5px triangle + the hover reveal; DROP the violet `[data-active]` 22px model (the live has no violet state); escape the name in the html template | src/components/map/LeafletCanvas.tsx, src/app/globals.css | the R0a marker assertions GREEN |
| R5 | **The pin click behavior (F5)**: replace the popup + active-selection flow with direct navigation — the marker click calls `router.push(\`/place/${slug}\`)` (or `window.location.assign`): drop `bindPopup`/`openPopup`, drop the `data-active` sync; keep the search-driven `flyTo` when `activeSlug` arrives from the LIST side only if it stays simple — simplest faithful model: the click navigates, the list "Learn More" links navigate, and the search filters as today | src/components/map/LeafletCanvas.tsx, src/components/map/MapExplorer.tsx | the R0a navigation assertion GREEN (the URL changes, no popup); the map pins (list cards, stats) stay GREEN |
| R6 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 69+ E2E; re-measure every remediated surface against the live on the local server (the 46px place-404 + the pill; the slate 404; the 34×34 zoom pair; the 12px pins + the hover label; the click navigation); capture the dev-server screenshots into `docs/screenshots/`; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog + write `docs/session_34.md`; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks

- The root `not-found.tsx` becoming a client component: `usePathname()` is
  allowed in not-found files; the page renders for unknown routes outside the
  `(app)` group so no nav/footer is present (matching the live's chrome-less
  platform page). The place-404 renders INSIDE `(app)` — nav + footer stay.
- Dropping the violet active state changes the search-selection UX: the live
  has no violet pin at all, and its pin click navigates immediately — the
  `focusSlug` search flow keeps its flyTo but no violet highlight.
- Leaflet's zoom buttons render `<a>` elements with `href="#"` — the CSS
  override must keep the touch targets at 34×34 (the E2E asserts the rect).
- The marker html template must escape place names (`escapeHtml` exists in
  LeafletCanvas — reuse it for the label too).
- The label pill sits ABOVE the pin (`bottom: calc(100% + 9px)`) — pins near
  the canvas top may clip their labels under the canvas edge; the live has
  the same geometry (acceptable parity).
- `min-h-screen` on the place-404 block stacks with the (app) layout's own
  flow — the live's page is exactly `min-h-screen bg-[#F8F7F4] px-5 py-24`
  so the total page scrolls past the footer; keep the same box.

## 6. Execution record (2026-09-29, post-delivery)

All six remediation rows executed in TDD order (RED confirmed on the
unmodified tree — all three touched specs failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the extended map
  contract in `browse.spec.ts` (the 12×12 marker with the white 2px border +
  the 9 `.roam-marker-label` pills + the 34×34 r999 zoom pair with the 8px
  stack gap + the pin-click navigation to `/place/map-brass-marble` with no
  `.leaflet-popup`) and the NEW `not-found.spec.ts` (the place-404's 46px
  serif h1 + the 44px "Back to Do" pill inside the chrome; the platform
  slate 404's 72px "404" + divider + "Page Not Found" + quoted path +
  "Go Home" → / chrome-less). En-route test fixes: the slate color
  assertions moved to painted-PIXEL sampling (Chromium 153 serializes slate
  as `lab()` — even through a canvas fillStyle — so each evaluate fills a
  1×1 canvas and reads `getImageData`, comparing with ±2-per-channel
  tolerance for the lab→sRGB rounding); the marker radius pin corrected to
  `50%` (the live's literal value, not `9999px`).
- **R1** — the place-404: `src/app/(app)/place/[slug]/not-found.tsx`
  (`min-h-screen bg-cream px-5 py-24 text-center` + the 46px serif ink h1 +
  the h-11 ink "Back to Do" pill → /do) — renders inside the (app) chrome
  (nav + footer), exactly like the live.
- **R2** — the generic 404: `src/app/not-found.tsx` rewritten as a client
  component (usePathname quotes the attempted path) rendering the platform
  slate design (bg-slate-50, the 72px font-light slate-300 "404", the
  64×2 divider, "Page Not Found" 24px, the quoted-path para, the white
  bordered r-8 "Go Home" link → /) — chrome-less.
- **R3** — the zoom controls: the `.leaflet-container .leaflet-control-zoom`
  overrides in globals.css (flex column, gap 8, the 34×34 r999 a-buttons
  with the 1px /0.1 hairline + 22px/700 ink glyphs) — carrying `!important`
  because Leaflet's bundled CSS loads AFTER globals.css in the chunk order
  (mirroring the live's own `!important` override block, observed in its
  rendered `<style>` tag).
- **R4** — the pin model: the divIcon html now nests the
  `.roam-marker-label` span (the escaped place name) inside the 12×12
  `.roam-marker` (iconSize/iconAnchor 12/[6,6]); the `.roam-marker` CSS
  rewritten (12px dot, 2px white border, r50%, the 0 4px 10px /0.16 shadow,
  the 180ms cubic-bezier(0.22,1,0.36,1) transition, hover scale 1.32 +
  the deeper shadow) + the label pill (white, 12px/700, pad 7/11, r999, the
  ::after triangle, opacity 0→1 at 160ms, `bottom: calc(100% + 9px)`
  centered). En-route fixes: the rewritten span needed `display: block`
  (an inline span ignores width/height — the first rebuild rendered 4×18
  remnants); the label's `line-height: 1` was dropped to match the live's
  measured 31px pill height (normal line-height ≈ 18px + 14px pad).
- **R5** — the pin click: the marker handler navigates via
  `routerRef.current.push()` (the Next-idiomatic navigation — the lint rule
  rejected `window.location.assign`); the popup binding + the `data-active`
  sync dropped; MapExplorer's selected-place card + "Tap a dot" hint
  removed (clone inventions — the live renders neither) and the `onSelect`
  prop retired; the `?place=` deep-link keeps its flyTo via the derived
  `focusVisible`.
- **Side-by-side verification on the dev server** (both sites measured):
  the place-404 h1 46px/serif/ink/tracking −2.3px + the pill 44px/ink → /do
  with nav + footer — EXACT; the generic 404 "404" 72px/300 + "Page Not
  Found" 24px/500 + Go Home r8 white → / chrome-less — EXACT; the zoom
  pair 34×34 r999 1px 22px/700 gap 8 — EXACT; the marker 12×12 r50% with
  the white 2px border + the 106×31 label pill — EXACT vs the live's
  106×31; the pin click lands on `/place/map-brass-marble` with no popup —
  EXACT.
- **Full gates on the push tree**: lint ✓ (the 2 pre-existing warnings) ·
  typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **71/71 E2E** ✓ (the
  new not-found spec + the extended map contract; every prior pin green —
  re-run after the final label line-height tweak).
- **49 screenshots** (6 new — the two 404s, the zoom pair + pins, the
  forced-visible pin labels, the pin-click navigation, the mobile map —
  VLM-verified via `scripts/capture-screens-v11-session30.mjs`, which
  waits for the tiles + markers and scrolls the canvas into view; the
  CARTO basemap served "API KEY REQUIRED" watermarked tiles to the whole
  sandbox at capture time — the live app equally affected, a documented
  environment-level event the capture notes call out);
  `.env.example` re-verified (covers every code-referenced var);
  docs aligned (README, AGENTS, CLAUDE, PAD v2.9, activity-map_SKILL
  v1.17.0, this plan, the worklog, docs/session_34.md).
