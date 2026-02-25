"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { MoonIcon } from "@/components/ui/MoonIcon";
import type { AuspiciousDayData, ScoreLabel } from "@/types";

const SCORE_BORDER: Record<number, string> = {
  5: "border-amber-400/60",
  4: "border-emerald-400/60",
  3: "border-slate-400/40",
  2: "border-orange-400/60",
  1: "border-red-400/60",
};

const SCORE_GLOW: Record<number, string> = {
  5: "shadow-amber-400/10",
  4: "shadow-emerald-400/10",
  3: "shadow-slate-400/5",
  2: "shadow-orange-400/10",
  1: "shadow-red-400/10",
};

interface TodayCardProps {
  day: AuspiciousDayData;
  onClick: () => void;
}

export function TodayCard({ day, onClick }: TodayCardProps) {
  const dateObj = new Date(day.date + "T12:00:00");
  const score = day.score ?? 3;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border-2 p-5 sm:p-7 transition-all duration-200 cursor-pointer",
        "bg-navy-800/60 hover:bg-navy-800/80 shadow-xl",
        SCORE_BORDER[score],
        SCORE_GLOW[score]
      )}
    >
      {/* Date heading */}
      <p className="text-sm sm:text-base text-gold-400 font-medium uppercase tracking-wider mb-1">
        Today
      </p>
      <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-slate-100 mb-4">
        {format(dateObj, "EEEE, MMMM d")}
      </h2>

      {/* Score + summary */}
      <div className="flex items-center gap-3 mb-3">
        <Badge label={day.scoreLabel as ScoreLabel} className="text-sm px-3 py-1" />
        <span className="text-base text-slate-400">
          Score: {day.score}/5
        </span>
      </div>
      <p className="text-base sm:text-lg text-slate-300 italic mb-5">
        {day.summary}
      </p>

      {/* Key highlights grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Moon */}
        <div className="flex items-center gap-2.5 text-base text-slate-200">
          <MoonIcon angle={day.moonPhase.angle} size={22} className="text-gold-300 shrink-0" />
          <span>
            {day.moonPhase.name} in {day.moonSign}
          </span>
        </div>

        {/* Sun */}
        <div className="flex items-center gap-2.5 text-base text-slate-200">
          <span className="text-gold-300 shrink-0 text-lg">&#x2609;</span>
          <span>Sun in {day.sunSign}</span>
        </div>

        {/* Day Officer */}
        <div className="flex items-center gap-2.5 text-base text-slate-200">
          <span className="text-gold-300 shrink-0 text-lg">{day.chinese.dayOfficerChinese}</span>
          <span>{day.chinese.dayOfficer} Day</span>
        </div>

        {/* Retrogrades */}
        {day.retrograde.length > 0 && (
          <div className="flex items-center gap-2.5 text-base text-red-300">
            <span className="shrink-0 text-lg">&#x21BA;</span>
            <span>{day.retrograde.join(", ")} Rx</span>
          </div>
        )}
      </div>

      {/* Activities */}
      {day.chinese.auspiciousActivities.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-emerald-400 mb-2">Auspicious for</p>
          <div className="flex flex-wrap gap-2">
            {day.chinese.auspiciousActivities.slice(0, 6).map((act) => (
              <span
                key={act}
                className="text-sm px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
              >
                {act}
              </span>
            ))}
          </div>
        </div>
      )}

      {day.chinese.inauspiciousActivities.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-red-400 mb-2">Avoid</p>
          <div className="flex flex-wrap gap-2">
            {day.chinese.inauspiciousActivities.slice(0, 4).map((act) => (
              <span
                key={act}
                className="text-sm px-2.5 py-1 rounded-full bg-red-400/10 text-red-300 border border-red-400/20"
              >
                {act}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tap for details hint */}
      <p className="text-sm text-slate-500 mt-4 text-center">
        Tap for full details
      </p>
    </button>
  );
}
