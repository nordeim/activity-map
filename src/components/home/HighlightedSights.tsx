import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { SaveButton } from "@/components/places/SaveButton";
import type { PlaceDTO } from "@/types";

// The Highlighted Sights grid — re-measured from the live app (session 6):
// six calm stops (Fuggerei → Schaezlerpalais) as SQUARE photo cards (aspect
// 1/1, rounded 24, dark bg) with the heart overlay, the white rating pill,
// and a hanging white-on-photo panel (absolute bottom-[-30px]) — Inter 18/500
// title, the neighborhood | category meta row, and the full-width VIOLET
// Learn More pill that slides in on hover. Closes with the "More Things to
// Do" hand-off to /do.

export function HighlightedSights({ sights }: { sights: PlaceDTO[] }) {
  if (sights.length === 0) return null;
  return (
    <section id="highlighted-sights" className="mx-auto max-w-[1120px] px-4 pb-6 sm:px-6">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="font-serif text-[42px] leading-[1.05] tracking-[-0.055em] text-ink sm:text-[clamp(42px,6.5vw,86px)]">
          Highlighted Sights
        </h2>
        <p className="mt-4 text-sm font-light text-black/60 sm:text-base">
          Six calm stops for a scenic Augsburg route between meals, stays, and evening plans.
        </p>
      </div>

      <ul className="relative mx-auto mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
        {sights.map((sight) => (
          <li key={sight.slug}>
            <article className="group h-full">
              <Link href={`/place/${sight.slug}`} className="block h-full">
                <div className="relative aspect-square cursor-pointer overflow-hidden rounded-[24px] bg-[#181818] shadow-[0_18px_44px_rgba(14,14,14,0.1)] transition-transform duration-300 ease-out group-hover:-translate-y-1">
                {sight.coverImageUrl ? (
                  <img
                    src={sight.coverImageUrl}
                    alt={sight.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-white/20">
                    {sight.name.charAt(0)}
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/[0.72]"
                />

                <SaveButton
                  placeId={sight.id}
                  initialSaved={sight.saved ?? false}
                  className="absolute left-4 top-4"
                />
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5">
                  <Star className="h-[13px] w-[13px] fill-ink text-ink" aria-hidden />
                  <span className="text-xs font-bold text-ink">{sight.avgRating.toFixed(1)}</span>
                </span>

                {/* The hanging white panel — title + meta on the photo, the
                    violet Learn More pill slides up on hover. */}
                <div className="absolute bottom-[-30px] left-[18px] right-[18px] font-inter text-white transition-transform duration-300 ease-out group-hover:-translate-y-12">
                  <h3 className="m-0 text-[18px] font-medium leading-tight tracking-[-0.03em] text-white">
                    {sight.name}
                  </h3>
                  <p className="mt-2 flex items-center justify-between gap-3 text-xs text-white/70">
                    <span className="truncate">{sight.neighborhood}</span>
                    <span className="shrink-0">{sight.subCategory}</span>
                  </p>
                  <div className="mt-3 flex translate-y-4 items-center justify-center opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="flex h-9 w-full items-center justify-center rounded-full bg-roam text-xs font-bold text-white shadow-[0_12px_28px_rgba(87,26,255,0.28)]">
                      Learn More
                    </span>
                  </div>
                </div>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>

      {/* The More Things to Do hand-off */}
      <div className="mt-12 flex justify-center pb-4">
        <Link
          href="/do"
          className="group flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-ink shadow-float transition hover:border-ink"
        >
          More Things to Do
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
