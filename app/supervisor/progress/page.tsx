import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressLineChart } from "@/components/charts/ProgressLineChart";
import { CompetencyRadar } from "@/components/charts/CompetencyRadar";
import { Pill } from "@/components/ui/Pill";
import { CTS_R, SCORE_LABELS, scoreColor } from "@/lib/cts-r";
import { FEEDBACK, PROGRESS_TREND, THERAPISTS } from "@/lib/mock-data";

const LATEST = [4, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4];
const PREVIOUS = [3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3];

const RADAR = CTS_R.map((item, i) => ({
  subject: item.short,
  current: LATEST[i],
  previous: PREVIOUS[i],
  fullMark: 6,
}));

const TYPE_TONE: Record<string, "good" | "orange" | "brand" | "purple" | "warn"> = {
  strength: "good",
  development: "orange",
  reflection: "brand",
  goal: "purple",
  peer: "warn",
};

export default function SupervisorProgressPage() {
  return (
    <div>
      <PageHeader
        title="Therapist Progress"
        subtitle="CTS-R trajectory, competency profile, feedback"
      />

      <div className="mb-4 inline-flex gap-1 rounded-full bg-brand-tab p-1">
        {THERAPISTS.filter((t) => !t.archived && t.status === "Active").map(
          (t, i) => (
            <span
              key={t.id}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                i === 0 ? "bg-brand text-white" : "text-ink-muted"
              }`}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ background: t.color }}
              >
                {t.initials.slice(0, 1)}
              </span>
              {t.name.split(" ").slice(-1)[0]}
            </span>
          ),
        )}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3.5 text-sm font-extrabold text-ink">
            CTS-R Score Trajectory
          </div>
          <ProgressLineChart data={PROGRESS_TREND} height={210} />
        </Card>
        <Card>
          <div className="mb-3.5 text-sm font-extrabold text-ink">
            Competency Radar
          </div>
          <CompetencyRadar data={RADAR} height={210} />
        </Card>
      </div>

      <Card className="mb-4">
        <div className="mb-3.5 text-sm font-extrabold text-ink">
          Item-Level Breakdown
        </div>
        <div className="grid grid-cols-3 gap-2.5 md:grid-cols-6">
          {CTS_R.map((item, i) => {
            const sc = LATEST[i];
            const ch = sc - PREVIOUS[i];
            return (
              <div
                key={item.id}
                className="rounded-xl border border-rule bg-canvas p-2.5 text-center"
              >
                <div className="mb-1 text-[9px] leading-tight text-ink-muted">
                  {item.name.split(" ").slice(0, 2).join(" ")}
                </div>
                <div
                  className="text-[22px] font-black"
                  style={{ color: scoreColor(sc) }}
                >
                  {sc}
                </div>
                <div
                  className="text-[10px]"
                  style={{
                    color: ch > 0 ? "#16a34a" : ch < 0 ? "#dc2626" : "#6B7A9A",
                  }}
                >
                  {ch > 0 ? "▲" : ch < 0 ? "▼" : "–"}
                  {ch !== 0 ? Math.abs(ch) : ""}
                </div>
                <div className="mt-0.5 text-[8px] text-ink-muted">
                  {SCORE_LABELS[sc]}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="mb-3.5 text-sm font-extrabold text-ink">
          Supervisor Feedback &amp; Reflections
        </div>
        <div className="flex flex-col gap-2.5">
          {FEEDBACK.map((fb) => (
            <div
              key={fb.id}
              className="flex gap-3 rounded-lg border-l-4 bg-canvas px-3.5 py-3"
              style={{
                borderColor:
                  fb.type === "strength"
                    ? "#16a34a"
                    : fb.type === "development"
                      ? "#E8923A"
                      : fb.type === "goal"
                        ? "#7c3aed"
                        : "#3B75E8",
              }}
            >
              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <Pill tone={TYPE_TONE[fb.type] ?? "neutral"}>
                    {fb.type}
                  </Pill>
                  <span className="text-[11px] text-ink-muted">
                    {fb.author} · Session {fb.sid} · {fb.date}
                  </span>
                </div>
                <div className="text-[13px] leading-relaxed text-ink">
                  {fb.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
