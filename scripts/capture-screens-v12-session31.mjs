// Session-31 captures via Playwright (the established pattern from
// scripts/capture-screens-v11-session30.mjs). Boots against the
// already-running DEV server on :3000 (the remediated codebase). Surfaces:
// the vh-model hero (desktop 900 + the rounded photo corners), the capped
// mobile h1 (390 + 640), the centered vibe heading, the showcase parallax
// zoom, and the hydration-clean generic 404.
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

// 50: the DESKTOP hero at 1280×900 (session-31 — the vh-relative model:
// the h1 at y=319, the 1038px photo with the elliptical rounded bottom
// corners, the raw image tone).
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/50-hero-vh-model-900.png` });

// 51: the hero at 1280×800 — the same formulas land on the session-22
// values (h1 290 / the 1010 photo), pinning the vh-tracking.
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/51-hero-vh-model-800.png` });

// 52: the MOBILE hero at 390 (the capped 35.88px h1 + the 42%/48px rounded
// photo corners + the 591 section).
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/52-hero-mobile-390.png` });

// 53: the mobile hero at 640 — the h1 CAPS at 38px (was 57.6 uncapped).
await page.setViewportSize({ width: 640, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/53-hero-mobile-640-cap.png` });

// 54: the CENTERED vibe heading (the 3-line block centered per line with
// the live's exact line breaks). Pin the letters to solid ink first (the
// reveal animates cream→ink with scroll — the capture wants the settled
// state) and let the smooth scroll settle.
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const h2 = [...document.querySelectorAll("h2")].find((h) =>
    /choose your vibe/i.test(h.textContent || ""),
  );
  h2.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(2500);
await page.evaluate(() => {
  // Force the reveal's settled state (solid ink) for a clean capture.
  const h2 = [...document.querySelectorAll("h2")].find((h) =>
    /choose your vibe/i.test(h.textContent || ""),
  );
  [...h2.querySelectorAll("span[data-letter]")].forEach((s) => {
    s.style.color = "rgb(26, 26, 26)";
  });
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/54-vibe-centered.png` });

// 55: the stay showcase imgs with the 1.16 zoom + the parallax (scroll the
// first row into view — the tighter crops; positioned below the navbar).
await page.evaluate(() => {
  const card = document.querySelector("#stay-showcase article");
  window.scrollTo(0, card.getBoundingClientRect().top + scrollY - 120);
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/55-stay-parallax-zoom.png` });

// 56: the sights grid with the oversized wrappers (the zoomed crops).
await page.evaluate(() => {
  const card = document.querySelector("#highlighted-sights article");
  card.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/56-sights-oversize-crop.png` });

// 57: the hydration-clean GENERIC 404 (the quoted path renders post-mount
// with ZERO console errors — the session-31 useSyncExternalStore fix).
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" && !/Failed to load resource.*404/.test(msg.text())) {
    consoleErrors.push(msg.text());
  }
});
await page.goto(`${BASE}/no-such-route-session31`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/57-generic-404-clean.png` });
if (consoleErrors.length > 0) {
  throw new Error(`the 404 capture saw console errors: ${consoleErrors.join(" | ")}`);
}

await browser.close();
console.log("session-31 captures done: 50-57 (0 console errors on the 404)");
