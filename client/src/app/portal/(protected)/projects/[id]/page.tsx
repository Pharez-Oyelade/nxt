"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetClientProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  FileIcon,
  ExternalLink,
  Download,
  MessageSquare,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ClientProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: project, isLoading, error } = useGetClientProject(projectId);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-[50vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive font-medium mb-4">
          Failed to load project details.
        </p>
        <Button
          onClick={() => router.push("/portal/projects")}
          variant="outline"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-5xl mx-auto space-y-6 w-full pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:bg-muted"
            nativeButton={false}
            render={<Link href="/portal/projects" />}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              {project.title}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-accent/10 text-accent border border-accent/20">
              {project.phase}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3">
              Overview
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Deliverables Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-6">
              <h3 className="text-lg font-semibold">Deliverables & Files</h3>
            </div>

            <div className="space-y-3">
              {project.files && project.files.length > 0 ? (
                project.files.map((file: any) => (
                  <div
                    key={file._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/30 group hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border/50">
                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.uploadedAt
                            ? format(
                                new Date(file.uploadedAt),
                                "MMM d, yyyy h:mm a",
                              )
                            : "Recently"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-accent transition-colors"
                        title="View File"
                        nativeButton={false}
                        render={
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-accent transition-colors"
                        title="Download File"
                        nativeButton={false}
                        render={
                          <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
                  <UploadCloud className="w-8 h-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No deliverables available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Files uploaded by the admin team will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Project Notes/Comments Placeholder */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-6">
              <h3 className="text-lg font-semibold">Project Notes</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Coming Soon</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
              <MessageSquare className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                Discussions & Comments
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Soon you will be able to leave notes, feedback, and communicate directly with the team about this project.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Context */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3">
              Project Timeline
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Created
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(project.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Last Updated
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(project.updatedAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
