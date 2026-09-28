// Session-29 element captures via Playwright (the established pattern from
// scripts/capture-screens-v9-session28.mjs — agent-browser's element
// screenshot of tall sticky sections renders blank; Playwright's
// locator.screenshot() stitches content correctly). Boots against the
// already-running server on :3000 (the remediated codebase).
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
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await login(page);
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

// 38: the DESKTOP band heading state (session-29 — the centered sticky
// column: the clamp(46px,7vw,104px) h2 with the white View All pill below
// at gap 24, over the 5-name window).
const band = page.locator("#highlighted-restaurants");
const bandBox = await band.boundingBox();
await page.evaluate((y) => window.scrollTo(0, y + 600), bandBox.y);
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/38-desktop-band-heading.png` });

// 39: the DESKTOP band deep state (session-29 — the compact 330px featured
// card with the two flex-1 h-38 buttons over the names window; the heading
// column has faded out).
await page.evaluate((y) => window.scrollTo(0, y + 1900), bandBox.y);
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/39-desktop-band-card.png` });

// 40: the map list cards (session-29 — the cream eyebrow pill + the
// MapPin neighborhood rows + the 12px grid gap).
await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
const listCard = page.locator("#places-list a").first();
await listCard.screenshot({ path: `${OUT}/40-map-list-card.png` });
const listGrid = page.locator("#places-list");
await listGrid.screenshot({ path: `${OUT}/41-map-list-grid.png` });

// 42: the detail hero rating pill (session-29 — 61×32, the 14px star).
await page.goto(`${BASE}/place/moss-marble`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
const ratingPill = page.locator("[data-photo-rating]");
await ratingPill.screenshot({ path: `${OUT}/42-detail-rating-pill.png` });

// 43: the mobile map list card (the eyebrow pill + the pin row at 390).
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
const mobileCard = page.locator("#places-list a").first();
await mobileCard.screenshot({ path: `${OUT}/43-mobile-map-list-card.png` });

await browser.close();
console.log("session-29 captures done: 38-43");
