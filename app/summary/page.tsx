"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Target,
  AlertTriangle,
  Sparkles,
  Activity,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea, Label } from "@/components/ui/Input";
import { CTS_R, scoreLabel, SCORE_LABELS } from "@/lib/cts-data";
import { AI_SCORES, CURRENT_SESSION, MOCK_STUDENT_FEEDBACK } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TOTAL = AI_SCORES.reduce((a, s) => a + (s.finalScore ?? 0), 0);
const RADAR_DATA = CTS_R.map((c) => ({
  name: c.short.length > 18 ? `${c.no}. ${c.short.slice(0, 16)}…` : `${c.no}. ${c.short}`,
  value: AI_SCORES.find((s) => s.itemNo === c.no)?.finalScore ?? 0,
}));

const SCORE_COLORS: Record<number, { bg: string; text: string; ring: string; bar: string }> = {
  0: { bg: "bg-[#ef4444]/15", text: "text-[#ef4444]", ring: "ring-[#ef4444]/40", bar: "bg-[#ef4444]" },
  1: { bg: "bg-[#f97316]/15", text: "text-[#f97316]", ring: "ring-[#f97316]/40", bar: "bg-[#f97316]" },
  2: { bg: "bg-[#f59e0b]/15", text: "text-[#f59e0b]", ring: "ring-[#f59e0b]/40", bar: "bg-[#f59e0b]" },
  3: { bg: "bg-[#eab308]/15", text: "text-[#eab308]", ring: "ring-[#eab308]/40", bar: "bg-[#eab308]" },
  4: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]", ring: "ring-[#84cc16]/40", bar: "bg-[#84cc16]" },
  5: { bg: "bg-[#22c55e]/15", text: "text-[#22c55e]", ring: "ring-[#22c55e]/40", bar: "bg-[#22c55e]" },
  6: { bg: "bg-[#16a34a]/15", text: "text-[#16a34a]", ring: "ring-[#16a34a]/40", bar: "bg-[#16a34a]" },
};

function scoreColor(n: number) {
  return SCORE_COLORS[n] ?? SCORE_COLORS[3];
}

const CATEGORIES = ["Structure", "Technique", "Relationship"] as const;

function ScoreBadge({ score, size = "md" }: { score: number | null; size?: "sm" | "md" }) {
  const c = score !== null ? scoreColor(score) : null;
  const dim = size === "sm" ? "h-8 w-8 text-sm" : "h-11 w-11 text-lg";
  return (
    <div
      className={cn(
        "flex flex-shrink-0 flex-col items-center justify-center rounded-lg ring-2 ring-inset font-bold leading-none",
        dim,
        c ? `${c.bg} ${c.text} ${c.ring}` : "bg-muted text-muted-foreground ring-border/30",
      )}
    >
      {score ?? "–"}
    </div>
  );
}

const FEEDBACK_FIELDS = [
  { key: "strengths", label: "จุดแข็ง", sub: "Strengths", rows: 4 },
  { key: "growth", label: "สิ่งที่อยากให้ฝึกฝนพัฒนาเพิ่ม", sub: "Areas for Growth", rows: 4 },
  { key: "suggestions", label: "ข้อเสนอแนะ", sub: "Suggestions", rows: 4 },
] as const;

export default function SummaryPage() {
  const [feedback, setFeedback] = useState({ strengths: MOCK_STUDENT_FEEDBACK.strengths, growth: MOCK_STUDENT_FEEDBACK.growth, suggestions: MOCK_STUDENT_FEEDBACK.suggestions });
  const sorted = [...AI_SCORES].sort(
    (a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0),
  );
  const top = sorted.slice(0, 3);
  const bottom = sorted.slice(-3).reverse();
  const avg = TOTAL / 12;
  const pct = Math.round((TOTAL / 72) * 100);

  return (
    <>
      <PageHeader
        title="Summary"
        subtitle="Aggregate scores, agreement, and competency profile."
        right={
          <>
            <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5 text-xs sm:flex">
              <span className="text-muted-foreground">12/12 items</span>
              <span className="h-3 w-px bg-border" />
              <span className="font-semibold text-foreground">
                {TOTAL}
                <span className="font-normal text-muted-foreground">/72</span>
              </span>
              <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#16a34a] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="font-medium text-primary">{pct}%</span>
            </div>
            <Link href="/report">
              <Button>
                Continue to report <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="max-w-full overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
         <div className="space-y-6 min-w-0">
          {/* KPI row */}
          <div className="grid gap-3 sm:grid-cols-2">
            <KPI
              icon={<Target className="h-4 w-4" />}
              label="Total CTS-R"
              value={`${TOTAL}`}
              unit="/72"
              hint={`${pct}% of maximum`}
            />
            <KPI
              icon={<Activity className="h-4 w-4" />}
              label="Average level"
              value={avg.toFixed(1)}
              unit="/6"
              hint={scoreLabel(Math.round(avg))}
              scoreToned={Math.round(avg)}
            />
          </div>
          {/* Radar + Strengths/Dev side-by-side */}
          <div className="grid min-w-0 gap-6 md:grid-cols-2">
            {/* Radar (left, taller) */}
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Competency profile</h3>
                </div>
                <span className="text-[11px] text-muted-foreground">12 items × 0–6</span>
              </div>
              <div className="p-2 sm:p-4">
                <div className="h-[260px] min-w-0 sm:h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={RADAR_DATA}
                      outerRadius="58%"
                      margin={{ top: 18, right: 24, bottom: 18, left: 24 }}
                    >
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 8 }}
                      />
                      <Radar
                        dataKey="value"
                        stroke="var(--primary)"
                        fill="var(--primary)"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Strengths + Development stacked (right) */}
            <div className="grid min-w-0 gap-4 md:grid-rows-2">
              <SidePanel
                icon={<TrendingUp className="h-4 w-4" />}
                title="Strengths"
                tone="success"
              >
                {top.map((s) => {
                  const item = CTS_R.find((c) => c.no === s.itemNo)!;
                  return <ScoreRow key={s.itemNo} item={item} score={s.finalScore} />;
                })}
              </SidePanel>

              <SidePanel
                icon={<AlertTriangle className="h-4 w-4" />}
                title="Development areas"
                tone="warning"
              >
                {bottom.map((s) => {
                  const item = CTS_R.find((c) => c.no === s.itemNo)!;
                  return <ScoreRow key={s.itemNo} item={item} score={s.finalScore} />;
                })}
              </SidePanel>
            </div>
          </div>

          {/* Feedback for Student — inside left column */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Feedback for Student</h3>
              <span className="text-[11px] text-muted-foreground">ข้อเสนอแนะสำหรับผู้ฝึก</span>
            </div>
            <div className="flex min-w-0 flex-col gap-4 p-5">
              {FEEDBACK_FIELDS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={`fb-${f.key}`}>
                    {f.label}{" "}
                    <span className="font-normal text-muted-foreground">({f.sub})</span>
                  </Label>
                  <Textarea
                    id={`fb-${f.key}`}
                    rows={f.rows}
                    value={feedback[f.key]}
                    onChange={(e) => setFeedback((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={`เขียน${f.label}...`}
                    className="max-w-full resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
         </div>

          {/* Item breakdown by category — right column, full height */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm self-start lg:sticky lg:top-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
            <h3 className="text-sm font-semibold">Item breakdown</h3>
            {/* Gradient legend */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#ef4444]">0</span>
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#16a34a]" />
              <span className="text-[10px] text-[#16a34a]">6</span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {CATEGORIES.map((cat) => {
              const items = AI_SCORES.filter((s) => {
                const item = CTS_R.find((c) => c.no === s.itemNo)!;
                return item.cat === cat;
              });
              return (
                <div key={cat}>
                  <div className="bg-surface px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat}
                  </div>
                  <div className="divide-y divide-border">
                    {items.map((s) => {
                      const item = CTS_R.find((c) => c.no === s.itemNo)!;
                      const adjusted = s.aiScore !== s.finalScore;
                      const final = s.finalScore ?? 0;
                      const c = scoreColor(final);
                      return (
                        <div
                          key={s.itemNo}
                          className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface/60"
                        >
                          {/* color rail */}
                          <span
                            className="h-10 w-1 flex-shrink-0 rounded-full"
                            style={{ background: item.colorVar }}
                          />
                          <ScoreBadge score={s.finalScore} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium text-foreground">
                                {item.no}. {item.name}
                              </span>
                              {adjusted && (
                                <Badge variant="warning" className="flex-shrink-0">
                                  Adjusted
                                </Badge>
                              )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Sparkles className="h-2.5 w-2.5" /> AI: {s.aiScore}
                              </span>
                              <span className="text-border">·</span>
                              <span>{SCORE_LABELS[final]}</span>
                            </div>
                          </div>
                          {/* score bar */}
                          <div className="hidden w-32 sm:block">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn("h-full rounded-full transition-all", c.bar)}
                                style={{ width: `${(final / 6) * 100}%` }}
                              />
                            </div>
                            <div className="mt-1 text-right text-[10px] font-medium text-muted-foreground">
                              {final}/6
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ScoreRow({ item, score }: { item: typeof CTS_R[number]; score: number | null }) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface">
      <span
        className="h-8 w-1 flex-shrink-0 rounded-full"
        style={{ background: item.colorVar }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-foreground">
          {item.no}. {item.name}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {score !== null ? SCORE_LABELS[score] : "—"}
        </div>
      </div>
      <ScoreBadge score={score} size="sm" />
    </div>
  );
}

function SidePanel({
  icon,
  title,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "success" | "warning";
  children: React.ReactNode;
}) {
  const toneCls =
    tone === "success"
      ? "text-success border-success/20 bg-success/5"
      : "text-warning border-warning/20 bg-warning/5";
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className={cn("flex items-center gap-2 border-b border-border px-4 py-2.5", toneCls.split(" ").filter((c) => c.startsWith("text-")).join(" "))}>
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="space-y-1 p-2">{children}</div>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  unit,
  hint,
  tone,
  scoreToned,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone?: "muted" | "destructive" | "warning" | "success" | "primary";
  scoreToned?: number;
}) {
  const toneCls: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    primary: "text-primary",
    muted: "text-muted-foreground",
  };
  const valueColor = scoreToned !== undefined ? scoreColor(scoreToned).text : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-2.5 flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold tabular-nums", valueColor)}>{value}</span>
        {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
      <div className={cn("mt-1 text-xs", tone ? toneCls[tone] : "text-muted-foreground")}>
        {hint}
      </div>
    </div>
  );
}
