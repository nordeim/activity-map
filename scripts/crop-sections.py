#!/usr/bin/env python3
"""Crop section captures (11-14) from the full-page home screenshot
using DOM-harvested bounding rects, then validate every screenshot."""
import json
import os
from PIL import Image

BASE = "/home/z/my-project/activity-map"
OUT = f"{BASE}/docs/screenshots"
TMP = "/tmp/screens-v2"

# rect json is written as a JSON-encoded string (agent-browser eval prints
# the expression result, which is itself a JSON string)
raw = open(f"{TMP}/rects.json").read().strip()
if raw.startswith('"') and raw.endswith('"'):
    raw = json.loads(raw)  # unescape the outer string
rects = json.loads(raw)
print("rects:", rects)

mapping = {
    "#recommended-route": "11-home-route.png",
    "#highlighted-restaurants": "12-home-restaurants.png",
    "#stay-showcase": "13-home-stays.png",
    "#highlighted-sights": "14-home-sights.png",
}

full = Image.open(f"{TMP}/home-full.png")
print("full-page:", full.size)

for r in rects:
    name = mapping.get(r.get("s"))
    if not name or r.get("missing"):
        print("skip:", r)
        continue
    top, h = r["top"], r["h"]
    # clamp to the captured image
    bottom = min(top + h, full.size[1])
    top = max(0, top)
    crop = full.crop((0, top, full.size[0], bottom))
    crop.save(f"{OUT}/{name}", optimize=True)
    print(f"cropped {name}: {crop.size[0]}x{crop.size[1]} from y={top}+{h}")

# ---- validation pass ----
print("\n--- validation ---")
ok = True
for f in sorted(os.listdir(OUT)):
    if not f.endswith(".png"):
        continue
    img = Image.open(os.path.join(OUT, f))
    g = img.convert("L").resize((64, 64))
    px = list(g.getdata())
    mean = sum(px) / len(px)
    var = sum((p - mean) ** 2 for p in px) / len(px)
    flag = "OK " if var > 100 else ("LOW" if var > 10 else "BLANK")
    if var <= 10:
        ok = False
    print(f"{flag} {f}: {img.size[0]}x{img.size[1]} var={var:.0f}")
print("\nALL OK" if ok else "\nWARNINGS PRESENT")
