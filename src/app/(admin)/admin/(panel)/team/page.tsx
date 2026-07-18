import { getTeamMembers } from "@/actions/admin/team";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataView } from "@/components/admin/AdminDataView";

export const metadata = { title: "Team | TPi Admin" };

export default async function AdminTeamPage() {
  const rows = await getTeamMembers();
  return (
    <div>
      <AdminPageHeader
        title="Team"
        description="Manage governance and team members shown on the About page."
        newHref="/admin/team/new"
        newLabel="New member"
      />
      <AdminDataView
        rows={rows}
        entity="team"
        basePath="/admin/team"
        columns={[
          { key: "photo_url", header: "Photo", type: "image" },
          { key: "full_name", header: "Name" },
          { key: "position", header: "Position" },
          { key: "sort_order", header: "Order" },
          { key: "is_active", header: "Active", type: "boolean" },
        ]}
      />
    </div>
  );
}
