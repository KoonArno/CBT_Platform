export type CTSRCategory = "Structure" | "Relationship" | "Technique";

export interface CTSRItem {
  id: number;
  name: string;
  short: string;
  cat: CTSRCategory;
  tip: string;
}

export type ScoreLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ValidationDecision = "accept" | "modify" | "reject";

export interface AISuggestion {
  itemId: number;
  itemName: string;
  score: ScoreLevel;
  evidence: string;
  rationale: string;
}

export interface CBTSegment {
  id: string;
  label: string;
  color: string;
  start: number;
  end: number;
}

export interface Therapist {
  id: number;
  name: string;
  initials: string;
  role: string;
  status: "Active" | "Inactive";
  archived?: boolean;
  sessions: number;
  avgScore: number;
  lastDate: string;
  color: string;
}

export type FeedbackType =
  | "strength"
  | "development"
  | "reflection"
  | "goal"
  | "peer";

export interface FeedbackItem {
  id: number;
  sid?: number;
  type: FeedbackType;
  author: string;
  date: string;
  text: string;
  session?: string;
  item?: number;
}

export interface SessionRecord {
  id: number;
  date: string;
  supervisor: string;
  status: "reviewed" | "pending" | "draft";
  total: number;
  selfTotal: number;
  items: number[];
  selfItems: number[];
}

export interface PendingValidation {
  id: number;
  type: "ai" | "student" | "peer";
  label: string;
  therapist: string;
  session: string;
  date: string;
  urgency: "high" | "medium" | "low";
}

export interface MetaLogEntry {
  id: number;
  ts: string;
  session: string;
  model: string;
  pTok: number;
  cTok: number;
  rt: number;
  aiTotal: number;
  supTotal: number | null;
  agree: number | null;
  kappa: number | null;
}

export interface JournalEntry {
  id: number;
  date: string;
  title: string;
  mood: string;
  text: string;
}

export interface AssignedExercise {
  id: string;
  icon: string;
  name: string;
  assignedBy: string;
  dueDate: string;
  status: "pending" | "completed";
  color: string;
  note: string;
}
