#!/usr/bin/env bash
# Session 23 screenshot addendum — footer-specific captures: the remediated
# glass pill (desktop + mobile) and the page-bottom hand-off zones.
# Requires the dev server on :3000 and an authenticated agent-browser session.
# NOTE: scrollIntoView rides the app's smooth-scroll — use instant scrollTo
# and VERIFY the footer rect before capturing (session-23 lesson).
set -euo pipefail

OUT="/home/z/my-project/activity-map/docs/screenshots"
mkdir -p "$OUT"

capture_footer() { # url outfile vp_w vp_h mode(end|center)
  agent-browser set viewport "$2" "$3" > /dev/null
  agent-browser open "http://localhost:3000$1" > /dev/null
  sleep 5
  agent-browser eval "window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'})" > /dev/null
  sleep 1
  agent-browser eval "(() => { const f = document.querySelector('footer'); if ('$4' === 'center') { const r = f.getBoundingClientRect(); window.scrollBy({top: r.top + r.height/2 - window.innerHeight/2, behavior: 'instant'}); } return JSON.stringify({footerTopInVp: Math.round(f.getBoundingClientRect().top), footerH: Math.round(f.getBoundingClientRect().height)}); })()" > /dev/null
  sleep 1
  agent-browser screenshot "$OUT/$5" > /dev/null
  echo "captured $5"
}

# 15: desktop footer (1280x800, scrolled to page end)
capture_footer "/" 1280 800 end 15-desktop-footer.png

# 16: mobile footer (390x844, scrolled to page end)
capture_footer "/" 390 844 end 16-mobile-footer.png

# 17: desktop sights-pill -> footer hand-off (footer centered)
capture_footer "/" 1280 800 center 17-desktop-sights-footer-handoff.png

echo "FOOTER CAPTURES DONE"
