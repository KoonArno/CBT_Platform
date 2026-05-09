"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  FileText,
  Settings,
  Stethoscope,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  sub: string;
  icon: typeof Home;
  exact?: boolean;
}

const ITEMS: ReadonlyArray<NavItem> = [
  { to: "/", label: "หน้าหลัก", sub: "Home", icon: Home, exact: true },
  { to: "/sessions", label: "Sessions", sub: "เซสชั่น", icon: FolderKanban },
  { to: "/report", label: "รายงาน", sub: "Reports", icon: FileText },
  { to: "/settings", label: "ตั้งค่า", sub: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card hover:bg-accent"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">CTS-R Review</div>
            <div className="text-[10px] text-muted-foreground">Assistant</div>
          </div>
        </div>
      </div>

      {/* Desktop collapse-expand button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="fixed left-3 top-3 z-40 hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-background shadow-sm hover:bg-accent md:flex"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (desktop fixed, mobile drawer) */}
      <aside
        className={cn(
          "shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-200",
          // Desktop
          "hidden md:flex",
          collapsed ? "md:w-0 md:overflow-hidden md:border-r-0" : "md:w-60",
          // Mobile drawer override
          mobileOpen &&
            "fixed inset-y-0 left-0 z-50 !flex w-64 max-w-[80vw] !overflow-visible md:relative",
        )}
      >
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-sm font-semibold text-sidebar-foreground">
              CTS-R Review
            </div>
            <div className="text-[11px] text-muted-foreground">Assistant</div>
          </div>
          <button
            onClick={() =>
              mobileOpen ? setMobileOpen(false) : setCollapsed(true)
            }
            aria-label="Collapse sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {ITEMS.map((it) => {
            const active = isActive(it);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                href={it.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="flex flex-col leading-tight">
                  <span>{it.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {it.sub}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-md bg-accent/60 p-3">
            <div className="text-xs font-medium text-accent-foreground">
              Supervisor Mode
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Dr. Wattana · CBT Lab
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
