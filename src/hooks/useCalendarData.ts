"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AuspiciousDayData, MonthData } from "@/types";

interface UseCalendarDataResult {
  days: AuspiciousDayData[];
  isLoading: boolean;
}

export function useCalendarData(
  year: number,
  month: number
): UseCalendarDataResult {
  const [days, setDays] = useState<AuspiciousDayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cache = useRef<Map<string, AuspiciousDayData[]>>(new Map());

  const fetchMonth = useCallback(async (y: number, m: number) => {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const cached = cache.current.get(key);
    if (cached) {
      setDays(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const monthStr = String(m).padStart(2, "0");
      const res = await fetch(`/data/general/${y}/${monthStr}.json`);
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ${y}/${monthStr}`);
      }
      const data: MonthData = await res.json();
      cache.current.set(key, data.days);
      setDays(data.days);
    } catch (err) {
      console.error("Error loading calendar data:", err);
      setDays([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonth(year, month);
  }, [year, month, fetchMonth]);

  return { days, isLoading };
}
