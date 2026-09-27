import type { ReactNode } from "react";
import Link from "next/link";

// Shared shell for the public legal pages (Privacy Policy, Accessibility
// Statement) — re-measured from the live (session 25): a chrome-less cream
// page (no navbar, no footer) carrying a "← Back home" link (14px/400,
// #8A8780), the 48px Libre Baskerville h1, and 14px/28px #5F5C56 paragraphs
// inside a max-w-3xl (768px) centered column, main padded 80px/24px. The
// live has no "Last updated" eyebrow — the heading sits directly over the
// body text.

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh justify-center bg-cream px-6 py-20">
      <article className="w-full max-w-3xl">
        <Link
          href="/"
          className="text-sm font-normal text-[#8A8780] transition-colors hover:text-ink"
        >
          ← Back home
        </Link>
        <h1 className="mt-8 font-serif text-5xl leading-tight tracking-tight text-ink">
          {title}
        </h1>
        <div className="mt-8 space-y-4 text-sm leading-7 text-[#5F5C56]">{children}</div>
      </article>
    </main>
  );
}
