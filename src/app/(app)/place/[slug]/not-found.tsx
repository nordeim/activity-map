import Link from "next/link";

// The place-404 (session-30 re-measure): an invalid place slug renders an
// IN-APP design inside the (app) chrome (navbar + footer) — the live's
// `min-h-screen bg-[#F8F7F4] px-5 py-24 text-center` block carrying the
// 46px Libre Baskerville ink "Place not found" h1 + the 44px ink
// "Back to Do" pill → /do. The generic unknown-route 404 (the platform's
// chrome-less slate page) stays in src/app/not-found.tsx.
export default function PlaceNotFound() {
  return (
    <div className="min-h-screen bg-cream px-5 py-24 text-center">
      <h1 className="font-serif text-[46px] font-normal leading-tight tracking-[-0.05em] text-ink">
        Place not found
      </h1>
      <Link
        href="/do"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-black"
      >
        Back to Do
      </Link>
    </div>
  );
}
