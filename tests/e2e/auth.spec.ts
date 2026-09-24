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
  test("renders the live-parity auth card (session-6 chrome)", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Activity Map" })).toBeVisible();
    await expect(page.getByText("Sign in to continue")).toBeVisible();

    // The hosted-platform chrome rendered for parity: the Google button,
    // the "or" divider, the forgot-password link, and the sign-up link —
    // each answers with an inline notice instead of navigating.
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    await expect(page.getByText("or", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Forgot password?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();

    // The card is the rounded-28 white panel.
    const card = page.locator("div.rounded-\\[28px\\]").first();
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("border-radius", "28px");
  });

  test("wrong password is rejected without a session", async ({ page }) => {
    await page.goto("/login");
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
    await page.goto("/login");
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
    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);
  });
});
