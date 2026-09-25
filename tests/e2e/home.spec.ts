import { expect, test } from "@playwright/test";

// Home (Highlights) content parity spec — pins the sections measured on the
// live reference app (session 2): the glass planner pill, the Recommended
// Route itinerary, the blue Highlighted Restaurants strip + featured card,
// the Choose Your Vibe stay showcase, the Highlighted Sights grid, the
// More Things to Do link, and the site footer. Contexts arrive
// AUTHENTICATED (setup-project storageState).

test.describe("home content parity (session 2)", () => {
  test("hero: serif wordmark over the photo, white planner card, no subtitle", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();

    // The live hero has NO subtitle paragraph — the planner follows the h1.
    await expect(page.getByText("Restaurants, boutique stays and slow-city experiences")).toHaveCount(0);

    // Planner card segments (live aria-labels — unchanged by the redesign).
    await expect(page.getByLabel("Choose trip dates")).toBeVisible();
    await expect(page.getByLabel("Number of people")).toBeVisible();
    await expect(page.getByLabel("Type of Activities")).toBeVisible();
    await expect(page.getByLabel("Search trip matches")).toBeVisible();

    // The planner card title.
    await expect(page.getByText("Let's Plan Your Trip").first()).toBeVisible();

    // Session-5 redesign: below md the hero planner is a near-opaque WHITE
    // elevated card (bg-white/95, radius 30, the big soft 0 16 34 shadow) —
    // no longer the frosted glass capsule (which still renders from md).
    // Tailwind v4 serializes bg-white/95 through color-mix() → computed
    // colors arrive as oklab(), so the card is pinned by its radius and its
    // distinctive rgba shadow, not a parsed background string.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const planner = page.locator(".trip-planner-card").first();
    await expect(planner).toHaveCSS("border-radius", "30px");
    const plannerShadow = await planner.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(plannerShadow).toContain("rgba(14, 14, 14, 0.16)");
  });

  test("hero geometry: taller photo, content positions match the live (session 10)", async ({ page }) => {
    // Mobile (390×844): the live hero photo is 591px tall with the h1 at
    // viewport y≈203 and the planner at y≈365 (124px card + a 126px gap
    // under the 36px h1 — a much taller hero than the old 86vh build).
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const heroImg = page.locator("section img").first();
    await expect(heroImg).toBeVisible();
    const mobileGeom = await page.evaluate(() => {
      const img = document.querySelector("section img");
      const h1 = document.querySelector("h1");
      return {
        imgH: Math.round(img?.getBoundingClientRect().height ?? 0),
        h1Y: Math.round(h1?.getBoundingClientRect().y ?? 0),
        h1X: Math.round(h1?.getBoundingClientRect().x ?? 0),
      };
    });
    expect(mobileGeom.imgH).toBeGreaterThanOrEqual(570);
    expect(mobileGeom.imgH).toBeLessThanOrEqual(610);
    expect(mobileGeom.h1Y).toBeGreaterThanOrEqual(180);
    expect(mobileGeom.h1Y).toBeLessThanOrEqual(225);
    // Session-14 re-measure: the live hero content container carries px-6
    // (24px) at every breakpoint — the h1 starts at x=24 (was 16 with
    // px-4).
    expect(mobileGeom.h1X).toBeGreaterThanOrEqual(20);
    expect(mobileGeom.h1X).toBeLessThanOrEqual(28);

    // Session-16 re-measure: the live's mobile PLANNER CARD is WIDER than
    // the px-6 content — 358px wide starting at x=16 (16px viewport
    // margins) with a 4px grid gap (the card escapes the content padding).
    const plannerBox = await page.locator(".trip-planner-card").first().boundingBox();
    expect(plannerBox).not.toBeNull();
    expect(Math.round(plannerBox!.x)).toBeGreaterThanOrEqual(13);
    expect(Math.round(plannerBox!.x)).toBeLessThanOrEqual(19);
    expect(Math.round(plannerBox!.width)).toBeGreaterThanOrEqual(352);
    expect(Math.round(plannerBox!.width)).toBeLessThanOrEqual(364);

    // Desktop (1280×800): the photo is ~938px (the live's hero section) with
    // the h1 at viewport y≈290 (the content rides higher over the taller
    // photo; the photo shows behind the transparent header strip).
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const desktopGeom = await page.evaluate(() => {
      const img = [...document.querySelectorAll("img")].find((i) => i.getBoundingClientRect().height > 400);
      const h1 = document.querySelector("h1");
      return {
        imgY: Math.round(img?.getBoundingClientRect().y ?? 0),
        imgH: Math.round(img?.getBoundingClientRect().height ?? 0),
        h1Y: Math.round(h1?.getBoundingClientRect().y ?? 0),
      };
    });
    expect(desktopGeom.imgH).toBeGreaterThanOrEqual(920);
    expect(desktopGeom.imgH).toBeLessThanOrEqual(960);
    expect(desktopGeom.imgY).toBeLessThanOrEqual(10); // behind/under the header
    expect(desktopGeom.h1Y).toBeGreaterThanOrEqual(265);
    expect(desktopGeom.h1Y).toBeLessThanOrEqual(315);
  });

  test("desktop navbar is the floating pill (session-6 redesign)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();

    // The inner bar: white PILL — radius rounded-full (Tailwind v4 compiles
    // it to calc(infinity*1px) → Chrome serializes 33554432px, so assert the
    // numeric radius instead of the string), max-width 820, fully bordered,
    // softly shadowed, centered (NOT the old full-width bottom-bordered bar).
    const navRadius = await nav.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(navRadius).toBeGreaterThan(1000);
    await expect(nav).toHaveCSS("max-width", "820px");
    await expect(nav).toHaveCSS("border-bottom-color", "rgb(232, 230, 220)");
    await expect(nav).toHaveCSS("border-top-width", "1px");
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThan(100); // inset from the viewport edge
    expect(box!.x + box!.width).toBeLessThan(1180);

    // Link typography: 13px Inter — ACTIVE 700 ink, inactive #555550.
    const active = nav.getByRole("link", { name: "Highlights", exact: true });
    await expect(active.locator("span")).toHaveCSS("font-size", "13px");
    await expect(active.locator("span")).toHaveCSS("font-weight", "700");
    const inactive = nav.getByRole("link", { name: "Eat", exact: true });
    await expect(inactive.locator("span")).toHaveCSS("color", "rgb(85, 85, 80)");
  });

  test("category cards: live row internals, full-width VIEW ALL, mobile snap carousel (session 10)", async ({ page }) => {
    // Mobile (390): the cards form a HORIZONTAL snap carousel (the live's
    // today-category-cards row scrolls sideways — scrollWidth 978 at 390).
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const cardRow = page.locator("#category-cards").first();
    const scrollInfo = await cardRow.evaluate((el) => ({ scrollW: el.scrollWidth, clientW: el.clientWidth }));
    expect(scrollInfo.scrollW).toBeGreaterThan(scrollInfo.clientW + 200); // 3 off-screen-ish cards
    // The mobile VIEW ALL pills are violet #571AFF, full card width.
    const mobileViewAll = page.getByRole("link", { name: /View All/ }).first();
    await expect(mobileViewAll).toHaveCSS("background-color", "rgb(87, 26, 255)");
    const viewAllRadius = await mobileViewAll.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(viewAllRadius).toBeGreaterThan(1000);
    // Session-16: the live's mobile glass card carries radius 24 (the
    // desktop card keeps radius 20).
    const mobileCard = page.locator("[data-category-card]").first();
    await expect(mobileCard).toHaveCSS("border-radius", "24px");

    // Desktop (1280): the VIEW ALL pills stay near-black #141413 — session-16
    // re-measure: the pill now HANGS BELOW the glass card's bottom edge
    // (w≈229, h=54, half-overlapping the card onto the hero photo below)
    // instead of sitting inside the card.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const desktopViewAll = page.getByRole("link", { name: /View All/ }).first();
    await expect(desktopViewAll).toHaveCSS("background-color", "rgb(20, 20, 19)");
    await expect(desktopViewAll).toHaveCSS("height", "54px");
    const vaBox = await desktopViewAll.boundingBox();
    const card = desktopViewAll.locator("xpath=ancestor::article[1]");
    const cardBox = await card.boundingBox();
    expect(vaBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    // The pill hangs PAST the glass card's bottom edge (the live's
    // half-in/half-out overlap).
    expect(vaBox!.y + vaBox!.height).toBeGreaterThan(cardBox!.y + cardBox!.height);
    expect(vaBox!.width).toBeGreaterThan(cardBox!.width - 40);

    // Session-16 re-measure: each row is a two-line title + subtitle beside
    // a 34×35 rounded-8 GLASS icon cell (white/0.48) — three ≈46px rows per
    // card (the live grew them from the session-10 36px/28×28 build).
    const firstTagRow = card.locator("ul li").first();
    const iconCell = firstTagRow.locator("span").first();
    await expect(iconCell).toHaveCSS("width", "34px");
    await expect(iconCell).toHaveCSS("height", "35px");
    await expect(iconCell).toHaveCSS("border-radius", "8px");
    const rowBox = await firstTagRow.boundingBox();
    expect(rowBox).not.toBeNull();
    expect(rowBox!.height).toBeGreaterThanOrEqual(42);
    expect(rowBox!.height).toBeLessThanOrEqual(50);
    const title = firstTagRow.locator("span").nth(1).locator("span").first();
    await expect(title).toHaveCSS("font-size", "12px");
    await expect(title).toHaveCSS("font-weight", "500");
    // Three two-line rows per card (the live's curated set).
    await expect(card.locator("ul li")).toHaveCount(3);
    await expect(card.getByText("City center", { exact: true })).toBeVisible();

    // Session-16 re-measure: the live's glass card is ≈231px now (the
    // taller 46px rows + the View All hanging outside the card).
    const cardH = await card.boundingBox();
    expect(cardH).not.toBeNull();
    expect(cardH!.height).toBeGreaterThanOrEqual(220);
    expect(cardH!.height).toBeLessThanOrEqual(243);
    // The desktop glass card keeps radius 20.
    await expect(card).toHaveCSS("border-radius", "20px");

    // The live's icon set (FerrisWheel on the do card, Wine on eat) —
    // :visible scopes to the desktop row (the hidden mobile carousel also
    // carries one of each).
    await expect(page.locator("[data-category-card]:visible svg.lucide-ferris-wheel")).toHaveCount(1);
    await expect(page.locator("[data-category-card]:visible svg.lucide-wine")).toHaveCount(1);
  });

  test("recommended route renders the five timed TEXT stops (session 8)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Recommended Route" })).toBeVisible();
    await expect(page.getByText(/of your day planned/).first()).toBeVisible();

    for (const stop of ["Morning Coffee", "Lunch Break", "Afternoon Culture", "Sunset Drinks", "Dinner"]) {
      await expect(page.getByRole("heading", { name: stop, exact: true })).toBeVisible();
    }
    await expect(page.getByText("9:00 AM")).toBeVisible();
    await expect(page.getByText("Specialty Coffee Bar")).toBeVisible();

    // Session-8 re-measure: the live route cards are TEXT-ONLY — the photos
    // are gone from the whole section (both breakpoints).
    const routeSection = page.locator("#recommended-route");
    await expect(routeSection.locator("img")).toHaveCount(0);

    // The stop titles render DARK serif on cream (rgb(20,20,19)), not the
    // old white-on-photo treatment.
    const stopTitle = page.getByRole("heading", { name: "Morning Coffee", exact: true });
    await expect(stopTitle).toHaveCSS("color", "rgb(20, 20, 19)");

    // The time pill is a WHITE pill (radius 999).
    const timePill = page.locator("[data-stop-time='9:00 AM']");
    await expect(timePill).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const timeRadius = await timePill.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(timeRadius).toBeGreaterThan(1000);

    // Route stop cards link to their place pages.
    await expect(page.getByRole("link", { name: /Learn More/ }).first()).toHaveAttribute(
      "href",
      /\/place\/home-route-/,
    );

    // The Learn More pill is BLACK full-width (h-11) — the pill is a span
    // inside the white info-card link, so assert the pill element itself.
    const learnMore = routeSection.locator("[data-learn-more]").first();
    await expect(learnMore).toHaveCSS("background-color", "rgb(14, 14, 14)");
    const learnMoreH = await learnMore.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(learnMoreH)).toBe(44);

    // Session-8 swap: at desktop the right panel pins EARLY and swaps ONE
    // card at a time across the long trap — scrolling deep moves the active
    // card past Morning Coffee (its absolute siblings stay opacity-0 until
    // their turn). Session-10: the stop titles are h2 (the live's semantics).
    await page.setViewportSize({ width: 1280, height: 800 });
    const trap = page.locator("#recommended-route > div");
    await trap.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 2600);
    await page.waitForTimeout(700);
    const visibleStop = page.locator('#recommended-route article[data-active="true"] h2');
    await expect(visibleStop).not.toHaveText("Morning Coffee", { timeout: 8000 });
  });

  test("highlighted restaurants: blue section, glass detail card, View All (session-6 carousel)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Highlighted Restaurants" })).toBeVisible();

    // The frosted-glass detail card with the ACTIVE restaurant (Volta at
    // rest) + its actions, and the white View All pill.
    await expect(section.getByRole("heading", { name: "Volta", exact: true })).toBeVisible();
    await expect(section.getByRole("link", { name: /Book a Table/ })).toHaveAttribute(
      "href",
      /\/place\/home-restaurant-volta/,
    );
    await expect(section.getByRole("link", { name: /View All/ })).toHaveAttribute("href", "/eat");

    // The name watermark: the active name renders solid white; the rest
    // faint. (.first(): the hidden mobile deck repeats names in its h3s.)
    const watermark = section.getByText("Garbo", { exact: true }).first();
    await expect(watermark).toBeVisible();
  });

  test("highlighted restaurants: the mobile card deck is SIX cards (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    // The deck: browse-style cards stacked sticky over each other — the live
    // app reduced it from 16 to the first SIX restaurants (session 8).
    const deck = section.locator("article");
    await expect(deck).toHaveCount(6, { timeout: 15_000 });
    const first = deck.first();
    await expect(first.getByRole("heading", { name: "Volta", exact: true })).toBeVisible();
    // The sixth deck card is Ember (the live's last deck card).
    await expect(deck.nth(5).getByRole("heading", { name: "Ember", exact: true })).toBeVisible();
    // No desktop View All on the mobile deck (live parity).
    await expect(section.getByRole("link", { name: /View All/ })).toHaveCount(0);
  });

  test("choose your vibe heading splits into per-letter reveal spans (session 8)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const h2 = page.getByRole("heading", {
      name: /Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway/,
    });
    await expect(h2).toBeVisible();
    // The live heading renders one span per letter (64 for this string) and
    // animates their colors cream → ink with scroll position.
    const letters = h2.locator("span[data-letter]");
    const count = await letters.count();
    expect(count).toBeGreaterThanOrEqual(50);

    // Session-12 re-measure: the live's heading block is FULL-WIDTH and
    // LEFT-ALIGNED (h2 x≈38, w≈1203 at 1280 — no max-w-3xl centering), the
    // subtitle is 14px #888580 (not 16px black/60), and the grid wrapper
    // carries pt-112/pb-144 padding.
    const h2Box = await h2.boundingBox();
    expect(h2Box).not.toBeNull();
    expect(h2Box!.x).toBeLessThan(60);
    expect(h2Box!.width).toBeGreaterThan(1100);
    const sub = page.getByText("Pick a stay that matches your mood, from quiet design hotels to rooftop city escapes.");
    await expect(sub).toHaveCSS("font-size", "14px");
    await expect(sub).toHaveCSS("color", "rgb(138, 135, 128)");
  });

  test("stay + sight card titles render 24px on mobile, 18px on desktop (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const stayTitle = page.locator("#stay-showcase article h3").first();
    await expect(stayTitle).toHaveCSS("font-size", "24px");
    const sightTitle = page.locator("#highlighted-sights article h3").first();
    await expect(sightTitle).toHaveCSS("font-size", "24px");

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const stayTitleDesktop = page.locator("#stay-showcase article h3").first();
    await expect(stayTitleDesktop).toHaveCSS("font-size", "18px");
    const sightTitleDesktop = page.locator("#highlighted-sights article h3").first();
    await expect(sightTitleDesktop).toHaveCSS("font-size", "18px");
  });

  test("choose your vibe: the twelve stay cards with Learn More + Book Now", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway/ }),
    ).toBeVisible();
    await expect(page.getByText("Pick a stay that matches your mood")).toBeVisible();

    const showcase = page.locator("#stay-showcase");
    await expect(showcase.getByRole("link", { name: /Learn More/ })).toHaveCount(12);
    await expect(showcase.getByRole("link", { name: /Book Now/ })).toHaveCount(12);
    await expect(showcase.getByText("Garden Suite")).toBeVisible();
    await expect(showcase.getByText("Maximilianstraße 44")).toBeVisible();

    // Session-12 re-measure: the live re-shuffled the home showcase order
    // (independent of the /stay browse order, which is unchanged). The
    // first card is now Courtyard Stay and the full 12-title order is
    // pinned against the live's current sequence.
    const titles = await showcase.locator("a h3").allTextContents();
    const order = ["Courtyard Stay", "Terra Boutique", "Brass & Marble", "Canal Hideaway", "Maison Altstadt", "Garden Suite", "River House", "Rooftop Atelier", "Velvet Residence", "Cloud Nine Hotel", "The Linen House", "Arcade Rooms"];
    expect(titles.map((t) => t.trim())).toEqual(order);

    // Session-14 re-measure: the live grid fills COLUMN-MAJOR (3 columns ×
    // 4 stacked cards) — the VISUAL first row reads Courtyard | Maison |
    // Velvet across (the DOM order is unchanged; only the flow changes) —
    // with 381px cards at an 18px gap over the bare 1178px grid (no
    // container side padding).
    const visual = await showcase.locator("a").evaluateAll((els) => {
      const cards = els
        .map((el) => {
          const r = el.getBoundingClientRect();
          const h = el.querySelector("h3");
          return h ? { t: h.textContent.trim(), x: r.x, y: r.y, w: r.width } : null;
        })
        .filter((c): c is { t: string; x: number; y: number; w: number } => c !== null)
        .sort((a, b) => a.y - b.y || a.x - b.x);
      return { row1: cards.slice(0, 3).map((c) => c.t), cardW: Math.round(cards[0].w) };
    });
    expect(visual.row1).toEqual(["Courtyard Stay", "Maison Altstadt", "Velvet Residence"]);
    expect(visual.cardW).toBeGreaterThanOrEqual(375);
    expect(visual.cardW).toBeLessThanOrEqual(385);
  });

  test("highlighted sights: six cards linking to home-sight place pages", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-sights");
    await expect(section.getByRole("heading", { name: "Highlighted Sights" })).toBeVisible();
    await expect(section.getByText("Six calm stops for a scenic Augsburg route")).toBeVisible();

    for (const sight of ["Fuggerei", "Rathausplatz", "Augsburg Cathedral", "Perlachturm", "Lech Canals", "Schaezlerpalais"]) {
      await expect(section.getByRole("heading", { name: sight, exact: true })).toBeVisible();
    }
    await expect(section.getByRole("link", { name: /Learn More/ }).first()).toHaveAttribute(
      "href",
      /\/place\/home-sight-/,
    );

    // Session-14 re-measure: the live sights grid is 1120px wide (x≈80)
    // with 360px cards (the clone ran a 1144+px-6 container → 352px).
    const sightsGeom = await section.locator("ul").first().evaluate((el) => {
      const r = el.getBoundingClientRect();
      const card = el.querySelector("li");
      return { x: Math.round(r.x), cardW: card ? Math.round(card.getBoundingClientRect().width) : 0 };
    });
    expect(sightsGeom.x).toBeGreaterThanOrEqual(76);
    expect(sightsGeom.x).toBeLessThanOrEqual(84);
    expect(sightsGeom.cardW).toBeGreaterThanOrEqual(355);
    expect(sightsGeom.cardW).toBeLessThanOrEqual(365);
  });

  test("route/sight home places resolve on their detail pages", async ({ page }) => {
    await page.goto("/place/home-sight-fuggerei");
    await expect(page.getByRole("heading", { name: "Fuggerei" })).toBeVisible();

    await page.goto("/place/home-route-specialty-coffee-bar");
    await expect(page.getByRole("heading", { name: "Specialty Coffee Bar" })).toBeVisible();
  });

  test("more things to do is a DARK pill linking to the Do browse; footer carries the legal line", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const more = page.getByRole("link", { name: /More Things to Do/ });
    await expect(more).toHaveAttribute("href", "/do");
    // Session-8 re-measure: the live hand-off is a DARK pill (rgb(17,17,17)
    // bg, white text, radius 999) — no border, no white bg.
    await expect(more).toHaveCSS("background-color", "rgb(17, 17, 17)");
    await expect(more).toHaveCSS("color", "rgb(255, 255, 255)");

    await expect(page.getByText("© 2026 Roam. Activity Map for Augsburg.")).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy policy" })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Accessibility Statement" })).toBeVisible();
  });

  test("browses stay unpolluted: 12 stays, 12 eats, 18 dos", async ({ page }) => {
    await page.goto("/stay");
    await expect(page.locator('a[href^="/place/"]')).toHaveCount(12);
    await page.goto("/eat");
    await expect(page.locator('a[href^="/place/"]')).toHaveCount(12);
    await page.goto("/do");
    await expect(page.locator('a[href^="/place/"]')).toHaveCount(18);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "12 Places to Eat" })).toBeVisible(); // home card count unchanged
    await expect(page.getByRole("heading", { name: "18 Sights to Discover" })).toBeVisible();
  });
});
