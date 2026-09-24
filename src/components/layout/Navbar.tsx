"use client";

// The primary navigation, re-measured from the live app (sessions 3 + 6).
//
// Mobile (<md): a FIXED top "tab bar" — cream glass (#F8F7F4/62, blur 20,
// border-b rgba(14,14,14,0.08)), 52px tall, capped at 430px and centered:
//   [✳ ROAM]  Highlights Eat Stay Do        [pin] [♥] [user]
// Text-only links, 12px Inter (session-6 re-measure; was 16px) — ACTIVE =
// weight 700 / #0E0E0E, inactive = weight 500 / #0E0E0E-40%. The three right
// icons are 18px. On the home page the hero photo slides UNDER the glass;
// every other page gets a 52px spacer.
//
// Desktop (md+): a sticky TRANSPARENT header (pt 9px, px-6, pb-2) holding a
// centered WHITE floating PILL (h-14, max-w 820, radius 999, 1px #E8E6DC
// border all round, shadow 0 2px 12px rgba(14,14,14,0.08)):
//   [✳ ROAM]  Highlights Eat Stay Do Map     [♥] (S)
// Links are icon+text 13px Inter (session-6 re-measure) — the ACTIVE link
// is weight 700 ink on the rgba(14,14,14,0.08) pill; inactive links are
// weight 500 #555550. The right cluster is the heart (#0E0E0E/7 disc) plus
// the black avatar disc. The whole header hides on scroll-down near the
// bottom and returns on scroll-up (the live app's translateY choreography).
//
// The links row keeps a horizontal no-scrollbar overflow as a safety valve so
// links can never slide under the logo or the right cluster (Tailwind v4
// failure classes A–E are regression-pinned by tests/e2e/mobile-navigation.spec.ts).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const isHome = pathname === "/";
  const [hidden, setHidden] = useState(false);

  // Desktop hide-on-scroll: disappear when scrolling down near the bottom of
  // the document, reappear as soon as the user scrolls up (live parity).
  useEffect(() => {
    let lastY = window.scrollY;
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const up = y < lastY - 2;
        const nearBottom = document.documentElement.scrollHeight - (y + window.innerHeight) <= 140;
        setHidden(nearBottom && !up && y > 40);
        if (up) setHidden(false);
        lastY = y;
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header
        className={cn(
          // Mobile tab-bar: fixed top, cream glass, 52px, centered, ≤430px.
          "fixed left-1/2 top-0 z-40 w-full max-w-[430px] -translate-x-1/2",
          "border-b border-[#0e0e0e]/[0.08] bg-cream/60 backdrop-blur-[20px]",
          // md+: in-flow sticky transparent header CENTERING the white pill
          // (session-6: pt 9px / px-6 / pb-2, flex justify-center).
          "md:sticky md:top-0 md:left-auto md:max-w-none md:translate-x-0 md:border-b-0 md:bg-transparent md:backdrop-blur-none",
          "md:flex md:justify-center md:px-6 md:pb-2 md:pt-[9px]",
        )}
      >
        {/* The nav IS the bar — it wraps the wordmark, the view links, and
            the right-cluster icon actions, so every header control lives in
            one "Primary" landmark (matches the live app's tab-bar). */}
        <nav
          aria-label="Primary"
          className={cn(
            // Inner bar — mobile: the 52px tab row; desktop: the white
            // floating PILL (session-6: max-w 820, radius 999, full border,
            // soft shadow — no longer the full-width bottom-bordered bar).
            "flex h-[52px] items-center justify-between px-4 md:h-14 md:w-full md:max-w-[820px] md:px-3",
            "md:rounded-full md:border md:border-line md:bg-white md:shadow-[0_2px_12px_rgba(14,14,14,0.08)]",
            !hidden && "md:translate-y-0 md:opacity-100",
            hidden && "md:-translate-y-[130%] md:opacity-0",
            "md:transition-transform md:duration-300",
          )}
        >
          {/* Wordmark — the live app's image logo (icon + wordmark sprite,
              /images/roam-logo.png), two-span crop: 18px/62px on mobile,
              25.6px/88px from md (measured). */}
          <Link
            href="/"
            className="flex h-8 shrink-0 items-center md:ml-1"
            aria-label="ROAM home"
          >
            <span aria-hidden className="relative block h-[18px] w-[18px] shrink-0 overflow-hidden md:h-[25.6px] md:w-[25.6px]">
              <img src="/images/roam-logo.png" alt="" className="block h-[18px] w-auto max-w-none md:h-[25.6px]" />
            </span>
            <span aria-hidden className="relative ml-[4px] block h-[18px] w-[62px] shrink-0 overflow-hidden md:h-[25.6px] md:w-[88px]">
              <img
                src="/images/roam-logo.png"
                alt=""
                className="block h-[18px] w-auto max-w-none [transform:translateX(-18px)] md:h-[25.6px] md:[transform:translateX(-25.6px)]"
              />
            </span>
            <span className="sr-only">ROAM</span>
          </Link>

          {/* View links — mobile: text-only 12px (session-6 re-measure; active
              700 ink / inactive 500 ink-40%); md+: icon+text 13px with the
              rgba(14,14,14,0.08) active pill and inactive #555550. no-scrollbar
              keeps the row from ever sliding under the logo or right cluster
              at 390px. Explicit rgba() utilities (not hex/α-modifiers) pin
              exact computed colors for the specs — Tailwind v4 α-modifiers
              compile to color-mix() instead. */}
          <div
            className={cn(
              "no-scrollbar flex min-w-0 flex-1 items-center justify-center overflow-x-auto",
              "gap-3 md:flex-none md:gap-1 md:overflow-visible",
            )}
          >
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "font-nav flex h-full shrink-0 items-center whitespace-nowrap text-[12px] transition-colors md:text-[13px]",
                    "md:h-auto md:rounded-full md:px-4 md:py-2",
                    active
                      ? "font-bold text-ink md:bg-[rgba(14,14,14,0.08)]"
                      : "font-medium text-[rgba(14,14,14,0.4)] hover:text-ink md:text-[#555550] md:hover:bg-black/[0.04] md:hover:text-ink",
                  )}
                >
                  <Icon className="mr-2 hidden h-4 w-4 md:block" strokeWidth={1.5} aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* Map: a full icon+text link from md up, folded into the
                right-cluster pin below md (the live app's fold). */}
            <Link
              href="/map"
              aria-current={isActive("/map") ? "page" : undefined}
              className={cn(
                "font-nav hidden shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors md:flex",
                isActive("/map")
                  ? "bg-[rgba(14,14,14,0.08)] text-ink"
                  : "text-[#555550] hover:bg-black/[0.04] hover:text-ink",
              )}
            >
              <MapPin className="mr-2 h-4 w-4" strokeWidth={1.5} aria-hidden />
              <span>Map</span>
            </Link>
          </div>

          {/* Right cluster — mobile: pin / heart / user icons (18px);
              md+: the heart disc (#0E0E0E/7) + the black avatar chip. */}
          <div className="flex shrink-0 items-center justify-end gap-2 md:gap-2">
            <Link
              href="/map"
              aria-label="Map"
              className={cn(
                "flex h-full w-[18px] items-center justify-center transition-colors md:hidden",
                isActive("/map") ? "text-ink" : "text-ink hover:opacity-70",
              )}
            >
              <MapPin className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="/favourites"
              aria-label="Favourites"
              className={cn(
                "flex h-full w-[18px] items-center justify-center transition-colors md:h-9 md:w-9 md:rounded-full md:bg-[#0e0e0e]/[0.07]",
                isActive("/favourites")
                  ? "text-ink"
                  : "text-ink hover:opacity-70 md:hover:bg-[#0e0e0e]/[0.12]",
              )}
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden />
            </Link>
            <Link
              href="/profile"
              aria-label="Profile"
              className={cn(
                "flex h-full w-[18px] items-center justify-center transition-colors md:h-9 md:w-9 md:rounded-full md:bg-ink",
                isActive("/profile")
                  ? "text-ink md:text-white"
                  : "text-ink hover:opacity-70 md:text-white md:hover:opacity-90",
              )}
            >
              <User className="h-[18px] w-[18px] md:hidden" strokeWidth={1.5} aria-hidden />
              <span className="hidden text-sm font-bold text-white md:inline">{initials(userName)}</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile spacer — the tab-bar is fixed; every page except the home
          hero (which slides under the glass) clears the 52px bar. */}
      {!isHome && <div aria-hidden className="h-[52px] md:hidden" />}
    </>
  );
}
