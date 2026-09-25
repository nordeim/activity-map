import { expect, test } from "@playwright/test";
import { DEMO_EMAIL, DEMO_PASSWORD } from "./helpers";

// Login surface: the /login route renders the auth card, rejects bad
// credentials, signs the demo user in, and honors authenticated visits.
// This file OPTS OUT of the shared storageState (empty cookies) because it
// tests the logged-out surface. (Deliberately does NOT probe the rate
// limiter — 10 attempts/IP/15 min would poison the whole suite; the
// limiter is covered by scripts/smoke-test.sh.)

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("login route", () => {
  test("renders the live-parity auth card (session-10 shadcn chrome)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Welcome to Activity Map" })).toBeVisible();
    await expect(page.getByText("Sign in to continue")).toBeVisible();

    // The hosted-platform chrome rendered for parity: the Google button,
    // the "or" divider chip, the forgot-password link, and the sign-up link —
    // each answers with an inline notice instead of navigating.
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    await expect(page.getByText("or", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Forgot password?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();

    // Session-10 re-measure: the card is the shadcn-style rounded-16 white
    // panel (radius 16px, white/95) — NOT the old rounded-28 card.
    const card = page.locator("div.rounded-2xl").first();
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("border-radius", "16px");

    // The circular logo image rides above the heading (80px below sm).
    const logo = page.getByRole("img", { name: /logo/i });
    await expect(logo).toBeVisible();

    // The heading uses the shadcn STOCK SYSTEM stack (the live's login card
    // does not apply its Inter — the h1 computes to ui-sans-serif/system-ui,
    // which is also why it wraps to two lines like the reference).
    const h1 = page.getByRole("heading", { name: "Welcome to Activity Map" });
    const h1Font = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(h1Font.toLowerCase()).not.toContain("baskerville");
    expect(h1Font.toLowerCase()).toContain("system-ui");

    // The inputs carry the Mail / Lock icons (lucide) inside their fields.
    const emailField = page.getByLabel("Email").locator("xpath=..");
    await expect(emailField.locator("svg")).toBeVisible();
    const passwordField = page.getByLabel("Password").locator("xpath=..");
    await expect(passwordField.locator("svg")).toBeVisible();

    // The Sign in button is slate-900 (#0F172A) with a 12px radius (not the
    // old black pill).
    const signIn = page.getByRole("button", { name: "Sign in", exact: true });
    await expect(signIn).toHaveCSS("background-color", "rgb(15, 23, 42)");
    await expect(signIn).toHaveCSS("border-radius", "12px");

    // The page behind the card is plain white — the old photographic wash
    // is gone (session-10: the live login has no background image).
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
    expect(bodyBg).toBe("none");
    const main = page.locator("main").first();
    const mainBgImage = await main.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(mainBgImage).toBe("none");
    // Session-12 re-measure: the live's document BODY is white too (the
    // app-wide cream body shows through on overscroll today).
    const bodyColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyColor).toBe("rgb(255, 255, 255)");
  });

  test("wrong password is rejected without a session", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Email").fill(DEMO_EMAIL);
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    // .first(): a double-render of the error toast (observed once in a
    // full-suite run) must not turn the rejection check into a strict-mode
    // violation — any visible instance proves the 401 path.
    await expect(page.getByText("Incorrect email or password").first()).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("valid credentials sign in and land on the guide", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Email").fill(DEMO_EMAIL);
    await page.getByLabel("Password").fill(DEMO_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
    // Desktop chrome: the floating pill nav (not a bare page) is the
    // visible landmark once signed in.
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();
  });

  test("authenticated visits redirect /login back to the guide", async ({ page }) => {
    const res = await page.request.post("/api/auth/login", {
      data: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });
    expect(res.ok()).toBeTruthy();
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/$/);
  });
});
