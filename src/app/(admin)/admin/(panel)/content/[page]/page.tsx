import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentBlocks } from "@/actions/admin/content";
import { findPage } from "@/lib/content/schema";
import { ContentBlockEditor } from "@/components/admin/ContentBlockEditor";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function ContentPageEditor({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageKey } = await params;
  const page = findPage(pageKey);
  if (!page) notFound();

  const stored = await getContentBlocks(pageKey);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          All pages
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="heading-display text-2xl text-navy">{page.label}</h1>
            <p className="text-sm text-muted-foreground">
              Expand a section to edit it. Changes go live as soon as you save.
            </p>
          </div>
          <a
            href={page.path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            View page
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {page.blocks.map((block) => {
          const saved = stored[block.key];
          return (
            <ContentBlockEditor
              key={block.key}
              pageKey={page.key}
              block={block}
              // Show defaults for anything never edited, so the editor always
              // starts from what the visitor currently sees.
              initialValues={{ ...block.defaults, ...(saved ?? {}) }}
              isCustomised={Boolean(saved)}
            />
          );
        })}
      </div>
    </div>
  );
}
