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
  thematicAreaSchema,
  type ThematicAreaFormValues,
  type ThematicArea,
} from "@/lib/validation/thematic";
import { generateSlug } from "@/lib/utils/slugs";
import {
  createThematicArea,
  updateThematicArea,
  deleteThematicArea,
} from "@/actions/admin/thematic";

export function ThematicAreaForm({ area }: { area?: ThematicArea | null }) {
  const router = useRouter();
  const isEdit = Boolean(area);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ThematicAreaFormValues>({
    resolver: zodResolver(thematicAreaSchema) as Resolver<ThematicAreaFormValues>,
    defaultValues: {
      name: area?.name || "",
      slug: area?.slug || "",
      number_label: area?.number_label || "",
      short_description: area?.short_description || "",
      description: area?.description || "",
      icon_name: area?.icon_name || "",
      accent_color: area?.accent_color || "",
      hero_image_url: area?.hero_image_url || "",
      sort_order: area?.sort_order ?? 0,
      is_active: area?.is_active ?? true,
      seo_title: area?.seo_title || "",
      seo_description: area?.seo_description || "",
    },
  });

  const accentColor = watch("accent_color");

  function onNameBlur() {
    if (!watch("slug") && watch("name")) {
      setValue("slug", generateSlug(watch("name")));
    }
  }

  async function onSubmit(values: ThematicAreaFormValues) {
    const result = isEdit
      ? await updateThematicArea(area!.id, values)
      : await createThematicArea(values);
    if (result.success) {
      toast.success(isEdit ? "Thematic area updated." : "Thematic area created.");
      router.push("/admin/thematic-areas");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save thematic area.");
    }
  }

  async function onDelete() {
    if (!area || !window.confirm("Delete this thematic area and its focus items?")) return;
    const result = await deleteThematicArea(area.id);
    if (result.success) {
      toast.success("Thematic area deleted.");
      router.push("/admin/thematic-areas");
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
          <Input id="name" {...register("name")} onBlur={onNameBlur} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Short description</Label>
        <Textarea id="short_description" rows={2} {...register("short_description")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (HTML supported)</Label>
        <Textarea id="description" rows={8} {...register("description")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number_label">Number label</Label>
          <Input id="number_label" placeholder="e.g. 01" {...register("number_label")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon_name">Icon name</Label>
          <Input id="icon_name" {...register("icon_name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accent_color">Accent colour</Label>
          <div className="flex items-center gap-2">
            <Input
              id="accent_color"
              placeholder="urban-blue, poverty-green, climate-gold or #hex"
              {...register("accent_color")}
            />
            {accentColor && accentColor.startsWith("#") && (
              <span
                className="h-9 w-9 shrink-0 rounded-md border"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </div>
        </div>
        <MediaUploadField
          id="hero_image_url"
          label="Hero image"
          value={watch("hero_image_url") || ""}
          onChange={(url) =>
            setValue("hero_image_url", url, { shouldDirty: true })
          }
          accept="image/*"
          folder="thematic"
        />
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input id="sort_order" type="number" {...register("sort_order")} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seo_title">SEO title</Label>
          <Input id="seo_title" {...register("seo_title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_description">SEO description</Label>
          <Textarea id="seo_description" rows={2} {...register("seo_description")} />
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
          {isSubmitting ? "Saving..." : isEdit ? "Update area" : "Create area"}
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
