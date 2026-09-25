# Session 14 — Remediation Plan (deployed-mirror E2E audit + live re-measure + parity remediation)

Date: 2026-09-25 · Base commit: `c3bba68` (main) · Agent: Super Z (session 14)

## 1. Context

Session 12 achieved evolution parity and pushed (`e1660a8` + `6574dfe`); the owner added
`docs/session_13.md` (the session-12 narration), the final worklog entry, and the
start-server log updates (`95d71b3` + `c2e7540` + `c3bba68`) — the log shows the owner
rebuilt the DB and restarted the deployed mirror. Baseline on the untouched tree:
lint ✓ typecheck ✓ 42 unit ✓ build ✓ **54/54 E2E** ✓; `db/` at the repo root;
`.env`/`.env.example` correct (`DATABASE_URL="file:../db/custom.db"`); vitest +
playwright configs functional.

**New this session: the deployed mirror `https://activity-map.jesspete.shop/` is UP**
(HTTP 307 → login redirect, `/api/health` 200 — it was down with a Cloudflare 404
throughout session 12). The audit therefore ran browser E2E against BOTH the deployed
clone and the source app `https://activity-map.base44.app/` (logged in with the demo
account, DOM audits at 1280/390 via agent-browser), then diffed them.

Non-gaps re-verified first (deployed clone == live, within tolerance): the desktop
floating pill (820×56 at x=230, radius 999, border #E8E6DC, 13px link spans, active 700
ink / inactive 500 #555550), the mobile 52px cream-glass tab-bar (fixed, link set and
icon x-positions 304/330/356 identical, tap navigation moves the active state, one-line
layout, no Tailwind v4 failure classes), hero heights (591/938, h1 y=203/290, fs
115.2px), the category-card rows and mobile snap carousel (scrollWidth 982), the route
stops (text-only, 0 imgs), the blue restaurants band (3680px both), the browse chips
(38px/12px, identical labels), the map chrome (41/12 pills, 620px canvas), the stay
DOM order (Courtyard Stay first), the sights (6, same order), the favourites grid
texture (18px/40%) + subtitle, the login page (white body, 30px system h1, #0F172A
48px radius-12 button), the detail card (max-w-6xl rounded-36, 460px lg photo, "About
this place" 34px).

## 2. Findings (verified by DOM measurement on the live app, 2026-09-25)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | Profile identity: the h1 shows the account USERNAME ("sepnetflix2023") and the subtitle line shows the EMAIL | h1 "sepnetflix2023" 72px (y=203, x=225, w=830); "sepnetflix2023@outlook.com" 16px #555550 (y=289); "Your Roam account" is GONE; the Explorer badge chip remains | h1 "Explorer" (seeded name); subtitle "Your Roam account" |
| F2 | **High** | Vibe stay grid: COLUMN-major fill + bigger cards + bare grid | 3 columns × 4 stacked cards: col1 = Courtyard/Terra/Brass/Canal, col2 = Maison/Garden/River/Rooftop, col3 = Velvet/Cloud/Linen/Arcade — visual row 1 = Courtyard \| Maison \| Velvet; cards 381×381, gap 18px, grid 1178 with NO container padding (x=51) | row-major fill (row 1 = Courtyard \| Terra \| Brass); cards 363, gap 20, 1178 container carrying px-4 sm:px-6 (inner 1130) |
| F3 | **Med** | Map "Places on the map" list cards are TEXT-ONLY | 397×119, radius 24, border rgba(14,14,14,0.08), no shadow, bg white p-4, 3-col grid; internals: category eyebrow 12px/600 #555550, title 15px/600 #0E0E0E, price 13px #72706C — 0 images in the section | image cards (400×90, radius 20, h-14 w-14 photo + meta + rating), 9 imgs |
| F4 | **Med** | Browse + map heading block geometry | section `px-5 pt-16 pb-8 md:px-8 md:pt-24` → h1 y=168; heading container `mx-auto mb-8 max-w-7xl text-center` (1216); subtitle 14px #3A3A3A (max-w-xl centered); grid 1216 → cards 390 (the hidden violet eyebrow is dead DOM) | main `px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16` → h1 y=137; heading `max-w-3xl`; subtitle 16px black/60; grid 1232 → cards 397 |
| F5 | **Med** | Booking-request form chrome | form in a white `rounded-[28px] border black/[0.08]` card (451px, NO shadow), p-6/md:p-8; "Book Now" 18px/600 ink HEADING + "Send your booking request for …" 14px #888580 subtitle; fields SINGLE-COLUMN full-width 44px; Dates/Time render as "Choose dates"/"Choose time" 14px/600 #888580 picker buttons (hidden inputs); submit 48px violet full-round; body split ≈ 56/44 (content 577 / form 451) | card carries border black/5 + big shadow; the request line is the 18px h2 (no "Book Now" heading); 2-col grid fields (158px, h-12/48px); body split 3/5 + 2/5 of 1056 (p-6 sm:p-12) |
| F6 | **Med** | Favourites heading block + overlay extent | section `relative overflow-hidden px-5 pt-16 pb-8 md:px-8 md:pt-24` → h1 y=244 (heart 56px above); the 18px grid overlay is scoped INSIDE that section (h=299) — the texture covers only the heading area | pt-10 sm:pt-14 → h1 y=205; the overlay spans the whole main |
| F7 | **Low** | Home hero content horizontal padding | `today-hero-content … px-6` → h1 x=24 at 1280 AND at 390 | px-4 → h1 x=16 |
| F8 | **Low** | Sights grid | 1120 wide at x=80, cards 360 (gap 20) | 1096 at x=92 (max-w-[1144px] with px-4 sm:px-6), cards 352 |
| F9 | **Low** | Detail page top paddings | section `px-5 pt-4 md:px-8 md:pt-6` + card inner `p-6 md:p-10` → h1 y=225, x=105 | main `pt-6 md:pt-10` + header `px-6 sm:px-12 pt-10 sm:pt-14` → h1 y=261, x=112 |
| F10 | **Info** | Live-site bug: favourites save broken on the hosted app | `POST …/entities/SavedPlace` → **HTTP 403** (network capture; the heart toggles visually but nothing persists; the GET queries confirm 0 rows) | the clone's save works (E2E favourites round-trip) — report only |
| F11 | — | Deliberate deviations (keep) | entity-ID place URLs; the restaurants desktop DOM carousel; slug URLs | unchanged |

## 3. Plan (TDD — update/extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **Profile identity**: seed user name → "sepnetflix2023"; the subtitle renders `user.email` (16px #555550 — same classes, new content); comment updated (the live now shows username + email; the avatar initial still derives from the email → "S") | `prisma/seed.ts`, `src/components/profile/ProfileView.tsx` | browse.spec.ts profile test: h1 "sepnetflix2023" 72px, `sepnetflix2023@outlook.com` visible, "Your Roam account" absent |
| R2 | **Vibe stay grid**: `md:grid-cols-3 md:grid-rows-4 md:[grid-auto-flow:column]` (column-major), gap `gap-[18px]`, grid wrapper loses its horizontal padding (`max-w-[1178px]` bare) → cards 381. DOM order unchanged (HOME_STAY_ORDER already matches the live's column-major DOM) | `src/components/home/StayShowcase.tsx` | home.spec.ts: card width 375–385, column gap 18, and a NEW visual-order assertion — the first three cards sorted by (y,x) = Courtyard Stay, Maison Altstadt, Velvet Residence |
| R3 | **Map list cards**: text-only white cards — `rounded-[24px] border border-black/[0.08] bg-white p-4` (no shadow, no image): category eyebrow 12px/600 #555550 uppercase, title 15px/600 ink, price 13px #72706C | `src/components/map/MapExplorer.tsx` | browse.spec.ts map test: the list section has 0 imgs, card radius 24, "Ember Garden"-style titles present |
| R4 | **Browse + map headings**: CategoryExplorer main → `px-5 pb-20 pt-16 md:px-8 md:pt-24`; heading section → `mx-auto mb-8 max-w-7xl text-center`; subtitle → `text-sm text-[#3A3A3A]`; MapExplorer heading block the same pattern (container + subtitle) | `src/components/places/CategoryExplorer.tsx`, `src/components/map/MapExplorer.tsx` | browse.spec.ts: h1 y 160–176 at 1280, subtitle font-size 14px + color rgb(58,58,58), browse grid x=32/w=1216 |
| R5 | **Booking form + detail body**: form card → `rounded-[28px] border border-black/[0.08] bg-white p-6 md:p-8` (no shadow); NEW "Book Now" h2 18px/600 + request line as 14px #888580 p; fields single-column (drop `sm:grid-cols-2`) at h-11/44px; Dates/Time placeholders styled 600 #888580; detail body → `grid … gap-10 p-6 md:p-10 lg:grid-cols-[7fr_5.5fr]` | `src/components/places/BookingForm.tsx`, `src/app/(app)/place/[slug]/page.tsx` | browse.spec.ts booking tests: "Book Now" heading + request subtitle, single-column fields (two field x-positions equal), labels still fillable (the booking round-trip test unchanged) |
| R6 | **Favourites heading + overlay**: main → `px-5 md:px-8` + `pt-16 md:pt-24`; the grid overlay moves INSIDE an `overflow-hidden` heading section (texture covers the heading block only); inner heading container `max-w-7xl` | `src/components/favourites/FavouritesView.tsx` | browse.spec.ts favourites test: overlay height < 400 (scoped), h1 y 230–258 at 1280, grid-image still on the section |
| R7 | **Hero content padding**: `px-4` → `px-6` on the hero content container | `src/components/home/Hero.tsx` | home.spec.ts hero geometry: h1 x=24 at 390 (updated from 16) and at 1280 |
| R8 | **Sights grid**: container → `max-w-[1120px]` without horizontal padding; grid gap stays 20 | `src/components/home/HighlightedSights.tsx` | home.spec.ts: sights grid x≈80, card w 355–365 |
| R9 | **Detail paddings**: main → `pt-4 md:pt-6`; article header → `p-6 md:p-10` (px-6→md:px-10, pt-10/sm:pt-14→md:pt-10, pb-8/sm:pb-10→md:pb-10) | `src/app/(app)/place/[slug]/page.tsx` | browse.spec.ts detail test: h1 y 215–235 at 1280 |
| R10 | Full gates (lint → typecheck → 42 unit → build → 27 smoke → E2E) → side-by-side re-measure vs the live → refresh the 14 screenshots → docs (README/AGENTS/CLAUDE/PAD/SKILL/session log/worklog) → `.env.example` re-verify → single commit + SSH-wrapper push | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all changes via arbitrary values / existing tokens; no
  `tailwind.config.*`; the mobile-nav safety valve (`no-scrollbar` row, ≤62px wordmark
  span, five failure-class pins) untouched — no navbar layout changes at all this
  session.
- **R2 column-flow**: `grid-auto-flow: column` needs an explicit row count
  (`md:grid-rows-4`) or the browser auto-fits rows and breaks the layout; mobile keeps
  the single-column row flow (DOM order == visual order below md).
- **R5 keeps the labels + inputs** for Dates/Time (the E2E round-trip fills them) —
  only the layout/styling changes; the pickers stay native inputs with live-parity
  placeholders.
- **R1 requires `db:push` + `db:seed` reruns** for the dev DB (the E2E global-setup
  re-seeds `db/e2e.db` itself).
- The profile test's booking-count assertions stay count-resilient (the `.or(...)`
  pattern); the spec ordering (booking test runs BEFORE the profile tests) is kept.
- **Do not regress** the pinned contracts: 42 unit, API envelope, seed counts
  (12/12/18 + 27 home + 9 map), browse purity, Leaflet `ssr:false`, single-exit
  db-path helpers, `.env`/`.env.example` pinning, shared E2E storageState,
  rate-limiter behaviour, the login white-body inline style (unlayered-rule gotcha).
- F10 (the live's SavedPlace 403) is a hosted-app issue — reported in the session log;
  no clone change (the clone's save is E2E-proven).
