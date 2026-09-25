import { expect, test } from "@playwright/test";

// The city-guide surfaces end-to-end: the home hero + planner + category
// cards, the three browse views with search/filter chips, the place detail
// with booking, the favourites round-trip, and the map view with its
// filter pills and dot markers. Contexts arrive AUTHENTICATED
// (setup-project storageState).

test.describe("home (Highlights)", () => {
  test("hero, planner and the three category cards render", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Augsburg City Guide" })).toBeVisible();

    // The glass planner pill fields (live aria-labels; see home.spec.ts for
    // the full session-2 home content parity coverage).
    await expect(page.getByLabel("Choose trip dates")).toBeVisible();
    await expect(page.getByLabel("Number of people")).toBeVisible();
    await expect(page.getByLabel("Type of Activities")).toBeVisible();

    // The measured category cards with their counts and VIEW ALL buttons.
    // Session-10: #category-cards is the MOBILE carousel row — at the desktop
    // default viewport the three View All links live in the desktop card
    // row (all [data-category-card] articles).
    await expect(page.getByRole("heading", { name: "12 Hotels" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "12 Places to Eat" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "18 Sights to Discover" })).toBeVisible();
    await expect(page.locator("[data-category-card]:visible").getByRole("link", { name: /View All/ })).toHaveCount(3);
  });

  test("VIEW ALL navigates to the category view", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /View All/ }).first().click();
    await expect(page).toHaveURL(/\/stay\/?$/);
    await expect(page.getByRole("heading", { name: "Stay In Style" })).toBeVisible();
  });

  test("the planner submits to the category view with its parameters", async ({ page }) => {
    await page.goto("/");
    // Session 3 parity: Hotels → /stay?people=N (never the map).
    await page.getByLabel("Number of people").selectOption("3");
    await page.getByLabel("Type of Activities").selectOption("Hotels");
    await page.getByLabel("Search trip matches").click();
    await expect(page).toHaveURL(/\/stay\?people=3$/);
  });
});

test.describe("browse views", () => {
  for (const [path, title, cards, chip] of [
    ["/eat", "Eat Well Tonight", 12, "Open now"],
    ["/stay", "Stay In Style", 12, "Under €250"],
    ["/do", "Explore The City", 18, "All"],
  ] as const) {
    test(`${path} renders the headline, chips and ${cards} cards`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.locator("article")).toHaveCount(cards);
      // The measured filter chips are present (one per view).
      await expect(page.getByRole("button", { name: chip, exact: true })).toBeVisible();
      // Session-12 re-measure: the live's filter chips are compact —
      // 38px tall with 12px text (the clone had 40px/14px).
      const chipBtn = page.getByRole("button", { name: chip, exact: true });
      await expect(chipBtn).toHaveCSS("height", "38px");
      await expect(chipBtn).toHaveCSS("font-size", "12px");

      // Session-14 re-measure: the heading block matches the live — the h1
      // sits at viewport y≈168 (section pt-24 at md, was y=137 with pt-16)
      // inside the full-width max-w-7xl block, and the subtitle renders
      // 14px #3A3A3A (was 16px black/60).
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path);
      const h1Box = await page.getByRole("heading", { name: title }).boundingBox();
      expect(h1Box!.y).toBeGreaterThanOrEqual(160);
      expect(h1Box!.y).toBeLessThanOrEqual(176);
      const sub = page.locator("main > section").first().locator("p").first();
      await expect(sub).toHaveCSS("font-size", "14px");
      await expect(sub).toHaveCSS("color", "rgb(58, 58, 58)");
    });
  }

  test("search narrows the eat grid (inside the unified planner card)", async ({ page }) => {
    await page.goto("/eat");
    await page.getByLabel("Search places").fill("moss");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.locator("article").first()).toContainText("Moss & Marble");
  });

  test("the browse planner is ONE unified card: search + labelled fields + icon buttons (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/eat");
    // The live browse planner: a single white card (radius 30) containing
    // the search input, the labelled date + people fields, and two circular
    // icon action buttons — no separate search row, no type selector.
    const card = page.locator(".browse-planner-card");
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("border-radius", "30px");
    const cardShadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(cardShadow).toContain("rgba(14, 14, 14, 0.1)");
    await expect(card.getByLabel("Search places")).toBeVisible();
    await expect(card.getByText("Let's Plan Your Trip").first()).toBeVisible();
    await expect(card.getByText("People", { exact: true }).first()).toBeVisible();
    // No type-of-activities field on the browse planner (live parity).
    await expect(card.getByLabel("Type of Activities")).toHaveCount(0);
    await expect(card.getByLabel("Open category filters")).toBeVisible();

    // Desktop: one sticky white PILL (radius 999, h-68) — search inline.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/eat");
    const pill = page.locator(".browse-planner-card");
    await expect(pill).toBeVisible();
    const pillRadius = await pill.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(pillRadius).toBeGreaterThan(1000);
    await expect(pill.getByLabel("Search places")).toBeVisible();
    await expect(pill.getByText("Let's Plan Your Trip").first()).toBeVisible();
  });

  test("the browse planner forwards its params back to the category view", async ({ page }) => {
    await page.goto("/eat");
    // The date/people fields auto-forward — choosing people re-routes to the
    // same browse with the params (the grid date-filters server-side).
    await page.getByLabel("Number of people").selectOption("4");
    await expect(page).toHaveURL(/\/eat\?people=4$/);
  });

  test("eat card photos render 300px on mobile, 372px on desktop (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/eat");
    const photo = page.locator("article img").first();
    const h = await photo.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(h)).toBe(300);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/eat");
    const photoDesktop = page.locator("article img").first();
    const hD = await photoDesktop.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(hD)).toBe(372);
  });

  test("filter chips narrow the grid AND compose", async ({ page }) => {
    await page.goto("/eat");
    await expect(page.locator("article")).toHaveCount(12);
    await page.getByRole("button", { name: "Romantic" }).click();
    const romantic = await page.locator("article").count();
    expect(romantic).toBeGreaterThan(0);
    expect(romantic).toBeLessThan(12);
    await page.getByRole("button", { name: "French" }).click();
    const both = await page.locator("article").count();
    expect(both).toBeLessThanOrEqual(romantic);
  });

  test("the do view's All chip resets the filters", async ({ page }) => {
    await page.goto("/do");
    await page.getByRole("button", { name: "Museums", exact: true }).click();
    const museums = await page.locator("article").count();
    expect(museums).toBeGreaterThan(0);
    expect(museums).toBeLessThan(18);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.locator("article")).toHaveCount(18);
  });
});

test.describe("place detail", () => {
  test("renders the measured Courtyard Stay page with the booking request form", async ({ page }) => {
    await page.goto("/place/courtyard-stay");
    await expect(page.getByText("Stay", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Courtyard Stay", exact: true })).toBeVisible();
    await expect(page.getByText("Dom Viertel 14")).toBeVisible();
    await expect(page.getByText("4.8", { exact: true }).first()).toBeVisible();
    // The live app's request form (session 3): About this place + the
    // Name/Surname/Dates/Time/Phone/Email/Message fields + violet Book Now.
    await expect(page.getByRole("heading", { name: "About this place" })).toBeVisible();
    // Session-8 re-measure: About this place is a FIXED 34px heading.
    await expect(page.getByRole("heading", { name: "About this place" })).toHaveCSS("font-size", "34px");
    // Session-14 re-measure: the form card leads with the 18px "Book Now"
    // heading, the request line is its 14px #888580 subtitle (the live
    // demoted the old 18px request-heading), the card is a plain white
    // rounded-28 with the black/8 hairline and NO shadow, and the fields
    // render SINGLE-COLUMN full-width (was a 2-column 158px grid).
    const formCard = page.locator("#book-now");
    const bookHeading = formCard.getByRole("heading", { name: "Book Now" });
    await expect(bookHeading).toBeVisible();
    await expect(bookHeading).toHaveCSS("font-size", "18px");
    const requestLine = page.getByText(/Send your booking request for Courtyard Stay/);
    await expect(requestLine).toBeVisible();
    await expect(requestLine).toHaveCSS("font-size", "14px");
    await expect(requestLine).toHaveCSS("color", "rgb(136, 133, 128)");
    for (const field of ["Name", "Surname", "Dates", "Time", "Phone", "Email", "Message"]) {
      await expect(page.getByLabel(field, { exact: false }).first()).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(formCard).toHaveCSS("border-radius", "28px");
    await expect(formCard).toHaveCSS("border-top-color", "rgba(14, 14, 14, 0.08)");
    const formShadow = await formCard.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(formShadow).toBe("none");
    const nameX = await page.getByLabel("Name", { exact: true }).boundingBox();
    const surnameX = await page.getByLabel("Surname", { exact: true }).boundingBox();
    expect(Math.abs(nameX!.x - surnameX!.x)).toBeLessThanOrEqual(2);
  });

  test("photo overlays: the white rating pill on the photo, no Map button (session 8)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/place/courtyard-stay", { waitUntil: "domcontentloaded" });
    // The rating rides ON the photo as a white pill (top-right)…
    const ratingPill = page.locator("[data-photo-rating]");
    await expect(ratingPill).toBeVisible();
    await expect(ratingPill).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(ratingPill).toContainText("4.8");
    // …and the Map link is GONE from the photo (live parity). Scoped to
    // main: the navbar and footer carry their own Map links.
    await expect(page.locator("main").getByRole("link", { name: "Map", exact: true })).toHaveCount(0);
    // The mobile hero photo is 260px tall (desktop keeps 460px).
    const photo = page.locator("main img").first();
    const h = await photo.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(h)).toBe(260);

    // Session-10 re-measure: the heart overlay is a 44×44 dark glass circle
    // (the live's h-11 button), not the old 36px h-9.
    const heart = page.getByRole("button", { name: "Save to favourites" }).first();
    const heartBox = await heart.boundingBox();
    expect(heartBox).not.toBeNull();
    expect(Math.round(heartBox!.width)).toBe(44);
    expect(Math.round(heartBox!.height)).toBe(44);
  });

  test("detail page container: max-w-6xl rounded-36 card, no border (session 10)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/place/courtyard-stay", { waitUntil: "domcontentloaded" });
    // The live detail page is ONE wide white card (max-w-6xl ≈ 1152px at
    // 1280) with a 36px radius and NO border — shadow only.
    const card = page.locator("main article").first();
    await expect(card).toHaveCSS("border-radius", "36px");
    await expect(card).toHaveCSS("border-top-width", "0px");
    const cardBox = await card.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(cardBox!.width).toBeGreaterThan(1100);
    expect(cardBox!.width).toBeLessThan(1180);
    // Session-14 re-measure: the live's h1 tops at y≈225 (section pt-6 at
    // md + the card's p-10 inner padding — the clone ran 36px lower with
    // pt-10/pt-14).
    const detailH1Box = await page.getByRole("heading", { name: "Courtyard Stay", exact: true }).boundingBox();
    expect(detailH1Box!.y).toBeGreaterThanOrEqual(215);
    expect(detailH1Box!.y).toBeLessThanOrEqual(235);
    // The desktop hero photo is 460px at lg (and 420px at md).
    const photo = page.locator("main img").first();
    const photoH = await photo.evaluate((el) => Math.round(el.getBoundingClientRect().height));
    expect(photoH).toBe(460);
  });

  test("booking records a request visible on the profile", async ({ page }) => {
    await page.goto("/place/courtyard-stay");
    await page.getByLabel("Name", { exact: true }).fill("Ada");
    await page.getByLabel("Surname", { exact: true }).fill("Lovelace");
    await page.getByLabel("Dates", { exact: true }).fill("2026-10-01");
    await page.getByLabel("Time", { exact: true }).fill("19:00");
    await page.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await page.getByRole("button", { name: "Book Now" }).click();
    await expect(page.getByText(/Request sent/)).toBeVisible({ timeout: 15_000 });

    await page.goto("/profile");
    await expect(page.getByText("My bookings")).toBeVisible();
    await expect(page.getByText("Courtyard Stay")).toBeVisible();
  });
});

test.describe("footer on every app page (session 6)", () => {
  // Session-16: /profile left this list — the live's profile page renders
  // WITHOUT the app chrome (no navbar, no footer; pinned by the profile
  // tests above).
  const PAGES = ["/eat", "/stay", "/do", "/map", "/favourites", "/place/moss-marble"];
  for (const path of PAGES) {
    test(`footer renders on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();
      // The white icon-cell pill carries the six view links.
      await expect(footer.getByRole("navigation", { name: "Footer" })).toBeVisible();
      await expect(footer.getByRole("link", { name: "Favourites", exact: true })).toBeVisible();
      await expect(footer.getByText("© 2026 Roam. Activity Map for Augsburg.")).toBeVisible();
      await expect(footer.getByRole("link", { name: "Privacy policy" })).toBeVisible();
    });
  }
});

test.describe("favourites round-trip", () => {
  test("a heart tap saves a place; Favourites lists and clears it", async ({ page }) => {
    await page.goto("/eat");
    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: "Save to favourites" }).click();
    await expect(firstCard.getByRole("button", { name: "Remove from favourites" })).toBeVisible();

    // domcontentloaded: card imagery comes from the reference CDN — the
    // full "load" event can stall behind a slow image under network
    // contention and has caused spurious 45s timeouts.
    await page.goto("/favourites", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Favourites" })).toBeVisible();
    await expect(page.getByText("All saved restaurants, hotels, and places in one calm collection.")).toBeVisible();
    await expect(page.locator("article")).toHaveCount(1);

    // Session-10 re-measure: the h1 is the live's declared text-[55px] with
    // leading-[0.92] and tracking-[-0.06em] (asserted at the desktop
    // viewport — narrow viewports trigger Chromium's mobile text-size
    // adjustment on the reference, which is environment noise, not design).
    await page.setViewportSize({ width: 1280, height: 800 });
    const favH1 = page.getByRole("heading", { name: "Favourites" });
    await expect(favH1).toHaveCSS("font-size", "55px");
    await expect(favH1).toHaveCSS("letter-spacing", "-3.3px");
    // Session-12 re-measure: the live REGAINED the graph-paper grid — an
    // 18px-crossing overlay (rgba(20,20,19,0.055) lines at opacity 40%).
    // The main itself stays plain cream; the grid rides an absolute child.
    const mainBg = await page.locator("main").first().evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(mainBg).toBe("none");
    const hasGrid = await page.locator("main").first().evaluate((el) => {
      const overlay = el.querySelector("div[class*=opacity-40], div[style*=opacity]");
      if (!overlay) return false;
      const bg = getComputedStyle(overlay).backgroundImage;
      return bg !== "none" && bg.includes("linear-gradient");
    });
    expect(hasGrid, "the favourites page should carry the 18px grid overlay").toBe(true);
    // Session-14 re-measure: the overlay is scoped INSIDE the heading
    // section (h≈299 on the live — the texture covers the heading block
    // only, not the whole page), and the h1 sits at viewport y≈244 (the
    // live's pt-24 + the 56px heart icon above it).
    const overlayBox = await page.locator("main div[class*=opacity-40]").first().boundingBox();
    expect(overlayBox!.height).toBeLessThan(400);
    const favH1Box = await favH1.boundingBox();
    expect(favH1Box!.y).toBeGreaterThanOrEqual(230);
    expect(favH1Box!.y).toBeLessThanOrEqual(258);
    // Session-12: the subtitle renders 14px #3A3A3A (was 16px black/60).
    const sub = page.getByText("All saved restaurants, hotels, and places in one calm collection.");
    await expect(sub).toHaveCSS("font-size", "14px");
    await expect(sub).toHaveCSS("color", "rgb(58, 58, 58)");

    await page.locator("article").first().getByRole("button", { name: "Remove from favourites" }).click();
    await expect(page.getByText("No favourites yet")).toBeVisible();
    await expect(page.getByText("Tap a heart on any restaurant, hotel, or place card to save it here.")).toBeVisible();

    // Session-10 re-measure: the empty state mirrors the live — Inter
    // (sans) 20px semibold title over a 48px cream icon circle, not the old
    // serif title in the 56px deep-cream circle.
    const emptyTitle = page.getByText("No favourites yet");
    const emptyFont = await emptyTitle.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(emptyFont.toLowerCase()).toContain("inter");
    await expect(emptyTitle).toHaveCSS("font-size", "20px");
    await expect(emptyTitle).toHaveCSS("font-weight", "600");
  });
});

test.describe("map view", () => {
  test("renders the headline, filter pills, dot markers and the status badge", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByRole("heading", { name: "Map", exact: true })).toBeVisible();
    await expect(page.getByText("Augsburg restaurants, hotels and experiences plotted across the old town.")).toBeVisible();
    for (const label of ["All Places", "Restaurants", "Hotels", "Sights"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }

    // Session-12 re-measure: the pills are 41px tall with 12px text (the
    // live compacted them from 44/14) — the ACTIVE pill stays
    // violet-tinted (bg rgb(240,234,255), text rgb(87,26,255));
    // inactive = white + rgba(14,14,14,0.08) border.
    const activePill = page.getByRole("button", { name: "All Places", exact: true });
    await expect(activePill).toHaveCSS("background-color", "rgb(240, 234, 255)");
    await expect(activePill).toHaveCSS("color", "rgb(87, 26, 255)");
    await expect(activePill).toHaveCSS("font-size", "12px");
    await expect(activePill).toHaveCSS("height", "41px");
    await expect(activePill.locator("svg").first()).toBeVisible();
    const inactivePill = page.getByRole("button", { name: "Sights", exact: true });
    await expect(inactivePill).toHaveCSS("background-color", "rgb(255, 255, 255)");

    // Session-12 re-measure: the search bar is FULL-WIDTH (≈1138px at
    // 1280, with a black/5 border) — not the old centered 516px pill.
    const search = page.getByLabel("Search the map");
    const searchBar = search.locator("xpath=ancestor::div[contains(@class,'rounded-full')][1]");
    const searchBarBox = await searchBar.boundingBox();
    expect(searchBarBox).not.toBeNull();
    expect(searchBarBox!.width).toBeGreaterThan(1000);

    // The nine demo pins plot as dot markers (session 3 parity — the
    // browse entities never appear on the live map).
    await expect(page.locator(".roam-marker")).toHaveCount(9);
    await expect(page.getByText("9 places")).toBeVisible();
    await expect(page.getByText("Places on the map")).toBeVisible();

    // Session-14 re-measure: the live's list cards are TEXT-ONLY — no
    // photos — 24px-radius white cards with the category eyebrow, 15px/600
    // titles, and the €-price meta (the clone rendered 90px image rows).
    // Session-16 re-measure: the live's card is a FOUR-row layout — the
    // eyebrow + price sit on ONE justified row (price right), the title
    // below, and the 12px #888580 NEIGHBORHOOD line at the bottom
    // (card h≈119) — and the do-places render their SUB-CATEGORY as the
    // eyebrow (LANTERN WALK / ROOFTOP MUSIC / ART WORKSHOP), not "SIGHT".
    const listSection = page.locator("#places-list");
    await expect(listSection).toBeVisible();
    await expect(listSection.locator("img")).toHaveCount(0);
    const listCard = listSection.locator("a").first();
    await expect(listCard).toHaveCSS("border-radius", "24px");
    // Session-16 order: the live's hardcoded array is interleaved — Brass &
    // Marble first, then Ember Garden, then Cloud Nine Hotel.
    await expect(listCard).toContainText("Brass & Marble");
    await expect(listCard).toContainText("Innenstadt");
    const cardBox = await listCard.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(cardBox!.height).toBeGreaterThanOrEqual(105);
    expect(cardBox!.height).toBeLessThanOrEqual(128);
    // The price rides the eyebrow row (right-aligned): its y matches the
    // eyebrow's y within 6px.
    const priceOnEyebrowRow = await listCard.evaluate((el) => {
      const spans = [...el.querySelectorAll("p, span")] as HTMLElement[];
      const eyebrow = spans.find((s) => /HOTEL|RESTAURANT|WALK|MUSIC|WORKSHOP/.test(s.innerText));
      const price = spans.find((s) => /^€+$/.test(s.innerText));
      if (!eyebrow || !price) return false;
      return Math.abs(eyebrow.getBoundingClientRect().y - price.getBoundingClientRect().y) < 6;
    });
    expect(priceOnEyebrowRow).toBe(true);
    // The do-places carry their sub-category as the eyebrow (no "SIGHT").
    await expect(listSection).toContainText("LANTERN WALK");
    await expect(listSection).toContainText("ROOFTOP MUSIC");
    await expect(listSection).toContainText("ART WORKSHOP");
    await expect(listSection.getByText("Sight", { exact: true })).toHaveCount(0);

    // The Hotels pill narrows the canvas.
    await page.getByRole("button", { name: "Hotels", exact: true }).click();
    await expect(page.locator(".roam-marker")).toHaveCount(3);
    await expect(page.getByText("3 places")).toBeVisible();
  });
});

test.describe("profile", () => {
  test("renders the profile identity, booking tabs and the empty state", async ({ page }) => {
    await page.goto("/profile");
    // Session-14 re-measure: the live identity now renders the USERNAME
    // ("sepnetflix2023") as the 72px h1 with the EMAIL as the 16px #555550
    // line below it — "Your Roam account" is gone (the two-glass-card
    // layout itself is unchanged from session 12).
    await expect(page.getByText("Profile", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "sepnetflix2023" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "sepnetflix2023" })).toHaveCSS("font-size", "72px");
    await expect(page.getByText("sepnetflix2023@outlook.com")).toBeVisible();
    await expect(page.getByText("Your Roam account")).toHaveCount(0);

    // Session-16 re-measure: the live's profile is a CHROME-LESS page — no
    // navbar at any breakpoint, no footer — carrying a FULL-PAGE fixed
    // 18px graph-paper grid overlay (opacity 40, pointer-events none),
    // with the outer block running px-5/pt-10 → md:px-8/md:pt-16 and the
    // main at max-w-4xl so the h1 tops at y≈203 on desktop.
    await expect(page.locator("nav[aria-label=Primary]")).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);
    const gridOverlay = page.locator("div.pointer-events-none.fixed.inset-0.opacity-40");
    await expect(gridOverlay).toHaveCount(1);
    await expect(gridOverlay).toHaveCSS("background-size", "18px 18px, 18px 18px");
    const h1Box = await page.getByRole("heading", { name: "sepnetflix2023" }).boundingBox();
    expect(h1Box).not.toBeNull();
    expect(h1Box!.y).toBeGreaterThanOrEqual(192);
    expect(h1Box!.y).toBeLessThanOrEqual(214);

    // The identity card: rounded-[36px] white/78 glass with the stat chips
    // (Augsburg, 0 day streak, Explorer badge) and the dark Saved-places
    // button (heart icon + bare label — 154×44 on the live).
    await expect(page.getByText("Augsburg", { exact: true })).toBeVisible();
    await expect(page.getByText("0 day streak")).toBeVisible();
    const savedBtn = page.getByRole("link", { name: "Saved places", exact: true });
    await expect(savedBtn).toHaveAttribute("href", "/favourites");
    await expect(savedBtn).toHaveCSS("background-color", "rgb(14, 14, 14)");
    await expect(savedBtn.locator("svg").first()).toBeVisible();
    await expect(page.getByText(/Saved places ·/)).toHaveCount(0);

    // Session-12: "My bookings" is an H2 at 36px (was a 14px span).
    const bookingsH2 = page.getByRole("heading", { name: "My bookings" });
    await expect(bookingsH2).toBeVisible();
    await expect(bookingsH2).toHaveCSS("font-size", "36px");

    // Either the empty-upcoming state or an earlier test's reservation —
    // both prove the section renders. .first(): with zero bookings BOTH the
    // "Upcoming (0)" tab and the empty-state paragraph exist at once, and an
    // un-scoped .or() would trip strict mode on the pair.
    await expect(
      page.getByText("No upcoming reservations. Time to explore.").or(page.getByText("Upcoming (")).first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });

  test("profile identity centers on mobile; the back control is a Go back button (session 16)", async ({ page }) => {
    // Session-16 re-measure: the live's identity block runs text-center →
    // md:text-left (the h1/email/chips/Saved button center on phones),
    // the chip icons are map-pin / SUN / HEART (not flame/compass), and
    // the back control is a 44px white/80 "Go back" BUTTON at the very
    // top of the main (y≈64 on desktop).
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    const identity = page.locator("section").first();
    await expect(identity).toHaveCSS("text-align", "center");
    const h1Box = await page.getByRole("heading", { name: "sepnetflix2023" }).boundingBox();
    expect(h1Box).not.toBeNull();
    expect(h1Box!.y).toBeGreaterThanOrEqual(155);
    expect(h1Box!.y).toBeLessThanOrEqual(180);
    const streakChip = page.getByText("0 day streak");
    await expect(streakChip.locator("svg.lucide-sun")).toHaveCount(1);
    await expect(page.getByText("Explorer", { exact: true }).locator("svg.lucide-heart")).toHaveCount(1);
    const back = page.getByRole("button", { name: "Go back" });
    await expect(back).toBeVisible();
    const backBox = await back.boundingBox();
    expect(backBox).not.toBeNull();
    expect(Math.round(backBox!.width)).toBe(44);
    expect(Math.round(backBox!.height)).toBe(44);

    // Desktop: the identity block goes left-aligned.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    await expect(page.locator("section").first()).toHaveCSS("text-align", "left");
  });

  test("profile category filters carry icons; a Back control exists (session 8)", async ({ page }) => {
    await page.goto("/profile");
    // The All/Eat/Stay/Do booking filter chips carry icons on the live app.
    const eatChip = page.getByRole("button", { name: "eat", exact: true });
    await expect(eatChip.locator("svg").first()).toBeVisible();
    // A Back control returns to the home page (session-16: the live's
    // control is a "Go back" button).
    const back = page.getByRole("button", { name: "Go back" });
    await expect(back).toBeVisible();
  });
});
