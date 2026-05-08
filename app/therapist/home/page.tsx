import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Ring } from "@/components/ui/Ring";
import { ASSIGNED_EXERCISES, CURRENT_THERAPIST, FEEDBACK, JOURNAL, SESSIONS_HIST } from "@/lib/mock-data";
import { SCORE_LABELS } from "@/lib/cts-r";
import { daysFromNow } from "@/lib/utils";

export default function TherapistHome() {
  const latest = SESSIONS_HIST[0];
  const days = daysFromNow(CURRENT_THERAPIST.nextSupervision);
  const pendingExs = ASSIGNED_EXERCISES.filter((e) => e.status === "pending").length;
  const gap = Math.abs(latest.total - latest.selfTotal);

  return (
    <div>
      <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-7 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-1.5 text-[13px] font-semibold opacity-80">
              Welcome back
            </div>
            <div className="mb-1 text-[26px] font-black tracking-tight">
              {CURRENT_THERAPIST.name}
            </div>
            <div className="text-[13px] opacity-75">
              {CURRENT_THERAPIST.role} · Supervisor: {CURRENT_THERAPIST.supervisor}
            </div>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 text-xl font-black">
            {CURRENT_THERAPIST.initials}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3.5">
          {[
            { icon: "📅", label: "Next Supervision", val: days > 0 ? `${days} days` : "Today!" },
            { icon: "📊", label: "Latest CTS-R",     val: `${latest.total}/72` },
            { icon: "🎯", label: "Exercises Due",    val: `${pendingExs} pending` },
          ].map((s) => (
            <div
              key={s.label}
              className="min-w-[110px] flex-1 rounded-xl bg-white/15 px-3 py-2 backdrop-blur sm:min-w-[130px] sm:px-4 sm:py-2.5"
            >
              <div className="mb-1 text-lg">{s.icon}</div>
              <div className="text-base font-black">{s.val}</div>
              <div className="text-[11px] opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <Card className="border-2 border-accent-orange/30">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="eyebrow text-accent-orange">⚡ Upcoming</div>
                <div className="mt-1 text-base font-extrabold text-ink">
                  Supervision on {CURRENT_THERAPIST.nextSupervision}
                </div>
                <div className="mt-0.5 text-xs text-ink-muted">
                  with {CURRENT_THERAPIST.supervisor}
                </div>
              </div>
              <Pill tone="orange">{days}d away</Pill>
            </div>
            <div className="flex gap-2.5">
              <Link href="/therapist/prep" className="flex-1">
                <Button variant="orange" full>📋 Prepare for Session</Button>
              </Link>
              <Link href="/therapist/self-review" className="flex-1">
                <Button variant="ghost" full>✍ Self-Review</Button>
              </Link>
            </div>
          </Card>

          <Card>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="text-[15px] font-extrabold text-ink">
                Latest Supervisor Feedback
              </div>
              <Link
                href="/therapist/feedback"
                className="text-xs font-bold text-brand"
              >
                View all →
              </Link>
            </div>
            {FEEDBACK.slice(0, 3).map((fb) => (
              <div
                key={fb.id}
                className="border-b border-rule py-3 last:border-b-0"
              >
                <div className="mb-1 flex gap-2">
                  <Pill
                    tone={
                      fb.type === "strength"
                        ? "good"
                        : fb.type === "development"
                          ? "orange"
                          : fb.type === "goal"
                            ? "purple"
                            : "brand"
                    }
                  >
                    {fb.type}
                  </Pill>
                  <span className="text-[11px] text-ink-faint">
                    Session {fb.sid} · {fb.date}
                  </span>
                </div>
                <div className="text-[13px] leading-relaxed text-ink">
                  {fb.text.slice(0, 120)}
                  {fb.text.length > 120 ? "…" : ""}
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="text-center">
            <div className="mb-4 text-[13px] font-extrabold text-ink">
              My Progress — Latest Session
            </div>
            <div className="mb-4 flex justify-center gap-7">
              <Ring
                value={latest.total}
                max={72}
                size={90}
                color="#3B75E8"
                label="Supervisor"
                sub={SCORE_LABELS[Math.min(6, Math.round(latest.total / 12))]}
              />
              <Ring
                value={latest.selfTotal}
                max={72}
                size={90}
                color="#E8923A"
                label="Self-Rating"
                sub="My assessment"
              />
            </div>
            <div className="rounded-lg bg-canvas px-3 py-2 text-xs text-ink-muted">
              Agreement gap:{" "}
              <b className={gap <= 4 ? "text-state-good" : "text-accent-orange"}>
                {gap} points
              </b>
              {gap <= 4 ? " · Good self-awareness 👍" : " · Review with supervisor"}
            </div>
            <Link href="/therapist/progress" className="mt-3 block">
              <Button variant="ghost" full>View Full Progress</Button>
            </Link>
          </Card>

          <Card>
            <div className="mb-3 text-[13px] font-extrabold text-ink">
              Assigned Exercises
            </div>
            {ASSIGNED_EXERCISES.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center gap-3 border-b border-rule py-2.5 last:border-b-0"
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base"
                  style={{ background: `${ex.color}18` }}
                >
                  {ex.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-ink">{ex.name}</div>
                  <div className="text-[10px] text-ink-muted">
                    Due {ex.dueDate}
                  </div>
                </div>
                <Pill tone={ex.status === "completed" ? "good" : "orange"}>
                  {ex.status === "completed" ? "Done" : "Pending"}
                </Pill>
              </div>
            ))}
            <Link href="/therapist/skills" className="mt-3 block">
              <Button variant="primary" full>Go to Skills Lab</Button>
            </Link>
          </Card>

          <Card className="border-[1.5px] border-accent-purple/20 bg-state-purpleBg/40">
            <div className="mb-1.5 text-[13px] font-extrabold text-ink">
              📔 Reflective Journal
            </div>
            <div className="mb-3 text-xs leading-relaxed text-ink-muted">
              {JOURNAL[0].date} — &ldquo;{JOURNAL[0].text.slice(0, 90)}…&rdquo;
            </div>
            <Link href="/therapist/journal">
              <Button variant="purple" full>Open Journal</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
