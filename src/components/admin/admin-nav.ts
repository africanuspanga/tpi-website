import {
  LayoutDashboard,
  FileText,
  Layers,
  FolderKanban,
  Newspaper,
  BookOpen,
  TrendingUp,
  Users,
  Handshake,
  ImageIcon,
  MessageSquare,
  Mail,
  Settings,
  Shield,
} from "lucide-react";

export const adminNavGroups = [
  {
    label: "Content",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Thematic Areas", href: "/admin/thematic-areas", icon: Layers },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "News & Insights", href: "/admin/posts", icon: Newspaper },
      { label: "Resources", href: "/admin/resources", icon: BookOpen },
      { label: "Impact", href: "/admin/impact", icon: TrendingUp },
    ],
  },
  {
    label: "Organisation",
    items: [
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Users", href: "/admin/users", icon: Shield },
    ],
  },
] as const;
