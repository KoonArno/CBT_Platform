"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ScoreDot } from "@/components/ui/ScoreDot";
import { Ring } from "@/components/ui/Ring";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTS_R, scoreColor } from "@/lib/cts-r";
import { SESSIONS_HIST } from "@/lib/mock-data";

export default function TherapistSessionsPage() {
  const [selId, setSelId] = useState<number | null>(SESSIONS_HIST[0].id);
  const sel = SESSIONS_HIST.find((s) => s.id === selId);

  return (
    <div>
      <PageHeader
        title="My Sessions"
        subtitle="Your CTS-R history — supervisor scores vs your self-assessments"
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-2.5">
          {SESSIONS_HIST.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setSelId(s.id)}
              className="flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] bg-screen px-4 py-3.5 shadow-card transition"
              style={{
                borderColor: selId === s.id ? "#3B75E8" : "#C0CAD8",
                background: selId === s.id ? "#EEF4FF" : "#fff",
              }}
            >
              <ScoreDot score={Math.round(s.total / 12)} size={44} />
              <div className="flex-1">
                <div className="text-[13px] font-bold text-ink">
                  Session {i + 1}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-muted">{s.date}</div>
              </div>
              <div className="text-right">
                <div
                  className="text-base font-black"
                  style={{ color: scoreColor(Math.round(s.total / 12)) }}
                >
                  {s.total}
                </div>
                <div className="text-[10px] text-ink-faint">
                  Self: {s.selfTotal}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sel ? (
          <Card>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="text-lg font-black text-ink">
                  Session {SESSIONS_HIST.findIndex((s) => s.id === sel.id) + 1}
                </div>
                <div className="mt-0.5 text-[13px] text-ink-muted">
                  {sel.date} · {sel.supervisor}
                </div>
              </div>
              <div className="flex gap-5">
                <Ring value={sel.total} max={72} size={72} color="#3B75E8" label="Supervisor" />
                <Ring value={sel.selfTotal} max={72} size={72} color="#E8923A" label="Self" />
              </div>
            </div>

            <div className="mb-3 text-xs font-bold text-ink">
              CTS-R Item Breakdown
            </div>
            <div className="flex flex-col gap-2">
              {CTS_R.map((item, i) => {
                const sup = sel.items[i];
                const self = sel.selfItems[i];
                const diff = sup - self;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 rounded-lg bg-canvas px-3 py-2"
                  >
                    <div className="w-5 text-[10px] font-bold text-ink-faint">
                      #{item.id}
                    </div>
                    <div className="flex-1 text-xs font-semibold text-ink">
                      {item.short}
                    </div>
                    <div className="relative h-1.5 w-24 flex-shrink-0 rounded bg-rule">
                      <div
                        className="absolute left-0 top-0 h-full rounded"
                        style={{
                          width: `${(sup / 6) * 100}%`,
                          background: scoreColor(sup),
                        }}
                      />
                    </div>
                    <ScoreDot score={sup} size={26} />
                    <div className="w-3.5 text-center text-[11px] text-ink-muted">
                      vs
                    </div>
                    <ScoreDot score={self} size={26} />
                    <div
                      className="w-7 text-right text-[11px] font-bold"
                      style={{
                        color:
                          diff > 0
                            ? "#E8923A"
                            : diff < 0
                              ? "#3B75E8"
                              : "#16a34a",
                      }}
                    >
                      {diff > 0 ? `+${diff}` : diff < 0 ? diff : "="}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="flex min-h-[300px] items-center justify-center">
            <div className="text-center text-ink-faint">
              <div className="mb-3 text-3xl">📋</div>
              <div className="text-sm font-bold">Select a session to see details</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
