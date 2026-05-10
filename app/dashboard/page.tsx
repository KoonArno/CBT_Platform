"use client";

import Link from "next/link";
import {
  Upload,
  FileText,
  ArrowRight,
  Clock,
  Languages,
  ClipboardList,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RECENT_SESSIONS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const STATS = [
  {
    label: "Total sessions",
    value: RECENT_SESSIONS.length,
    icon: ClipboardList,
    sub: "ทั้งหมด",
  },
  {
    label: "In review",
    value: RECENT_SESSIONS.filter((s) => s.status === "in-review").length,
    icon: Activity,
    sub: "กำลังดำเนินการ",
  },
  {
    label: "Completed",
    value: RECENT_SESSIONS.filter((s) => s.status === "signed-off").length,
    icon: FileText,
    sub: "เสร็จสิ้นแล้ว",
  },
] as const;

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome back, Dr. Wattana"
        subtitle="ยินดีต้อนรับเข้าสู่ระบบ CTB-Dojo กรุณาเลือกจาก Session ที่ค้างอยู่ หรือ Upload ไฟล์ session ใหม่"
        showStepper={false}
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/upload"
          className="group block overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary-foreground">
                  Start a new CTS-R review
                </h2>
                <p className="mt-1 max-w-xl text-sm text-primary-foreground/80">
                  เริ่มรีวิว session ใหม่
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform group-hover:translate-x-0.5">
              Upload session <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <div className="grid gap-3 sm:grid-cols-3">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
                <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent sessions</CardTitle>
            <Link
              href="/sessions"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {RECENT_SESSIONS.slice(0, 4).map((s) => (
                <li key={s.id}>
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
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
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
