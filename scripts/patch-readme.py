#!/usr/bin/env python3
"""Patch README.md for the session-2 remediation (unicode-safe edits)."""

path = "README.md"
src = open(path, encoding="utf-8").read()

lines = src.split("\n")
out = []
for line in lines:
    if "Home: hero + trip planner + category cards" in line:
        line = line.replace(
            "Home: hero + trip planner + category cards",
            "Home: hero + planner + category cards + Recommended Route",
        )
        out.append(line)
        out.append("                             + blue restaurants + stay showcase + sights + footer")
        continue
    if "login/            \u2190 Real login route (public)" in line:
        out.append(line)
        out.append(" \U0001f4c3 privacy/ accessibility/ \u2190 Public legal pages (the footer's measured links)")
        continue
    if "Navbar, Hero, CategoryExplorer, PlaceCard, BookingForm," in line:
        out.append("\U0001f4c2 components/         \u2190 Navbar + SiteFooter + LegalPage, Hero, CategoryCards,")
        continue
    if "MapExplorer + LeafletCanvas, FavouritesView, ProfileView, LoginForm" in line:
        out.append("                          RecommendedRoute, HighlightedRestaurants, StayShowcase,")
        out.append("                          HighlightedSights, CategoryExplorer, PlaceCard, BookingForm,")
        out.append("                          MapExplorer + LeafletCanvas, FavouritesView, ProfileView, LoginForm")
        continue
    if "auth, db, db-path, filters, places, rate-limit, utils" in line:
        line = line.replace("places, rate-limit, utils (pure seams)", "places (incl. listHomePlaces), rate-limit, utils")
        out.append(line)
        continue
    if "schema.prisma, seed.ts, data/{eat,stay,do}.json" in line:
        out.append("\U0001f4c2 prisma/                \u2190 schema.prisma, seed.ts, data/{eat,stay,do,home}.json")
        out.append("                              (captured entities + the home-only showcase rows)")
        continue
    if "e2e/ (Playwright: auth, browse, mobile-nav)" in line:
        line = line.replace("auth, browse, mobile-nav", "auth, browse, home parity, mobile-nav")
        out.append(line)
        continue
    if "DEPLOYMENT.md, Tailwind-V4-Validation-Report.md, screenshots/, SSH push runbook" in line:
        out.append("\U0001f4c2 docs/                  \u2190 DEPLOYMENT.md, remediation-plan.md, Tailwind-V4-Validation-Report.md,")
        out.append("                              screenshots/ (14 captures), SSH push runbook")
        continue
    if "the Highlights page renders the Augsburg hero, the planner, and the three category cards." in line:
        line = line.replace(
            "the Highlights page renders the Augsburg hero, the planner, and the three category cards.",
            "the Highlights page renders the traveller-photo hero, the glass planner, the category cards, and the full home showcase (route, restaurants, stays, sights).",
        )
        out.append(line)
        continue
    if "| E2E | `bun run build && bun run test:e2e` | 27 |" in line:
        line = line.replace("| 27 |", "| 35 |")
        out.append(line)
        continue
    out.append(line)

src = "\n".join(out)

src = src.replace(
    "Typography: **Playfair Display** (serif display \u2014 hero wordmark, view headlines) + **Inter** (UI sans), both via `next/font`/Google Fonts.",
    "Typography: **Libre Baskerville** (serif display \u2014 the live app's every h1/h2, measured session 2) + **Inter** (UI sans) + **Poppins** (nav links), all via Google Fonts.",
)

src = src.replace(
    "| Documentation | \u2705 Complete | AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md, 10 screenshots |",
    "| Documentation | \u2705 Complete | AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md, 14 screenshots |\n| Session 2 remediation | \u2705 Complete | Live-app parity pass \u2014 fonts/logo/hero, home showcase (route, blue restaurants, stays, sights, footer, legal pages), env pinning; gates re-verified (32 unit \u00b7 27 smoke \u00b7 35 E2E) |",
)

open(path, "w", encoding="utf-8").write(src)
print("README patched")
