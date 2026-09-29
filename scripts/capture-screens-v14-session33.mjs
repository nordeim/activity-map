// Session-33 captures via Playwright (the established pattern from
// scripts/capture-screens-v13-session32.mjs). Boots against the
// already-running DEV server on :3000 (the remediated codebase). Surfaces:
// the footer pill's scroll-linked growth states at 1280 (the compact
// 506×96 model — captured by forcing --footer-p to 0 in-view since the
// state only exists offscreen — the mid-growth interpolation at the
// footer's half-visibility, and the grown 646×118 model at the page
// bottom), the violet link hover, and the unchanged mobile footer pill.
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
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await login(page);
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

// 62: the COMPACT model (506×96, gap 8, r-28, the 74×78 tiles — the state
// the live renders while the footer is offscreen). The state only exists
// offscreen, so the capture forces --footer-p to 0 AFTER scrolling the
// footer into view (the scroll listener has already fired; the forced
// value holds through the 120ms transition).
await page.evaluate(() => {
  const footer = document.querySelector("footer");
  footer.scrollIntoView({ block: "end" });
});
await page.waitForTimeout(2000);
await page.evaluate(() => {
  document.querySelector("footer").style.setProperty("--footer-p", "0");
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/62-footer-pill-compact-1280.png` });

// 63: the MID-GROWTH interpolation — scrolled to the footer's
// half-visibility (p=0.5): gap 10px, the links 83×85 (the continuous
// scroll-linked model, not a binary toggle).
await page.evaluate(() => {
  const footer = document.querySelector("footer");
  footer.style.removeProperty("--footer-p"); // restore the scroll driver
  const rect = footer.getBoundingClientRect();
  const target = rect.top + window.scrollY - window.innerHeight + rect.height / 2;
  window.scrollTo({ top: target, behavior: "instant" });
});
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/63-footer-pill-midgrowth-1280.png` });

// 64: the GROWN model at the page bottom (646×118, gap 12, r-34, the
// 92×92 tiles with r-24 corners, 24px icons over 12px labels).
await page.evaluate(() => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
});
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/64-footer-pill-grown-1280.png` });

// 65: the VIOLET hover on the first tile (translateY −12 + scale 1.1 over
// the #571AFF fill, white text, the 0 16px 34px /0.28 glow).
await page.mouse.move(0, 0);
await page.waitForTimeout(400);
await page.locator("footer nav a").first().hover();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/65-footer-link-hover-1280.png` });

// 66: the MOBILE footer pill at 390 (unchanged by session-33 — the 3-col
// grid 350×182 with the 104×78 tiles, now carrying the soft
// 0 2px 12px /0.08 shadow — captured for the record).
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const footer = document.querySelector("footer");
  footer.scrollIntoView({ block: "end" });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/66-footer-pill-mobile-390.png` });

await browser.close();
console.log("5 captures written (62-66)");
