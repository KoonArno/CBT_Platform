"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Label, Select } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { cn } from "@/lib/utils";

const DOCX_INFO_POINTS = [
  "ระบบจะอ่านข้อความจากเอกสาร",
  "วิเคราะห์เนื้อหาของบทสนทนา",
  "ค้นหา evidence ที่เกี่ยวข้องกับแต่ละ CTS-R item",
];

const MODALITIES = [
  "CBT — Anxiety",
  "CBT — Depression",
  "CBT — OCD",
  "CBT — Panic",
  "CBT — PTSD",
] as const;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setDone(false);
    setProgress(0);
    let p = 0;
    const tick = setInterval(() => {
      p += 12;
      if (p >= 100) {
        setProgress(100);
        setDone(true);
        clearInterval(tick);
      } else {
        setProgress(p);
      }
    }, 220);
  };

  return (
    <>
      <PageHeader
        title="Upload Session Transcript"
        subtitle="Start a new CTS-R review by uploading a DOCX transcript of the CBT session."
        right={
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="h-3 w-3" /> AI-assisted
          </Badge>
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left column: Drop zone + info */}
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transcript file</CardTitle>
            </CardHeader>
            <CardContent>
              <label
                htmlFor="file"
                className={cn(
                  "flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                  file
                    ? "border-primary/50 bg-accent/40"
                    : "border-border bg-surface hover:border-primary/40 hover:bg-accent/20",
                )}
              >
                {!file && (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Drop a DOCX file or click to browse
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Up to 10 MB · .docx, .txt
                      </div>
                    </div>
                  </>
                )}

                {file && (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="w-full max-w-sm">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <Progress value={progress} />
                      <div className="mt-2 text-xs text-muted-foreground">
                        {done ? "Parsed and ready" : `Processing… ${progress}%`}
                      </div>
                    </div>
                  </>
                )}

                <input
                  id="file"
                  type="file"
                  accept=".docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </CardContent>
          </Card>

          {/* DOCX info */}
          <div className="rounded-xl border border-border bg-accent/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-card text-primary ring-1 ring-border">
                <Info className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">
                  รองรับไฟล์ <span className="text-primary">DOCX</span> เท่านั้น
                </div>
                <div className="text-[11px] text-muted-foreground">
                  DOCX-only upload
                </div>
                <ul className="mt-3 space-y-1.5">
                  {DOCX_INFO_POINTS.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          </div>

          {/* Session details */}
          <Card>
            <CardHeader>
              <CardTitle>Session details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="e.g. Client A" />
              </div>
              <div>
                <Label htmlFor="therapist">Therapist</Label>
                <Input id="therapist" placeholder="e.g. Dr. Saran" />
              </div>
              <div>
                <Label htmlFor="modality">Modality</Label>
                <Select id="modality" defaultValue={MODALITIES[0]}>
                  {MODALITIES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Session date</Label>
                <DatePicker
                  format="DD MMM YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" disabled={!file}>
            Save draft
          </Button>
          <Link href="/processing">
            <Button>
              Start AI Processing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
