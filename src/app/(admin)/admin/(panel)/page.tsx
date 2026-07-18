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
    { label: "Published Pages", value: stats.publishedPages, icon: FileText, href: "/admin/pages" },
    { label: "Draft Pages", value: stats.draftPages, icon: FileText, href: "/admin/pages" },
    { label: "Active Projects", value: stats.activeProjects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Completed Projects", value: stats.completedProjects, icon: FolderKanban, href: "/admin/projects" },
    { label: "News & Insights", value: stats.posts, icon: Newspaper, href: "/admin/posts" },
    { label: "Resources", value: stats.resources, icon: BookOpen, href: "/admin/resources" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, href: "/admin/messages" },
    { label: "Subscribers", value: stats.subscribers, icon: Users, href: "/admin/settings" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-muted-text">Overview of your website content.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/pages/new">New Page</Link>
          </Button>
          <Button asChild className="bg-navy hover:bg-navy/90">
            <Link href="/admin/projects/new">New Project</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card className="hover:border-urban-blue transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-text">
                    {card.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-text" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-navy">{card.value}</p>
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
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/posts/new">Write a news article</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/resources/new">Upload a resource</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/partners/new">Add a partner</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/team/new">Add a team member</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-text">
            <p>1. Connect your Supabase project using the environment variables.</p>
            <p>2. Create the first super admin via the SQL snippet in the README.</p>
            <p>3. Upload media to the media library before using images in content.</p>
            <p>4. Edit the homepage sections from Pages → Home.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
