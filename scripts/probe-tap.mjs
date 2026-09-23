// Probe the tap-interception issue under exact E2E conditions:
// production standalone server + mobile emulation (390x844, isMobile, hasTouch).
import { chromium, devices } from "playwright-core";

const BASE = process.env.PROBE_BASE ?? "http://localhost:3100";

const ctx = await chromium.launchPersistentContext("", {
  ...devices["Desktop Chrome"],
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 3,
});
const page = await ctx.newPage();

// Authenticate first (the app redirects to /login without a session) —
// log in through the real UI form.
await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
await page.fill('input[name="email"]', "sepnetflix2023@outlook.com");
await page.fill('input[name="password"]', "$Abcd1234");
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/`, { timeout: 15000 }).catch(() => {});

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

const probe = await page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Primary"]');
  const eat = nav.querySelector('a[href="/eat"]');
  const r = eat.getBoundingClientRect();
  const cx = r.x + r.width / 2;
  const cy = r.y + r.height / 2;
  const top = document.elementFromPoint(cx, cy);
  const hdr = document.querySelector("header");
  const hr = hdr.getBoundingClientRect();
  const heroDiv = document.querySelector('main .relative.z-10');
  const hd = heroDiv ? heroDiv.getBoundingClientRect() : null;
  const cs = getComputedStyle(hdr);
  const eatCS = getComputedStyle(eat);
  return {
    layoutViewport: document.documentElement.clientWidth,
    eat: { x: r.x, y: r.y, w: r.width, h: r.height },
    tap: { cx, cy },
    top: top ? `${top.tagName}#${top.id || ""}.${(top.className || "").toString().slice(0, 70)}` : "none",
    headerBox: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
    headerStyle: {
      position: cs.position, zIndex: cs.zIndex, transform: cs.transform,
      backdropFilter: cs.backdropFilter, pointerEvents: cs.pointerEvents,
    },
    eatColor: eatCS.color,
    eatFontWeight: eatCS.fontWeight,
    heroDiv: hd ? { x: hd.x, y: hd.y, w: hd.width, h: hd.height } : null,
  };
});
console.log(JSON.stringify(probe, null, 2));

// Also test a real tap like Playwright's action would
try {
  await page.locator('nav[aria-label="Primary"] a[href="/eat"]').tap({ timeout: 5000 });
  console.log("TAP OK →", page.url());
} catch (e) {
  console.log("TAP FAILED:", e.message.split("\n").slice(0, 6).join(" | "));
}
await ctx.close();
