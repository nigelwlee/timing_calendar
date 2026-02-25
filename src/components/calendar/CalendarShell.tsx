"use client";

import { useState, useMemo, useCallback } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { WeekdayRow } from "./WeekdayRow";
import { DayCell } from "./DayCell";
import { DayDetailPanel } from "./DayDetailPanel";
import { useCalendarData } from "@/hooks/useCalendarData";
import {
  getCalendarDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday as checkIsToday,
  format,
} from "@/lib/utils/date-helpers";
import type { AuspiciousDayData } from "@/types";

export function CalendarShell() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1; // 1-indexed

  const { days: dayData, isLoading } = useCalendarData(year, month);

  const calendarDays = useMemo(
    () => getCalendarDays(year, month - 1),
    [year, month]
  );

  // Build a lookup map for fast access by date string
  const dayDataMap = useMemo(() => {
    const map = new Map<string, AuspiciousDayData>();
    for (const d of dayData) {
      map.set(d.date, d);
    }
    return map;
  }, [dayData]);

  const selectedDayData = selectedDate ? dayDataMap.get(selectedDate) : null;

  const handlePrevMonth = useCallback(
    () => setCurrentMonth((prev) => subMonths(prev, 1)),
    []
  );
  const handleNextMonth = useCallback(
    () => setCurrentMonth((prev) => addMonths(prev, 1)),
    []
  );
  const handleToday = useCallback(() => {
    setCurrentMonth(new Date());
    setSelectedDate(null);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      <WeekdayRow />

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1">
        {isLoading
          ? // Skeleton loading
            Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[4.5rem] sm:min-h-[6rem] lg:min-h-[7rem] rounded-lg bg-navy-800/40 animate-pulse"
              />
            ))
          : calendarDays.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return (
                <DayCell
                  key={dateStr}
                  date={date}
                  dayData={dayDataMap.get(dateStr)}
                  isCurrentMonth={isSameMonth(date, currentMonth)}
                  isToday={checkIsToday(date)}
                  isSelected={selectedDate === dateStr}
                  onClick={() => handleDayClick(date)}
                />
              );
            })}
      </div>

      {/* Day Detail Panel */}
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
