import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SummaryChart } from "@/app/sessions/[id]/summary/SummaryChart";
import { CTS_R, SCORE_LABELS, scoreLabel } from "@/lib/cts-data";
import { AI_SCORES, MOCK_STUDENT_FEEDBACK, RECENT_SESSIONS } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

const TOTAL = AI_SCORES.reduce((a, s) => a + (s.finalScore ?? 0), 0);
const AVG = TOTAL / 12;
const RADAR_DATA = CTS_R.map((c) => ({
  name:
    c.short.length > 18
      ? `${c.no}. ${c.short.slice(0, 16)}…`
      : `${c.no}. ${c.short}`,
  value: AI_SCORES.find((s) => s.itemNo === c.no)?.finalScore ?? 0,
}));

const SCORE_COLORS: Record<number, { bg: string; text: string; bar: string }> = {
  0: { bg: "bg-[#ef4444]/15", text: "text-[#ef4444]", bar: "bg-[#ef4444]" },
  1: { bg: "bg-[#f97316]/15", text: "text-[#f97316]", bar: "bg-[#f97316]" },
  2: { bg: "bg-[#f59e0b]/15", text: "text-[#f59e0b]", bar: "bg-[#f59e0b]" },
  3: { bg: "bg-[#eab308]/15", text: "text-[#eab308]", bar: "bg-[#eab308]" },
  4: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]", bar: "bg-[#84cc16]" },
  5: { bg: "bg-[#22c55e]/15", text: "text-[#22c55e]", bar: "bg-[#22c55e]" },
  6: { bg: "bg-[#16a34a]/15", text: "text-[#16a34a]", bar: "bg-[#16a34a]" },
};

export default async function SessionSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = RECENT_SESSIONS.find((s) => s.id === id);
  if (!session) notFound();

  return (
    <>
      <PageHeader
        title={`${session.client} · Summary`}
        subtitle={`${session.id} · ${formatDate(session.date)}`}
        showStepper={false}
        right={
          <div className="flex gap-2">
            <Link href={`/sessions/${session.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" /> Back to session
              </Button>
            </Link>
            <Link href={`/sessions/${session.id}/report`}>
              <Button size="sm">
                <FileText className="h-4 w-4" /> Open Report
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total score
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums text-foreground">{TOTAL}</span>
              <span className="text-sm text-muted-foreground">/72</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              avg {AVG.toFixed(1)} / 6 · {scoreLabel(Math.round(AVG))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="text-sm font-semibold text-foreground">Feedback</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <FeedbackBlock title="จุดแข็ง" value={MOCK_STUDENT_FEEDBACK.strengths} />
              <FeedbackBlock title="พัฒนา" value={MOCK_STUDENT_FEEDBACK.growth} />
              <FeedbackBlock title="ข้อเสนอแนะ" value={MOCK_STUDENT_FEEDBACK.suggestions} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Competency profile</h3>
            </div>
            <span className="text-[11px] text-muted-foreground">
              12 items × 0–6
            </span>
          </div>
          <div className="p-2 sm:p-4">
            <div className="h-[280px] min-w-0 sm:h-[380px]">
              <SummaryChart data={RADAR_DATA} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h3 className="text-sm font-semibold">Score breakdown</h3>
            <Badge variant="secondary">12 items × 0–6</Badge>
          </div>
          <div className="divide-y divide-border">
            {AI_SCORES.map((s) => {
              const item = CTS_R.find((c) => c.no === s.itemNo)!;
              const final = s.finalScore ?? 0;
              const color = SCORE_COLORS[final];
              return (
                <div key={s.itemNo} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-10 w-1 shrink-0 rounded-full" style={{ background: item.colorVar }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {item.no}. {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{SCORE_LABELS[final]}</div>
                  </div>
                  <div className="hidden w-28 sm:block">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full", color.bar)} style={{ width: `${(final / 6) * 100}%` }} />
                    </div>
                  </div>
                  <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold", color.bg, color.text)}>
                    {final}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function FeedbackBlock({ title, value }: { title: string; value: string }) {
  return (
    <details className="group rounded-lg border border-border bg-surface p-3 transition-colors open:bg-card">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-primary">{title}</div>
          <div className="text-[10px] font-medium text-muted-foreground">
            <span className="group-open:hidden">ดูทั้งหมด</span>
            <span className="hidden group-open:inline">ย่อ</span>
          </div>
        </div>
        <p className="mt-1 line-clamp-4 text-xs leading-relaxed text-muted-foreground group-open:hidden">
          {value}
        </p>
      </summary>
      <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-foreground/90">
        {value}
      </p>
    </details>
  );
}
