"use client";

// The heart toggle used on every place card and the detail hero.
// Optimistic: flips instantly, reverts on failure. A successful toggle
// triggers router.refresh() so server-rendered lists (the Favourites
// page, the browse grids' saved hearts) re-render with fresh data.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SaveButton({
  placeId,
  initialSaved,
  variant = "floating",
  className,
}: {
  placeId: string;
  initialSaved: boolean;
  variant?: "floating" | "solid";
  className?: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    const next = !saved;
    setSaved(next);
    setBusy(true);
    try {
      const res = await fetch("/api/favourites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });
      if (!res.ok) {
        setSaved(!next);
        return;
      }
      // Re-render the route's server components so list pages reflect the
      // change immediately (cards appear in / disappear from Favourites).
      router.refresh();
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  if (variant === "solid") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? "Remove from favourites" : "Save to favourites"}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition",
          saved
            ? "border-roam/30 bg-roam/10 text-roam"
            : "border-black/10 bg-white text-ink hover:border-black/25",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-roam text-roam")} strokeWidth={1.8} aria-hidden />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition hover:bg-white hover:text-ink",
        className,
      )}
    >
      <Heart className={cn("h-[18px] w-[18px]", saved && "fill-white")} strokeWidth={1.8} aria-hidden />
    </button>
  );
}
