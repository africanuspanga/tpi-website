import { getPartners } from "@/actions/admin/partners";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataView } from "@/components/admin/AdminDataView";

export const metadata = { title: "Partners | TPi Admin" };

export default async function AdminPartnersPage() {
  const rows = await getPartners();
  return (
    <div>
      <AdminPageHeader
        title="Partners"
        description="Manage partner organizations shown across the website."
        newHref="/admin/partners/new"
        newLabel="New partner"
      />
      <AdminDataView
        rows={rows}
        entity="partners"
        basePath="/admin/partners"
        columns={[
          { key: "logo_url", header: "Logo", type: "image" },
          { key: "name", header: "Name" },
          { key: "partner_type", header: "Type" },
          { key: "sort_order", header: "Order" },
          { key: "is_active", header: "Active", type: "boolean" },
        ]}
      />
    </div>
  );
}
