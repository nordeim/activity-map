# Remediation Plan — ROAM parity with the live app (Session 2)

Validated against the codebase at commit `9106717` (fresh clone) and against the
live reference `https://activity-map.base44.app/` (logged in with the demo
account, desktop 1280×800 and mobile 390×844, DOM-measured + VLM-compared).

## Verification baseline (all green before any change)

| Gate | Result |
|------|--------|
| `bun run lint` | ✅ clean |
| `bun run typecheck` | ✅ clean |
| `bun run test` (Vitest) | ✅ 32/32 |
| `bun run build` | ✅ (1 known warning: dynamic fs access → whole-project tracing, caused by `db-path.ts` `existsSync`) |
| `./scripts/smoke-test.sh` | ✅ 27/27 |
| `bun run test:e2e` (Playwright) | ✅ 27/27 (mobile-nav failure classes pinned) |

## Gap analysis (live vs clone)

The live app was **redesigned by its owner after session 1** (hero, home
sections, fonts, logo). The browse/detail/map/auth surfaces remain aligned in
structure and data (same 12+12+18 entities, same images, same filter chips).
The gaps, in priority order:

| # | Gap | Evidence (live, DOM-measured) | Severity |
|---|-----|-------------------------------|----------|
| G1 | **Display serif font** | All display headings use `Libre Baskerville` (loaded via Google Fonts with `IM Fell English`); clone uses Playfair Display | High (systemic) |
| G2 | **Nav font + logo** | Nav links are `font-poppins` 12px (700 active / 500 inactive, `letter-spacing: 0.01em`, color `rgb(14,14,14)`); logo is an image (`43e20e732_logo.png`, 18px icon + 62px wordmark); clone uses Poppins-less Inter + lucide icon wordmark | High |
| G3 | **Hero + planner redesign** | Live: hero image (`7ecc12b1f_untitled_Gemini_3__Nano_Banana_Pro__…jpg`), white Libre Baskerville h1 sitting low over the photo (`margin-top: calc(5rem + 28vh)`), **no subtitle paragraph**; planner is a **glass pill** (`rounded-full`, `border-white/35`, `bg-[#F8F7F4]/35`, `backdrop-blur-[28px]`) with a 4-segment grid: “Let’s Plan Your Trip / Select dates” · People 1–8 · Type (Restaurants/Hotels/Attractions) · round search button; wraps 2×2 at 390px. Clone: different hero image + subtitle + labeled stacked planner + full-width black Search bar | High |
| G4 | **Home: Recommended Route** | New section: “Recommended Route” + “100% of your day planned” + 5 timed stops (9:00 AM Morning Coffee → 9:30 PM Dinner) each with place name, `neighborhood · rating · €€ · tag` meta, one-line description, Learn More → `/place/home-route-*`. Missing in clone | High |
| G5 | **Home: Highlighted Restaurants (blue)** | Vivid blue `rgb(77,97,255)` section, white serif heading, “View All → /eat”, a horizontal coverflow strip of restaurant cards (Volta, Roux, Aura, Garbo, Kōan, Ember, Silo, Lagom, Noma Sud…) and a featured card (image, 4.8, Book a Table + Learn More). Missing in clone | High |
| G6 | **Home: Choose Your Vibe (stay showcase)** | Heading + “Pick a stay that matches your mood…” + 12 stay cards (name / street address / `€€€ · ★ 4.8` / Learn More + Book Now). Missing in clone (clone only has the 3 category cards) | High |
| G7 | **Home: Highlighted Sights** | “Six calm stops for a scenic Augsburg route…” + 6 sight cards (Fuggerei 4.9, Rathausplatz 4.8, Augsburg Cathedral 4.7, Perlachturm 4.8, Lech Canals 4.6, Schaezlerpalais 4.7) with neighborhood + descriptor + Learn More → `/place/home-sight-*`. Missing in clone | High |
| G8 | **Home: More Things to Do + footer** | “More Things to Do” link → /do; footer with nav links + “© 2026 Roam. Activity Map for Augsburg.” + Privacy policy + Accessibility Statement. Missing in clone | Medium |
| G9 | **Map filter pills** | Live labels: All Places / Restaurants / Hotels / Sights; clone: All / Eat / Stay / Do | Low |
| G10 | **`db:push` / `db:seed` env hijack** | Fresh environments export `DATABASE_URL` (workspace `.env` / shell profile) pointing outside the repo; `dev`/`start` pin the URL but `db:push`/`db:seed` did not — the seed wrote `<workspace>/db/custom.db` (reproduced and **fixed** in this session) | Medium (already fixed) |

Not gaps (verified): entity data (12/12/18, same images incl. regenerated
`*_generated_image.png` set), eat/stay/do headlines + subtitles + chips, auth
flow, API envelope, detail-page structure (gallery / About this place / booking
card with Choose dates · Choose time · Book Now), favourites, profile,
mobile-nav behavior (one-line fit, no clipping — re-measured on the live app:
logo 16–100, Highlights 121–180, Eat 192–210, Stay 222–247, Do 259–275, icons
304–374 at 390px; clone matches within a few px).

## Design decisions

- **D1 — `status: "home"` places.** Home-only content (5 route stops, 6 sights,
  9 strip restaurants + featured) is seeded as `Place` rows with
  `status: "home"`. `listPlacesForUser` / `countPlaces` filter
  `status: "published"`, so browses and counts stay 12/12/18; `getPlaceBySlug`
  does not filter status, so `/place/home-route-*`, `/place/home-sight-*`,
  `/place/home-restaurant-*` resolve like the live app. No schema change.
- **D2 — stay showcase reuses seeded stays.** The live home’s `home-hotel-*`
  links duplicate the Stay entities; the clone links to the existing slugs
  (`/place/garden-suite` etc.) — same destinations, no duplicate rows.
- **D3 — the blue section renders cards** even though the live app’s own card
  fetch 500s (`GET …/entities/Eat?q={"id":"lumen-dumpling-bar"} → 500`,
  observed in the network log). We replicate the design intent (featured card +
  strip), not the live bug.
- **D4 — assets are downloaded**, not hotlinked: hero photo and logo land in
  `public/images/` (stable against CDN removal), like the existing hero.
- **D5 — fonts**: add Libre Baskerville + Poppins to the Google Fonts link;
  `--font-serif` becomes Libre Baskerville; nav link font becomes Poppins.
  Playfair Display is removed (no other usage).

## ToDo list (executed in TDD order)

1. ✅ **G10** — pin `DATABASE_URL=file:../db/custom.db` in `db:push` + `db:seed`
   scripts (done; verified: seed writes `<repo>/db/custom.db`, parent dir clean).
2. **RED** — extend the E2E suite (`tests/e2e/home.spec.ts`) pinning the new
   home content: hero h1 + no subtitle, planner pill segments, category cards,
   route section (5 stops + Learn More), blue restaurants section (heading +
   View All + featured card + strip), stay showcase (12 cards), sights (6 cards),
   footer text. Run → fails.
3. **Assets** — download live hero image + logo into `public/images/`.
4. **G1/G2 fonts + logo** — `layout.tsx` font link; `globals.css` `@theme`
   (`--font-serif` → Libre Baskerville, `--font-nav` → Poppins); Navbar image
   logo (icon + wordmark) + Poppins link styles.
5. **G3 hero** — rewrite `Hero.tsx`: live hero image, low white serif wordmark,
   glass pill planner (4 segments, 2×2 wrap on mobile) submitting to `/map`.
6. **G4–G7 home data** — `prisma/data/home.json` (5 route stops, 6 sights, 10
   restaurants) + `seed.ts` extension writing `status: "home"` rows.
7. **G4–G8 home sections** — new components: `RecommendedRoute`,
   `HighlightedRestaurants` (blue + strip + featured), `StayShowcase`,
   `HighlightedSights`, `SiteFooter`; wire into `src/app/(app)/page.tsx`.
8. **G9** — map filter pill labels → All Places / Restaurants / Hotels / Sights.
9. **GREEN** — reseed, rebuild, re-run every gate (unit 32, smoke 27, E2E 27 + new).
10. **Screenshots** — fresh dev-server captures into `docs/screenshots/`.
11. **Docs** — update README / AGENTS / CLAUDE / PAD / `.env.example` notes for
    the remediated codebase; create `activity-map_SKILL.md` (distill skills).
12. **Ship** — commit to `main` + SSH-wrapper push.

## Risks

- The live app keeps evolving (owner-active). This plan targets the state
  measured today; the E2E suite pins it locally.
- The seed wipes domain tables (idempotent reseed) — `status: "home"` rows ride
  the same path, so CI/E2E databases stay consistent.
- Playwright home spec adds ~10s; acceptable.
