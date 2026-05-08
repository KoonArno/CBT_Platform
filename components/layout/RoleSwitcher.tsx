"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "supervisor", href: "/supervisor/dashboard", label: "Supervisor", icon: "🧠" },
  { id: "therapist",  href: "/therapist/home",      label: "Therapist",  icon: "📔" },
] as const;

export function RoleSwitcher() {
  const pathname = usePathname();
  const activeId = pathname.startsWith("/supervisor")
    ? "supervisor"
    : pathname.startsWith("/therapist")
      ? "therapist"
      : null;

  return (
    <div className="px-2 pb-2">
      <div className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-wider text-ink-faint">
        View as
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
        {ROLES.map((r) => {
          const active = activeId === r.id;
          return (
            <Link
              key={r.id}
              href={r.href}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold transition",
                active
                  ? "bg-brand text-white shadow-sm"
                  : "text-ink-muted hover:bg-white hover:text-ink",
              )}
              title={`Switch to ${r.label}`}
            >
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
