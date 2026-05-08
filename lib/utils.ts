export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysFromNow(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

export function kappaInterpretation(k: number | null): { label: string; color: string } {
  if (k === null) return { label: "Pending", color: "#6B7A9A" };
  if (k < 0.2) return { label: "Slight",         color: "#dc2626" };
  if (k < 0.4) return { label: "Fair",           color: "#E8923A" };
  if (k < 0.6) return { label: "Moderate",       color: "#d97706" };
  if (k < 0.8) return { label: "Substantial",    color: "#16a34a" };
  return         { label: "Almost Perfect", color: "#3B75E8" };
}
