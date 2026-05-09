import type { ReactNode } from "react";
import { WorkflowStepper } from "@/components/WorkflowStepper";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showStepper?: boolean;
  right?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showStepper = true,
  right,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur">
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
        </div>
        {showStepper && (
          <div className="mt-4">
            <WorkflowStepper />
          </div>
        )}
      </div>
    </div>
  );
}
