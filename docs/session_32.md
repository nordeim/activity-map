Workspace re-cloned (the sandbox had been reset). Read AGENTS.md, CLAUDE.md, README.md, the PAD, and activity-map_SKILL.md in full.
Reviewed the session history: remediation-plan-session-28.md, worklog.md, docs/session_30.md, docs/session_31.md (the session-28 conversation's raw log, added by the owner's post-session server rebuild), and docs/start_server_log.txt (the fresh build + restart at 06:25 — the mirror now runs the session-28 code). This session's plan is remediation-plan-session-29.md and its log is session_32.md (following the established file numbering).
Validated the codebase against the docs: .env already pins DATABASE_URL="file:../db/custom.db" with db/ at the repo root; vitest + playwright configs verified working; skills/ excluded from lint/tsconfig.
Installed dependencies, pushed the schema, seeded the DB (78 places + demo user), and ran the FULL BASELINE GATE on the untouched tree: lint ✓ (2 pre-existing warnings) · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · 69/69 E2E ✓ — the codebase matches all documentation claims.
Cloned the scandihaven reference repo and confirmed the shared engineering patterns (six-phase workflow, Tailwind v4 CSS-first rules, full-gate verification, TDD). Loaded the agent-browser + VLM skills and reviewed the skills catalog (clone-app-pat-pro, tdd, tailwind-patterns).
**Dual-site browser audit.** The deployed mirror (activity-map.jesspete.shop) verified REDEPLOYED WITH SESSION-28 CODE — the date-range popover signature (510×369, the grid header of self-contained 238×50 field pills with calendar icons, NO Done button) — plus zero console errors across every page, the mobile navbar end-to-end (52px tab-bar, 12px links, tap navigation through the MapPin icon), the favourites + booking round-trips, and the legal routes. ALL GREEN.
The live source (activity-map.base44.app) re-measured at 1280/640/390: every session-24→28 surface re-verified UNCHANGED (the popover, the stay pills, the browse chips + card rating pills, the detail structure, the mobile nav, the sights pills at 640), then the DESKTOP RESTAURANT BAND swept as a whole for the first time since session 6 + the map list-card chrome + the stats pills + the detail hero rating pill.
**8 findings**: F1 the band heading layer (a sticky vertically+horizontally CENTERED column — the h2 clamp(46px,7vw,104px) + the white View All BELOW at gap 24 — that FADES OUT through the first ~45% of the trap); F2 the names watermark (a centered FIVE-name sliding window at uniform Inter clamp(24px,2.6vw,40px) 400, gap 34 — the active solid, the rest white/0.32, the row centering AS A GROUP); F3 the featured card (the compact min-w-330 centered bottom-9vh model — pad 16, white/0.08 + 1px white/0.16 border + blur 18, the address + centered meta + two flex-1 h-38 12px buttons, NO name — fading IN as the heading fades out); F4 the map list-card eyebrow (a CREAM PILL); F5 the map card MapPin neighborhood line; F6 the map grid gap (12px); F7 the map stats pills (NO shadow); F8 the detail rating pill (61×32).
Wrote docs/remediation-plan-session-29.md and validated it against the codebase (the spec insertion points + the current component contracts).
**TDD RED**: the reworked band contract in home.spec.ts + the map list-card extensions + the detail rating-pill extension in browse.spec.ts — all verified failing on the unmodified tree.
**TDD GREEN**: R1 the heading layer (the centered column + the fade); R2 the 5-name window (the circular wrap); R3 the compact featured card (no name); R4 the map eyebrow pill + MapPin + gap-3; R5 the shadowless stats pills; R6 the 61×32 rating pill (px-3 py-2 + the 14px star). En-route test refinement: the two flex-1 buttons' equal-width pin needed ±2px tolerance (the fractional flex split rounds 143/145).
**Side-by-side verification**: the band h2 x=142/w=996/center=640 EXACT; the featured card 330×128 vs the live 330×130 with matching chrome (pad 16/border 1px/blur 18/buttons 38px); the names window 33.28px uniform Inter; the map card eyebrow 65×26 cream + the 12px MapPin + the 12px gap; the detail pill 61×32 — every remediated surface within 2px of the live.
**FULL FINAL GATE GREEN**: lint ✓ · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **69/69 E2E** ✓ (the band contract reworked + the map/detail contracts extended — every prior pin green).
Captured 6 dev-server screenshots (38–43: the band heading + card states, the map list card + grid, the detail rating pill, the mobile map card) — VLM-verified all YES.
Verified .env.example covers every code-referenced env var.
Updated the documentation: README (the session-29 row + 43 screenshots + the band/map feature rows), AGENTS.md (the band + map contracts), CLAUDE.md, the PAD (v2.8), activity-map_SKILL.md (v1.16.0), the plan's execution record, the worklog, and this log.
Committed and pushed to main via the SSH wrapper (docs/ssh_git_wrapper_v3.py per docs/how-to-git-push-using-ssh-wrapper_SKILL.md) — push verified, key shredded.

## Session 29 Summary

**Audit**: the mirror verified running the session-28 code ALL GREEN; the live re-measured with the desktop restaurant band swept as a whole for the first time since session 6 — **8 findings, all remediated to EXACT visible parity via TDD**:

1. **Band heading layer**: the sticky centered column (h2 + View All below) with the fade-out
2. **Names watermark**: the centered 5-name sliding window (uniform Inter, circular wrap)
3. **Featured card**: the compact centered model (no name, flex-1 h-38 buttons, fade-in)
4. **Map list-card eyebrow**: the cream pill
5. **Map card neighborhood**: the 12px MapPin icon line
6. **Map grid gap**: 12px
7. **Map stats pills**: shadowless
8. **Detail hero rating pill**: 61×32 with the 14px star

**Delivery**: 42 unit + 27 smoke + **69 E2E** all green · 43 screenshots (VLM-verified) · 8 docs aligned (PAD v2.8, SKILL v1.16.0) · pushed to main via the SSH wrapper.

**Next step**: once the mirror redeploys, a quick spot-check of the band (scroll into the blue section — the centered heading + View All, then the compact card + the 5-name window) would close the loop; the E2E contracts already pin it.
