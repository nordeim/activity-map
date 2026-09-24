# Session 10 — Remediation Plan (live-app re-measure + residual gap parity)

Date: 2026-09-24 (evening) · Base commit: `219c927` (main) · Agent: Super Z (session 10)

## 1. Context

Session 8 achieved evolution parity and pushed (`2c28628` + `cc4ac3a`); the owner
added `docs/session_9.md` (the session-8 process narration) as `219c927`.
Baseline on the untouched tree is green: lint ✓ typecheck ✓ 42 unit ✓; dev probes
healthy; `db/` at the repo root (42+27+9 places + demo user); `.env` /
`.env.example` correct (`DATABASE_URL="file:../db/custom.db"`); vitest (42) +
playwright (52) configs present.

A fresh live re-measure (logged in; DOM audits at 1280/768/390, scroll sweeps,
VLM comparisons — the session-8 playbook) found the live app UNCHANGED since the
session-8 morning measurement in every session-8 surface. This session's audit
therefore went DEEPER on surfaces earlier sessions verified only at a summary
level, and found residual gaps. Non-gaps re-verified first: mobile navbar
(52px cream-glass tab-bar, 12px links, icons x=304/330/356, scrollWidth 390) ✓,
desktop floating white pill (820×56, 13px links, border #E8E6DC) ✓, route
section (text-only cards, 0 imgs, 576/354px, 44px titles, time pills) ✓,
restaurants (desktop 16-img canvas carousel — documented deviation; mobile
6-card deck) ✓, vibe heading (64 letter spans, cream→ink) ✓, stay/sight titles
(24px mob / 18px dsk) ✓, dark More-Things pill ✓, browses (unified planner
card, 12/12/18, 300px mobile photos) ✓, mobile detail (50.7px h1, 260px photo,
heart + rating pill overlays, 34px About) ✓, map (44px icon pills, violet-tint
active, bottom stats) ✓, profile (username h1, email, back control) ✓,
login-card content set ✓.

## 2. Findings (verified by DOM measurement on the live app, 2026-09-24 evening)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | Category-card INTERNALS differ: row/icon typography and the View All pill | card = glass 263×231, radius 20, shadow `0 8 22 rgba(0,0,0,0.12)` + inset white, `bg rgba(255,255,255,0.34)` + `blur(28px) saturate(1.6)`; label "12 Hotels" Inter 14px/600 `rgb(20,20,19)`; THREE curated rows (36px) each with a 28×28 rounded-8 icon cell (`bg rgba(255,255,255,0.48)`, border `rgba(255,255,255,0.52)`, 13px lucide icon, stroke #111111, width 2) beside a 12px/500 title (ink, ellipsis) + 12px 30%-black subtitle; live icon set: Building2/BedDouble/Sparkles · UtensilsCrossed/Wine/Coffee · Landmark/Palette/FerrisWheel; View All = full-column-width DARK pill 229×54 radius 999 | 301×266 cards; rows use 36×36 rounded-xl opaque surface2 icon cells, 14px/600 titles, 12px #888580 subtitles; View All 120×36 |
| F2 | **High** | Mobile category cards = horizontal snap carousel | container `flex` w=390 with scrollWidth 978; three 306×227 glass cards at x=18/336/654 (`bg rgba(255,255,255,0.58)`); View All violet 276×36 | vertical stack of three 358×258 cards |
| F3 | **Med** | Hero geometry: taller photo, higher content, photo behind the header | photo 1010px at y=-86 (hero section 938px at y=-8 — the photo runs behind the 72px transparent header + white pill); h1 at y=290 (115.2px); planner at y=427 (548×56 glass — clone matches size exactly but sits 81px lower); cards end at the photo bottom (y=674+256≈930). Mobile: photo 591px, h1 y=203 (36px tall), 126px gap, planner y=365 h=124, cards overlap last 31px of photo | photo 86vh/92vh (726/736px) starting BELOW the header; h1 y=321/377; 16px gap; cards overlap 40/64px |
| F4 | **High** | Login page: plain background + shadcn-style card + logo + input icons | body bg white, NO photo; card 448×~746, radius 16, `bg rgba(255,255,255,0.95)`, top hairline gradient (slate-200→300→200), p-8 sm:p-10; circular LOGO image 80/96px (ring-4 ring-white/50, shadow-lg, gradient blur halo) — a distinct asset (85d51f833_logo.png); h1 SANS `text-2xl sm:text-3xl font-bold tracking-tight` slate-900; subtitle slate-500; Google button white rounded-xl border-slate-200 py-3.5; "or" divider (text-xs UPPERCASE on white chip); inputs h-11 sm:h-12 rounded-xl `bg-slate-50/50` border-slate-200 with Mail/Lock icons (left-3, h-4, slate-500); Sign in `bg rgb(15,23,42)` rounded-xl h-48; Forgot password slate-500 14px bottom-LEFT + "Need an account? Sign up" bottom-right | photo background + gradient wash; card 384×550 radius 28; serif h1; NO logo; no input icons; black rounded-full Sign-in; forgot inline next to the label |
| F5 | **Med** | Favourites page chrome | h1 `text-[55px] leading-[0.92] tracking-[-0.06em]` (renders 50.7px); plain cream page (NO grid); empty state: 48px circle `bg #F8F7F4` + 28px heart outline + "No favourites yet" Inter 20px/600 + text-sm muted; card rounded-28 bg-white border | h1 text-5xl (48px); `bg-grid` on main; empty state: 56px circle bg-cream-deep + 24px heart + serif 24px title |
| F6 | **Med** | Place-detail desktop container | content column `max-w-6xl` (1152px); ONE white card `rounded-[36px]` + shadow `0 24px 70px rgba(14,14,14,0.12)` — NO border; photo `h-[260px] md:h-[420px] lg:h-[460px]`; Back link = white pill with shadow (no border) | max-w-[1000px]; article rounded-[32px] + border black/5; photo h-[260px] sm:h-[460px] (420px tier missing); Back pill has a border |
| F7 | **Low** | Profile "Saved places" button | Heart icon (16px) + "Saved places" — 154×44, ink bg | "Saved places · N" text-only — 175×44 |
| F8 | **Low** | Detail heart overlay 44×44 | button 44×44 at photo top-left +20px inset, `bg rgba(0,0,0,0.45)` | 36×36 (h-9 w-9) |
| F9 | **Low** | Route stop titles are h2 on the live | live uses h2 for stop names | clone uses h3 |
| F13 | — | Deliberate deviations (keep) | canvas carousel → DOM transforms; `/place/<id>` → `/place/<slug>`; "API KEY REQUIRED" watermark; hosted-only login flows answered with inline notices | n/a |

## 3. Plan (TDD — update the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **CategoryCards rewrite**: rows keep the title+subtitle pairs but adopt the live's internals — icon cells 28×28 rounded-[8px] `bg-white/[0.48]` + `border-white/[0.52]` + 13px icons (stroke #111111, w2); titles 12px/500 ellipsis; subtitles 12px 30%-black; the live's icon set (Wine/Coffee/Palette/FerrisWheel…); card radius 20 + the live shadow; View All = full-card-width pill `h-[54px]` dark (desktop) / violet h-9 (mobile). MOBILE layout = horizontal snap carousel: `flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 no-scrollbar`, cards `w-[306px] shrink-0 snap-center` | `src/components/home/CategoryCards.tsx` | updated `home.spec.ts` category test: 3 curated two-line rows, 28px glass icon cells, 12px/500 titles, live icon set, mobile container `scrollWidth > innerWidth`, View All width ≈ card inner width, desktop 54px pill |
| R2 | **Hero geometry**: photo container `h-[591px] sm:h-[938px]`; at sm+ the section slides under the sticky header (`-mt-[72px]`) with the img `-top-[72px] h-[calc(100%+72px)]` so the photo shows behind the transparent header strip; content `pt-[203px] sm:pt-[290px]`; planner `mt-[126px] max-md:mt-[126px] md:mt-6`; cards overlap `-mt-8 md:-mt-[250px]` (tune so the desktop cards END at the photo bottom) | `src/components/home/Hero.tsx`, `src/components/home/CategoryCards.tsx` (section margin) | new spec assertions at 390/1280: h1 y ≈ 203/290, photo height ≈ 591/938, planner y ≈ 365/427 |
| R3 | **Login page parity**: plain white page (remove the photo + gradient); shadcn-style card (`max-w-[448px] mx-auto rounded-2xl bg-white/95 border border-black/5 shadow`, top gradient hairline, `p-8 sm:p-10`); circular logo (`/images/login-logo.png`, 80px/96px, ring-4 ring-white/50, shadow-lg, blur halo); h1 `font-sans text-2xl sm:text-3xl font-bold tracking-tight`; Google button white rounded-xl; "or" divider chip (`text-xs uppercase`); inputs `h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200` with Mail/Lock icons; Sign in `bg-[#0F172A] rounded-xl h-12`; bottom row: Forgot password (left, slate-500 14px) + Need an account? Sign up (right) | `src/app/login/page.tsx`, `src/components/auth/LoginForm.tsx` | updated `auth.spec.ts`: logo img visible, h1 font-family Inter, Mail/Lock icons beside inputs, Sign-in bg rgb(15,23,42) + radius 12px, no photo background |
| R4 | **Favourites chrome**: remove `bg-grid` from main; h1 `text-[50px] leading-[0.92] tracking-[-0.06em]` (renders 50.7px in Chromium — matches the live's rendered value); empty state = 48px circle `bg-[#F8F7F4]` + 28px heart, "No favourites yet" `font-sans text-xl font-semibold`, text-sm muted subtitle | `src/components/favourites/FavouritesView.tsx` | updated favourites test: no grid background-image on main, h1 font-size 50.7px, empty-state title font-family Inter |
| R5 | **Detail container**: `max-w-6xl` column; article `rounded-[36px]` NO border + `shadow-[0_24px_70px_rgba(14,14,14,0.12)]`; photo `h-[260px] md:h-[420px] lg:h-[460px]`; Back pill loses its border | `src/app/(app)/place/[slug]/page.tsx` | updated detail test: card radius 36px, container ≈ 1152px at 1280 |
| R6 | **Profile Saved button**: `Heart` 16px + "Saved places" (drop the count), stays `h-11` ink pill | `src/components/profile/ProfileView.tsx` | updated profile test: text "Saved places" exact, width ≈ 154 |
| R7 | **Heart overlay 44px**: floating SaveButton `h-11 w-11` + `h-5 w-5` heart | `src/components/places/SaveButton.tsx` | updated detail test: heart bounding box 44×44 |
| R8 | **Route stops h2**: h3 → h2 (live semantics) | `src/components/home/RecommendedRoute.tsx` | existing heading locators keep passing (role-based) |
| R9 | Full gates → refresh the 14 screenshots → docs (README/AGENTS/CLAUDE/PAD/SKILL/session log/worklog) → single commit + SSH-wrapper push | everything | all gates green; screenshots variance-checked; docs consistent |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all new classes via `@theme` tokens/arbitrary values
  only; NO `tailwind.config.*`; keep explicit `rgba()`/hex utilities where specs
  assert computed colors (α-modifiers compile to `color-mix()`/oklab()).
- **Mobile nav safety valve untouched**: the `no-scrollbar` row, the ≤62px
  wordmark span, and the five v4 failure-class pins stay green. The category
  carousel reuses `no-scrollbar` (already an `@utility`).
- **The category carousel must stay keyboard/tap navigable**: real overflow
  scroll (not transforms), snap-mandatory, and the E2E tap-navigation checks
  must still pass at 390.
- **Hero surgery must not regress the planner card contract** (radius 30 +
  rgba shadow at 390) or the desktop pill contract (820/999/13px) — both specs
  re-run.
- **The login redesign keeps the clone's behavioural layer**: rate-limited
  `/api/auth/login` POST, inline notices for hosted-only flows, `router.refresh`
  navigation. Only the chrome changes.
- **Favourites h1**: the live DECLARES `text-[55px]` but renders 50.7px in
  Chromium; the clone pins the RENDERED value (`text-[50px]` → 50.7px) for
  same-browser visual parity — documented in the spec comment.
- **Do not regress** the pinned contracts: 42 unit, API envelope, seed counts
  (12/12/18 + 27 home + 9 map), browse purity, Leaflet `ssr:false`, single-exit
  db-path helpers, `.env`/`.env.example` pinning, shared E2E storageState.
- The restaurants carousel keeps the DOM-transform deviation; only the category
  cards, hero, login, favourites, detail container, and small chrome items
  change.
