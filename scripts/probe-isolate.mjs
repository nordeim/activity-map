// Isolate the header-positioning bug: run the same probe against dev (3000)
// and prod (3100) servers, with and without mobile emulation.
import { chromium, devices } from "playwright-core";

async function probe(base, mobile) {
  const ctx = await chromium.launchPersistentContext("", {
    ...devices["Desktop Chrome"],
    viewport: { width: 390, height: 844 },
    ...(mobile ? { hasTouch: true, isMobile: true, deviceScaleFactor: 3 } : {}),
  });
  const page = await ctx.newPage();
  try {
    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
    await page.fill('input[name="email"]', "sepnetflix2023@outlook.com");
    await page.fill('input[name="password"]', "$Abcd1234");
    await page.click('button[type="submit"]');
    await page.waitForURL(`${base}/`, { timeout: 15000 }).catch(() => {});
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const data = await page.evaluate(() => {
      const hdr = document.querySelector("header");
      const hr = hdr.getBoundingClientRect();
      const cs = getComputedStyle(hdr);
      const shell = hdr.parentElement;
      const sr = shell.getBoundingClientRect();
      const scs = getComputedStyle(shell);
      // Find horizontal overflow sources
      let overflowers = [];
      document.querySelectorAll("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > 391 && r.width > 400) {
          overflowers.push(`${el.tagName}.${(el.className || "").toString().slice(0, 50)} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
        }
      });
      return {
        headerBox: { x: Math.round(hr.x), w: Math.round(hr.width) },
        headerPos: cs.position,
        headerTranslate: cs.translate,
        headerTransform: cs.transform,
        shellBox: { x: Math.round(sr.x), w: Math.round(sr.width) },
        shellStyle: {
          transform: scs.transform, translate: scs.translate, filter: scs.filter,
          backdropFilter: scs.backdropFilter, willChange: scs.willChange, contain: scs.contain,
          perspective: scs.perspective, contentVisibility: scs.contentVisibility,
        },
        bodyScrollWidth: document.body.scrollWidth,
        docClientWidth: document.documentElement.clientWidth,
        overflowers: overflowers.slice(0, 8),
      };
    });
    console.log(`\n=== ${base} ${mobile ? "MOBILE-EMULATED" : "DESKTOP-MODE"} ===`);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(`${base} mobile=${mobile} ERROR:`, e.message.split("\n")[0]);
  } finally {
    await ctx.close();
  }
}

await probe("http://localhost:3000", true);
await probe("http://localhost:3100", true);
await probe("http://localhost:3100", false);
