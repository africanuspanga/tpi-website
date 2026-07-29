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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  impactStorySchema,
  type ImpactStoryFormValues,
} from "@/lib/validation/impact";
import { generateSlug } from "@/lib/utils/slugs";
import {
  createImpactStory,
  updateImpactStory,
  deleteImpactStory,
} from "@/actions/admin/impact";
import type { ImpactStory } from "@/types/supabase";

export interface ImpactStoryOption {
  id: string;
  label: string;
}

const NONE_VALUE = "__none__";

export function ImpactStoryForm({
  story,
  projects = [],
  thematicAreas = [],
}: {
  story?: ImpactStory | null;
  projects?: ImpactStoryOption[];
  thematicAreas?: ImpactStoryOption[];
}) {
  const router = useRouter();
  const isEdit = Boolean(story);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ImpactStoryFormValues>({
    resolver: zodResolver(impactStorySchema) as Resolver<ImpactStoryFormValues>,
    defaultValues: {
      title: story?.title || "",
      slug: story?.slug || "",
      excerpt: story?.excerpt || "",
      body: story?.body || "",
      location: story?.location || "",
      featured_image_url: story?.featured_image_url || "",
      project_id: story?.project_id || "",
      thematic_area_id: story?.thematic_area_id || "",
      status: story?.status || "draft",
      is_featured: story?.is_featured || false,
      published_at: story?.published_at ? story.published_at.slice(0, 10) : "",
      seo_title: story?.seo_title || "",
      seo_description: story?.seo_description || "",
    },
  });

  function onTitleBlur() {
    if (!watch("slug") && watch("title")) {
      setValue("slug", generateSlug(watch("title")));
    }
  }

  async function onSubmit(values: ImpactStoryFormValues) {
    const result = isEdit
      ? await updateImpactStory(story!.id, values)
      : await createImpactStory(values);
    if (result.success) {
      toast.success(isEdit ? "Story updated." : "Story created.");
      router.push("/admin/impact");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save story.");
    }
  }

  async function onDelete() {
    if (!story || !window.confirm("Delete this impact story?")) return;
    const result = await deleteImpactStory(story.id);
    if (result.success) {
      toast.success("Story deleted.");
      router.push("/admin/impact");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} onBlur={onTitleBlur} />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
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

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(v) =>
              setValue("status", v as ImpactStoryFormValues["status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_at">Publish date</Label>
          <Input id="published_at" type="date" {...register("published_at")} />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <Checkbox
            id="is_featured"
            checked={watch("is_featured")}
            onCheckedChange={(v) => setValue("is_featured", Boolean(v))}
          />
          <Label htmlFor="is_featured" className="font-normal">
            Featured
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body (HTML supported)</Label>
        <Textarea id="body" rows={12} {...register("body")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featured_image_url">Featured image URL</Label>
          <Input id="featured_image_url" {...register("featured_image_url")} />
        </div>
        <div className="space-y-2">
          <Label>Related project</Label>
          <Select
            value={watch("project_id") || NONE_VALUE}
            onValueChange={(v) =>
              setValue("project_id", !v || v === NONE_VALUE ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>None</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Thematic area</Label>
          <Select
            value={watch("thematic_area_id") || NONE_VALUE}
            onValueChange={(v) =>
              setValue("thematic_area_id", !v || v === NONE_VALUE ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>None</SelectItem>
              {thematicAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="bg-navy hover:bg-navy/90">
          {isSubmitting ? "Saving..." : isEdit ? "Update story" : "Create story"}
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
