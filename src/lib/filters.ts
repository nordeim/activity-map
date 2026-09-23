// Pure filter/search logic for the category views (unit-testable seam).
// Chip semantics measured from the reference app:
//   eat  → four special chips (Open now, Near me, Under €100, Trending)
//          plus tag chips from the union of vibe/cuisine tags
//   stay → tag chips from the union of vibe/amenity tags (the reference's
//          entities literally carry "Under €250" / "With pool" as tags)
//   do   → "All" plus the union of experience tags
// A place matches when it matches EVERY selected chip (AND) and the text
// query (search over name, neighborhood, sub-category, description, tags).

import type { PlaceCategory, PlaceDTO } from "@/types";

export interface ChipSpec {
  label: string;
  kind: "special" | "tag";
}

export const FILTER_CHIPS: Record<PlaceCategory, ChipSpec[]> = {
  eat: [
    { label: "Open now", kind: "special" },
    { label: "Near me", kind: "special" },
    { label: "Under €100", kind: "special" },
    { label: "Trending", kind: "special" },
    { label: "Outdoor", kind: "tag" },
    { label: "Romantic", kind: "tag" },
    { label: "French", kind: "tag" },
    { label: "Japanese", kind: "tag" },
    { label: "Bavarian", kind: "tag" },
    { label: "Mediterranean", kind: "tag" },
    { label: "Vegan", kind: "tag" },
  ],
  stay: [
    { label: "Under €250", kind: "tag" },
    { label: "Boutique", kind: "tag" },
    { label: "5-star", kind: "tag" },
    { label: "With pool", kind: "tag" },
    { label: "Breakfast", kind: "tag" },
    { label: "Old Town", kind: "tag" },
    { label: "Rooftop", kind: "tag" },
    { label: "Romantic", kind: "tag" },
  ],
  do: [
    { label: "All", kind: "special" },
    { label: "Sights", kind: "tag" },
    { label: "Tours", kind: "tag" },
    { label: "Culture", kind: "tag" },
    { label: "Outdoor", kind: "tag" },
    { label: "Museums", kind: "tag" },
    { label: "Nightlife", kind: "tag" },
    { label: "Workshops", kind: "tag" },
    { label: "Family", kind: "tag" },
  ],
};

const CITY_CENTER_NEIGHBORHOODS = new Set([
  "Innenstadt",
  "Old Town",
  "Altstadt",
  "Rathausplatz",
  "Dom Viertel",
  "Lechviertel",
  "Lech Quarter",
  "Maximilianstraße",
  "Stadtmarkt",
  "Fuggerei",
]);

function haystack(place: PlaceDTO): string {
  return [
    place.name,
    place.neighborhood ?? "",
    place.subCategory ?? "",
    place.shortDescription ?? "",
    place.vibeTags.join(" "),
    place.cuisineTags.join(" "),
    place.amenities.join(" "),
    place.roomTypes.join(" "),
    place.highlights.join(" "),
    place.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesChip(place: PlaceDTO, chip: string): boolean {
  const hay = haystack(place);
  switch (chip) {
    case "All":
      return true;
    case "Open now":
      return place.isBookable;
    case "Near me":
      return place.neighborhood ? CITY_CENTER_NEIGHBORHOODS.has(place.neighborhood) : false;
    case "Under €100":
      // Eat guide: two-euro-signs or less.
      return (place.priceRange ?? 0) <= 2;
    case "Trending":
      return place.reviewCount >= 250 || place.avgRating >= 4.85;
    default:
      // Tag chips: literal tag match (case-insensitive substring).
      return hay.includes(chip.toLowerCase());
  }
}

export function filterPlaces(
  places: PlaceDTO[],
  query: string,
  chips: string[],
): PlaceDTO[] {
  const q = query.trim().toLowerCase();
  return places.filter((p) => {
    if (q && !haystack(p).includes(q)) return false;
    // "All" behaves as a reset — ignore other chips alongside it.
    const active = chips.includes("All") ? [] : chips;
    return active.every((chip) => matchesChip(p, chip));
  });
}
