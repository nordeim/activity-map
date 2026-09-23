import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-4 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-float">
        <Compass className="h-7 w-7 text-black/40" strokeWidth={1.5} aria-hidden />
      </span>
      <h1 className="font-serif text-4xl text-ink">Off the map</h1>
      <p className="mt-3 max-w-sm text-sm text-black/55">
        This stop is not in the guide — the page you were looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-black"
      >
        Back to the guide
      </Link>
    </main>
  );
}
