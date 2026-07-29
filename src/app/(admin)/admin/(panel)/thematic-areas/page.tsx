import { getAdminThematicAreas } from "@/actions/admin/thematic";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ThematicAreasTable } from "@/components/admin/ThematicAreasTable";

export const metadata = { title: "Thematic Areas | TPi Admin" };

export default async function AdminThematicAreasPage() {
  const rows = await getAdminThematicAreas();
  return (
    <div>
      <AdminPageHeader
        title="Thematic Areas"
        description="Manage the thematic areas and focus items shown on the What We Do pages."
        newHref="/admin/thematic-areas/new"
        newLabel="New area"
      />
      <ThematicAreasTable rows={rows} />
    </div>
  );
}
