import { getMediaAssets } from "@/actions/admin/media";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaManager } from "@/components/admin/MediaManager";

export const metadata = { title: "Media Library | TPi Admin" };

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();
  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload images and documents, then copy their URLs into content."
      />
      <MediaManager assets={assets} />
    </div>
  );
}
