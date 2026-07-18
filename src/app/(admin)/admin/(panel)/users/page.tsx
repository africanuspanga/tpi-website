import { isSuperAdmin } from "@/lib/utils/roles";
import { getAdminUsers } from "@/actions/admin/users";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsersManager } from "@/components/admin/UsersManager";

export const metadata = { title: "Users | TPi Admin" };

export default async function AdminUsersPage() {
  const superAdmin = await isSuperAdmin();

  if (!superAdmin) {
    return (
      <div>
        <AdminPageHeader title="Users" />
        <div className="rounded-lg border border-dashed bg-white py-16 text-center">
          <p className="text-muted-text">
            Only super administrators can manage users.
          </p>
        </div>
      </div>
    );
  }

  const users = await getAdminUsers();

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage administrator roles and access."
      />
      <UsersManager users={users} />
    </div>
  );
}
