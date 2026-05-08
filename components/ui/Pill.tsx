import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "good"
  | "warn"
  | "bad"
  | "brand"
  | "purple"
  | "orange";

const TONE: Record<Tone, string> = {
  neutral: "bg-slate-100 text-ink-muted",
  good:    "bg-state-goodBg text-state-good",
  warn:    "bg-state-warnBg text-state-warn",
  bad:     "bg-state-badBg text-state-bad",
  brand:   "bg-brand-tint text-brand",
  purple:  "bg-state-purpleBg text-accent-purple",
  orange:  "bg-state-orangeBg text-accent-orange",
};

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-bold",
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
