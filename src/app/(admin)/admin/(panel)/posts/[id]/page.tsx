import { notFound } from "next/navigation";
import { getPost } from "@/actions/admin/posts";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "Edit Article | TPi Admin" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <AdminFormShell title={`Edit: ${post.title}`} backHref="/admin/posts">
      <PostForm post={post} />
    </AdminFormShell>
  );
}
