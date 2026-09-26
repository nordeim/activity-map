I'll start executing this comprehensive task. Let me first set up a TODO list and check the workspace state.
The workspace already exists from a previous session. Let me refresh it with `git pull` and check the current state.
Workspace refreshed. The pull brought in `docs/session_19.md` and an updated `start_server_log.txt`. Let me review the core documentation now.
Now let me read the other core documents in parallel.
Now let me read the session documents — the most critical for understanding current status.
Now let me check the activity-map_SKILL.md project state and the skills catalog.
文档评审已完成。现在让我检查技能目录并验证代码库状态。
Now let me validate the codebase state — env, db, test configs.
Env/db/test configs validated. Let me check for the documented parent `.env` hijack trap and verify the codebase structure.
No parent `.env` trap this time. Structure matches docs. Let me run the baseline gates now.
The `db execute` CLI resolves URLs against CWD — let me query via an absolute path instead.
Database state is correct (42 published + 27 home + 9 map, demo user). Now let me verify the deployed site is up and determine which code version it runs.
Both sites are up. Let me load the agent-browser skill for the browser-based E2E audit.
agent-browser is ready. Let me start the dual-site audit — first login to the deployed mirror.
Logged in successfully. Now let me verify the deployed site runs session-18 code by checking the key texture signature on the eat page.
Session-18 texture confirmed on the deployed mirror. Let me check the detail-split signature too.
Deployed mirror confirmed running session-18 code (detail split + texture + geometry all match). Now let me run a comprehensive functional audit. First, console errors check.
All pages clean. Now the critical mobile navigation audit at 390px.
The nav measurement shows `position: static` which needs investigation — let me check the actual navbar DOM structure.
Navbar structure is correct — the `header` is the fixed cream-glass wrapper (nav inside is static, as designed). Let me verify scroll persistence and tap navigation.
移动端导航已实现端到端功能。现在进行收藏双向交互测试。
POST returned 201. Let me verify persistence and then unsave to restore state.
Favourites round-trip verified. Now the booking round-trip.
Booking round-trip verified. Now the session-18 home surfaces — mobile route visual and restaurant flow.
Mobile restaurant flow perfect (6 static cards, 620px advances). **Deployed-site audit: ALL GREEN.** Now let me login to the live source site to re-measure for any changes since session-18.
Logged into the live source. Now let me systematically re-measure the live site — starting with home page at 1280.
Desktop pill unchanged (820×56 @ x=230). Let me systematically audit all key surfaces. First the browse pages with texture.
Let me check the live chips more precisely — the height/font differs from session-18 records.
Chips confirmed unchanged (38px/12px). Now the live detail page split layout.
Detail page unchanged — grid matches clone exactly. Now the live map page.
Map page unchanged. Now the live profile page.
Profile unchanged. Now the live home page surfaces — category cards, route, stay showcase.
Home surfaces match. Now the critical mobile audit at 390px on the live site.
Live mobile navbar matches the clone exactly. Now the live mobile route visual + restaurant flow.
Interesting — need to check the stop card structure more closely (radius 0 vs expected 28).
The live stop-card h3 measures 20px now vs the session-18 record of 30px. Let me compare against the clone's implementation and check the full waypoint text structure.
Discrepancy found in route stop cards. Let me dump the clone's full waypoint panel structure for comparison.
Found first discrepancy: live route stop place-names are 20px, clone renders 30px. Let me continue checking the live mobile restaurant flow.
Restaurants flow unchanged. Now live mobile detail page.
Mobile detail matches. Now live mobile planner and category cards.
Mobile category cards show different dimensions (276×168 vs recorded 306×227). Let me verify the actual card element.
Category cards unchanged (306×227 r24 — my earlier walk stopped at an inner wrapper). Now the live mobile browse page.
Mobile profile matches. Now the desktop band overlap choreography.
Band overlap 800px exact. Now the live login page check.
Login matches. Only one finding so far. Let me dig deeper — desktop route cards, sights, map list, browse card internals.
Map list cards exact. Let me do a final deep-dive on the one discrepancy found — the mobile route stop cards — comparing live vs clone in detail.
Live route card: h3 20px/600, meta 13px, Learn More 13px/600. Now the clone's exact values for comparison.
Confirmed F1. Let me check the remaining surfaces — favourites page and desktop route stop cards.
The live favourites page shows unexpected values — let me investigate closely.
Favourites matches. Now the desktop route stop cards on live.
Live desktop swap cards: 576px with 20px h3 titles. Let me check the clone's desktop route cards.
Height difference detected in desktop route cards too. Let me compare card internals on both sites.
Live desktop route cards are 576×326/349 text-only with 20px h3. Now the clone's desktop cards in detail.
More findings on desktop route cards. Let me check the clone's time pill at desktop and examine the source code.
Live link card uses `max-w-md` (448px). Now let me read the clone's RecommendedRoute source to understand the current implementation.
Let me verify the live's mobile route panel padding and link card width precisely.
Let me complete the audit with stay/do browse pages and hero checks.
The /do page shows an anomaly — let me investigate.
/do 页面正常（测量过早）。让我核对一下克隆的移动端浏览几何结构以进行最终的对比。
Let me do final checks — desktop route visual panel width and restaurants carousel.
Major finding #2: desktop route split is 50/50 (640px each) on live vs 46/54 on clone. Let me verify the live panel padding.
Let me verify the live's mobile hero h1 position as a final check.
Let me check the live's desktop card vertical position within the sticky panel.
Let me scroll both sites into the route trap and take comparison screenshots — ground truth for the choreography.
The live's swap choreography slides cards UPWARD (exit goes up, not down). Let me check the clone's swap state at the same scroll point.
The clone swaps later than the live. Let me examine the swap logic in the source.
Let me map the live's swap choreography by sampling card states at multiple scroll points.
Let me measure the live's card transforms directly to understand the mechanism.
The choreography model is now clear. Let me read the rest of the clone's RecommendedRoute structure.
Let me check the live's route heading trap and svg viewBox, then close the audit.
Audit complete. Let me close the browser sessions and examine the existing E2E route contracts before writing the remediation plan.
One more measurement — the live's mobile waypoint card gaps, then I'll write the plan.
All measurements complete. Let me update the TODO list and write the remediation plan.
Plan written. Now let me validate it against the codebase once more, then start TDD RED — updating the E2E specs first.
Now TDD RED — updating the route E2E contracts with the session-20 measurements.
Let me fix the fragile locators and the span index issue in my spec edits.
Spec updates done. Let me check the Playwright config and verify types before running the RED phase.
Build ✓. Now the RED phase — run the route test against the unmodified implementation, expecting failures.
RED confirmed (fails exactly at the new contract). Now GREEN — implementing the RecommendedRoute changes.
Now the visual panel width and the stops column + articles.
Implementation done. Let me verify types, lint, and run the GREEN check.
Let me see the actual color value received.
Color precision issue: live is rgb(114,112,106) = `#72706A`, not `#72706C`. Fixing.
Route test GREEN. Now the full E2E suite to check for regressions.
The route test passes alone but fails in the full suite — let me investigate the interference.
Found it — `scrollIntoViewIfNeeded` on the tall trap is non-deterministic (centers vs aligns top depending on run context). Let me use an explicit scroll.
Let me add temporary debug output to understand the wheel behavior.
The implementation works (debug proves it) — the failure is test-sequence flakiness with `mouse.wheel`. Let me make both scroll steps deterministic.
All 15 pass. Let me fix the TS null-safety complaint in the test helper.
Slot drifted 28px — likely late-loading content above the route. Let me instrument precisely.
Let me replicate the exact failing test flow with full instrumentation.
The root cause is late-image layout drift moving the trap after the scroll. Let me make the test drift-resistant: double-scroll re-align + the designed slot via computed padding + a tolerant runtime range.
**56/56 E2E GREEN!** Now the smoke test to complete the gate suite.
All gates green (lint ✓ typecheck ✓ 42 unit ✓ build ✓ 27 smoke ✓ 56 E2E ✓). Now the side-by-side verification — reseed, start dev server, and compare against the live.
Now the side-by-side choreography verification on the dev server.
Near-perfect match. Now the choreography samples on the dev server vs the live's recorded values.
Choreography matches the live almost exactly (opacity values within 0.02). Now the mobile verification.
Mobile match is EXACT (354@x18, gaps 28, pad `28px 18px 48px`). Now let me save the favourite for screenshot 07 and capture the screenshots.
Now save the favourite for screenshot 07 (Moss & Marble).
Favourite persisted. Now run the screenshot pipeline.
All 14 screenshots validated. Now updating the documentation. Let me find the route-related sections in each doc.
Now updating README.md — the route feature row and the session-20 status row.
Now AGENTS.md — updating the route choreography facts.
Now CLAUDE.md — the testing map and architecture bullets.
Now the PAD revision entry (v2.0).
Now activity-map_SKILL.md — version bump + project_state update.
Now the session log — docs/session_20.md.
Now append the worklog entry.
Now verify .env.example covers all code-referenced env vars.
.env.example is consistent (NEXT_PUBLIC_SITE_URL is the documented reserved slot). Now stop the dev server and run the final verification before commit.
Let me run the final full E2E on the exact push tree for confidence, given the earlier flakiness.
A different test flaked (favourites round-trip). Let me check the failure and re-run.
56/56 on the re-run (the favourites failure was a one-off CDN-timing flake). One more run to confirm stability.
Suite stable (2× consecutive 56/56). Now the commit + push. Let me read the SSH wrapper runbook.
The runbook is clear. Let me verify the push infrastructure and scan for secrets before committing.
Commit created. Now materialize the operator key and verify its fingerprint.
Fingerprint matches the historical records exactly. Now the dry-run push.
Dry-run confirms fast-forward. Executing the real push.
Push verified. The shred script had a bug — let me properly destroy the key now.
Key destroyed. Now the final worklog push-verification entry.
**Session 20 complete.** Here's what was accomplished:

## Audit Results

**Deployed mirror (jesspete.shop)** — running session-18 code, functionally **ALL GREEN**: every page loads with zero console errors, mobile navigation works perfectly (fixed 52px cream-glass header, correct icon positions, tap navigation, no Tailwind v4 failure classes), and the favourites + booking round-trips both pass.

**Live source re-measure** — every session-18 surface re-verified unchanged, except the **Recommended Route stop cards**, which had evolved (4 findings):

1. **Typography shrank**: place names are now h3 at 20px/600 (was 30px), meta lines 13px `#72706A`, Learn More 13px
2. **Desktop split is 50/50** (not 46/54) with the card slot at y=237, and the swap is a **continuous scroll-linked choreography** (cards glide up through the slot at 0.665px/scroll-px with ±380px tent crossfades) — not a discrete crossfade
3. **Mobile panel pads 18px** (cards 354@x18, 28px gaps)
4. **Chrome details**: shadow-less time pills, max-w-md 448px link cards, lighter shadows

## Delivery

- **TDD remediation** (RED verified → GREEN): all four findings implemented, with the choreography matching the live within **17px / 0.02 opacity** on sampled scroll positions; mobile matches **exactly**
- **Full gates green** ×2 consecutive: lint · typecheck · 42 unit · build · 27 smoke · **56 E2E**
- 14 screenshots refreshed, `.env.example` verified, 8 docs aligned (PAD v2.0, SKILL v1.8.0)
- **Pushed to main**: `9f32dfe` + `7d23778` via the SSH wrapper — remote verified, key shredded

**Next step suggestion**: redeploy the mirror from main @ `7d23778` to pick up the session-20 route surfaces (the `rm -rf db/ + reseed` flow will also clear the "Audit Session20" booking my round-trip test left on the deployed site).
