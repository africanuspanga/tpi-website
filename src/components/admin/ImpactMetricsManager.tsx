"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  impactMetricSchema,
  type ImpactMetricFormValues,
} from "@/lib/validation/impact";
import {
  createImpactMetric,
  updateImpactMetric,
  deleteImpactMetric,
} from "@/actions/admin/impact";
import type { ImpactMetric } from "@/types/supabase";

function MetricForm({
  metric,
  onDone,
}: {
  metric?: ImpactMetric | null;
  onDone: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(metric);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ImpactMetricFormValues>({
    resolver: zodResolver(impactMetricSchema) as Resolver<ImpactMetricFormValues>,
    defaultValues: {
      value: metric?.value || "",
      label: metric?.label || "",
      description: metric?.description || "",
      reporting_period: metric?.reporting_period || "",
      source: metric?.source || "",
      icon_name: metric?.icon_name || "",
      sort_order: metric?.sort_order ?? 0,
      is_active: metric?.is_active ?? true,
    },
  });

  async function onSubmit(values: ImpactMetricFormValues) {
    const result = isEdit
      ? await updateImpactMetric(metric!.id, values)
      : await createImpactMetric(values);
    if (result.success) {
      toast.success(isEdit ? "Metric updated." : "Metric added.");
      router.refresh();
      onDone();
    } else {
      toast.error(result.message || "Failed to save metric.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input id="value" placeholder="e.g. 12,500" {...register("value")} />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" placeholder="e.g. People reached" {...register("label")} />
          {errors.label && (
            <p className="text-sm text-destructive">{errors.label.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="reporting_period">Reporting period</Label>
          <Input
            id="reporting_period"
            placeholder="e.g. 2023–2024"
            {...register("reporting_period")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input id="source" {...register("source")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon_name">Icon name</Label>
          <Input id="icon_name" placeholder="e.g. users" {...register("icon_name")} />
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
          {isSubmitting ? "Saving..." : isEdit ? "Update metric" : "Add metric"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ImpactMetricsManager({ metrics }: { metrics: ImpactMetric[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ImpactMetric | null>(null);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(metric: ImpactMetric) {
    setEditing(metric);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this metric? This action cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteImpactMetric(id);
      if (result.success) {
        toast.success("Deleted.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete.");
      }
    });
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-navy">Impact Metrics</h2>
          <p className="text-sm text-muted-text">
            Headline numbers shown on the Impact page.
          </p>
        </div>
        <Button onClick={openNew} className="bg-navy hover:bg-navy/90">
          <Plus className="mr-2 h-4 w-4" />
          Add metric
        </Button>
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Reporting period</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-text">
                  No metrics yet. Use “Add metric” to create your first one.
                </TableCell>
              </TableRow>
            ) : (
              metrics.map((metric) => (
                <TableRow key={metric.id} className={isPending ? "opacity-60" : ""}>
                  <TableCell>
                    <span className="font-medium text-body">{metric.value}</span>
                  </TableCell>
                  <TableCell>{metric.label}</TableCell>
                  <TableCell>
                    <span className="text-muted-text">
                      {metric.reporting_period || "—"}
                    </span>
                  </TableCell>
                  <TableCell>{metric.sort_order}</TableCell>
                  <TableCell>
                    {metric.is_active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(metric)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(metric.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit metric" : "Add metric"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this impact metric."
                : "Add a new impact metric to the Impact page."}
            </DialogDescription>
          </DialogHeader>
          <MetricForm metric={editing} onDone={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
