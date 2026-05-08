import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";
import { THERAPISTS } from "@/lib/mock-data";

export default function TherapistsPage() {
  return (
    <div>
      <PageHeader
        title="Therapists"
        subtitle="Manage your supervision caseload"
        right={<Button variant="primary">+ Add Therapist</Button>}
      />

      <div className="mb-5 inline-flex gap-1 rounded-full bg-brand-tab p-1">
        {["All", "Active", "Inactive", "Archived"].map((f, i) => (
          <span
            key={f}
            className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
              i === 0 ? "bg-brand text-white" : "text-ink-muted"
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THERAPISTS.filter((t) => !t.archived).map((t) => (
          <Card key={t.id}>
            <div className="mb-4 flex items-center gap-3.5">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 text-[15px] font-black"
                style={{
                  borderColor: t.color,
                  background: `${t.color}18`,
                  color: t.color,
                }}
              >
                {t.initials}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-extrabold text-ink">
                  {t.name}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-muted">{t.role}</div>
              </div>
              <Pill tone={t.status === "Active" ? "good" : "neutral"}>
                {t.status}
              </Pill>
            </div>

            <div className="mb-3.5 grid grid-cols-3 gap-2">
              {[
                ["Sessions", t.sessions],
                ["Avg CTS-R", t.avgScore],
                ["Last", t.lastDate.slice(5)],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="rounded-lg bg-canvas p-2 text-center"
                >
                  <div
                    className="text-base font-extrabold"
                    style={{ color: t.color }}
                  >
                    {v}
                  </div>
                  <div className="mt-0.5 text-[9px] text-ink-muted">{l}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="!flex-1 !text-[11px]">
                Progress →
              </Button>
              <Button variant="muted" className="!px-2.5 !text-[11px]">
                Deactivate
              </Button>
              <Button variant="danger" className="!px-2.5 !text-[11px]">
                Archive
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
