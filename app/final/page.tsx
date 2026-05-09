"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Send,
  Save,
  FileText,
  Download,
  LayoutDashboard,
  ArrowLeft,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { CTS_R, scoreLabel } from "@/lib/cts-data";
import {
  AI_SCORES,
  AI_EVIDENCE,
  CURRENT_SESSION,
  MOCK_STUDENT_FEEDBACK,
  SESSION_META,
} from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

const TAB_OPTIONS = [
  ["scores", "Score Summary"],
  ["feedback", "Feedback Preview"],
  ["evidence", "Evidence Summary"],
  ["info", "Session Info"],
] as const;

type TabKey = typeof TAB_OPTIONS[number][0];

const CHECKLIST = [
  { k: "scores", label: "Scores reviewed", sub: "ตรวจสอบคะแนนทั้ง 12 ข้อแล้ว" },
  { k: "evidence", label: "Evidence linked", sub: "Evidence แต่ละข้อเชื่อมกับ transcript" },
  { k: "feedback", label: "Feedback edited", sub: "ตรวจสอบและแก้ไข feedback แล้ว" },
  { k: "info", label: "Session info completed", sub: "ข้อมูล session ครบถ้วน" },
] as const;

type ChecklistKey = typeof CHECKLIST[number]["k"];

const SCORE_COLORS: Record<number, { bg: string; text: string; ring: string }> = {
  0: { bg: "bg-[#ef4444]/15", text: "text-[#ef4444]", ring: "ring-[#ef4444]/40" },
  1: { bg: "bg-[#f97316]/15", text: "text-[#f97316]", ring: "ring-[#f97316]/40" },
  2: { bg: "bg-[#f59e0b]/15", text: "text-[#f59e0b]", ring: "ring-[#f59e0b]/40" },
  3: { bg: "bg-[#eab308]/15", text: "text-[#eab308]", ring: "ring-[#eab308]/40" },
  4: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]", ring: "ring-[#84cc16]/40" },
  5: { bg: "bg-[#22c55e]/15", text: "text-[#22c55e]", ring: "ring-[#22c55e]/40" },
  6: { bg: "bg-[#16a34a]/15", text: "text-[#16a34a]", ring: "ring-[#16a34a]/40" },
};

const TOTAL = AI_SCORES.reduce((a, s) => a + (s.finalScore ?? 0), 0);
const AVG = TOTAL / 12;

function profileFromAvg(avg: number) {
  if (avg >= 5) return { label: "Advanced", tone: "success" as const };
  if (avg >= 4) return { label: "Competent", tone: "secondary" as const };
  if (avg >= 3) return { label: "Developing", tone: "warning" as const };
  return { label: "Beginner", tone: "outline" as const };
}

export default function FinalPage() {
  const [tab, setTab] = useState<TabKey>("scores");
  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>({
    scores: true,
    evidence: true,
    feedback: true,
    info: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const allDone = Object.values(checked).every(Boolean);
  const doneCount = Object.values(checked).filter(Boolean).length;

  const profile = useMemo(() => profileFromAvg(AVG), []);
  const confirmedEvidence = AI_EVIDENCE.filter(
    (e) => e.status === "confirmed" || e.status === "manual",
  );

  if (submitted) {
    return <SubmittedView profile={profile} />;
  }

  return (
    <>
      <PageHeader
        title="Final Review"
        subtitle="ตรวจสอบและยืนยันผลการประเมินก่อนส่ง — Review and submit the supervision evaluation."
        right={
          <Link href="/report">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back to report
            </Button>
          </Link>
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main: tabs */}
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="-mx-1 overflow-x-auto px-1">
                <Tabs<TabKey> options={TAB_OPTIONS} value={tab} onChange={setTab} />
              </div>
              <Badge variant="outline" className="gap-1.5">
                <ClipboardCheck className="h-3 w-3" />
                {doneCount}/{CHECKLIST.length} checks done
              </Badge>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm">
              {tab === "scores" && <ScoreSummaryTab profile={profile} />}
              {tab === "feedback" && <FeedbackPreviewTab />}
              {tab === "evidence" && (
                <EvidenceSummaryTab evidence={confirmedEvidence} />
              )}
              {tab === "info" && <SessionInfoTab />}
            </div>
          </div>

          {/* Sidebar: checklist */}
          <aside className="self-start lg:sticky lg:top-4">
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-3">
                <h3 className="text-sm font-semibold">Review Checklist</h3>
                <p className="text-[11px] text-muted-foreground">
                  ตรวจให้ครบก่อน submit
                </p>
              </div>
              <ul className="space-y-1 p-3">
                {CHECKLIST.map((c) => (
                  <li key={c.k}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface">
                      <input
                        type="checkbox"
                        checked={checked[c.k]}
                        onChange={(e) =>
                          setChecked((p) => ({ ...p, [c.k]: e.target.checked }))
                        }
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-2 focus:ring-ring"
                      />
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium",
                            checked[c.k]
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {c.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {c.sub}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border p-4">
                {allDone ? (
                  <div className="mb-3 flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    All good to submit!
                  </div>
                ) : (
                  <div className="mb-3 rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
                    เหลืออีก {CHECKLIST.length - doneCount} ข้อก่อน submit
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full"
                    disabled={!allDone}
                    onClick={() => setSubmitted(true)}
                  >
                    <Send className="h-4 w-4" /> Submit Evaluation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Save className="h-4 w-4" /> Save as Draft
                  </Button>
                </div>
              </div>
            </div>

            <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
              ⚠️ AI is your assistant, not the decision maker. All scores and
              feedback should be reviewed and confirmed by the supervisor.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

/* -------------------- Tab panels -------------------- */

function ScoreSummaryTab({
  profile,
}: {
  profile: { label: string; tone: "success" | "secondary" | "warning" | "outline" };
}) {
  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">CTS-R Score Summary</h3>
          <p className="text-xs text-muted-foreground">
            12 items × 0–6 — AI suggested vs. Final score
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Overall Profile
            </div>
            <Badge variant={profile.tone} className="mt-0.5">
              <Award className="h-3 w-3" /> {profile.label}
            </Badge>
          </div>
          <div className="rounded-lg border border-border bg-surface px-3 py-2 text-right">
            <div className="text-xl font-bold tabular-nums text-foreground">
              {TOTAL}
              <span className="text-xs font-normal text-muted-foreground">
                /72
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              avg {AVG.toFixed(1)} — {scoreLabel(Math.round(AVG))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-surface text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Domain</th>
              <th className="px-3 py-2 text-center font-semibold">AI</th>
              <th className="px-3 py-2 text-center font-semibold">Final</th>
              <th className="px-3 py-2 text-right font-semibold">Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CTS_R.map((item) => {
              const s = AI_SCORES.find((x) => x.itemNo === item.no)!;
              const ai = s.aiScore ?? 0;
              const final = s.finalScore ?? 0;
              const diff = final - ai;
              const c = SCORE_COLORS[final];
              return (
                <tr key={item.no} className="hover:bg-surface/60">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-6 w-1 flex-shrink-0 rounded-full"
                        style={{ background: item.colorVar }}
                      />
                      <span className="text-foreground">
                        <span className="text-muted-foreground">
                          {item.no}.
                        </span>{" "}
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-muted-foreground tabular-nums">
                      {ai}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ring-1 ring-inset tabular-nums",
                        c.bg,
                        c.text,
                        c.ring,
                      )}
                    >
                      {final}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <DiffPill diff={diff} />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-surface text-xs">
            <tr>
              <td className="px-3 py-2 font-semibold text-foreground">Total</td>
              <td className="px-3 py-2 text-center text-muted-foreground tabular-nums">
                {AI_SCORES.reduce((a, s) => a + (s.aiScore ?? 0), 0)}
              </td>
              <td className="px-3 py-2 text-center font-bold text-foreground tabular-nums">
                {TOTAL}
              </td>
              <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                {(() => {
                  const d =
                    TOTAL -
                    AI_SCORES.reduce((a, s) => a + (s.aiScore ?? 0), 0);
                  return d === 0 ? "—" : d > 0 ? `+${d}` : `${d}`;
                })()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function DiffPill({ diff }: { diff: number }) {
  if (diff === 0)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[11px] font-medium text-success">
        <TrendingUp className="h-3 w-3" /> +{diff}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive">
      <TrendingDown className="h-3 w-3" /> {diff}
    </span>
  );
}

function FeedbackPreviewTab() {
  const blocks = [
    {
      label: "จุดแข็ง (Strengths)",
      content: MOCK_STUDENT_FEEDBACK.strengths,
      tone: "text-success",
    },
    {
      label: "สิ่งที่อยากให้ฝึกฝนพัฒนาเพิ่ม (Areas for Growth)",
      content: MOCK_STUDENT_FEEDBACK.growth,
      tone: "text-warning",
    },
    {
      label: "ข้อเสนอแนะ (Suggestions)",
      content: MOCK_STUDENT_FEEDBACK.suggestions,
      tone: "text-primary",
    },
  ];
  return (
    <div className="space-y-4 p-5">
      <div>
        <h3 className="text-sm font-semibold">Feedback Preview</h3>
        <p className="text-xs text-muted-foreground">
          ผู้ฝึกจะเห็น feedback แบบนี้หลัง supervisor submit
        </p>
      </div>
      <div className="space-y-4 rounded-lg border border-border bg-surface/40 p-5">
        {blocks.map((b) => (
          <div key={b.label}>
            <div
              className={cn(
                "mb-1 text-xs font-semibold uppercase tracking-wide",
                b.tone,
              )}
            >
              {b.label}
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {b.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceSummaryTab({
  evidence,
}: {
  evidence: typeof AI_EVIDENCE;
}) {
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Evidence Summary</h3>
          <p className="text-xs text-muted-foreground">
            Evidence ที่ confirmed + manual ทั้งหมด {evidence.length} รายการ
          </p>
        </div>
        <Badge variant="secondary">{evidence.length} quotes</Badge>
      </div>
      <ul className="space-y-2">
        {evidence.map((e) => {
          const item = CTS_R.find((c) => c.no === e.itemNo)!;
          return (
            <li
              key={e.id}
              className="flex gap-3 rounded-lg border border-border bg-surface/40 p-3"
            >
              <span
                className="h-full w-1 flex-shrink-0 rounded-full"
                style={{ background: item.colorVar }}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {item.no}. {item.short}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {e.ref}
                  </span>
                  <Badge
                    variant={e.status === "manual" ? "outline" : "secondary"}
                    className="text-[10px]"
                  >
                    {e.status}
                  </Badge>
                </div>
                <p className="text-sm italic leading-relaxed text-foreground/85">
                  &ldquo;{e.quote}&rdquo;
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SessionInfoTab() {
  const fields = [
    { label: "Session ID", value: CURRENT_SESSION.id },
    { label: "Client", value: CURRENT_SESSION.client },
    { label: "Therapist / Trainee", value: CURRENT_SESSION.therapist },
    { label: "Modality", value: CURRENT_SESSION.modality },
    { label: "Session date", value: formatDate(CURRENT_SESSION.date) },
    { label: "Duration", value: SESSION_META.duration },
    { label: "File", value: SESSION_META.fileName },
    { label: "Word count", value: SESSION_META.wordCount.toLocaleString() },
    { label: "Language", value: SESSION_META.language },
    { label: "Supervisor", value: "Dr. Wattana — PhD, CBT Lab" },
  ];
  return (
    <div className="space-y-4 p-5">
      <div>
        <h3 className="text-sm font-semibold">Session Info</h3>
        <p className="text-xs text-muted-foreground">
          ข้อมูล metadata ของ session นี้
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className="rounded-lg border border-border bg-surface/40 px-4 py-3"
          >
            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {f.label}
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* -------------------- Submitted view -------------------- */

function SubmittedView({
  profile,
}: {
  profile: { label: string; tone: "success" | "secondary" | "warning" | "outline" };
}) {
  return (
    <>
      <PageHeader title="Evaluation Submitted" subtitle="Sign-off complete." />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Hero */}
          <div className="rounded-xl border border-success/30 bg-success/5 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Evaluation Submitted
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    การประเมินถูกบันทึกเรียบร้อยแล้ว · ผู้ฝึกจะได้รับ feedback ผ่าน Supervisions tab
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/report">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" /> View Report
                  </Button>
                </Link>
                <Button size="sm">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Session summary KPI grid */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Session Summary</h3>
            </div>
            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi
                icon={<User className="h-4 w-4" />}
                label="Therapist"
                value={CURRENT_SESSION.therapist}
              />
              <Kpi
                icon={<Calendar className="h-4 w-4" />}
                label="Session date"
                value={formatDate(CURRENT_SESSION.date)}
              />
              <Kpi
                icon={<Clock className="h-4 w-4" />}
                label="Duration"
                value={SESSION_META.duration}
              />
              <Kpi
                icon={<Award className="h-4 w-4" />}
                label="Overall score"
                value={
                  <span className="flex items-baseline gap-1">
                    <span className="text-base font-bold tabular-nums text-foreground">
                      {TOTAL}
                    </span>
                    <span className="text-xs text-muted-foreground">/72</span>
                    <Badge variant={profile.tone} className="ml-1 text-[10px]">
                      {profile.label}
                    </Badge>
                  </span>
                }
              />
            </div>
          </div>

          {/* What's next */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold">What&apos;s next?</h3>
            <p className="text-sm text-muted-foreground">
              ผู้ฝึก ({CURRENT_SESSION.therapist}) จะได้รับ notification และ
              สามารถดู feedback ได้ใน <span className="text-foreground font-medium">Supervisions</span> tab
              สำหรับ supervisor สามารถดูรายงานทั้งหมดในหน้า{" "}
              <Link href="/sessions" className="text-primary underline">
                Sessions
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link href="/sessions">
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">Start a new review</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b border-border px-5 py-4 last:border-b-0 sm:border-b sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
