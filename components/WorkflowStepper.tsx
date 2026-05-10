"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { to: "/upload", n: 1, label: "Upload" },
  { to: "/review", n: 2, label: "Review Evidence" },
  { to: "/scoring", n: 3, label: "Scoring" },
  { to: "/summary", n: 4, label: "Summary" },
  { to: "/report", n: 5, label: "Report" },
] as const;

export function WorkflowStepper() {
  const pathname = usePathname();
  const currentIdx = STEPS.findIndex((s) => s.to === pathname);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const isCurrent = i === currentIdx;
        const isDone = currentIdx >= 0 && i < currentIdx;
        return (
          <Link
            key={s.to}
            href={s.to}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors",
              isCurrent
                ? "border-primary bg-primary text-primary-foreground"
                : isDone
                ? "border-primary/30 bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                isCurrent
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : isDone
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? <Check className="h-3 w-3" /> : s.n}
            </span>
            <span className="font-medium">{s.label}</span>
            {i < STEPS.length - 1 && (
              <span className="ml-1 text-muted-foreground/50">›</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
