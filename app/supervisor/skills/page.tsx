"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea, SectionLabel, Select } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { THERAPISTS } from "@/lib/mock-data";

const EXERCISES = [
  { id: "thinking",    icon: "🧠", name: "Thinking Error Detection",     color: "#3B75E8", desc: "Identify cognitive distortions in a client statement" },
  { id: "arrow",       icon: "↓",  name: "Downward Arrow Practice",      color: "#E8923A", desc: "Uncover core beliefs by following the meaning chain" },
  { id: "socratic",    icon: "❓", name: "Socratic Questioning Practice", color: "#7c3aed", desc: "Generate Socratic questions for a given client belief" },
  { id: "formulation", icon: "🗺", name: "Formulation Drawing",          color: "#16a34a", desc: "Build a CBT 5-part or maintenance cycle formulation" },
] as const;

const PLACEHOLDERS: Record<string, string> = {
  thinking:    "e.g. 'I know my boss thinks I'm incompetent — she never gives me positive feedback'",
  arrow:       "e.g. 'I can't do anything right'",
  socratic:    "e.g. 'Nobody likes me'",
  formulation: "e.g. '32-year-old woman with social anxiety, perfectionism, recently promoted but feels like a fraud'",
};

export default function SupervisorSkillsPage() {
  const [selExId, setSelExId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const selEx = EXERCISES.find((e) => e.id === selExId);

  return (
    <div>
      <PageHeader
        title="CBT Skills Practice Lab"
        subtitle="AI-powered exercises to develop and demonstrate key CBT competencies"
      />

      <Card className="mb-5 border-[1.5px] border-brand/30 bg-brand-tint">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="text-xl">💡</div>
          <div className="flex-1">
            <div className="text-[13px] font-extrabold text-ink">
              Suggest a Practice Exercise for a Therapist
            </div>
            <div className="mt-0.5 text-xs text-ink-muted">
              Select a therapist and assign a tailored exercise based on their CTS-R profile.
            </div>
          </div>
          <Select className="!w-auto">
            {THERAPISTS.filter((t) => !t.archived && t.status === "Active").map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
          <Button variant="primary">Assign Exercise →</Button>
        </div>
      </Card>

      <div className="mb-5 grid gap-3.5 md:grid-cols-2">
        {EXERCISES.map((ex) => (
          <Card
            key={ex.id}
            onClick={() => setSelExId(ex.id)}
            className="cursor-pointer border-2 transition"
            style={{ borderColor: selExId === ex.id ? ex.color : "#C0CAD8" }}
          >
            <div className="flex items-start gap-3.5">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border-2 text-xl"
                style={{ borderColor: ex.color, background: `${ex.color}18` }}
              >
                {ex.icon}
              </div>
              <div>
                <div className="mb-1 text-[15px] font-extrabold text-ink">
                  {ex.name}
                </div>
                <div className="text-xs leading-relaxed text-ink-muted">
                  {ex.desc}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selEx && (
        <Card>
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
              style={{ background: `${selEx.color}18` }}
            >
              {selEx.icon}
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-ink">
                {selEx.name}
              </div>
              <div className="text-xs text-ink-muted">{selEx.desc}</div>
            </div>
          </div>
          <SectionLabel>Input</SectionLabel>
          <Textarea
            className="!h-[100px] !mb-3"
            placeholder={PLACEHOLDERS[selEx.id]}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="primary" disabled={!input.trim()}>
            ✦ Run Exercise
          </Button>
        </Card>
      )}
    </div>
  );
}
