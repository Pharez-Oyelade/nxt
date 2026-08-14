"use client";

import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            New Blog Post
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Create a new blog post. Fill in the details below.
          </p>
        </div>
      </div>
      
      <BlogForm mode="create" />
    </div>
  );
}
