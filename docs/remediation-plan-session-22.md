# Session 22 — Remediation Plan (deployed-mirror + live-source dual audit → the desktop hero photo framing, the mobile-nav glass, and the letter-spacing deltas)

Date: 2026-09-27 · Base commit: `64e5148` (main) · Agent: Super Z (session 22)

## 1. Context

Session 20 achieved the route-choreography parity and pushed (`9f32dfe` +
`7d23778`); the owner's commits added `docs/session_21.md` (the previous agent's
narration), the session-20 audit documentation, and the start-server-log update
showing the deployed mirror rebuilt/restarted WITH the session-20 code. This
session re-cloned the reset workspace, reviewed every root doc + the session
20/21 logs + the worklog + the start-server log, and re-validated the codebase
against them before auditing.

Baseline on the untouched tree (all green):

- lint ✓ (the 2 pre-existing script warnings) · typecheck ✓ · 42 unit ✓ ·
  build ✓ (the 1 known Turbopack tracing warning) · **56/56 E2E** ✓ ·
  27/27 smoke ✓
- `db/` recreated at the repo root (42 published + 27 home + 9 map places +
  the demo user); `.env` correct (`DATABASE_URL="file:../db/custom.db"` — the
  npm scripts pin it inline); `.env.example` present and matching; vitest +
  playwright configs present and functional; no stray parent `.env` trap.

**Deployed-mirror audit (`activity-map.jesspete.shop` — running the session-20
code, verified by signature):** all pages load with ZERO console errors; the
session-20 route surfaces render (the h3 20px/600 stop cards, the 448px
max-w-md link cards at x=672, the 640×800 visual panel, the absolute top-400
choreography with 0.12s linear transitions); the mobile navbar works
end-to-end (fixed 52px cream-glass tab-bar, icon x-positions 304/330/356
identical to the live, one-line 12px links, fixed positioning survives scroll,
tap navigation moves the active state, no horizontal overflow at 390 — no
Tailwind v4 failure classes); the favourites round-trip works (POST 201 →
visible → DELETE 200 → state restored); the booking round-trip works (POST 201
→ visible under My bookings; the owner's redeploy wipes it).

**Live-source re-measure (`activity-map.base44.app`, logged in at 1280/768/
390):** every session-20 surface re-verified UNCHANGED — the desktop pill
(820×56 at x=230, radius 999, #E8E6DC border, 13px/500-700 Inter link spans
with 16px lucide icons); the route stop cards (h3 20px/600 rgb(20,20,19)
lh-30, meta 13px/400 rgb(114,112,106), Learn More 13px/600, the white link
448×201 at x=672 p-20 r-28 with the 0 8px 28px/0.08 shadow, cards absolute
top-400 with the 0.12s linear transform+opacity transitions, the 50/50 split,
the panel px-8/lg:px-12 with the −mx-4 card outdent); the eat heading
(h1 y=168 55px, section 1280×385, the 18px graph-paper overlay at 40%);
the chips (38px/12px/600, pad 10px 16px); the detail page (h1 y=225 82px, the
1152×688 r-36 card, 44px/16px-radius inputs); the map page (41px/12px pills,
the 620px canvas, 9 list cards at h≈119); the profile (chrome-less, h1 72px
y=203, the email line, 44px tabs, the full-page 18px overlay at 40%); the
mobile surfaces (hero h1 y=203 x=24, the 591px hero photo, the 306×227
category carousel with scrollWidth 978, the route panel pad 28px 18px 48px
with 354px cards at x=18 and 28px gaps, the full-viewport 390×844 route svg,
the flowing six-card restaurant list at 130px gaps, the blue band
rgb(77,97,255) with the 800px overlap EXACT); the favourites page (the
14px #3A3A3A subtitle, the dormant display:none eyebrow); the login page
(white body, the system-font 30px h1, the #0F172A r-12 submit). The audit
found **5 actionable deltas** (below) — three of them sub-pixel typography.

## 2. Findings (verified by DOM measurement on the live app, 2026-09-27)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | **The desktop hero photo FRAMING** — the live's `.today-hero-section` pulls itself up `margin-top: -80px` (under the 72px sticky header, landing at page y≈−8), and its `.today-hero-bg` is ABSOLUTE with inset `−78px 0 6px` → the photo box spans page **−86 → 924** at 1280 (1010px tall, cover-cropped ≈7.7% more zoomed than the clone's box); at 768 the box is 972px (−86 → 886). The visible crop of the 2200×1534 photo differs noticeably (the live shows the middle ~88% horizontally; the clone ~95%) | `.today-hero-bg` computed inset `−78px 0px 6px`; measured img rect 1280×1010.2 at y=−86; section mt −80px, y=−8, h=938.2 | The image box = the container exactly (591/900/938, cover-fit) with the container's own `md:-mt-[73px]`; the photo crop is ~7.7% wider/less zoomed |
| F2 | **Med** | **The mobile-nav glass effect** — the live's `.tab-bar` renders `background: rgba(248,247,244,0.62)` with `backdrop-filter: blur(24px) saturate(1.5)` | computed on `header.tab-bar` at 390 | `bg-cream/60` (compiles to oklab(…/0.6)) + `backdrop-blur-[20px]` — no saturate, weaker blur, 2% lighter tint |
| F3 | **Low** | **Nav link letter-spacing** — the live's desktop 13px link spans carry `+0.01em` (0.13px) and the mobile 12px spans `−0.01em` (−0.12px) | computed spans (Highlights 0.13px @13px; Highlights/Eat −0.12px @12px) | `normal` on both breakpoints |
| F4 | **Low** | **Route stop-card h3 letter-spacing** — the live's 20px place names carry `−0.02em` (−0.4px) | computed h3 on `.route-waypoint-card` | `normal` |
| F5 | **Low** | **Route time-pill text tracking** — the live's "9:00 AM" span (12px/400 inside the px-3/py-1 r-999 pill) carries `+0.05em` (0.6px) | computed pill span | `normal` (the clone renders the text directly on the pill element) |

Non-gaps re-verified (keep): every surface in §1; the mobile hero (591px
in-flow, inset 0 — only the md+ framing differs); the h1 clamp (115.2px at
1280 = 9vw); the serif route h2 (48px, −0.02em ✓ already matching); the stay
card titles (18px, −0.03em ✓); the eat h1 (55px, −0.06em ✓); the meta lines
(ls normal ✓); the eyebrow (display:none dormant DOM on both).

## 3. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **Hero photo framing (F1)**: the section gains `md:-mt-[73px]` (the pull under the sticky header, moved from the container); the backdrop div becomes `relative h-[591px] w-full overflow-hidden md:absolute md:inset-x-0 md:-top-[86px] md:bottom-[14px] md:h-auto` (the live's −86/+14 inset relative to a section at page y=0 — the photo box lands at −86→924 at lg, −86→886 at md); the img keeps `absolute inset-0 h-full w-full object-cover`; the hero-shade stays inside the backdrop; the CONTENT div becomes the in-flow height provider (`relative z-10 flex h-[591px] flex-col px-6 pb-16 pt-[203px] md:h-[900px] md:pt-[290px] md:pb-24 lg:h-[938px]` — the h1 stays at page y=290/203 EXACT); the bottom cream gradient stays on the section | `src/components/home/Hero.tsx` | home.spec.ts (hero geometry): at 1280 the img box height 1005–1015 with y −90..−80; at 768 height 968–976; at 390 unchanged (570–610, h1 y 180–225, h1 x 20–28); the h1 y ranges stay 265–315 desktop |
| R2 | **Mobile-nav glass (F2)**: `bg-cream/60 backdrop-blur-[20px]` → `bg-[rgba(248,247,244,0.62)] backdrop-blur-[24px] backdrop-saturate-[1.5]` (explicit rgba pins the computed color; the saturate composes into the same backdrop-filter) | `src/components/layout/Navbar.tsx` | mobile-navigation.spec.ts: the header's computed `backdrop-filter` = `blur(24px) saturate(1.5)`; the background-color parses to rgba(248,247,244,0.62) via an rgb() fallback assert (α-blends may arrive as oklab — assert the numeric channels) |
| R3 | **Nav letter-spacing (F3)**: the mobile link base gains `tracking-[-0.01em]` with `md:tracking-[0.01em]` (computed −0.12px at 12px / +0.13px at 13px) | `src/components/layout/Navbar.tsx` | mobile-navigation.spec.ts: the Highlights link span letter-spacing ≈ −0.12px at 390; the desktop spec (1280) ≈ 0.13px |
| R4 | **Route h3 tracking (F4)**: the place-name h3 gains `tracking-[-0.02em]` (−0.4px at 20px) | `src/components/home/RecommendedRoute.tsx` | home.spec.ts (the route contract): the h3 computed letter-spacing −0.5..−0.3px |
| R5 | **Time-pill tracking (F5)**: the pill gains `tracking-[0.05em]` (0.6px at 12px) | `src/components/home/RecommendedRoute.tsx` | home.spec.ts: the pill's computed letter-spacing 0.5..0.7px |
| R6 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 56+ E2E (extended); re-measure every remediated surface against the live (the hero box at 1280/768, the glass computed style, the three letter-spacings); refresh the affected screenshots (hero desktop/mobile at minimum; re-run the full capture set if the pipeline allows); align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the session log/the worklog; verify `.env.example` covers every code-referenced env var; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all changes are arbitrary-value utilities — no
  `tailwind.config.*`; the mobile-nav safety valve (`no-scrollbar`) and the
  five failure-class pins stay untouched apart from the two ADDED assertions
  (glass + letter-spacing) — the existing pin set must keep passing.
- **R1 restructures the hero DOM** — the content div must carry the section
  heights (it becomes the only in-flow child); the backdrop's `md:bottom-[14px]`
  must NOT apply on mobile (`relative` + `h-[591px]` stays the mobile contract);
  the h1/planner y-positions are pinned by the existing spec and MUST NOT move
  (pt-[203px]/pt-[290px] ride the content div now). The `-mt-[73px]` moves from
  the backdrop container to the SECTION so the sticky-header overlap mechanism
  is preserved (the live pulls the section itself up −80px; the clone's header
  strip is 73px tall in flow).
- **The backdrop-filter composition** — `backdrop-blur-[24px]` +
  `backdrop-saturate-[1.5]` must compose into a single `blur(24px)
  saturate(1.5)` declaration; if Tailwind emits two separate properties the
  second silently overwrites the first (CSS backdrop-filter is one property) —
  verify the computed style composes correctly, else use an arbitrary
  `[backdrop-filter:blur(24px)_saturate(1.5)]` utility instead.
- **The rgba() pin** — `bg-cream/62` would compile to oklab color-mix; the
  explicit `bg-[rgba(248,247,244,0.62)]` keeps the computed color matching the
  live exactly (the AGENTS.md lesson about α-modifiers).
- **Do not regress**: 42 unit, the API envelope, the seed counts, browse
  purity, Leaflet `ssr:false`, single-exit db-path helpers, the `.env`
  pinning, the shared E2E storageState, the rate limiter, the login
  white-body inline style, the favourites scoped overlay, the profile `(bare)`
  contract, the 800px band overlap, the mobile restaurant flow, the route
  choreography (R4/R5 touch the same component — the swap/opacity assertions
  must keep passing).
- The deployed mirror carries one "Audit" booking + my favourites probe from
  this session's round-trips — the owner's redeploy wipes them (per the
  start-server log's `rm -rf db/` flow).
