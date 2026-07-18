import { getPosts } from "@/actions/admin/posts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataView } from "@/components/admin/AdminDataView";

export const metadata = { title: "News & Insights | TPi Admin" };

export default async function AdminPostsPage() {
  const rows = await getPosts();
  return (
    <div>
      <AdminPageHeader
        title="News & Insights"
        description="Publish news, insights, events and announcements."
        newHref="/admin/posts/new"
        newLabel="New article"
      />
      <AdminDataView
        rows={rows}
        entity="posts"
        basePath="/admin/posts"
        viewBase="/news"
        columns={[
          { key: "title", header: "Title" },
          { key: "post_type", header: "Type" },
          { key: "status", header: "Status", type: "status" },
          { key: "is_featured", header: "Featured", type: "featured" },
          { key: "updated_at", header: "Updated", type: "date" },
        ]}
      />
    </div>
  );
}
