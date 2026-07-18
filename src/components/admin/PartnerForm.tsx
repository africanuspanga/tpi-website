"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { partnerSchema, type PartnerFormValues } from "@/lib/validation/admin";
import {
  createPartner,
  updatePartner,
  deletePartner,
} from "@/actions/admin/partners";
import type { Partner } from "@/types/supabase";

export function PartnerForm({ partner }: { partner?: Partner | null }) {
  const router = useRouter();
  const isEdit = Boolean(partner);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema) as Resolver<PartnerFormValues>,
    defaultValues: {
      name: partner?.name || "",
      logo_url: partner?.logo_url || "",
      website_url: partner?.website_url || "",
      partner_type: partner?.partner_type || "",
      description: partner?.description || "",
      sort_order: partner?.sort_order ?? 0,
      is_active: partner?.is_active ?? true,
    },
  });

  async function onSubmit(values: PartnerFormValues) {
    const result = isEdit
      ? await updatePartner(partner!.id, values)
      : await createPartner(values);
    if (result.success) {
      toast.success(isEdit ? "Partner updated." : "Partner created.");
      router.push("/admin/partners");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save partner.");
    }
  }

  async function onDelete() {
    if (!partner || !window.confirm("Delete this partner?")) return;
    const result = await deletePartner(partner.id);
    if (result.success) {
      toast.success("Partner deleted.");
      router.push("/admin/partners");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner_type">
            Partner type (e.g. Development Partner, Government)
          </Label>
          <Input id="partner_type" {...register("partner_type")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" {...register("logo_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" {...register("website_url")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input
            id="sort_order"
            type="number"
            className="w-32"
            {...register("sort_order")}
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <Checkbox
            id="is_active"
            checked={watch("is_active")}
            onCheckedChange={(v) => setValue("is_active", Boolean(v))}
          />
          <Label htmlFor="is_active" className="font-normal">
            Active (visible on website)
          </Label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="bg-navy hover:bg-navy/90">
          {isSubmitting ? "Saving..." : isEdit ? "Update partner" : "Create partner"}
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
