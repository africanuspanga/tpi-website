"use client";

import { useRouter } from "next/navigation";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import dynamic from "next/dynamic";
import { Controller, useForm, type Resolver } from "react-hook-form";
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
import { postSchema, type PostFormValues } from "@/lib/validation/admin";
import { generateSlug } from "@/lib/utils/slugs";
import { createPost, updatePost, deletePost } from "@/actions/admin/posts";
import type { Post } from "@/types/supabase";

// TipTap needs the browser; never render it on the server.
const RichTextEditor = dynamic(
  () =>
    import("@/components/admin/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false }
);

export function PostForm({ post }: { post?: Post | null }) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema) as Resolver<PostFormValues>,
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      post_type: post?.post_type || "news",
      excerpt: post?.excerpt || "",
      body: post?.body || "",
      featured_image_url: post?.featured_image_url || "",
      author_name: post?.author_name || "",
      event_date: post?.event_date ? post.event_date.slice(0, 10) : "",
      location: post?.location || "",
      status: post?.status || "draft",
      is_featured: post?.is_featured || false,
      published_at: post?.published_at ? post.published_at.slice(0, 10) : "",
      seo_title: post?.seo_title || "",
      seo_description: post?.seo_description || "",
    },
  });

  function onTitleBlur() {
    if (!watch("slug") && watch("title")) {
      setValue("slug", generateSlug(watch("title")));
    }
  }

  async function onSubmit(values: PostFormValues) {
    const result = isEdit
      ? await updatePost(post!.id, values)
      : await createPost(values);
    if (result.success) {
      toast.success(isEdit ? "Article updated." : "Article created.");
      router.push("/admin/posts");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save article.");
    }
  }

  async function onDelete() {
    if (!post || !window.confirm("Delete this article?")) return;
    const result = await deletePost(post.id);
    if (result.success) {
      toast.success("Article deleted.");
      router.push("/admin/posts");
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
            value={watch("post_type")}
            onValueChange={(v) =>
              setValue("post_type", v as PostFormValues["post_type"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="insight">Insight</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(v) =>
              setValue("status", v as PostFormValues["status"])
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
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Controller
          control={control}
          name="body"
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Write the article body..."
            />
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MediaUploadField
          id="featured_image_url"
          label="Featured image"
          value={watch("featured_image_url") || ""}
          onChange={(url) =>
            setValue("featured_image_url", url, { shouldDirty: true })
          }
          accept="image/*"
          folder="posts"
        />
        <div className="space-y-2">
          <Label htmlFor="author_name">Author</Label>
          <Input id="author_name" {...register("author_name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_date">Event date (events only)</Label>
          <Input id="event_date" type="date" {...register("event_date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_at">Publish date</Label>
          <Input id="published_at" type="date" {...register("published_at")} />
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
          {isSubmitting ? "Saving..." : isEdit ? "Update article" : "Create article"}
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
