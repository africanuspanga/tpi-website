import Link from "next/link";
import { getContentOverview } from "@/actions/admin/content";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata = { title: "Website Content" };

export default async function ContentIndexPage() {
  const pages = await getContentOverview();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Content"
        description="Edit the text, photos and links that appear on every page of the public website."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.key} className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="flex-1">
              <CardTitle className="flex items-center gap-2 text-base">
                {page.label}
                {page.isCustomised ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                    Edited
                  </span>
                ) : null}
              </CardTitle>
              <CardDescription>
                {page.description ||
                  `${page.blockCount} editable ${
                    page.blockCount === 1 ? "section" : "sections"
                  }`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3 border-t pt-4">
              <Link
                href={`/admin/content/${page.key}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-urban-blue"
              >
                Edit content
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={page.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy"
              >
                View
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
