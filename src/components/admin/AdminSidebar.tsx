"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups } from "./admin-nav";
import { cn } from "@/lib/utils";

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto p-4">
      {adminNavGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-text">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-navy text-white shadow-sm"
                      : "text-body hover:bg-white hover:text-navy"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-soft-bg lg:flex">
      <AdminNavLinks />
      <div className="border-t p-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-muted-text hover:text-navy"
        >
          View public website →
        </Link>
      </div>
    </aside>
  );
}
