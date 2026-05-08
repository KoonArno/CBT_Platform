import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-black tracking-tight text-ink sm:text-[22px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs text-ink-muted sm:text-[13px]">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}
