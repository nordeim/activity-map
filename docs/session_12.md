# Session 12 — live re-measure, evolution parity (stay order, profile redesign, map chrome, vibe heading, favourites grid), TDD remediation, screenshots, docs, commit + push

Base: `origin/main` @ `ebef0ce` (git clone — the workspace had been reset;
`ebef0ce` is the owner's `update start server log` commit pinning
`@types/leaflet` and adding `allowScripts` for Prisma post-install).
Prompt: refresh → review all root docs + `docs/session_11.md`,
`docs/remediation-plan-session-10.md`, `worklog.md`,
`docs/start_server_log.txt` → validate against the codebase → iterate to
parity with `activity-map.base44.app` → mobile-nav / Tailwind v4 attention →
env + db placement → vitest/playwright validation → remediation plan → TDD
execution → screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_10.md, remediation-plan-session-10.md,
  worklog.md, session_11.md, start_server_log.txt, and the scandihaven
  patterns (same stack).
- Baseline gates on the untouched tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓
  **54/54 E2E** ✓; dev probes healthy; `db/` at the repo root (42+27+9
  places + demo user); `.env`/`.env.example` already carry
  `DATABASE_URL="file:../db/custom.db"` (the npm scripts pin it inline —
  verified, no stray parent `.env` interference); vitest (42) + playwright
  (54) configs present and functional.
- **Deployment note**: the live mirror `https://activity-map.jesspete.shop/`
  answers **HTTP 404 through Cloudflare** (origin unreachable — the DNS
  resolves, but the standalone server behind it is down). Reported for the
  owner; not fixable from this repo. All parity work therefore measures the
  source app directly.

## 2. Live re-measurement (2026-09-25, logged in with the demo account)

Non-gaps re-verified FIRST (all match the clone within px): the mobile
navbar (52px cream-glass tab-bar, 12px links — icon x-positions within 3px
of the live: 304/330/356 vs 304/330/356), the desktop floating pill
(820×56), the hero geometry (photo 591/938, h1 y=203/290, planner
y=373-374/432-434), the route stops (text-only, same five titles), the
mobile restaurant deck (6 cards), the sights (6, same order), the
category-card rows (exact title/subtitle pairs, 28×28 cells, icon set), the
eat grid (3-col, 12 cards), the login card (448px, system h1, logo, buttons),
the favourites h1 (55px). The mobile navigation menu is working as expected
on both the live and the clone — no Tailwind v4 failure classes present.

The audit then found the live EVOLVED on five surfaces (findings F1–F9 in
`docs/remediation-plan-session-12.md`, verified by DOM audits at 1280/768/390
and VLM comparisons):

- **F1 (High)**: the home stay showcase was re-shuffled (Courtyard Stay,
  Terra Boutique, Brass & Marble, … — NOT the browse order, which is
  unchanged).
- **F5 (High)**: the profile was redesigned into TWO glass cards — the h1 is
  now the account NAME ("Explorer") at 72px with "Your Roam account" (the
  email is gone), "My bookings" is a 36px h2, the tabs are full-width
  44px/12px, and the chips/eyebrows switched to #72706C.
- **F2/F4/F6 (Med)**: the vibe heading went full-width LEFT-aligned #1A1A1A
  with a 14px #8A8780 subtitle and the 1178px grid (pt-112/pb-144); the map
  search became full-width 1138px with a black/5 border, the pills
  compacted to 41px/12px, and the canvas grew to 620px; the favourites page
  REGAINED the 18px graph-paper grid (40% opacity) with a 14px #3A3A3A
  subtitle.
- **F7–F9 (Low)**: the login document body is white (not cream); the browse
  chips compacted to 38px/12px; the category cards compacted to 231px (the
  live's View All hangs past the glass onto the photo — a quirk the clone
  intentionally renders inside, pinning ≈248px).

## 3. TDD remediation (specs updated first, then implementations)

- R1 `HOME_STAY_ORDER` slug map in `src/app/(app)/page.tsx` sorts the
  published stays for the home showcase (Courtyard Stay first); the /stay
  browse order is untouched. Spec: the full 12-title order pinned.
- R2 `ProfileView` rewritten to the two-glass-card design (rounded-36
  identity card + rounded-32 bookings card, 896px container); seed user
  renamed "Explorer"; `Navbar` prop renamed `userEmail` (the avatar initial
  derives from the email — the live shows "S" while the h1 shows the name).
- R3 `MapExplorer`: the search row widened to `max-w-[1138px]` with
  `border-black/5`; pills `h-[41px] text-xs`; canvas `md:h-[620px]`.
- R4 `StayShowcase`: the heading block is full-width left-aligned
  (`text-left`, no max-w-3xl) at #1A1A1A; the subtitle is a centered 14px
  #8A8780 line; the grid wrapper is `max-w-[1178px]` with `pt-[112px]` /
  `pb-[144px]`.
- R5 `FavouritesView`: the 18px grid overlay restored
  (`absolute inset-0 opacity-40` with rgba(20,20,19,0.055) hairlines);
  subtitle 14px #3A3A3A.
- R6 LoginForm pins the document body WHITE — via an **inline style**, not a
  class: globals.css's `body` rule is UNLAYERED, and unlayered rules beat
  every Tailwind `@layer` utility (the session-10 h1 lesson, second
  sighting — documented in the component and CLAUDE.md).
- R7 CategoryExplorer chips `h-[38px] text-xs`.
- R8 CategoryCards compacted (`pt-[14px] px-[14px] pb-[12px]`, View All
  `mt-3`) → ≈248px cards.

En-route fixes: one spec locator (strict-mode "Augsburg" collided with the
footer line); one HMR desync during development produced a transient
`initials(undefined)` crash (fresh dev-server restart resolved it — the
code itself was correct); the vibe subtitle's live value is #8A8780
(rgb(138,135,128)), not the token #888580.

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓
  27/27 smoke ✓ **54/54 E2E** ✓ (the contracts were extended in place —
  the stay-showcase order, the vibe geometry, the profile identity, the map
  search/pills, the favourites grid, the white login body, the 38px chips,
  and the compacted card band). The Turbopack db-path tracing warning is
  the known pre-existing one.
- Side-by-side verification against the live (DOM + VLM): vibe heading
  h2 x=24/w=1232 (live 38/1203), subtitle 14px centered, grid 1178, first
  card "Courtyard Stay" ✓; map pills 41/12, canvas 618 (live 620), search
  1078 with border (live 1138) ✓; favourites grid 18px/40% + subtitle
  14px #3A3A3A ✓; login body rgb(255,255,255) ✓; VLM verdict on the
  profile: "visually equivalent".
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; a
  favourite saved for 07); variance-validated.
- Docs aligned: README (features/design/status/testing), AGENTS (seed user,
  session-12 surface facts, the unlayered-body gotcha), CLAUDE (testing
  map + the gotcha), PAD (v1.6 revision), activity-map_SKILL
  (project_state v1.4.0), this session log, the worklog. `.env.example`
  verified matching the codebase (DATABASE_URL / AUTH_SECRET /
  NEXT_PUBLIC_SITE_URL cover every code reference).
