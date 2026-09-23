# Session 3 Remediation Plan — Live-App Parity Re-Measurement (2026-09-23)

**Scope driver:** the live app (`activity-map.base44.app`) evolved again after session 2.
This plan re-measures every surface at 1280 / 768 / 390 px and remediates the clone.
Every measurement below was taken from the live DOM/computed styles or the live JS
bundle (`assets/index-DBf79loS.js` / `index-C2PWMuMS.css`) on 2026-09-23.

## Ground truth: what changed on the live app since session 2

1. **Poppins is gone.** The Google Fonts link now loads only IM Fell English (unused
   in the DOM) + Libre Baskerville; nav links compute to Inter (desktop links carry
   inline `font-family:'Inter', Helvetica Neue, Arial, sans-serif`). The CSS utility
   `.font-poppins` was redefined to Libre Baskerville — but no live element uses it.
2. **The navbar was redesigned.** Desktop is no longer a floating pill: a full-width
   white `h-14` bar with `border-bottom: 1px solid #E8E6DC` inside a transparent
   sticky header (`sticky top-0 z-[20000] flex justify-center px-6 pb-2`).
   Mobile is a cream-glass `tab-bar` (bg `#F8F7F4/62`, border-bottom
   `rgba(14,14,14,0.08)`, 52px) wrapping an `h-12 px-4` nav.
3. **Palette shift.** Page bg `#F8F7F4` (was measured `#F9F7F2`); primary text
   `#0E0E0E` (roam-text); secondary `#3A3A3A`; muted `#888580`; surface2 `#F2F1EE`;
   borders `#DDDBD5` / navbar line `#E8E6DC`; accent violet now `#571AFF`
   (Learn More / Book Now buttons, `rgb(87,26,255)`).
4. **The trip planner became a real control.** Segments show a value row (icon +
   text) with a hover-revealed label above; People/Type are invisible native
   `<select>` overlays; dates open a react-day-picker range popover ("from / to
   Optional"), formatted `15/09/2026 — 18/09/2026`; the search button is
   transparent (hover black), 46px, `data-ready` flips true when dates are chosen.
   **Search routes to `/<eat|stay|do>?people=N&start_date=YYYY-MM-DD&end_date=…`,
   not the map** (bundle: `x==="Hotels"?"/stay":x==="Attractions"?"/do":"/eat"`).
5. **Browse pages carry the planner** as a sticky white pill
   (`.planner-filter-shell sticky top-24`), pre-filled from the URL params.
6. **Browse cards were redesigned.** Eat/Do: image `h-[372px]` with the name
   overlaid on the photo (Inter 28px, tracking −0.04em) + sub-category above it;
   body: map-pin + neighborhood, price as ACTIVE + DIMMED symbols filled to 4
   (`€€€<span opacity:.3>€</span>`, 13px #72706A), description that slides away on
   hover, tag pills (bg #F2F1EE), and a violet #571AFF "Learn More" pill (h-11)
   that fades in on hover (always visible on mobile). Do cards add a duration
   badge (clock icon in a dark glass pill next to the rating). Stay: `aspect-square
   rounded-[24px]` dark cards (bg #181818, image h-[118%], hover brightness-75)
   with name (Inter 18px medium), address + `N · subcategory` row, and ghost
   "Learn More" + white "Book Now" buttons revealed on hover.
7. **Heading scale grew.** At 1280: home h1 115.2px (clone ✓), Recommended Route
   72px/ls −3.24px, Highlighted Restaurants 89.6px, Choose Your Vibe 92.16px,
   Highlighted Sights 83.2px, route stop titles 48px, browse h1 55px/ls −3.3px,
   detail h1 82px/ls −4.92px. Derived clamps:
   - Restaurants `clamp(42px, 7vw, 104px)` ls −0.055em
   - Vibe `clamp(40px, 7.2vw, 112px)` ls −0.06em
   - Sights `clamp(42px, 6.5vw, 86px)` ls −0.055em
   - Route `clamp(38px, 6vw, 72px)` ls −0.045em
   - Browse h1 `clamp(36px, 4.3vw, 55px)` ls −0.06em; detail h1 `clamp(36px, 6.4vw, 82px)` ls −0.06em
8. **Category cards are glass** (bg `rgba(255,255,255,0.34)`, radius 20px, planner
   shadow), headings Inter 14px/600, VIEW ALL is a black #141413 pill (36px,
   12px/600, ls 0.03em) — not violet. Eat card row 3 sub is **Altstadt** (clone
   says Stadtmarkt); Do card row 3 sub is **Fun** (clone says Golden hall).
9. **Recommended Route became a scroll-driven sticky section**: a 140vh heading
   trap (`h-[140vh] -mb-[110vh]`, sticky centered heading, bg #F8F7F4) then
   `route-map-section` (~3333px) with `route-map-sticky sticky top-0 flex`
   (viewport-height): left = SVG route visual with the progress pill
   ("0% of your day planned", font-neue/Inter 12px, bottom-24 centered), right =
   `route-waypoint-panel` of white `rounded-[28px] p-5 mt-7 max-w-md` stop cards
   with 48px Libre Baskerville titles, `9:00 AM` times, and STACKED meta lines
   (`Altstadt` / `· 4.8 rating` / `· €€` / `· Coffee`).
10. **Detail page**: h1 82px; "About this place" + tag pills; booking form is a
    request form — Name*, Surname*, Dates* ("Choose dates"), Time* ("Choose
    time"), Phone, Email*, Message, Book Now (violet, h-12).
11. **Map page** shows 9 hardcoded demo places (bundle array `oP`, ids
    `map-*`, lat/lng real) + stats pills ("Augsburg center / 9 places / €
    pricing"), a geolocation notice ("📍 Location permission denied · showing
    approximate area"), "0 events · 9 places" counter, and a "Places on the map"
    section (h2 + "Fictional restaurants, hotels and things to do."). The 42
    browses entities have NO lat/lng on the live app — the map is not entity-fed.
12. **Profile page** redesigned: "PROFILE" eyebrow, "Explorer" title, "Your Roam
    account", "Augsburg", "0 day streak" + Explorer badge, "Saved places",
    "TRIPS / My bookings N", Upcoming/Past/All tabs + Eat/Stay/Do filters,
    "No upcoming reservations. Time to explore."
13. **Footer** background is solid cream #F8F7F4 with #0E0E0E text.
14. Non-gaps (measured, deliberately NOT changed): entity data 12/12/18 + home
    rows identical (all 34 card images byte-identical); logo/hero assets
    identical (md5-verified); blue band #4D61FF + Volta featured card unchanged;
    eat/stay/do chips match; favourites page copy matches; browse category-card
    counts 12/18 are the live's resolved state (the 20/10 seen sometimes is the
    live's `count: F || 20` loading fallback — bundle-verified); slugs vs entity-ID
    hrefs kept (internal choice); stay browse card price shows the numeric price
    field ("360 · 5-star Stay").

## Workstreams (execution order, TDD: specs/helpers first)

### WS1 — Tokens & fonts (P0)
`globals.css`: cream `#F8F7F4`; ink `#0E0E0E`; roam `#571AFF` (+hover deep);
new tokens `--color-secondary #3A3A3A`, `--color-muted #888580`,
`--color-surface2 #F2F1EE`, `--color-line #E8E6DC`, `--color-border #DDDBD5`;
`--font-nav` → Inter (Poppins import removed from `layout.tsx`); footer solid
cream. Vitest: none (visual).

### WS2 — Navbar (P0)
Desktop: transparent sticky header → full-width white `h-14` bar, border-b line,
logo two-span at 25.6px/88px, 5 icon+text links (Inter 16px, active bg
`rgba(14,14,14,0.08)`, weight 400), right heart (w-9 h-9 bg `rgba(14,14,14,0.07)`)
+ avatar (w-9 h-9 bg #0E0E0E, white bold initial). Mobile: `tab-bar` cream-glass
52px, nav h-12 px-4, logo 18px/62px, text-only links 16px Inter (active 700
#0E0E0E / inactive 500 rgba(14,14,14,0.4)), right MapPin/Heart/User 18px icons.
Keep the `no-scrollbar` safety valve + all five failure-class E2E guarantees;
update `mobile-navigation.spec.ts` metrics (link font-size 16px, bar bg, 3 right
icons, no overlap at 390px).

### WS3 — Planner (P0/P1)
New `TripPlanner` client component (shared by Hero + browse shell): glass pill
(home) / white pill (browse, `sticky top-24`); segments = label-above
(hover-reveal) + value row (calendar-days/users/map-pinned 14px) + invisible
select overlay; custom `DateRangePicker` popover (Su–Sa grid, from/to with
Optional, `DD/MM/YYYY — DD/MM/YYYY`); search button 46px transparent→black,
`data-ready`; submit → `/eat|/stay|/do?people=N[&start_date&end_date]`.
Vitest: param builder + range label formatter (pure seam in `src/lib/planner.ts`).
E2E: planner submits to `/eat?people=2…` (RED first).

### WS4 — Home sections (P0)
`CategoryCards`: glass cards, Inter 14px/600 headings, black VIEW ALL, subtitle
fixes (Altstadt, Fun). `RecommendedRoute`: sticky scroll redesign — heading trap
(140vh), sticky two-column route section, SVG route visual + progress pill
("0% of your day planned", scroll-driven %), right panel stop cards (rounded-28,
48px titles, stacked `· `-prefixed meta), "9:00 AM" time labels. h2 clamps per §7.
`home.json`: City Gallery price fix (€6 → € priceLabel "€"). `SiteFooter` bg.

### WS5 — Browse cards (P1)
`PlaceCard` (eat/do): h-[372px] image, overlaid name 28px Inter, sub-category
12px white/75, heart 36px black/45, rating white pill, duration badge (do),
price active+dimmed (helper `priceRangeDisplay()` in utils + vitest), tag pills,
violet Learn More with hover choreography. New `StayCard`: aspect-square dark,
name 18px, address + `price · sub` row, ghost Learn More + white Book Now.
Grid `mx-auto max-w-7xl gap-5`. Browse h1 clamp(36px, 4.3vw, 55px) ls −0.06em.

### WS6 — Detail page (P1)
h1 clamp(36px, 6.4vw, 82px) ls −0.06em; "About this place" + tag pills (replace
info grid); booking request form (Name*, Surname*, Dates*, Time*, Phone, Email*,
Message) posting to `/api/bookings`; extend `Booking` model with the request
fields (db push + seed unchanged); violet Book Now h-12.

### WS7 — Map page (P2)
Seed 9 demo places (status `"map"`, real lat/lng, `map-*` slugs, images from the
bundle array); MapExplorer consumes map-status places only; stats pills, "0
events · N places" counter, geolocation notice with Augsburg fallback, "Places
on the map" list section; keep pills/markers/popups.

### WS8 — Profile page (P2)
Redesign to the live layout (PROFILE eyebrow, Explorer title, streak + badge,
Saved places count, TRIPS/My bookings N, Upcoming/Past/All tabs + Eat/Stay/Do
filters, new empty states); drop the Slow-city checklist.

### WS9 — Gates, docs, push
Full gate (lint → typecheck → unit → build → smoke → E2E) with spec updates;
fresh screenshots (14); README/AGENTS/CLAUDE/PAD/activity-map_SKILL.md alignment;
commit + SSH-wrapper push (main only).

## Validated against the codebase
- All named files exist; the 12 client components and `status:"home"` seeding
  pattern already support WS4/WS7 (extend, not re-architect).
- `PlaceDTO.price`/`priceLabel`/`nightlyPrice` already exist → stay numeric price
  and City Gallery fix are data-only edits.
- E2E suite (35) updated in place: planner submit target, card Learn More,
  navbar metrics, route progress text, profile tabs, map place count.
- Rate limiter + storageState pattern unaffected; no new external deps.
