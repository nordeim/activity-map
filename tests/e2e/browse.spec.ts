import { expect, test } from "@playwright/test";

// The city-guide surfaces end-to-end: the home hero + planner + category
// cards, the three browse views with search/filter chips, the place detail
// with booking, the favourites round-trip, and the map view with its
// filter pills and dot markers. Contexts arrive AUTHENTICATED
// (setup-project storageState).

test.describe("home (Highlights)", () => {
  test("hero, planner and the three category cards render", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();

    // The glass planner pill fields (live aria-labels; see home.spec.ts for
    // the full session-2 home content parity coverage).
    await expect(page.getByLabel("Choose trip dates")).toBeVisible();
    await expect(page.getByLabel("Number of people")).toBeVisible();
    await expect(page.getByLabel("Type of Activities")).toBeVisible();

    // The measured category cards with their counts and VIEW ALL buttons.
    await expect(page.getByRole("heading", { name: "12 Hotels" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "12 Places to Eat" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "18 Sights to Discover" })).toBeVisible();
    await expect(page.locator("#category-cards").getByRole("link", { name: /View All/ })).toHaveCount(3);
  });

  test("VIEW ALL navigates to the category view", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /View All/ }).first().click();
    await expect(page).toHaveURL(/\/stay\/?$/);
    await expect(page.getByRole("heading", { name: "Stay In Style" })).toBeVisible();
  });

  test("the planner submits to the category view with its parameters", async ({ page }) => {
    await page.goto("/");
    // Session 3 parity: Hotels → /stay?people=N (never the map).
    await page.getByLabel("Number of people").selectOption("3");
    await page.getByLabel("Type of Activities").selectOption("Hotels");
    await page.getByLabel("Search trip matches").click();
    await expect(page).toHaveURL(/\/stay\?people=3$/);
  });
});

test.describe("browse views", () => {
  for (const [path, title, cards, chip] of [
    ["/eat", "Eat Well Tonight", 12, "Open now"],
    ["/stay", "Stay In Style", 12, "Under €250"],
    ["/do", "Explore The City", 18, "All"],
  ] as const) {
    test(`${path} renders the headline, chips and ${cards} cards`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.locator("article")).toHaveCount(cards);
      // The measured filter chips are present (one per view).
      await expect(page.getByRole("button", { name: chip, exact: true })).toBeVisible();
    });
  }

  test("search narrows the eat grid (inside the unified planner card)", async ({ page }) => {
    await page.goto("/eat");
    await page.getByLabel("Search places").fill("moss");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.locator("article").first()).toContainText("Moss & Marble");
  });

  test("the browse planner is ONE unified card: search + labelled fields + icon buttons (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/eat");
    // The live browse planner: a single white card (radius 30) containing
    // the search input, the labelled date + people fields, and two circular
    // icon action buttons — no separate search row, no type selector.
    const card = page.locator(".browse-planner-card");
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("border-radius", "30px");
    const cardShadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(cardShadow).toContain("rgba(14, 14, 14, 0.1)");
    await expect(card.getByLabel("Search places")).toBeVisible();
    await expect(card.getByText("Let's Plan Your Trip").first()).toBeVisible();
    await expect(card.getByText("People", { exact: true }).first()).toBeVisible();
    // No type-of-activities field on the browse planner (live parity).
    await expect(card.getByLabel("Type of Activities")).toHaveCount(0);
    await expect(card.getByLabel("Open category filters")).toBeVisible();

    // Desktop: one sticky white PILL (radius 999, h-68) — search inline.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/eat");
    const pill = page.locator(".browse-planner-card");
    await expect(pill).toBeVisible();
    const pillRadius = await pill.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(pillRadius).toBeGreaterThan(1000);
    await expect(pill.getByLabel("Search places")).toBeVisible();
    await expect(pill.getByText("Let's Plan Your Trip").first()).toBeVisible();
  });

  test("the browse planner forwards its params back to the category view", async ({ page }) => {
    await page.goto("/eat");
    // The date/people fields auto-forward — choosing people re-routes to the
    // same browse with the params (the grid date-filters server-side).
    await page.getByLabel("Number of people").selectOption("4");
    await expect(page).toHaveURL(/\/eat\?people=4$/);
  });

  test("eat card photos render 300px on mobile, 372px on desktop (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/eat");
    const photo = page.locator("article img").first();
    const h = await photo.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(h)).toBe(300);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/eat");
    const photoDesktop = page.locator("article img").first();
    const hD = await photoDesktop.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(hD)).toBe(372);
  });

  test("filter chips narrow the grid AND compose", async ({ page }) => {
    await page.goto("/eat");
    await expect(page.locator("article")).toHaveCount(12);
    await page.getByRole("button", { name: "Romantic" }).click();
    const romantic = await page.locator("article").count();
    expect(romantic).toBeGreaterThan(0);
    expect(romantic).toBeLessThan(12);
    await page.getByRole("button", { name: "French" }).click();
    const both = await page.locator("article").count();
    expect(both).toBeLessThanOrEqual(romantic);
  });

  test("the do view's All chip resets the filters", async ({ page }) => {
    await page.goto("/do");
    await page.getByRole("button", { name: "Museums", exact: true }).click();
    const museums = await page.locator("article").count();
    expect(museums).toBeGreaterThan(0);
    expect(museums).toBeLessThan(18);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.locator("article")).toHaveCount(18);
  });
});

test.describe("place detail", () => {
  test("renders the measured Courtyard Stay page with the booking request form", async ({ page }) => {
    await page.goto("/place/courtyard-stay");
    await expect(page.getByText("Stay", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Courtyard Stay", exact: true })).toBeVisible();
    await expect(page.getByText("Dom Viertel 14")).toBeVisible();
    await expect(page.getByText("4.8", { exact: true }).first()).toBeVisible();
    // The live app's request form (session 3): About this place + the
    // Name/Surname/Dates/Time/Phone/Email/Message fields + violet Book Now.
    await expect(page.getByRole("heading", { name: "About this place" })).toBeVisible();
    // Session-8 re-measure: About this place is a FIXED 34px heading.
    await expect(page.getByRole("heading", { name: "About this place" })).toHaveCSS("font-size", "34px");
    await expect(page.getByText(/Send your booking request for Courtyard Stay/)).toBeVisible();
    for (const field of ["Name", "Surname", "Dates", "Time", "Phone", "Email", "Message"]) {
      await expect(page.getByLabel(field, { exact: false }).first()).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
  });

  test("photo overlays: the white rating pill on the photo, no Map button (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/place/courtyard-stay", { waitUntil: "domcontentloaded" });
    // The rating rides ON the photo as a white pill (top-right)…
    const ratingPill = page.locator("[data-photo-rating]");
    await expect(ratingPill).toBeVisible();
    await expect(ratingPill).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(ratingPill).toContainText("4.8");
    // …and the Map link is GONE from the photo (live parity). Scoped to
    // main: the navbar and footer carry their own Map links.
    await expect(page.locator("main").getByRole("link", { name: "Map", exact: true })).toHaveCount(0);
    // The mobile hero photo is 260px tall (desktop keeps 460px).
    const photo = page.locator("main img").first();
    const h = await photo.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(h)).toBe(260);
  });

  test("booking records a request visible on the profile", async ({ page }) => {
    await page.goto("/place/courtyard-stay");
    await page.getByLabel("Name", { exact: true }).fill("Ada");
    await page.getByLabel("Surname", { exact: true }).fill("Lovelace");
    await page.getByLabel("Dates", { exact: true }).fill("2026-10-01");
    await page.getByLabel("Time", { exact: true }).fill("19:00");
    await page.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await page.getByRole("button", { name: "Book Now" }).click();
    await expect(page.getByText(/Request sent/)).toBeVisible({ timeout: 15_000 });

    await page.goto("/profile");
    await expect(page.getByText("My bookings")).toBeVisible();
    await expect(page.getByText("Courtyard Stay")).toBeVisible();
  });
});

test.describe("footer on every app page (session 6)", () => {
  const PAGES = ["/eat", "/stay", "/do", "/map", "/favourites", "/profile", "/place/moss-marble"];
  for (const path of PAGES) {
    test(`footer renders on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();
      // The white icon-cell pill carries the six view links.
      await expect(footer.getByRole("navigation", { name: "Footer" })).toBeVisible();
      await expect(footer.getByRole("link", { name: "Favourites", exact: true })).toBeVisible();
      await expect(footer.getByText("© 2026 Roam. Activity Map for Augsburg.")).toBeVisible();
      await expect(footer.getByRole("link", { name: "Privacy policy" })).toBeVisible();
    });
  }
});

test.describe("favourites round-trip", () => {
  test("a heart tap saves a place; Favourites lists and clears it", async ({ page }) => {
    await page.goto("/eat");
    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: "Save to favourites" }).click();
    await expect(firstCard.getByRole("button", { name: "Remove from favourites" })).toBeVisible();

    // domcontentloaded: card imagery comes from the reference CDN — the
    // full "load" event can stall behind a slow image under network
    // contention and has caused spurious 45s timeouts.
    await page.goto("/favourites", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Favourites" })).toBeVisible();
    await expect(page.getByText("All saved restaurants, hotels, and places in one calm collection.")).toBeVisible();
    await expect(page.locator("article")).toHaveCount(1);

    await page.locator("article").first().getByRole("button", { name: "Remove from favourites" }).click();
    await expect(page.getByText("No favourites yet")).toBeVisible();
    await expect(page.getByText("Tap a heart on any restaurant, hotel, or place card to save it here.")).toBeVisible();
  });
});

test.describe("map view", () => {
  test("renders the headline, filter pills, dot markers and the status badge", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByRole("heading", { name: "Map", exact: true })).toBeVisible();
    await expect(page.getByText("Augsburg restaurants, hotels and experiences plotted across the old town.")).toBeVisible();
    for (const label of ["All Places", "Restaurants", "Hotels", "Sights"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }

    // Session-8 re-measure: the pills are 44px tall WITH icons — the ACTIVE
    // pill is violet-tinted (bg rgb(240,234,255), text rgb(87,26,255));
    // inactive = white + rgba(14,14,14,0.08) border.
    const activePill = page.getByRole("button", { name: "All Places", exact: true });
    await expect(activePill).toHaveCSS("background-color", "rgb(240, 234, 255)");
    await expect(activePill).toHaveCSS("color", "rgb(87, 26, 255)");
    await expect(activePill.locator("svg").first()).toBeVisible();
    const inactivePill = page.getByRole("button", { name: "Sights", exact: true });
    await expect(inactivePill).toHaveCSS("background-color", "rgb(255, 255, 255)");

    // The nine demo pins plot as dot markers (session 3 parity — the
    // browse entities never appear on the live map).
    await expect(page.locator(".roam-marker")).toHaveCount(9);
    await expect(page.getByText("9 places")).toBeVisible();
    await expect(page.getByText("Places on the map")).toBeVisible();

    // The Hotels pill narrows the canvas.
    await page.getByRole("button", { name: "Hotels", exact: true }).click();
    await expect(page.locator(".roam-marker")).toHaveCount(3);
    await expect(page.getByText("3 places")).toBeVisible();
  });
});

test.describe("profile", () => {
  test("renders the profile identity, booking tabs and the empty state", async ({ page }) => {
    await page.goto("/profile");
    // The live app's session-6 profile: PROFILE eyebrow + the USERNAME as
    // the h1 ("Explorer" is now the badge chip below), email, Augsburg.
    await expect(page.getByText("Profile", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "sepnetflix2023" })).toBeVisible();
    // Session-8 re-measure: the email sits directly under the username (the
    // "Your Roam account" prefix is gone).
    await expect(page.getByText("sepnetflix2023@outlook.com")).toBeVisible();
    await expect(page.getByText("Your Roam account")).toHaveCount(0);
    // Saved places is a DARK button linking to /favourites.
    const savedBtn = page.getByRole("link", { name: /Saved places/ });
    await expect(savedBtn).toHaveAttribute("href", "/favourites");
    await expect(savedBtn).toHaveCSS("background-color", "rgb(14, 14, 14)");
    await expect(page.getByText("My bookings")).toBeVisible();
    // Either the empty-upcoming state or an earlier test's reservation —
    // both prove the section renders. .first(): with zero bookings BOTH the
    // "Upcoming (0)" tab and the empty-state paragraph exist at once, and an
    // un-scoped .or() would trip strict mode on the pair.
    await expect(
      page.getByText("No upcoming reservations. Time to explore.").or(page.getByText("Upcoming (")).first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });

  test("profile category filters carry icons; a Back control exists (session 8)", async ({ page }) => {
    await page.goto("/profile");
    // The All/Eat/Stay/Do booking filter chips carry icons on the live app.
    const eatChip = page.getByRole("button", { name: "eat", exact: true });
    await expect(eatChip.locator("svg").first()).toBeVisible();
    // A Back control returns to the home page.
    const back = page.getByRole("link", { name: "Back to home" });
    await expect(back).toBeVisible();
  });
});
