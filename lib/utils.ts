import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function kappaInterpretation(k: number | null): {
  label: string;
  tone: "muted" | "destructive" | "warning" | "success" | "primary";
} {
  if (k === null) return { label: "Pending", tone: "muted" };
  if (k < 0.2) return { label: "Slight", tone: "destructive" };
  if (k < 0.4) return { label: "Fair", tone: "warning" };
  if (k < 0.6) return { label: "Moderate", tone: "warning" };
  if (k < 0.8) return { label: "Substantial", tone: "success" };
  return { label: "Almost Perfect", tone: "primary" };
}
