import { cn } from "@/lib/utils/cn";

interface MoonIconProps {
  angle: number;
  size?: number;
  className?: string;
}

/**
 * Renders an SVG moon phase icon based on the phase angle (0-360).
 * 0 = New Moon, 90 = First Quarter, 180 = Full Moon, 270 = Third Quarter
 */
export function MoonIcon({ angle, size = 16, className }: MoonIconProps) {
  const r = size / 2 - 1;
  const cx = size / 2;
  const cy = size / 2;

  // Normalize angle to 0-360
  const phase = ((angle % 360) + 360) % 360;

  // Calculate the terminator curve
  // The terminator separates the lit and dark halves of the moon
  const illuminationFraction = phase / 360;

  let path: string;

  if (phase < 1 || phase > 359) {
    // New Moon - all dark
    path = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("inline-block", className)}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.4}
        />
      </svg>
    );
  }

  if (phase > 179 && phase < 181) {
    // Full Moon - all lit
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("inline-block", className)}
      >
        <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity={0.9} />
      </svg>
    );
  }

  // For other phases, we draw the lit portion
  // The terminator is an ellipse whose x-radius varies with phase
  const cosPhase = Math.cos((phase * Math.PI) / 180);
  const terminatorRx = Math.abs(cosPhase) * r;

  // Determine which side is lit
  const isWaxing = phase < 180;

  // Draw the lit side
  // Right half is lit when waxing (0-180), left half when waning (180-360)
  const litSweep = isWaxing ? 1 : 0;
  const terminatorSweep = isWaxing
    ? cosPhase > 0
      ? 1
      : 0
    : cosPhase < 0
      ? 0
      : 1;

  path = [
    `M ${cx} ${cy - r}`,
    // Arc for the outer edge (half circle on the lit side)
    `A ${r} ${r} 0 0 ${litSweep} ${cx} ${cy + r}`,
    // Arc for the terminator
    `A ${terminatorRx} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}`,
    "Z",
  ].join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("inline-block", className)}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
        opacity={0.3}
      />
      <path d={path} fill="currentColor" opacity={0.85} />
    </svg>
  );
}
