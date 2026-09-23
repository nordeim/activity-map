"use client";

// The primary navigation, measured from the reference app at both sizes.
//
// Desktop (≥sm): a centered FLOATING WHITE PILL, sticky near the top, soft
// shadow:  [✳ ROAM]  Highlights Eat Stay Do Map        [♥] (S)
// The ACTIVE view link renders as a light-gray pill (#F3F4F6, black text);
// inactive links are plain black/60 text with icons.
//
// Mobile (<sm): a FULL-WIDTH top bar (square corners, white, subtle blur)
// exactly like the reference's 390px chrome:
//   [✳ ROAM]  Highlights Eat Stay Do        [pin] [♥] [user]
// The links are TEXT-ONLY (icons hidden below sm — the reference does the
// same) and compactly padded so the whole bar fits 390px; the Map link
// folds into the map-pin icon. The links row carries a horizontal
// no-scrollbar overflow as a safety valve so links can never slide under
// the right cluster (the classic Tailwind v4 mobile-nav failure classes
// A no-nav / B invisible / C clipped / D under-layer / E breakpoint
// mismatch are regression-pinned by tests/e2e/mobile-navigation.spec.ts).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, UtensilsCrossed, BedDouble, Compass, MapPin, Heart, User } from "lucide-react";
import { cn, initials } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Highlights", icon: Sun },
  { href: "/eat", label: "Eat", icon: UtensilsCrossed },
  { href: "/stay", label: "Stay", icon: BedDouble },
  { href: "/do", label: "Do", icon: Compass },
] as const;

export function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-cream/95 backdrop-blur-sm sm:top-4 sm:px-4">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex h-[52px] items-center justify-between border-black/5 bg-white px-2.5 py-1.5",
          // Mobile: full-width flat bar (the reference's 390px chrome).
          "border-x-0 border-t-0 border-b",
          // ≥sm: the floating centered pill.
          "sm:w-full sm:max-w-[1000px] sm:rounded-full sm:border sm:px-2 sm:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
        )}
      >
        {/* Wordmark — the live app's image logo (icon + wordmark sprite,
            /images/roam-logo.png, captured from the reference CDN), shown
            with the reference's two-span crop technique: an 18px icon span
            plus a wordmark span offset by -18px. */}
        <Link
          href="/"
          className="flex shrink-0 items-center pl-0.5 pr-1 sm:pl-2 sm:pr-4"
          aria-label="ROAM home"
        >
          <span aria-hidden className="relative block h-[18px] w-[18px] shrink-0 overflow-hidden">
              <img src="/images/roam-logo.png" alt="" className="block h-[18px] w-auto max-w-none" />
          </span>
          <span aria-hidden className="relative ml-[4px] block h-[18px] w-[52px] shrink-0 overflow-hidden sm:w-[70px]">
              <img
              src="/images/roam-logo.png"
              alt=""
              className="block h-[18px] w-auto max-w-none"
              style={{ transform: "translateX(-18px)" }}
            />
          </span>
          <span className="sr-only">ROAM</span>
        </Link>

        {/* View links — text-only and compact below sm (reference), with
            icons + the Map link from sm up. The no-scrollbar overflow is a
            safety valve: at extreme widths links scroll instead of sliding
            under the logo or the right cluster. */}
        <div className="no-scrollbar flex min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto sm:gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-nav flex shrink-0 items-center whitespace-nowrap rounded-full tracking-[0.01em] transition-colors",
                  active
                    ? "bg-[#F3F4F6] font-bold text-ink"
                    : "font-medium text-black/60 hover:bg-black/[0.04] hover:text-ink",
                  "px-0 py-2 text-xs sm:px-3 sm:text-sm",
                )}
              >
                <Icon className="mr-1.5 hidden h-4 w-4 sm:block" strokeWidth={1.5} aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Map: full link ≥sm, folded into the right-cluster pin below. */}
          <Link
            href="/map"
            aria-label="Map"
            aria-current={isActive("/map") ? "page" : undefined}
            className={cn(
              "font-nav hidden shrink-0 items-center whitespace-nowrap rounded-full tracking-[0.01em] transition-colors sm:flex",
              isActive("/map")
                ? "bg-[#F3F4F6] font-bold text-ink"
                : "font-medium text-black/60 hover:bg-black/[0.04] hover:text-ink",
              "px-3 py-2 text-sm",
            )}
          >
            <MapPin className="mr-1.5 h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span>Map</span>
          </Link>
        </div>

        {/* Right cluster — on mobile: pin, heart, user icons (reference);
            on desktop: heart + the black avatar chip. */}
        <div className="flex shrink-0 items-center gap-1 pl-1 sm:gap-1.5 sm:pl-2">
          <Link
            href="/map"
            aria-label="Map"
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:hidden",
              isActive("/map") ? "bg-[#F3F4F6] text-ink" : "text-black/60 hover:bg-black/[0.05] hover:text-ink",
            )}
          >
            <MapPin className="h-[17px] w-[17px]" strokeWidth={1.5} aria-hidden />
          </Link>
          <Link
            href="/favourites"
            aria-label="Favourites"
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:h-9 sm:w-9",
              isActive("/favourites") ? "bg-[#F3F4F6] text-ink" : "text-black/60 hover:bg-black/[0.05] hover:text-ink",
            )}
          >
            <Heart className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} aria-hidden />
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:h-8 sm:w-8 sm:bg-ink sm:text-xs sm:font-bold sm:text-white",
              isActive("/profile")
                ? "bg-[#F3F4F6] text-ink sm:bg-ink sm:text-white"
                : "text-black/60 hover:bg-black/[0.05] hover:text-ink sm:hover:opacity-90",
            )}
          >
            <User className="h-[17px] w-[17px] sm:hidden" strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">{initials(userName)}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
