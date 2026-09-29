"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

// The generic unknown-route 404 (session-30 re-measure): the live serves
// its platform's default design — a chrome-less slate page: the 72px
// font-light slate-300 "404", the 64×2 slate-200 divider, "Page Not Found"
// at 24px slate-800, the quoted attempted path, and a white bordered
// "Go Home" action → /. (The old custom cream "Off the map" page was a
// clone invention — the live never rendered it. The PLACE 404 is its own
// in-app design in src/app/(app)/place/[slug]/not-found.tsx.)
//
// Session-31 hydration fix: this page is STATICALLY PRERENDERED, so any
// pathname source bakes the prerender route into the server HTML while
// the client hydrates with the REAL path — a React #418 text mismatch (a
// console error + a full client re-render) on every visit. The quoted
// path now reads window.location through useSyncExternalStore — the
// documented-safe client-only-value pattern: the server render AND the
// hydration pass both use getServerSnapshot (""), then React swaps in
// the client snapshot after mount (no mismatch, no effect-setState).
const emptySubscribe = () => () => {};
const getAttemptedPath = () => window.location.pathname.replace(/^\//, "");
const getServerAttemptedPath = () => "";

export default function NotFound() {
  const attempted = useSyncExternalStore(
    emptySubscribe,
    getAttemptedPath,
    getServerAttemptedPath,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-slate-300">404</h1>
            <div className="mx-auto h-0.5 w-16 bg-slate-200" aria-hidden />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800">Page Not Found</h2>
            <p className="leading-relaxed text-slate-600">
              The page <span className="font-medium text-slate-700">&quot;{attempted}&quot;</span> could not be
              found in this application.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
