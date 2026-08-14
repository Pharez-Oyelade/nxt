"use client";

import { useState, useEffect, useMemo } from "react";

import {
  useGetCaseStudies,
  useDeleteCaseStudy,
  useUpdateCaseStudyStatus,
} from "@/hooks/useCaseStudies";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DataViewToggle, DataViewLayout } from "@/components/ui/data-view";
import { CaseStudyCard } from "@/components/admin/case-study-card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function CaseStudiesPage() {
  const { data: caseStudies = [], isLoading, error } = useGetCaseStudies();
  const deleteMutation = useDeleteCaseStudy();
  const statusMutation = useUpdateCaseStudyStatus();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = (searchParams.get("filter") as "all" | "published" | "draft" | "archived") || "all";
  
  const setFilter = (newFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", newFilter);
    router.push(`${pathname}?${params.toString()}`);
  };

  const [viewMode, setViewMode, isMounted] = useLocalStorage<"card" | "list">("nxt-view-mode", "card");

  const hasArchived = useMemo(
    () => caseStudies.some((cs) => cs.status === "archived"),
    [caseStudies],
  );

  // Fallback to "all" if viewing archived but there are no archived items anymore
  useEffect(() => {
    if (filter === "archived" && !hasArchived && caseStudies.length > 0) {
      setFilter("all");
    }
  }, [hasArchived, filter, caseStudies.length]);

  const filteredCaseStudies = useMemo(() => {
    if (filter === "all")
      return caseStudies.filter((cs) => cs.status !== "archived");
    return caseStudies.filter((cs) => cs.status === filter);
  }, [caseStudies, filter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
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
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Case Studies
          </h2>
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

      {!isLoading && !error && caseStudies.length > 0 && (
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={`rounded-full p-3 pt-4 ${filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Active
            </Button>
            <Button
              variant={filter === "published" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("published")}
              className={`rounded-full p-3 pt-4 ${filter === "published" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Published
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("draft")}
              className={`rounded-full p-3 pt-4 ${filter === "draft" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Drafts
            </Button>
            {hasArchived && (
              <Button
                variant={filter === "archived" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("archived")}
                className={`rounded-full px-5 ${filter === "archived" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Archived
              </Button>
            )}
          </div>

          <DataViewToggle view={viewMode} onViewChange={setViewMode} />
        </div>
      )}

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
      ) : filteredCaseStudies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/60 rounded-2xl bg-card">
          <p className="text-muted-foreground">
            No case studies found in this view.
          </p>
        </div>
      ) : !isMounted ? (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <DataViewLayout view={viewMode}>
          {filteredCaseStudies.map((cs) => (
            <CaseStudyCard
              key={cs._id}
              cs={cs}
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
