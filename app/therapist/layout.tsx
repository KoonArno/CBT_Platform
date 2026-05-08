import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import type { NavItem } from "@/components/layout/Sidebar";
import { CURRENT_THERAPIST } from "@/lib/mock-data";

const NAV: ReadonlyArray<NavItem> = [
  { href: "/therapist/home",        icon: "🏠", label: "Home"             },
  { href: "/therapist/sessions",    icon: "📋", label: "My Sessions"      },
  { href: "/therapist/feedback",    icon: "💬", label: "My Feedback"      },
  { href: "/therapist/progress",    icon: "📈", label: "My Progress"      },
  { href: "/therapist/self-review", icon: "✍",  label: "Self-Review"      },
  { href: "/therapist/prep",        icon: "📅", label: "Supervision Prep" },
  { href: "/therapist/skills",      icon: "🧠", label: "Skills Lab"       },
  { href: "/therapist/journal",     icon: "📔", label: "Journal"          },
];

export default function TherapistLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      brandIcon={CURRENT_THERAPIST.initials}
      brandLabel={CURRENT_THERAPIST.name}
      brandSubLabel="Therapist Portal"
      items={NAV}
      badge={
        <div className="rounded-lg bg-brand-tint px-3 py-2">
          <div className="eyebrow text-brand">Supervisor</div>
          <div className="text-xs font-bold text-ink">
            {CURRENT_THERAPIST.supervisor}
          </div>
          <div className="text-[10px] text-ink-muted">
            {CURRENT_THERAPIST.programme}
          </div>
        </div>
      }
      footer={<RoleSwitcher />}
    >
      {children}
    </AppShell>
  );
}
