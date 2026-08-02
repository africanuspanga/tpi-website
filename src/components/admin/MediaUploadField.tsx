"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/actions/admin/media";
import { Upload, X, FileText, Loader2 } from "lucide-react";

/**
 * A URL field with an upload button attached.
 *
 * Every image/document field in the admin uses this, so an editor can either
 * pick a file from their machine (uploaded to Supabase storage and registered
 * in the media library) or paste a URL they already have. The stored value is
 * always just the URL string.
 */
export function MediaUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  folder = "",
  help,
  id,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** "image/*" for pictures, ".pdf,..." for documents. */
  accept?: string;
  folder?: string;
  help?: string;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const isImage = accept.startsWith("image");
  const fieldId = id ?? `media-${label.replace(/\W+/g, "-").toLowerCase()}`;

  function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    startTransition(async () => {
      try {
        const result = await uploadMedia(formData);
        if (result.success && result.url) {
          onChange(result.url);
          toast.success(`${file.name} uploaded.`);
        } else {
          toast.error(result.message || "Upload failed.");
        }
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  const busy = pending || uploading;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2">
          {isImage ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {/* Uploaded files live on Supabase storage; shipped defaults are
                  repo paths. next/image handles both (see next.config.ts). */}
              <Image
                src={value}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 flex-1 truncate text-sm text-urban-blue hover:underline"
          >
            {value.split("/").pop()}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            aria-label={`Remove ${label}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          id={fieldId}
          value={value}
          placeholder="Paste a URL, or upload a file →"
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {busy ? "Uploading…" : "Upload"}
          </span>
        </Button>
      </div>

      {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
    </div>
  );
}
