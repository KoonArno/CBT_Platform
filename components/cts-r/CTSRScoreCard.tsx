"use client";

import { CTS_R, SCORE_LABELS, scoreColor } from "@/lib/cts-r";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CTSRItem, ValidationDecision } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AISuggestion {
  score: number;
  evidence?: string;
  rationale?: string;
}

interface Props {
  item: CTSRItem;
  score: number | null;
  ai?: AISuggestion;
  validation?: ValidationDecision;
  onScoreChange: (score: number) => void;
  onValidate?: (decision: ValidationDecision) => void;
  onOpenRubric: () => void;
}

const VAL_BORDER: Record<ValidationDecision, string> = {
  accept: "border-l-green-300",
  reject: "border-l-red-300",
  modify: "border-l-amber-300",
};

export function CTSRScoreCard({
  item,
  score,
  ai,
  validation,
  onScoreChange,
  onValidate,
  onOpenRubric,
}: Props) {
  const borderClass = validation ? VAL_BORDER[validation] : "border-l-rule";

  return (
    <Card className={cn("border-l-4 p-4", borderClass)}>
      <div className="mb-2.5 flex items-start justify-between">
        <div className="flex-1 pr-2">
          <div className="text-[10px] text-ink-muted">
            Item {item.id} · <span className="text-brand">{item.cat}</span>
          </div>
          <div className="text-sm font-extrabold leading-tight text-ink">
            {item.name}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className="text-[26px] font-black leading-none"
            style={{ color: scoreColor(score) }}
          >
            {score ?? "–"}
          </div>
          <button
            type="button"
            onClick={onOpenRubric}
            className="rounded border border-brand px-1.5 py-0.5 text-[10px] font-bold text-brand"
          >
            Rubric ↗
          </button>
        </div>
      </div>

      <div className="mb-1 flex gap-1">
        {[0, 1, 2, 3, 4, 5, 6].map((n) => {
          const active = score === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onScoreChange(n)}
              className={cn(
                "flex-1 rounded py-1.5 text-[13px] font-black transition",
                active ? "border-2" : "border bg-canvas",
              )}
              style={
                active
                  ? {
                      borderColor: scoreColor(n),
                      background: `${scoreColor(n)}18`,
                      color: scoreColor(n),
                    }
                  : { borderColor: "#C0CAD8", color: "#6B7A9A" }
              }
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mb-2 text-center text-[10px] text-ink-muted">
        {score !== null && score !== undefined
          ? SCORE_LABELS[score as 0 | 1 | 2 | 3 | 4 | 5 | 6]
          : "Select a score"}
      </div>

      {ai && (
        <div className="rounded-lg border border-accent-purple/30 bg-state-purpleBg p-2.5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-accent-purple">
              AI → {ai.score} · {SCORE_LABELS[ai.score as 0 | 1 | 2 | 3 | 4 | 5 | 6]}
            </span>
            {!validation && onValidate ? (
              <div className="flex gap-1">
                <Button variant="success" onClick={() => onValidate("accept")} className="!px-2 !py-0.5 !text-[10px]">✓</Button>
                <Button variant="warn"    onClick={() => onValidate("modify")} className="!px-2 !py-0.5 !text-[10px]">✎</Button>
                <Button variant="danger"  onClick={() => onValidate("reject")} className="!px-2 !py-0.5 !text-[10px]">✗</Button>
              </div>
            ) : (
              validation && (
                <span
                  className={cn(
                    "text-[11px] font-bold",
                    validation === "accept" && "text-state-good",
                    validation === "reject" && "text-state-bad",
                    validation === "modify" && "text-state-warn",
                  )}
                >
                  {validation === "accept"
                    ? "✓ Accepted"
                    : validation === "reject"
                      ? "✗ Rejected"
                      : "✎ Modified"}
                </span>
              )
            )}
          </div>
          {ai.evidence && (
            <div className="text-[11px] italic leading-relaxed text-ink-muted">
              &ldquo;{ai.evidence.slice(0, 120)}
              {ai.evidence.length > 120 ? "…" : ""}&rdquo;
            </div>
          )}
          {ai.rationale && (
            <div className="mt-1 text-[11px] leading-relaxed text-ink">
              {ai.rationale}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export { CTS_R };
