"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AuspiciousDayData, MonthData } from "@/types";

interface UseForecastDataResult {
  dayMap: Map<string, AuspiciousDayData>;
  isLoading: boolean;
}

/**
 * Fetches auspicious day data for a range of dates that may span 1 or 2 months.
 * Returns a Map keyed by date string ("yyyy-MM-dd") for O(1) lookups.
 */
export function useForecastData(
  dates: string[]
): UseForecastDataResult {
  const [dayMap, setDayMap] = useState<Map<string, AuspiciousDayData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const cache = useRef<Map<string, AuspiciousDayData[]>>(new Map());

  const fetchMonth = useCallback(async (y: number, m: number): Promise<AuspiciousDayData[]> => {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const cached = cache.current.get(key);
    if (cached) return cached;

    const monthStr = String(m).padStart(2, "0");
    const res = await fetch(`/data/general/${y}/${monthStr}.json`);
    if (!res.ok) {
      throw new Error(`Failed to fetch data for ${y}/${monthStr}`);
    }
    const data: MonthData = await res.json();
    cache.current.set(key, data.days);
    return data.days;
  }, []);

  useEffect(() => {
    if (dates.length === 0) return;

    // Determine which months we need
    const months = new Set<string>();
    for (const d of dates) {
      const [y, m] = d.split("-");
      months.add(`${y}-${m}`);
    }

    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const allDays: AuspiciousDayData[] = [];
        for (const ym of months) {
          const [y, m] = ym.split("-").map(Number);
          const days = await fetchMonth(y, m);
          allDays.push(...days);
        }

        const map = new Map<string, AuspiciousDayData>();
        for (const d of allDays) {
          map.set(d.date, d);
        }
        setDayMap(map);
      } catch (err) {
        console.error("Error loading forecast data:", err);
        setDayMap(new Map());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [dates.join(","), fetchMonth]);

  return { dayMap, isLoading };
}
