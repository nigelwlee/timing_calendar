"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import type { AuspiciousDayData, ScoreLabel } from "@/types";

const SCORE_BORDER: Record<number, string> = {
  5: "border-l-amber-400",
  4: "border-l-emerald-400",
  3: "border-l-slate-400/60",
  2: "border-l-orange-400",
  1: "border-l-red-400",
};

interface ForecastListProps {
  days: AuspiciousDayData[];
  onSelectDay?: (date: string) => void;
}

function ForecastCard({ day, onClick }: { day: AuspiciousDayData; onClick?: () => void }) {
  const dateObj = new Date(day.date + "T12:00:00");
  const score = day.score ?? 3;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border-l-3 bg-navy-800/50 p-4 sm:p-5 transition-colors hover:bg-navy-700/50 cursor-pointer",
        SCORE_BORDER[score]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-base sm:text-lg font-semibold text-slate-100">
            {format(dateObj, "EEEE")}
          </p>
          <p className="text-sm text-slate-400">
            {format(dateObj, "MMMM d")}
          </p>
        </div>
        <Badge label={day.scoreLabel as ScoreLabel} className="text-sm px-3 py-1" />
      </div>
      <p className="text-sm sm:text-base text-slate-300 italic">
        {day.summary}
      </p>
    </button>
  );
}

export function ForecastList({ days, onSelectDay }: ForecastListProps) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="mt-8 sm:mt-10">
      {/* Section heading */}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
        <span className="w-4 h-px bg-gold-400/40" />
        7-Day Forecast
        <span className="flex-1 h-px bg-gold-400/40" />
      </h3>

      {unlocked ? (
        /* Revealed forecast cards */
        <div className="space-y-3">
          {days.map((day) => (
            <ForecastCard key={day.date} day={day} onClick={() => onSelectDay?.(day.date)} />
          ))}
        </div>
      ) : (
        /* Blurred cards + overlay wrapper */
        <div className="relative">
          {/* The actual cards — rendered but blurred */}
          <div className="space-y-3 select-none" style={{ filter: "blur(7px)", pointerEvents: "none" }}>
            {days.map((day) => (
              <ForecastCard key={day.date} day={day} />
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950/40 rounded-xl">
            <div className="text-center px-6">
              <div className="text-4xl mb-3">&#x1F512;</div>
              <p className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl text-slate-100 mb-2">
                Unlock your 7-day forecast
              </p>
              <p className="text-base text-slate-400 mb-5 max-w-sm">
                See which days ahead are auspicious for your plans, meetings, and important decisions.
              </p>
              <button
                onClick={() => setUnlocked(true)}
                className="px-6 py-3 text-base font-semibold rounded-xl bg-gold-400 text-navy-950 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 cursor-pointer"
              >
                Start Free Trial
              </button>
              <p className="text-sm text-slate-500 mt-3">
                No account required
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
