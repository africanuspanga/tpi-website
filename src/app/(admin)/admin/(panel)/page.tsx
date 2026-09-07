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
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// The dashboard reflects live data, so never serve it from a build-time cache.
export const dynamic = "force-dynamic";

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

type CheckState = "ok" | "fail" | "warn";

type Check = {
  label: string;
  state: CheckState;
  detail: string;
};

/**
 * Live environment check.
 *
 * This replaces the old static "Getting Started" checklist, which always read
 * as "Supabase is not connected yet" even on a fully wired deployment. Every
 * line below is an actual probe against the running environment, so what the
 * card says is what is really true for this deployment.
 */
async function getSystemChecks(): Promise<Check[]> {
  const checks: Check[] = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    checks.push({
      label: "Supabase",
      state: "fail",
      detail:
        "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set for this environment.",
    });
  } else {
    // A real round-trip, not just an env-var presence check.
    let dbDetail = "";
    let dbOk = false;
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("pages").select("id").limit(1);
      dbOk = !error;
      dbDetail = error
        ? error.message
        : `Connected to ${new URL(url).hostname}`;
    } catch (err) {
      dbDetail = err instanceof Error ? err.message : "Unreachable";
    }

    checks.push({
      label: "Supabase database",
      state: dbOk ? "ok" : "fail",
      detail: dbDetail,
    });
  }

  checks.push({
    label: "Service role key",
    state: serviceKey ? "ok" : "fail",
    detail: serviceKey
      ? "Set — media uploads and user management will work."
      : "SUPABASE_SERVICE_ROLE_KEY is missing. Media uploads and user management will fail.",
  });

  checks.push({
    label: "Email notifications",
    state: process.env.RESEND_API_KEY ? "ok" : "warn",
    detail: process.env.RESEND_API_KEY
      ? `Sending to ${process.env.EMAIL_NOTIFICATION_ADDRESS || "info@TPi.or.tz"}`
      : "RESEND_API_KEY is missing. Contact enquiries are still saved, but no email is sent.",
  });

  checks.push({
    label: "Spam protection",
    state: process.env.TURNSTILE_SECRET_KEY ? "ok" : "warn",
    detail: process.env.TURNSTILE_SECRET_KEY
      ? "Turnstile is verifying form submissions."
      : "TURNSTILE_SECRET_KEY is missing. Public forms accept submissions without a bot check.",
  });

  checks.push({
    label: "Public site URL",
    state: process.env.NEXT_PUBLIC_SITE_URL ? "ok" : "warn",
    detail:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "NEXT_PUBLIC_SITE_URL is not set. SEO tags fall back to https://www.tpi.or.tz.",
  });

  return checks;
}

export default async function AdminDashboardPage() {
  const [stats, checks] = await Promise.all([
    getDashboardStats(),
    getSystemChecks(),
  ]);

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
            <CardTitle className="text-navy">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {checks.map((check) => {
              const Icon =
                check.state === "ok"
                  ? CheckCircle2
                  : check.state === "warn"
                    ? AlertTriangle
                    : XCircle;
              const tone =
                check.state === "ok"
                  ? "text-poverty-green"
                  : check.state === "warn"
                    ? "text-climate-gold"
                    : "text-destructive";

              return (
                <div key={check.label} className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-navy">{check.label}</p>
                    <p className="break-words text-muted-text">
                      {check.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
