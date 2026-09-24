# Session 8 — Remediation Plan (live-app evolution parity)

Date: 2026-09-24 · Base commit: `fa8666e` (main) · Agent: Super Z (session 8)

## 1. Context

Session 6 achieved redesign parity and pushed (c176d84/2036951); the owner added
`docs/session_7.md` (the process narration) as `fa8666e`. Baseline on the untouched
tree is green: lint ✓ typecheck ✓ 42 unit ✓; dev probes healthy; `.env` /
`.env.example` already carry `DATABASE_URL="file:../db/custom.db"` with `db/` at
the repo root; vitest (42) + playwright (45) configs functional.

A fresh live re-measure (logged in; DOM audits at 1280/768/390, scroll sweeps, and
VLM strip/screenshot comparisons) found the live app has evolved AGAIN in several
places. Non-gaps re-verified first: desktop floating-pill navbar (820/999/13px
links) ✓, mobile 12px nav chrome (52px cream glass, icons x=304/330/356,
scrollWidth 390) ✓, hero white planner card (radius 30, gray field pills,
same field set + labels) ✓, category cards (violet mobile VIEW ALL) ✓,
login chrome ✓, footer pill ✓, eat/do/stay browse card design ✓ (12/12/18),
booking form fields ✓, place URLs are base44 entity ids (cannot match — keep
slugs, documented deviation), the route visual's "API KEY REQUIRED" watermark
(a broken StaticMap on the live app) deliberately not cloned.

## 2. Findings (verified by DOM measurement on the live app, 2026-09-24)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **High** | Route stop cards are TEXT-ONLY now — the photos are gone | route section has ZERO `<img>` at both 1280 and 390; card = white time pill (101×28, radius 999, "9:00 AM") + serif title 48px dsk/44px mob, weight 400, `rgb(20,20,19)` + white info card (`a`): venue name 20px/600, meta line "Altstadt · 4.8 rating · €€ · Coffee" 16px, description 14px `rgb(58,58,58)`, full-width BLACK Learn More pill h-44 radius 999 | photo cards (h-44 cover, white 48/32px title on gradient, panel below); 5 imgs in the section |
| F2 | **High** | Route choreography: cards pin EARLY and the trap is longer | live route section 3750px; cards pin at viewport y≈124 as the trap engages (swap runway ≈ 2400px); card 576px wide at x=672 | section 3060px (340vh trap), cards 448px (max-w-md) pinning late (swap runway ≈ 840px) |
| F3 | **High** | Highlighted Restaurants mobile deck reduced to 6 cards | mobile section 3514px, exactly 6 articles (Volta, Roux, Aura, Garbo, Kōan, Ember) after full scroll sweep; desktop carousel still 16 (trap 4140px) | 16-card mobile deck |
| F4 | **Med** | "Choose Your Vibe" heading is a per-letter scroll reveal | 64 letter `<span>`s; colors interpolate cream `rgb(248,247,244)` → ink `rgb(26,26,26)` tied to scroll position (fill while entering, un-fill while exiting) — mid-shades rgb(243,242,239)…rgb(214,213,210) captured mid-transition | static solid-dark text |
| F5 | **Med** | Stay + Sight card titles are 24px on mobile | live mobile stay h3 = 24px/500 white, sight h3 = 24px/500; desktop 18px/500 (unchanged) | 18px at all sizes (`text-lg`) |
| F6 | **Med** | "More Things to Do" button is a DARK pill | bg `rgb(17,17,17)`, white text, 166×46, radius 999, no border (both viewports) | white bg, ink text, border, 198×46 |
| F7 | **High** | Browse pages: ONE unified planner card/pill (search inside) | mobile: white card radius 30 bg white/92 shadow `0 12 28 rgba(14,14,14,0.1)` holding the search pill (cream `rgba(248,247,244,0.55)` r22 h54) + labelled "Let's Plan Your Trip / Select dates" row + "People / 2" row + action row with two circular icon buttons; NOT sticky on mobile; desktop: one sticky white pill 1216×68 r999 with search + labelled date/people segments + 2 icon buttons; NO type-of-activities field | separate white search pill row + a 2×2-grid TripPlanner card (dates/people/type/search), sticky at all sizes |
| F8 | **Med** | Place detail: rating pill ON the photo, no Map button, About 34px, photo 260px mobile | photo overlays = heart (top-left) + white rating pill "4.9 ★" (top-right); NO Map link on the photo; header meta row = pin + neighborhood + price (NO rating); "About this place" h2 = 34px; hero photo 260px mobile / 460px desktop | "Map" white link top-right + rating in the header meta row; About h2 = clamp(26px,7.2vw,34px) → 28.08px at 390; photo 380px mobile |
| F9 | **Med** | Eat/do card photo height is 300px on mobile | live mobile photo 300px (desktop 372px — clone matches) | 372px at all sizes (`h-[372px]`) |
| F10 | **Med** | Profile chrome | icon-only Back button at the top; email directly under the username (no "Your Roam account" prefix); "Saved places" = dark button 154×44 (ink bg, white text); All/Eat/Stay/Do filter chips carry icons | no back button; "Your Roam account · email" line; "Saved places · N" text chip; text-only filter chips |
| F11 | **Med** | Map chrome | search pill (cream, r999, h48) with a circular icon cell + filter button in a card row; category pills 44px WITH icons — ACTIVE = light-violet `rgb(240,234,255)` bg + `rgb(216,202,255)` border + `rgb(87,26,255)` text, inactive = white + `rgba(14,14,14,0.08)` border + `rgb(85,85,80)`; circular zoom controls; bottom stats pills ("Augsburg center", "9 places", "€ pricing") | magnifier-in-white-pill search; solid-black active chips, no icons; square Leaflet zoom; "0 events · N places" badge |
| F12 | **Low** | Desktop card sizes / container widths | stay cards 381–387px, sight cards 360px (sections full-bleed with a ~1142px inner grid); clone 364/344 (max-w-1180/1120 containers) | minor — tighten the showcase containers |
| F13 | — | Deliberate deviations (keep) | "API KEY REQUIRED" watermark, canvas carousel → DOM transforms, `/place/<id>` → `/place/<slug>` URLs, hosted-only login flows answered with inline notices | n/a |

## 3. Plan (TDD — update the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | **RecommendedRoute redesign**: remove card photos; stop card = time pill (white, 999, clock icon + time) + serif title 44px mob/48px dsk `#141413` weight 400 + white info card (20px/600 name link, 16px meta, 14px desc, BLACK h-11 Learn More pill). Desktop: card column `max-w-[576px]`, pinned from the trap start (`lg:pt-24`, not centered-late), trap `lg:h-[420vh]`; mobile keeps the vertical timeline + text cards | `src/components/home/RecommendedRoute.tsx` | updated `home.spec.ts` route test (no `img` in the route section; time pill white bg; title color `rgb(20,20,19)`; swap still pins + swaps; black Learn More) |
| R2 | **Restaurants mobile deck → 6 cards** (first 6: Volta, Roux, Aura, Garbo, Kōan, Ember); desktop carousel unchanged (16, `md:h-[460vh]` trap for the 4140px feel) | `src/components/home/HighlightedRestaurants.tsx` | updated deck count assertion 16 → 6 + names |
| R3 | **Vibe heading letter reveal**: split the h2 into per-letter spans; a scroll listener maps the heading's viewport position to a fill count (letters cream→ink as it rises to center; un-fill as it exits); `prefers-reduced-motion` and pre-hydration render solid ink | `src/components/home/StayShowcase.tsx` (client LetterReveal) | new spec: ≥50 letter spans exist; color state changes between scroll positions |
| R4 | **Stay/sight mobile titles 24px**: `text-[24px] md:text-[18px]` | `src/components/places/StayCard.tsx`, `src/components/home/HighlightedSights.tsx` | new spec assertions at 390 (`24px`) and 1280 (`18px`) |
| R5 | **More Things to Do dark pill**: `bg-[#111111] text-white h-[46px]` no border | `src/components/home/HighlightedSights.tsx` | spec: bg `rgb(17,17,17)`, color white |
| R6 | **Browse planner unification**: new `BrowsePlanner` client component — mobile: white card (r30, bg white/92, shadow 0 12 28) with the cream search pill (r22 h54, `Search places` input) + labelled date row + people row + two circular icon buttons (Sliders → scroll to chips; Map → /map); desktop: one sticky white pill (r999 h-[68px]) with inline search + labelled date/people segments + the two icon buttons; no type field; replaces the search row + TripPlanner in `CategoryExplorer`; sticky only md+ | `src/components/places/CategoryExplorer.tsx`, new `src/components/planner/BrowsePlanner.tsx` | updated browse spec: `Search places` input inside `.browse-planner-card`; date label visible; segments route to the same browse URL with people/start/end params |
| R7 | **Place detail parity**: rating pill (white, star+4.9) at photo top-right; remove the Map link + drop the rating from the header meta row; `About this place` h2 → fixed `text-[34px]`; hero photo `h-[260px] sm:h-[460px]` | `src/app/(app)/place/[slug]/page.tsx` | updated detail test: rating pill on the photo, no `Map` link, About 34px |
| R8 | **Eat/do card photo 300px mobile**: `h-[300px] sm:h-[372px]` | `src/components/places/PlaceCard.tsx` | spec: photo height 300 at 390 / 372 at 1280 |
| R9 | **Profile chrome**: email-only line under the username; "Saved places" dark button → `/favourites`; icon-only Back link above the card; icons on the All/Eat/Stay/Do filter chips | `src/components/profile/ProfileView.tsx` | updated profile test (email text, Saved places link bg, back link) |
| R10 | **Map chrome**: cream search pill with the circular icon cell + filter button; 44px pills WITH icons, active = violet-tint `#F0EAFF/#D8CAFF/#571AFF`, inactive white/`rgba(14,14,14,0.08)`/`#555550`; circular Leaflet zoom via CSS; bottom stats pills "Augsburg center · N places · € pricing" | `src/components/map/MapExplorer.tsx`, `src/app/globals.css` | updated map test (pill colors + icons, stats pills) |
| R11 | **Showcase container tightening** (F12): stay grid inner `max-w-[1144px]`, sights `max-w-[1144px]` full-bleed sections | `StayShowcase.tsx`, `HighlightedSights.tsx` | card width assertions (~380/360 at 1280) |
| R12 | Full gates → refresh the 14 screenshots → docs (README/AGENTS/CLAUDE/PAD/SKILL/session log/worklog) → single commit + SSH-wrapper push | everything | all gates green; screenshots variance-checked; docs consistent |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all new tokens/classes via `@theme`/arbitrary values
  only; NO `tailwind.config.*`; keep explicit `rgba()`/hex utilities where specs
  assert computed colors (α-modifiers compile to `color-mix()`).
- **Mobile nav safety valve untouched**: the `no-scrollbar` row and the ≤62px
  wordmark span stay; the 5 v4 failure-class pins must stay green.
- **The letter reveal must degrade gracefully**: SSR renders solid ink (no
  layout shift, no invisible heading for crawlers/at non-JS); reduced-motion
  users get the static heading.
- **The route swap must not regress**: keep the `article[data-active]` contract
  the spec drives; the trap grows (340vh→420vh) so the swap test's wheel amount
  stays within the trap (2600px wheel at 800px viewport ≈ 3.25 screens — inside
  the 420vh=3360px trap).
- **E2E rate limiter**: one shared login (storageState) — unchanged.
- **Do not regress** the pinned contracts: 42 unit, API envelope, seed counts
  (12/12/18 + 27 home + 9 map), browse purity, Leaflet `ssr:false`,
  single-exit db-path helpers, `.env`/`.env.example` DATABASE_URL pinning.
- The restaurants desktop carousel keeps the documented DOM-transform deviation
  (canvas → maintainable transforms); only the trap length and mobile deck count
  change.
