#!/usr/bin/env python3
"""Session 4 screenshot finalization: crop the 11-14 section captures from
the full-page home capture and validate every image is non-blank."""
from PIL import Image
import json
import numpy as np
import shutil
import os

TMP = "/tmp/screens"
OUT = "/home/z/my-project/activity-map/docs/screenshots"

# 1. Crop sections 11-14 from the full-page home capture
rects = json.loads(json.load(open("/tmp/section-rects.json")))
full = Image.open(f"{TMP}/home-full.png")
page_h = rects["pageH"]
img_h = full.size[1]
# The full-page capture height may be shorter than scrollHeight (fixed
# viewport capture limitations) — scale rect tops proportionally if needed.
scale = img_h / page_h if img_h != page_h else 1.0

sections = {
    "11-home-route.png": "route",
    "12-home-restaurants.png": "restaurants",
    "13-home-stays.png": "stays",
    "14-home-sights.png": "sights",
}
for filename, key in sections.items():
    r = rects[key]
    top = int(r["top"] * scale)
    height = int(r["height"] * scale)
    crop = full.crop((0, top, full.size[0], min(top + height, img_h)))
    crop.save(f"{TMP}/{filename}")
    print(f"cropped {filename}: {crop.size}")

# 2. Validate: every image must be non-blank (variance check)
names = [
    "01-home-highlights.png", "02-eat.png", "03-stay.png", "04-do.png",
    "05-map.png", "06-place-detail.png", "07-favourites.png", "08-profile.png",
    "09-mobile-home.png", "10-mobile-eat.png",
    "11-home-route.png", "12-home-restaurants.png", "13-home-stays.png",
    "14-home-sights.png",
]
ok = True
for name in names:
    path = f"{TMP}/{name}"
    arr = np.asarray(Image.open(path).convert("L"))
    var = float(arr.std())
    status = "OK " if var > 8 else "BLANK?"
    if var <= 8:
        ok = False
    print(f"{status} {name:28s} size={Image.open(path).size} std={var:.1f}")

if not ok:
    raise SystemExit("BLANK captures detected — aborting before overwrite")

# 3. Move into docs/screenshots/ (overwrites the stale session-3 set)
for name in names:
    shutil.move(f"{TMP}/{name}", f"{OUT}/{name}")
print(f"\nAll 14 captures validated and moved to {OUT}")
