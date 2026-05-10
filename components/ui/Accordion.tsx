"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value: string;
  setValue: (v: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<string | null>(null);

interface AccordionProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function Accordion({
  value: controlled,
  defaultValue = "",
  onValueChange,
  className,
  children,
}: AccordionProps) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <AccordionContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  return (
    <ItemContext.Provider value={value}>
      <div className={className} data-value={value}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  className?: string;
  children: ReactNode;
}

export function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const ctx = useContext(AccordionContext);
  const itemValue = useContext(ItemContext);
  if (!ctx || !itemValue) throw new Error("AccordionTrigger must be used inside Accordion/AccordionItem");
  const open = ctx.value === itemValue;
  const toggle = () => ctx.setValue(open ? "" : itemValue);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={open}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="flex-1 min-w-0">{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180",
        )}
      />
    </div>
  );
}

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const ctx = useContext(AccordionContext);
  const itemValue = useContext(ItemContext);
  if (!ctx || !itemValue) throw new Error("AccordionContent must be used inside Accordion/AccordionItem");
  if (ctx.value !== itemValue) return null;
  return <div className={className}>{children}</div>;
}
