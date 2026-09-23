import { describe, expect, it } from "vitest";
import { FILTER_CHIPS, filterPlaces, matchesChip } from "@/lib/filters";
import type { PlaceDTO } from "@/types";

// The browse-filter seam: chip semantics measured from the reference app
// (eat special chips, stay tag chips — the entities literally carry
// "Under €250"/"With pool" as tags, do tag chips + "All") and AND-across-
// chips + text-search composition.

function place(overrides: Partial<PlaceDTO> = {}): PlaceDTO {
  return {
    id: "p1",
    slug: "test-place",
    name: "Test Place",
    category: "eat",
    subCategory: "Modern Bavarian",
    shortDescription: "A calm room",
    description: null,
    coverImageUrl: null,
    galleryImages: [],
    priceRange: 3,
    price: null,
    priceLabel: null,
    nightlyPrice: null,
    currency: "EUR",
    avgRating: 4.7,
    reviewCount: 120,
    isBookable: true,
    neighborhood: "Dom Viertel",
    address: null,
    openingHours: null,
    durationMin: null,
    minParty: null,
    maxParty: null,
    vibeTags: ["Romantic"],
    cuisineTags: ["Bavarian"],
    amenities: [],
    roomTypes: [],
    highlights: [],
    tags: [],
    lat: null,
    lng: null,
    ...overrides,
  };
}

describe("FILTER_CHIPS", () => {
  it("eat carries the four special chips then tag chips", () => {
    expect(FILTER_CHIPS.eat.slice(0, 4).map((c) => c.label)).toEqual([
      "Open now",
      "Near me",
      "Under €100",
      "Trending",
    ]);
    expect(FILTER_CHIPS.eat).toContainEqual({ label: "Bavarian", kind: "tag" });
  });

  it("stay chips are the entity tag union (Under €250, With pool included)", () => {
    const labels = FILTER_CHIPS.stay.map((c) => c.label);
    expect(labels).toContain("Under €250");
    expect(labels).toContain("With pool");
  });

  it("do chips start with All then tag chips", () => {
    expect(FILTER_CHIPS.do[0]).toEqual({ label: "All", kind: "special" });
    expect(FILTER_CHIPS.do.map((c) => c.label)).toContain("Museums");
  });
});

describe("matchesChip", () => {
  it("Open now maps to bookable places", () => {
    expect(matchesChip(place(), "Open now")).toBe(true);
    expect(matchesChip(place({ isBookable: false }), "Open now")).toBe(false);
  });

  it("Near me maps to the city-center neighborhoods", () => {
    expect(matchesChip(place({ neighborhood: "Rathausplatz" }), "Near me")).toBe(true);
    expect(matchesChip(place({ neighborhood: "Pfersee" }), "Near me")).toBe(false);
  });

  it("Under €100 maps to price_range ≤ 2", () => {
    expect(matchesChip(place({ priceRange: 2 }), "Under €100")).toBe(true);
    expect(matchesChip(place({ priceRange: 3 }), "Under €100")).toBe(false);
  });

  it("Trending maps to review_count ≥ 250 or rating ≥ 4.85", () => {
    expect(matchesChip(place({ reviewCount: 300 }), "Trending")).toBe(true);
    expect(matchesChip(place({ avgRating: 4.9, reviewCount: 10 }), "Trending")).toBe(true);
    expect(matchesChip(place({ reviewCount: 10, avgRating: 4.0 }), "Trending")).toBe(false);
  });

  it("tag chips match vibes, cuisines, amenities and sub-categories case-insensitively", () => {
    expect(matchesChip(place(), "Romantic")).toBe(true);
    expect(matchesChip(place(), "bavarian")).toBe(true);
    expect(matchesChip(place({ amenities: ["With pool"] }), "With pool")).toBe(true);
    expect(matchesChip(place(), "Vegan")).toBe(false);
  });

  it("All matches everything", () => {
    expect(matchesChip(place(), "All")).toBe(true);
  });
});

describe("filterPlaces", () => {
  const places = [
    place({ slug: "a", name: "Alpha", subCategory: "Fine Dining", vibeTags: ["Romantic"], cuisineTags: ["French"], priceRange: 4 }),
    place({ slug: "b", name: "Bravo", subCategory: "Casual Bistro", vibeTags: ["Lively"], cuisineTags: ["Bavarian"], priceRange: 2, neighborhood: "Pfersee" }),
    place({ slug: "c", name: "Charlie", category: "stay", subCategory: "Boutique Rooms", vibeTags: ["Boutique"], nightlyPrice: 180 }),
  ];

  it("returns everything with no query and no chips", () => {
    expect(filterPlaces(places, "", [])).toHaveLength(3);
  });

  it("filters by text across name, tags and neighborhood", () => {
    expect(filterPlaces(places, "alpha", []).map((p) => p.slug)).toEqual(["a"]);
    expect(filterPlaces(places, "french", []).map((p) => p.slug)).toEqual(["a"]);
    expect(filterPlaces(places, "pfersee", []).map((p) => p.slug)).toEqual(["b"]);
  });

  it("ANDs across selected chips", () => {
    expect(filterPlaces(places, "", ["Romantic", "French"]).map((p) => p.slug)).toEqual(["a"]);
    expect(filterPlaces(places, "", ["Romantic", "Bavarian"])).toHaveLength(0);
  });

  it("tag chips also match sub-categories (Modern Bavarian ↔ Bavarian)", () => {
    const bavarian = place({ subCategory: "Modern Bavarian", cuisineTags: [] });
    expect(matchesChip(bavarian, "Bavarian")).toBe(true);
  });

  it("combines query AND chips", () => {
    expect(filterPlaces(places, "bravo", ["Under €100"]).map((p) => p.slug)).toEqual(["b"]);
    expect(filterPlaces(places, "alpha", ["Under €100"])).toHaveLength(0);
  });

  it("the All chip behaves as a reset", () => {
    expect(filterPlaces(places, "", ["All", "Romantic"])).toHaveLength(3);
  });
});
