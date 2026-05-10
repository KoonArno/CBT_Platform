import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { CTS_R, SCORE_LABELS, scoreLabel } from "@/lib/cts-data";
import { AI_SCORES, CURRENT_SESSION, MOCK_STUDENT_FEEDBACK, RECENT_SESSIONS } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

const TOTAL = AI_SCORES.reduce((a, s) => a + (s.finalScore ?? 0), 0);
const AVG = TOTAL / 12;

const SCORE_COLORS: Record<number, { bg: string; text: string; bar: string }> = {
  0: { bg: "bg-[#ef4444]/15", text: "text-[#ef4444]", bar: "bg-[#ef4444]" },
  1: { bg: "bg-[#f97316]/15", text: "text-[#f97316]", bar: "bg-[#f97316]" },
  2: { bg: "bg-[#f59e0b]/15", text: "text-[#f59e0b]", bar: "bg-[#f59e0b]" },
  3: { bg: "bg-[#eab308]/15", text: "text-[#eab308]", bar: "bg-[#eab308]" },
  4: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]", bar: "bg-[#84cc16]" },
  5: { bg: "bg-[#22c55e]/15", text: "text-[#22c55e]", bar: "bg-[#22c55e]" },
  6: { bg: "bg-[#16a34a]/15", text: "text-[#16a34a]", bar: "bg-[#16a34a]" },
};

export default async function SessionReportPage({
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
        title={`${session.client} · Report`}
        subtitle={`${session.id} · ${formatDate(session.date)}`}
        showStepper={false}
        right={
          <div className="flex gap-2">
            <Link href={`/sessions/${session.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" /> Back to session
              </Button>
            </Link>
            <Button size="sm">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="border-b border-border pb-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              CTS-R Evaluation Report
            </div>
            <h2 className="mt-1 text-2xl font-bold text-foreground">
              รายงานการประเมินทักษะการบำบัดทางความคิดและพฤติกรรม
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <MetaField label="Therapist" value={session.therapist} />
              <MetaField label="Client & Session No." value={`${session.client} · ${session.id}`} />
              <MetaField label="Supervisor" value="Dr. Wattana" />
              <MetaField label="Session Date" value={formatDate(session.date)} />
            </div>
          </div>

          <section className="mt-6 space-y-4">
            <SectionTitle>Overall Score</SectionTitle>
            <div className="flex items-end gap-4">
              <div>
                <div className="text-4xl font-bold tabular-nums text-foreground">{TOTAL}</div>
                <div className="text-sm text-muted-foreground">/ 72 total</div>
              </div>
              <div className="pb-1">
                <div className="text-2xl font-semibold tabular-nums text-foreground">{AVG.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">avg / 6 · {scoreLabel(Math.round(AVG))}</div>
              </div>
            </div>
          </section>

          <section className="mt-8 space-y-3">
            <SectionTitle>Score Breakdown</SectionTitle>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 text-left font-medium">CTS-R Item</th>
                  <th className="w-16 py-2 text-center font-medium">Score</th>
                  <th className="hidden w-24 py-2 text-right font-medium sm:table-cell">Level</th>
                </tr>
              </thead>
              <tbody>
                {AI_SCORES.map((s) => {
                  const item = CTS_R.find((c) => c.no === s.itemNo)!;
                  const final = s.finalScore ?? 0;
                  const color = SCORE_COLORS[final];
                  return (
                    <tr key={s.itemNo} className="border-b border-border/60">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="h-7 w-1.5 shrink-0 rounded-full" style={{ background: item.colorVar }} />
                          <span>{item.no}. {item.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold", color.bg, color.text)}>
                          {final}
                        </span>
                      </td>
                      <td className="hidden py-2.5 text-right text-xs text-muted-foreground sm:table-cell">
                        {SCORE_LABELS[final]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="mt-8 space-y-4">
            <SectionTitle>Feedback</SectionTitle>
            <FeedbackBlock title="จุดแข็ง (Strengths)" value={MOCK_STUDENT_FEEDBACK.strengths} />
            <FeedbackBlock title="สิ่งที่อยากให้ฝึกฝนพัฒนาเพิ่ม (Areas for Growth)" value={MOCK_STUDENT_FEEDBACK.growth} />
            <FeedbackBlock title="ข้อเสนอแนะ (Suggestions)" value={MOCK_STUDENT_FEEDBACK.suggestions} />
          </section>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
      {children}
    </h3>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function FeedbackBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
        {title}
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
        {value}
      </p>
    </div>
  );
}
