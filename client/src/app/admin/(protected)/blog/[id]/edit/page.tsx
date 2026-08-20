"use client";

import { useGetBlog } from "@/hooks/useBlogs";
import { BlogForm } from "@/components/admin/blog-form";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: blog, isLoading, error } = useGetBlog(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading blog post data...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-destructive">
        <p className="font-medium">Failed to load blog post.</p>
        <p className="text-sm opacity-80 mt-1">
          {error?.message || "Blog not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Edit Blog Post
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Update your blog post details below.
          </p>
        </div>
      </div>

      <BlogForm mode="edit" initialData={blog} />
    </div>
  );
}
