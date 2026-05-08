import { scoreColor } from "@/lib/cts-r";

interface ScoreDotProps {
  score: number | null | undefined;
  size?: number;
}

export function ScoreDot({ score, size = 36 }: ScoreDotProps) {
  const color = scoreColor(score);
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full border-2 font-black"
      style={{
        width: size,
        height: size,
        background: `${color}18`,
        borderColor: color,
        color,
        fontSize: size * 0.42,
      }}
    >
      {score ?? "–"}
    </div>
  );
}
