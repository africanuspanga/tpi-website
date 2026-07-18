"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { pageSchema, type PageFormValues } from "@/lib/validation/admin";
import { generateSlug } from "@/lib/utils/slugs";
import { createPage, updatePage, deletePage } from "@/actions/admin/pages";
import { toast } from "sonner";
import type { Page } from "@/types/supabase";

interface PageFormProps {
  page?: Page | null;
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const isEdit = Boolean(page);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema) as Resolver<PageFormValues>,
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      excerpt: page?.excerpt || "",
      content: page?.content || "",
      hero_image_url: page?.hero_image_url || "",
      status: page?.status || "draft",
      is_featured: page?.is_featured || false,
      seo_title: page?.seo_title || "",
      seo_description: page?.seo_description || "",
      og_image_url: page?.og_image_url || "",
      published_at: page?.published_at
        ? new Date(page.published_at).toISOString().slice(0, 16)
        : "",
    },
  });

  const title = watch("title");
  const status = watch("status");

  function onTitleBlur() {
    const currentSlug = watch("slug");
    if (!currentSlug && title) {
      setValue("slug", generateSlug(title));
    }
  }

  async function onSubmit(values: PageFormValues) {
    const result = isEdit
      ? await updatePage(page!.id, values)
      : await createPage(values);

    if (result.success) {
      toast.success(isEdit ? "Page updated." : "Page created.");
      router.push("/admin/pages");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save page.");
    }
  }

  async function onDelete() {
    if (!page || !window.confirm("Are you sure you want to delete this page?")) return;
    const result = await deletePage(page.id);
    if (result.success) {
      toast.success("Page deleted.");
      router.push("/admin/pages");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete page.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} onBlur={onTitleBlur} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register("excerpt")} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" {...register("content")} rows={10} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hero_image_url">Hero Image URL</Label>
          <Input id="hero_image_url" {...register("hero_image_url")} />
          {errors.hero_image_url && (
            <p className="text-sm text-destructive">{errors.hero_image_url.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="og_image_url">OG Image URL</Label>
          <Input id="og_image_url" {...register("og_image_url")} />
          {errors.og_image_url && (
            <p className="text-sm text-destructive">{errors.og_image_url.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setValue("status", v as PageFormValues["status"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="published_at">Published At</Label>
          <Input id="published_at" type="datetime-local" {...register("published_at")} />
        </div>

        <div className="flex items-end gap-2 pb-2">
          <Checkbox
            id="is_featured"
            checked={watch("is_featured")}
            onCheckedChange={(v) => setValue("is_featured", Boolean(v))}
          />
          <Label htmlFor="is_featured" className="font-normal">
            Featured page
          </Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seo_title">SEO Title</Label>
          <Input id="seo_title" {...register("seo_title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_description">SEO Description</Label>
          <Textarea id="seo_description" {...register("seo_description")} rows={3} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="bg-navy hover:bg-navy/90">
          {isSubmitting ? "Saving..." : isEdit ? "Update Page" : "Create Page"}
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
