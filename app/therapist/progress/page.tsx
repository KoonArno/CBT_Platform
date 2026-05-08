import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Ring } from "@/components/ui/Ring";
import { ScoreDot } from "@/components/ui/ScoreDot";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressLineChart } from "@/components/charts/ProgressLineChart";
import { CompetencyRadar } from "@/components/charts/CompetencyRadar";
import { CTS_R, SCORE_LABELS } from "@/lib/cts-r";
import { SESSIONS_HIST } from "@/lib/mock-data";

const PROG = [
  { s: "S1", total: 29, self: 27 },
  { s: "S2", total: 33, self: 30 },
  { s: "S3", total: 36, self: 33 },
  { s: "S4", total: 38, self: 35 },
  { s: "S5", total: 43, self: 40 },
];

export default function TherapistProgressPage() {
  const latest = SESSIONS_HIST[0];
  const prev = SESSIONS_HIST[1];
  const gain = latest.total - prev.total;

  const radar = CTS_R.map((item, i) => ({
    subject: item.short,
    current: latest.items[i],
    previous: latest.selfItems[i],
    fullMark: 6,
  }));

  return (
    <div>
      <PageHeader
        title="My Progress"
        subtitle="CTS-R trajectory, competency profile and growth over time"
      />

      <Card className="mb-4 flex items-center gap-7 border-[1.5px] border-brand/20 bg-gradient-to-br from-brand/5 to-transparent px-6 py-5">
        <Ring value={latest.total} max={72} size={80} color="#3B75E8" label="Latest CTS-R" />
        <div className="flex-1">
          <div className="text-lg font-black text-ink">
            {SCORE_LABELS[Math.min(6, Math.round(latest.total / 12))]} Level
          </div>
          <div className="my-2 text-[13px] leading-relaxed text-ink-muted">
            Your most recent session scored{" "}
            <b className="text-brand">{latest.total}/72</b> — up{" "}
            <b className="text-state-good">+{gain} points</b> from the previous session.
          </div>
          <div className="flex gap-2">
            <Pill tone="good">+{gain} pts from last session</Pill>
            <Pill tone="brand">{SESSIONS_HIST.length} sessions reviewed</Pill>
          </div>
        </div>
      </Card>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3.5 text-sm font-extrabold text-ink">
            CTS-R Score Over Time
          </div>
          <ProgressLineChart data={PROG} showSelf height={200} />
        </Card>
        <Card>
          <div className="mb-3.5 text-sm font-extrabold text-ink">
            Competency Radar
          </div>
          <CompetencyRadar
            data={radar}
            height={200}
            labels={{ current: "Supervisor", previous: "Self" }}
          />
        </Card>
      </div>

      <Card>
        <div className="mb-3.5 text-sm font-extrabold text-ink">
          Latest Session · All 12 Items
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {CTS_R.map((item, i) => {
            const sup = latest.items[i];
            const self = latest.selfItems[i];
            const diff = sup - self;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-rule bg-canvas px-2.5 py-3 text-center"
              >
                <div className="mb-2 text-[9px] leading-tight text-ink-muted">
                  {item.name.split(" ").slice(0, 3).join(" ")}
                </div>
                <div className="flex justify-center gap-2">
                  <ScoreDot score={sup} size={32} />
                  <ScoreDot score={self} size={32} />
                </div>
                <div className="mt-1.5 text-[9px] text-ink-muted">
                  <span className="text-brand">S</span> vs{" "}
                  <span className="text-accent-orange">Me</span>
                  {diff !== 0 && (
                    <span
                      className="ml-1 font-bold"
                      style={{ color: diff > 0 ? "#E8923A" : "#3B75E8" }}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[8px] text-ink-faint">
                  {item.tip.slice(0, 40)}…
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
