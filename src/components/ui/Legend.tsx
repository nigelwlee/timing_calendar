const LEVELS = [
  { label: "Great", color: "bg-amber-400", textColor: "text-amber-400" },
  { label: "Good", color: "bg-emerald-400", textColor: "text-emerald-400" },
  { label: "Neutral", color: "bg-slate-400", textColor: "text-slate-400" },
  { label: "Poor", color: "bg-orange-400", textColor: "text-orange-400" },
  { label: "Avoid", color: "bg-red-400", textColor: "text-red-400" },
];

export function Legend() {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 py-3 sm:py-4 text-xs sm:text-sm">
      {LEVELS.map(({ label, color, textColor }) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          <span className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${color}`} />
          <span className={`${textColor} opacity-80`}>{label}</span>
        </div>
      ))}
    </div>
  );
}
