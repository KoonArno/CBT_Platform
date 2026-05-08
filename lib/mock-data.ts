import type {
  AssignedExercise,
  FeedbackItem,
  JournalEntry,
  MetaLogEntry,
  PendingValidation,
  SessionRecord,
  Therapist,
} from "@/lib/types";

export const THERAPISTS: readonly Therapist[] = [
  { id: 1, name: "Dr. Sarah Chen", initials: "SC", role: "CBT Therapist", status: "Active",   sessions: 8,  avgScore: 42, lastDate: "2026-03-01", color: "#3B75E8" },
  { id: 2, name: "James Okonkwo",  initials: "JO", role: "Trainee CBT",   status: "Active",   sessions: 5,  avgScore: 38, lastDate: "2026-02-28", color: "#E8923A" },
  { id: 3, name: "Maria Santos",   initials: "MS", role: "CBT Therapist", status: "Inactive", sessions: 12, avgScore: 51, lastDate: "2026-02-25", color: "#7c3aed" },
  { id: 4, name: "Tom Bradley",    initials: "TB", role: "Trainee CBT",   status: "Active",   sessions: 3,  avgScore: 35, lastDate: "2026-02-10", color: "#16a34a" },
];

export const PENDING: readonly PendingValidation[] = [
  { id: 1, type: "ai",      label: "AI Score Review",        therapist: "James Okonkwo",  session: "Session 5", date: "2026-02-28", urgency: "high"   },
  { id: 2, type: "student", label: "Student Self-Review",    therapist: "Tom Bradley",    session: "Session 3", date: "2026-02-10", urgency: "medium" },
  { id: 3, type: "peer",    label: "Peer Supervisor Review", therapist: "Dr. Sarah Chen", session: "Session 8", date: "2026-03-01", urgency: "low"    },
  { id: 4, type: "student", label: "Student Self-Review",    therapist: "James Okonkwo",  session: "Session 4", date: "2026-02-20", urgency: "medium" },
];

export const PROGRESS_TREND = [
  { s: "S1", total: 32, self: 30 },
  { s: "S2", total: 36, self: 33 },
  { s: "S3", total: 39, self: 36 },
  { s: "S4", total: 37, self: 36 },
  { s: "S5", total: 42, self: 39 },
  { s: "S6", total: 44, self: 41 },
  { s: "S7", total: 43, self: 42 },
  { s: "S8", total: 47, self: 44 },
] as const;

export const META_LOGS: readonly MetaLogEntry[] = [
  { id: 1, ts: "2026-03-01 14:23", session: "Chen S8",    model: "claude-sonnet-4-20250514", pTok: 3842, cTok: 979,  rt: 3.2, aiTotal: 43, supTotal: 43, agree: 91.7, kappa: 0.87 },
  { id: 2, ts: "2026-02-28 10:15", session: "Okonkwo S5", model: "claude-sonnet-4-20250514", pTok: 4201, cTok: 1002, rt: 4.1, aiTotal: 36, supTotal: 38, agree: 83.3, kappa: 0.79 },
  { id: 3, ts: "2026-02-25 16:40", session: "Santos S12", model: "claude-sonnet-4-20250514", pTok: 3120, cTok: 867,  rt: 2.9, aiTotal: 52, supTotal: 52, agree: 100,  kappa: 1.0  },
];

export const SESSIONS_HIST: readonly SessionRecord[] = [
  { id: 1, date: "2026-03-01", supervisor: "Dr. Patel", status: "reviewed", total: 43, selfTotal: 40, items: [3,4,4,3,4,3,5,4,4,3,4,4], selfItems: [3,3,4,3,3,3,4,4,3,3,3,4] },
  { id: 2, date: "2026-02-14", supervisor: "Dr. Patel", status: "reviewed", total: 38, selfTotal: 35, items: [3,3,3,3,3,3,4,3,3,3,3,3], selfItems: [3,3,3,2,3,2,3,3,3,2,3,3] },
  { id: 3, date: "2026-01-28", supervisor: "Dr. Patel", status: "reviewed", total: 36, selfTotal: 33, items: [3,3,3,2,3,3,3,3,3,2,3,3], selfItems: [2,2,3,2,2,2,3,3,2,2,3,2] },
  { id: 4, date: "2026-01-10", supervisor: "Dr. Patel", status: "reviewed", total: 33, selfTotal: 30, items: [2,3,3,2,3,2,3,3,2,2,3,3], selfItems: [2,2,2,2,2,2,3,2,2,2,2,2] },
  { id: 5, date: "2025-12-05", supervisor: "Dr. Patel", status: "reviewed", total: 29, selfTotal: 27, items: [2,2,2,2,2,2,2,2,2,2,2,3], selfItems: [2,2,2,2,2,2,2,2,2,2,2,2] },
];

export const FEEDBACK: readonly FeedbackItem[] = [
  { id: 1, sid: 1, type: "strength",    author: "Dr. Patel",  date: "2026-03-01", text: "Your Socratic questioning has improved markedly. You guided the client to discover the cognitive distortion themselves without prompting.", item: 7  },
  { id: 2, sid: 1, type: "development", author: "Dr. Patel",  date: "2026-03-01", text: "Homework setting needs more collaboration. Try: 'What would be most helpful to practise this week?' and let the client lead.",        item: 10 },
  { id: 3, sid: 1, type: "goal",        author: "Dr. Patel",  date: "2026-03-01", text: "Goal: In your next session, use at least 3 Socratic follow-up questions before offering any psychoeducation or summary.",                  item: 7  },
  { id: 4, sid: 1, type: "peer",        author: "Sarah Chen", date: "2026-03-01", text: "I noticed you handled the rupture in the middle section really well — you named it openly and the alliance repaired.",                       item: 4  },
  { id: 5, sid: 2, type: "strength",    author: "Dr. Patel",  date: "2026-02-14", text: "Good agenda setting — you incorporated the client's priorities and the structure was clear.", item: 1 },
  { id: 6, sid: 2, type: "development", author: "Dr. Patel",  date: "2026-02-14", text: "Pacing was difficult. You spent 25 minutes on check-in and ran out of time for homework. Practise time signals mid-session.", item: 6 },
];

export const ASSIGNED_EXERCISES: readonly AssignedExercise[] = [
  { id: "socratic",    icon: "❓", name: "Socratic Questioning Practice", assignedBy: "Dr. Patel", dueDate: "2026-03-12", status: "pending",   color: "#3B75E8", note: "Focus on item 7 — practice generating 5 follow-up questions from a single belief statement." },
  { id: "thinking",    icon: "🧠", name: "Thinking Error Detection",      assignedBy: "Dr. Patel", dueDate: "2026-03-12", status: "pending",   color: "#E8923A", note: "Review the 10 most common cognitive distortions. Practice labelling them from transcript examples." },
  { id: "formulation", icon: "🗺", name: "Formulation Drawing",           assignedBy: "Dr. Patel", dueDate: "2026-03-19", status: "completed", color: "#16a34a", note: "Completed! Draw a 5-part formulation for your next new client." },
];

export const JOURNAL: readonly JournalEntry[] = [
  { id: 1, date: "2026-03-02", title: "Reflecting on Session 8", mood: "curious",    text: "I felt more confident with Socratic questioning today. I noticed I was tempted to explain the cognitive distortion to the client but I held back and asked another question instead. The client found the insight herself and it felt much more powerful." },
  { id: 2, date: "2026-02-15", title: "Difficulty with pacing",  mood: "challenged", text: "Supervision highlighted my pacing issue again. I think I overrun on check-in because I feel anxious about jumping into the 'difficult' material. Need to think about what I'm avoiding." },
];

export const SAMPLE_TRANSCRIPT = `T: Good afternoon. Before we begin, I'd like to check in — how has the week been?
C: It's been okay. A bit mixed, actually. Work was stressful.
T: Stressful in what way?
C: My manager gave me critical feedback in front of the team. I felt humiliated.
T: That sounds really difficult. Before we explore that, can I suggest we set an agenda for today?
C: Yes, both. I'd say the work thing is most pressing.
T: So when your manager criticised you in public, what went through your mind?
C: I immediately thought 'Everyone thinks I'm incompetent.' It just hit me instantly.
T: On a scale of 0 to 100, how much did you believe that in the moment?
C: About 90. Maybe 95.
T: What do you think the evidence is for that thought?
C: Well... my manager did say the report needed more work.
T: And what might be an alternative way to look at it?
C: Maybe... she was commenting on one piece of work, not my overall ability?
T: If we weigh up the evidence, what rating would you give the original thought now?
C: Maybe 60. It's still there but it feels less absolute.
T: What would you like to try this week as homework?
C: Maybe write down when I notice that 'incompetent' thought and challenge it like we just did?`;

export const SELF_REVIEW_PROMPTS: readonly string[] = [
  "What did you do well in this session? Give a specific example.",
  "Where did you feel less confident or competent? What got in the way?",
  "How well did you stay formulation-led? Describe a moment where you did or didn't.",
  "What was the quality of the therapeutic alliance? Any ruptures? How did you manage them?",
  "How did the client respond to your interventions? What worked and what didn't?",
  "What would you do differently if you could redo this session?",
  "What skill do you most want to develop before your next supervision session?",
];

export const PREP_CHECKLIST: readonly string[] = [
  "I have listened back to the session recording",
  "I have completed my self-review form",
  "I have identified 2–3 specific questions for supervision",
  "I have reviewed my previous supervision goals",
  "I have noted any client safety concerns to raise",
  "I have identified which CTS-R items I struggled with",
];

export const CURRENT_THERAPIST = {
  name: "James Okonkwo",
  initials: "JO",
  role: "Trainee CBT Therapist",
  supervisor: "Dr. Amara Patel",
  programme: "PG Dip CBT · Year 2",
  nextSupervision: "2026-03-12",
} as const;
