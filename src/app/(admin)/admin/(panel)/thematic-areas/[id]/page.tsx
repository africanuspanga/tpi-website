import { notFound } from "next/navigation";
import { getThematicArea } from "@/actions/admin/thematic";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ThematicAreaForm } from "@/components/admin/ThematicAreaForm";
import { FocusItemsManager } from "@/components/admin/FocusItemsManager";

export const metadata = { title: "Edit Thematic Area | TPi Admin" };

export default async function EditThematicAreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getThematicArea(id);
  if (!result) notFound();
  const { area, focusItems } = result;

  return (
    <>
      <AdminFormShell title={`Edit: ${area.name}`} backHref="/admin/thematic-areas">
        <ThematicAreaForm area={area} />
      </AdminFormShell>
      <div className="mx-auto mt-6 max-w-4xl">
        <div className="rounded-lg border bg-white p-6">
          <FocusItemsManager areaId={area.id} items={focusItems} />
        </div>
      </div>
    </>
  );
}
