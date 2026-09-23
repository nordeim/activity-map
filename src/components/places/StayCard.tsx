"use client";

// The browse-grid card for Stay (re-measured from the live app, session 3):
// a SQUARE dark card — aspect-square, rounded-[24px], bg #181818, the image
// at h-[118%] (hover: scale 1.06 + brightness 75) — with the name (Inter
// 18px medium, tracking −0.03em), the address + "price · sub-category" row,
// and the ghost "Learn More" + white "Book Now" buttons that slide up on
// md-hover (always visible on touch sizes).

import Link from "next/link";
import { Star } from "lucide-react";
import type { PlaceDTO } from "@/types";
import { SaveButton } from "./SaveButton";

export function StayCard({ place }: { place: PlaceDTO }) {
  return (
    <article className="group h-full">
      <Link href={`/place/${place.slug}`} className="block h-full">
        <div className="relative aspect-square cursor-pointer overflow-hidden rounded-[24px] bg-[#181818] shadow-[0_18px_44px_rgba(14,14,14,0.1)] transition-transform duration-300 ease-out group-hover:-translate-y-1">
          {place.coverImageUrl ? (
            <img
              src={place.coverImageUrl}
              alt={place.name}
              loading="lazy"
              className="h-[118%] w-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.06] group-hover:brightness-75"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-white/20">
              {place.name.charAt(0)}
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/[0.96]"
          />

          <SaveButton
            placeId={place.id}
            initialSaved={place.saved ?? false}
            className="absolute left-4 top-4 z-10"
          />

          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5">
            <Star className="h-[13px] w-[13px] fill-ink text-ink" aria-hidden />
            <span className="text-xs font-bold text-ink">{place.avgRating.toFixed(1)}</span>
          </div>

          <div className="absolute bottom-[18px] left-[18px] right-[18px] text-white transition-transform duration-300 ease-out md:bottom-[-30px] md:group-hover:-translate-y-12">
            <h3 className="text-lg font-medium leading-tight tracking-[-0.03em] text-white">
              {place.name}
            </h3>
            <p className="mt-2 flex justify-between gap-3 text-xs text-white/70">
              <span className="truncate">{place.address ?? place.neighborhood ?? "Augsburg"}</span>
              <span className="shrink-0">
                <span className="text-[13px] text-white">{place.price ?? place.nightlyPrice ?? ""}</span>
                {place.subCategory ? ` · ${place.subCategory}` : ""}
              </span>
            </p>
            <div className="mt-3 flex translate-y-0 gap-2 opacity-100 transition-all duration-300 ease-out md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <span className="flex h-9 flex-1 items-center justify-center rounded-full border border-white/35 bg-white/10 text-xs font-semibold text-white transition-all duration-200 hover:border-roam hover:bg-roam hover:shadow-[0_12px_28px_rgba(87,26,255,0.28)]">
                Learn More
              </span>
              <span className="flex h-9 flex-1 items-center justify-center rounded-full bg-white text-xs font-bold text-black transition-all duration-200 hover:bg-roam hover:text-white hover:shadow-[0_12px_28px_rgba(87,26,255,0.28)]">
                Book Now
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
