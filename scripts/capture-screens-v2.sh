#!/usr/bin/env bash
# Session-3 screenshot refresh v2 — captures the remediated UI into
# docs/screenshots/ (desktop 1280x800 + mobile 390x844).
# v2 changes: element-scoped captures are broken in agent-browser (blank
# output) → replaced by ONE full-page capture + PIL cropping via section
# bounding rects harvested with eval. Requires the browser to be logged in
# (demo account) before running.
set -euo pipefail
BASE=/home/z/my-project/activity-map
OUT="$BASE/docs/screenshots"
URL=http://localhost:3000
TMP=/tmp/screens-v2
mkdir -p "$OUT" "$TMP"

ab() { agent-browser "$@"; }
shot() { agent-browser screenshot "$1"; }

# ---------- Desktop 1280x800 ----------
ab set viewport 1280 800

# Home: viewport (01) + full-page for section crops
ab open "$URL/"
sleep 6
shot "$OUT/01-home-highlights.png"
ab screenshot --full "$TMP/home-full.png" > /dev/null

# Harvest section rects from the live DOM (must run AFTER full-page shot:
# the full-page capture can change scroll position).
ab eval "JSON.stringify(['#recommended-route','#highlighted-restaurants','#stay-showcase','#highlighted-sights'].map(s=>{const el=document.querySelector(s); if(!el) return {s,missing:true}; const r=el.getBoundingClientRect(); return {s, top:Math.round(r.top+window.scrollY), h:Math.round(r.height), w:Math.round(r.width)}}))" > "$TMP/rects.json" 2>/dev/null || true
cat "$TMP/rects.json" | head -c 600; echo

# Browse views
ab open "$URL/eat"; sleep 5; shot "$OUT/02-eat.png"
ab open "$URL/stay"; sleep 5; shot "$OUT/03-stay.png"
ab open "$URL/do";   sleep 5; shot "$OUT/04-do.png"

# Map (tiles need time)
ab open "$URL/map"; sleep 8; shot "$OUT/05-map.png"

# Place detail (a stay with the booking request form)
ab open "$URL/place/courtyard-stay"; sleep 5; shot "$OUT/06-place-detail.png"

# Favourites (one place pre-saved) + Profile
ab open "$URL/favourites"; sleep 4; shot "$OUT/07-favourites.png"
ab open "$URL/profile"; sleep 4; shot "$OUT/08-profile.png"

# ---------- Mobile 390x844 ----------
ab set viewport 390 844
ab open "$URL/"; sleep 6; shot "$OUT/09-mobile-home.png"
ab open "$URL/eat"; sleep 5; shot "$OUT/10-mobile-eat.png"

echo "--- raw captures done ---"
ls -la "$TMP" | awk '{print $5, $9}'
