"use client";

import { useRouter } from "next/navigation";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import dynamic from "next/dynamic";
import { Controller, useForm, type Resolver } from "react-hook-form";
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
import { projectSchema, type ProjectFormValues } from "@/lib/validation/admin";
import { generateSlug } from "@/lib/utils/slugs";
import { createProject, updateProject, deleteProject } from "@/actions/admin/projects";
import { toast } from "sonner";
import type { Project, ThematicArea } from "@/types/supabase";

// TipTap needs the browser; never render it on the server.
const RichTextEditor = dynamic(
  () =>
    import("@/components/admin/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false }
);

interface ProjectFormProps {
  project?: (Project & { thematic_area_ids?: string[] }) | null;
  thematicAreas: ThematicArea[];
}

export function ProjectForm({ project, thematicAreas }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectFormValues>,
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      summary: project?.summary || "",
      description: project?.description || "",
      location: project?.location || "",
      project_status: project?.project_status || "planned",
      publication_status: project?.publication_status || "draft",
      start_date: project?.start_date || "",
      end_date: project?.end_date || "",
      hero_image_url: project?.hero_image_url || "",
      is_featured: project?.is_featured || false,
      sdgs: project?.sdgs?.join(", ") || "",
      seo_title: project?.seo_title || "",
      seo_description: project?.seo_description || "",
      thematic_area_ids: project?.thematic_area_ids || [],
    },
  });

  const title = watch("title");
  const projectStatus = watch("project_status");
  const publicationStatus = watch("publication_status");
  const selectedThematicIds = watch("thematic_area_ids");

  function onTitleBlur() {
    const currentSlug = watch("slug");
    if (!currentSlug && title) {
      setValue("slug", generateSlug(title));
    }
  }

  function toggleThematic(id: string) {
    const current = selectedThematicIds || [];
    if (current.includes(id)) {
      setValue(
        "thematic_area_ids",
        current.filter((t) => t !== id)
      );
    } else {
      setValue("thematic_area_ids", [...current, id]);
    }
  }

  async function onSubmit(values: ProjectFormValues) {
    const result = isEdit
      ? await updateProject(project!.id, values)
      : await createProject(values);

    if (result.success) {
      toast.success(isEdit ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to save project.");
    }
  }

  async function onDelete() {
    if (!project || !window.confirm("Are you sure you want to delete this project?")) return;
    const result = await deleteProject(project.id);
    if (result.success) {
      toast.success("Project deleted.");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete project.");
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
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" {...register("summary")} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Describe the project..."
            />
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
        </div>
        <MediaUploadField
          id="hero_image_url"
          label="Hero image"
          value={watch("hero_image_url") || ""}
          onChange={(url) => setValue("hero_image_url", url, { shouldDirty: true })}
          accept="image/*"
          folder="projects"
          help={errors.hero_image_url?.message}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Project Status</Label>
          <Select
            value={projectStatus}
            onValueChange={(v) => setValue("project_status", v as ProjectFormValues["project_status"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Publication Status</Label>
          <Select
            value={publicationStatus}
            onValueChange={(v) =>
              setValue("publication_status", v as ProjectFormValues["publication_status"])
            }
          >
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

        <div className="flex items-end gap-2 pb-2">
          <Checkbox
            id="is_featured"
            checked={watch("is_featured")}
            onCheckedChange={(v) => setValue("is_featured", Boolean(v))}
          />
          <Label htmlFor="is_featured" className="font-normal">
            Featured project
          </Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" {...register("start_date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" {...register("end_date")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sdgs">SDGs (comma-separated)</Label>
        <Input id="sdgs" {...register("sdgs")} placeholder="e.g. SDG 6, SDG 13" />
      </div>

      <div className="space-y-2">
        <Label>Thematic Areas</Label>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {thematicAreas.map((area) => (
            <div key={area.id} className="flex items-center gap-2">
              <Checkbox
                id={`thematic-${area.id}`}
                checked={selectedThematicIds?.includes(area.id)}
                onCheckedChange={() => toggleThematic(area.id)}
              />
              <Label htmlFor={`thematic-${area.id}`} className="font-normal">
                {area.name}
              </Label>
            </div>
          ))}
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
          {isSubmitting ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
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
