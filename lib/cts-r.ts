import type { CTSRItem, ScoreLevel } from "@/lib/types";

export const CTS_R: readonly CTSRItem[] = [
  { id: 1,  name: "Agenda Setting & Adherence",           short: "Agenda",       cat: "Structure",    tip: "Set a clear, collaborative agenda using client priorities." },
  { id: 2,  name: "Feedback",                             short: "Feedback",     cat: "Structure",    tip: "Elicit feedback regularly — not just at the end." },
  { id: 3,  name: "Understanding",                        short: "Understand",   cat: "Relationship", tip: "Reflect feelings and content accurately. Check you've understood." },
  { id: 4,  name: "Interpersonal Effectiveness",          short: "Rapport",      cat: "Relationship", tip: "Project warmth and confidence. Respond to ruptures openly." },
  { id: 5,  name: "Collaboration",                        short: "Collab",       cat: "Relationship", tip: "Use 'we' and 'our'. Ask before explaining." },
  { id: 6,  name: "Pacing & Efficient Use of Time",       short: "Pacing",       cat: "Structure",    tip: "Watch the clock. Signal transitions. Reserve time for homework." },
  { id: 7,  name: "Guided Discovery",                     short: "Guided Disc",  cat: "Technique",    tip: "Ask questions that lead to insight — don't provide the answer." },
  { id: 8,  name: "Focus on Key Cognitions & Behaviours", short: "Key Cog/Beh",  cat: "Technique",    tip: "Stay formulation-led. Target the maintaining cycle." },
  { id: 9,  name: "Application of Change Methods",        short: "Change Meth",  cat: "Technique",    tip: "Use techniques skillfully and adapt to the individual." },
  { id: 10, name: "Homework Setting",                     short: "Homework",     cat: "Technique",    tip: "Co-create homework. Troubleshoot obstacles in advance." },
  { id: 11, name: "Empathy & Positive Regard",            short: "Empathy",      cat: "Relationship", tip: "Validate before you challenge. Separate the person from their thoughts." },
  { id: 12, name: "Structuring Skills",                   short: "Structure",    cat: "Structure",    tip: "Maintain a clear session arc: check-in, bridge, agenda, work, summary, HW, feedback." },
] as const;

export const SCORE_LABELS = [
  "Incompetent",
  "Rudimentary",
  "Novice",
  "Intermediate",
  "Advanced",
  "Proficient",
  "Expert",
] as const;

export function scoreColor(s: number | null | undefined): string {
  if (s === null || s === undefined) return "#C0CAD8";
  if (s <= 1) return "#ef4444";
  if (s <= 2) return "#f97316";
  if (s <= 3) return "#eab308";
  if (s <= 4) return "#22c55e";
  if (s <= 5) return "#3B75E8";
  return "#7c3aed";
}

export function scoreLabel(s: ScoreLevel | null | undefined): string {
  if (s === null || s === undefined) return "—";
  return SCORE_LABELS[s];
}

export const RUBRICS: Record<number, { levels: string[]; tips: string }> = {
  1: { levels: ["No agenda set; completely unstructured session", "Agenda briefly mentioned; not collaborative", "Basic agenda; some structure, not negotiated", "Collaborative agenda; clear priorities agreed", "Well-structured agenda; flexible and time-aware", "Excellent collaborative agenda; adaptable and purposeful", "Masterful agenda; fully collaborative, time-aware, therapeutically driven"], tips: "Try: 'What would make today's session most useful? Given our time, shall we prioritise X or Y?'" },
  2: { levels: ["No feedback sought or given", "Minimal feedback at end only", "Some feedback; not well integrated", "Regular feedback; some integration", "Good feedback; responsive to client responses", "Skillful use of feedback to guide session direction", "Feedback woven naturally throughout; drives therapeutic process"], tips: "Use bridging summaries; ask 'Does that make sense?' and 'How does that land?'" },
  3: { levels: ["Significant misunderstanding of client's experience", "Minimal accurate reflection", "Some empathy; partial understanding", "Accurate empathy; client feels heard", "Consistent accurate empathy; nuanced understanding", "Deep empathy; captures unspoken experience", "Exceptional empathy; transforms client's self-understanding"], tips: "Reflect both content and emotion. Use 'It sounds like...' and check accuracy." },
  4: { levels: ["Detached, cold or overly clinical", "Minimal warmth; professional but distant", "Some warmth; beginning rapport", "Good warmth; confident professional manner", "Strong therapeutic relationship; natural confidence", "Excellent rapport; genuine and effective", "Masterful interpersonal skill; transforms the alliance"], tips: "Use the client's language, make appropriate self-disclosures, manage ruptures openly." },
  5: { levels: ["Therapist-led throughout; client passive", "Minimal collaboration; occasional checking in", "Some joint working; uneven", "Reasonable collaboration on most tasks", "Good collaboration; shared decision-making", "Strong partnership; client feels ownership", "Fully collaborative; client is co-therapist in their recovery"], tips: "Use 'We/Our' language. Ask 'What do you make of that?' rather than explaining." },
  6: { levels: ["Poor time management; major imbalance", "Significant time issues; session incomplete", "Pacing problems; some areas rushed", "Reasonable pacing; minor imbalances", "Good use of time; agenda completed", "Skilled pacing; flexible and efficient", "Optimal session flow; every minute purposeful"], tips: "Set a timer for agenda items. Signal transitions: 'We have 10 mins left on this...'" },
  7: { levels: ["Direct advice/reassurance throughout", "Minimal questioning; mainly psychoeducation", "Some questions; not Socratic", "Guided discovery attempted; not consistently skilful", "Good Socratic questioning; client reaches own insights", "Skillful guided discovery; facilitates genuine discovery", "Masterful use; client discovers insights independently"], tips: "Follow the client's reasoning. Ask 'What's the evidence for that?' and 'What would you tell a friend?'" },
  8: { levels: ["No identification of key cognitions/behaviours", "Peripheral focus; key factors missed", "Some focus on cognitions; maintaining factors unclear", "Key cognitions/behaviours identified; some focus", "Good focus; formulation-driven", "Skilled focus; prioritises therapeutically significant factors", "Masterful; precision targeting of maintaining cycle"], tips: "Link to formulation. Ask 'How does this thought/behaviour keep the problem going?'" },
  9: { levels: ["No CBT techniques applied", "Techniques applied incorrectly or superficially", "Basic techniques; mechanical application", "Appropriate techniques; competent application", "Good technique use; adapted to client", "Skilled and creative technique use; excellent fit", "Masterful technique use; perfectly tailored and impactful"], tips: "Match technique to formulation, not just symptoms." },
  10: { levels: ["No homework discussed", "Homework assigned by therapist only", "Basic homework; limited rationale", "Collaborative homework; adequate rationale", "Good homework; specific, measurable and relevant", "Excellent homework; flows from session; strong rationale", "Perfect homework; client owns it; built-in problem solving"], tips: "Ask: 'What would you like to try before we meet again?' Always troubleshoot obstacles." },
  11: { levels: ["Cold, dismissive or critical attitude", "Minimal warmth; occasional positive regard", "Some empathy; inconsistent warmth", "Consistent warmth and positive regard", "Genuine empathy and unconditional regard", "Deep empathy; client feels profoundly understood", "Exceptional; transformative therapeutic relationship"], tips: "Separate the person from their thoughts. Validate before challenging." },
  12: { levels: ["No CBT structure evident", "Brief check-in only; no structure", "Some structure; key elements missing", "Basic structure; most elements present", "Good structure; clear CBT framework maintained", "Strong structure; flexible and purposeful", "Masterful structure; flows naturally; invisible scaffolding"], tips: "Always: check-in, bridge, agenda, work, summary, homework, feedback." },
};
