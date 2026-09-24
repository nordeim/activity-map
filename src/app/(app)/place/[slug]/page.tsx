import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getPlaceBySlug } from "@/lib/places";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { priceRangeSymbols } from "@/lib/utils";
import { CATEGORY_META } from "@/types";
import { SaveButton } from "@/components/places/SaveButton";
import { BookingForm } from "@/components/places/BookingForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  return { title: place ? place.name : "Place" };
}

export default async function PlaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getSessionUser();
  const place = await getPlaceBySlug(slug, user?.uid);
  if (!place) notFound();

  const meta = CATEGORY_META[place.category];
  const tags = place.vibeTags.length
    ? place.vibeTags
    : place.cuisineTags.length
      ? place.cuisineTags
      : place.tags;

  return (
    <main className="mx-auto max-w-[1000px] px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
      {/* Back */}
      <div className="mb-6">
        <Link
          href={meta.href}
          className="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-white py-2.5 pl-5 pr-7 text-sm font-semibold text-ink shadow-float transition hover:bg-black/[0.03]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} aria-hidden />
          Back
        </Link>
      </div>

      <article className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.18)]">
        {/* Header — the live app's measured stack: eyebrow, 82px h1, meta row. */}
        <header className="px-6 pb-8 pt-10 sm:px-12 sm:pb-10 sm:pt-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black/35">
            {meta.eyebrow}
          </p>
          <h1 className="mb-5 font-serif text-[clamp(42px,13vw,82px)] leading-[1.02] tracking-[-0.06em] text-ink">
            {place.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-black/55">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              {place.address ?? place.neighborhood ?? "Augsburg"}
            </span>
            {place.priceRange ? (
              <>
                <span className="text-black/25">•</span>
                <span className="tracking-widest">{priceRangeSymbols(place.priceRange)}</span>
              </>
            ) : null}
            {place.reviewCount > 0 ? (
              <>
                <span className="text-black/25">•</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden />
                  {place.avgRating.toFixed(1)}
                </span>
              </>
            ) : null}
          </div>
        </header>

        {/* Hero image */}
        <section className="relative h-[380px] w-full sm:h-[460px]">
          {place.coverImageUrl ? (
            <img
              src={place.coverImageUrl}
              alt={place.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-deep font-serif text-6xl text-black/20">
              {place.name.charAt(0)}
            </div>
          )}

          <SaveButton placeId={place.id} initialSaved={place.saved ?? false} className="absolute left-5 top-5 sm:left-6 sm:top-6" />

          <div className="absolute right-5 top-5 flex items-center gap-2 sm:right-6 sm:top-6">
            <Link
              href={`/map?place=${place.slug}`}
              className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-lg transition hover:bg-cream"
            >
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              Map
            </Link>
          </div>
        </section>

        {/* Body — About this place + tags, then the booking request form. */}
        <div className="grid grid-cols-1 gap-10 p-6 sm:p-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <h2 className="font-serif text-[clamp(26px,7.2vw,34px)] leading-[1.08] tracking-[-0.03em] text-ink">About this place</h2>
            {place.description ? (
              <p className="text-base leading-relaxed text-secondary">{place.description}</p>
            ) : null}

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface2 px-3 py-1.5 text-xs font-semibold text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* The booking request form (the live app's Book Now card). */}
          <aside className="lg:col-span-2">
            <BookingForm
              place={{
                id: place.id,
                slug: place.slug,
                name: place.name,
                category: place.category,
                isBookable: place.isBookable,
                nightlyPrice: place.nightlyPrice,
                price: place.price,
                priceLabel: place.priceLabel,
                currency: place.currency,
                avgRating: place.avgRating,
                reviewCount: place.reviewCount,
                minParty: place.minParty,
                maxParty: place.maxParty,
              }}
            />
          </aside>
        </div>
      </article>
    </main>
  );
}
