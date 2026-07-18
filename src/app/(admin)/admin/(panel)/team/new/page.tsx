import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata = { title: "New Team Member | TPi Admin" };

export default function NewTeamMemberPage() {
  return (
    <AdminFormShell title="New team member" backHref="/admin/team">
      <TeamMemberForm />
    </AdminFormShell>
  );
}
