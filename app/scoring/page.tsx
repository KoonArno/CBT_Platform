"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { CTS_R, RUBRICS, SCORE_LABELS } from "@/lib/cts-data";
import { AI_EVIDENCE, AI_SCORES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ScoringPage() {
  const [open, setOpen] = useState<string>("1");
  const [scores, setScores] = useState<Record<number, number | null>>(() =>
    Object.fromEntries(AI_SCORES.map((s) => [s.itemNo, s.finalScore])),
  );
  const [comments, setComments] = useState<Record<number, string>>({});
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());
  const [rubricFor, setRubricFor] = useState<number | null>(null);

  const setScore = (no: number, n: number) =>
    setScores((p) => ({ ...p, [no]: n }));
  const setComment = (no: number, v: string) =>
    setComments((p) => ({ ...p, [no]: v }));

  const confirmAndNext = (no: number) => {
    setConfirmed((prev) => new Set([...prev, no]));
    const next = CTS_R.find((i) => i.no > no && !confirmed.has(i.no));
    setOpen(next ? String(next.no) : "");
    toast.success(`บันทึกข้อ ${no} แล้ว`);
  };

  const rubricItem = rubricFor ? CTS_R.find((i) => i.no === rubricFor) : null;
  const rubricData = rubricFor ? RUBRICS[rubricFor] : null;

  return (
    <>
      <PageHeader
        title="ให้คะแนน CTS-R"
        subtitle="Scoring · ใช้ evidence ที่ยืนยันแล้วเพื่อให้คะแนนแต่ละหัวข้อ"
        right={
          <Link href="/summary">
            <Button>
              ไปหน้าสรุปคะแนน <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Accordion
          value={open}
          onValueChange={(v) => setOpen(v)}
          className="space-y-3"
        >
          {CTS_R.map((it) => {
            const itemEvidence = AI_EVIDENCE.filter(
              (e) =>
                e.itemNo === it.no &&
                (e.status === "confirmed" || e.status === "manual"),
            );
            const score = scores[it.no];
            const ai = AI_SCORES.find((s) => s.itemNo === it.no);
            return (
              <AccordionItem
                key={it.no}
                value={String(it.no)}
                className={cn(
                  "overflow-hidden rounded-xl border bg-card shadow-sm transition-colors",
                  confirmed.has(it.no)
                    ? "border-success/40 bg-success/5"
                    : "border-border",
                )}
              >
                <AccordionTrigger className="px-5 py-4 hover:bg-accent/30">
                  <div className="flex flex-1 items-center justify-between gap-4 pr-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-foreground/80 ring-1 ring-black/5"
                        style={{ backgroundColor: it.colorVar }}
                      >
                        {it.no}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">
                          {it.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {it.nameTh} · evidence {itemEvidence.length} รายการ
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRubricFor(it.no);
                        }}
                        className="hidden items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground/80 hover:bg-muted md:inline-flex"
                      >
                        <BookOpen className="h-3 w-3" /> ดู Rubric
                      </button>
                      {confirmed.has(it.no) ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" /> ยืนยันแล้ว
                        </span>
                      ) : (
                        <div
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            score !== null && score !== undefined
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {score !== null && score !== undefined
                            ? `Score ${score}`
                            : "ยังไม่ให้คะแนน"}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="border-t border-border bg-surface px-5 py-5">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {/* Confirmed evidence */}
                    <div>
                      <div className="mb-2 text-xs font-semibold text-muted-foreground">
                        Evidence ที่ยืนยันแล้ว ({itemEvidence.length})
                      </div>
                      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                        {itemEvidence.length === 0 && (
                          <div className="rounded-md border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
                            ยังไม่มี evidence — กลับไปยืนยันที่หน้า Review
                          </div>
                        )}
                        {itemEvidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="rounded-md border border-border bg-card p-3 text-sm"
                          >
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {ev.ref}
                            </div>
                            <p
                              className="mt-1 border-l-2 pl-2 leading-relaxed text-foreground/90"
                              style={{ borderColor: it.colorVar }}
                            >
                              &ldquo;{ev.quote}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Score & comment */}
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-xs font-semibold text-muted-foreground">
                            ให้คะแนน (0–6)
                          </div>
                          <button
                            type="button"
                            onClick={() => setRubricFor(it.no)}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs md:hidden"
                          >
                            <BookOpen className="h-3 w-3" /> Rubric
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                          {[0, 1, 2, 3, 4, 5, 6].map((n) => {
                            const isSelected = score === n;
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setScore(it.no, n)}
                                className={cn(
                                  "rounded-md border py-2 text-sm font-semibold transition-all",
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground shadow"
                                    : "border-border bg-card hover:border-primary/40 hover:bg-accent",
                                )}
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>
                        {score !== null && score !== undefined && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {SCORE_LABELS[score]}
                            </span>
                            {" — "}
                            {RUBRICS[it.no]?.levels[score]}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 text-xs font-semibold text-muted-foreground">
                          ความคิดเห็น / คำแนะนำของ Supervisor
                        </div>
                        <Textarea
                          rows={4}
                          value={comments[it.no] ?? ""}
                          onChange={(e) => setComment(it.no, e.target.value)}
                          placeholder="เช่น แนะนำให้ฝึกการขอ feedback จาก client เป็นระยะ..."
                        />
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => confirmAndNext(it.no)}
                          >
                            <Save className="h-3.5 w-3.5" /> บันทึกและไปต่อ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Dialog
        open={!!rubricFor}
        onOpenChange={(o) => !o && setRubricFor(null)}
      >
        <DialogContent onClose={() => setRubricFor(null)}>
          <DialogHeader>
            <DialogTitle>
              Rubric {rubricItem ? `— ${rubricItem.name}` : ""}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex gap-3 rounded-md border border-border bg-card p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                    {n}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      {SCORE_LABELS[n]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rubricData?.levels[n]}
                    </div>
                  </div>
                </div>
              ))}
              {rubricData?.tip && (
                <div className="mt-3 rounded-md border border-dashed border-border bg-surface p-3 text-xs italic text-muted-foreground">
                  Tip: {rubricData.tip}
                </div>
              )}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
