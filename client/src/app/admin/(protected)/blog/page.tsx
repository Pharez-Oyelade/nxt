"use client";

import { useMemo } from "react";
import {
  useGetBlogs,
  useDeleteBlog,
  useUpdateBlogStatus,
} from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Archive } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DataViewToggle, DataViewLayout } from "@/components/ui/data-view";
import { BlogCard } from "@/components/admin/blog-card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function BlogPage() {
  const { data: blogs = [], isLoading, error } = useGetBlogs();
  const deleteMutation = useDeleteBlog();
  const statusMutation = useUpdateBlogStatus();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter =
    (searchParams.get("filter") as
      | "all"
      | "published"
      | "draft"
      | "archived") || "all";

  const setFilter = (newFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", newFilter);
    router.push(`${pathname}?${params.toString()}`);
  };

  const [viewMode, setViewMode, isMounted] = useLocalStorage<"card" | "list">(
    "nxt-view-mode",
    "card",
  );

  const hasArchived = useMemo(
    () => blogs.some((b: any) => b.status === "archived"),
    [blogs],
  );

  const filteredBlogs = useMemo(() => {
    if (filter === "all")
      return blogs.filter((b: any) => b.status !== "archived");
    return blogs.filter((b: any) => b.status === filter);
  }, [blogs, filter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await statusMutation.mutateAsync({ id, status: newStatus });
  };

  const handleArchive = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "archived" ? "draft" : "archived";
    await statusMutation.mutateAsync({ id, status: newStatus });
  };

  return (
    <div className="flex-1 space-y-8 p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Blog Posts
          </h2>
        </div>
        <Link
          href="/admin/blog/new"
          className={buttonVariants({
            className: "h-10 bg-accent hover:bg-accent/90 text-white shadow-md",
          })}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline mr-2">New Post</span>
        </Link>
      </div>

      {!isLoading && !error && blogs.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:p-2 scrollbar-hide">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={`rounded-full p-3 sm:px-5 ${filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </Button>
            <Button
              variant={filter === "published" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("published")}
              className={`rounded-full p-3 sm:px-5 ${filter === "published" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Published
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("draft")}
              className={`rounded-full p-3 sm:px-5 ${filter === "draft" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Drafts
            </Button>
            {hasArchived && (
              <Button
                variant={filter === "archived" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("archived")}
                title="Archived"
                className={`rounded-full p-3 sm:px-5 ${filter === "archived" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Archive className="w-4 h-4 sm:mr-2 shrink-0 inline sm:hidden" />
                <span className="hidden sm:inline">Archived</span>
              </Button>
            )}
          </div>

          <div className="shrink-0">
            <DataViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading blog posts...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-destructive/30 bg-destructive/5 rounded-2xl">
          <p className="text-destructive font-medium">
            Failed to load blog posts.
          </p>
          <p className="text-sm text-destructive/70 mt-1">{error.message}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border/60 rounded-2xl bg-card">
          <div className="flex aspect-square size-20 items-center justify-center rounded-full bg-accent/5 text-accent/40 mb-4">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-primary">
            No blog posts yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-sm">
            Write your first blog post to share news and insights with your
            audience.
          </p>
          <Link
            href="/admin/blog/new"
            className={buttonVariants({
              className: "bg-accent hover:bg-accent/90 text-white",
            })}
          >
            Create First Post
          </Link>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/60 rounded-2xl bg-card">
          <p className="text-muted-foreground">
            No blog posts found in this view.
          </p>
        </div>
      ) : !isMounted ? (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <DataViewLayout view={viewMode}>
          {filteredBlogs.map((blog: any) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              view={viewMode}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onToggleStatus={handleToggleStatus}
              isStatusPending={statusMutation.isPending}
            />
          ))}
        </DataViewLayout>
      )}
    </div>
  );
}
