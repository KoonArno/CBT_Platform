"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FileDown,
  FileText,
  Check,
  MessageSquare,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { CTS_R, SCORE_LABELS, scoreLabel } from "@/lib/cts-data";
import { AI_SCORES, CURRENT_SESSION, MOCK_STUDENT_FEEDBACK } from "@/lib/mock-data";
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

const SECTIONS = [
  { k: "overall", label: "สรุปคะแนนรวม", sub: "Total · Average" },
  { k: "perItem", label: "รายละเอียดคะแนน", sub: "12 items × 0–6" },
  { k: "feedback", label: "Feedback", sub: "จุดแข็ง · พัฒนา · ข้อเสนอแนะ" },
] as const;

type SectionKey = typeof SECTIONS[number]["k"];

export default function ReportPage() {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    overall: true,
    perItem: true,
    feedback: true,
  });
  const [format, setFormat] = useState<"pdf" | "word">("pdf");
  const [generated, setGenerated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    setSubmitting(true);
    toast.success("ส่งการประเมินเรียบร้อยแล้ว");
    setTimeout(() => router.push("/sessions"), 600);
  };

  const toggle = (k: SectionKey) =>
    setSections((p) => ({ ...p, [k]: !p[k] }));

  return (
    <>
      <PageHeader
        title="Supervision Report"
        subtitle="เลือกส่วนที่ต้องการรวมในรายงาน แล้ว Generate"
      />

      <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Left config panel */}
        <div className="space-y-4 lg:col-span-4">
          {/* Section checklist */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">เนื้อหาในรายงาน</h3>
            <div className="mt-3 space-y-2">
              {SECTIONS.map((s) => {
                const active = sections[s.k];
                return (
                  <button
                    key={s.k}
                    type="button"
                    onClick={() => toggle(s.k)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                      active
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span className={cn("font-medium", active ? "text-foreground" : "")}>
                        {s.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{s.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format picker */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">รูปแบบไฟล์</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["pdf", "word"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs transition-all",
                    format === f
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30",
                  )}
                >
                  <FileText
                    className={cn("h-6 w-6", format === f ? "text-primary" : "text-muted-foreground")}
                  />
                  <span className="font-semibold">
                    {f === "pdf" ? "PDF Report" : "Word Report"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              setGenerated(true);
              toast.success("สร้าง Report สำเร็จ");
            }}
          >
            <FileDown className="h-4 w-4" /> สร้าง Report
          </Button>

          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <Send className="h-4 w-4" /> Submit Evaluation
          </Button>

          {generated && (
            <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              <div className="font-semibold">พร้อมดาวน์โหลด</div>
              <div className="mt-0.5 text-xs text-success/80">
                cts-r-{CURRENT_SESSION.id.toLowerCase()}.{format === "pdf" ? "pdf" : "docx"}
              </div>
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-muted/30 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Preview
              </span>
            </div>

            {/* Paper */}
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-lg border border-border bg-card shadow-inner">
              <div className="space-y-8 px-4 py-6 sm:px-8 sm:py-8">
                {/* Header */}
                <div className="border-b border-border pb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                    CTS-R Evaluation Report
                  </div>
                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    รายงานการประเมินทักษะการบำบัดทางความคิดและพฤติกรรม
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <MetaField label="Therapist" value={CURRENT_SESSION.therapist} />
                    <MetaField
                      label="Client & Session No."
                      value={`${CURRENT_SESSION.client} · ${CURRENT_SESSION.id}`}
                    />
                    <MetaField label="Supervisor" value="Dr. Wattana" />
                    <MetaField label="Session Date" value={formatDate(CURRENT_SESSION.date)} />
                  </div>
                </div>

                {/* Overall */}
                {sections.overall && (
                  <section className="space-y-4">
                    <SectionTitle>Overall Score</SectionTitle>
                    <div className="flex items-end gap-4">
                      <div>
                        <div className="text-4xl font-bold tabular-nums text-foreground">
                          {TOTAL}
                        </div>
                        <div className="text-sm text-muted-foreground">/ 72 total</div>
                      </div>
                      <div className="pb-1">
                        <div className="text-2xl font-semibold tabular-nums text-foreground">
                          {AVG.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          avg / 6 — {scoreLabel(Math.round(AVG))}
                        </div>
                      </div>
                    </div>
                    {/* Total bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#16a34a]"
                        style={{ width: `${(TOTAL / 72) * 100}%` }}
                      />
                    </div>
                  </section>
                )}

                {/* Per-item */}
                {sections.perItem && (
                  <section className="space-y-3">
                    <SectionTitle>Score Breakdown</SectionTitle>
                    <div className="-mx-1 overflow-x-auto">
                    <table className="w-full min-w-[320px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground">
                          <th className="py-2 text-left font-medium">CTS-R Item</th>
                          <th className="py-2 text-center font-medium w-16">Score</th>
                          <th className="py-2 text-right font-medium w-24 hidden sm:table-cell">
                            Level
                          </th>
                          <th className="py-2 w-24 hidden md:table-cell" />
                        </tr>
                      </thead>
                      <tbody>
                        {AI_SCORES.map((s) => {
                          const item = CTS_R.find((c) => c.no === s.itemNo)!;
                          const final = s.finalScore ?? 0;
                          const col = SCORE_COLORS[final];
                          return (
                            <tr key={s.itemNo} className="border-b border-border/60">
                              <td className="py-2.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-7 w-1.5 flex-shrink-0 rounded-full"
                                    style={{ background: item.colorVar }}
                                  />
                                  <span>{item.no}. {item.name}</span>
                                </div>
                              </td>
                              <td className="py-2.5 text-center">
                                <span
                                  className={cn(
                                    "inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold ring-1 ring-inset",
                                    col.bg,
                                    col.text,
                                  )}
                                >
                                  {final}
                                </span>
                              </td>
                              <td className="py-2.5 text-right text-xs text-muted-foreground hidden sm:table-cell">
                                {SCORE_LABELS[final]}
                              </td>
                              <td className="py-2.5 hidden md:table-cell">
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted ml-auto">
                                  <div
                                    className={cn("h-full rounded-full", col.bar)}
                                    style={{ width: `${(final / 6) * 100}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  </section>
                )}

                {/* Feedback */}
                {sections.feedback && (
                  <section className="space-y-4">
                    <SectionTitle>
                      <MessageSquare className="h-3.5 w-3.5" /> Feedback
                    </SectionTitle>
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-success">
                          จุดแข็ง (Strengths)
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {MOCK_STUDENT_FEEDBACK.strengths}
                        </p>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">
                          สิ่งที่อยากให้ฝึกฝนพัฒนาเพิ่ม (Areas for Growth)
                        </div>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                          {MOCK_STUDENT_FEEDBACK.growth}
                        </p>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          ข้อเสนอแนะ (Suggestions)
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {MOCK_STUDENT_FEEDBACK.suggestions}
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
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
