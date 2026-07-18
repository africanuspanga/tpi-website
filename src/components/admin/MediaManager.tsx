"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Trash2, Copy, Check, FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia, deleteMediaAsset } from "@/actions/admin/media";
import type { MediaAsset } from "@/types/supabase";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function MediaManager({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, startUpload] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleUpload(formData: FormData) {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      toast.error("Choose a file to upload.");
      return;
    }
    startUpload(async () => {
      const result = await uploadMedia(formData);
      if (result.success) {
        toast.success("File uploaded.");
        formRef.current?.reset();
        router.refresh();
      } else {
        toast.error(result.message || "Upload failed.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this file?")) return;
    startDelete(async () => {
      const result = await deleteMediaAsset(id);
      if (result.success) {
        toast.success("File deleted.");
        router.refresh();
      } else {
        toast.error(result.message || "Delete failed.");
      }
    });
  }

  async function copyUrl(asset: MediaAsset) {
    try {
      await navigator.clipboard.writeText(asset.file_url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Could not copy URL.");
    }
  }

  return (
    <div className="space-y-8">
      <form
        ref={formRef}
        action={handleUpload}
        className="rounded-lg border bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="file">File (image or PDF, max 20MB)</Label>
            <Input id="file" name="file" type="file" accept="image/*,application/pdf" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder">Folder (optional)</Label>
            <Input id="folder" name="folder" placeholder="e.g. projects" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt_text">Alt text (optional)</Label>
            <Input id="alt_text" name="alt_text" placeholder="Describe the image" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isUploading}
          className="mt-4 bg-navy hover:bg-navy/90"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </form>

      {assets.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-text">
          No media uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => {
            const isImage = asset.mime_type?.startsWith("image/");
            return (
              <div
                key={asset.id}
                className={`overflow-hidden rounded-lg border bg-white ${
                  isDeleting ? "opacity-70" : ""
                }`}
              >
                <div className="relative flex aspect-video items-center justify-center bg-soft-bg">
                  {isImage ? (
                    <Image
                      src={asset.file_url}
                      alt={asset.alt_text || asset.file_name}
                      fill
                      sizes="200px"
                      className="object-contain"
                    />
                  ) : (
                    <FileText className="h-10 w-10 text-navy/30" />
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-medium text-body" title={asset.file_name}>
                    {asset.file_name}
                  </p>
                  <p className="text-xs text-muted-text">
                    {formatSize(asset.file_size)}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 flex-1 px-2 text-xs"
                      onClick={() => copyUrl(asset)}
                    >
                      {copiedId === asset.id ? (
                        <Check className="h-3 w-3 text-poverty-green" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copiedId === asset.id ? "Copied" : "Copy URL"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(asset.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
