"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Search, Plus, Clock, Languages, ArrowRight } from "lucide-react";
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

export default function SessionsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filtered = RECENT_SESSIONS.filter((s) => {
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
    return matchFilter && matchQ;
  });

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
        </div>

        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {filtered.map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
              {filtered.length === 0 && (
                <li className="p-8 text-center text-sm text-muted-foreground">
                  No sessions match your filters.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SessionRow({ session: s }: { session: SessionRecord }) {
  return (
    <li>
      <Link
        href={`/sessions/${s.id}`}
        className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/40"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">
            {s.id} · {s.client}
          </div>
          <div className="text-xs text-muted-foreground">
            {s.therapist} · {s.modality} · {formatDate(s.date)}
          </div>
        </div>
        <StatusBadge status={s.status} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> 52m
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <Languages className="h-3 w-3" /> TH/EN
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>
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
