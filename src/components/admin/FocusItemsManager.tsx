"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  addFocusItem,
  updateFocusItem,
  deleteFocusItem,
} from "@/actions/admin/thematic";
import type { ThematicFocusItem } from "@/lib/validation/thematic";

interface EditDraft {
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export function FocusItemsManager({
  areaId,
  items,
}: {
  areaId: string;
  items: ThematicFocusItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  function onAdd() {
    const title = newTitle.trim();
    if (!title) {
      toast.error("Title is required.");
      return;
    }
    startTransition(async () => {
      const result = await addFocusItem(areaId, {
        title,
        description: "",
        sort_order: items.length,
        is_active: true,
      });
      if (result.success) {
        toast.success("Focus item added.");
        setNewTitle("");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to add focus item.");
      }
    });
  }

  function startEdit(item: ThematicFocusItem) {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      description: item.description || "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function onSave(item: ThematicFocusItem) {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    startTransition(async () => {
      const result = await updateFocusItem(areaId, item.id, {
        title: draft.title.trim(),
        description: draft.description,
        sort_order: draft.sort_order,
        is_active: draft.is_active,
      });
      if (result.success) {
        toast.success("Focus item updated.");
        cancelEdit();
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update focus item.");
      }
    });
  }

  function onDelete(item: ThematicFocusItem) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteFocusItem(areaId, item.id);
      if (result.success) {
        toast.success("Focus item deleted.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete focus item.");
      }
    });
  }

  return (
    <div className={isPending ? "opacity-60" : ""}>
      <h2 className="text-lg font-semibold text-navy">Focus items</h2>
      <p className="mb-4 text-sm text-muted-text">
        Shown under this thematic area on the What We Do pages.
      </p>

      {items.length === 0 ? (
        <p className="mb-4 text-sm text-muted-text">No focus items yet.</p>
      ) : (
        <ul className="mb-4 divide-y rounded-lg border">
          {items.map((item) =>
            editingId === item.id && draft ? (
              <li key={item.id} className="space-y-3 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-title-${item.id}`}>Title</Label>
                    <Input
                      id={`edit-title-${item.id}`}
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-order-${item.id}`}>Sort order</Label>
                    <Input
                      id={`edit-order-${item.id}`}
                      type="number"
                      value={draft.sort_order}
                      onChange={(e) =>
                        setDraft({ ...draft, sort_order: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-desc-${item.id}`}>Description</Label>
                  <Textarea
                    id={`edit-desc-${item.id}`}
                    rows={2}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`edit-active-${item.id}`}
                    checked={draft.is_active}
                    onCheckedChange={(v) => setDraft({ ...draft, is_active: Boolean(v) })}
                  />
                  <Label htmlFor={`edit-active-${item.id}`} className="font-normal">
                    Active
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-navy hover:bg-navy/90"
                    disabled={isPending}
                    onClick={() => onSave(item)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Save
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </li>
            ) : (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-body">{item.title}</p>
                  {item.description && (
                    <p className="truncate text-sm text-muted-text">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-muted-text">#{item.sort_order}</span>
                {item.is_active ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    Inactive
                  </Badge>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            )
          )}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          placeholder="New focus item title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <Button
          type="button"
          className="shrink-0 bg-navy hover:bg-navy/90"
          disabled={isPending}
          onClick={onAdd}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
