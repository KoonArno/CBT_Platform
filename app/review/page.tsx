"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  X,
  Plus,
  Search,
  Filter,
  Sparkles,
  Inbox,
  FileText,
  Undo2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SpeakerAvatar } from "@/components/SpeakerAvatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CTS_R } from "@/lib/cts-data";
import {
  AI_EVIDENCE,
  TRANSCRIPT,
  CURRENT_SESSION,
  SESSION_META,
  type AiEvidence,
  type EvidenceStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ItemFilter = number | "all";
type StatusFilter = "all" | "suggested" | "confirmed";

const STATUS_OPTIONS: ReadonlyArray<readonly [StatusFilter, string]> = [
  ["all", "All"],
  ["suggested", "Suggested"],
  ["confirmed", "Confirmed"],
];

export default function ReviewPage() {
  const [evidence, setEvidence] = useState<AiEvidence[]>([...AI_EVIDENCE]);
  const [activeItem, setActiveItem] = useState<ItemFilter>("all");
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [taggingParagraphId, setTaggingParagraphId] = useState<string | null>(null);
  const transcriptRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const counts = useMemo(() => {
    const m: Record<number, number> = {};
    for (const it of CTS_R) m[it.no] = evidence.filter((e) => e.itemNo === it.no).length;
    return m;
  }, [evidence]);

  const filteredEvidence = useMemo(
    () =>
      evidence
        .filter((e) => {
          if (activeItem !== "all" && e.itemNo !== activeItem) return false;
          if (statusFilter !== "all" && e.status !== statusFilter) return false;
          return true;
        })
        .map((e, i) => ({ e, i }))
        .sort((a, b) => {
          const ac = a.e.status === "confirmed" ? 1 : 0;
          const bc = b.e.status === "confirmed" ? 1 : 0;
          if (ac !== bc) return ac - bc;
          return a.i - b.i;
        })
        .map((x) => x.e),
    [evidence, activeItem, statusFilter],
  );

  const filteredTranscript = useMemo(
    () =>
      !search
        ? TRANSCRIPT
        : TRANSCRIPT.filter((p) =>
            p.text.toLowerCase().includes(search.toLowerCase()),
          ),
    [search],
  );

  useEffect(() => {
    if (!activeEvidenceId) return;
    const ev = evidence.find((e) => e.id === activeEvidenceId);
    if (!ev) return;
    transcriptRefs.current[ev.paragraphId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeEvidenceId, evidence]);

  const itemMeta = (no: number) => CTS_R.find((c) => c.no === no)!;

  const confirm = (id: string) => {
    setEvidence((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "confirmed" } : e)),
    );
    toast.success("ยืนยัน evidence แล้ว");
  };
  const unconfirm = (id: string) => {
    setEvidence((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "suggested" } : e)),
    );
    toast("ยกเลิกการยืนยัน");
  };
  const remove = (id: string) => {
    const target = evidence.find((e) => e.id === id);
    setEvidence((prev) => prev.filter((e) => e.id !== id));
    toast("ลบ evidence แล้ว", {
      action: target
        ? {
            label: "Undo",
            onClick: () => setEvidence((prev) => [...prev, target]),
          }
        : undefined,
    });
  };

  const taggingParagraph = useMemo(
    () =>
      taggingParagraphId
        ? TRANSCRIPT.find((p) => p.id === taggingParagraphId) ?? null
        : null,
    [taggingParagraphId],
  );

  const tagParagraph = (itemNo: number) => {
    const p = taggingParagraph;
    if (!p) return;
    const newId = `ev-manual-${p.id}-${itemNo}-${Date.now()}`;
    setEvidence((prev) => [
      ...prev,
      {
        id: newId,
        itemNo,
        paragraphId: p.id,
        ref: p.ts,
        quote: p.text,
        status: "manual",
      },
    ]);
    setActiveEvidenceId(newId);
    setTaggingParagraphId(null);
    const item = CTS_R.find((c) => c.no === itemNo);
    toast.success(`ติดป้าย ${item?.no}. ${item?.short ?? ""} แล้ว`);
  };

  const confirmedCount = evidence.filter(
    (e) => e.status === "confirmed" || e.status === "manual",
  ).length;
  const total = evidence.length;
  const progress = total === 0 ? 0 : (confirmedCount / total) * 100;

  return (
    <>
      <PageHeader
        title="Review Evidence"
        subtitle={`${CURRENT_SESSION.id} · ${CURRENT_SESSION.client} · ${SESSION_META.duration}`}
        right={
          <>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:flex">
              <span className="text-muted-foreground">Confirmed</span>
              <span className="font-semibold text-foreground">
                {confirmedCount}/{total}
              </span>
              <span
                className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
                aria-hidden
              >
                <span
                  className="block h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </span>
            </div>
            <Link href="/scoring">
              <Button>
                Continue to scoring <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-5 lg:px-8">
        {/* LEFT: CTS-R items */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    CTS-R Items
                  </span>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  12
                </span>
              </div>
              <div className="p-2 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setActiveItem("all")}
                  className={cn(
                    "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    activeItem === "all"
                      ? "bg-primary/8 font-semibold text-primary"
                      : "text-foreground/80 hover:bg-muted",
                  )}
                >
                  <span>ทั้งหมด</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px]",
                      activeItem === "all"
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {evidence.length}
                  </span>
                </button>

                {CTS_R.map((it) => {
                  const active = activeItem === it.no;
                  const count = counts[it.no] ?? 0;
                  return (
                    <button
                      key={it.no}
                      type="button"
                      onClick={() => setActiveItem(it.no)}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
                        active
                          ? "bg-primary/8 font-semibold text-primary"
                          : "text-foreground/80 hover:bg-muted",
                      )}
                    >
                      <span
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/5"
                        style={{ backgroundColor: it.colorVar }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {it.no}. {it.name}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                          count > 0
                            ? "bg-muted text-muted-foreground"
                            : "bg-muted/60 text-muted-foreground/60",
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE: Evidence */}
        {!transcriptExpanded && (
        <section className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-sm font-semibold">AI-suggested evidence</h3>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Confirm or remove before scoring.
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-3.5 w-3.5" /> Add manually
              </Button>
            </div>

            <div className="space-y-3 p-4 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
              {filteredEvidence.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-surface-muted p-12 text-center">
                  <Inbox className="h-6 w-6 text-muted-foreground/60" />
                  <div className="text-sm font-medium text-foreground/70">
                    ไม่พบหลักฐานในหมวดนี้
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ลอง search ด้วย Keywords ที่เกี่ยวข้องกับเกณฑ์ข้อนี้ในเมนูด้านขวาเพื่อติดป้ายกำกับเพิ่มเติม
                  </div>
                </div>
              )}

              {filteredEvidence.map((ev) => {
                const meta = itemMeta(ev.itemNo);
                const isActive = activeEvidenceId === ev.id;
                return (
                  <article
                    key={ev.id}
                    onClick={() => setActiveEvidenceId(ev.id)}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden rounded-xl border bg-card p-4 transition-all",
                      isActive
                        ? "border-primary/40 shadow-md ring-2 ring-primary/15"
                        : "border-border hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm",
                    )}
                  >
                    {/* Color rail */}
                    <span
                      className="absolute inset-y-0 left-0 w-1"
                      style={{ backgroundColor: meta.colorVar }}
                      aria-hidden
                    />
                    <div className="flex items-start justify-between gap-3 pl-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold text-foreground/70 ring-1 ring-black/5"
                          style={{ backgroundColor: meta.colorVar }}
                        >
                          {meta.no}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {meta.short}
                        </span>
                        <StatusPill status={ev.status} />
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {ev.ref}
                      </span>
                    </div>

                    <p className="mt-3 pl-1 text-sm leading-relaxed text-foreground/85">
                      &ldquo;{ev.quote}&rdquo;
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 pl-1">
                      <span className="text-[11px] text-muted-foreground">
                        {meta.cat}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {ev.status === "confirmed" ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unconfirm(ev.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground/70 transition-colors hover:bg-muted"
                            aria-label="Undo confirmation"
                          >
                            <Undo2 className="h-3 w-3" /> Undo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirm(ev.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-2 py-1 text-[11px] font-medium text-success transition-colors hover:bg-success/20"
                            aria-label="Confirm evidence"
                          >
                            <Check className="h-3 w-3" /> Confirm
                          </button>
                        )}
                        {ev.status !== "confirmed" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(ev.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-destructive/20 bg-card px-2 py-1 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/10"
                            aria-label="Remove evidence"
                          >
                            <X className="h-3 w-3" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        )}

        {/* RIGHT: Transcript */}
        <section className={cn(transcriptExpanded ? "lg:col-span-9" : "lg:col-span-4")}>
          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-sm font-semibold">Full transcript</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Click a paragraph to label it as evidence.
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70">
                    {SESSION_META.fileName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTranscriptExpanded((v) => !v)}
                  aria-label={transcriptExpanded ? "Collapse transcript" : "Expand transcript"}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
                >
                  {transcriptExpanded ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search the transcript"
                      className="h-9 bg-surface pl-8 text-sm"
                    />
                  </div>
                  <Button
                    variant={showFilter ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowFilter((v) => !v)}
                    aria-label="Toggle filter"
                    className="h-9 w-9"
                  >
                    <Filter className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {showFilter && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs">
                    <span className="text-[11px] text-muted-foreground">
                      Status
                    </span>
                    {STATUS_OPTIONS.map(([s, label]) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatusFilter(s)}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
                          statusFilter === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 lg:max-h-[calc(100vh-340px)] lg:overflow-y-auto">
                {filteredTranscript.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center text-xs text-muted-foreground">
                    No matching paragraphs.
                  </div>
                )}
                {filteredTranscript.map((p) => {
                  const linked = evidence.find((e) => e.paragraphId === p.id);
                  const meta = linked ? itemMeta(linked.itemNo) : null;
                  const isActive = linked?.id === activeEvidenceId;
                  const isTherapist = p.speaker === "Therapist";

                  return (
                    <div
                      key={p.id}
                      ref={(el) => {
                        transcriptRefs.current[p.id] = el;
                      }}
                      onClick={() => {
                        if (linked) {
                          setActiveEvidenceId(linked.id);
                        } else if (isTherapist) {
                          setTaggingParagraphId(p.id);
                        }
                      }}
                      className={cn(
                        "group flex gap-2.5 transition-all",
                        (linked || isTherapist) && "cursor-pointer",
                      )}
                    >
                      <SpeakerAvatar speaker={p.speaker} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {p.speaker}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground/70">
                            {p.ts}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "relative rounded-lg border px-3.5 py-2.5 text-[13px] leading-relaxed transition-all",
                            !linked &&
                              "border-border bg-surface text-foreground/90 group-hover:border-primary/20",
                            linked &&
                              !isActive &&
                              "border-transparent text-foreground/90 shadow-sm",
                            isActive && "border-primary/30 shadow-md ring-2 ring-primary/15",
                            isTherapist
                              ? "rounded-tl-sm"
                              : "rounded-tl-lg",
                          )}
                          style={{
                            backgroundColor: meta
                              ? `color-mix(in oklch, ${meta.colorVar} 70%, var(--card))`
                              : undefined,
                          }}
                        >
                          {linked && (
                            <span
                              className="absolute -left-px top-3 bottom-3 w-0.5 rounded-full"
                              style={{ backgroundColor: meta!.colorVar }}
                              aria-hidden
                            />
                          )}
                          <p className="text-foreground/90">{p.text}</p>
                          {linked && (
                            <div className="mt-2 flex items-center gap-1.5 border-t border-foreground/10 pt-2">
                              <span
                                className="flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold text-foreground/70 ring-1 ring-black/5"
                                style={{ backgroundColor: meta!.colorVar }}
                              >
                                {meta!.no}
                              </span>
                              <span className="text-[10px] font-medium text-foreground/70">
                                Tagged · {meta!.short}
                              </span>
                              <StatusPill
                                status={linked.status}
                                className="ml-auto"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {taggingParagraph && (
        <TagModal
          paragraph={taggingParagraph}
          onClose={() => setTaggingParagraphId(null)}
          onSelect={tagParagraph}
        />
      )}
    </>
  );
}

function TagModal({
  paragraph,
  onClose,
  onSelect,
}: {
  paragraph: { id: string; ts: string; speaker: string; text: string };
  onClose: () => void;
  onSelect: (itemNo: number) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-base font-semibold text-foreground">
            ติดป้าย CTS-R Item
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-64px)] overflow-y-auto px-5 py-4">
          <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {paragraph.speaker}
              </div>
              <p className="mt-1 text-sm text-foreground/90">
                &ldquo;{paragraph.text}&rdquo;
              </p>
            </div>
            <span className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">
              {paragraph.ts}
            </span>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            เลือก label เพื่อบันทึกข้อความนี้เป็น evidence สำหรับการให้คะแนน
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CTS_R.map((it) => (
              <button
                key={it.no}
                type="button"
                onClick={() => onSelect(it.no)}
                className="group flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold text-foreground/70 ring-1 ring-black/5"
                  style={{ backgroundColor: it.colorVar }}
                >
                  {it.no}
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block text-sm font-medium text-foreground">
                    {it.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {it.nameTh}
                  </span>
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={onClose}
              className="group flex items-start gap-3 rounded-lg border border-dashed border-border bg-card px-3 py-2.5 text-left transition-all hover:border-foreground/30 hover:bg-muted/40 sm:col-span-2"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                ―
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-sm font-medium text-foreground">
                  Others
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  อื่น ๆ — ไม่จัดเข้า CTS-R item
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}) {
  const map: Record<EvidenceStatus, { label: string; cls: string }> = {
    confirmed: { label: "Confirmed", cls: "bg-success/15 text-success" },
    manual: { label: "Supervisor", cls: "bg-primary/10 text-primary" },
    suggested: {
      label: "Suggested",
      cls: "bg-warning/20 text-warning-foreground",
    },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        s.cls,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
