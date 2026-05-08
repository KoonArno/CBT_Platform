"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ScoreDot } from "@/components/ui/ScoreDot";
import { Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTS_R, SCORE_LABELS, scoreColor } from "@/lib/cts-r";
import { SELF_REVIEW_PROMPTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Structure", "Technique", "Relationship"] as const;

export default function SelfReviewPage() {
  const [selfScores, setSelfScores] = useState<Record<number, number>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState<"scores" | "reflect">("scores");

  const total = CTS_R.reduce((acc, item) => acc + (selfScores[item.id] ?? 0), 0);

  if (submitted) {
    return (
      <div>
        <PageHeader title="Self-Review Form" />
        <Card className="px-6 py-12 text-center">
          <div className="mb-4 text-5xl">✅</div>
          <div className="mb-2 text-xl font-black text-ink">
            Self-Review Submitted
          </div>
          <div className="mb-5 text-sm text-ink-muted">
            Your supervisor will be able to view your self-assessment before the supervision session.
          </div>
          <div className="mb-1 text-3xl font-black text-brand">{total}/72</div>
          <div className="mb-6 text-[13px] text-ink-muted">
            {SCORE_LABELS[Math.min(6, Math.round(total / 12))]} — Your self-rating
          </div>
          <Button variant="ghost" onClick={() => setSubmitted(false)}>
            Edit Responses
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Self-Review Form"
        subtitle="Complete before supervision — rate yourself and reflect honestly"
      />

      <Tabs
        options={[
          ["scores", "CTS-R Scores"],
          ["reflect", "Reflections"],
        ] as const}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-4">
        {tab === "scores" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[13px] text-ink-muted">
                Rate yourself honestly on each of the 12 CTS-R items
              </div>
              <div
                className="text-2xl font-black"
                style={{ color: scoreColor(Math.round(total / 12)) }}
              >
                {total}
                <span className="text-[13px] font-normal text-ink-muted">/72</span>
              </div>
            </div>

            {CATEGORIES.map((cat) => (
              <div key={cat} className="mb-5">
                <div className="eyebrow mb-2.5 flex items-center gap-2 text-brand">
                  <div className="h-0.5 w-7 rounded bg-brand" />
                  {cat}
                </div>
                <div className="flex flex-col gap-2">
                  {CTS_R.filter((i) => i.cat === cat).map((item) => {
                    const sc = selfScores[item.id] ?? null;
                    return (
                      <Card key={item.id} className="px-4 py-3.5">
                        <div className="mb-2.5 flex items-center justify-between">
                          <div>
                            <div className="text-[13px] font-bold text-ink">
                              {item.name}
                            </div>
                            <div className="mt-0.5 text-[11px] text-ink-muted">
                              {item.tip}
                            </div>
                          </div>
                          <div className="flex-shrink-0 pl-3 text-center">
                            <ScoreDot score={sc} size={38} />
                            <div className="mt-1 text-[9px] text-ink-muted">
                              {sc !== null ? SCORE_LABELS[sc as 0] : "–"}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4, 5, 6].map((n) => {
                            const active = sc === n;
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() =>
                                  setSelfScores((p) => ({ ...p, [item.id]: n }))
                                }
                                className={cn(
                                  "flex-1 rounded-lg py-2 text-[13px] font-black transition",
                                  active ? "border-2" : "border bg-canvas",
                                )}
                                style={
                                  active
                                    ? {
                                        borderColor: scoreColor(n),
                                        background: `${scoreColor(n)}18`,
                                        color: scoreColor(n),
                                      }
                                    : { borderColor: "#C0CAD8", color: "#9BABC4" }
                                }
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "reflect" && (
          <div className="flex flex-col gap-3.5">
            {SELF_REVIEW_PROMPTS.map((q, i) => (
              <Card key={i} className="px-4 py-4">
                <div className="mb-2.5 text-[13px] font-bold text-ink">
                  <span className="mr-2 text-brand">{i + 1}.</span>
                  {q}
                </div>
                <Textarea
                  className="!h-[90px]"
                  placeholder="Write your honest reflection here…"
                  value={answers[i] ?? ""}
                  onChange={(e) =>
                    setAnswers((p) => ({ ...p, [i]: e.target.value }))
                  }
                />
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="muted">Save Draft</Button>
          <Button variant="primary" onClick={() => setSubmitted(true)}>
            Submit to Supervisor ✓
          </Button>
        </div>
      </div>
    </div>
  );
}
