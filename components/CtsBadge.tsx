import type { CTSRItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CtsBadgeProps {
  item: CTSRItem;
  className?: string;
}

export function CtsBadge({ item, className }: CtsBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium text-foreground/80",
        className,
      )}
      style={{ backgroundColor: item.colorVar }}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/70 text-[10px] font-semibold">
        {item.no}
      </span>
      {item.name}
    </span>
  );
}
