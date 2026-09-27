#!/usr/bin/env bash
# Session 24 screenshot addendum — the filter-shell design system captures:
# the map's sticky command center (desktop + mobile) and the mobile browse
# planner + chips + floating card shells. Requires the production server on
# :3000 and an authenticated agent-browser session (login done before).
set -euo pipefail

OUT="/home/z/my-project/activity-map/docs/screenshots"
mkdir -p "$OUT"

# 18: desktop map command center (the sticky glass shell + pills row)
agent-browser set viewport 1280 800 > /dev/null
agent-browser open "http://localhost:3000/map" > /dev/null
sleep 8
agent-browser screenshot "$OUT/18-desktop-map-command-center.png" > /dev/null
echo "captured 18-desktop-map-command-center.png"

# 19: mobile map command center (the stacked shell + 44px pills)
agent-browser set viewport 390 844 > /dev/null
agent-browser open "http://localhost:3000/map" > /dev/null
sleep 8
agent-browser screenshot "$OUT/19-mobile-map-command-center.png" > /dev/null
echo "captured 19-mobile-map-command-center.png"

# 20: mobile browse top (the sticky planner + 44px chips + floating cards)
agent-browser open "http://localhost:3000/eat" > /dev/null
sleep 5
agent-browser screenshot "$OUT/20-mobile-eat-filter-shell.png" > /dev/null
echo "captured 20-mobile-eat-filter-shell.png"

echo "SESSION-24 CAPTURES DONE"
