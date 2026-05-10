"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Info,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { cn } from "@/lib/utils";

const DOCX_INFO_POINTS = [
  "ระบบจะตรวจสอบข้อมูลซ้ำ เพื่อปกปิดข้อมูลส่วนบุคคลและข้อมูลอ่อนไหว",
  "ค้นหาและคัดเลือกหลักฐานที่เกี่ยวข้องกับ CTS-R แต่ละ item",
  "วิเคราะห์เพื่อให้คำแนะนำจุดแข็งและจุดที่ฝึกฝนพัฒนา",
];

const SHORT_DESCRIPTION_MAX = 72;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [dragInvalid, setDragInvalid] = useState(false);

  const ACCEPTED_TYPES = new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]);

  const isAcceptedFile = (f: File) => {
    const name = f.name.toLowerCase();
    return name.endsWith(".docx") || name.endsWith(".txt");
  };

  const isDraggedItemAccepted = (e: React.DragEvent<HTMLLabelElement>) => {
    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return true;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.kind !== "file") continue;
      if (it.type && !ACCEPTED_TYPES.has(it.type)) return false;
    }
    return true;
  };

  const resetFile = () => {
    setFile(null);
    setProgress(0);
    setDone(false);
    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
    toast("ลบไฟล์แล้ว");
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setDone(false);
    setProgress(0);
    toast.info(`กำลังประมวลผล ${f.name}`);
    let p = 0;
    const tick = setInterval(() => {
      p += 12;
      if (p >= 100) {
        setProgress(100);
        setDone(true);
        clearInterval(tick);
        toast.success("อัปโหลดสำเร็จ พร้อมสำหรับ AI Processing");
      } else {
        setProgress(p);
      }
    }, 220);
  };

  return (
    <>
      <PageHeader
        title="Upload Session Transcript"
        subtitle="เริ่มการรีวิวเซสชันการบำบัด ด้วยการอัปโหลดถอดเทปการสนทนาเพื่อประเมิน CTS-R"
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
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const ok = isDraggedItemAccepted(e);
                  setDragActive(true);
                  setDragInvalid(!ok);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const ok = isDraggedItemAccepted(e);
                  e.dataTransfer.dropEffect = ok ? "copy" : "none";
                  if (!dragActive) setDragActive(true);
                  setDragInvalid(!ok);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  setDragInvalid(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  setDragInvalid(false);
                  const dropped = e.dataTransfer.files?.[0];
                  if (!dropped) return;
                  if (isAcceptedFile(dropped)) {
                    handleFile(dropped);
                  } else {
                    toast.error("รองรับเฉพาะไฟล์ .docx และ .txt เท่านั้น");
                  }
                }}
                className={cn(
                  "relative flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                  dragInvalid
                    ? "cursor-not-allowed border-destructive bg-destructive/10 ring-2 ring-destructive/30"
                    : "cursor-pointer",
                  !dragInvalid && dragActive
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : !dragInvalid && file
                    ? "border-primary/50 bg-accent/40"
                    : !dragInvalid &&
                      "border-border bg-surface hover:border-primary/40 hover:bg-accent/20",
                )}
              >
                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      resetFile();
                    }}
                    aria-label="Remove file"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {!file && (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        ลากไฟล์มาวาง หรือ คลิกเพื่อเลือกไฟล์ถอดเทป (รองรับสกุลไฟล์ .docx, .txt)
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Up to 10 MB
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
                  รองรับไฟล์ <span className="text-primary">DOCX และ TXT</span> เท่านั้น
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
                <Label htmlFor="client">Session Number</Label>
                <Input id="client" placeholder="1" />
              </div>
              <div>
                <Label htmlFor="client">ชื่อย่อเคส</Label>
                <Input id="client" placeholder="e.g. Client A" />
              </div>
              <div>
                <Label htmlFor="therapist">ชื่อนักบำบัด</Label>
                <Input id="therapist" placeholder="e.g. Dr. Saran" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shortDescription">Short description</Label>
                  <span
                    className={cn(
                      "text-[11px] tabular-nums",
                      shortDescription.length > SHORT_DESCRIPTION_MAX
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {shortDescription.length}/{SHORT_DESCRIPTION_MAX}
                  </span>
                </div>
                <Input
                  id="shortDescription"
                  maxLength={SHORT_DESCRIPTION_MAX}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="สรุปสั้นๆ ไม่เกิน 72 ตัวอักษร"
                />
              </div>
              <div>
                <Label>วันที่</Label>
                <DatePicker
                  format="DD MM YYYY"
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
