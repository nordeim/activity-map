// Session-27 element captures via Playwright (agent-browser's element
// screenshot of the 3360px route section renders blank on this version —
// Playwright's locator.screenshot() stitches sticky content correctly).
// Boots against the already-running production server on :3000.
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = "/home/z/my-project/activity-map/docs/screenshots";

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
  await page.getByLabel("Password").fill("$Abcd1234");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(`${BASE}/`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await login(page);
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#recommended-route", { state: "attached" });
await page.waitForTimeout(2500);

// 11: the full route section (refreshed — the stop chrome changed).
const route = page.locator("#recommended-route");
await route.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await route.screenshot({ path: `${OUT}/11-home-route.png` });

// 30: the first desktop stop card (the pill + title + bordered link card).
// Deterministic (the session-20 lesson): scroll so the trap's TOP sits at
// the viewport top (progress 0 — card 0 sits in the slot), NOT
// scrollIntoViewIfNeeded (non-deterministic on the absolute-positioned
// desktop cards).
await page.evaluate(() => {
  const t = document.querySelector("#recommended-route > div");
  window.scrollTo(0, t ? t.getBoundingClientRect().top + window.scrollY : 0);
});
await page.waitForTimeout(600);
const stop = page.locator('article[data-stop-index="0"]');
await stop.screenshot({ path: `${OUT}/30-desktop-route-stop-chrome.png` });

// 31: the same card at mobile width.
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForSelector('article[data-stop-index="0"]', { state: "attached" });
await page.waitForTimeout(2000);
const stopMobile = page.locator('article[data-stop-index="0"]');
await stopMobile.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await stopMobile.screenshot({ path: `${OUT}/31-mobile-route-stop-chrome.png` });

// 32: the mobile login card (the responsive 16px fields + 44px button).
await page.context().clearCookies();
await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.locator("div.rounded-2xl").first().screenshot({ path: `${OUT}/32-mobile-login-fields.png` });

await browser.close();
console.log("SESSION-27 PLAYWRIGHT CAPTURES DONE");
