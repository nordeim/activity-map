"use client";

// The trip-planner's date-range popover, modelled on the live app's
// react-day-picker instance (session 3): a rounded-[40px] white popover
// with a "from / to Optional" pair of read-outs, a Su–Sa week grid, and
// h-8 w-8 rounded day cells where the chosen range renders on the violet
// accent with soft in-range days. Clicking a third day restarts the range.

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function DateRangePicker({
  start,
  end,
  onSelect,
  onClose,
}: {
  start: string | null;
  end: string | null;
  onSelect: (range: { from: string | null; to: string | null }) => void;
  onClose: () => void;
}) {
  const [month, setMonth] = useState(() => {
    const base = start ? new Date(`${start}T00:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [from, setFrom] = useState<string | null>(start);
  const [to, setTo] = useState<string | null>(end);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const lead = first.getDay();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= count; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    return cells;
  }, [month]);

  const fromDate = from ? new Date(`${from}T00:00:00`) : null;
  const toDate = to ? new Date(`${to}T00:00:00`) : null;

  function pick(d: Date) {
    if (!from || (from && to)) {
      // (Re)start the range.
      setFrom(toISO(d));
      setTo(null);
      onSelect({ from: toISO(d), to: null });
      return;
    }
    // Second click completes (or swaps) the range.
    const picked = toISO(d);
    if (picked < from) {
      setTo(from);
      setFrom(picked);
      onSelect({ from: picked, to: from });
    } else {
      setTo(picked);
      onSelect({ from, to: picked });
    }
  }

  function dayState(d: Date): "from" | "to" | "in" | "idle" {
    if (!fromDate) return "idle";
    const lo = toDate && fromDate > toDate ? toDate : fromDate;
    const hi = toDate && fromDate > toDate ? fromDate : toDate;
    if (sameDay(d, lo)) return "from";
    if (hi && sameDay(d, hi)) return "to";
    if (hi && d > lo && d < hi) return "in";
    return "idle";
  }

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-label="Choose trip dates"
      className="absolute left-1/2 top-[calc(100%+10px)] z-[30000] mx-auto w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-[40px] border border-black/10 bg-white p-4 shadow-[0_24px_60px_rgba(14,14,14,0.18)]"
    >
      {/* from / to read-outs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="w-8 text-xs font-medium text-muted">from</span>
          <span className="flex h-10 min-w-[9.5rem] items-center rounded-full border border-black/10 bg-cream px-4 text-sm font-medium text-ink">
            {from ? from.split("-").reverse().join("/") : "Select date"}
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="w-8 text-xs font-medium text-muted">to</span>
          <span className="flex h-10 min-w-[9.5rem] items-center rounded-full border border-black/10 bg-cream px-4 text-sm font-medium text-ink">
            {to ? to.split("-").reverse().join("/") : "Optional"}
          </span>
        </label>
      </div>

      {/* The month grid */}
      <div className="mt-4 rounded-[32px] border border-black/10 bg-white p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <span className="text-sm font-semibold text-ink">{monthLabel(month)}</span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1 text-xs font-medium text-muted">
              {w}
            </span>
          ))}
          {days.map((d, i) =>
            d ? (
              <button
                key={i}
                type="button"
                aria-label={d.toDateString()}
                onClick={() => pick(d)}
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                  dayState(d) === "idle" && "text-secondary hover:bg-surface2",
                  dayState(d) === "in" && "bg-roam/10 text-ink",
                  (dayState(d) === "from" || dayState(d) === "to") && "bg-roam font-semibold text-white",
                )}
              >
                {d.getDate()}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          Done
        </button>
      </div>
    </div>
  );
}
