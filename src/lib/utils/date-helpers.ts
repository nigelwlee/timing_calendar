import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

/**
 * Returns a 42-cell array (6 weeks) of dates for the calendar grid.
 * Includes trailing/leading days from adjacent months.
 */
export function getCalendarDays(year: number, month: number): Date[] {
  const monthDate = new Date(year, month, 1);
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export { format, isSameMonth, isSameDay, isToday, addMonths, subMonths };
