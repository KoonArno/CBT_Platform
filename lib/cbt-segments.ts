import type { CBTSegment } from "@/lib/types";

export const CBT_SEGMENTS: readonly CBTSegment[] = [
  { id: "intro",    label: "Introduction & Check-in",  color: "#3B75E8", start: 0,  end: 8  },
  { id: "bridge",   label: "Bridge from Last Session", color: "#E8923A", start: 8,  end: 14 },
  { id: "agenda",   label: "Agenda Setting",           color: "#F5C840", start: 14, end: 18 },
  { id: "hwreview", label: "Homework Review",          color: "#16a34a", start: 18, end: 26 },
  { id: "topic1",   label: "Topic 1",                  color: "#7c3aed", start: 26, end: 38 },
  { id: "cogrest",  label: "Cognitive Restructuring",  color: "#E8923A", start: 38, end: 50 },
  { id: "topic2",   label: "Topic 2",                  color: "#7c3aed", start: 50, end: 54 },
  { id: "hwset",    label: "Homework Setting",         color: "#16a34a", start: 54, end: 58 },
  { id: "summary",  label: "Summary & Feedback",       color: "#3B75E8", start: 58, end: 60 },
] as const;
