import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "orange" | "ghost" | "muted" | "success" | "warn" | "danger" | "purple";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white border-transparent hover:bg-brand-dark",
  orange:  "bg-accent-orange text-white border-transparent hover:brightness-95",
  ghost:   "bg-transparent text-brand border-brand border-[1.5px] hover:bg-brand-tint",
  muted:   "bg-slate-100 text-ink-muted border-transparent hover:bg-slate-200",
  success: "bg-state-goodBg text-state-good border-transparent",
  warn:    "bg-state-warnBg text-state-warn border-transparent",
  danger:  "bg-state-badBg text-state-bad border-transparent",
  purple:  "bg-state-purpleBg text-accent-purple border-transparent",
};

export function Button({
  variant = "primary",
  full = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}
