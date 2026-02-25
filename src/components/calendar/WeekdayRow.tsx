const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayRow() {
  return (
    <div className="grid grid-cols-7 mb-1.5 sm:mb-2">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="text-center text-xs sm:text-sm font-medium text-slate-400 py-2 sm:py-3 uppercase tracking-wider"
        >
          {day}
        </div>
      ))}
    </div>
  );
}
