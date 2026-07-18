import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "New Article | TPi Admin" };

export default function NewPostPage() {
  return (
    <AdminFormShell title="New article" backHref="/admin/posts">
      <PostForm />
    </AdminFormShell>
  );
}
