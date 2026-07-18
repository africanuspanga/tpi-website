"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateAdminUser, deleteAdminUser } from "@/actions/admin/users";
import type { AdminUserRow } from "@/actions/admin/users";

const ROLES = ["super_admin", "admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];

export function UsersManager({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<Role>("viewer");

  function save(user_id: string, role: Role, is_active: boolean) {
    startTransition(async () => {
      const result = await updateAdminUser({ user_id, role, is_active });
      if (result.success) {
        toast.success("Saved.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to save.");
      }
    });
  }

  function remove(user_id: string) {
    if (!window.confirm("Revoke this user's admin access?")) return;
    startTransition(async () => {
      const result = await deleteAdminUser(user_id);
      if (result.success) {
        toast.success("Access revoked.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to revoke.");
      }
    });
  }

  function addUser() {
    const id = newUserId.trim();
    if (!id) {
      toast.error("Paste the Supabase Auth user ID (UUID).");
      return;
    }
    startTransition(async () => {
      const result = await updateAdminUser({
        user_id: id,
        role: newRole,
        is_active: true,
      });
      if (result.success) {
        toast.success("Admin user added.");
        setNewUserId("");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to add user.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold text-navy">Grant admin access</h2>
        <p className="mt-1 text-sm text-muted-text">
          Create the user in Supabase Authentication first, then paste their user
          ID here to assign a role. Public registration is disabled by design.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 space-y-2" style={{ minWidth: "16rem" }}>
            <Label htmlFor="new-user-id">Auth user ID (UUID)</Label>
            <Input
              id="new-user-id"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={addUser}
            disabled={isPending}
            className="bg-navy hover:bg-navy/90"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-text">
                  No admin users yet.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <p className="font-medium text-body">
                      {user.full_name || "—"}
                    </p>
                    <p className="text-xs text-muted-text">
                      {user.email || user.user_id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(v) =>
                        save(user.user_id, v as Role, user.is_active)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() =>
                        save(user.user_id, user.role as Role, !user.is_active)
                      }
                    >
                      {user.is_active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          Inactive
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(user.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
