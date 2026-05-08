"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Input, SectionLabel, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { CURRENT_THERAPIST, FEEDBACK, PREP_CHECKLIST } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function PrepPage() {
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [questions, setQuestions] = useState<Record<number, string>>({});
  const [concerns, setConcerns] = useState("");
  const [focus, setFocus] = useState("");
  const done = Object.values(checks).filter(Boolean).length;
  const goals = FEEDBACK.filter((f) => f.type === "goal");

  return (
    <div>
      <PageHeader
        title="Pre-Supervision Preparation"
        subtitle={`Get the most out of your upcoming session with ${CURRENT_THERAPIST.supervisor} on ${CURRENT_THERAPIST.nextSupervision}`}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-extrabold text-ink">
              Preparation Checklist
            </div>
            <Pill tone={done === PREP_CHECKLIST.length ? "good" : "brand"}>
              {done}/{PREP_CHECKLIST.length}
            </Pill>
          </div>
          {PREP_CHECKLIST.map((item, i) => (
            <div
              key={i}
              onClick={() => setChecks((p) => ({ ...p, [i]: !p[i] }))}
              className={cn(
                "mb-1.5 flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] px-3 py-2.5 transition",
                checks[i]
                  ? "border-brand bg-brand-tint"
                  : "border-rule bg-canvas",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2",
                  checks[i] ? "border-brand bg-brand" : "border-rule",
                )}
              >
                {checks[i] && (
                  <span className="text-[13px] font-black text-white">✓</span>
                )}
              </div>
              <div
                className={cn(
                  "text-[13px] leading-relaxed",
                  checks[i] ? "font-semibold text-brand" : "text-ink",
                )}
              >
                {item}
              </div>
            </div>
          ))}
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card>
            <div className="mb-3.5 text-sm font-extrabold text-ink">
              Questions for Supervision
            </div>
            {[
              "What specific clinical skill do you want help with?",
              "What client interaction are you unsure about?",
              "What learning goal do you want to set today?",
            ].map((ph, i) => (
              <div key={i} className="mb-3">
                <SectionLabel>Question {i + 1}</SectionLabel>
                <Textarea
                  className="!h-[72px]"
                  placeholder={ph}
                  value={questions[i] ?? ""}
                  onChange={(e) =>
                    setQuestions((p) => ({ ...p, [i]: e.target.value }))
                  }
                />
              </div>
            ))}
          </Card>

          <Card>
            <div className="mb-3.5 text-sm font-extrabold text-ink">
              Safety Concerns &amp; Clinical Issues
            </div>
            <SectionLabel>Any client safety concerns to flag?</SectionLabel>
            <Textarea
              className="!h-[80px] !mb-3"
              placeholder="Risk concerns, safeguarding issues, or urgent clinical matters..."
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
            />
            <SectionLabel>Session you most want to focus on</SectionLabel>
            <Input
              placeholder="e.g. Session with Client A — stuck on cognitive restructuring"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </Card>

          <Button variant="primary" full>
            Send Prep Sheet to Supervisor ✓
          </Button>
        </div>
      </div>

      <Card className="mt-5">
        <div className="mb-3.5 text-sm font-extrabold text-ink">
          Goals Set in Last Supervision
        </div>
        {goals.map((g) => (
          <div
            key={g.id}
            className="mb-2 flex gap-3 rounded-lg border border-rule bg-canvas px-3.5 py-3"
          >
            <div className="flex-shrink-0 text-base">★</div>
            <div>
              <div className="mb-1 text-xs font-bold text-accent-purple">
                Session {g.sid} · {g.date}
              </div>
              <div className="text-[13px] leading-relaxed text-ink">{g.text}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
