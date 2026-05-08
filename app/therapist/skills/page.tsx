"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Pill } from "@/components/ui/Pill";
import { Textarea, SectionLabel } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ASSIGNED_EXERCISES, CURRENT_THERAPIST } from "@/lib/mock-data";

const EXERCISES = [
  { id: "socratic",    icon: "❓", name: "Socratic Questioning",     color: "#3B75E8", desc: "Generate Socratic questions from a client's automatic thought" },
  { id: "thinking",    icon: "🧠", name: "Thinking Error Detection", color: "#E8923A", desc: "Identify cognitive distortions in a client statement"          },
  { id: "arrow",       icon: "↓",  name: "Downward Arrow Practice",  color: "#7c3aed", desc: "Follow the meaning chain to uncover core beliefs"              },
  { id: "formulation", icon: "🗺", name: "Formulation Drawing",      color: "#16a34a", desc: "Build a CBT 5-part model formulation"                          },
] as const;

const PLACEHOLDERS: Record<string, string> = {
  socratic:    "e.g. 'Nobody likes me'",
  thinking:    "e.g. 'My boss hasn't replied — she must be furious with me. I've ruined everything.'",
  arrow:       "e.g. 'I can't do anything right'",
  formulation: "e.g. '28-year-old man, social anxiety, avoids meetings, catastrophises in social situations'",
};

export default function TherapistSkillsPage() {
  const [tab, setTab] = useState<"assigned" | "explore">("assigned");
  const [selExId, setSelExId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const selEx = EXERCISES.find((e) => e.id === selExId);

  return (
    <div>
      <PageHeader
        title="CBT Skills Lab"
        subtitle="AI-powered exercises to build your clinical competencies"
      />

      <Tabs
        options={[
          ["assigned", "Assigned to Me"],
          ["explore", "Explore All"],
        ] as const}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-4">
        {tab === "assigned" && (
          <div>
            <div className="mb-3 text-[13px] font-bold text-ink">
              From {CURRENT_THERAPIST.supervisor}
            </div>
            {ASSIGNED_EXERCISES.map((ex) => (
              <Card
                key={ex.id}
                className="mb-3 border-[1.5px]"
                style={{
                  borderColor:
                    ex.status === "completed" ? "#16a34a40" : "#C0CAD8",
                }}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: `${ex.color}18` }}
                  >
                    {ex.icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <div className="text-sm font-extrabold text-ink">
                        {ex.name}
                      </div>
                      <Pill tone={ex.status === "completed" ? "good" : "orange"}>
                        {ex.status === "completed" ? "Completed" : `Due ${ex.dueDate}`}
                      </Pill>
                    </div>
                    <div className="mb-2.5 text-xs leading-relaxed text-ink-muted">
                      {ex.note}
                    </div>
                    {ex.status !== "completed" && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelExId(ex.id);
                          setTab("explore");
                          setInput("");
                        }}
                      >
                        Start Exercise →
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "explore" && (
          <div>
            <div className="mb-5 grid gap-3 md:grid-cols-2">
              {EXERCISES.map((ex) => {
                const active = selExId === ex.id;
                return (
                  <Card
                    key={ex.id}
                    onClick={() => {
                      setSelExId(ex.id);
                      setInput("");
                    }}
                    className="cursor-pointer border-2 transition"
                    style={{
                      borderColor: active ? ex.color : "#C0CAD8",
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                        style={{ background: `${ex.color}18` }}
                      >
                        {ex.icon}
                      </div>
                      <div>
                        <div className="mb-0.5 text-sm font-extrabold text-ink">
                          {ex.name}
                        </div>
                        <div className="text-xs text-ink-muted">{ex.desc}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {selEx && (
              <Card className="border-2" style={{ borderColor: `${selEx.color}30` }}>
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
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
                <SectionLabel>Your Input</SectionLabel>
                <Textarea
                  className="!h-[96px] !mb-3"
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
        )}
      </div>
    </div>
  );
}
