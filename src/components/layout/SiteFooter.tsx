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
    <footer className="bg-cream pt-8 pb-6 md:pt-16 md:pb-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-5 md:gap-8 md:px-6">
        <nav
          aria-label="Footer"
          className="grid w-full grid-cols-3 gap-2 rounded-[28px] border border-[#E8E6DC] bg-white py-2 px-2.5 backdrop-blur-[40px] backdrop-saturate-[1.5] md:flex md:w-fit md:max-w-none md:flex-wrap md:justify-center"
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
        <div className="flex w-full flex-col items-center gap-2 text-center md:flex-row md:justify-between md:gap-4">
          <p className="text-xs text-[#8A8780]">© 2026 Roam. Activity Map for Augsburg.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#8A8780]">
            <Link href="/privacy" className="underline-offset-2 hover:text-ink hover:underline">
              Privacy policy
            </Link>
            <Link
              href="/accessibility"
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
