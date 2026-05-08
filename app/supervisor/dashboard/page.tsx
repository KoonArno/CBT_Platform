import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";
import { PENDING, THERAPISTS } from "@/lib/mock-data";
import type { PendingValidation } from "@/lib/types";

const KPIS = [
  { label: "Active Therapists",   val: "3",  sub: "in caseload",         bg: "bg-brand",         icon: "👥" },
  { label: "Sessions This Month", val: "12", sub: "CTS-R scored",        bg: "bg-accent-orange", icon: "📋" },
  { label: "Average CTS-R",       val: "43", sub: "/ 72 · Intermediate", bg: "bg-ink",           icon: "📊" },
  { label: "Pending Validation",  val: "4",  sub: "across 3 types",      bg: "bg-state-bad",     icon: "⚠" },
];

const TYPE_INFO: Record<
  PendingValidation["type"],
  { icon: string; bg: string; tone: "purple" | "warn" | "brand" }
> = {
  ai:      { icon: "🤖", bg: "bg-state-purpleBg", tone: "purple" },
  student: { icon: "📚", bg: "bg-state-warnBg",   tone: "warn"   },
  peer:    { icon: "👥", bg: "bg-brand-tint",     tone: "brand"  },
};

export default function SupervisorDashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={today} />

      <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {KPIS.map((s) => (
          <div
            key={s.label}
            className={`rounded-card p-4 text-white ${s.bg}`}
          >
            <div className="mb-1.5 text-xl">{s.icon}</div>
            <div className="text-3xl font-black leading-none tracking-tight">
              {s.val}
            </div>
            <div className="mt-1 text-[13px] font-bold opacity-95">
              {s.label}
            </div>
            <div className="text-[11px] opacity-75">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-ink">
              Pending Validations
            </h2>
            <span className="text-xs text-ink-muted">{PENDING.length} items</span>
          </div>

          <div className="mb-3.5 flex gap-2">
            {["All", "AI Score", "Student", "Peer Sup"].map((f) => (
              <span
                key={f}
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  f === "All"
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-ink-muted"
                }`}
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {PENDING.map((item) => {
              const info = TYPE_INFO[item.type];
              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-rule bg-canvas px-3.5 py-3 sm:flex-nowrap sm:gap-3.5"
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base ${info.bg}`}
                  >
                    {info.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-ink">
                      {item.therapist}
                    </div>
                    <div className="truncate text-xs text-ink-muted">
                      {item.session} · {item.label}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Pill tone={item.urgency === "high" ? "bad" : item.urgency === "medium" ? "warn" : "good"}>
                      {item.urgency}
                    </Pill>
                    <Link href="/supervisor/scoring">
                      <Button variant="ghost" className="!px-3 !py-1 !text-[11px]">
                        Review →
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card className="bg-accent-orange text-white">
            <div className="eyebrow text-white/80">Quick Start</div>
            <div className="mt-1.5 text-base font-extrabold">
              New Supervision Session
            </div>
            <Link href="/supervisor/session" className="mt-3 block">
              <Button variant="muted" full className="!bg-white/20 !text-white">
                Start Session →
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="mb-3 text-sm font-extrabold text-ink">Therapists</div>
            {THERAPISTS.filter((t) => !t.archived).slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2.5 border-b border-rule py-1.5 last:border-b-0"
              >
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-extrabold"
                  style={{ borderColor: t.color, background: `${t.color}22`, color: t.color }}
                >
                  {t.initials}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-ink">{t.name}</div>
                  <div className="text-[10px] text-ink-muted">
                    {t.sessions} sessions · CTS-R avg {t.avgScore}
                  </div>
                </div>
                <Pill tone={t.status === "Active" ? "good" : "neutral"}>
                  {t.status}
                </Pill>
              </div>
            ))}
          </Card>

          <Card className="border-[1.5px] border-brand/30 bg-brand-tint">
            <div className="mb-1.5 text-[13px] font-extrabold text-brand">
              🧠 CBT Skills Practice
            </div>
            <div className="mb-2.5 text-xs leading-relaxed text-ink-muted">
              Suggest a learning exercise for a therapist in your caseload.
            </div>
            <Link href="/supervisor/skills">
              <Button variant="primary" full>
                Open Skills Lab
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
