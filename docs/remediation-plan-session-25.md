# Session 25 — Remediation Plan (deployed-mirror verification + live-source re-measure → the login typography, the category-card scale-back, the favourites empty width, the legal-page routes)

Date: 2026-09-27 · Base commit: `7e433a5` (main) · Agent: Super Z (session 25)

## 1. Context

Session 24 pushed the filter-shell parity (`ff32686` + `7e433a5`); the
suggested next step was a mirror spot-check after the owner redeploys. This
session pulled (new: `docs/session_25.md` + the start-server log update),
re-read every root doc + the session-24 log + the plan + the worklog + the
start-server log, re-validated the codebase state (env, db, configs, skills
exclusion), and ran the full baseline gate on the untouched tree.

Baseline on the untouched tree (all green): lint ✓ (2 pre-existing warnings)
· typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **66/66 E2E** ✓.

## 2. Audit results

**Deployed mirror (`activity-map.jesspete.shop`) — REDEPLOYED WITH SESSION-24
CODE, ALL GREEN.** Verified by DOM signature: the chips (600 / #555550 / 1px
rgba(14,14,14,0.08) hairline / violet #571AFF active / 38px @1280 / 44px
@390), the browse card floating shell (r-28 + hairline +
`0 18px 44px rgba(14,14,14,0.08)`), the map command center (sticky top-96
shell h 66 w 1216, pills 41/600), the mobile pt-112 heading contract (h1 y
112), the 36px heart disc, the 52px tab-bar. Functionally: zero console
errors across every page at 390; the mobile navbar end-to-end (no overflow at
390, tap navigation, active-state movement, fixed-bar scroll persistence,
icon actions); the favourites round-trip (save → visible → unsave → 0); the
booking round-trip (submit → "Request sent" → visible under Profile → My
bookings).

**Live-source re-measure (`activity-map.base44.app`, logged in at
1280/390):** every session-24 surface re-verified UNCHANGED — the chips, the
card shell, the map command center, the browse planner chrome (sticky top-96
/h 68 / solid-white pill / pad 6 / white-70 hairline), the mobile pt-112
contract, the hero (−86/1010 @1280, 0/591 @390, h1 y 290/203), the desktop
pill (820×56 @x=230, r999, #E8E6DC), the footer glass pill (506×96 @x=387,
r-28, blur(40) saturate(1.5), pt-64/pb-56, inner 1024), the route h3s
(20px/600/−0.4px), the stay squares (381×381, 18px/500/−0.54px), the sights
grid (360×360), the blue band (#4D61FF), the detail split (h1 y 225/82px,
card 1152×688 r36, inputs 44px/16-radius/14px font), the profile (h1 72px
@y203, tabs 44/12px, r-26 empty state), the favourites heading (h1 y 244),
the map cards (397×119 r-24 vs clone 395×117 — 2px noise), the 9-card
interleaved map order, the mobile carousel (978/390, 306 cards, snap x).
**Five new findings** — the surfaces pinned longest (login internals since
session 10, category cards since session 16, legal pages never):

## 3. Findings (verified by DOM measurement on the live app, 2026-09-27)

| # | Sev | Finding | Evidence (live) | Clone today |
|---|-----|---------|-----------------|-------------|
| F1 | **Med** | **Login signup row structure** — the whole "Need an account? Sign up" is ONE button | `<button class="text-sm text-slate-500 hover:text-slate-700">Need an account? <span class="font-medium text-slate-700">Sign up</span></button>` — accessible name "Need an account? Sign up"; the emphasized part is font-**medium** | a `<p>` "Need an account?" + a nested button "Sign up" at font-**semibold** — accessible name "Sign up" only |
| F2 | **Med** | **Login input font** — the shadcn fields are 14px (text-sm) | computed `font-size: 14px` on both fields (height 48 unchanged; labels 14px/500/20 identical) | `text-base` = **16px** |
| F3 | **High** | **Category-card desktop internals scale-back** — the live renders the session-10 internals (230px-wide cards, 36px rows, 28×28 cells, 124px track) and SCALES the row `transform: matrix(1.15)` at md — root cause of the raw 265×210 readings; the VISIBLE contract: cards 263–265 wide × 210 (eat) / 231 (hotels/sights) tall, header 24px, rows 41–46px, cells 32×32, row gap ~12–13px, card x 231/508/786, the View All pill 229×54 hanging with its top ~5px above the card bottom | header `md:leading-6` ≈ 24px; cells 28×28 ×1.15 = 32.2 visible; gap 12 computed → 13.8 visible; the row `flex justify-center` + scale(1.15) origin center | header `md:leading-8` = **32px**; cells **34×35**; row gap **20px** (gap-5); card 263×223 uniform; the pill `md:bottom-[-27px]` (top 27px above the card bottom vs the live's 5px) |
| F4 | **Med** | **Favourites empty-state width at desktop** — the live's empty card is `max-w-xl` | `w-full max-w-xl rounded-[28px]` → **576px** centered @x=352 at 1280 (mobile unchanged: 358@x16) | `max-w-md` → **448px** @x=416 |
| F5 | **High** | **Legal pages** — routes + chrome + content | routes **`/privacy-policy`** + **`/accessibility-statement`** (the old `/privacy` 404s on the live); footer hrefs match; `← Back home` link (an `<a href="/">`, 14px/400, **#8A8780**, y≈84); content column **max-w-3xl** (768 centered); main pad 80px 24px; h1 48px Libre Baskerville ink @y≈136; paras **14px/28px #5F5C56**; NO "Last updated" line; titles "Privacy Policy \| Activity Map" / "Accessibility Statement \| Activity Map"; the live's verbatim texts (3 short paras each — account/booking data usage; accessibility aims + feedback); no nav/footer | routes `/privacy` + `/accessibility`; footer hrefs `/privacy` + `/accessibility`; no back link; `max-w-2xl`; "Last updated: September 2026" eyebrow; paras 15px text-black/75; longer self-hosted-focused texts |

Non-gaps re-verified (keep, document): the map card 2px width delta (395 vs
397 — noise); the live's own per-card row-height variance (eat rows 41px vs
hotels/sights 46px visible — the live's label wrapping, not a clone gap; the
clone's uniform 46px rows sit inside the live's visible range); the live's
own View All pill height variance (54/41/54 — the clone's uniform 54 matches
2 of 3); the login card heights (746 vs 784 — follow from F2 and the live's
own field-slot spacing; re-measure post-fix); the desktop pill 2px width
(368 vs 366); the detail form inputs (14px on BOTH — the F2 class of drift
is login-specific).

## 4. Plan (TDD — extend the E2E contracts first, then implement)

| # | Task | Files | Verification |
|---|------|-------|--------------|
| R0 | **RED phase — extend the specs first**: (a) `auth.spec.ts` — extend the session-10 login test: both inputs `font-size: 14px`; the signup control's accessible name is "Need an account? Sign up"; (b) `home.spec.ts` — UPDATE the session-16 category-card pins to the session-25 visible contract: the icon cell 32×32 (was 34×35), the desktop h2 header height ≤26px (was leading-8/32px), the card height 205–235 (was 220–243), and ADD: the desktop row card-gap ≤15px (was 20), the View All pill's top within 10px above the card bottom (was −27); (c) `browse.spec.ts` — new assertion in the favourites test: @1280 the empty card width > 550 (the max-w-xl 576 contract; was 448); (d) `auth.spec.ts` — NEW test "the legal pages match the live (session-25)": `/privacy-policy` + `/accessibility-statement` render (title metadata, the ← Back home link, h1 48px Libre Baskerville, para font 14px/28px, no navbar/footer) and the OLD routes `/privacy` + `/accessibility` redirect (or 404 — pick redirect to preserve inbound links); the footer legal hrefs point at the new routes | tests/e2e/{auth,home,browse}.spec.ts | RED confirmed: every new assertion fails against the unmodified tree |
| R1 | **Login typography + signup row (F1 + F2)**: the two inputs `text-base` → `text-sm`; the bottom row becomes ONE button — "Need an account? <span class='font-medium text-slate-700'>Sign up</span>" (text-sm text-slate-500 hover:text-slate-700), keeping the hosted-platform notice behavior | src/components/auth/LoginForm.tsx | the R0a spec GREEN; the existing login-flow tests stay GREEN (the button keeps type=button + the notice onClick); dev-server re-measure: the card height lands near the live's 746 |
| R2 | **Category-card desktop internals (F3)**: the h2 `md:leading-8` → `md:leading-6`; the icon cells `md:h-[35px] md:w-[34px]` → `md:h-8 md:w-8` + the svg `md:h-[15px] md:w-[15px]`; the desktop row `gap-5` → `gap-3.5` (14px); the View All pill `md:bottom-[-27px]` → `md:bottom-[-49px]` (its top ~5px above the card bottom, as the live) | src/components/home/CategoryCards.tsx | the R0b spec GREEN; the mobile carousel pins stay GREEN (no base-class changes); the row layout pins (the hero -mt overlap) stay GREEN — verify the pill's 9px visual overlap into the route section's top padding is invisible (the route content starts ~100px lower) |
| R3 | **Favourites empty-state width (F4)**: the empty `<section className="mx-auto max-w-md">` → `max-w-xl` | src/components/favourites/FavouritesView.tsx | the R0c spec GREEN; the mobile empty-state pin (358@x16) stays GREEN (max-w only binds above 576) |
| R4 | **Legal pages to the live's routes + chrome (F5)**: rename `src/app/privacy` → `src/app/privacy-policy` and `src/app/accessibility` → `src/app/accessibility-statement`; keep the old paths as permanent redirects (Next `redirect()` in a tiny page — the live 404s them, but the clone has shipped those URLs since session 2); rewrite `LegalPage` to the live's chrome — the `← Back home` link (14px/400 #8A8780, `href="/"`), the max-w-3xl column, main `py-20 px-6`, h1 48px (text-5xl) Libre Baskerville, paras `text-sm leading-7 text-[#5F5C56]`, DROP the "Last updated" eyebrow; replace both pages' bodies with the live's verbatim texts; metadata titles "Privacy Policy \| Activity Map" / "Accessibility Statement \| Activity Map"; the footer legal links → the new routes | src/components/layout/LegalPage.tsx, src/app/privacy-policy/page.tsx (new), src/app/accessibility-statement/page.tsx (new), src/app/privacy/page.tsx (redirect stub), src/app/accessibility/page.tsx (redirect stub), src/components/layout/SiteFooter.tsx | the R0d spec GREEN; the smoke suite's login-page/404 checks stay GREEN; the footer hrefs verified |
| R5 | **Full gates + side-by-side + screenshots + docs + push**: lint → typecheck → 42 unit → build → 27 smoke → 66+ E2E; re-measure every remediated surface against the live on the dev server (login: input 14px + the signup row + the card height; the category cards: header 24 / cells 32 / gap ~14 / card ~215 / the pill hang; the favourites empty 576 @1280 + 358 @390; the legal pages: routes + back link + h1 48 + para 14/28); refresh the affected screenshots; align README/AGENTS/CLAUDE/PAD/activity-map_SKILL/the plan/the worklog; verify `.env.example`; single conventional commit + SSH-wrapper push (main only) | everything | all gates green; the fixed surfaces measured within tolerance of the live |

## 5. Risks & guards

- **Tailwind v4 CSS-first**: every change is a stock or arbitrary-value
  utility — no `tailwind.config.*`; the mobile-nav safety valve and the five
  failure-class pins stay untouched; the category-card edits are md:-only
  (the mobile carousel internals must not move).
- **R2's pill hang (−49px)**: the pill's visual bottom extends ~9px past the
  row's layout box into the route section's top padding — the same overlap
  the live itself renders (its pill crosses the hero's bottom edge); verify
  no collision with the route section's first content (~100px below its
  top) and that the home-page-bottom chain pins stay green.
- **R4's route rename**: the old paths keep redirects so inbound links (and
  the session-2..24 docs) stay valid — the live 404s them, but a redirect is
  strictly friendlier and invisible to parity; the E2E must pin the NEW
  paths; the smoke suite's public-route checks must not regress.
- **R4's content swap**: the live's texts are SHORTER and generic (they
  describe the hosted Roam service); the clone's self-hosting disclosures
  (SQLite, scrypt, CDN imagery) move OUT of the legal pages. The demo-account
  documentation in README/AGENTS keeps the operational facts — nothing is
  lost, the legal pages match the live.
- **R1's accessible-name change**: the E2E locators that target the Sign-up
  button by role/name must be updated in the same commit (grep the specs for
  "Sign up" first).
- **Do not regress**: 42 unit, the API envelope, the seed counts, browse
  purity, Leaflet ssr:false, single-exit db-path helpers, the .env pinning,
  the shared E2E storageState, the rate limiter, the login white-body inline
  style, the profile (bare) contract, the footer session-23 contract, the
  tab-bar 52px + glass pins, the hero geometry, the route choreography, the
  stay showcase, the sights grid, the desktop heading pins, the session-24
  filter-shell contracts (chips/card shell/map command center/planner
  stickiness/Back pill/mobile headings).

## 6. Execution record (2026-09-27, post-delivery)

All five remediation rows executed in TDD order (RED confirmed on the
unmodified tree — all four touched specs failing — then GREEN):

- **R0** — the spec extensions written and RED-verified: the login input
  font + the one-button signup row (auth.spec.ts, an existing test
  extended); the legal-pages contract (auth.spec.ts, a NEW test — routes +
  redirects + the back link + the h1 + the para typography + the verbatim
  texts + chrome-less); the category-card pins updated to the session-25
  visible contract (home.spec.ts — cells 32×32, header ≤26, cards 205–235,
  gap 11–16, the pill's top ≤10px above the card bottom); the favourites
  empty card >550px centered (browse.spec.ts). One spec bug fixed en-route
  (an un-awaited `h1.evaluate` returning a promise to `toContain`).
- **R1** — the login: both inputs `text-base` → `text-sm`; the bottom row
  restructured to ONE button "Need an account? <span font-medium>Sign
  up</span>". Verified on the dev server: inputs 14px/48px, one button,
  span 500. The card height lands at 784 vs the live's 746 — a 38px
  whitespace delta from the live's merged-block structure + its hidden
  field slots; every visible element matches (documented as a non-gap).
- **R2** — the category cards: `md:leading-6` (24px header), `md:h-8
  md:w-8` cells with `md:h-[15px] md:w-[15px]` svgs, the row `gap-3.5`,
  the pill `md:bottom-[-49px]`. Verified EXACT: header 24, cells 32×32,
  svg 15, gap 14 (cards at x 232/509/786 vs the live's 231/508/786), cards
  263×215 (the live's 210–231 range), the pill 229×54 hanging 48px past
  the card bottom with its top 6px above it (the live: 49/5); the mobile
  carousel internals untouched (306×230, rows 36, cells 28×28, no 390
  overflow); the pill's 8px visual overlap into the route section's top
  boundary leaves 112px clearance to its first content (the live's own
  pill crosses its hero's edge the same way).
- **R3** — the favourites empty card `max-w-md` → `max-w-xl`: 576 @x=352
  centered at 640 — EXACT (the live: 576 @x=352); the mobile contract
  unchanged.
- **R4** — the legal pages: the new routes `/privacy-policy` +
  `/accessibility-statement` (absolute page titles), the legacy paths as
  `redirect()` stubs, the LegalPage rebuilt to the live's chrome (the ←
  Back home link 14px/400 #8A8780, max-w-3xl, py-20 px-6, the 48px
  Libre Baskerville h1, 14px/28px #5F5C56 paras, no Last-updated eyebrow),
  the live's verbatim texts, and the footer hrefs updated. Verified EXACT.
- **R5** — gates: lint ✓ (2 pre-existing warnings) · typecheck ✓ · 42 unit
  ✓ · build ✓ · 27/27 smoke ✓ · **67/67 E2E** ✓ (one full-suite flake on
  the do-view chip reset re-run green — caused by the audit session's
  browser daemons starving the run; killed before the final pass).
  25 screenshots (14 refreshed via capture-screens-v3 + crop-sections-v3;
  5 NEW session-25 captures via capture-screens-v6-session25: the desktop
  category cards, the login card, the two legal pages, the favourites
  empty state — VLM-verified, with one VLM height-direction claim
  discarded against the DOM). `.env.example` re-verified (covers every
  code-referenced var). Docs aligned: README, AGENTS, CLAUDE, PAD (v2.4),
  activity-map_SKILL (v1.12.0), this plan, the worklog.
