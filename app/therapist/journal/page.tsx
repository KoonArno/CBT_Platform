"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Input, Textarea, SectionLabel } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { JOURNAL } from "@/lib/mock-data";
import type { JournalEntry } from "@/lib/types";

const MOODS = [
  { id: "confident",  icon: "😊", color: "#16a34a", label: "Confident",  tone: "good"   as const },
  { id: "curious",    icon: "🤔", color: "#3B75E8", label: "Curious",    tone: "brand"  as const },
  { id: "challenged", icon: "😤", color: "#E8923A", label: "Challenged", tone: "orange" as const },
  { id: "anxious",    icon: "😬", color: "#F5C840", label: "Anxious",    tone: "warn"   as const },
  { id: "uncertain",  icon: "😕", color: "#7c3aed", label: "Uncertain",  tone: "purple" as const },
  { id: "proud",      icon: "🌟", color: "#d97706", label: "Proud",      tone: "warn"   as const },
];

const moodOf = (id: string) => MOODS.find((m) => m.id === id) ?? MOODS[1];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([...JOURNAL]);
  const [writing, setWriting] = useState(false);
  const [selEntry, setSelEntry] = useState<JournalEntry>(entries[0]);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newMood, setNewMood] = useState("curious");

  const save = () => {
    if (!newTitle.trim() || !newText.trim()) return;
    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      title: newTitle,
      mood: newMood,
      text: newText,
    };
    const next = [entry, ...entries];
    setEntries(next);
    setSelEntry(entry);
    setWriting(false);
    setNewTitle("");
    setNewText("");
    setNewMood("curious");
  };

  return (
    <div>
      <PageHeader
        title="Reflective Journal"
        subtitle="Record your clinical reflections and learning insights"
        right={
          <Button variant="primary" onClick={() => setWriting((p) => !p)}>
            {writing ? "← Back to Entries" : "✍ New Entry"}
          </Button>
        }
      />

      {writing ? (
        <Card>
          <div className="mb-4 text-sm font-extrabold text-ink">
            New Journal Entry
          </div>
          <SectionLabel>Title</SectionLabel>
          <Input
            className="!mb-3.5"
            placeholder="e.g. Reflecting on today's session…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <SectionLabel>How are you feeling after this session?</SectionLabel>
          <div className="mb-4 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = newMood === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setNewMood(m.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 transition"
                  style={{
                    borderColor: active ? m.color : "#C0CAD8",
                    background: active ? `${m.color}15` : "transparent",
                  }}
                >
                  <span className="text-base">{m.icon}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: active ? m.color : "#6B7A9A" }}
                  >
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
          <SectionLabel>Reflection</SectionLabel>
          <Textarea
            className="!h-[200px] !mb-4"
            placeholder={
              "What happened in the session?\nWhat did you notice about yourself as a therapist?\nWhat would you do differently?\nWhat insight do you want to hold on to?…"
            }
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <div className="flex gap-2.5">
            <Button variant="muted" onClick={() => setWriting(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={save}
              disabled={!newTitle.trim() || !newText.trim()}
            >
              Save Entry
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-2">
            {entries.map((entry) => {
              const m = moodOf(entry.mood);
              const active = selEntry?.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelEntry(entry)}
                  className="cursor-pointer rounded-xl border-[1.5px] bg-screen px-4 py-3.5 shadow-card transition"
                  style={{
                    borderColor: active ? "#3B75E8" : "#C0CAD8",
                    background: active ? "#EEF4FF" : "#fff",
                  }}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-[10px] text-ink-faint">{entry.date}</span>
                  </div>
                  <div className="mb-1 text-[13px] font-bold text-ink">
                    {entry.title}
                  </div>
                  <div className="text-[11px] leading-snug text-ink-muted">
                    {entry.text.slice(0, 70)}…
                  </div>
                </div>
              );
            })}
          </div>

          {selEntry ? (
            <Card>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1.5 text-[11px] text-ink-muted">
                    {selEntry.date}
                  </div>
                  <div className="text-xl font-black text-ink">
                    {selEntry.title}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl">{moodOf(selEntry.mood).icon}</span>
                  <Pill tone={moodOf(selEntry.mood).tone}>
                    {moodOf(selEntry.mood).label}
                  </Pill>
                </div>
              </div>
              <div className="whitespace-pre-wrap rounded-xl border border-rule bg-canvas p-4 text-sm leading-loose text-ink">
                {selEntry.text}
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center">
              <div className="text-center text-ink-faint">
                <div className="mb-2.5 text-3xl">📔</div>
                <div className="text-sm font-bold">Select an entry</div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
