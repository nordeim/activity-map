// Session-28 element captures via Playwright (the established pattern from
// scripts/capture-screens-v8-session27.mjs — agent-browser's element
// screenshot of tall sticky sections renders blank; Playwright's
// locator.screenshot() stitches content correctly). Boots against the
// already-running DEV server on :3000 (the remediated codebase).
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = "/home/z/activity-map/docs/screenshots";

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
  await page.getByLabel("Password").fill("$Abcd1234");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(`${BASE}/`, { waitUntil: "domcontentloaded" });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await login(page);
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

// 33: the DESKTOP date-range popover (session-28 re-measure — the 510px
// chrome, the self-contained from/to fields with the calendar icons, the
// gray trailing days).
await page.getByLabel("Choose trip dates").click();
await page.waitForTimeout(1000);
const popover = page.locator("[role=dialog][aria-label='Choose trip dates']");
await popover.screenshot({ path: `${OUT}/33-desktop-date-picker.png` });

// Select a range first so the capture shows the violet endpoints + the
// #F7F4FF in-range tint.
await page.locator("[role=dialog] button[aria-label*=' 15 ']").first().click();
await page.waitForTimeout(400);
await page.locator("[role=dialog] button[aria-label*=' 18 ']").first().click();
await page.waitForTimeout(600);
await popover.screenshot({ path: `${OUT}/34-desktop-date-picker-range.png` });

// 35: the MOBILE date-picker popover (358px cap, the stacked 1-col fields).
await page.mouse.click(10, 400);
await page.waitForTimeout(600);
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.getByLabel("Choose trip dates").click();
await page.waitForTimeout(1000);
const popoverMobile = page.locator("[role=dialog][aria-label='Choose trip dates']");
await popoverMobile.screenshot({ path: `${OUT}/35-mobile-date-picker.png` });

// 36: the home stay-showcase card pills (session-28: 34px + the bordered
// Book Now). Hover the first card so the pill row is revealed, then capture
// the card's bottom overlay region.
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#stay-showcase", { state: "attached" });
await page.waitForTimeout(2500);
const firstCard = page.locator("#stay-showcase article").first();
await firstCard.hover();
await page.waitForTimeout(900);
const overlay = firstCard.locator("div.absolute.bottom-\\[18px\\]").first();
await overlay.screenshot({ path: `${OUT}/36-stay-card-pills.png` });

// 37: the booking form's labels + fields (session-28: 12px/600 #3A3A3A
// labels + the #DDDBD5 field borders).
await page.goto(`${BASE}/place/courtyard-stay`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
const aside = page.locator("aside#book-now-card");
await aside.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await aside.screenshot({ path: `${OUT}/37-booking-form-labels.png` });

await browser.close();
console.log("session-28 captures done: 33-37");
