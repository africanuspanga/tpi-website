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
import { resourceSchema, type ResourceFormValues } from "@/lib/validation/admin";
import { generateSlug } from "@/lib/utils/slugs";
import {
  createResource,
  updateResource,
  deleteResource,
} from "@/actions/admin/resources";
import type { Resource } from "@/types/supabase";

export function ResourceForm({ resource }: { resource?: Resource | null }) {
  const router = useRouter();
  const isEdit = Boolean(resource);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema) as Resolver<ResourceFormValues>,
    defaultValues: {
      title: resource?.title || "",
      slug: resource?.slug || "",
      resource_type: resource?.resource_type || "report",
      description: resource?.description || "",
      file_url: resource?.file_url || "",
      external_url: resource?.external_url || "",
      cover_image_url: resource?.cover_image_url || "",
      publication_year: resource?.publication_year || undefined,
      author: resource?.author || "",
      language: resource?.language || "English",
      status: resource?.status || "draft",
      is_featured: resource?.is_featured || false,
      published_at: resource?.published_at ? resource.published_at.slice(0, 10) : "",
    },
  });

  function onTitleBlur() {
    if (!watch("slug") && watch("title")) {
      setValue("slug", generateSlug(watch("title")));
    }
  }

  async function onSubmit(values: ResourceFormValues) {
    if (!values.file_url && !values.external_url) {
      toast.error("Provide either a file URL or an external URL.");
      return;
    }
    const result = isEdit
      ? await updateResource(resource!.id, values)
      : await createResource(values);
    if (result.success) {
      toast.success(isEdit ? "Resource updated." : "Resource created.");
      router.push("/admin/resources");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save resource.");
    }
  }

  async function onDelete() {
    if (!resource || !window.confirm("Delete this resource?")) return;
    const result = await deleteResource(resource.id);
    if (result.success) {
      toast.success("Resource deleted.");
      router.push("/admin/resources");
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
          <Label>Type</Label>
          <Select
            value={watch("resource_type")}
            onValueChange={(v) =>
              setValue("resource_type", v as ResourceFormValues["resource_type"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="report">Report</SelectItem>
              <SelectItem value="policy_brief">Policy Brief</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="toolkit">Toolkit</SelectItem>
              <SelectItem value="case_study">Case Study</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(v) =>
              setValue("status", v as ResourceFormValues["status"])
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
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="file_url">File URL (uploaded document)</Label>
          <Input id="file_url" {...register("file_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="external_url">External URL</Label>
          <Input id="external_url" {...register("external_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">Cover image URL</Label>
          <Input id="cover_image_url" {...register("cover_image_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publication_year">Publication year</Label>
          <Input
            id="publication_year"
            type="number"
            {...register("publication_year")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input id="language" {...register("language")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_at">Publish date</Label>
          <Input id="published_at" type="date" {...register("published_at")} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="bg-navy hover:bg-navy/90">
          {isSubmitting ? "Saving..." : isEdit ? "Update resource" : "Create resource"}
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
