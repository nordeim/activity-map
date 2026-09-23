import { expect, test } from "@playwright/test";

// Home (Highlights) content parity spec — pins the sections measured on the
// live reference app (session 2): the glass planner pill, the Recommended
// Route itinerary, the blue Highlighted Restaurants strip + featured card,
// the Choose Your Vibe stay showcase, the Highlighted Sights grid, the
// More Things to Do link, and the site footer. Contexts arrive
// AUTHENTICATED (setup-project storageState).

test.describe("home content parity (session 2)", () => {
  test("hero: serif wordmark over the photo, glass planner pill, no subtitle", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();

    // The live hero has NO subtitle paragraph — the planner follows the h1.
    await expect(page.getByText("Restaurants, boutique stays and slow-city experiences")).toHaveCount(0);

    // Glass planner pill segments (live aria-labels).
    await expect(page.getByLabel("Choose trip dates")).toBeVisible();
    await expect(page.getByLabel("Number of people")).toBeVisible();
    await expect(page.getByLabel("Type of Activities")).toBeVisible();
    await expect(page.getByLabel("Search trip matches")).toBeVisible();

    // The planner card title.
    await expect(page.getByText("Let's Plan Your Trip").first()).toBeVisible();
  });

  test("recommended route renders the five timed stops with Learn More", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Recommended Route" })).toBeVisible();
    await expect(page.getByText(/of your day planned/).first()).toBeVisible();

    for (const stop of ["Morning Coffee", "Lunch Break", "Afternoon Culture", "Sunset Drinks", "Dinner"]) {
      await expect(page.getByRole("heading", { name: stop, exact: true })).toBeVisible();
    }
    await expect(page.getByText("9:00 AM")).toBeVisible();
    await expect(page.getByText("Specialty Coffee Bar")).toBeVisible();

    // Route stop cards link to their place pages.
    await expect(page.getByRole("link", { name: /Learn More/ }).first()).toHaveAttribute(
      "href",
      /\/place\/home-route-/,
    );
  });

  test("highlighted restaurants: blue section, featured card, strip, View All", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Highlighted Restaurants" })).toBeVisible();

    // Featured card with rating + actions, and the restaurant strip.
    await expect(section.getByRole("heading", { name: "Volta", exact: true })).toBeVisible();
    await expect(section.getByRole("link", { name: /Book a Table/ })).toHaveAttribute(
      "href",
      /\/place\/home-restaurant-volta/,
    );
    await expect(section.getByRole("link", { name: /View All/ })).toHaveAttribute("href", "/eat");
  });

  test("choose your vibe: the twelve stay cards with Learn More + Book Now", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway/ }),
    ).toBeVisible();
    await expect(page.getByText("Pick a stay that matches your mood")).toBeVisible();

    const showcase = page.locator("#stay-showcase");
    await expect(showcase.getByRole("link", { name: /Learn More/ })).toHaveCount(12);
    await expect(showcase.getByRole("link", { name: /Book Now/ })).toHaveCount(12);
    await expect(showcase.getByText("Garden Suite")).toBeVisible();
    await expect(showcase.getByText("Maximilianstraße 44")).toBeVisible();
  });

  test("highlighted sights: six cards linking to home-sight place pages", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-sights");
    await expect(section.getByRole("heading", { name: "Highlighted Sights" })).toBeVisible();
    await expect(section.getByText("Six calm stops for a scenic Augsburg route")).toBeVisible();

    for (const sight of ["Fuggerei", "Rathausplatz", "Augsburg Cathedral", "Perlachturm", "Lech Canals", "Schaezlerpalais"]) {
      await expect(section.getByRole("heading", { name: sight, exact: true })).toBeVisible();
    }
    await expect(section.getByRole("link", { name: /Learn More/ }).first()).toHaveAttribute(
      "href",
      /\/place\/home-sight-/,
    );
  });

  test("route/sight home places resolve on their detail pages", async ({ page }) => {
    await page.goto("/place/home-sight-fuggerei");
    await expect(page.getByRole("heading", { name: "Fuggerei" })).toBeVisible();

    await page.goto("/place/home-route-specialty-coffee-bar");
    await expect(page.getByRole("heading", { name: "Specialty Coffee Bar" })).toBeVisible();
  });

  test("more things to do links to the Do browse; footer carries the legal line", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const more = page.getByRole("link", { name: /More Things to Do/ });
    await expect(more).toHaveAttribute("href", "/do");

    await expect(page.getByText("© 2026 Roam. Activity Map for Augsburg.")).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy policy" })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Accessibility Statement" })).toBeVisible();
  });

  test("browses stay unpolluted: 12 stays, 12 eats, 18 dos", async ({ page }) => {
    await page.goto("/stay");
    await expect(page.locator('a[href^="/place/"]')).toHaveCount(12);
    await page.goto("/eat");
    await expect(page.locator('a[href^="/place/"]')).toHaveCount(12);
    await page.goto("/do");
    await expect(page.locator('a[href^="/place/"]')).toHaveCount(18);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "12 Places to Eat" })).toBeVisible(); // home card count unchanged
    await expect(page.getByRole("heading", { name: "18 Sights to Discover" })).toBeVisible();
  });
});
