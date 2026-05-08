"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTS_R } from "@/lib/cts-r";
import { FEEDBACK } from "@/lib/mock-data";
import type { FeedbackType } from "@/lib/types";

const TYPE_CONF: Record<
  string,
  { icon: string; tone: "good" | "orange" | "purple" | "warn" | "brand"; label: string }
> = {
  strength:    { icon: "✓", tone: "good",   label: "Strengths"   },
  development: { icon: "△", tone: "orange", label: "Development" },
  goal:        { icon: "★", tone: "purple", label: "Goals"       },
  peer:        { icon: "👥", tone: "warn",  label: "Peer"        },
};

export default function TherapistFeedbackPage() {
  const [filter, setFilter] = useState<"All" | FeedbackType>("All");
  const shown = FEEDBACK.filter((f) => filter === "All" || f.type === filter);

  return (
    <div>
      <PageHeader
        title="My Feedback"
        subtitle="All supervision and peer feedback — organised by type"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(TYPE_CONF).map(([k, v]) => {
          const cnt = FEEDBACK.filter((f) => f.type === k).length;
          return (
            <div
              key={k}
              onClick={() => setFilter(k as FeedbackType)}
              className="cursor-pointer rounded-xl border-2 p-4 transition"
              style={{
                background:
                  v.tone === "good"
                    ? "#dcfce7"
                    : v.tone === "orange"
                      ? "#fff7ed"
                      : v.tone === "purple"
                        ? "#f5f3ff"
                        : "#f0fdfa",
                borderColor: filter === k ? "currentColor" : "transparent",
              }}
            >
              <div className="mb-1.5 text-2xl">{v.icon}</div>
              <div
                className="text-2xl font-black"
                style={{
                  color:
                    v.tone === "good"
                      ? "#16a34a"
                      : v.tone === "orange"
                        ? "#E8923A"
                        : v.tone === "purple"
                          ? "#7c3aed"
                          : "#0891b2",
                }}
              >
                {cnt}
              </div>
              <div className="mt-0.5 text-xs font-bold text-ink">{v.label}</div>
            </div>
          );
        })}
      </div>

      <Tabs
        options={[
          ["All", "All"],
          ["strength", "Strengths"],
          ["development", "Development"],
          ["goal", "Goals"],
          ["peer", "Peer"],
        ] as const}
        value={filter}
        onChange={(v) => setFilter(v as "All" | FeedbackType)}
      />

      <div className="mt-4 flex flex-col gap-3">
        {shown.map((fb) => {
          const c = TYPE_CONF[fb.type] ?? TYPE_CONF.strength;
          const item = fb.item ? CTS_R.find((i) => i.id === fb.item) : null;
          const borderColor =
            c.tone === "good"
              ? "#16a34a"
              : c.tone === "orange"
                ? "#E8923A"
                : c.tone === "purple"
                  ? "#7c3aed"
                  : "#0891b2";
          return (
            <Card
              key={fb.id}
              className="border-l-4"
              style={{ borderLeftColor: borderColor }}
            >
              <div className="mb-2.5 flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  <Pill tone={c.tone}>{c.label.replace(/s$/, "")}</Pill>
                  {item && (
                    <Pill tone="brand">
                      Item {item.id}: {item.short}
                    </Pill>
                  )}
                  <span className="self-center text-[11px] text-ink-faint">
                    Session {fb.sid} · {fb.date}
                  </span>
                </div>
                <span className="text-xs font-semibold text-ink-muted">
                  {fb.author}
                </span>
              </div>
              <div className="text-sm leading-relaxed text-ink">{fb.text}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
