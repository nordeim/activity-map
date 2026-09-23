import Link from "next/link";

// The site footer, measured from the live app: the view links, the legal
// line "© 2026 Roam. Activity Map for Augsburg.", and the Privacy policy /
// Accessibility Statement links (real static pages in this app).

const FOOTER_LINKS = [
  { href: "/", label: "Highlights" },
  { href: "/eat", label: "Eat" },
  { href: "/stay", label: "Stay" },
  { href: "/do", label: "Do" },
  { href: "/map", label: "Map" },
  { href: "/favourites", label: "Favourites" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-line bg-cream">
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-black/60 transition-colors hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-black/50">© 2026 Roam. Activity Map for Augsburg.</p>
          <p className="flex items-center gap-4 text-xs text-black/50">
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
