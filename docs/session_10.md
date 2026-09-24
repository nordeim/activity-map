# Session 10 — residual-gap parity (session-9 re-measure), TDD remediation, screenshots, docs, commit + push

Base: `origin/main` @ `219c927` (git clone — the workspace had been reset;
`219c927` is the owner's `update session logs` commit adding
`docs/session_9.md`, the session-8 process narration).
Prompt: refresh → review all root docs + `docs/session_8.md`,
`docs/remediation-plan-session-8.md`, `worklog.md`, `docs/session_9.md` →
validate against the codebase → iterate to parity with
`activity-map.base44.app` → mobile-nav / Tailwind v4 attention → env + db
placement → vitest/playwright validation → remediation plan → TDD execution →
screenshots → docs → commit + push via the SSH wrapper.

## 1. Review & validation

- Reviewed AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md,
  activity-map_SKILL.md, session_8.md, remediation-plan-session-8.md,
  worklog.md, session_9.md, and the scandihaven patterns (same stack).
- Baseline gates on the untouched tree: lint ✓ typecheck ✓ 42 unit ✓; dev
  probes healthy; `db/` at the repo root (42+27+9 places + demo user);
  `.env`/`.env.example` already carry `DATABASE_URL="file:../db/custom.db"`;
  vitest (42) + playwright (52) configs present and functional.

## 2. Live re-measurement (2026-09-24 evening, logged in with the demo account)

The live app was UNCHANGED since the session-8 morning measurement in every
session-8 surface (navbar, route, restaurants, vibe heading, browses, mobile
detail, map, profile — all re-verified first). This session's audit therefore
went DEEPER on surfaces earlier sessions had verified only at a summary
level, and found nine residual gaps (findings F1–F9 in
`docs/remediation-plan-session-10.md`, verified by DOM audits at 1280/768/390
and VLM comparisons):

- The category cards' internals differ (263px glass cards with 28×28 glass
  icon cells, 12px/500 two-line rows, the live icon set
  Wine/Coffee/Palette/FerrisWheel, a full-width 54px View All pill) AND the
  mobile layout is a horizontal SNAP CAROUSEL of 306px cards (scrollWidth
  978) — the clone rendered a vertical stack of 301px cards with 36×36
  opaque icon cells and a 120×36 View All.
- The hero geometry differs: the live photo is 591px (phones) / 938px
  (desktop, running 78px above the hero top so it shows behind the
  transparent header), the h1 tops at viewport y≈203/290, and the planner
  follows a 126px mobile gap. The clone rendered a 86/92vh photo with the h1
  ~118px lower.
- The login page is a plain white shadcn-style card (448px, radius 16,
  circular logo disc, SYSTEM-font heading, Mail/Lock in-field input icons,
  slate-900 `#0F172A` button, bottom Forgot/Sign-up row) — the clone rendered
  a photographic background, a radius-28 card, a serif heading, and a black
  pill button.
- Smaller gaps: the favourites page kept the graph-paper grid + a 48px serif
  h1; the detail page's desktop container was 1000px/bordered instead of the
  live's 1152px border-less rounded-36 card (and missed the 420px-md photo
  tier); the profile Saved-places button carried a count instead of a heart;
  the detail heart overlay was 36px instead of 44px; the route stop titles
  were h3 instead of the live's h2.

## 3. TDD remediation (specs updated first, then implementations)

- R1 CategoryCards rewrite: three curated two-line rows per card with the
  live's internals (28×28 rounded-[8px] glass icon cells `bg-white/[0.48]` +
  `border-white/[0.52]`, 13px icons stroke #111111, 12px/500 titles,
  12px/30%-black subtitles, the live icon set), card radius 20 + the live
  shadow, the full-width View All (violet h-9 phones / `#141413` h-[54px]
  from md), and the MOBILE horizontal snap carousel (`#category-cards`
  snap-x snap-mandatory, 306px cards, `no-scrollbar`).
- R2 Hero geometry: photo 591px phones / 900px md / 938px lg, sliding under
  the transparent sticky header at md (`-mt-[73px]`), h1 at `pt-[203px]` /
  `md:pt-[290px]`, the 126px mobile planner gap, the cards pulled flush with
  the photo bottom (`-mt-[261px]` at md).
- R3 Login redesign: the plain white page, the shadcn card (radius 16,
  gradient hairline, `p-8 sm:p-10`), the circular logo disc
  (`public/images/login-logo.png`, downloaded from the live's CDN), the
  `font-system` heading (new `@utility` — the live's login uses the platform
  stack, NOT Inter; the h1 wraps like the reference), the Google button, the
  "or" divider chip, Mail/Lock input icons, the `#0F172A` Sign-in button, and
  the bottom Forgot/Sign-up row. Behaviour unchanged (rate-limited API POST,
  inline notices for hosted-only flows).
- R4 Favourites: `bg-grid` removed, h1 `text-[55px] leading-[0.92]
  tracking-[-0.06em]`, empty state = 48px `#F8F7F4` icon circle + 28px heart
  + Inter 20px/600 title.
- R5 Detail container: one `max-w-6xl` rounded-[36px] shadow-only card (no
  border), photo tiers 260/420(md)/460(lg), the Back pill loses its border.
- R6–R8: the profile Saved-places heart button (no count), the 44×44 dark
  heart overlay, the route stops promoted to h2.

En-route spec fixes: the View All full-width assertion accounts for the
16px card padding; the `#category-cards` locator is now the mobile carousel
row (the desktop row is `[data-category-card]`); the route-swap locator
follows the h2 change; the login h1 asserts the system stack (not Inter);
the favourites h1 asserts the declared 55px at the desktop viewport (narrow
viewports trigger Chromium's mobile text-size adjustment on the reference —
environment noise, documented in the spec).

## 4. Verification

- Full gate on the exact push tree: lint ✓ typecheck ✓ 42 unit ✓ build ✓
  27/27 smoke ✓ **54/54 E2E** ✓ (52 prior + the session-10 hero-geometry and
  detail-container checks; the login/category/route/favourites/profile
  contracts were extended in place). The Turbopack db-path tracing warning
  is the known pre-existing one.
- Side-by-side verification against the live: hero geometry exact (img y=0
  h=938 desktop / y=0 h=591 mobile; h1 y=290/203; planner y=364 vs 365;
  carousel scrollWidth 982 vs 978; card row 263px ending flush with the
  photo); login card exact (radius 16, logo 96px, `rgb(15,23,42)` button,
  system-stack h1 wrapping at 366×72 like the live's 368×72); VLM verdict on
  the desktop home: "visually equivalent".
- 14 screenshots refreshed (capture-screens-v3 + crop-sections-v3; the
  default browser session logged in + a favourite saved for 07; the dev
  server was restarted first — the in-memory rate limiter had engaged after
  the repeated audit logins); variance-validated; VLM spot-checks clean.
- Docs aligned: README (features/status/testing), AGENTS (gate 54 + the
  session-10 hero/category/login facts), CLAUDE (same), PAD (v1.5 revision),
  activity-map_SKILL (project_state), docs/session_10.md, this worklog.
  `.env.example` verified matching the codebase.
