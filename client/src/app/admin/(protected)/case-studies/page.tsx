"use client";

import { useGetCaseStudies, useDeleteCaseStudy } from "@/hooks/useCaseStudies";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";

export default function CaseStudiesPage() {
  const { data: caseStudies = [], isLoading, error } = useGetCaseStudies();
  const deleteMutation = useDeleteCaseStudy();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Case Studies
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your agency's portfolio and case studies.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className={buttonVariants({
            className: "h-10 bg-accent hover:bg-accent/90 text-white shadow-md",
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Case Study
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading case studies...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-destructive/30 bg-destructive/5 rounded-2xl">
          <p className="text-destructive font-medium">
            Failed to load case studies.
          </p>
          <p className="text-sm text-destructive/70 mt-1">{error.message}</p>
        </div>
      ) : caseStudies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border/60 rounded-2xl bg-card">
          <div className="flex aspect-square size-20 items-center justify-center rounded-full bg-accent/5 text-accent/40 mb-4">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-primary">
            No case studies yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-sm">
            Create your first case study to showcase your agency's work and
            success stories.
          </p>
          <Link
            href="/admin/case-studies/new"
            className={buttonVariants({
              className: "bg-accent hover:bg-accent/90 text-white",
            })}
          >
            Create First Case Study
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {caseStudies.map((cs) => (
            <div
              key={cs._id}
              className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300"
            >
              <div className="relative aspect-video w-full bg-muted/30 overflow-hidden">
                {cs.coverImage && cs.coverImage.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cs.coverImage[0].url}
                    alt={cs.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-sm font-medium">
                    No cover image
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-md shadow-sm
                    ${
                      cs.status === "published"
                        ? "bg-green-500/80 text-white"
                        : cs.status === "draft"
                          ? "bg-black/50 text-white"
                          : "bg-orange-500/80 text-white"
                    }`}
                  >
                    {cs.status}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="secondary"
                          size="icon"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-black shadow-sm"
                        />
                      }
                    >
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 rounded-xl"
                    >
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/admin/case-studies/${cs._id}/edit`}
                            className="cursor-pointer"
                          />
                        }
                        className="rounded-xl m-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(cs._id)}
                        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl m-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
                  {cs.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 flex-1">
                  {cs.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {new Date(cs.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Order: {cs.order}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
