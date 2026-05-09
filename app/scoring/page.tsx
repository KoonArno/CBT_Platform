"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { CtsBadge } from "@/components/CtsBadge";
import { CTS_R, SCORE_LABELS, RUBRICS, scoreLabel } from "@/lib/cts-data";
import { AI_SCORES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SCORE_COLORS: Record<
  number,
  { bg: string; text: string; ring: string; label: string }
> = {
  0: { bg: "bg-[#ef4444]/15", text: "text-[#ef4444]", ring: "ring-[#ef4444]/40", label: "bg-[#ef4444] text-white" },
  1: { bg: "bg-[#f97316]/15", text: "text-[#f97316]", ring: "ring-[#f97316]/40", label: "bg-[#f97316] text-white" },
  2: { bg: "bg-[#f59e0b]/15", text: "text-[#f59e0b]", ring: "ring-[#f59e0b]/40", label: "bg-[#f59e0b] text-white" },
  3: { bg: "bg-[#eab308]/15", text: "text-[#eab308]", ring: "ring-[#eab308]/40", label: "bg-[#eab308] text-foreground" },
  4: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]", ring: "ring-[#84cc16]/40", label: "bg-[#84cc16] text-white" },
  5: { bg: "bg-[#22c55e]/15", text: "text-[#22c55e]", ring: "ring-[#22c55e]/40", label: "bg-[#22c55e] text-white" },
  6: { bg: "bg-[#16a34a]/15", text: "text-[#16a34a]", ring: "ring-[#16a34a]/40", label: "bg-[#16a34a] text-white" },
};

function scoreColor(n: number) {
  return SCORE_COLORS[n] ?? SCORE_COLORS[3];
}

export default function ScoringPage() {
  const [scores, setScores] = useState<Record<number, number | null>>(() =>
    Object.fromEntries(AI_SCORES.map((s) => [s.itemNo, s.finalScore])),
  );
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<number | null>(1);
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());

  const total = Object.values(scores).reduce<number>((a, b) => a + (b ?? 0), 0);
  const completedCount = Object.values(scores).filter((v) => v !== null).length;
  const pct = Math.round((total / 72) * 100);

  const confirmItem = (no: number) => {
    setConfirmed((p) => new Set([...p, no]));
    const next = CTS_R.find((i) => i.no > no && !confirmed.has(i.no));
    setExpanded(next?.no ?? null);
  };

  return (
    <>
      <PageHeader
        title="Scoring"
        subtitle="Validate AI-suggested scores per CTS-R item. Adjust when your judgement differs."
        right={
          <>
            <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5 text-xs sm:flex">
              <span className="text-muted-foreground">
                {completedCount}/12 items
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="font-semibold text-foreground">
                {total}
                <span className="font-normal text-muted-foreground">/72</span>
              </span>
              <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="font-medium text-primary">{pct}%</span>
            </div>
            <Link href="/summary">
              <Button>
                Continue to summary <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="space-y-2.5 px-4 py-6 sm:px-6 lg:px-8">
        {CTS_R.map((item) => {
          const ai = AI_SCORES.find((s) => s.itemNo === item.no)!;
          const final = scores[item.no];
          const adjusted = ai.aiScore !== null && final !== ai.aiScore;
          const isOpen = expanded === item.no;
          const isDone = confirmed.has(item.no);
          const rubric = RUBRICS[item.no];
          const col = final !== null ? scoreColor(final) : null;

          return (
            <div
              key={item.no}
              className={cn(
                "overflow-hidden rounded-xl border bg-card shadow-sm transition-all",
                isOpen
                  ? "border-primary/30 shadow-md"
                  : isDone
                  ? "border-success/30 bg-success/5"
                  : "border-border hover:border-border/80",
              )}
            >
              {/* Header row */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.no)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                {/* Score badge */}
                <div
                  className={cn(
                    "flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-lg text-center ring-2 ring-inset transition-all",
                    col
                      ? `${col.bg} ${col.text} ${col.ring}`
                      : "bg-muted text-muted-foreground ring-border/30",
                  )}
                >
                  <span className="text-lg font-bold leading-none">
                    {final ?? "–"}
                  </span>
                  <span className="mt-0.5 text-[9px] font-medium leading-none opacity-80">
                    /6
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CtsBadge item={item} />
                    {isDone && (
                      <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                        <CheckCircle2 className="h-3 w-3" /> Confirmed
                      </span>
                    )}
                    {adjusted && !isDone && (
                      <Badge variant="warning">Adjusted</Badge>
                    )}
                    <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <Sparkles className="h-2.5 w-2.5" /> AI: {ai.aiScore}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.tip}
                  </p>
                </div>

                <div className="flex-shrink-0 text-muted-foreground">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {/* Expanded panel */}
              {isOpen && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                    {/* Left: score picker + rubric */}
                    <div className="space-y-4">
                      {/* Score buttons */}
                      <div>
                        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Final score
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {[0, 1, 2, 3, 4, 5, 6].map((n) => {
                            const active = final === n;
                            const c = scoreColor(n);
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() =>
                                  setScores((p) => ({ ...p, [item.no]: n }))
                                }
                                className={cn(
                                  "flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs transition-all",
                                  active
                                    ? `${c.label} border-transparent shadow-md scale-105`
                                    : `border-border bg-card hover:${c.bg} hover:${c.text} hover:border-transparent`,
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xl font-bold leading-none",
                                    active ? "text-inherit" : "text-foreground",
                                  )}
                                >
                                  {n}
                                </span>
                                <span
                                  className={cn(
                                    "text-[9px] leading-tight text-center",
                                    active ? "text-inherit opacity-90" : "text-muted-foreground",
                                  )}
                                >
                                  {SCORE_LABELS[n]}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Score gradient legend */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] text-[#ef4444]">
                            0 · Incompetent
                          </span>
                          <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#16a34a]" />
                          <span className="text-[10px] text-[#16a34a]">
                            6 · Expert
                          </span>
                        </div>
                      </div>

                      {/* Rubric */}
                      {final !== null && (
                        <div
                          className={cn(
                            "rounded-xl border p-4 transition-colors",
                            col ? `${col.bg} border-current/20` : "border-border bg-surface",
                          )}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <Info
                              className={cn("h-3.5 w-3.5", col ? col.text : "text-primary")}
                            />
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                col ? col.text : "text-foreground",
                              )}
                            >
                              Level {final} — {SCORE_LABELS[final]}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90">
                            {rubric.levels[final]}
                          </p>
                          <p className="mt-2 text-xs italic text-muted-foreground">
                            Tip: {rubric.tip}
                          </p>
                        </div>
                      )}
                      {final === null && (
                        <div className="rounded-xl border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
                          Select a score above to see the rubric description.
                        </div>
                      )}
                    </div>

                    {/* Right: AI rationale + supervisor note */}
                    <div className="space-y-4">
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold text-primary">
                            AI rationale
                          </span>
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            Score: {ai.aiScore}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {ai.rationale}
                        </p>
                        {ai.evidence.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {ai.evidence.map((e) => (
                              <span
                                key={e}
                                className="rounded-md border border-primary/20 bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                {e}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Supervisor note
                        </div>
                        <Textarea
                          rows={4}
                          placeholder="Add a coaching point or justification for your score…"
                          value={notes[item.no] ?? ""}
                          onChange={(e) =>
                            setNotes((p) => ({ ...p, [item.no]: e.target.value }))
                          }
                          className="text-sm"
                        />
                      </div>

                      <div className="flex justify-between gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setScores((p) => ({ ...p, [item.no]: ai.aiScore }))
                          }
                          className="text-muted-foreground"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reset to AI
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => confirmItem(item.no)}
                        >
                          <Check className="h-4 w-4" /> Confirm &amp; next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
