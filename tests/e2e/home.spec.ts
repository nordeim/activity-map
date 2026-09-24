import { expect, test } from "@playwright/test";

// Home (Highlights) content parity spec — pins the sections measured on the
// live reference app (session 2): the glass planner pill, the Recommended
// Route itinerary, the blue Highlighted Restaurants strip + featured card,
// the Choose Your Vibe stay showcase, the Highlighted Sights grid, the
// More Things to Do link, and the site footer. Contexts arrive
// AUTHENTICATED (setup-project storageState).

test.describe("home content parity (session 2)", () => {
  test("hero: serif wordmark over the photo, white planner card, no subtitle", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();

    // The live hero has NO subtitle paragraph — the planner follows the h1.
    await expect(page.getByText("Restaurants, boutique stays and slow-city experiences")).toHaveCount(0);

    // Planner card segments (live aria-labels — unchanged by the redesign).
    await expect(page.getByLabel("Choose trip dates")).toBeVisible();
    await expect(page.getByLabel("Number of people")).toBeVisible();
    await expect(page.getByLabel("Type of Activities")).toBeVisible();
    await expect(page.getByLabel("Search trip matches")).toBeVisible();

    // The planner card title.
    await expect(page.getByText("Let's Plan Your Trip").first()).toBeVisible();

    // Session-5 redesign: below md the hero planner is a near-opaque WHITE
    // elevated card (bg-white/95, radius 30, the big soft 0 16 34 shadow) —
    // no longer the frosted glass capsule (which still renders from md).
    // Tailwind v4 serializes bg-white/95 through color-mix() → computed
    // colors arrive as oklab(), so the card is pinned by its radius and its
    // distinctive rgba shadow, not a parsed background string.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const planner = page.locator(".trip-planner-card").first();
    await expect(planner).toHaveCSS("border-radius", "30px");
    const plannerShadow = await planner.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(plannerShadow).toContain("rgba(14, 14, 14, 0.16)");
  });

  test("desktop navbar is the floating pill (session-6 redesign)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();

    // The inner bar: white PILL — radius rounded-full (Tailwind v4 compiles
    // it to calc(infinity*1px) → Chrome serializes 33554432px, so assert the
    // numeric radius instead of the string), max-width 820, fully bordered,
    // softly shadowed, centered (NOT the old full-width bottom-bordered bar).
    const navRadius = await nav.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(navRadius).toBeGreaterThan(1000);
    await expect(nav).toHaveCSS("max-width", "820px");
    await expect(nav).toHaveCSS("border-bottom-color", "rgb(232, 230, 220)");
    await expect(nav).toHaveCSS("border-top-width", "1px");
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThan(100); // inset from the viewport edge
    expect(box!.x + box!.width).toBeLessThan(1180);

    // Link typography: 13px Inter — ACTIVE 700 ink, inactive #555550.
    const active = nav.getByRole("link", { name: "Highlights", exact: true });
    await expect(active.locator("span")).toHaveCSS("font-size", "13px");
    await expect(active.locator("span")).toHaveCSS("font-weight", "700");
    const inactive = nav.getByRole("link", { name: "Eat", exact: true });
    await expect(inactive.locator("span")).toHaveCSS("color", "rgb(85, 85, 80)");
  });

  test("category cards: mobile VIEW ALL is violet, desktop stays near-black", async ({ page }) => {
    // Mobile (390): the VIEW ALL pills are violet #571AFF, full card width.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const mobileViewAll = page.getByRole("link", { name: /View All/ }).first();
    await expect(mobileViewAll).toHaveCSS("background-color", "rgb(87, 26, 255)");
    const viewAllRadius = await mobileViewAll.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(viewAllRadius).toBeGreaterThan(1000);

    // Desktop (1280): the VIEW ALL pills stay near-black #141413.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const desktopViewAll = page.getByRole("link", { name: /View All/ }).first();
    await expect(desktopViewAll).toHaveCSS("background-color", "rgb(20, 20, 19)");
  });

  test("recommended route renders the five timed TEXT stops (session 8)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Recommended Route" })).toBeVisible();
    await expect(page.getByText(/of your day planned/).first()).toBeVisible();

    for (const stop of ["Morning Coffee", "Lunch Break", "Afternoon Culture", "Sunset Drinks", "Dinner"]) {
      await expect(page.getByRole("heading", { name: stop, exact: true })).toBeVisible();
    }
    await expect(page.getByText("9:00 AM")).toBeVisible();
    await expect(page.getByText("Specialty Coffee Bar")).toBeVisible();

    // Session-8 re-measure: the live route cards are TEXT-ONLY — the photos
    // are gone from the whole section (both breakpoints).
    const routeSection = page.locator("#recommended-route");
    await expect(routeSection.locator("img")).toHaveCount(0);

    // The stop titles render DARK serif on cream (rgb(20,20,19)), not the
    // old white-on-photo treatment.
    const stopTitle = page.getByRole("heading", { name: "Morning Coffee", exact: true });
    await expect(stopTitle).toHaveCSS("color", "rgb(20, 20, 19)");

    // The time pill is a WHITE pill (radius 999).
    const timePill = page.locator("[data-stop-time='9:00 AM']");
    await expect(timePill).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const timeRadius = await timePill.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(timeRadius).toBeGreaterThan(1000);

    // Route stop cards link to their place pages.
    await expect(page.getByRole("link", { name: /Learn More/ }).first()).toHaveAttribute(
      "href",
      /\/place\/home-route-/,
    );

    // The Learn More pill is BLACK full-width (h-11) — the pill is a span
    // inside the white info-card link, so assert the pill element itself.
    const learnMore = routeSection.locator("[data-learn-more]").first();
    await expect(learnMore).toHaveCSS("background-color", "rgb(14, 14, 14)");
    const learnMoreH = await learnMore.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(learnMoreH)).toBe(44);

    // Session-8 swap: at desktop the right panel pins EARLY and swaps ONE
    // card at a time across the long trap — scrolling deep moves the active
    // card past Morning Coffee (its absolute siblings stay opacity-0 until
    // their turn).
    await page.setViewportSize({ width: 1280, height: 800 });
    const trap = page.locator("#recommended-route > div");
    await trap.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 2600);
    await page.waitForTimeout(700);
    const visibleStop = page.locator('#recommended-route article[data-active="true"] h3');
    await expect(visibleStop).not.toHaveText("Morning Coffee", { timeout: 8000 });
  });

  test("highlighted restaurants: blue section, glass detail card, View All (session-6 carousel)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Highlighted Restaurants" })).toBeVisible();

    // The frosted-glass detail card with the ACTIVE restaurant (Volta at
    // rest) + its actions, and the white View All pill.
    await expect(section.getByRole("heading", { name: "Volta", exact: true })).toBeVisible();
    await expect(section.getByRole("link", { name: /Book a Table/ })).toHaveAttribute(
      "href",
      /\/place\/home-restaurant-volta/,
    );
    await expect(section.getByRole("link", { name: /View All/ })).toHaveAttribute("href", "/eat");

    // The name watermark: the active name renders solid white; the rest
    // faint. (.first(): the hidden mobile deck repeats names in its h3s.)
    const watermark = section.getByText("Garbo", { exact: true }).first();
    await expect(watermark).toBeVisible();
  });

  test("highlighted restaurants: the mobile card deck is SIX cards (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    // The deck: browse-style cards stacked sticky over each other — the live
    // app reduced it from 16 to the first SIX restaurants (session 8).
    const deck = section.locator("article");
    await expect(deck).toHaveCount(6, { timeout: 15_000 });
    const first = deck.first();
    await expect(first.getByRole("heading", { name: "Volta", exact: true })).toBeVisible();
    // The sixth deck card is Ember (the live's last deck card).
    await expect(deck.nth(5).getByRole("heading", { name: "Ember", exact: true })).toBeVisible();
    // No desktop View All on the mobile deck (live parity).
    await expect(section.getByRole("link", { name: /View All/ })).toHaveCount(0);
  });

  test("choose your vibe heading splits into per-letter reveal spans (session 8)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const h2 = page.getByRole("heading", {
      name: /Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway/,
    });
    await expect(h2).toBeVisible();
    // The live heading renders one span per letter (64 for this string) and
    // animates their colors cream → ink with scroll position.
    const letters = h2.locator("span[data-letter]");
    const count = await letters.count();
    expect(count).toBeGreaterThanOrEqual(50);
  });

  test("stay + sight card titles render 24px on mobile, 18px on desktop (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const stayTitle = page.locator("#stay-showcase article h3").first();
    await expect(stayTitle).toHaveCSS("font-size", "24px");
    const sightTitle = page.locator("#highlighted-sights article h3").first();
    await expect(sightTitle).toHaveCSS("font-size", "24px");

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const stayTitleDesktop = page.locator("#stay-showcase article h3").first();
    await expect(stayTitleDesktop).toHaveCSS("font-size", "18px");
    const sightTitleDesktop = page.locator("#highlighted-sights article h3").first();
    await expect(sightTitleDesktop).toHaveCSS("font-size", "18px");
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

  test("more things to do is a DARK pill linking to the Do browse; footer carries the legal line", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const more = page.getByRole("link", { name: /More Things to Do/ });
    await expect(more).toHaveAttribute("href", "/do");
    // Session-8 re-measure: the live hand-off is a DARK pill (rgb(17,17,17)
    // bg, white text, radius 999) — no border, no white bg.
    await expect(more).toHaveCSS("background-color", "rgb(17, 17, 17)");
    await expect(more).toHaveCSS("color", "rgb(255, 255, 255)");

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
