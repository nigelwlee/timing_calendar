"use client";

import { format } from "@/lib/utils/date-helpers";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 mb-4 sm:mb-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl text-slate-100">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToday}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md bg-navy-700/60 text-gold-300 hover:bg-navy-600/80 transition-colors border border-gold-400/20"
        >
          Today
        </button>
        <button
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="p-2 sm:p-2.5 rounded-md hover:bg-navy-700/60 text-slate-300 hover:text-slate-100 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 12 6 8l4-4" />
          </svg>
        </button>
        <button
          onClick={onNextMonth}
          aria-label="Next month"
          className="p-2 sm:p-2.5 rounded-md hover:bg-navy-700/60 text-slate-300 hover:text-slate-100 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
