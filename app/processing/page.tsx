"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  Users,
  Brain,
  Highlighter,
  Wand2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CURRENT_SESSION, SESSION_META } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TASKS = [
  {
    k: "parse",
    label: "Parsing transcript",
    sub: "อ่านและแยก speaker turns จากไฟล์ DOCX",
    icon: FileText,
  },
  {
    k: "speakers",
    label: "Identifying speakers",
    sub: "ระบุ Therapist / Client ในแต่ละ turn",
    icon: Users,
  },
  {
    k: "analyze",
    label: "Analyzing therapeutic content",
    sub: "วิเคราะห์เนื้อหาด้วยโมเดล CBT",
    icon: Brain,
  },
  {
    k: "highlight",
    label: "Highlighting key moments",
    sub: "ระบุ moment สำคัญใน session",
    icon: Highlighter,
  },
  {
    k: "score",
    label: "Generating score suggestions",
    sub: "เสนอคะแนน CTS-R 12 ข้อพร้อม evidence",
    icon: Wand2,
  },
] as const;

const TICK_MS = 700;

export default function ProcessingPage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentIdx >= TASKS.length) return;
    const id = setInterval(() => {
      setCurrentIdx((i) => i + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [currentIdx]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const target = Math.round((currentIdx / TASKS.length) * 100);
        if (p >= target) return p;
        return Math.min(target, p + 2);
      });
    }, 30);
    return () => clearInterval(id);
  }, [currentIdx]);

  const done = currentIdx >= TASKS.length;
  const displayPct = done ? 100 : progress;

  return (
    <>
      <PageHeader
        title="AI Processing"
        subtitle="ระบบกำลังเตรียมเนื้อหา session เพื่อการรีวิว — Preparing transcript and AI suggestions."
        right={
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="h-3 w-3" /> AI-assisted
          </Badge>
        }
      />

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              {/* Donut progress */}
              <ProgressDonut value={displayPct} done={done} />

              {/* Session meta + state */}
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Session
                </div>
                <h2 className="mt-0.5 text-lg font-semibold text-foreground">
                  {CURRENT_SESSION.id} · {CURRENT_SESSION.client}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {SESSION_META.fileName} · {SESSION_META.duration} ·{" "}
                  {SESSION_META.wordCount.toLocaleString()} words
                </p>
                <p className="mt-4 text-sm text-foreground">
                  {done ? (
                    <span className="font-medium text-success">
                      ✓ Processing complete — พร้อมเข้าสู่ขั้นตอน Review
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      AI is transcribing and analyzing the session…
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Task checklist */}
            <ul className="mt-8 space-y-2">
              {TASKS.map((t, i) => {
                const isDone = i < currentIdx;
                const isActive = i === currentIdx && !done;
                const Icon = t.icon;
                return (
                  <li
                    key={t.k}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                      isDone &&
                        "border-success/30 bg-success/5",
                      isActive &&
                        "border-primary/40 bg-accent/40",
                      !isDone &&
                        !isActive &&
                        "border-border bg-surface/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                        isDone && "bg-success text-success-foreground",
                        isActive &&
                          "bg-primary text-primary-foreground",
                        !isDone &&
                          !isActive &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {isDone ? (
                        <Check className="h-4 w-4" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          isDone || isActive
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {t.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {t.sub}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "flex-shrink-0 text-[11px] font-medium",
                        isDone && "text-success",
                        isActive && "text-primary",
                        !isDone && !isActive && "text-muted-foreground/60",
                      )}
                    >
                      {isDone ? "Done" : isActive ? "Running" : "Queued"}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Note + actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                ⏱ การประมวลผลขึ้นกับความยาวของ session — โดยทั่วไปประมาณ
                1–3 นาที
              </p>
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" /> Cancel
                  </Button>
                </Link>
                <Button
                  size="sm"
                  disabled={!done}
                  onClick={() => router.push("/review")}
                >
                  Continue to Review <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            ⚠️ AI is your assistant, not the decision maker. All scores and
            feedback should be reviewed and confirmed by the supervisor.
          </p>
        </div>
      </div>
    </>
  );
}

function ProgressDonut({ value, done }: { value: number; done: boolean }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center">
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
      >
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={done ? "var(--success)" : "var(--primary)"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="transition-[stroke-dasharray] duration-300 ease-out"
        />
      </svg>
      <div className="text-center">
        <div className="text-3xl font-bold tabular-nums text-foreground">
          {value}
          <span className="text-base font-medium text-muted-foreground">%</span>
        </div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {done ? "Complete" : "Processing"}
        </div>
      </div>
    </div>
  );
}
