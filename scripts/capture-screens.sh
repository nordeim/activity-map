#!/usr/bin/env bash
# Session-3 screenshot refresh — captures the remediated UI into
# docs/screenshots/ (desktop 1280x800 + mobile 390x844).
# NOTE: agent-browser resolves paths against its daemon cwd — use ABSOLUTE paths.
set -euo pipefail
BASE=/home/z/my-project/activity-map
OUT="$BASE/docs/screenshots"
URL=http://localhost:3000
mkdir -p "$OUT"

ab() { agent-browser "$@" > /dev/null 2>&1; }
shot() { agent-browser screenshot "$1" > /dev/null 2>&1; }

# ---------- Desktop 1280x800 ----------
ab set viewport 1280 800
ab open "$URL/"
sleep 5
shot "$OUT/01-home-highlights.png"

# Section captures (element-scoped)
agent-browser screenshot "#category-cards" "$OUT/11-home-route-catcards-tmp.png" > /dev/null 2>&1 || true
agent-browser screenshot "#recommended-route" "$OUT/11-home-route.png" > /dev/null 2>&1 || true
agent-browser screenshot "#highlighted-restaurants" "$OUT/12-home-restaurants.png" > /dev/null 2>&1 || true
agent-browser screenshot "#stay-showcase" "$OUT/13-home-stays.png" > /dev/null 2>&1 || true
agent-browser screenshot "#highlighted-sights" "$OUT/14-home-sights.png" > /dev/null 2>&1 || true
rm -f "$OUT/11-home-route-catcards-tmp.png"

# Browse views
ab open "$URL/eat"; sleep 4; shot "$OUT/02-eat.png"
ab open "$URL/stay"; sleep 4; shot "$OUT/03-stay.png"
ab open "$URL/do";   sleep 4; shot "$OUT/04-do.png"

# Map
ab open "$URL/map"; sleep 6; shot "$OUT/05-map.png"

# Place detail (a stay with the booking request form)
ab open "$URL/place/courtyard-stay"; sleep 4; shot "$OUT/06-place-detail.png"

# Favourites (with one saved place)
ab open "$URL/eat"; sleep 4
ab click 'article button[aria-label="Save to favourites"]'; sleep 1
ab open "$URL/favourites"; sleep 4; shot "$OUT/07-favourites.png"

# Profile
ab open "$URL/profile"; sleep 4; shot "$OUT/08-profile.png"

# ---------- Mobile 390x844 ----------
ab set viewport 390 844
ab open "$URL/"; sleep 5; shot "$OUT/09-mobile-home.png"
ab open "$URL/eat"; sleep 4; shot "$OUT/10-mobile-eat.png"

echo "--- captured ---"
ls -la "$OUT" | awk '{print $5, $6, $7, $8, $9}'
