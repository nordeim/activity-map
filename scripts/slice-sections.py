#!/usr/bin/env python3
"""Slice live + clone desktop home captures into comparable section strips."""
from PIL import Image
import os

LIVE = "/home/z/my-project/live-capture/live-desktop-home.png"
CLONE = "/home/z/my-project/live-capture/clone-desktop-home.png"
OUT = "/home/z/my-project/live-capture/sections"
os.makedirs(OUT, exist_ok=True)

# Section boundaries measured from the DOM audits (absolute page y).
live_bounds = [
    ("hero", 0, 960),
    ("route", 960, 4080),
    ("restaurants", 4080, 8220),
    ("stays", 8220, 10980),
    ("sights", 10980, 12180),
    ("footer", 12180, 12460),
]
clone_bounds = [
    ("hero", 0, 860),
    ("route", 860, 3370),
    ("restaurants", 3370, 4320),
    ("stays", 4320, 6670),
    ("sights", 6670, 7920),
    ("footer", 7920, 8017),
]

def slice_img(path, bounds, prefix, target_h=1400):
    img = Image.open(path)
    w, h = img.size
    for name, y0, y1 in bounds:
        y1 = min(y1, h)
        if y1 <= y0:
            continue
        crop = img.crop((0, y0, w, y1))
        # downscale tall strips for VLM readability
        if crop.height > target_h:
            scale = target_h / crop.height
            crop = crop.resize((int(w * scale), target_h), Image.LANCZOS)
        out = f"{OUT}/{prefix}-{name}.png"
        crop.save(out)
        print(f"{out} {crop.size}")

slice_img(LIVE, live_bounds, "live")
slice_img(CLONE, clone_bounds, "clone")
print("done")
