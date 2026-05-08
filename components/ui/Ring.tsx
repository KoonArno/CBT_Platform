interface RingProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
  label?: string;
  sub?: string;
}

export function Ring({
  value,
  max,
  size = 88,
  color = "#3B75E8",
  label,
  sub,
}: RingProps) {
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - value / max);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`${color}20`}
            strokeWidth={8}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-black leading-none"
            style={{ fontSize: size * 0.2, color }}
          >
            {value}
          </span>
          <span
            className="font-semibold text-ink-muted"
            style={{ fontSize: size * 0.11 }}
          >
            /{max}
          </span>
        </div>
      </div>
      {label && (
        <div className="text-center text-xs font-bold text-ink">{label}</div>
      )}
      {sub && <div className="text-center text-[10px] text-ink-muted">{sub}</div>}
    </div>
  );
}
