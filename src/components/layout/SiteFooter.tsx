import Link from "next/link";
import {
  Sun,
  UtensilsCrossed,
  BedDouble,
  Compass,
  MapPin,
  Heart,
} from "lucide-react";

// The site footer — session-23 re-measure (the footer had drifted since
// session 2): the live renders a COMPACT shrink-wrapped centered GLASS pill
// — border 1px #E8E6DC, backdrop blur(40px) saturate(1.5), radius 28, pad
// 8px 10px — carrying the six view links as icon cells (20px icon over
// 11px/600 label, gap 8px; 74px wide from md, a 3-column grid on phones);
// the footer element itself owns the vertical padding (pt-32/pb-24 mobile,
// pt-64/pb-56 desktop) with NO top margin — every page's last section hands
// off to the footer's own pt. The inner is max-w-5xl (1024). The legal row
// is a justify-between ROW from md (© 12px #8A8780 left, the Privacy /
// Accessibility links right, gap 8px/20px) and a centered column on phones.
// Rendered from the (app) layout on every authenticated page (live parity).

const FOOTER_LINKS = [
  { href: "/", label: "Highlights", icon: Sun },
  { href: "/eat", label: "Eat", icon: UtensilsCrossed },
  { href: "/stay", label: "Stay", icon: BedDouble },
  { href: "/do", label: "Do", icon: Compass },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/favourites", label: "Favourites", icon: Heart },
] as const;

export function SiteFooter() {
  return (
    // Session-26 re-measure: the live's footer carries the horizontal
    // padding itself (`px-5`) and switches its vertical pads at **sm**
    // (640), not md — the inner is BARE (no px, no gap; the legal row's
    // own mt spaces it).
    <footer className="bg-cream px-5 pt-8 pb-6 sm:pt-16 sm:pb-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <nav
          aria-label="Footer"
          className="grid w-full max-w-[390px] grid-cols-3 gap-2 rounded-[28px] border border-[#E8E6DC] bg-white py-2 px-2.5 backdrop-blur-[40px] backdrop-saturate-[1.5] md:flex md:w-fit md:max-w-none md:flex-wrap md:justify-center"
        >
          {FOOTER_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex h-[78px] flex-col items-center justify-center gap-2 rounded-[18px] border border-black/[0.04] bg-white/55 text-[#141413] transition-colors md:h-[78px] md:w-[74px]"
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              <span className="font-inter text-[11px] font-semibold">{label}</span>
            </Link>
          ))}
        </nav>
        {/* Session-26 re-measure: the legal row carries the live's chrome —
            a 1px black/[0.05] TOP HAIRLINE at every breakpoint, pt-3
            (12px) phones / sm:pt-5 (20px), and its own mt-4/sm:mt-8
            margin — and the row switches to the space-between ROW at
            **sm** (640), matching the live's own breakpoint mix. Below md
            the live's override caps the row at max-w 390 CENTERED (same
            as the pill) — at 640 the row renders 390 wide @x=125. */}
        <div className="mt-4 flex w-full max-w-[390px] flex-col items-center gap-2 border-t border-black/[0.05] pt-3 text-center sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-5 sm:text-left md:max-w-none">
          <p className="text-xs text-[#8A8780]">© 2026 Roam. Activity Map for Augsburg.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#8A8780]">
            <Link
              href="/privacy-policy"
              className="underline-offset-2 hover:text-ink hover:underline"
            >
              Privacy policy
            </Link>
            <Link
              href="/accessibility-statement"
              className="underline-offset-2 hover:text-ink hover:underline"
            >
              Accessibility Statement
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
