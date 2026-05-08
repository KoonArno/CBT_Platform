"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, type NavItem } from "@/components/layout/Sidebar";

interface AppShellProps {
  brandLabel: string;
  brandSubLabel: string;
  brandIcon: string;
  items: ReadonlyArray<NavItem>;
  badge?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  brandLabel,
  brandSubLabel,
  brandIcon,
  items,
  badge,
  footer,
  children,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Mobile/tablet top bar (visible <lg) */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-rule bg-screen/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule bg-canvas text-lg text-ink"
        >
          ☰
        </button>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-sm text-white">
            {brandIcon}
          </div>
          <div className="overflow-hidden">
            <div className="truncate text-[13px] font-extrabold text-ink">
              {brandLabel}
            </div>
            <div className="truncate text-[10px] text-ink-muted">
              {brandSubLabel}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar (lg+) */}
        <div className="sticky top-0 hidden h-screen lg:block">
          <Sidebar
            brandLabel={brandLabel}
            brandSubLabel={brandSubLabel}
            brandIcon={brandIcon}
            items={items}
            badge={badge}
            footer={footer}
          />
        </div>

        {/* Mobile drawer (<lg) */}
        {drawerOpen && (
          <>
            <div
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar
                brandLabel={brandLabel}
                brandSubLabel={brandSubLabel}
                brandIcon={brandIcon}
                items={items}
                badge={badge}
                footer={footer}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </>
        )}

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
