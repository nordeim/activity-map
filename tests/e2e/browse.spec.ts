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

  test("the planner submits to the map with its parameters", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Number of people").selectOption("3");
    await page.getByLabel("Type of Activities").selectOption("stay");
    await page.getByLabel("Search trip matches").click();
    await expect(page).toHaveURL(/\/map\?/);
    await expect(page).toHaveURL(/guests=3/);
    await expect(page).toHaveURL(/category=stay/);
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

  test("search narrows the eat grid", async ({ page }) => {
    await page.goto("/eat");
    await page.getByLabel("Search places").fill("moss");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.locator("article").first()).toContainText("Moss & Marble");
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
  test("renders the measured Courtyard Stay page with the booking card", async ({ page }) => {
    await page.goto("/place/courtyard-stay");
    await expect(page.getByText("Stay", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Courtyard Stay" })).toBeVisible();
    await expect(page.getByText("Dom Viertel 14")).toBeVisible();
    await expect(page.getByText("4.8", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Check Availability" })).toBeVisible();
    await expect(page.getByText("You won't be charged yet")).toBeVisible();
  });

  test("booking records a reservation visible on the profile", async ({ page }) => {
    await page.goto("/place/courtyard-stay");
    await page.getByRole("button", { name: "Check Availability" }).click();
    await expect(page.getByText(/Reserved/)).toBeVisible({ timeout: 15_000 });

    await page.goto("/profile");
    await page.getByRole("tab", { name: "My bookings" }).click();
    await expect(page.getByText("Courtyard Stay")).toBeVisible();
  });
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

    // All 42 places plot as dot markers.
    await expect(page.locator(".roam-marker")).toHaveCount(42);
    await expect(page.getByText("0 events · 42 places")).toBeVisible();

    // The Hotels pill narrows the canvas.
    await page.getByRole("button", { name: "Hotels", exact: true }).click();
    await expect(page.locator(".roam-marker")).toHaveCount(12);
    await expect(page.getByText("0 events · 12 places")).toBeVisible();
  });
});

test.describe("profile", () => {
  test("renders the identity card, tabs and the trips surfaces", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "sepnetflix2023" })).toBeVisible();
    await expect(page.getByText("sepnetflix2023@outlook.com")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Trips" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "My bookings" })).toBeVisible();
    // Either the empty-upcoming state or an earlier test's reservation —
    // both prove the section renders.
    await expect(
      page.getByText("No upcoming reservations. Time to explore.").or(page.getByText("Upcoming (")).first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });
});
