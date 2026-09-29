// Session-30 captures via Playwright (the established pattern from
// scripts/capture-screens-v10-session29.mjs — Playwright's locator
// screenshots stitch content correctly). Boots against the already-running
// dev server on :3000 (the remediated codebase). Surfaces: the two 404
// designs + the map's new circular zoom pair, 12px pins with name labels,
// and the pin-click navigation.
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

// 44: the PLACE 404 (session-30 — the in-app design inside the app chrome:
// the 46px serif "Place not found" h1 + the 44px ink "Back to Do" pill).
await page.goto(`${BASE}/place/no-such-place`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/44-place-404.png` });

// 45: the GENERIC 404 (session-30 — the platform slate design: the 72px
// font-light "404", the divider, "Page Not Found", the quoted path, and
// the white bordered "Go Home" button — chrome-less).
await page.goto(`${BASE}/no-such-route`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/45-generic-404.png` });

// 46: the map's circular zoom pair + the 12px pins (session-30 — 34×34
// r999 buttons in the gapped stack over the canvas). Wait for the tiles +
// markers (CARTO occasionally throttles; the DOM assert guards the
// capture).
async function mapReady(p) {
  await p.waitForSelector(".roam-marker", { count: 9 });
  await p.waitForFunction(
    () => {
      const tiles = Array.from(document.querySelectorAll(".leaflet-tile"));
      return tiles.length > 0 && tiles.every((t) => t.complete && t.naturalWidth > 0);
    },
    { timeout: 20_000 },
  );
  await p.waitForTimeout(800);
}
await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
await mapReady(page);
await page.evaluate(() => document.querySelector(".leaflet-container").scrollIntoView({ block: "center" }));
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/46-map-zoom-pins.png` });

// 47: the hover-revealed pin name labels (force the label pills visible the
// way the live renders them on hover — white pills + triangle pointers).
await page.evaluate(() => {
  const style = document.createElement("style");
  style.textContent = ".roam-marker-label { opacity: 1 !important; transform: translate(-50%, 0) scale(1) !important; }";
  document.head.appendChild(style);
});
await page.waitForTimeout(600);
await page.evaluate(() => document.querySelector(".leaflet-container").scrollIntoView({ block: "center" }));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/47-map-pin-labels.png` });

// 48: the pin-click navigation — click the first pin, land on the place
// page (no popup on the way).
await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
await mapReady(page);
await page.locator(".leaflet-marker-icon").first().click();
await page.waitForURL("**/place/map-brass-marble", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/48-pin-click-navigation.png` });

// 49: the mobile map with the new pin model at 390 (the 12px dots + the
// circular zoom pair + the stats pills).
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
await mapReady(page);
await page.evaluate(() => document.querySelector(".leaflet-container").scrollIntoView({ block: "center" }));
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/49-mobile-map-pins.png` });

await browser.close();
console.log("session-30 captures done: 44-49");
