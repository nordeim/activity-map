// Domain queries + serialisation for places, favourites and bookings.

import type { Place, Prisma } from "@prisma/client";
import { db } from "./db";
import type { BookingDTO, PlaceCategory, PlaceDTO } from "@/types";

type PlaceWithSaved = Place & { savedBy?: { userId: string }[] };

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function toPlaceDTO(p: PlaceWithSaved, userId?: string): PlaceDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category as PlaceCategory,
    subCategory: p.subCategory,
    shortDescription: p.shortDescription,
    description: p.description,
    coverImageUrl: p.coverImageUrl,
    galleryImages: parseJsonArray(p.galleryImages),
    priceRange: p.priceRange,
    price: p.price,
    priceLabel: p.priceLabel,
    nightlyPrice: p.nightlyPrice,
    currency: p.currency,
    avgRating: p.avgRating,
    reviewCount: p.reviewCount,
    isBookable: p.isBookable,
    neighborhood: p.neighborhood,
    address: p.address,
    openingHours: p.openingHours,
    durationMin: p.durationMin,
    minParty: p.minParty,
    maxParty: p.maxParty,
    vibeTags: parseJsonArray(p.vibeTags),
    cuisineTags: parseJsonArray(p.cuisineTags),
    amenities: parseJsonArray(p.amenities),
    roomTypes: parseJsonArray(p.roomTypes),
    highlights: parseJsonArray(p.highlights),
    tags: parseJsonArray(p.tags),
    lat: p.lat,
    lng: p.lng,
    saved: userId ? p.savedBy?.some((s) => s.userId === userId) ?? false : false,
  };
}

export async function listPlaces(category?: PlaceCategory): Promise<Place[]> {
  const where: Prisma.PlaceWhereInput = { status: "published" };
  if (category) where.category = category;
  return db.place.findMany({ where, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function listPlacesForUser(
  userId: string,
  category?: PlaceCategory,
): Promise<PlaceDTO[]> {
  const where: Prisma.PlaceWhereInput = { status: "published" };
  if (category) where.category = category;
  const rows = await db.place.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { savedBy: { where: { userId }, select: { userId: true } } },
  });
  return rows.map((r) => toPlaceDTO(r, userId));
}

export async function getPlaceBySlug(slug: string, userId?: string): Promise<PlaceDTO | null> {
  const row = await db.place.findUnique({
    where: { slug },
    include: userId ? { savedBy: { where: { userId }, select: { userId: true } } } : undefined,
  });
  return row ? toPlaceDTO(row, userId) : null;
}

export async function countPlaces(): Promise<Record<PlaceCategory, number>> {
  const [eat, stay, doit] = await Promise.all([
    db.place.count({ where: { category: "eat", status: "published" } }),
    db.place.count({ where: { category: "stay", status: "published" } }),
    db.place.count({ where: { category: "do", status: "published" } }),
  ]);
  return { eat, stay, do: doit };
}

export async function listFavourites(userId: string): Promise<PlaceDTO[]> {
  const rows = await db.savedPlace.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { place: true },
  });
  // Every place in this list is saved by definition — the heart must render
  // in its "remove" state without a second savedBy query.
  return rows.map((r) => ({ ...toPlaceDTO(r.place, userId), saved: true }));
}

export function toBookingDTO(
  b: { id: string; placeId: string; startDate: Date | null; endDate: Date | null; guests: number; status: string; createdAt: Date },
  place: { slug: string; name: string; category: string; coverImageUrl: string | null; neighborhood: string | null },
): BookingDTO {
  return {
    id: b.id,
    placeId: b.placeId,
    placeSlug: place.slug,
    placeName: place.name,
    placeCategory: place.category as PlaceCategory,
    coverImageUrl: place.coverImageUrl,
    neighborhood: place.neighborhood,
    startDate: b.startDate ? b.startDate.toISOString() : null,
    endDate: b.endDate ? b.endDate.toISOString() : null,
    guests: b.guests,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  };
}

export async function listBookings(userId: string): Promise<BookingDTO[]> {
  const rows = await db.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { place: true },
  });
  return rows.map((r) => toBookingDTO(r, r.place));
}
