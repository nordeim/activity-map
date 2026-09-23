import { expect, test } from "@playwright/test";

// Mobile navigation (390×844 — the reference app's mobile chrome):
// the full-width top bar with the compact text-only view links, the
// right-cluster icon actions (map pin / heart / user), and the active
// link's light-gray pill. This is the highest-regression-risk chrome —
// the original scaffold's Tailwind v4 validation found that class-based
// responsive utilities can silently push nav links UNDER neighbouring
// flex clusters (failure class D) or off-screen (class C). These specs
// pin: one-line layout, no element overlap, tap-to-navigate on every
// link, and the active-pill state tracking the route.
// Contexts arrive AUTHENTICATED (setup-project storageState).

// A touch-enabled 390×844 chromium context (the iPhone geometry without
// switching browsers — locator.tap needs hasTouch).
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    // domcontentloaded: the home page pulls ~35 card images from the
    // reference CDN; waiting for the full "load" event has hit spurious
    // 45s timeouts under network contention. The nav assertions below
    // auto-wait for hydration anyway.
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("the full-width top bar renders every element on one line", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();

    // Wordmark + the four text links + the three icon actions.
    await expect(nav.getByRole("link", { name: "ROAM home" })).toBeVisible();
    for (const label of ["Highlights", "Eat", "Stay", "Do"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    for (const label of ["Map", "Favourites", "Profile"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    // The bar must not overflow the 390px viewport (failure class C/E).
    const barBox = await nav.boundingBox();
    expect(barBox).not.toBeNull();
    expect(barBox!.x).toBeGreaterThanOrEqual(0);
    expect(barBox!.x + barBox!.width).toBeLessThanOrEqual(391);
  });

  test("no nav element is covered by a neighbour (failure class D)", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    const links = nav.getByRole("link");
    const boxes = await links.evaluateAll((els) =>
      els
        .filter((el) => el instanceof HTMLElement && el.offsetParent !== null)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { text: (el as HTMLElement).innerText || el.getAttribute("aria-label") || "", left: r.left, right: r.right };
        }),
    );
    expect(boxes.length).toBeGreaterThanOrEqual(7);
    // Pairwise: visible links must not horizontally overlap each other.
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        expect(Math.max(0, ix), `"${a.text}" overlaps "${b.text}" by ${ix}px`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("the ACTIVE link carries the light-gray pill", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    const highlights = nav.getByRole("link", { name: "Highlights", exact: true });
    await expect(highlights).toHaveCSS("background-color", "rgb(243, 244, 246)");
    await expect(highlights).toHaveAttribute("aria-current", "page");

    // Inactive links render transparent.
    const eat = nav.getByRole("link", { name: "Eat", exact: true });
    await expect(eat).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(eat).not.toHaveAttribute("aria-current", "page");
  });

  test("view-link taps switch routes and move the pill", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Eat", exact: true }).tap();
    await expect(page).toHaveURL(/\/eat\/?$/);
    await expect(page.getByRole("heading", { name: "Eat Well Tonight" })).toBeVisible();
    const eat = nav.getByRole("link", { name: "Eat", exact: true });
    await expect(eat).toHaveCSS("background-color", "rgb(243, 244, 246)");

    // Highlights lost the pill.
    const home = nav.getByRole("link", { name: "Highlights", exact: true });
    await expect(home).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("the right-cluster icon actions navigate", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Map", exact: true }).tap();
    await expect(page).toHaveURL(/\/map\/?$/);
    await expect(page.getByRole("heading", { name: "Map", exact: true })).toBeVisible();

    await nav.getByRole("link", { name: "Favourites", exact: true }).tap();
    await expect(page).toHaveURL(/\/favourites\/?$/);
    await expect(page.getByRole("heading", { name: "Favourites", exact: true })).toBeVisible();

    await nav.getByRole("link", { name: "Profile", exact: true }).tap();
    await expect(page).toHaveURL(/\/profile\/?$/);
  });

  test("the hero planner fits the 390px canvas", async ({ page }) => {
    const heading = page.getByRole("heading", { name: "Augsburg City Guide" });
    await expect(heading).toBeVisible();
    const box = await heading.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(8);
    expect(box!.x + box!.width).toBeLessThanOrEqual(382);
  });
});

test.describe("middle state (640) navigation", () => {
  test.use({ viewport: { width: 640, height: 844 } });

  test("the floating pill carries the five view links with icons", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    for (const label of ["Highlights", "Eat", "Stay", "Do", "Map"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    // The pill is centered and narrower than the viewport.
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThan(640);
    expect(box!.x).toBeGreaterThan(4);
  });
});

test.describe("desktop (1280) navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the floating pill renders the full chrome with the avatar chip", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    for (const label of ["Highlights", "Eat", "Stay", "Do", "Map", "Favourites", "Profile"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    // The avatar chip renders the user's initial on a black disc.
    const avatar = nav.getByRole("link", { name: "Profile", exact: true });
    await expect(avatar).toHaveText("S");
    await expect(avatar).toHaveCSS("background-color", "rgb(26, 26, 26)");
  });
});
