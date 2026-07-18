import { getPages } from "@/actions/admin/pages";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataView } from "@/components/admin/AdminDataView";

export const metadata = { title: "Pages | TPi Admin" };

export default async function AdminPagesPage() {
  const rows = await getPages();
  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Manage standard content pages and homepage sections."
        newHref="/admin/pages/new"
        newLabel="New page"
      />
      <AdminDataView
        rows={rows}
        entity="pages"
        basePath="/admin/pages"
        columns={[
          { key: "title", header: "Title" },
          { key: "slug", header: "Slug" },
          { key: "status", header: "Status", type: "status" },
          { key: "updated_at", header: "Updated", type: "date" },
        ]}
      />
    </div>
  );
}
