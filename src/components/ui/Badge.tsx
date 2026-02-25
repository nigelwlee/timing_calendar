import { cn } from "@/lib/utils/cn";
import type { ScoreLabel } from "@/types";

const BADGE_STYLES: Record<ScoreLabel, string> = {
  Great: "bg-amber-400/20 text-amber-300 border-amber-400/40",
  Good: "bg-emerald-400/20 text-emerald-300 border-emerald-400/40",
  Neutral: "bg-slate-400/20 text-slate-300 border-slate-400/40",
  Poor: "bg-orange-400/20 text-orange-300 border-orange-400/40",
  Avoid: "bg-red-400/20 text-red-300 border-red-400/40",
};

interface BadgeProps {
  label: ScoreLabel;
  className?: string;
}

export function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        BADGE_STYLES[label],
        className
      )}
    >
      {label}
    </span>
  );
}
