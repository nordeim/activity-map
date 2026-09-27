#!/usr/bin/env bash
# Session 25 screenshot additions — the remediated surfaces: the login card
# (14px inputs + the one-button signup row), the desktop category cards
# (the 32×32 cells / 24px header / 14px gap / the low-hanging View All),
# the new legal pages, and the max-w-xl favourites empty state.
# Requires the production server on :3000 and an authenticated
# agent-browser session (default session, logged in).
set -euo pipefail

OUT="/home/z/my-project/activity-map/docs/screenshots"
TMP="/tmp/screens"
mkdir -p "$OUT" "$TMP"

# 21: the desktop category-cards area (scroll to the hero bottom edge)
agent-browser set viewport 1280 800 > /dev/null
agent-browser open "http://localhost:3000/" > /dev/null
sleep 6
agent-browser eval "window.scrollTo(0, 300)" > /dev/null
sleep 1
agent-browser screenshot "$TMP/21-desktop-category-cards.png" > /dev/null
echo "captured 21-desktop-category-cards.png"

# 22: the login card (logged-out — clear the session cookie)
agent-browser cookies clear > /dev/null
agent-browser open "http://localhost:3000/login" > /dev/null
sleep 3
agent-browser screenshot "$TMP/22-login-card.png" > /dev/null
echo "captured 22-login-card.png"

# 23-24: the new legal pages (public, no chrome)
agent-browser open "http://localhost:3000/privacy-policy" > /dev/null
sleep 2
agent-browser screenshot "$TMP/23-privacy-policy.png" > /dev/null
echo "captured 23-privacy-policy.png"

agent-browser open "http://localhost:3000/accessibility-statement" > /dev/null
sleep 2
agent-browser screenshot "$TMP/24-accessibility-statement.png" > /dev/null
echo "captured 24-accessibility-statement.png"

# 25: the favourites empty state (max-w-xl, fresh seed = 0 favourites).
# Re-authenticate first (the cookie was cleared for the login capture).
agent-browser open "http://localhost:3000/login" > /dev/null
sleep 2
agent-browser find label "Email" fill "sepnetflix2023@outlook.com" > /dev/null
agent-browser find label "Password" fill '$Abcd1234' > /dev/null
agent-browser find text "Sign in" click > /dev/null || true
sleep 4
agent-browser open "http://localhost:3000/favourites" > /dev/null
sleep 3
agent-browser screenshot "$TMP/25-favourites-empty.png" > /dev/null
echo "captured 25-favourites-empty.png"

echo "SESSION-25 CAPTURES DONE"
