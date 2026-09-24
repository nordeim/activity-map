# Session 6 — Remediation Plan (live-app redesign parity)

Date: 2026-09-24 · Base commit: `04fd822` (main) · Agent: Super Z (session 6)

## 1. Context

Session 4 recovered the interrupted hand-off (restored the `(app)` layout, home page, and
login route) and re-verified parity. Since then the LIVE app (`activity-map.base44.app`)
has been redesigned again across most surfaces. This session re-measured the live app
(logged in with the demo account; DOM audits at 1280/768/390 + viewport/strip screenshot
sequences + VLM comparisons) and catalogues the gaps below. The clone's baseline is green:
lint ✓ typecheck ✓ 42 unit ✓; dev server probes all healthy (`/` → 307 unauth, 200 auth;
login 200; 42 published + 27 home-only + 9 map-demo places; 12/12/18 browse counts).

## 2. Findings (verified by DOM measurement on the live app, 2026-09-24)

| # | Severity | Finding | Evidence (live) | Clone today |
|---|----------|---------|-----------------|-------------|
| F1 | **High** | Desktop navbar is a floating PILL, not a full-width bar | inner bar inline styles: `max-width:820px; border-radius:999px; border:1px solid #E8E6DC; box-shadow:0 2px 12px rgba(14,14,14,0.08)`, wrapped in `sticky flex justify-center px-6 pb-2 pt-[9px]` (bar 820px centered at 1280/1440; 720px at 768) | full-width white `h-14` bar, border-b only, no shadow |
| F2 | **High** | Desktop nav link typography: 13px Inter, active weight **700** ink, inactive **500** `#555550` | computed styles of link spans at 1280 | `text-base` (16px), active 400 (md:font-normal), inactive ink/70 |
| F3 | **High** | Mobile nav link text renders at **12px** (span inline style), active 700 ink / inactive 500 ink-40% | computed styles at 390 | `text-base` 16px |
| F4 | **High** | Hero trip planner is a WHITE elevated card (not frosted glass): `bg rgba(255,255,255,0.94)`, radius 30, shadow `0 16px 34px rgba(14,14,14,0.16)`, 2-col grid `258px 76px`, each field a gray pill `rgba(242,241,238,0.76)` radius 20 h≈50, date field labelled "Let's Plan Your Trip" | DOM chain of `.trip-planner-card` at 390 | frosted glass capsule with hover-revealed labels |
| F5 | **Medium** | Category cards: mobile VIEW ALL is a VIOLET `#571AFF` full-width pill (fs 12, h 36); card bg `rgba(255,255,255,0.58)` radius 24 (desktop VIEW ALL stays near-black `#141413` — matches clone) | computed styles of the View All anchor + card chain at 390 | black `#141413` pill all sizes; card white/34 radius 20 |
| F6 | **High** | Recommended Route (desktop): LEFT = stylized route map (solid black line + circular nodes over a faint topographical background — live shows an "API KEY REQUIRED" watermark artifact); RIGHT = **sticky single-card swap** (one stop card visible at a time, replaced as you scroll: Morning Coffee → Lunch → … → Dinner); progress pill purple fill 0%→100%; Learn More = **BLACK** pill; meta INLINE ("Altstadt · 4.8 rating · €€ · Coffee") | 5-frame scroll sequence + heading y-audit (all stops pinned at y≈2000, x=672) + VLM sequence analysis | sticky dotted-SVG visual + a scrolling COLUMN of 5 cards; violet Learn More; stacked (block) meta lines |
| F7 | **High** | Highlighted Restaurants REDESIGNED: desktop = scroll-driven carousel — canvas of floating rotated photos + restaurant-name watermark text + one glass detail card (address · € · ★ · rating + "Book a Table" white pill + "Learn More" glass outline) inside a 4140px trap; mobile = **stacked card deck** (position:fixed stack, 490px white cards rounded-28, 164px step; photo h-372, gradient, rating pill top-right, heart top-left, 28px white title on photo, body with neighborhood/desc/tag pills, violet Learn More h-11) | section child audit (CANVAS + sticky divs + watermark div `GranaryFaroVoltaRoux…` + detail div `15 Innenstadt Gasse…€★★4.8`) + mobile element tree | static grid: featured card + 3-strip + "Tap a table to feature it" helper |
| F8 | **High** | Stay showcase cards: **square aspect-1/1**, radius 24, WHITE Inter 18px/500 titles overlaid on the photo bottom; grid `md:grid-cols-3`; "Choose Your Vibe" heading color `#1A1A1A` | computed styles of stay h3s + card chain at 1280/390 | photo-top + text-below cards, ink Libre Baskerville 20px titles, `sm:grid-cols-2 lg:grid-cols-3` |
| F9 | **High** | Sights cards: square 360px, radius 24, white Inter 18px/500 title on the photo + a panel hanging 30px BELOW the card (`bottom-[-30px]`) with rating (Inter 12 bold) · neighborhood · category · full-width Learn More h-9; grid `gap-5 md:grid-cols-3` | computed styles of sight h3s + `bottom-[-30px]` chain | ink LB 20px titles below photos |
| F10 | **Medium** | Footer: nav links inside a WHITE rounded pill (radius 28; mobile = 3-col `104px` grid, desktop = flex-wrap pill ≈506px), and the footer renders on **ALL pages** (browse/detail/map/favourites/profile) | footer + nav-grid computed styles at 390/1280 | plain links, home page only (`SiteFooter` in `page.tsx`) |
| F11 | **Medium** | Browse pages: h1 = **50.7px** Libre Baskerville wrapping to 2 lines ("Eat Well / Tonight") | h1 computed styles at 390 | 36px, 1 line |
| F12 | **Medium** | Place detail: h1 50.7px; "About this place" h2 = 34px | computed styles | 36px h1; 20px h2 |
| F13 | **Low** | Profile: h1 = the **username** ("sepnetflix2023") | live profile h1 audit | h1 = "Explorer" |
| F14 | **Low** | Login: "Welcome to Activity Map" h1 + "Continue with Google" + "or" divider + "Forgot password?" + "Need an account? Sign up" chrome | live login DOM | simpler card ("Augsburg City Guide", 2 inputs, Sign in) |

Non-gaps re-verified as still matching (no action): mobile top-bar geometry (fixed 52px
cream glass, logo two-span crop, right icons at x=304/330/356, scrollWidth 390); filter
chip semantics (Open now / Near me / Under €100 / Trending + tags); booking form field set
(Name*/Surname*/Dates*/Time*/Phone/Email*/Message → Book Now with "Choose dates"/"Choose
time" placeholders); map page (9 markers, pills, search, "Places on the map"); eat card
titles 24-28px white Inter on photo; API envelope; seed data (12/12/18 + 27 home + 9 map).

Deliberate deviation: the live route visual shows an "API KEY REQUIRED" watermark (a
broken StaticMap on the live app). The clone renders a clean topographical-style
background — we do not clone error watermarks.

## 3. Plan (TDD — update the E2E/unit contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R1 | Navbar: desktop floating pill (max-w-820, radius 999, border #E8E6DC, shadow, 13px/700-active/#555550 links, sticky pt-9px wrapper) + mobile 12px link text | `src/components/layout/Navbar.tsx` | `mobile-navigation.spec.ts` (geometry + overlap + navigation still green); new desktop-nav checks in `home.spec.ts` |
| R2 | TripPlanner: white elevated card (bg white/94, radius 30, shadow 0 16 34, 2-col grid, gray field pills radius 20, "Let's Plan Your Trip" field label) for hero + browse sticky shell | `src/components/planner/TripPlanner.tsx`, `src/components/home/Hero.tsx` | updated planner assertions (labels, structure) in `home.spec.ts`/`browse.spec.ts` |
| R3 | CategoryCards: mobile violet VIEW ALL (#571AFF pill, fs 12, full-width); card bg white/58 radius 24 | `src/components/home/CategoryCards.tsx` | updated home assertions |
| R4 | RecommendedRoute: desktop sticky single-card swap (right column pinned, cards swap on scroll progress) + solid-line/nodes visual on faint topographical bg + inline meta + BLACK Learn More; mobile unchanged (vertical stops) | `src/components/home/RecommendedRoute.tsx` | route assertions: one visible stop at a time (desktop), inline meta, black button |
| R5 | HighlightedRestaurants: mobile stacked card deck (scroll trap, cards slide over) + desktop scroll carousel (rotated floating photos + name watermark + glass detail card) — DOM transforms, not canvas | `src/components/home/HighlightedRestaurants.tsx` | rewritten section assertions: deck at 390, carousel elements + detail card at 1280, Book a Table / Learn More targets, View All |
| R6 | StayShowcase: square aspect-1/1 cards radius 24, white Inter 18/500 overlaid titles, `md:grid-cols-3`, heading #1A1A1A | `src/components/home/StayShowcase.tsx` | stay card assertions (square, title-on-photo, 3 cols from md) |
| R7 | HighlightedSights: square cards radius 24, white Inter 18/500 title + hanging meta panel (rating · neighborhood · category · Learn More h-9) | `src/components/home/HighlightedSights.tsx` | sight card assertions |
| R8 | SiteFooter: white pill nav (radius 28; mobile 3-col grid / desktop wrap) + render from the `(app)` layout on ALL pages | `src/components/layout/SiteFooter.tsx`, `src/app/(app)/layout.tsx`, remove from `page.tsx` | new spec: footer visible on /eat, /stay, /do, /map, /favourites, /profile, /place/* |
| R9 | Typography scale: browse h1 50.7px (2-line), detail h1 50.7px + About h2 34px, profile h1 = username | `src/app/(app)/{eat,stay,do}/page.tsx`, `place/[slug]/page.tsx`, `ProfileView.tsx` | heading assertions |
| R10 | LoginForm parity chrome: "Welcome to Activity Map" + Google button (visual, non-functional in the local clone) + "or" divider + Forgot password / Sign-up links (no-op anchors) | `src/components/auth/LoginForm.tsx`, `login/page.tsx` | login assertions (auth.spec.ts) |
| R11 | Full gates → refresh 14 screenshots → docs (README/AGENTS/CLAUDE/PAD/SKILL/session log/worklog) → commit + SSH-wrapper push | everything | all 6 gates green; screenshots variance-checked; docs consistent |

## 4. Risks & guards

- **Tailwind v4 CSS-first**: all new tokens/classes in `@theme`/`@utility` or arbitrary
  values only; NO `tailwind.config.*`; keep explicit `rgba()` utilities where specs assert
  computed colors (α-modifiers compile to `color-mix()`).
- **Mobile nav safety valve**: keep the `no-scrollbar` overflow row and the wordmark ≤62px
  span cap (failure class D); the 12px link text REDUCES pressure on the 390px budget —
  re-run the pairwise overlap detector after the change.
- **The restaurants scroll trap** must degrade gracefully at reduced motion and when JS
  hasn't hydrated: the mobile deck falls back to a simple stacked column; the desktop
  carousel falls back to a static grid.
- **E2E rate limiter**: one shared login (storageState) — unchanged.
- **Do not regress** the pinned contracts: 42 unit, API envelope, seed counts, browse
  purity (12/12/18), Leaflet `ssr:false`, single-exit db-path helpers.
- Route stops' times (9:00 AM …) and titles stay as-is (already matching).
- `.env`/`.env.example` already carry `DATABASE_URL="file:../db/custom.db"` — untouched.
