"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Newspaper,
  BookOpen,
  Users,
  Handshake,
  ImageIcon,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "News & Insights", href: "/admin/posts", icon: Newspaper },
  { label: "Resources", href: "/admin/resources", icon: BookOpen },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Partners", href: "/admin/partners", icon: Handshake },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Users", href: "/admin/users", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r bg-soft-bg lg:flex flex-col">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-navy text-white"
                  : "text-body hover:bg-white hover:text-navy"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
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
