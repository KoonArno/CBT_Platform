import type { CTSRItem } from "@/lib/types";

export const CTS_R: readonly CTSRItem[] = [
  { no: 1, name: "Agenda Setting & Adherence", short: "Agenda Setting & Adherence", cat: "Structure", tip: "Set a clear, collaborative agenda using client priorities.", colorVar: "var(--cts-1)" },
  { no: 2, name: "Feedback", short: "Feedback", cat: "Structure", tip: "Elicit feedback regularly — not just at the end.", colorVar: "var(--cts-2)" },
  { no: 3, name: "Collaboration", short: "Collaboration", cat: "Relationship", tip: "Use 'we' and 'our'; ask before explaining.", colorVar: "var(--cts-3)" },
  { no: 4, name: "Pacing & Efficient Use of Time", short: "Pacing & Efficient Use of Time", cat: "Structure", tip: "Watch the clock; signal transitions.", colorVar: "var(--cts-4)" },
  { no: 5, name: "Interpersonal Effectiveness", short: "Interpersonal Effectiveness", cat: "Relationship", tip: "Project warmth and confidence; respond to ruptures openly.", colorVar: "var(--cts-5)" },
  { no: 6, name: "Eliciting Appropriate Emotional Expression", short: "Eliciting Appropriate Emotional Expression", cat: "Relationship", tip: "Help the client access and express the emotion that matters.", colorVar: "var(--cts-6)" },
  { no: 7, name: "Eliciting Key Cognitions", short: "Eliciting Key Cognitions", cat: "Technique", tip: "Surface the hot thoughts driving the maintaining cycle.", colorVar: "var(--cts-7)" },
  { no: 8, name: "Eliciting Behaviours", short: "Eliciting Behaviours", cat: "Technique", tip: "Identify behaviours that maintain the problem.", colorVar: "var(--cts-8)" },
  { no: 9, name: "Guided Discovery", short: "Guided Discovery", cat: "Technique", tip: "Ask questions that lead to insight — don't provide the answer.", colorVar: "var(--cts-9)" },
  { no: 10, name: "Conceptual Integration", short: "Conceptual Integration", cat: "Technique", tip: "Connect today's work to the case formulation.", colorVar: "var(--cts-10)" },
  { no: 11, name: "Application of Change Methods", short: "Application of Change Methods", cat: "Technique", tip: "Use techniques skilfully and adapt to the individual.", colorVar: "var(--cts-11)" },
  { no: 12, name: "Homework Setting", short: "Homework Setting", cat: "Technique", tip: "Co-create homework; troubleshoot obstacles in advance.", colorVar: "var(--cts-12)" },
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

export function scoreLabel(s: number | null | undefined): string {
  if (s === null || s === undefined) return "—";
  return SCORE_LABELS[s] ?? "—";
}

export const RUBRICS: Record<number, { levels: readonly string[]; tip: string }> = {
  1: { levels: ["No agenda set", "Briefly mentioned", "Basic agenda", "Collaborative agenda", "Well-structured", "Excellent collaboration", "Masterful agenda"], tip: "What would make today most useful?" },
  2: { levels: ["No feedback", "Minimal at end", "Some feedback", "Regular feedback", "Responsive", "Skillful use", "Woven naturally"], tip: "Use bridging summaries." },
  3: { levels: ["Significant misunderstanding", "Minimal reflection", "Partial understanding", "Accurate empathy", "Nuanced", "Captures unspoken", "Transformative"], tip: "Reflect content + emotion." },
  4: { levels: ["Detached", "Minimal warmth", "Beginning rapport", "Confident manner", "Strong alliance", "Excellent rapport", "Masterful"], tip: "Use the client's language." },
  5: { levels: ["Therapist-led", "Minimal collab", "Uneven", "Reasonable", "Shared decisions", "Strong partnership", "Co-therapist"], tip: "Use 'We/Our' language." },
  6: { levels: ["Poor pacing", "Significant issues", "Some rushing", "Minor imbalances", "Agenda completed", "Skilled pacing", "Optimal flow"], tip: "Signal transitions." },
  7: { levels: ["Direct advice", "Mostly psychoed", "Some questions", "Attempted Socratic", "Good questioning", "Skillful", "Masterful"], tip: "What's the evidence?" },
  8: { levels: ["No identification", "Peripheral", "Some focus", "Identified", "Formulation-driven", "Prioritises", "Precision"], tip: "Link to formulation." },
  9: { levels: ["No techniques", "Incorrect", "Mechanical", "Competent", "Adapted", "Skilled & creative", "Masterful"], tip: "Match technique to formulation." },
  10: { levels: ["No homework", "Therapist-only", "Limited rationale", "Adequate", "Specific & relevant", "Excellent", "Client-owned"], tip: "Always troubleshoot obstacles." },
  11: { levels: ["Cold/critical", "Minimal warmth", "Inconsistent", "Consistent warmth", "Genuine empathy", "Deep empathy", "Transformative"], tip: "Validate before challenging." },
  12: { levels: ["No structure", "Brief check-in", "Key elements missing", "Most elements present", "Clear framework", "Strong & flexible", "Masterful"], tip: "Check-in, bridge, agenda, work, summary, HW, feedback." },
};
