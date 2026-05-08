"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Textarea, SectionLabel } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { AudioPlayer } from "@/components/cts-r/AudioPlayer";
import { CBT_SEGMENTS } from "@/lib/cbt-segments";
import { CTS_R } from "@/lib/cts-r";
import { SAMPLE_TRANSCRIPT } from "@/lib/mock-data";
import type { CBTSegment } from "@/lib/types";

interface Annotation {
  lineIdx: number;
  text: string;
  itemId: number;
  note: string;
}

export default function TapescriptPage() {
  const [tab, setTab] = useState<"transcript" | "structure">("transcript");
  const [currentSeg, setCurrentSeg] = useState<CBTSegment>(CBT_SEGMENTS[0]);
  const [selItemId, setSelItemId] = useState(1);
  const [selLineIdx, setSelLineIdx] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const lines = SAMPLE_TRANSCRIPT.split("\n").filter((l) => l.trim()).map(
    (l, i, arr) => ({
      idx: i,
      speaker: l.startsWith("T:") ? ("T" as const) : ("C" as const),
      text: l.replace(/^[TC]:\s*/, "").trim(),
      segment:
        CBT_SEGMENTS[Math.floor((i / arr.length) * CBT_SEGMENTS.length)]?.id ??
        "intro",
      timestamp: Math.floor((i / arr.length) * 60),
    }),
  );

  const segColor = (segId: string) =>
    CBT_SEGMENTS.find((s) => s.id === segId)?.color ?? "#6B7A9A";

  const addAnnotation = () => {
    if (selLineIdx === null || !noteText.trim()) return;
    const line = lines[selLineIdx];
    setAnnotations((p) => [
      ...p,
      { lineIdx: selLineIdx, text: line.text, itemId: selItemId, note: noteText },
    ]);
    setNoteText("");
    setSelLineIdx(null);
  };

  return (
    <div>
      <PageHeader
        title="Annotated Tapescript"
        subtitle="Upload audio/video, auto-process transcript, annotate with CTS-R items"
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3.5">
          <Button variant="orange">📁 Upload Audio/Video</Button>
          <div className="h-7 w-px bg-rule" />
          <Button variant="primary">✦ AI Process Transcript</Button>
          <div className="text-xs text-ink-muted">
            De-identify · Diarise · CBT Structure · Timestamps
          </div>
        </div>
      </Card>

      <AudioPlayer
        segments={CBT_SEGMENTS}
        currentSeg={currentSeg}
        onSegmentClick={setCurrentSeg}
      />

      <div className="mb-4">
        <Tabs
          options={[
            ["transcript", "Transcript"],
            ["structure", "CBT Structure"],
          ] as const}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="max-h-[580px] overflow-y-auto">
          {tab === "transcript" ? (
            <div>
              {lines.map((line) => {
                const isT = line.speaker === "T";
                const isActive = selLineIdx === line.idx;
                const annosForLine = annotations.filter(
                  (a) => a.lineIdx === line.idx,
                );
                return (
                  <div key={line.idx} className="mb-1">
                    <div
                      onClick={() => setSelLineIdx(line.idx)}
                      className={`flex cursor-pointer gap-2.5 rounded-lg px-3 py-2 transition ${
                        isActive
                          ? "bg-brand-tint"
                          : isT
                            ? "bg-blue-50/40"
                            : "bg-transparent"
                      }`}
                      style={{
                        borderLeft: `3px solid ${
                          isActive
                            ? "#3B75E8"
                            : isT
                              ? segColor(line.segment)
                              : "#C0CAD8"
                        }`,
                      }}
                    >
                      <span className="w-8 flex-shrink-0 pt-0.5 text-[10px] font-semibold text-ink-muted">
                        {String(line.timestamp).padStart(2, "0")}m
                      </span>
                      <span
                        className={`flex-shrink-0 text-xs font-extrabold ${
                          isT ? "text-brand" : "text-ink-muted"
                        }`}
                      >
                        {line.speaker}
                      </span>
                      <span
                        className={`flex-1 text-[13px] leading-relaxed ${
                          isT ? "text-ink" : "text-ink-muted"
                        }`}
                      >
                        {line.text}
                      </span>
                      <span
                        className="self-center flex-shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                        style={{
                          color: segColor(line.segment),
                          background: `${segColor(line.segment)}15`,
                        }}
                      >
                        {CBT_SEGMENTS.find((s) => s.id === line.segment)?.label}
                      </span>
                    </div>
                    {annosForLine.map((a, ai) => (
                      <div
                        key={ai}
                        className="ml-12 mt-1 rounded-lg border border-accent-purple/30 bg-state-purpleBg px-3 py-1.5"
                      >
                        <span className="text-[11px] font-bold text-accent-purple">
                          ✦ Item {a.itemId} – {CTS_R[a.itemId - 1]?.name}:{" "}
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          {a.note}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {CBT_SEGMENTS.map((seg) => {
                const segLines = lines.filter((l) => l.segment === seg.id);
                return (
                  <div key={seg.id} className="mb-4">
                    <div
                      className="mb-2 flex items-center gap-2.5 rounded-xl border-l-4 px-3 py-2"
                      style={{
                        borderColor: seg.color,
                        background: `${seg.color}15`,
                      }}
                    >
                      <div className="flex-1">
                        <div className="text-[13px] font-extrabold text-ink">
                          {seg.label}
                        </div>
                        <div className="text-[11px] text-ink-muted">
                          {seg.start}–{seg.end} min
                        </div>
                      </div>
                    </div>
                    {segLines.slice(0, 3).map((l) => (
                      <div
                        key={l.idx}
                        className="ml-3 mb-1 border-l-2 px-3 py-1 text-xs"
                        style={{ borderColor: `${seg.color}33` }}
                      >
                        <b style={{ color: l.speaker === "T" ? "#3B75E8" : "#6B7A9A" }}>
                          {l.speaker}:
                        </b>{" "}
                        {l.text.slice(0, 100)}
                        {l.text.length > 100 ? "…" : ""}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card>
            <SectionLabel>Select CTS-R Item</SectionLabel>
            <div className="grid grid-cols-3 gap-1.5">
              {CTS_R.map((item) => {
                const active = selItemId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelItemId(item.id)}
                    className={`rounded-lg border-[1.5px] px-1.5 py-2 text-center text-[11px] font-bold leading-tight transition ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-rule bg-canvas text-ink-muted"
                    }`}
                  >
                    <div className="text-[9px] opacity-70">#{item.id}</div>
                    {item.short}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionLabel>Add Annotation</SectionLabel>
            <div className="mb-2.5 min-h-[40px] rounded-lg border border-rule bg-canvas px-2.5 py-2 text-xs text-ink-muted">
              {selLineIdx !== null ? (
                <span className="italic">
                  &ldquo;{lines[selLineIdx].text.slice(0, 80)}
                  {lines[selLineIdx].text.length > 80 ? "…" : ""}&rdquo;
                </span>
              ) : (
                <span className="text-ink-faint">← Click a transcript line</span>
              )}
            </div>
            <Textarea
              className="!h-[90px] !mb-2.5"
              placeholder="Supervisory observation..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button
              variant="primary"
              full
              onClick={addAnnotation}
              disabled={selLineIdx === null || !noteText.trim()}
            >
              Add Annotation
            </Button>
          </Card>

          <Card className="max-h-[260px] overflow-y-auto">
            <div className="mb-2.5 text-[13px] font-extrabold text-ink">
              Annotations ({annotations.length})
            </div>
            {annotations.length === 0 ? (
              <div className="py-4 text-center text-xs text-ink-muted">
                No annotations yet
              </div>
            ) : (
              annotations.map((a, i) => (
                <div key={i} className="border-b border-rule py-2 last:border-b-0">
                  <div className="mb-1 text-[11px] font-bold text-accent-purple">
                    Item {a.itemId}: {CTS_R[a.itemId - 1]?.name}
                  </div>
                  <div className="text-xs text-ink-muted">{a.note}</div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
