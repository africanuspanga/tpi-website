"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { saveContentBlock, resetContentBlock } from "@/actions/admin/content";
import {
  isListField,
  type ContentBlock,
  type Field,
  type ListField,
} from "@/lib/content/schema";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  GripVertical,
} from "lucide-react";

type Values = Record<string, unknown>;

/**
 * Renders an editable form for one content block straight from its schema.
 *
 * Because the fields are declared in `src/lib/content/schema.ts`, adding a new
 * editable section to the website needs no changes here — the form, the list
 * add/remove/reorder controls and the save action all follow the declaration.
 */
export function ContentBlockEditor({
  pageKey,
  block,
  initialValues,
  isCustomised,
}: {
  pageKey: string;
  block: ContentBlock;
  initialValues: Values;
  isCustomised: boolean;
}) {
  const [values, setValues] = useState<Values>(initialValues);
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function setField(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
    setDirty(true);
  }

  function save() {
    startTransition(async () => {
      const result = await saveContentBlock(pageKey, block.key, values);
      if (result.success) {
        toast.success(result.message);
        setDirty(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  function reset() {
    startTransition(async () => {
      const result = await resetContentBlock(pageKey, block.key);
      if (result.success) {
        toast.success(result.message);
        setValues(block.defaults);
        setDirty(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className={dirty ? "border-gold" : undefined}>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              {block.label}
              {dirty ? (
                <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase text-navy">
                  Unsaved
                </span>
              ) : isCustomised ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  Edited
                </span>
              ) : null}
            </CardTitle>
            {block.description ? (
              <CardDescription>{block.description}</CardDescription>
            ) : null}
          </div>
          {open ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {open ? (
        <CardContent className="space-y-5 border-t pt-5">
          {block.fields.map((field) =>
            isListField(field) ? (
              <ListEditor
                key={field.name}
                field={field}
                items={(values[field.name] as Values[]) ?? []}
                onChange={(items) => setField(field.name, items)}
              />
            ) : (
              <SimpleInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(value) => setField(field.name, value)}
              />
            )
          )}

          <div className="flex flex-wrap items-center gap-3 border-t pt-4">
            <Button type="button" onClick={save} disabled={pending || !dirty}>
              <Save className="mr-2 h-4 w-4" />
              {pending ? "Saving…" : "Save changes"}
            </Button>
            {isCustomised ? (
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                disabled={pending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to original
              </Button>
            ) : null}
            {dirty ? (
              <span className="text-xs text-muted-foreground">
                You have unsaved changes in this section.
              </span>
            ) : null}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

function SimpleInput({
  field,
  value,
  onChange,
}: {
  field: Exclude<Field, ListField>;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.name}`;
  const text = typeof value === "string" ? value : value == null ? "" : String(value);

  if (field.type === "image" || field.type === "file") {
    return (
      <MediaUploadField
        id={id}
        label={field.label}
        value={text}
        onChange={onChange}
        accept={
          field.type === "image"
            ? "image/*"
            : ".pdf,.doc,.docx,.xls,.xlsx,application/pdf"
        }
        help={field.help}
      />
    );
  }

  if (field.type === "richtext") {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{field.label}</Label>
        <RichTextEditor value={text} onChange={onChange} />
        {field.help ? (
          <p className="text-xs text-muted-foreground">{field.help}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          {field.help ? (
            <p className="text-xs text-muted-foreground">{field.help}</p>
          ) : null}
        </div>
        <Switch
          id={id}
          checked={value === true || value === "true"}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          rows={3}
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.help ? (
          <p className="text-xs text-muted-foreground">{field.help}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        type={field.type === "number" ? "number" : "text"}
        value={text}
        onChange={(event) =>
          onChange(
            field.type === "number"
              ? event.target.value === ""
                ? null
                : Number(event.target.value)
              : event.target.value
          )
        }
      />
      {field.help ? (
        <p className="text-xs text-muted-foreground">{field.help}</p>
      ) : null}
    </div>
  );
}

function ListEditor({
  field,
  items,
  onChange,
}: {
  field: ListField;
  items: Values[];
  onChange: (items: Values[]) => void;
}) {
  function update(index: number, name: string, value: unknown) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  }

  function add() {
    const blank: Values = {};
    for (const sub of field.fields) {
      blank[sub.name] = sub.type === "boolean" ? false : sub.type === "number" ? null : "";
    }
    onChange([...items, blank]);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? field.itemNoun : `${field.itemNoun}s`}
        </span>
      </div>
      {field.help ? (
        <p className="text-xs text-muted-foreground">{field.help}</p>
      ) : null}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {String(item[field.titleField] || `Untitled ${field.itemNoun}`)}
                </span>
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${field.itemNoun}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {field.fields.map((sub) => (
                <SimpleInput
                  key={sub.name}
                  field={sub}
                  value={item[sub.name]}
                  onChange={(value) => update(index, sub.name, value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-2 h-4 w-4" />
        Add {field.itemNoun}
      </Button>
    </div>
  );
}
