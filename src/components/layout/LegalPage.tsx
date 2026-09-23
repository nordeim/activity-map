import type { ReactNode } from "react";

// Shared shell for the public legal pages (Privacy policy, Accessibility
// Statement) — the calm cream card the login route uses, without the
// authenticated chrome.

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh justify-center bg-cream px-4 py-16">
      <article className="w-full max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-black/40">
          Last updated: {updated}
        </p>
        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-black/75">{children}</div>
      </article>
    </main>
  );
}
