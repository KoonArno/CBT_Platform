import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import type { NavItem } from "@/components/layout/Sidebar";

const NAV: ReadonlyArray<NavItem> = [
  { href: "/supervisor/dashboard",  icon: "⊞",  label: "Dashboard"      },
  { href: "/supervisor/therapists", icon: "👥", label: "Therapists"     },
  { href: "/supervisor/session",    icon: "📋", label: "New Session"    },
  { href: "/supervisor/scoring",    icon: "📊", label: "CTS-R Scoring"  },
  { href: "/supervisor/tapescript", icon: "📝", label: "Annotated Tape" },
  { href: "/supervisor/progress",   icon: "📈", label: "Progress"       },
  { href: "/supervisor/reports",    icon: "📄", label: "Reports"        },
  { href: "/supervisor/metalogs",   icon: "🔬", label: "Meta Logs"      },
  { href: "/supervisor/skills",     icon: "🧠", label: "Skills Lab"     },
];

export default function SupervisorLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      brandIcon="🧠"
      brandLabel="CBT Supervisor"
      brandSubLabel="CTS-R Platform"
      items={NAV}
      footer={<RoleSwitcher />}
    >
      {children}
    </AppShell>
  );
}
