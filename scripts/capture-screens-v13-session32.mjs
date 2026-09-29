// Session-32 captures via Playwright (the established pattern from
// scripts/capture-screens-v12-session31.mjs). Boots against the
// already-running DEV server on :3000 (the remediated codebase). Surfaces:
// the shrink-wrapped mobile nav link group at 390 + 640 (session-32 — the
// links at 121/192/222/259 + the press-shrink chrome), the grown desktop
// footer pill (646×118 with the 92×92 tiles), and the unchanged mobile
// footer pill for the record.
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = "/home/z/my-project/activity-map/docs/screenshots";

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
  await page.getByLabel("Password").fill("$Abcd1234");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(`${BASE}/`, { waitUntil: "domcontentloaded" });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await login(page);

// 58: the MOBILE nav at 390 — the shrink-wrapped link group (the four text
// links at x 121/192/222/259 — 4px left of the old flex-1-centered model)
// with the glass 52px tab-bar.
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/58-nav-shrinkwrap-390.png` });

// 59: the mobile nav at 640 — the 430px-capped centered tab-bar with the
// group at 246/317/347/384.
await page.setViewportSize({ width: 640, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/59-nav-shrinkwrap-640.png` });

// 60: the GROWN desktop footer pill (session-32 — 646×118, r-34, the six
// 92×92 tiles with 24px icons over 12px labels, one row).
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const footer = document.querySelector("footer");
  footer.scrollIntoView({ block: "end" });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/60-footer-pill-grown-1280.png` });

// 61: the MOBILE footer pill at 390 (unchanged by session-32 — the 3-col
// grid 350×182 with the 104×78 tiles — captured for the record alongside
// the grown desktop pill).
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const footer = document.querySelector("footer");
  footer.scrollIntoView({ block: "end" });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/61-footer-pill-mobile-390.png` });

await browser.close();
console.log("4 captures written (58-61)");
