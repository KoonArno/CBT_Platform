import type { SessionRecord, SessionScore, EvidenceQuote } from "@/lib/types";

export const RECENT_SESSIONS: readonly SessionRecord[] = [
  { id: "S-1042", client: "Client A", therapist: "Dr. Saran", date: "2025-04-28", modality: "CBT — Anxiety", status: "in-review", total: null, kappa: null },
  { id: "S-1038", client: "Client M", therapist: "Dr. Pim", date: "2025-04-25", modality: "CBT — Depression", status: "scored", total: 48, kappa: 0.72 },
  { id: "S-1031", client: "Client K", therapist: "Dr. Saran", date: "2025-04-21", modality: "CBT — OCD", status: "signed-off", total: 52, kappa: 0.81 },
  { id: "S-1024", client: "Client R", therapist: "Dr. Anchana", date: "2025-04-18", modality: "CBT — Panic", status: "signed-off", total: 44, kappa: 0.66 },
  { id: "S-1019", client: "Client J", therapist: "Dr. Pim", date: "2025-04-12", modality: "CBT — PTSD", status: "draft", total: null, kappa: null },
];

export const CURRENT_SESSION: SessionRecord = RECENT_SESSIONS[0];

export const AI_SCORES: readonly SessionScore[] = [
  { itemNo: 1, aiScore: 4, finalScore: 4, rationale: "Agenda set collaboratively at minute 02:14; therapist re-checked priorities mid-session.", evidence: ["00:02:14", "00:18:42"] },
  { itemNo: 2, aiScore: 3, finalScore: 3, rationale: "Feedback only sought at end; no mid-session bridge.", evidence: ["00:46:10"] },
  { itemNo: 3, aiScore: 5, finalScore: 5, rationale: "Multiple accurate reflections of unspoken affect.", evidence: ["00:07:30", "00:21:08"] },
  { itemNo: 4, aiScore: 4, finalScore: 4, rationale: "Warm, confident manner; managed minor rupture at 00:12.", evidence: ["00:12:55"] },
  { itemNo: 5, aiScore: 4, finalScore: 4, rationale: "Used 'we' framing consistently; checked client preference.", evidence: ["00:09:44", "00:31:02"] },
  { itemNo: 6, aiScore: 3, finalScore: 4, rationale: "AI marked rushed but supervisor noted intentional pacing.", evidence: ["00:38:00"] },
  { itemNo: 7, aiScore: 5, finalScore: 5, rationale: "Excellent Socratic dialogue around catastrophic thought.", evidence: ["00:24:18", "00:27:55"] },
  { itemNo: 8, aiScore: 4, finalScore: 4, rationale: "Maintained focus on the maintaining cycle of avoidance.", evidence: ["00:19:22"] },
  { itemNo: 9, aiScore: 3, finalScore: 3, rationale: "Behavioural experiment introduced but rationale incomplete.", evidence: ["00:33:40"] },
  { itemNo: 10, aiScore: 4, finalScore: 4, rationale: "Homework co-created with troubleshooting.", evidence: ["00:48:15"] },
  { itemNo: 11, aiScore: 5, finalScore: 5, rationale: "Validation throughout; client visibly relieved.", evidence: ["00:15:00"] },
  { itemNo: 12, aiScore: 4, finalScore: 4, rationale: "Clear arc; bridge from prior session well-executed.", evidence: ["00:00:30", "00:50:00"] },
];

export type EvidenceStatus = "suggested" | "confirmed" | "manual";

export interface AiEvidence {
  id: string;
  itemNo: number;
  paragraphId: string;
  ref: string;
  quote: string;
  status: EvidenceStatus;
}

export const AI_EVIDENCE: readonly AiEvidence[] = [
  { id: "ev1", itemNo: 1, paragraphId: "p3", ref: "00:02:14", quote: "Given we have 50 minutes, what would be most useful to focus on today?", status: "suggested" },
  { id: "ev2", itemNo: 3, paragraphId: "p5", ref: "00:07:30", quote: "It sounds like underneath the worry there's something heavier — almost a sense of dread?", status: "confirmed" },
  { id: "ev3", itemNo: 4, paragraphId: "p7", ref: "00:12:55", quote: "I noticed I cut you off a moment ago — I'm sorry. Can you go back to what you were saying about your manager?", status: "suggested" },
  { id: "ev4", itemNo: 7, paragraphId: "p9", ref: "00:24:18", quote: "If a friend told you the same thought, what would you say back to them?", status: "confirmed" },
  { id: "ev5", itemNo: 9, paragraphId: "p11", ref: "00:33:40", quote: "What if we tried a small experiment this week — leaving one work email unanswered for an hour?", status: "suggested" },
  { id: "ev6", itemNo: 10, paragraphId: "p12", ref: "00:48:15", quote: "What might get in the way of trying that this week?", status: "confirmed" },
  { id: "ev7", itemNo: 11, paragraphId: "p8", ref: "00:15:00", quote: "That makes a lot of sense. It would be hard not to feel that way.", status: "confirmed" },
  { id: "ev8", itemNo: 12, paragraphId: "p13", ref: "00:50:00", quote: "Let me summarise: we identified the catastrophic thought, tried a Socratic dialogue, and agreed on a small experiment.", status: "manual" },
];

export const TRANSCRIPT_QUOTES: readonly EvidenceQuote[] = [
  { itemNo: 1, speaker: "T", text: "Given we have 50 minutes, what would be most useful to focus on today?", ts: "00:02:14" },
  { itemNo: 3, speaker: "T", text: "It sounds like underneath the worry there's something heavier — almost a sense of dread?", ts: "00:07:30" },
  { itemNo: 7, speaker: "T", text: "If a friend told you the same thought, what would you say back?", ts: "00:24:18" },
  { itemNo: 10, speaker: "T", text: "What might get in the way of trying that this week?", ts: "00:48:15" },
  { itemNo: 11, speaker: "T", text: "That makes a lot of sense. It would be hard not to feel that way.", ts: "00:15:00" },
];

export interface TranscriptParagraph {
  id: string;
  ts: string;
  speaker: "Therapist" | "Client";
  text: string;
}

export const TRANSCRIPT: readonly TranscriptParagraph[] = [
  { id: "p1", ts: "00:00:30", speaker: "Therapist", text: "Welcome back. Last week we talked about your worry around work — how has the past week been since then?" },
  { id: "p2", ts: "00:01:10", speaker: "Client", text: "It's been a mixed week. The deadlines piled up and I had a couple of nights I couldn't sleep at all." },
  { id: "p3", ts: "00:02:14", speaker: "Therapist", text: "Given we have 50 minutes, what would be most useful to focus on today?" },
  { id: "p4", ts: "00:02:31", speaker: "Client", text: "I think the worry about work is what's been keeping me up at night. I'd like to understand it better." },
  { id: "p5", ts: "00:07:30", speaker: "Therapist", text: "It sounds like underneath the worry there's something heavier — almost a sense of dread?" },
  { id: "p6", ts: "00:08:02", speaker: "Client", text: "Yeah… that's exactly it. Like something terrible is about to happen even when nothing's wrong." },
  { id: "p7", ts: "00:12:55", speaker: "Therapist", text: "I noticed I cut you off a moment ago — I'm sorry. Can you go back to what you were saying about your manager?" },
  { id: "p8", ts: "00:15:00", speaker: "Therapist", text: "That makes a lot of sense. It would be hard not to feel that way given everything you've described." },
  { id: "p9", ts: "00:24:18", speaker: "Therapist", text: "If a friend told you the same thought, what would you say back to them?" },
  { id: "p10", ts: "00:24:55", speaker: "Client", text: "I'd probably tell them they're being too hard on themselves and that one missed deadline doesn't define them." },
  { id: "p11", ts: "00:33:40", speaker: "Therapist", text: "What if we tried a small experiment this week — leaving one work email unanswered for an hour and tracking what happens?" },
  { id: "p12", ts: "00:48:15", speaker: "Therapist", text: "What might get in the way of trying that this week?" },
  { id: "p13", ts: "00:50:00", speaker: "Therapist", text: "Let me summarise: we identified the catastrophic thought, tried a Socratic dialogue around it, and agreed on a small behavioural experiment. How does that feel?" },
] as const;

export const MOCK_STUDENT_FEEDBACK = {
  strengths:
    "คุณแสดงทักษะในการสร้างสัมพันธภาพที่ดีมาก โดยเฉพาะการสะท้อนอารมณ์ได้แม่นยำและทันเวลา การตั้งวาระร่วมกับผู้รับบริการในช่วงต้น session ทำให้ session มีโครงสร้างที่ชัดเจน นอกจากนี้ การใช้ Socratic dialogue เพื่อตั้งคำถามให้ผู้รับบริการค้นพบความคิดทางเลือกด้วยตนเองเป็นจุดเด่นที่น่าชื่นชม",
  growth:
    "• ควรให้เหตุผลที่ชัดเจนขึ้นเมื่อแนะนำ Behavioural Experiment เพื่อให้ผู้รับบริการเข้าใจและยอมรับการบ้าน\n• ฝึกการขอ feedback จากผู้รับบริการในช่วงกลาง session ไม่ใช่แค่ช่วงท้าย เพื่อให้สามารถปรับทิศทางได้ทันท่วงที\n• ทบทวนการบ้านในครั้งถัดไปด้วยการคาดการณ์อุปสรรคล่วงหน้าร่วมกับผู้รับบริการ",
  suggestions:
    "ในการ supervision ครั้งถัดไป กรุณานำคลิปเสียง 5 นาทีที่แสดงการตั้งการบ้าน เพื่อทบทวนโปรโตคอล Behavioural Experiment ร่วมกัน และฝึกการใช้ภาษาที่ให้ rationale ที่ชัดเจนยิ่งขึ้น",
};

export const SESSION_META = {
  fileName: "session-1042-transcript.docx",
  uploadedAt: "2025-04-28T14:22:00Z",
  duration: "52:14",
  wordCount: 8420,
  language: "Thai / English mixed",
};
