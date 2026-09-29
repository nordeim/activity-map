import { expect, test } from "@playwright/test";

// Chromium 153 serializes slate colors as lab()/oklab() — even through a
// canvas fillStyle. The per-assertion evaluates below sample the actual
// painted PIXEL instead (getImageData always yields sRGB channels; ±1 per
// channel from the lab→sRGB rounding) — the sampling must be INLINED
// because locator.evaluate stringifies the callback into the page context.
function expectCloseToSlate(received: string, r: number, g: number, b: number) {
  // ±2 per channel: the lab→sRGB canvas round-trip rounds slightly (a
  // wrong slate step is off by 30+ channels, far outside this band).
  const m = received.match(/rgb\((\d+), (\d+), (\d+)\)/);
  expect(m).not.toBeNull();
  expect(Math.abs(Number(m![1]) - r)).toBeLessThanOrEqual(2);
  expect(Math.abs(Number(m![2]) - g)).toBeLessThanOrEqual(2);
  expect(Math.abs(Number(m![3]) - b)).toBeLessThanOrEqual(2);
}

// The 404 surfaces (session-30): two DIFFERENT designs on the live —
//
// 1. the PLACE 404 (an invalid place slug) renders INSIDE the app chrome
//    (navbar + footer present): a centered "Place not found" serif h1 at
//    46px ink on cream + a 44px ink "Back to Do" pill → /do.
// 2. the GENERIC unknown-route 404 renders the platform's chrome-less
//    slate design: a 72px font-light slate-300 "404", a 64×2 slate-200
//    divider, "Page Not Found" at 24px, the quoted attempted path, and a
//    white bordered "Go Home" button → /.
//
// The clone previously rendered its custom cream "Off the map" page for
// both. These tests pin the live's two designs.

test.describe("not-found surfaces (session-30)", () => {
  test("an invalid place slug renders the in-app place 404 with chrome", async ({ page }) => {
    const response = await page.goto("/place/no-such-place-xyz");
    expect(response?.status()).toBe(404);

    // The h1: "Place not found" — 46px Libre Baskerville ink on cream.
    const h1 = page.getByRole("heading", { name: "Place not found", exact: true });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCSS("font-size", "46px");
    await expect(h1).toHaveCSS("color", "rgb(14, 14, 14)");
    const serif = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(serif).toContain("Libre Baskerville");

    // The Back to Do pill: 44px tall, ink bg, white text, href /do.
    const back = page.getByRole("link", { name: "Back to Do", exact: true });
    await expect(back).toBeVisible();
    const backBox = await back.boundingBox();
    expect(backBox).not.toBeNull();
    expect(Math.round(backBox!.height)).toBe(44);
    await expect(back).toHaveCSS("background-color", "rgb(14, 14, 14)");
    await expect(back).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(back).toHaveAttribute("href", "/do");

    // The page renders INSIDE the app chrome (session-30: the live's
    // place 404 carries the navbar + the footer).
    await expect(page.locator("header nav")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("an unknown route renders the platform slate 404 chrome-less", async ({ page }) => {
    const response = await page.goto("/no-such-route-xyz");
    expect(response?.status()).toBe(404);

    // The h1 "404": 72px font-light slate-300. (Computed colors can
    // serialize as lab()/oklab() in this Chromium — normalize through a
    // canvas fillStyle, the session-29 computed-style lesson.)
    const h1 = page.getByRole("heading", { name: "404", exact: true });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCSS("font-size", "72px");
    await expect(h1).toHaveCSS("font-weight", "300");
    const h1Color = await h1.evaluate((el) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    });
    expectCloseToSlate(h1Color, 203, 213, 225); // slate-300

    // The divider: 64px wide, 2px tall, slate-200.
    const divider = page.locator("div.h-0\\.5");
    await expect(divider).toBeVisible();
    const dividerBox = await divider.boundingBox();
    expect(dividerBox).not.toBeNull();
    expect(Math.round(dividerBox!.width)).toBe(64);
    expect(Math.round(dividerBox!.height)).toBe(2);
    const dividerColor = await divider.evaluate((el) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    });
    expectCloseToSlate(dividerColor, 226, 232, 240); // slate-200

    // "Page Not Found" at 24px font-medium slate-800.
    const h2 = page.getByRole("heading", { name: "Page Not Found", exact: true });
    await expect(h2).toBeVisible();
    await expect(h2).toHaveCSS("font-size", "24px");
    const h2Color = await h2.evaluate((el) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    });
    expectCloseToSlate(h2Color, 30, 41, 59); // slate-800

    // The para quotes the attempted path.
    await expect(
      page.getByText(/no-such-route-xyz.*could not be found/),
    ).toBeVisible();

    // Go Home → /.
    const goHome = page.getByRole("link", { name: "Go Home", exact: true });
    await expect(goHome).toBeVisible();
    await expect(goHome).toHaveAttribute("href", "/");

    // Chrome-less: no navbar, no footer (the platform page).
    await expect(page.locator("header nav")).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);

    // Go Home navigates.
    await goHome.click();
    await page.waitForURL("**/");
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();
  });

  test("the generic 404 hydrates without console errors (session 31)", async ({ page }) => {
    // Session-31 finding: the not-found page's usePathname() rendered
    // "_not-found" (the static-prerender route) on the server but the
    // real path on the client — a React #418 hydration text mismatch on
    // EVERY unknown-route visit (a console error + a full client
    // re-render). The fix mount-gates the pathname; this spec pins ZERO
    // console/page errors on the visit.
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const response = await page.goto("/no-such-route-hydration-check", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);

    // The quoted path still fills in (after mount — auto-retry covers it).
    await expect(
      page.getByText(/no-such-route-hydration-check.*could not be found/),
    ).toBeVisible();

    // Give any lazy hydration error a beat to surface, then assert clean.
    // (The browser's own "Failed to load resource: … 404" network log is
    // filtered — the page itself IS the 404 response; only REAL console
    // errors — React hydration/recoverable errors, image failures on
    // other codes — fail the assertion.)
    await page.waitForTimeout(600);
    expect(pageErrors).toEqual([]);
    const realConsoleErrors = consoleErrors.filter(
      (m) => !/^Failed to load resource: the server responded with a status of 404/.test(m),
    );
    expect(realConsoleErrors).toEqual([]);
  });
});
