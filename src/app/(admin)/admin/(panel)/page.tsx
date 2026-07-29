import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  FolderKanban,
  Newspaper,
  BookOpen,
  MessageSquare,
  Users,
  ArrowRight,
  Plus,
} from "lucide-react";

async function getDashboardStats() {
  const supabase = await createClient();

  const [
    pages,
    projects,
    posts,
    resources,
    messages,
    subscribers,
  ] = await Promise.all([
    supabase.from("pages").select("id, status", { count: "exact" }),
    supabase.from("projects").select("id, project_status", { count: "exact" }),
    supabase.from("posts").select("id", { count: "exact" }),
    supabase.from("resources").select("id", { count: "exact" }),
    supabase.from("contact_messages").select("id, status", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
  ]);

  return {
    publishedPages: pages.data?.filter((p) => p.status === "published").length || 0,
    draftPages: pages.data?.filter((p) => p.status === "draft").length || 0,
    activeProjects:
      projects.data?.filter((p) => p.project_status === "active").length || 0,
    completedProjects:
      projects.data?.filter((p) => p.project_status === "completed").length || 0,
    posts: posts.count || 0,
    resources: resources.count || 0,
    unreadMessages:
      messages.data?.filter((m) => m.status === "new").length || 0,
    subscribers: subscribers.count || 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Published Pages", value: stats.publishedPages, icon: FileText, href: "/admin/pages", tint: "bg-urban-blue/10 text-urban-blue" },
    { label: "Draft Pages", value: stats.draftPages, icon: FileText, href: "/admin/pages", tint: "bg-navy/5 text-navy" },
    { label: "Active Projects", value: stats.activeProjects, icon: FolderKanban, href: "/admin/projects", tint: "bg-poverty-green/10 text-poverty-green" },
    { label: "Completed Projects", value: stats.completedProjects, icon: FolderKanban, href: "/admin/projects", tint: "bg-bright-blue/10 text-bright-blue" },
    { label: "News & Insights", value: stats.posts, icon: Newspaper, href: "/admin/posts", tint: "bg-climate-gold/10 text-climate-gold" },
    { label: "Resources", value: stats.resources, icon: BookOpen, href: "/admin/resources", tint: "bg-urban-blue/10 text-urban-blue" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, href: "/admin/messages", tint: "bg-gold/15 text-climate-gold" },
    { label: "Subscribers", value: stats.subscribers, icon: Users, href: "/admin/subscribers", tint: "bg-poverty-green/10 text-poverty-green" },
  ];

  const quickCreate = [
    { label: "Write a news article", href: "/admin/posts/new" },
    { label: "Add a project", href: "/admin/projects/new" },
    { label: "Publish an impact story", href: "/admin/impact/new" },
    { label: "Upload a resource", href: "/admin/resources/new" },
    { label: "Add a team member", href: "/admin/team/new" },
    { label: "Add a partner", href: "/admin/partners/new" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-muted-text">Overview of your website content.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/pages/new">New Page</Link>
          </Button>
          <Button asChild className="bg-navy hover:bg-navy/90">
            <Link href="/admin/posts/new">
              <Plus className="mr-1 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-1 group-hover:ring-urban-blue/30">
                <CardContent className="flex items-center gap-4 p-5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.tint}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold leading-tight text-navy">
                      {card.value}
                    </p>
                    <p className="truncate text-sm text-muted-text">
                      {card.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Quick Create</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickCreate.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="outline"
                className="justify-between"
              >
                <Link href={item.href}>
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-muted-text" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-text">
            <p>1. Connect your Supabase project using the environment variables.</p>
            <p>
              2. Run the migrations in <code>supabase/migrations</code>, then
              create the first admin
              with <code>supabase/scripts/make-first-admin.sql</code>.
            </p>
            <p>3. Upload media to the media library before using images in content.</p>
            <p>
              4. Manage programmes under Thematic Areas, and publish stories and
              metrics under Impact.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
