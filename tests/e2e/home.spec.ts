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

    // Desktop (1280×800): session-22 re-measure — the live's hero photo
    // box is an ABSOLUTE backdrop bleeding ABOVE the hero section (inset
    // top −86px / bottom +14px relative to a section at page y=0): the
    // 1280×1010 box lands at page y=−86→924, cover-cropped ≈7.7% more
    // zoomed than the old full-container framing. The h1 stays at y≈290.
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
    expect(desktopGeom.imgH).toBeGreaterThanOrEqual(1000);
    expect(desktopGeom.imgH).toBeLessThanOrEqual(1020);
    expect(desktopGeom.imgY).toBeLessThanOrEqual(-75); // bleeding above the page top (the live: −86)
    expect(desktopGeom.imgY).toBeGreaterThanOrEqual(-95);
    expect(desktopGeom.h1Y).toBeGreaterThanOrEqual(265);
    expect(desktopGeom.h1Y).toBeLessThanOrEqual(315);

    // md (768): the same bleed rule — the box is 972px (900 + 72).
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const mdGeom = await page.evaluate(() => {
      const img = [...document.querySelectorAll("img")].find((i) => i.getBoundingClientRect().height > 400);
      return {
        imgY: Math.round(img?.getBoundingClientRect().y ?? 0),
        imgH: Math.round(img?.getBoundingClientRect().height ?? 0),
      };
    });
    expect(mdGeom.imgH).toBeGreaterThanOrEqual(965);
    expect(mdGeom.imgH).toBeLessThanOrEqual(980);
    expect(mdGeom.imgY).toBeLessThanOrEqual(-75);
    expect(mdGeom.imgY).toBeGreaterThanOrEqual(-95);
  });

  test("the trip-planner date-range popover matches the live re-measure (session 28)", async ({ page }) => {
    // Session-28 re-measure: the live's react-day-picker popover, swept for
    // the first time since session 3 — the container is 510px wide at
    // desktop (358 at 390 = calc(100vw-32px)) with pad 12px; the from/to
    // header is a 2-col grid of SELF-CONTAINED white pill fields (h 50,
    // border-black/10, px-4 py-2) carrying the 12px/500 #8A8780 label +
    // the 12px/600 ink value + a 14px calendar svg INSIDE; NO "Done"
    // button (outside-click closes); the month label 14px/500; the nav
    // buttons 28×28; the weekday cells 12.8px/400 #737373; the selected
    // day violet bg + weight 400; the in-range days #F7F4FF bg + violet
    // text; the PREV-MONTH trailing days render grayed in the first row.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Choose trip dates").click();
    const popover = page.locator("[role=dialog][aria-label='Choose trip dates']");
    await expect(popover).toBeVisible();

    // Container chrome: width 510 (±6), pad 12, radius 40, white bg.
    const box = await popover.boundingBox();
    expect(Math.round(box!.width)).toBeGreaterThanOrEqual(504);
    expect(Math.round(box!.width)).toBeLessThanOrEqual(516);
    await expect(popover).toHaveCSS("padding", "12px");
    await expect(popover).toHaveCSS("border-radius", "40px");
    await expect(popover).toHaveCSS("background-color", "rgb(255, 255, 255)");

    // The from/to header: two self-contained white pill fields (h 50) with
    // the label + value + a calendar icon INSIDE each.
    const fromField = popover.locator("text=from").first().locator("xpath=..");
    const fromBox = await fromField.boundingBox();
    expect(Math.round(fromBox!.height)).toBeGreaterThanOrEqual(48);
    expect(Math.round(fromBox!.height)).toBeLessThanOrEqual(52);
    await expect(fromField).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const fromBorder = await fromField.evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(fromBorder).toBe("1px");
    // Each field carries a calendar svg inside.
    const calendarIcons = await fromField.locator("svg").count();
    expect(calendarIcons).toBeGreaterThanOrEqual(1);

    // NO "Done" button — the live closes on outside-click only.
    await expect(popover.getByRole("button", { name: "Done" })).toHaveCount(0);

    // The month label: 14px / weight 500 (the live's font-medium).
    const monthLabel = popover.getByText(/2026/, { exact: false }).first();
    await expect(monthLabel).toHaveCSS("font-size", "14px");
    const monthWeight = await monthLabel.evaluate((el) => getComputedStyle(el).fontWeight);
    expect(monthWeight).toBe("500");

    // The month nav buttons: 28×28 circles.
    const prevBtn = popover.getByLabel("Previous month");
    const prevBox = await prevBtn.boundingBox();
    expect(Math.round(prevBox!.width)).toBeGreaterThanOrEqual(26);
    expect(Math.round(prevBox!.width)).toBeLessThanOrEqual(30);

    // The weekday row: 12.8px / 400 #737373 (the live's 0.8rem neutral).
    const weekday = popover.getByText("Su", { exact: true }).first();
    await expect(weekday).toHaveCSS("font-size", "12.8px");
    const weekdayWeight = await weekday.evaluate((el) => getComputedStyle(el).fontWeight);
    expect(weekdayWeight).toBe("400");
    await expect(weekday).toHaveCSS("color", "rgb(115, 115, 115)");

    // The prev-month trailing days render as GRAY BUTTONS (#737373 — the
    // same neutral as the weekday row) in the leading cells of the first
    // row (the live's react-day-picker outside days: 30, 31 before the 1).
    const trailingBtn = popover.getByRole("button", { name: /^30$/ }).first();
    await expect(trailingBtn).toBeVisible();
    await expect(trailingBtn).toHaveCSS("color", "rgb(115, 115, 115)");

    // Select a day: violet bg + white text + weight 400 (not 600); the
    // from field value updates to the DD/MM/YYYY format.
    const day15 = popover.getByRole("button", { name: /15/ }).first();
    await day15.click();
    await expect(day15).toHaveCSS("background-color", "rgb(87, 26, 255)");
    await expect(day15).toHaveCSS("color", "rgb(255, 255, 255)");
    const selWeight = await day15.evaluate((el) => getComputedStyle(el).fontWeight);
    expect(selWeight).toBe("400");

    // Complete a range: the in-range day carries #F7F4FF bg + violet text.
    const day18 = popover.getByRole("button", { name: /18/ }).first();
    await day18.click();
    const day17 = popover.getByRole("button", { name: /17/ }).first();
    await expect(day17).toHaveCSS("background-color", "rgb(247, 244, 255)");
    await expect(day17).toHaveCSS("color", "rgb(87, 26, 255)");

    // The mobile cap: at 390 the popover computes 358 wide (100vw-32).
    await page.mouse.click(10, 400); // outside-click closes
    await expect(popover).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByLabel("Choose trip dates").click();
    await expect(popover).toBeVisible();
    const mobileBox = await popover.boundingBox();
    expect(Math.round(mobileBox!.width)).toBeGreaterThanOrEqual(354);
    expect(Math.round(mobileBox!.width)).toBeLessThanOrEqual(362);
    expect(Math.round(mobileBox!.x)).toBeGreaterThanOrEqual(14);
    expect(Math.round(mobileBox!.x)).toBeLessThanOrEqual(18);
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

    // Session-26 re-measure: the live's mobile track (its override
    // stylesheet) pads the track 18/18/40 and tightens the gap to 12px
    // (gap-3) — the cards ride the hero photo's bottom edge at y≈578 (the
    // clone's track had no top pad, gap 16, cards at y≈559).
    const trackGap = await cardRow.evaluate((el) =>
      Math.round(
        (el.children[1] as HTMLElement).getBoundingClientRect().x -
          (el.children[0] as HTMLElement).getBoundingClientRect().right,
      ),
    );
    expect(trackGap).toBeGreaterThanOrEqual(10);
    expect(trackGap).toBeLessThanOrEqual(14);
    const cardY = await mobileCard.evaluate((el) => Math.round(el.getBoundingClientRect().y + window.scrollY));
    expect(cardY).toBeGreaterThanOrEqual(570);
    expect(cardY).toBeLessThanOrEqual(585);

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
    // Session-25 re-measure: the pill's top sits ≈5px ABOVE the card's
    // bottom edge (the live hangs it 49px past the bottom, was 27) — its
    // overlap with the card is a thin sliver, not a half.
    expect(cardBox!.y + cardBox!.height - vaBox!.y).toBeLessThanOrEqual(10);

    // Session-25 re-measure: each row is a two-line title + subtitle beside
    // a 32×32 rounded-8 GLASS icon cell — the live renders its session-10
    // internals (28×28 cells, 36px rows) and SCALES the desktop row
    // transform:matrix(1.15), so the VISIBLE cells measure 32×32 and the
    // rows 41–46px (the live's own cards vary: eat 41, hotels/sights 46).
    const firstTagRow = card.locator("ul li").first();
    const iconCell = firstTagRow.locator("span").first();
    await expect(iconCell).toHaveCSS("width", "32px");
    await expect(iconCell).toHaveCSS("height", "32px");
    await expect(iconCell).toHaveCSS("border-radius", "8px");
    const rowBox = await firstTagRow.boundingBox();
    expect(rowBox).not.toBeNull();
    expect(rowBox!.height).toBeGreaterThanOrEqual(40);
    expect(rowBox!.height).toBeLessThanOrEqual(50);
    const title = firstTagRow.locator("span").nth(1).locator("span").first();
    await expect(title).toHaveCSS("font-size", "12px");
    await expect(title).toHaveCSS("font-weight", "500");
    // Three two-line rows per card (the live's curated set).
    await expect(card.locator("ul li")).toHaveCount(3);
    await expect(card.getByText("City center", { exact: true })).toBeVisible();

    // Session-25 re-measure: the desktop header line-box is ≈24px (the
    // live's 21px header × its 1.15 row scale = 24px visible; was 32px).
    const headerBox = await card.locator("h2").boundingBox();
    expect(headerBox).not.toBeNull();
    expect(headerBox!.height).toBeLessThanOrEqual(26);

    // Session-25 re-measure: the desktop card-gap is ≈14px (the live's
    // computed 12px × 1.15 scale = 13.8 visible; the clone had gap-5=20).
    const cardBoxes = await page.locator("[data-category-card]:visible").evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().x),
    );
    expect(cardBoxes.length).toBeGreaterThanOrEqual(3);
    const gap = cardBoxes[1] - cardBoxes[0] - 263;
    expect(gap).toBeGreaterThanOrEqual(11);
    expect(gap).toBeLessThanOrEqual(16);

    // Session-25 re-measure: the live's glass cards run 210 (eat) –231
    // (hotels/sights) tall on screen — the ×1.15 scale over the 183–201px
    // session-10 flow heights (was the uniform session-16 223).
    const cardH = await card.boundingBox();
    expect(cardH).not.toBeNull();
    expect(cardH!.height).toBeGreaterThanOrEqual(205);
    expect(cardH!.height).toBeLessThanOrEqual(235);
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

    // The time pill is a WHITE pill (radius 999) — session-20 re-measure:
    // px-3 py-1, 12px/400 text. Session-27 re-measure: the live RE-ADDED a
    // soft shadow + a hairline border + a PER-STOP category icon + dimmer
    // #3A3A3A text (the shadow-less session-20 contract is overtaken).
    const timePill = page.locator("[data-stop-time='9:00 AM']");
    await expect(timePill).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const timeRadius = await timePill.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(timeRadius).toBeGreaterThan(1000);
    await expect(timePill).toHaveCSS("font-weight", "400");
    const timeShadow = await timePill.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(timeShadow).toContain("rgba(14, 14, 14, 0.06)");
    expect(timeShadow).toContain("22px");
    // Session-27: the pill carries a 1px rgba(14,14,14,0.1) hairline.
    const timeBorder = await timePill.evaluate(
      (el) => `${getComputedStyle(el).borderTopWidth} ${getComputedStyle(el).borderTopColor}`,
    );
    expect(timeBorder).toBe("1px rgba(14, 14, 14, 0.1)");
    // Session-27: the pill text dims to #3A3A3A (was #141413).
    await expect(timePill).toHaveCSS("color", "rgb(58, 58, 58)");
    // Session-27: the pill renders a PER-STOP category icon — the first
    // stop (Morning Coffee) carries the lucide Coffee svg at 14px.
    const pillIcon = timePill.locator("svg");
    await expect(pillIcon).toHaveCount(1);
    const pillIconClass = await pillIcon.evaluate((el) => el.getAttribute("class") ?? "");
    expect(pillIconClass).toContain("coffee");
    const pillIconW = await pillIcon.evaluate((el) => el.getBoundingClientRect().width);
    expect(Math.round(pillIconW)).toBe(14);
    // Session-22 re-measure: the live's pill text carries +0.05em tracking
    // (0.6px at 12px) — the "9:00 AM" span is tracked out slightly.
    const timeLs = await timePill.evaluate((el) => parseFloat(getComputedStyle(el).letterSpacing));
    expect(timeLs).toBeGreaterThanOrEqual(0.5);
    expect(timeLs).toBeLessThanOrEqual(0.7);

    // Route stop cards link to their place pages.
    await expect(page.getByRole("link", { name: /Learn More/ }).first()).toHaveAttribute(
      "href",
      /\/place\/home-route-/,
    );

    // The Learn More pill is BLACK full-width (h-11) — the pill is a span
    // inside the white info-card link, so assert the pill element itself.
    // Session-20: the text is 13px/600 (was 14).
    const learnMore = routeSection.locator("[data-learn-more]").first();
    await expect(learnMore).toHaveCSS("background-color", "rgb(14, 14, 14)");
    const learnMoreH = await learnMore.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(learnMoreH)).toBe(44);
    await expect(learnMore).toHaveCSS("font-size", "13px");

    // Session-20 re-measure: the live's stop-card typography shrank — the
    // place name is an h3 at 20px/600 (line-height 30px), the meta line is
    // 13px/400 #72706C (rgb(114,112,106)), the description keeps 14px with
    // mt-4, and the DESKTOP link card is max-w-md (448px, left-aligned)
    // with the lighter 0 8px 28px rgba(14,14,14,0.08) shadow + mt-7.
    const stopLinkCard = routeSection.locator("article a").first();
    const placeName = stopLinkCard.locator("h3").first();
    await expect(placeName).toHaveText("Specialty Coffee Bar");
    await expect(placeName).toHaveCSS("font-size", "20px");
    await expect(placeName).toHaveCSS("font-weight", "600");
    // Session-22 re-measure: the live's 20px place names carry −0.02em
    // tracking (−0.4px at 20px).
    const placeLs = await placeName.evaluate((el) => parseFloat(getComputedStyle(el).letterSpacing));
    expect(placeLs).toBeLessThanOrEqual(-0.3);
    expect(placeLs).toBeGreaterThanOrEqual(-0.5);
    const metaLine = stopLinkCard.locator("span").nth(0);
    await expect(metaLine).toHaveCSS("font-size", "13px");
    await expect(metaLine).toHaveCSS("color", "rgb(114, 112, 106)");
    const linkShadow = await stopLinkCard.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(linkShadow).toContain("rgba(14, 14, 14, 0.08)");

    // Session-27 re-measure: the live's stop-card chrome re-tightened —
    // (a) the serif stop TITLE carries line-height 1.1 (52.8px at the 48px
    // desktop title) + an 8px bottom margin above the link card;
    const stopTitleLh = await stopTitle.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
    const stopTitleFs = await stopTitle.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(stopTitleLh / stopTitleFs).toBeGreaterThanOrEqual(1.08);
    expect(stopTitleLh / stopTitleFs).toBeLessThanOrEqual(1.12);
    const stopTitleMb = await stopTitle.evaluate((el) => parseFloat(getComputedStyle(el).marginBottom));
    expect(stopTitleMb).toBeGreaterThanOrEqual(6);
    expect(stopTitleMb).toBeLessThanOrEqual(10);
    // (b) the white LINK CARD gained a 1px rgba(14,14,14,0.08) hairline
    // (it previously rendered shadow-only);
    const linkBorder = await stopLinkCard.evaluate(
      (el) => `${getComputedStyle(el).borderTopWidth} ${getComputedStyle(el).borderTopColor}`,
    );
    expect(linkBorder).toBe("1px rgba(14, 14, 14, 0.08)");
    // (c) the META row is a flex-wrap gap-1.5 row carrying a 14px map-pin
    // svg (stroke #72706A) BEFORE the neighborhood text.
    const metaRow = stopLinkCard.locator(".mt-2").first();
    const metaPin = metaRow.locator("svg");
    await expect(metaPin).toHaveCount(1);
    const metaPinW = await metaPin.evaluate((el) => el.getBoundingClientRect().width);
    expect(Math.round(metaPinW)).toBe(14);
    const metaPinStroke = await metaPin.evaluate((el) => el.getAttribute("stroke") ?? "");
    expect(metaPinStroke).toBe("#72706A");

    // Session-8 swap (session-20 rework): at desktop the right panel pins
    // EARLY and the stop cards translate upward CONTINUOUSLY with scroll
    // (the live's scroll-linked choreography) — scrolling deep moves the
    // active card past Morning Coffee. Session-10: the stop titles are h2
    // (the live's semantics).
    await page.setViewportSize({ width: 1280, height: 800 });
    const trap = page.locator("#recommended-route > div");
    // Deterministic (session-20): scroll so the trap's TOP sits at the
    // viewport top (progress 0) — scrollIntoViewIfNeeded on a 420vh element
    // is non-deterministic (it may center the tall trap mid-viewport).
    await page.evaluate(() => {
      const t = document.querySelector("#recommended-route > div");
      window.scrollTo(0, t ? t.getBoundingClientRect().top + window.scrollY : 0);
    });
    await page.waitForTimeout(300);

    // Session-20: the desktop split is 50/50 — the visual panel is half the
    // viewport (≈640 at 1280) and the stops column the other half; the card
    // slot sits ≈237px below the sticky top (the column's lg:pt-[237px]).
    const visualPanel = page.locator("#recommended-route div[class*='w-1/2']").first();
    const desktopVisualBox = await visualPanel.boundingBox();
    expect(desktopVisualBox).not.toBeNull();
    expect(Math.round(desktopVisualBox!.width)).toBeGreaterThanOrEqual(630);
    expect(Math.round(desktopVisualBox!.width)).toBeLessThanOrEqual(650);
    // Late-loading images above the route can shift the trap AFTER the
    // deterministic scroll — re-align once more before the slot measurement.
    await page.evaluate(() => {
      const t = document.querySelector("#recommended-route > div");
      if (!t) return;
      window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY);
    });
    await page.waitForTimeout(150);
    const slotState = await page.evaluate(() => {
      const sticky = document.querySelector("#recommended-route div[class*='lg:sticky']");
      const card = document.querySelector("#recommended-route article");
      const col = document.querySelector("#recommended-route div[class*='lg:pt-']");
      return {
        designed: col ? parseFloat(getComputedStyle(col).paddingTop) : 0,
        runtime: card && sticky ? card.getBoundingClientRect().y - sticky.getBoundingClientRect().y : 0,
      };
    });
    expect(Math.round(slotState.designed)).toBe(237);
    expect(Math.round(slotState.runtime)).toBeGreaterThanOrEqual(205);
    expect(Math.round(slotState.runtime)).toBeLessThanOrEqual(265);
    const firstCard = page.locator("#recommended-route article").first();
    const slotY = slotState.runtime;
    // The desktop link card is capped at max-w-md (448px).
    const desktopLinkBox = await firstCard.locator("a").boundingBox();
    expect(desktopLinkBox).not.toBeNull();
    expect(Math.round(desktopLinkBox!.width)).toBeGreaterThanOrEqual(430);
    expect(Math.round(desktopLinkBox!.width)).toBeLessThanOrEqual(465);

    // The continuous choreography: at ~400px into the trap the 0→1 card
    // crossfade is IN PROGRESS — two adjacent articles carry intermediate
    // opacity (0 < o < 1), not a binary active/inactive swap. Deterministic
    // scroll (mouse.wheel timing proved flaky mid-suite).
    const scrollIntoTrap = (offset: number) =>
      page.evaluate((o) => {
        const t = document.querySelector("#recommended-route > div");
        if (!t) return;
        window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + o);
      }, offset);
    await scrollIntoTrap(400);
    await page.waitForTimeout(400);
    const opacities = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#recommended-route article")).map((el) =>
        parseFloat(getComputedStyle(el).opacity),
      ),
    );
    const intermediate = opacities.filter((o) => o > 0.05 && o < 0.95);
    expect(intermediate.length).toBeGreaterThanOrEqual(1);
    // Card 0 must be EXITING UPWARD (its y above the slot) at +400px.
    const cardBoxes = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#recommended-route article")).map((el) =>
        Math.round(el.getBoundingClientRect().y),
      ),
    );
    expect(cardBoxes[0]).toBeLessThan(Math.round(slotY));

    // Deep scroll: the active stop moves past Morning Coffee.
    await scrollIntoTrap(3000);
    await page.waitForTimeout(700);
    const visibleStop = page.locator('#recommended-route article[data-active="true"] h2');
    await expect(visibleStop).not.toHaveText("Morning Coffee", { timeout: 8000 });

    // Session-18 re-measure: the live's mobile route pins a FULL-VIEWPORT
    // route visual (the winding-path svg with numbered nodes) BEFORE the
    // stop cards flow — and the mobile progress chip is GONE (only the
    // desktop pill remains, hidden below lg). The stop link-cards are
    // rounded-28 now.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const routeSectionMobile = page.locator("#recommended-route");
    const mobileVisual = routeSectionMobile.locator("svg").first();
    await mobileVisual.waitFor({ state: "visible", timeout: 15_000 });
    const visualBox = await mobileVisual.boundingBox();
    expect(visualBox).not.toBeNull();
    expect(Math.round(visualBox!.width)).toBeGreaterThanOrEqual(380);
    expect(Math.round(visualBox!.height)).toBeGreaterThanOrEqual(700);
    // No VISIBLE progress chip at 390 (the desktop pill's DOM node may
    // exist inside the lg-only panel — it must be hidden).
    const plannedTexts = routeSectionMobile.getByText(/of your day planned/);
    const plannedCount = await plannedTexts.count();
    for (let i = 0; i < plannedCount; i++) {
      await expect(plannedTexts.nth(i)).toBeHidden();
    }
    // The mobile stop link-card is rounded-28 (was 24) — session-20: the
    // panel pads px-[18px] so the cards sit at x=18 (354 wide at 390).
    const stopLinkCardMobile = routeSectionMobile.locator("article a").first();
    await expect(stopLinkCardMobile).toHaveCSS("border-radius", "28px");
    const mobileCardBox = await stopLinkCardMobile.boundingBox();
    expect(mobileCardBox).not.toBeNull();
    expect(Math.round(mobileCardBox!.x)).toBe(18);
    expect(Math.round(mobileCardBox!.width)).toBeGreaterThanOrEqual(348);
    expect(Math.round(mobileCardBox!.width)).toBeLessThanOrEqual(360);
  });

  test("the mobile route heading pins INSIDE the trap at y=68 (session 26)", async ({ page }) => {
    // Session-26 re-measure: the live HIDES its recommended-route-heading
    // section on phones and renders the h2 INSIDE the pinned trap —
    // `absolute left-1/2 top-[68px] w-[min(92vw,360px)] -translate-x-1/2`,
    // font clamp(38px, 11vw, 48px) (42.9px @390), lh ≈1.02, tracking
    // −0.055em — so the heading rides the FULL trap scroll at viewport
    // y=68 (the clone's old model pinned it at y=120 in a separate
    // heading section that vanished mid-trap). The trap zone also grew to
    // 220vh (1857px at an 844 viewport).
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Exactly ONE "Recommended Route" heading renders at 390 (the desktop
    // heading section is hidden below lg; the trap carries the h2).
    const headings = page.getByRole("heading", { name: "Recommended Route" });
    await expect(headings).toHaveCount(1);
    const h2 = headings.first();
    await expect(h2).toBeVisible();
    // The h2's font is the live's clamp — 42.9px at 390.
    await expect(h2).toHaveCSS("font-size", "42.9px");
    // The trap zone is 220vh (1856-1858px at an 844-tall viewport).
    const trapH = await page.evaluate(() => {
      const t = document.querySelector("#recommended-route > div > div");
      return t ? Math.round(t.getBoundingClientRect().height) : 0;
    });
    expect(trapH).toBeGreaterThanOrEqual(1840);
    expect(trapH).toBeLessThanOrEqual(1875);
    // Mid-trap: the h2 pins at viewport y≈68 over the pinned svg.
    const trapY = await page.evaluate(() => {
      const t = document.querySelector("#recommended-route > div > div");
      return t ? t.getBoundingClientRect().y + window.scrollY : 0;
    });
    await page.evaluate((y) => window.scrollTo(0, y + 300), trapY);
    await page.waitForTimeout(250);
    const h2ViewportY = await h2.evaluate((el) => Math.round(el.getBoundingClientRect().y));
    expect(Math.abs(h2ViewportY - 68)).toBeLessThanOrEqual(6);
    // The h2's width caps at min(92vw, 360px) → 358-360 at 390.
    const h2W = await h2.evaluate((el) => Math.round(el.getBoundingClientRect().width));
    expect(h2W).toBeGreaterThanOrEqual(355);
    expect(h2W).toBeLessThanOrEqual(362);
  });

  test("highlighted restaurants: blue section, glass detail card, View All (session-6 carousel)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Highlighted Restaurants" })).toBeVisible();

    // Session-18 re-measure: the live's blue band now rises over the route
    // trap's TAIL — its top starts ~800px before the route box ends (at
    // the sticky release point), not flush after it.
    const routeTrap = page.locator("#recommended-route > div");
    const bandBox = await section.boundingBox();
    const trapBox = await routeTrap.boundingBox();
    expect(bandBox).not.toBeNull();
    expect(trapBox).not.toBeNull();
    const overlap = trapBox!.y + trapBox!.height - bandBox!.y;
    expect(overlap).toBeGreaterThanOrEqual(700);
    expect(overlap).toBeLessThanOrEqual(900);

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

  test("highlighted restaurants: the mobile deck STACKS — sticky cards pinned at y=88 (session 26)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#highlighted-restaurants");
    // Session-26 re-measure: the live's mobile-restaurant-stack returned to
    // a STICKY STACKING deck — the cards flow 620px apart (490 card + 130
    // gap), each card pins at viewport y≈88, and the next card slides up
    // OVER it (the later card paints above in DOM order). The section pads
    // 56px 18px 0px (the cards at x=18, 354 wide).
    const deck = section.locator("article");
    await expect(deck).toHaveCount(6, { timeout: 15_000 });
    const first = deck.first();
    await expect(first.getByRole("heading", { name: "Volta", exact: true })).toBeVisible();
    // The sixth deck card is Ember (the live's last deck card).
    await expect(deck.nth(5).getByRole("heading", { name: "Ember", exact: true })).toBeVisible();
    // No desktop View All on the mobile deck (live parity).
    await expect(section.getByRole("link", { name: /View All/ })).toHaveCount(0);
    // The cards are STICKY at top 88px (the live's pin offset — below the
    // 52px tab-bar), NOT the session-18 static list.
    await expect(first).toHaveCSS("position", "sticky");
    await expect(first).toHaveCSS("top", "88px");
    // The flow advance stays 620 (490 card + 130 gap) at rest.
    const firstBox = await first.boundingBox();
    const secondBox = await deck.nth(1).boundingBox();
    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    const advance = secondBox!.y - firstBox!.y;
    expect(advance).toBeGreaterThanOrEqual(580);
    expect(advance).toBeLessThanOrEqual(660);
    // The deck insets: the section pads px-[18px] → the cards sit at x=18.
    expect(Math.round(firstBox!.x)).toBe(18);
    expect(Math.round(firstBox!.width)).toBeGreaterThanOrEqual(348);
    expect(Math.round(firstBox!.width)).toBeLessThanOrEqual(360);
    // THE STACKING: scroll mid-deck (after the second card's pin) — two
    // adjacent cards share viewport y≈88 (the second has slid OVER the
    // first), while the later cards still flow below.
    const firstAbs = await first.evaluate((el) => el.getBoundingClientRect().y + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), firstAbs + 700);
    await page.waitForTimeout(200);
    const pinned = await deck.evaluateAll((els) =>
      els.slice(0, 2).map((el) => Math.round(el.getBoundingClientRect().y)),
    );
    expect(Math.abs(pinned[0] - 88)).toBeLessThanOrEqual(6);
    expect(Math.abs(pinned[1] - 88)).toBeLessThanOrEqual(6);
    // No band overlap at mobile — the list starts after the route ends.
    const routeEnd = await page
      .locator("#recommended-route")
      .evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
    const bandTop = await section.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    expect(Math.round(bandTop)).toBeGreaterThanOrEqual(Math.round(routeEnd) - 4);
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

    // Session-26 re-measure: the live's mobile showcase sections render
    // INSET cards — the stay grid pads px-[18px] (cards 354 wide @x=18)
    // and the sights grid pads px-4 (cards 358 wide @x=16); the clone had
    // rendered both grids FULL-BLEED (390 @x=0).
    const stayCard = page.locator("#stay-showcase article").first();
    const stayBox = await stayCard.boundingBox();
    expect(stayBox).not.toBeNull();
    expect(Math.round(stayBox!.x)).toBe(18);
    expect(Math.round(stayBox!.width)).toBeGreaterThanOrEqual(350);
    expect(Math.round(stayBox!.width)).toBeLessThanOrEqual(358);
    const sightCard = page.locator("#highlighted-sights article").first();
    const sightBox = await sightCard.boundingBox();
    expect(sightBox).not.toBeNull();
    expect(Math.round(sightBox!.x)).toBe(16);
    expect(Math.round(sightBox!.width)).toBeGreaterThanOrEqual(354);
    expect(Math.round(sightBox!.width)).toBeLessThanOrEqual(362);

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

    // Session-28 re-measure: the live's home-showcase pills carry the
    // inline height 34px (was the session-6 41px override) and the Book
    // Now pill gained a 1px rgba(255,255,255,0.92) border (the /stay
    // BROWSE variant stays 36px borderless — verified separately).
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const courtyardCard = showcase.locator("a", { hasText: "Learn More" }).first();
    const learnPill = courtyardCard.getByText("Learn More", { exact: true });
    const bookPill = courtyardCard.getByText("Book Now", { exact: true });
    const learnBox = await learnPill.boundingBox();
    expect(Math.round(learnBox!.height)).toBeGreaterThanOrEqual(32);
    expect(Math.round(learnBox!.height)).toBeLessThanOrEqual(36);
    const bookBox = await bookPill.boundingBox();
    expect(Math.round(bookBox!.height)).toBeGreaterThanOrEqual(32);
    expect(Math.round(bookBox!.height)).toBeLessThanOrEqual(36);
    const bookBorder = await bookPill.evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(bookBorder).toBe("1px");
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

  test("the footer matches the live re-measure (session-23): compact glass pill + paddings + legal row", async ({ page }) => {
    // Session-23 re-measure — the footer had not been re-audited since
    // session 2. The live renders: a COMPACT shrink-wrapped centered glass
    // pill (506×96 @1280, r-28, border 1px #E8E6DC, backdrop
    // blur(40px) saturate(1.5), pad 8px 10px, links 74×78 with 20px icons
    // over 11px/600 text); the footer element carries pt-64/pb-56 (desktop)
    // / pt-32/pb-24 (mobile); the inner is max-w-5xl (1024); the bottom row
    // is a justify-between ROW at md (© 12px #8A8780 left, legal nav right
    // with gap 8px 20px) and a centered column on phones.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const footer = page.getByRole("contentinfo");
    const nav = footer.locator("nav").first();

    // The compact pill: shrink-wrapped (~506 = 6×74 + 5×8 + 2×10 + 2×1).
    const navW = await nav.evaluate((el) => el.getBoundingClientRect().width);
    expect(navW).toBeGreaterThanOrEqual(500);
    expect(navW).toBeLessThanOrEqual(512);
    await expect(nav).toHaveCSS("border-radius", "28px");
    await expect(nav).toHaveCSS("border-top-width", "1px");
    await expect(nav).toHaveCSS("border-top-color", "rgb(232, 230, 220)");
    // The two backdrop utilities must compose into ONE declaration.
    await expect(nav).toHaveCSS("backdrop-filter", "blur(40px) saturate(1.5)");
    const pad = await nav.evaluate((el) => getComputedStyle(el).padding);
    expect(pad).toBe("8px 10px");

    // The link tiles: 74px wide, 20px icon over 11px/600 text.
    const link = nav.getByRole("link").first();
    const linkW = await link.evaluate((el) => el.getBoundingClientRect().width);
    expect(linkW).toBeGreaterThanOrEqual(72);
    expect(linkW).toBeLessThanOrEqual(76);
    const iconH = await link.evaluate((el) => {
      const svg = el.querySelector("svg");
      return svg ? svg.getBoundingClientRect().height : 0;
    });
    expect(iconH).toBeGreaterThanOrEqual(19);
    const span = link.locator("span").first();
    await expect(span).toHaveCSS("font-size", "11px");
    await expect(span).toHaveCSS("font-weight", "600");

    // The footer element carries the vertical padding (pt-64/pb-56).
    await expect(footer).toHaveCSS("padding-top", "64px");
    await expect(footer).toHaveCSS("padding-bottom", "56px");

    // The inner is max-w-5xl (1024).
    const innerW = await footer.evaluate((el) => {
      const child = el.firstElementChild;
      return child ? child.getBoundingClientRect().width : 0;
    });
    expect(innerW).toBeGreaterThanOrEqual(1020);
    expect(innerW).toBeLessThanOrEqual(1028);

    // The bottom row: justify-between at md, 12px #8A8780 text.
    const bottomRow = footer.locator("div").filter({ hasText: "© 2026 Roam" }).last();
    await expect(bottomRow).toHaveCSS("justify-content", "space-between");
    const cr = bottomRow.locator("p").first();
    await expect(cr).toHaveCSS("font-size", "12px");
    await expect(cr).toHaveCSS("color", "rgb(138, 135, 128)");

    // Session-26 re-measure: the legal row carries a TOP HAIRLINE
    // (1px rgba(0,0,0,0.05)) + its own pt-3/sm:pt-5 padding + mt-4/sm:mt-8
    // margin — the hairline renders at every breakpoint and the legal
    // text sits 13/21px lower than a bare gap would place it.
    await expect(bottomRow).toHaveCSS("border-top-width", "1px");
    // The oklab() serialization gotcha: alpha-blended black arrives as
    // `oklab(0 0 0 / 0.05)` — assert the parsed alpha instead of the string.
    const legalBorder = await bottomRow.evaluate((el) => getComputedStyle(el).borderTopColor);
    expect(legalBorder).toMatch(/0\.05\)?$/);
    await expect(bottomRow).toHaveCSS("padding-top", "20px");
    await expect(bottomRow).toHaveCSS("margin-top", "32px");

    // Mobile (390): the footer pads 32/24 and the nav fills the width.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(footer).toHaveCSS("padding-top", "32px");
    await expect(footer).toHaveCSS("padding-bottom", "24px");
    const navWMobile = await nav.evaluate((el) => el.getBoundingClientRect().width);
    expect(navWMobile).toBeGreaterThanOrEqual(348);
    expect(navWMobile).toBeLessThanOrEqual(352);
    // The bottom row stacks (column) on phones.
    await expect(bottomRow).toHaveCSS("flex-direction", "column");
    // Session-26: the mobile legal row carries the hairline + pt-3/mt-4.
    await expect(bottomRow).toHaveCSS("border-top-width", "1px");
    await expect(bottomRow).toHaveCSS("padding-top", "12px");
    await expect(bottomRow).toHaveCSS("margin-top", "16px");

    // Session-26 re-measure — the sm (640) window: the live switches the
    // footer pads AND the legal row layout at sm, NOT md — at 640 the
    // footer already pads 64/56, the legal row is a space-between ROW,
    // and the pill caps at max-w 390 centered (the live's mobile-override
    // pill max-width; the clone rendered a 600px w-full pill there).
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(footer).toHaveCSS("padding-top", "64px");
    await expect(footer).toHaveCSS("padding-bottom", "56px");
    await expect(bottomRow).toHaveCSS("flex-direction", "row");
    await expect(bottomRow).toHaveCSS("justify-content", "space-between");
    await expect(bottomRow).toHaveCSS("padding-top", "20px");
    // The legal row is ALSO capped at 390 centered below md (the live's
    // override) — 390 wide @x=125 at 640, like the pill above it.
    const row640 = await bottomRow.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), w: Math.round(r.width) };
    });
    expect(row640.w).toBeGreaterThanOrEqual(386);
    expect(row640.w).toBeLessThanOrEqual(394);
    expect(row640.x).toBeGreaterThanOrEqual(123);
    expect(row640.x).toBeLessThanOrEqual(127);
    const navW640 = await nav.evaluate((el) => el.getBoundingClientRect().width);
    expect(navW640).toBeGreaterThanOrEqual(386);
    expect(navW640).toBeLessThanOrEqual(394);
    const navX640 = await nav.evaluate((el) => el.getBoundingClientRect().x);
    expect(Math.round(navX640)).toBeGreaterThanOrEqual(123);
    expect(Math.round(navX640)).toBeLessThanOrEqual(127);
  });

  test("page-bottom spacing matches the live (session-23): the sights pill hands off flush to the footer", async ({ page }) => {
    // Session-23 re-measure: on the live, the last sight card → the
    // More-pill = 32px (both breakpoints); the pill → the footer top = 0px
    // desktop / 22px mobile; the browse/map/detail pages end 96px above
    // the footer. The clone rendered a 176px void (pb-4 + section pb-16 +
    // main pb-16 + footer mt-8 + inner py-9).
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const footer = page.getByRole("contentinfo");
    const ftrTop = await footer.evaluate((el) => el.getBoundingClientRect().y + scrollY);
    const pill = page.getByRole("link", { name: /More Things to Do/ });
    const pillBottom = await pill.evaluate((el) => el.getBoundingClientRect().y + scrollY + el.getBoundingClientRect().height);
    // Desktop: the pill hands off FLUSH (0px ± 2).
    expect(Math.abs(ftrTop - pillBottom)).toBeLessThanOrEqual(2);

    // The last sight card → the pill = 32px (± 2).
    const cardGap = await pill.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const cards = [...document.querySelectorAll("main a")].filter((a) => {
        const ar = a.getBoundingClientRect();
        return ar.height > 150 && ar.y + scrollY < r.y + scrollY - 10;
      });
      const last = cards[cards.length - 1] as HTMLElement | undefined;
      if (!last) return -1;
      const lr = last.getBoundingClientRect();
      return r.y + scrollY - (lr.y + scrollY + lr.height);
    });
    expect(cardGap).toBeGreaterThanOrEqual(30);
    expect(cardGap).toBeLessThanOrEqual(34);

    // The browse page: the last card ends 96px above the footer (± 4).
    await page.goto("/eat", { waitUntil: "domcontentloaded" });
    const ftrTopEat = await footer.evaluate((el) => el.getBoundingClientRect().y + scrollY);
    const eatGap = await footer.evaluate((el) => {
      const cards = [...document.querySelectorAll("main a")].filter((a) => {
        const ar = a.getBoundingClientRect();
        return ar.height > 80 && ar.y + scrollY < el.getBoundingClientRect().y + scrollY - 20;
      });
      const last = cards[cards.length - 1] as HTMLElement | undefined;
      if (!last) return -1;
      const lr = last.getBoundingClientRect();
      return el.getBoundingClientRect().y + scrollY - (lr.y + scrollY + lr.height);
    });
    expect(eatGap).toBeGreaterThanOrEqual(92);
    expect(eatGap).toBeLessThanOrEqual(100);
    expect(ftrTopEat).toBeGreaterThan(0);
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
