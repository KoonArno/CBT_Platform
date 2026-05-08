"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionLabel, Textarea } from "@/components/ui/Input";
import { CTSRScoreCard } from "@/components/cts-r/CTSRScoreCard";
import { RubricModal } from "@/components/cts-r/RubricModal";
import { CTS_R, scoreColor, SCORE_LABELS } from "@/lib/cts-r";
import type { ValidationDecision } from "@/lib/types";

export default function ScoringPage() {
  const [scores, setScores] = useState<Record<number, number | null>>({});
  const [validations, setValidations] = useState<Record<number, ValidationDecision>>({});
  const [rubricItem, setRubricItem] = useState<number | null>(null);
  const [strengths, setStrengths] = useState("");
  const [afd, setAfd] = useState("");
  const [goals, setGoals] = useState("");

  const total = CTS_R.reduce((acc, item) => acc + (scores[item.id] ?? 0), 0);
  const totalLevel = Math.min(6, Math.round(total / 12));

  return (
    <div>
      <RubricModal itemId={rubricItem} onClose={() => setRubricItem(null)} />

      <PageHeader
        title="CTS-R Scoring"
        subtitle="Score each item · 0–6 · click rubric for criteria"
        right={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div
                className="text-3xl font-black leading-none tracking-tight"
                style={{ color: scoreColor(totalLevel) }}
              >
                {total}
                <span className="text-sm font-normal text-ink-muted">/72</span>
              </div>
              <div className="text-[10px] text-ink-muted">
                CTS-R Total · {SCORE_LABELS[totalLevel]}
              </div>
            </div>
            <Button variant="orange">✦ AI Score</Button>
          </div>
        }
      />

      <div className="mb-5 grid gap-3 md:grid-cols-2">
        {CTS_R.map((item) => (
          <CTSRScoreCard
            key={item.id}
            item={item}
            score={scores[item.id] ?? null}
            validation={validations[item.id]}
            onScoreChange={(s) =>
              setScores((p) => ({ ...p, [item.id]: s }))
            }
            onValidate={(d) =>
              setValidations((p) => ({ ...p, [item.id]: d }))
            }
            onOpenRubric={() => setRubricItem(item.id)}
          />
        ))}
      </div>

      <Card>
        <h2 className="mb-3.5 text-sm font-extrabold text-ink">
          Supervision Notes
        </h2>
        <div className="grid gap-3.5 md:grid-cols-2">
          <div>
            <SectionLabel>Key Strengths</SectionLabel>
            <Textarea
              className="!h-[90px]"
              placeholder="Evidence-based strengths..."
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
            />
          </div>
          <div>
            <SectionLabel>Areas for Development</SectionLabel>
            <Textarea
              className="!h-[90px]"
              placeholder="Specific skill gaps..."
              value={afd}
              onChange={(e) => setAfd(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3.5">
          <SectionLabel>Goals for Next Session</SectionLabel>
          <Textarea
            className="!h-[70px]"
            placeholder="Agreed learning goals..."
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>
        <div className="mt-3.5 flex justify-end gap-2.5">
          <Button variant="muted">📝 Annotated Tape</Button>
          <Button variant="primary">Generate Report →</Button>
        </div>
      </Card>
    </div>
  );
}
