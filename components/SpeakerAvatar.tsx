import { cn } from "@/lib/utils";

interface SpeakerAvatarProps {
  speaker: "Therapist" | "Client";
  className?: string;
  size?: "sm" | "md";
}

export function SpeakerAvatar({
  speaker,
  className,
  size = "sm",
}: SpeakerAvatarProps) {
  const isT = speaker === "Therapist";
  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center rounded-full font-semibold tracking-tight ring-2 ring-card",
        size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs",
        isT
          ? "bg-primary text-primary-foreground"
          : "bg-surface-muted text-foreground/70",
        className,
      )}
      aria-label={speaker}
    >
      {isT ? "T" : "C"}
    </span>
  );
}
