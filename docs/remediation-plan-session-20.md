# Session 20 — Remediation Plan (deployed-mirror + live-source dual audit → route stop-card typography, the 50/50 desktop split + continuous scroll-linked swap choreography, the mobile panel paddings)

Date: 2026-09-26 · Base commit: `a2de5ab` (main) · Agent: Super Z (session 20)

## 1. Context

Session 18 achieved the heading-texture/detail-split/mobile-route-visual parity and pushed
(`ad9570c` + `505d489`); the owner's `update session log` commit (`a2de5ab`) added
`docs/session_19.md` (the previous agent's narration) and the start-server-log update — the
deployed mirror was rebuilt and restarted WITH the session-18 code (verified live: the heading
texture 1280×394 @18px/40%, the detail split grid 676.8px/451.2px gap-24 with the rounded-28
aside, the mobile full-viewport route visual). Baseline on the untouched tree: lint ✓ (2
pre-existing warnings) typecheck ✓ 42 unit ✓; `db/` at the repo root (42+27+9 places + demo
user); `.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"` pinned inline);
vitest + playwright configs functional; NO stray parent `.env` this session.

**Deployed-mirror functional audit (all green):** every page loads with zero console errors;
the mobile navbar works end-to-end (fixed 52px cream-glass header, icons 304/330/356, one-line
12px links, fixed positioning survives scroll, tap navigation moves the active state, no
horizontal overflow at 390 — no Tailwind v4 failure classes); the desktop pill is exact
(820×56 at x=230, radius 999, #E8E6DC border); the favourites save/unsave round-trip works
(POST 201 → visible → DELETE 200 → state restored); the booking round-trip works (POST 201 →
"Audit Session20" visible under Profile → My bookings — the owner's redeploy wipes it); the
session-18 surfaces all render (the heading textures, the detail split, the mobile route
visual 390×844 sticky with zero visible chips, the flowing mobile restaurant list at 620px
advances, the 800px band overlap).

**Live-source re-measure (logged in; DOM audits at 1280/390):** every surface re-verified
UNCHANGED against the session-18 records except the **Recommended Route stop cards** — the
live's waypoint cards now measure a smaller typography scale, a narrower link card, a 50/50
desktop split, and a CONTINUOUS scroll-linked swap choreography (vs the clone's discrete
crossfade). The unchanged list (all re-measured within tolerance): desktop pill 820×56
r999; mobile nav (fixed header, 12px links, icons 304/330/356); eat/stay/do/map heading
sections 1280×385–413 textured @18px/40% with h1 y=168; chips 38px/12px; browse cards
390×562 with the active+dimmed € display; the detail split (grid 676.8/451.2 gap-24, aside
451 r28, inputs 16px/44, card 1152×688, h1 y=225, hero 772 + overlay); the map page (413
section, 1138 search, 41px pills, 620 canvas, 9 four-row cards 397×119 in the interleaved
order); the profile (chrome-less, h1 y=203/167, 72px, full-page overlay, email line);
category cards (mobile 306×227 r24, desktop 263 + hanging VA 229×54); the mobile planner
358@x=16 r30; the stay showcase 12×381; the sights 6×360; the mobile restaurant flow (6
static cards, 620px advances); the desktop band overlap 800px EXACT; the favourites page
(scoped overlay, h1 y=244, subtitle 14px #3A3A3A); the login page (white body, system-font
h1, 358 r16 card, #0F172A submit); the hero anchors (h1 y=203@390/290@1280, x=24); the
desktop route trap 3333px + progress pill. The live re-measure found **4 actionable
findings** (below).

## 2. Findings (verified by DOM measurement on the live app, 2026-09-26)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **Route stop-card typography shrank** — the place name is an h3 at 20px/600 (line-height 30px), the meta line 13px/400 #72706C (mt-2), Learn More 13px/600, description mt-4 | `.route-waypoint-card` leaf dump (both breakpoints): "Specialty Coffee Bar" 20px/600, "Altstadt · 4.8 rating · €€ · Coffee" 13px/400 rgb(114,112,106), desc 14px mt-16px, "Learn More" 13px/600 | The place name is a 30px/600 span; the meta line 16px #0e0e0e; Learn More 14px; desc mt-3 |
| F2 | **High** | **The desktop route split is 50/50 with a continuous scroll-linked swap** — the visual panel is 640px (50%, svg 640×800) and the waypoint panel 640px (`px-8 lg:px-12`, cards 576 @x=672 via −mx-4); the card slot sits at y=237 from the sticky top; the cards translate upward CONTINUOUSLY at 0.665px per scroll px (each card crosses the slot at ~620px scroll intervals ≈ every 25% of trap progress), tent-fading ±380px around the slot with 120ms linear transitions — measured: card 1 y=646→513→381→248→115→-150 across offsets 0→1200; card 0 exits UP (237→-225), never down | trap 3333px; sticky 1280×800; panels 640+640; `.route-waypoint-card` absolute `top: 400px` + `transform: translateY(…)` (matrix −625/−636/−583/−174 sampled mid-scroll), `transition: opacity 0.12s linear, transform 0.12s linear` | The visual panel is `w-[46%]` (589px); the stops column 691px `lg:px-12` with centered 576 cards at y=96 (`lg:pt-24`); the swap is a DISCRETE crossfade (`data-active` + `translate-y-10` dip + 500ms transition) — exiting cards sink DOWN |
| F3 | **Med** | **The mobile route waypoint panel pads 18px** (pad measured `28px 18px 48px`) — cards 354 @x=18 with ~28px gaps (mt-7); the mobile link card is full-width (354) while the DESKTOP link card is `max-w-md` (448px, left-aligned) | `.route-waypoint-panel … px-[18px] pb-10 pt-[28px]`; mobile cards at x=18 w=354, gaps 27–29px; desktop link 448×201 | The clone's panel uses `px-4` (cards 358 @x=16), mobile card gaps mt-10 (40px); the link card is full-width at BOTH breakpoints |
| F4 | **Low** | **Time-pill + link-card chrome details** — the time pill is `px-3 py-1` (101×28) with 12px/400 text, a 14px Clock icon, and NO shadow; the link card is `mt-7 p-5` with the lighter shadow `0 8px 28px rgba(14,14,14,0.08)`; the pill→h2 gap is the pill's mb-4 (16px) | computed styles on the live's `.route-waypoint-card` children | The clone's pill is `px-3.5 py-1.5 text-xs font-semibold` (12px/600) with a 12px Clock and a `0 6px 16px` shadow; the link `mt-4 p-5 sm:p-6` shadow `0 18px 44px rgba(14,14,14,0.1)` |

Non-gaps re-verified (keep): the serif stop h2 44px mobile / 48px desktop; the heading trap
140vh with the sticky heading; the mobile full-viewport svg visual + the violet scroll fill;
the desktop progress pill; the 420vh trap; the 800px band overlap; the mobile flowing
restaurant list; every other surface in §1.

## 3. Plan (TDD — update/extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **Typography (F1)**: the place name becomes an `<h3 class="text-[20px] font-semibold leading-[30px] text-[#141413]">`; the meta line `mt-2 text-[13px] font-normal text-[#72706C]`; the description `mt-4` (14px #3A3A3A unchanged); the Learn More text `text-[13px] font-semibold` (the pill keeps h-11/rounded-full/bg-ink) | `src/components/home/RecommendedRoute.tsx` | home.spec.ts: the place-name h3 fontSize 20px; the meta line 13px + color rgb(114,112,106); Learn More 13px |
| R2 | **Link card + pill chrome (F3/F4)**: the link card `mt-7 max-w-md rounded-[28px] bg-white p-5 shadow-[0_8px_28px_rgba(14,14,14,0.08)]` (no sm:p-6); the time pill `mb-4 inline-flex gap-2 rounded-full bg-white px-3 py-1 text-xs font-normal` with the Clock at `h-3.5 w-3.5`, NO shadow; the h2 keeps mt-0 | same | home.spec.ts: the desktop link card width 440–460 (max-w-md); the pill boxShadow "none"; the mobile link card x=18 width 348–360 |
| R3 | **Desktop split 50/50 (F2a)**: the visual panel `w-[46%]` → `w-1/2`; the stops column `lg:px-12` → `lg:px-8` (cards 576 full-width @x=672 — the live's −mx-4 equivalent) | same | home.spec.ts: at 1280 the visual panel width 630–650; the stops column width 630–650 |
| R4 | **Continuous swap choreography (F2b)**: the column gains `lg:pt-[237px]` (the card slot); each article gets scroll-linked inline `transform: translateY(relPx)` + `opacity` where `rel = (i/(N-1) − p) × trapScrollPx × 0.665` and `opacity = clamp(1 − |rel|/380, 0, 1)`, applied ONLY at lg (the mobile flow stays static), rAF-throttled like the existing progress, with `transition: opacity 120ms linear, transform 120ms linear`; `data-active` stays (nearest-slot card) for the aria/E2E contract; the exiting cards move UP (rel goes negative), matching the live | same | home.spec.ts: at a mid-trap scroll (e.g. +400px) TWO adjacent cards carry intermediate opacity (0 < o < 1 — the crossfade window) and the active card's slot y lands 220–260; after a deep wheel the active h2 ≠ "Morning Coffee" (existing contract) |
| R5 | **Mobile panel paddings (F3)**: the stops container `px-4 pb-24 pt-6` → `px-[18px] pb-12 pt-[28px]` (mobile only — the lg overrides unchanged); the mobile card gaps `mt-10` → `mt-7` | same | home.spec.ts: at 390 the first stop link-card x=18; the panel computed padding 18px sides |
| R6 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → E2E (extended); re-measure every remediated surface against the live (the typography leaf dump, the 50/50 split, the slot y, the choreography samples at offsets 0/200/400/600/800); refresh the affected screenshots; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/session log/worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all changes via arbitrary values / existing tokens; no
  `tailwind.config.*`; the mobile-nav safety valve and the five failure-class pins are
  untouched (this remediation does not go near the Navbar).
- **R4 touches the scroll choreography pinned by the existing swap spec** — the
  `data-active` attribute survives (the nearest-slot card), so the deep-scroll assertion
  stays valid; the mobile flow MUST stay static (guard the inline styles with the existing
  `isLg` matchMedia branch — an unguarded transform would break the mobile list).
- **The inline transform/opacity must not fight the CSS transition classes** — remove the
  `lg:translate-y-10`/`lg:duration-500` swap classes from the articles and drive the motion
  purely through the inline styles + the 120ms linear transition, exactly as the live does.
- **Do not regress**: 42 unit, the API envelope, seed counts (12/12/18 + 27 home + 9 map),
  browse purity, Leaflet `ssr:false`, single-exit db-path helpers, `.env` pinning, the shared
  E2E storageState, the rate limiter, the login white-body inline style, the favourites scoped
  overlay, the profile `(bare)` contract, the 800px band overlap, the mobile restaurant flow.
- The deployed mirror carries one "Audit Session20" booking (the round-trip proof) — the
  owner's redeploy wipes it (`rm -rf db/custom.db` + reseed per the start-server log).
