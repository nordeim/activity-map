"use client";

// The trip-planner's date-range popover, modelled on the live app's
// react-day-picker instance — RE-MEASURED session 28 (the first sweep below
// the session-3 model): a rounded-[40px] white popover (510px wide at
// desktop, 100vw−32 at mobile, pad 12px, shadow 0 18px 52px /0.16) whose
// from/to header is a 2-col grid (1-col below sm) of SELF-CONTAINED white
// pill fields — rounded-full, border-black/10, px-4 py-2, h-50 — each
// carrying the 12px/500 #8A8780 label, the 12px/600 ink value, and a 14px
// calendar svg INSIDE. Below it the month grid wrapper (rounded-[32px],
// border-black/10, p-3) holds the 14px/500 month label between 28×28 chevron
// buttons, the 12.8px/400 #737373 Su–Sa weekday row, and h-8 w-8 rounded day
// cells where the chosen endpoints render on the violet accent at weight 400
// and the in-range days carry the #F7F4FF tint with violet text. The
// PREV-MONTH trailing days render as gray #737373 buttons in the leading
// cells (the live's react-day-picker outside days). There is NO "Done"
// button — clicking outside closes (the live's model). Clicking a third day
// restarts the range.

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

  const { days, leadingDays } = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const lead = first.getDay();
    // The live's react-day-picker renders the PREV-MONTH trailing days in
    // the leading cells (30, 31 before September's 1) — gray #737373.
    const prevCount = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
    const leadNums: number[] = [];
    for (let i = lead - 1; i >= 0; i--) leadNums.push(prevCount - i);
    const cells: Array<Date | null> = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= count; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    return { days: cells, leadingDays: leadNums };
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

  // The self-contained from/to field pill (session-28 re-measure): the
  // label + value + a 14px calendar icon live INSIDE the white pill.
  function rangeField(label: string, value: string) {
    return (
      <div className="flex h-[50px] items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="text-xs font-semibold text-[#141413]">{value}</span>
        <Calendar className="ml-auto h-3.5 w-3.5 shrink-0 text-[#141413]" strokeWidth={2} aria-hidden />
      </div>
    );
  }

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-label="Choose trip dates"
      className="absolute left-1/2 top-[calc(100%+10px)] z-[30000] mx-auto w-[min(510px,calc(100vw-32px))] -translate-x-1/2 rounded-[40px] border border-black/10 bg-white p-3 shadow-[0_18px_52px_rgba(14,14,14,0.16)]"
    >
      {/* from / to read-outs — the live's 2-col grid of self-contained
          white pill fields (1-col below sm). */}
      <div className="mb-2 grid gap-2 sm:grid-cols-2">
        {rangeField("from", from ? from.split("-").reverse().join("/") : "Select date")}
        {rangeField("to", to ? to.split("-").reverse().join("/") : "Optional")}
      </div>

      {/* The month grid */}
      <div className="rounded-[32px] border border-black/10 bg-white p-3">
        <div className="relative mb-2 flex items-center justify-center pt-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="absolute left-0 flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <span className="text-sm font-medium text-ink">{monthLabel(month)}</span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="absolute right-0 flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1 text-[12.8px] font-normal text-[#737373]">
              {w}
            </span>
          ))}
          {/* The prev-month trailing days — gray #737373 buttons in the
              leading cells (the live's react-day-picker outside days). */}
          {leadingDays.map((d) => (
            <button
              key={`lead-${d}`}
              type="button"
              tabIndex={-1}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-normal text-[#737373]"
            >
              {d}
            </button>
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
                  dayState(d) === "idle" && "font-normal text-ink hover:bg-surface2",
                  dayState(d) === "in" && "bg-[#F7F4FF] font-normal text-roam",
                  (dayState(d) === "from" || dayState(d) === "to") && "bg-roam font-normal text-white",
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
    </div>
  );
}
