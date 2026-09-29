// Session-33 capture verification — replays the capture flow with
// geometry assertions (the established verify pattern).
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
await page.getByLabel("Password").fill("$Abcd1234");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page.waitForURL(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

const nav = page.locator("footer nav").first();
const link = nav.locator("a").first();

// The compact state at page load (offscreen footer).
const w0 = await nav.evaluate((el) => el.getBoundingClientRect().width);
console.log("compact at load:", Math.round(w0), w0 >= 500 && w0 <= 512 ? "OK" : "FAIL");

// The forced-compact capture state.
await page.evaluate(() => {
  document.querySelector("footer").scrollIntoView({ block: "end" });
});
await page.waitForTimeout(1500);
await page.evaluate(() => {
  document.querySelector("footer").style.setProperty("--footer-p", "0");
});
await page.waitForTimeout(400);
const w62 = await nav.evaluate((el) => el.getBoundingClientRect().width);
const linkW62 = await link.evaluate((el) => el.getBoundingClientRect().width);
console.log("capture 62 (forced compact):", Math.round(w62), "link", Math.round(linkW62), w62 >= 500 && w62 <= 512 && linkW62 >= 72 && linkW62 <= 76 ? "OK" : "FAIL");

// The mid-growth capture state.
await page.evaluate(() => {
  const footer = document.querySelector("footer");
  footer.style.removeProperty("--footer-p");
  const rect = footer.getBoundingClientRect();
  window.scrollTo({ top: rect.top + window.scrollY - window.innerHeight + rect.height / 2, behavior: "instant" });
});
await page.waitForTimeout(600);
const gap63 = await nav.evaluate((el) => parseFloat(getComputedStyle(el).gap));
const linkW63 = await link.evaluate((el) => el.getBoundingClientRect().width);
console.log("capture 63 (mid-growth): gap", gap63.toFixed(2), "link", Math.round(linkW63), gap63 >= 9.6 && gap63 <= 10.4 && linkW63 >= 81 && linkW63 <= 85 ? "OK" : "FAIL");

// The grown capture state.
await page.evaluate(() => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
});
await page.waitForTimeout(600);
const w64 = await nav.evaluate((el) => el.getBoundingClientRect().width);
console.log("capture 64 (grown):", Math.round(w64), w64 >= 640 && w64 <= 652 ? "OK" : "FAIL");

// The hover capture state.
await page.mouse.move(0, 0);
await page.waitForTimeout(400);
await link.hover();
await page.waitForTimeout(500);
const transform65 = await link.evaluate((el) => getComputedStyle(el).transform);
const bg65 = await link.evaluate((el) => getComputedStyle(el).backgroundColor);
console.log("capture 65 (hover):", transform65, bg65, transform65 === "matrix(1.1, 0, 0, 1.1, 0, -12)" && bg65 === "rgb(87, 26, 255)" ? "OK" : "FAIL");

await browser.close();
console.log("verification complete");
