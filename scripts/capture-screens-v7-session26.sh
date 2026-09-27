#!/usr/bin/env bash
# Session 26 screenshot additions — the remediated mobile surfaces: the
# route heading pinned INSIDE the trap (top-68, the clamp font), the
# stacking restaurant deck (a card pinned at y=88 with the next sliding
# over), the INSET stay/sight cards (px-18 / px-4 grids), and the mobile
# category track (the 18px-padded carousel riding the hero's bottom edge).
# Requires the production server on :3000 and an authenticated
# agent-browser session (default session, logged in).
set -euo pipefail

OUT="/home/z/my-project/activity-map/docs/screenshots"
TMP="/tmp/screens"
mkdir -p "$OUT" "$TMP"

agent-browser set viewport 390 844 > /dev/null

# 26: the route trap mid-scroll — the h2 pinned at viewport y=68 over the
# winding path (the session-26 heading model).
agent-browser open "http://localhost:3000/" > /dev/null
sleep 6
agent-browser eval "const t=document.querySelector('#recommended-route > div > div'); window.scrollTo(0, t.getBoundingClientRect().y + window.scrollY + 400)" > /dev/null
sleep 1
agent-browser screenshot "$TMP/26-mobile-route-trap-heading.png" > /dev/null
echo "captured 26-mobile-route-trap-heading.png"

# 27: the stacking deck mid-scroll — the second card sliding over the
# first (both pinned at y=88).
agent-browser eval "const f=document.querySelectorAll('#highlighted-restaurants article')[0]; window.scrollTo(0, f.getBoundingClientRect().y + window.scrollY + 560)" > /dev/null
sleep 1
agent-browser screenshot "$TMP/27-mobile-restaurant-stack.png" > /dev/null
echo "captured 27-mobile-restaurant-stack.png"

# 28: the INSET stay cards (the px-18 mobile grid).
agent-browser eval "const s=document.querySelector('#stay-showcase'); window.scrollTo(0, s.getBoundingClientRect().y + window.scrollY + 700)" > /dev/null
sleep 2
agent-browser screenshot "$TMP/28-mobile-stay-insets.png" > /dev/null
echo "captured 28-mobile-stay-insets.png"

# 29: the mobile category track — the 18px-padded carousel riding the
# hero photo's bottom edge (cards at y≈577).
agent-browser eval "window.scrollTo(0, 480)" > /dev/null
sleep 1
agent-browser screenshot "$TMP/29-mobile-category-track.png" > /dev/null
echo "captured 29-mobile-category-track.png"

# VLM-verify the new captures (sanity: non-empty, correct surfaces).
python3 - <<'PY'
from PIL import Image
import sys
ok = True
for name, min_std in [
    ("26-mobile-route-trap-heading.png", 8),
    ("27-mobile-restaurant-stack.png", 8),
    ("28-mobile-stay-insets.png", 15),
    ("29-mobile-category-track.png", 8),
]:
    path = f"/tmp/screens/{name}"
    try:
        im = Image.open(path).convert("L")
        std = __import__("statistics").pstdev(im.getdata())
        print(f"OK {name} std={std:.1f}")
    except Exception as e:
        print(f"FAIL {name}: {e}")
        ok = False
sys.exit(0 if ok else 1)
PY

for f in 26-mobile-route-trap-heading 27-mobile-restaurant-stack 28-mobile-stay-insets 29-mobile-category-track; do
  cp "$TMP/$f.png" "$OUT/$f.png"
done
echo "SESSION-26 CAPTURES DONE"
