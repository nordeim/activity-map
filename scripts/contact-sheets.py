#!/usr/bin/env python3
"""Build contact sheets from strip captures."""
from PIL import Image, ImageDraw
import glob, re, os

def contact_sheet(pattern, out, cols=4, thumb_w=400):
    files = sorted(glob.glob(pattern))
    if not files:
        print("no files for", pattern)
        return
    thumbs = []
    for f in files:
        img = Image.open(f)
        ratio = thumb_w / img.width
        t = img.resize((thumb_w, int(img.height * ratio)), Image.LANCZOS)
        d = ImageDraw.Draw(t)
        m = re.search(r"(\d+)\.png$", f)
        label = m.group(1) if m else "?"
        d.rectangle([0, 0, 34, 22], fill="black")
        d.text((8, 5), label, fill="white")
        thumbs.append(t)
    th = thumbs[0].height
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb_w, rows * th), "white")
    for i, t in enumerate(thumbs):
        sheet.paste(t, ((i % cols) * thumb_w, (i // cols) * th))
    sheet.save(out)
    print(out, sheet.size, len(thumbs), "thumbs")

contact_sheet("/home/z/my-project/live-capture/desktop-strips/live-*.png",
              "/home/z/my-project/live-capture/live-sheet.png")
contact_sheet("/home/z/my-project/live-capture/desktop-strips/clone-*.png",
              "/home/z/my-project/live-capture/clone-sheet.png")
