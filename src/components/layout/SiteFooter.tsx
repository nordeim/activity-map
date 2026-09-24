import Link from "next/link";
import {
  Sun,
  UtensilsCrossed,
  BedDouble,
  Compass,
  MapPin,
  Heart,
} from "lucide-react";

// The site footer, re-measured from the live app (session 6): the six view
// links as ICON CELLS (icon over label, white/55 tiles, radius 18, hairline
// border) inside a WHITE rounded-28 pill — a 3-column grid on phones and a
// centered flex-wrap from md — then the legal line "© 2026 Roam. Activity
// Map for Augsburg." with the Privacy policy / Accessibility Statement
// links (real static pages in this app). Rendered from the (app) layout on
// every authenticated page (live parity).

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
    <footer className="mt-8 bg-cream">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-7 px-4 py-9 sm:px-6">
        <nav
          aria-label="Footer"
          className="grid w-full max-w-[350px] grid-cols-3 gap-2 rounded-[28px] bg-white p-2.5 md:flex md:max-w-none md:flex-wrap md:justify-center md:gap-2 md:rounded-[34px] md:p-4"
        >
          {FOOTER_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex h-[78px] flex-col items-center justify-center gap-1 rounded-[18px] border border-black/[0.04] bg-white/55 text-[#141413] transition-colors md:h-[78px] md:w-[98px]"
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              <span className="font-inter text-[13px] font-medium md:text-sm">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-black/50">© 2026 Roam. Activity Map for Augsburg.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
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
