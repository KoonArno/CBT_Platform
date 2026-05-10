export type ScoreLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CTSRCategory = "Structure" | "Technique" | "Relationship";

export interface CTSRItem {
  no: number;
  name: string;
  nameTh: string;
  short: string;
  cat: CTSRCategory;
  tip: string;
  colorVar: string;
}

export interface EvidenceQuote {
  itemNo: number;
  speaker: "T" | "C";
  text: string;
  ts?: string;
}

export interface SessionScore {
  itemNo: number;
  aiScore: ScoreLevel | null;
  finalScore: ScoreLevel | null;
  rationale: string;
  evidence: string[];
}

export interface SessionRecord {
  id: string;
  client: string;
  therapist: string;
  date: string;
  modality: string;
  status: "draft" | "in-review" | "scored" | "signed-off";
  total: number | null;
  kappa: number | null;
}
