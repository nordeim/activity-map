Workspace re-cloned (the sandbox had been reset). Read AGENTS.md, CLAUDE.md, README.md, the PAD, and activity-map_SKILL.md in full.
Reviewed the session history: remediation-plan-session-27.md, worklog.md, docs/session_29.md (the previous conversation's log), and docs/start_server_log.txt. docs/session_28.md does not exist — the session files jump 27 → 29; this session's plan is remediation-plan-session-28.md and its log is session_30.md (following the established file numbering).
Validated the codebase against the docs: .env already pins DATABASE_URL="file:../db/custom.db" with db/ at the repo root; vitest + playwright configs verified working; skills/ excluded from lint/tsconfig.
Installed dependencies, pushed the schema, seeded the DB (78 places + demo user), and ran the FULL BASELINE GATE on the untouched tree: lint ✓ (2 pre-existing warnings) · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · 68/68 E2E ✓ — the codebase matches all documentation claims.
Cloned the scandihaven reference repo and confirmed the shared engineering patterns (six-phase workflow, Tailwind v4 CSS-first rules, full-gate verification, TDD).
Loaded the agent-browser, TDD, and VLM skills; reviewed the Tailwind-V4-Validation-Report and the skills catalog.
**Dual-site browser audit.** The deployed mirror (activity-map.jesspete.shop) was verified REDEPLOYED WITH SESSION-27 CODE — the coffee-icon time pill (h 28, shadow + hairline + #3A3A3A), the bordered link cards, the lh-1.1 h2 — plus zero console errors across every page, the mobile navbar end-to-end (52px tab-bar, 12px links, tap navigation, scroll persistence), the favourites + booking round-trips, and the legal routes + redirects. ALL GREEN.
The live source (activity-map.base44.app) re-measured at 1280/390: every session-24/25/26/27 surface re-verified UNCHANGED, then the TRIP-PLANNER DATE-RANGE POPOVER swept for the first time since session 3 + the home stay pills + the booking-form labels + the profile chips.
**4 findings**: F1 the popover (510px/pad-12/self-contained 238×50 from-to fields/no Done/14px-500 month/28px navs/12.8px weekdays/weight-400 selected/#F7F4FF in-range/gray trailing buttons); F2 the home stay pills (34px + the bordered Book Now — the browse variant stays 36px); F3 the booking labels (12px/600 #3A3A3A + #DDDBD5 borders); F4 the profile chip pad (16px).
Wrote docs/remediation-plan-session-28.md and validated it against the codebase (the exact spec insertion points + the current component contracts).
**TDD RED**: the new date-picker contract + the stay-pill extension + the booking-label extension — all three verified failing on the unmodified tree.
**TDD GREEN**: R1 the popover container + header (the self-contained field pills with the calendar icons, the Done button removed); R2 the month-grid chrome (14px/500 label, 28px navs, 12.8px weekdays, weight-400 selected, #F7F4FF in-range, the gray trailing-day buttons, gap-y-2 for the 40px row pitch); R3 the stay pills (h-[34px] + the bordered Book Now); R4 the booking labels + #DDDBD5 borders; R5 the profile chip px-4.
**En-route fix**: the E2E run exposed a stacking-context trap — the hero content wrapper's z-10 CAPPED the popover's z-[30000] under the category section's z-10, intercepting the day-cell clicks. The wrapper drops the z (DOM order keeps the layering identical; every hero pin stayed green).
**Side-by-side verification**: the popover 510×369 vs the live 510×371 (the mobile 358×427 vs 429) — EXACT within 2px; the pills 168×34 with borders; the labels 12px rgb(58,58,58); the chips 110/125/102 × 34.
**FULL FINAL GATE GREEN**: lint ✓ · typecheck ✓ · 42 unit ✓ · build ✓ · 27/27 smoke ✓ · **69/69 E2E** ✓ (68 + the new date-picker contract).
Captured 5 dev-server screenshots (33–37: the desktop popover, the selected-range state, the mobile popover, the stay-card pills, the booking-form labels) — VLM-verified all YES.
Verified .env.example covers every code-referenced env var.
Updated the documentation: README (the session-28 row + 37 screenshots + 69 E2E), AGENTS.md (the popover/stay-pill/label contracts + the z-index lesson), CLAUDE.md, the PAD (v2.7), activity-map_SKILL.md (v1.15.0), the plan's execution record, and the worklog.
Committed and pushed to main via the SSH wrapper (docs/ssh_git_wrapper_v3.py per docs/how-to-git-push-using-ssh-wrapper_SKILL.md) — push verified, key shredded.

## Session 28 Summary

**Audit**: the mirror verified running the session-27 code ALL GREEN; the live re-measured with the date-picker popover swept for the first time since session 3 — **4 findings, all remediated to EXACT visible parity via TDD**:

1. **DateRangePicker popover**: rebuilt to the live's chrome (510px, the self-contained from/to field pills with icons, no Done button, the re-measured month grid)
2. **Home stay pills**: 41px → 34px + the bordered Book Now
3. **Booking-form labels**: 14px ink → 12px #3A3A3A + #DDDBD5 field borders
4. **Profile chips**: px-4 (the live's 16px pad)

**Delivery**: 42 unit + 27 smoke + **69 E2E** all green · 37 screenshots (VLM-verified) · 8 docs aligned (PAD v2.7, SKILL v1.15.0) · pushed to main via the SSH wrapper.

**Next step**: once the mirror redeploys, a quick spot-check of the popover (click "Select dates" — the coffee-table test is the new 510px chrome with the calendar icons) would close the loop; the E2E contracts already pin it.
