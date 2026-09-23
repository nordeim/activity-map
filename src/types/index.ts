// Domain types shared between server components and client components.
// JSON-array columns (tags, amenities, …) are parsed into real arrays in the
// DTOs so client components receive plain serialisable data.

export type PlaceCategory = "eat" | "stay" | "do";

export interface PlaceDTO {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  subCategory: string | null;
  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;
  galleryImages: string[];
  priceRange: number | null;
  price: number | null;
  priceLabel: string | null;
  nightlyPrice: number | null;
  currency: string;
  avgRating: number;
  reviewCount: number;
  isBookable: boolean;
  neighborhood: string | null;
  address: string | null;
  openingHours: string | null;
  durationMin: number | null;
  minParty: number | null;
  maxParty: number | null;
  vibeTags: string[];
  cuisineTags: string[];
  amenities: string[];
  roomTypes: string[];
  highlights: string[];
  tags: string[];
  lat: number | null;
  lng: number | null;
  saved?: boolean;
}

export interface CategoryMeta {
  key: PlaceCategory;
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export const CATEGORY_META: Record<PlaceCategory, CategoryMeta> = {
  eat: {
    key: "eat",
    href: "/eat",
    label: "Eat",
    eyebrow: "Eat",
    title: "Eat Well Tonight",
    subtitle: "Browse real favorites and fictional restaurant concepts styled like the main page.",
    searchPlaceholder: "Search restaurants, cuisines, vibes...",
  },
  stay: {
    key: "stay",
    href: "/stay",
    label: "Stay",
    eyebrow: "Stay",
    title: "Stay In Style",
    subtitle: "Browse polished hotel stays, boutique rooms, and rooftop escapes styled like the dining guide.",
    searchPlaceholder: "Search hotels, amenities, vibes...",
  },
  do: {
    key: "do",
    href: "/do",
    label: "Do",
    eyebrow: "Do",
    title: "Explore The City",
    subtitle: "Browse cinematic sights, local experiences, cultural routes, and playful things to do around Augsburg.",
    searchPlaceholder: "Search sights, tours, experiences...",
  },
};

export interface BookingDTO {
  id: string;
  placeId: string;
  placeSlug: string;
  placeName: string;
  placeCategory: PlaceCategory;
  coverImageUrl: string | null;
  neighborhood: string | null;
  startDate: string | null;
  endDate: string | null;
  guests: number;
  status: string;
  createdAt: string;
  // Booking-request fields (session 3 parity — the live app's request form).
  name: string | null;
  surname: string | null;
  time: string | null;
  phone: string | null;
  email: string | null;
  message: string | null;
}
