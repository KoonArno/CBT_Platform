import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ScrollText,
  ListChecks,
  BarChart3,
  ShieldCheck,
  Clock,
  Languages,
  Calendar,
  User,
  Stethoscope,
  Award,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CTS_R } from "@/lib/cts-data";
import {
  RECENT_SESSIONS,
  AI_SCORES,
  SESSION_META,
  CURRENT_SESSION,
} from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

const SCORE_COLORS: Record<number, { bg: string; text: string; ring: string }> = {
  0: { bg: "bg-[#ef4444]/15", text: "text-[#ef4444]", ring: "ring-[#ef4444]/40" },
  1: { bg: "bg-[#f97316]/15", text: "text-[#f97316]", ring: "ring-[#f97316]/40" },
  2: { bg: "bg-[#f59e0b]/15", text: "text-[#f59e0b]", ring: "ring-[#f59e0b]/40" },
  3: { bg: "bg-[#eab308]/15", text: "text-[#eab308]", ring: "ring-[#eab308]/40" },
  4: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]", ring: "ring-[#84cc16]/40" },
  5: { bg: "bg-[#22c55e]/15", text: "text-[#22c55e]", ring: "ring-[#22c55e]/40" },
  6: { bg: "bg-[#16a34a]/15", text: "text-[#16a34a]", ring: "ring-[#16a34a]/40" },
};

const STATUS_MAP: Record<
  string,
  { variant: "success" | "warning" | "secondary" | "outline"; label: string }
> = {
  "signed-off": { variant: "success", label: "Signed off" },
  scored: { variant: "secondary", label: "Scored" },
  "in-review": { variant: "warning", label: "In review" },
  draft: { variant: "outline", label: "Draft" },
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = RECENT_SESSIONS.find((s) => s.id === id);
  if (!session) notFound();

  const isCurrent = session.id === CURRENT_SESSION.id;
  const status = STATUS_MAP[session.status] ?? STATUS_MAP.draft;
  const isFinished = session.status === "signed-off";
  const hasScores = session.total !== null;
  const avg = hasScores ? (session.total as number) / 12 : null;

  return (
    <>
      <PageHeader
        title={`${session.id} · ${session.client}`}
        subtitle={`${session.modality} · ${formatDate(session.date)}`}
        showStepper={false}
        right={
          <>
            <Link href="/sessions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" /> All sessions
              </Button>
            </Link>
            {hasScores && (
              <Button size="sm">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            )}
          </>
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/30 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                {isFinished && (
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> Signed off
                  </Badge>
                )}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-foreground">
                {session.client}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Conducted by{" "}
                <span className="font-medium text-foreground">
                  {session.therapist}
                </span>{" "}
                · {session.modality}
              </p>
            </div>
            {hasScores && (
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Total score
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tabular-nums text-foreground">
                      {session.total}
                    </span>
                    <span className="text-sm text-muted-foreground">/72</span>
                  </div>
                  {avg !== null && (
                    <div className="text-xs text-muted-foreground">
                      avg {avg.toFixed(1)} / 6
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Meta icon={<User className="h-4 w-4" />} label="Therapist" value={session.therapist} />
          <Meta icon={<Stethoscope className="h-4 w-4" />} label="Modality" value={session.modality} />
          <Meta icon={<Calendar className="h-4 w-4" />} label="Date" value={formatDate(session.date)} />
          <Meta
            icon={<Clock className="h-4 w-4" />}
            label="Duration"
            value={isCurrent ? SESSION_META.duration : "—"}
          />
          <Meta
            icon={<Languages className="h-4 w-4" />}
            label="Language"
            value={isCurrent ? SESSION_META.language : "Thai / English mixed"}
          />
          <Meta
            icon={<FileText className="h-4 w-4" />}
            label="File"
            value={isCurrent ? SESSION_META.fileName : `${session.id.toLowerCase()}-transcript.docx`}
          />
          <Meta icon={<User className="h-4 w-4" />} label="Supervisor" value="Dr. Wattana" />
          <Meta
            icon={<Award className="h-4 w-4" />}
            label="Overall profile"
            value={
              avg === null
                ? "—"
                : avg >= 5
                ? "Advanced"
                : avg >= 4
                ? "Competent"
                : avg >= 3
                ? "Developing"
                : "Beginner"
            }
          />
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <h3 className="text-sm font-semibold">Quick actions</h3>
            <p className="text-[11px] text-muted-foreground">
              {isCurrent
                ? "ดำเนินการต่อใน session ปัจจุบัน"
                : "เปิด session นี้ในแต่ละขั้นตอน"}
            </p>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              icon={<ScrollText className="h-4 w-4" />}
              title="Review"
              sub="ดู transcript + evidence"
              href="/review"
            />
            <ActionCard
              icon={<ListChecks className="h-4 w-4" />}
              title="Scoring"
              sub="คะแนน CTS-R 12 ข้อ"
              href="/scoring"
            />
            <ActionCard
              icon={<BarChart3 className="h-4 w-4" />}
              title="Summary"
              sub="กราฟ + feedback"
              href="/summary"
            />
            <ActionCard
              icon={<FileText className="h-4 w-4" />}
              title="Report"
              sub="รายงานสำหรับพิมพ์/ส่ง"
              href="/report"
              primary={isFinished}
            />
          </div>
        </div>

        {/* Score breakdown — only for current session with full data */}
        {isCurrent && (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Score breakdown</h3>
              <span className="text-[11px] text-muted-foreground">
                12 items × 0–6
              </span>
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {CTS_R.map((item) => {
                const s = AI_SCORES.find((x) => x.itemNo === item.no)!;
                const score = s.finalScore ?? 0;
                const c = SCORE_COLORS[score];
                return (
                  <div
                    key={item.no}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/40 px-3 py-2"
                  >
                    <span
                      className="h-8 w-1 flex-shrink-0 rounded-full"
                      style={{ background: item.colorVar }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-foreground">
                        {item.no}. {item.short}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.cat}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ring-1 ring-inset tabular-nums",
                        c.bg,
                        c.text,
                        c.ring,
                      )}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  sub,
  href,
  primary,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg border p-3 transition-colors",
        primary
          ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
          : "border-border bg-surface/40 hover:border-primary/40 hover:bg-accent/30",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
          primary
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="truncate text-[11px] text-muted-foreground">{sub}</div>
      </div>
    </Link>
  );
}
