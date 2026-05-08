"use client";

import { cn } from "@/lib/utils";

interface TabsProps<T extends string> {
  options: ReadonlyArray<readonly [T, string]>;
  value: T;
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div className="-mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full bg-brand-tab p-1 [&::-webkit-scrollbar]:hidden">
      {options.map(([k, label]) => {
        const active = value === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-bold transition whitespace-nowrap",
              active
                ? "bg-brand text-white"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
