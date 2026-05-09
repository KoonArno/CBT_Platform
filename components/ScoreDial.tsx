import { cn } from "@/lib/utils";

interface ScoreDialProps {
  value: number | null;
  max?: number;
  size?: number;
  label?: string;
}

export function ScoreDial({ value, max = 6, size = 40, label }: ScoreDialProps) {
  const pct = value === null ? 0 : Math.max(0, Math.min(1, value / max));
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-all"
        />
      </svg>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center text-[11px] font-bold",
          value === null && "text-muted-foreground",
        )}
      >
        <span>{value ?? "–"}</span>
        {label && (
          <span className="text-[8px] font-normal text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
