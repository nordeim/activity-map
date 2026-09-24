# Session 8 — live-app evolution parity (session-7 re-measure), TDD remediation, screenshots, docs, commit + push

Base: `origin/main` @ `fa8666e` (git pull fast-forward — added the owner's
`docs/session_7.md` narration of the session-6 process).
Prompt: refresh → review all root docs + `docs/session_6.md`,
`docs/remediation-plan-session-6.md`, `worklog.md`, `docs/session_7.md` →
validate against the codebase → iterate to parity with
`activity-map.base44.app` → mobile-nav / Tailwind v4 attention → env + db
placement → vitest/playwright validation → remediation plan → TDD execution →
screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_6.md, remediation-plan-session-6.md,
  worklog.md, session_7.md, and the scandihaven patterns (same stack).
- Baseline gates on the untouched tree: lint ✓ typecheck ✓ 42 unit ✓; dev
  probes healthy; `.env`/`.env.example` already carry
  `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root (custom.db
  + e2e.db); vitest (42) + playwright (45) configs present and functional.

## 2. Live-app re-measurement (2026-09-24, logged in with the demo account)

The live app evolved again since the session-6 measurement. Findings F1–F13
in `docs/remediation-plan-session-8.md`, verified by DOM audits at
1280/768/390, scroll sweeps, and VLM comparisons:

- Route stop cards became TEXT-ONLY (zero `<img>` in the section at both
  breakpoints): white time pill (101×28, r999) + serif 48px-dsk/44px-mob
  dark title + white info card (20px/600 name, 16px inline meta, 14px
  description, black 44px Learn More pill). Cards 576px wide, pinning EARLY
  (viewport y≈124) across a ~3750px trap (swap runway ≈ 2400px).
- Highlighted Restaurants mobile deck reduced 16 → 6 cards (Volta, Roux,
  Aura, Garbo, Kōan, Ember); the desktop carousel still iterates 16 inside
  a 4140px trap.
- "Choose Your Vibe" heading is a per-letter scroll reveal — 64 spans whose
  colors interpolate cream (#F8F7F4) → ink (#1A1A1A) with scroll position.
- Stay + Sight card titles render 24px/500 on mobile (18px desktop).
- "More Things to Do" hand-off inverted to a dark pill (#111111, white
  text, 166×46).
- Browse pages: ONE unified planner container (mobile: white card r30 with
  the cream search pill + labelled date/people rows + two circular icon
  buttons, NOT sticky; desktop: one sticky white pill 1216×68 with inline
  search + labelled segments) — no type-of-activities field.
- Place detail: the rating rides ON the photo (white pill, top-right), no
  Map button, header meta = pin + neighborhood + price only, About h2 = 34px
  fixed, hero photo 260px mobile / 460px desktop.
- Eat/do card photos 300px on mobile (372px desktop).
- Profile: icon-only Back control, email directly under the username (no
  "Your Roam account"), Saved places as a dark 154×44 button into
  /favourites, category filter chips with icons.
- Map: cream search pill with the violet circular icon cell + round filters
  button; 44px pills WITH icons — active violet-tint
  #F0EAFF/#D8CAFF/#571AFF, inactive white/rgba(14,14,14,0.08)/#555550;
  circular zoom controls; bottom stats pills.
- Non-gaps re-verified unchanged: navbar (both modes), hero planner card,
  category cards, login chrome, footer pill, browse cards/counts, booking
  form, 9 map pins.

## 3. Remediation plan + TDD execution

Wrote `docs/remediation-plan-session-8.md` (findings F1–F13, tasks R1–R12,
risks/guards), validated it against the codebase, then executed
spec-first: the E2E contracts were updated to the new live design (RED)
before each implementation batch (GREEN).

- R1 RecommendedRoute: text-only stop cards (time pill + dark serif title +
  white info card + black Learn More), 576px cards pinning early
  (`lg:pt-24`, `lg:h-[420vh]` trap), mobile timeline keeps the vertical text
  cards; photos removed.
- R2 HighlightedRestaurants: mobile deck sliced to 6; desktop trap
  300vh → 460vh (the live's 4140px pacing).
- R3 LetterReveal (new client component): 64 per-letter spans with a scroll
  listener mapping viewport position to a fill count (cream → ink in order,
  erase on exit); SSR/reduced-motion render solid ink (no invisible text,
  no layout shift).
- R4 Stay/sight mobile titles → `text-[24px] md:text-lg`.
- R5 More Things to Do → dark `bg-[#111111]` pill, no border.
- R6 BrowsePlanner (new client component): the unified browse planner —
  mobile white card (r30, shadow 0 12 28) with the cream search pill +
  labelled date/people rows + two circular icon actions (filters → chips;
  map → /map), non-sticky; desktop one sticky white pill with inline search
  + labelled segments; date/people AUTO-FORWARD to the browse URL params;
  replaced CategoryExplorer's separate search row + TripPlanner (no type
  field on browse).
- R7 Place detail: white rating pill `[data-photo-rating]` on the photo
  top-right, Map link removed, rating dropped from the header meta, About
  h2 fixed 34px, hero photo `h-[260px] sm:h-[460px]`.
- R8 PlaceCard photo → `h-[300px] sm:h-[372px]`.
- R9 Profile: Back-to-home icon control, email-only line, dark Saved-places
  button into /favourites, icons on the All/eat/stay/do filter chips.
- R10 Map: cream search pill + violet icon cell + round filters button,
  44px pills with icons (violet-tint active), bottom stats pills
  (Augsburg center · N places · € pricing), circular Leaflet zoom controls
  via globals.css.
- R11 Showcase containers tightened to the live's ~1144px inner grid
  (full-bleed sections).
- En-route fix: the Learn More pill spec initially asserted the card LINK
  (white) — re-pinned to the pill element (`[data-learn-more]`).
- En-route lint fix: LetterReveal's setState moved into the rAF callback
  (react-hooks/set-state-in-effect).

## 4. Gates (on the exact push tree)

lint ✓ · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **52/52 E2E ✓**
(45 prior + 7 new session-8 checks: text route cards, 6-card deck, letter
spans, 24px titles, dark More-Things, unified browse planner, auto-forward
params, eat photo heights, detail rating pill + no Map + 260px photo, map
pill colors + stats, profile email/saved/back/icons). The one Turbopack
warning (db-path.ts dynamic fs tracing) is the known pre-existing
standalone-tracing warning, not a regression.

## 5. Screenshots + docs

- All 14 `docs/screenshots/` captures refreshed from the remediated dev
  server (capture-screens-v3 + crop-sections-v3, default browser session
  logged in; favourite saved first for 07), variance-validated non-blank;
  VLM spot-checks clean.
- Docs updated for alignment: README (features/status/design notes), AGENTS
  (gate counts 42/52/27 + session-8 architecture facts), CLAUDE (same), PAD
  (v1.4 revision), activity-map_SKILL (project_state), this log, the
  remediation plan, and the worklog. `.env.example` verified to match the
  codebase (unchanged).

## 6. Commit + push

Single commit on `main` (no branches), pushed through
`docs/ssh_git_wrapper_v3.py` with the operator-provided ed25519 key (runbook:
`docs/how-to-git-push-using-ssh-wrapper_SKILL.md`). Deliberate deviations
documented: the live route visual's "API KEY REQUIRED" watermark (a broken
StaticMap on the live app) is not cloned; the desktop carousel keeps the
DOM-transform implementation (canvas → maintainable parity); the route
visual keeps its numbered waypoints; `/place/<slug>` URLs remain (the live's
base44 entity ids cannot be cloned); the login's hosted-only flows answer
with inline notices.
