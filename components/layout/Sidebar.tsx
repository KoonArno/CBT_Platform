"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  brandLabel: string;
  brandSubLabel: string;
  brandIcon: string;
  items: ReadonlyArray<NavItem>;
  footer?: ReactNode;
  badge?: ReactNode;
  onNavigate?: () => void;
}

export function Sidebar({
  brandLabel,
  brandSubLabel,
  brandIcon,
  items,
  footer,
  badge,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col border-r border-rule bg-screen shadow-sidebar lg:w-[230px]">
      <div className="border-b border-rule p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand text-base text-white">
            {brandIcon}
          </div>
          <div className="overflow-hidden">
            <div className="truncate text-[13px] font-extrabold text-ink">
              {brandLabel}
            </div>
            <div className="text-[10px] tracking-wide text-ink-muted">
              {brandSubLabel}
            </div>
          </div>
        </div>
      </div>

      {badge && <div className="px-3 pt-2.5">{badge}</div>}

      <nav className="flex-1 overflow-y-auto pt-2">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "mx-2 my-0.5 flex items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2 text-[13px] transition",
                active
                  ? "border-brand bg-brand-tint font-bold text-brand"
                  : "border-transparent font-medium text-ink-muted hover:bg-canvas",
              )}
            >
              <span className="flex-shrink-0 text-base">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer && (
        <div className="border-t border-rule p-2">{footer}</div>
      )}
    </aside>
  );
}
