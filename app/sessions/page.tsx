"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Search, Plus, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { RECENT_SESSIONS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { SessionRecord } from "@/lib/types";

const FILTERS = [
  ["all", "All"],
  ["in-review", "In review"],
  ["completed", "Completed"],
] as const;

type Filter = (typeof FILTERS)[number][0];
type TherapistSort = "all" | string;

const SESSION_SHORT_DESCRIPTIONS: Record<string, string> = {
  "S-1042": "ความกังวลเรื่องงานและการหลีกเลี่ยงการสื่อสาร",
  "S-1038": "ความคิดอัตโนมัติและการวางแผนกิจกรรม",
  "S-1031": "ความสัมพันธ์ในครอบครัวและการตรวจสอบหลักฐาน",
  "S-1024": "อาการตื่นตระหนกและพฤติกรรมความปลอดภัย",
  "S-1019": "ปัญหาการนอนและความเครียดสะสม",
};

const INITIAL_ARCHIVED_IDS = ["S-1024"] as const;

export default function SessionsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [therapistSort, setTherapistSort] = useState<TherapistSort>("all");
  const [archivedIds, setArchivedIds] = useState<Set<string>>(
    () => new Set(INITIAL_ARCHIVED_IDS),
  );
  const [q, setQ] = useState("");
  const therapists = Array.from(
    new Set(RECENT_SESSIONS.map((s) => s.therapist)),
  ).sort();

  const activeSessions = RECENT_SESSIONS.filter((s) => !archivedIds.has(s.id));
  const archivedSessions = RECENT_SESSIONS.filter((s) => archivedIds.has(s.id));

  const archiveSession = (session: SessionRecord) => {
    if (session.status !== "signed-off") return;
    setArchivedIds((prev) => new Set([...prev, session.id]));
    toast.custom((t) => (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <span>{session.id} archived</span>
        <button
          type="button"
          onClick={() => {
            setArchivedIds((prev) => {
              const next = new Set(prev);
              next.delete(session.id);
              return next;
            });
            toast.dismiss(t.id);
          }}
          className="text-xs font-medium text-primary hover:underline"
        >
          Undo
        </button>
      </div>
    ));
  };

  const filtered = activeSessions.filter((s) => {
    const matchFilter =
      filter === "all" ||
      s.status === filter ||
      (filter === "completed" && s.status === "signed-off");
    const matchQ =
      !q ||
      [s.id, s.client, s.therapist, s.modality]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchTherapist =
      therapistSort === "all" || s.therapist === therapistSort;
    return matchFilter && matchQ && matchTherapist;
  }).sort((a, b) =>
    therapistSort === "all" ? 0 : a.therapist.localeCompare(b.therapist),
  );

  return (
    <>
      <PageHeader
        title="Sessions"
        subtitle="All CTS-R reviews — drafts, in-progress, and completed."
        showStepper={false}
        right={
          <Link href="/upload">
            <Button>
              <Plus className="h-4 w-4" /> New review
            </Button>
          </Link>
        }
      />

      <div className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by session, client, therapist…"
              className="pl-9"
            />
          </div>
          <Tabs options={FILTERS} value={filter} onChange={setFilter} />
          <select
            value={therapistSort}
            onChange={(e) => setTherapistSort(e.target.value)}
            className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All therapists</option>
            {therapists.map((therapist) => (
              <option key={therapist} value={therapist}>
                {therapist}
              </option>
            ))}
          </select>
        </div>

        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {filtered.map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  onArchive={() => archiveSession(s)}
                />
              ))}
              {filtered.length === 0 && (
                <li className="p-8 text-center text-sm text-muted-foreground">
                  No sessions match your filters.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-3 pt-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Archived</h2>
            <p className="text-xs text-muted-foreground">
              เคสที่ถูกเก็บถาวร ยังสามารถเปิดดู session ได้ตามปกติ
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {archivedSessions.map((s) => (
                  <SessionRow key={s.id} session={s} archived />
                ))}
                {archivedSessions.length === 0 && (
                  <li className="p-8 text-center text-sm text-muted-foreground">
                    No archived sessions.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function SessionRow({
  session: s,
  archived = false,
  onArchive,
}: {
  session: SessionRecord;
  archived?: boolean;
  onArchive?: () => void;
}) {
  return (
    <li className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/40">
      <Link
        href={`/sessions/${s.id}`}
        className="flex min-w-0 flex-1 flex-wrap items-center gap-3"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">
            {s.id} · {s.client}
          </div>
          <div className="text-xs text-muted-foreground">
            {s.therapist} · {SESSION_SHORT_DESCRIPTIONS[s.id] ?? s.modality} ·{" "}
            {formatDate(s.date)}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {s.total !== null && (
            <span className="font-bold tabular-nums text-foreground">
              {s.total}/72
            </span>
          )}
          <StatusBadge status={s.status} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
      {!archived && (
        <Button
          variant="outline"
          size="sm"
          disabled={s.status !== "signed-off"}
          onClick={onArchive}
        >
          Archive
        </Button>
      )}
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status === "signed-off";
  return (
    <Badge variant={isCompleted ? "success" : "warning"}>
      {isCompleted ? "Completed" : "In review"}
    </Badge>
  );
}
