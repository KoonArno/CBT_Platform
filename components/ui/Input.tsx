import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const BASE =
  "w-full rounded-lg border-[1.5px] border-rule bg-canvas px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(BASE, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(BASE, "resize-y leading-relaxed", props.className)}
    />
  );
}

export function Select(props: InputHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props as InputHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode };
  return (
    <select {...rest} className={cn(BASE, props.className)}>
      {children}
    </select>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow mb-2">{children}</div>;
}
