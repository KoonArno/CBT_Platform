"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  to: string;
  label: string;
  sub: string;
  icon: typeof Home;
  exact?: boolean;
}

const ITEMS: ReadonlyArray<NavItem> = [
  { to: "/dashboard", label: "หน้าหลัก", sub: "Home", icon: Home, exact: true },
  { to: "/sessions", label: "Sessions", sub: "เซสชั่น", icon: FolderKanban },
  { to: "/report", label: "รายงาน", sub: "Reports", icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.name ?? "Supervisor";
  const displayRole = user?.role ?? "Supervisor Mode";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    toast("ออกจากระบบแล้ว");
    router.replace("/login");
  };

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


      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (desktop sticky, mobile drawer) */}
      <aside
        className={cn(
          "shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-200",
          // Desktop: sticky to viewport so footer stays visible on long pages
          "hidden md:sticky md:top-0 md:flex md:h-screen",
          collapsed ? "md:w-16 md:overflow-hidden" : "md:w-60",
          // Mobile drawer override
          mobileOpen &&
            "fixed inset-y-0 left-0 z-50 !flex h-screen w-64 max-w-[80vw] !overflow-visible md:relative",
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-sidebar-border transition-all",
            collapsed
              ? "md:justify-center md:px-3 md:py-4"
              : "gap-2 px-5 py-5",
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
              collapsed && "md:hidden",
            )}
          >
            <Stethoscope className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "min-w-0 flex-1 leading-tight",
              collapsed && "md:hidden",
            )}
          >
            <div className="text-sm font-semibold text-sidebar-foreground">
              CTS-R Review
            </div>
            <div className="text-[11px] text-muted-foreground">Assistant</div>
          </div>
          <button
            onClick={() =>
              mobileOpen ? setMobileOpen(false) : setCollapsed((p) => !p)
            }
            aria-label="Toggle sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav
          className={cn(
            "flex-1 space-y-1 overflow-y-auto py-4",
            collapsed ? "md:px-2" : "px-3",
          )}
        >
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
                  collapsed && "md:justify-center md:px-2",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div
                  className={cn(
                    "flex flex-col leading-tight",
                    collapsed && "md:hidden",
                  )}
                >
                  <span>{it.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {it.sub}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "border-t border-sidebar-border p-4",
            collapsed && "md:hidden",
          )}
        >
          <div className="rounded-md bg-accent/60 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initial}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-xs font-medium text-accent-foreground">
                  {displayName}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {displayRole}
                </div>
              </div>
              <Link
                href="/settings"
                aria-label="Settings"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-background"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
