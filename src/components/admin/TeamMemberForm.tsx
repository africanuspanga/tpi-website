"use client";

import { useRouter } from "next/navigation";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  teamMemberSchema,
  type TeamMemberFormValues,
} from "@/lib/validation/admin";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/actions/admin/team";
import type { TeamMember } from "@/types/supabase";

export function TeamMemberForm({ member }: { member?: TeamMember | null }) {
  const router = useRouter();
  const isEdit = Boolean(member);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema) as Resolver<TeamMemberFormValues>,
    defaultValues: {
      full_name: member?.full_name || "",
      position: member?.position || "",
      biography: member?.biography || "",
      photo_url: member?.photo_url || "",
      email: member?.email || "",
      linkedin_url: member?.linkedin_url || "",
      sort_order: member?.sort_order ?? 0,
      is_active: member?.is_active ?? true,
    },
  });

  async function onSubmit(values: TeamMemberFormValues) {
    const result = isEdit
      ? await updateTeamMember(member!.id, values)
      : await createTeamMember(values);
    if (result.success) {
      toast.success(isEdit ? "Team member updated." : "Team member added.");
      router.push("/admin/team");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save team member.");
    }
  }

  async function onDelete() {
    if (!member || !window.confirm("Remove this team member?")) return;
    const result = await deleteTeamMember(member.id);
    if (result.success) {
      toast.success("Team member removed.");
      router.push("/admin/team");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" {...register("full_name")} />
          {errors.full_name && (
            <p className="text-sm text-destructive">{errors.full_name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" {...register("position")} />
          {errors.position && (
            <p className="text-sm text-destructive">{errors.position.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="biography">Biography</Label>
        <Textarea id="biography" rows={5} {...register("biography")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MediaUploadField
          id="photo_url"
          label="Photo"
          value={watch("photo_url") || ""}
          onChange={(url) =>
            setValue("photo_url", url, { shouldDirty: true })
          }
          accept="image/*"
          folder="team"
        />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input id="linkedin_url" {...register("linkedin_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input id="sort_order" type="number" {...register("sort_order")} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is_active"
          checked={watch("is_active")}
          onCheckedChange={(v) => setValue("is_active", Boolean(v))}
        />
        <Label htmlFor="is_active" className="font-normal">
          Active (visible on website)
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="bg-navy hover:bg-navy/90">
          {isSubmitting ? "Saving..." : isEdit ? "Update member" : "Add member"}
        </Button>
        {isEdit && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
