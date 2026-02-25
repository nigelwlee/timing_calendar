"use client";

import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import { TodayCard } from "./TodayCard";
import { ForecastList } from "./ForecastList";
import { DayDetailPanel } from "./DayDetailPanel";
import { useForecastData } from "@/hooks/useForecastData";

export function TodayView() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Compute today + next 7 days
  const today = new Date();
  const dateStrings = useMemo(() => {
    const dates: string[] = [];
    for (let i = 0; i < 8; i++) {
      dates.push(format(addDays(today, i), "yyyy-MM-dd"));
    }
    return dates;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format(today, "yyyy-MM-dd")]);

  const { dayMap, isLoading } = useForecastData(dateStrings);

  const todayData = dayMap.get(dateStrings[0]);
  const forecastDays = dateStrings
    .slice(1)
    .map((d) => dayMap.get(d))
    .filter((d): d is NonNullable<typeof d> => d != null);

  const selectedDayData = selectedDate ? dayMap.get(selectedDate) : null;

  return (
    <div className="w-full flex-1 flex flex-col max-w-2xl mx-auto">
      {isLoading ? (
        // Skeleton
        <div className="space-y-4">
          <div className="h-72 rounded-2xl bg-navy-800/40 animate-pulse" />
          <div className="h-8 w-48 rounded bg-navy-800/40 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-navy-800/40 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Today's card */}
          {todayData && (
            <TodayCard
              day={todayData}
              onClick={() =>
                setSelectedDate((prev) =>
                  prev === dateStrings[0] ? null : dateStrings[0]
                )
              }
            />
          )}

          {/* 7-day forecast (blurred paywall) */}
          {forecastDays.length > 0 && (
            <ForecastList days={forecastDays} />
          )}
        </>
      )}

      {/* Day Detail Panel (reused from calendar) */}
      {selectedDayData && (
        <DayDetailPanel
          day={selectedDayData}
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
