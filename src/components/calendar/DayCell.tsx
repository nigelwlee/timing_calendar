"use client";

import { memo } from "react";
import { cn } from "@/lib/utils/cn";
import { MoonIcon } from "@/components/ui/MoonIcon";
import type { AuspiciousDayData } from "@/types";

const SCORE_STYLES: Record<number, { bg: string; border: string; dot: string }> = {
  5: {
    bg: "bg-amber-400/10 hover:bg-amber-400/20",
    border: "border-l-amber-400",
    dot: "bg-amber-400",
  },
  4: {
    bg: "bg-emerald-400/10 hover:bg-emerald-400/20",
    border: "border-l-emerald-400",
    dot: "bg-emerald-400",
  },
  3: {
    bg: "bg-slate-400/5 hover:bg-slate-400/15",
    border: "border-l-slate-400/60",
    dot: "bg-slate-400",
  },
  2: {
    bg: "bg-orange-400/10 hover:bg-orange-400/20",
    border: "border-l-orange-400",
    dot: "bg-orange-400",
  },
  1: {
    bg: "bg-red-400/10 hover:bg-red-400/20",
    border: "border-l-red-400",
    dot: "bg-red-400",
  },
};

const SCORE_LABELS: Record<number, string> = {
  5: "Great",
  4: "Good",
  3: "Neutral",
  2: "Poor",
  1: "Avoid",
};

interface DayCellProps {
  date: Date;
  dayData: AuspiciousDayData | undefined;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const DayCell = memo(function DayCell({
  date,
  dayData,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
}: DayCellProps) {
  const dayNum = date.getDate();
  const score = dayData?.score ?? 3;
  const styles = SCORE_STYLES[score] ?? SCORE_STYLES[3];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start p-2 sm:p-3 min-h-[4.5rem] sm:min-h-[6rem] lg:min-h-[7rem] rounded-lg border-l-3 transition-all duration-150 cursor-pointer",
        styles.bg,
        styles.border,
        isCurrentMonth ? "opacity-100" : "opacity-25",
        isSelected && "ring-2 ring-gold-400 ring-offset-1 ring-offset-navy-950",
        isToday && "ring-1 ring-gold-300/50"
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          "text-lg sm:text-xl lg:text-2xl font-semibold leading-none",
          isToday ? "text-gold-400 font-bold" : "text-slate-200"
        )}
      >
        {dayNum}
      </span>

      {/* Score label on medium+ screens */}
      {dayData && isCurrentMonth && (
        <span
          className={cn(
            "hidden sm:block text-xs lg:text-sm mt-1.5 font-medium",
            score === 5 && "text-amber-400/80",
            score === 4 && "text-emerald-400/80",
            score === 3 && "text-slate-400/80",
            score === 2 && "text-orange-400/80",
            score === 1 && "text-red-400/80"
          )}
        >
          {SCORE_LABELS[score]}
        </span>
      )}

      {/* Score dot + moon icon row */}
      <div className="flex items-center gap-1.5 mt-auto">
        <span
          className={cn("w-2.5 h-2.5 rounded-full", styles.dot)}
        />
        {dayData?.moonPhase.isExactQuarter && (
          <MoonIcon
            angle={dayData.moonPhase.angle}
            size={18}
            className="text-gold-300"
          />
        )}
      </div>

      {/* Day Officer on larger screens */}
      {dayData && isCurrentMonth && (
        <span className="hidden lg:block text-xs leading-tight text-slate-500 mt-1 truncate w-full">
          {dayData.chinese.dayOfficer}
        </span>
      )}
    </button>
  );
});
