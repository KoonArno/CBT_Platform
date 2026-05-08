import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, className, padded = true, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "bg-screen rounded-card shadow-card",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
