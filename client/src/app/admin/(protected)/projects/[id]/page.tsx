"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetProject,
  useUpdateProject,
  useUploadDeliverable,
} from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Building2,
  UploadCloud,
  FileIcon,
  ExternalLink,
  Download,
} from "lucide-react";
import Link from "next/link";
import { EditableField } from "@/components/admin/leads/editable-field"; // Reusing this from leads
import { format } from "date-fns";
import { ProjectTasks } from "@/components/admin/projects/project-tasks";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: project, isLoading, error } = useGetProject(projectId);
  const updateMutation = useUpdateProject();
  const uploadMutation = useUploadDeliverable();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldSave = async (field: string, value: string) => {
    await updateMutation.mutateAsync({
      id: projectId,
      data: { [field]: value },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadMutation.mutateAsync({ id: projectId, file });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input
      }
    } catch (err) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-full text-muted-foreground">
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
          onClick={() => router.push("/admin/projects")}
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
          <Link
            href="/admin/projects"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Project Details
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
            <h3 className="text-lg font-semibold mb-6 border-b border-border/40 pb-3">
              Overview
            </h3>

            <div className="space-y-8">
              <EditableField
                label="Project Title"
                field="title"
                value={project.title}
                onSave={handleFieldSave}
              />

              <EditableField
                label="Description"
                field="description"
                value={project.description || ""}
                onSave={handleFieldSave}
              />
            </div>
          </div>

          {/* Deliverables Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-6">
              <h3 className="text-lg font-semibold">Deliverables & Files</h3>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.zip"
                  onChange={handleFileUpload}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 shadow-sm"
                  disabled={uploadMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UploadCloud className="w-4 h-4 mr-2" />
                  )}
                  Upload File
                </Button>
              </div>
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
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-accent transition-colors"
                        title="View File"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={file.url}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-accent transition-colors"
                        title="Download File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
                  <UploadCloud className="w-8 h-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No deliverables uploaded yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload project files, PDFs, or images here.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tasks Section */}
          <ProjectTasks projectId={projectId} />
        </div>

        {/* Right Column: Client Context */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3">
              Client Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <Link
                    href={`/admin/clients/${project.clientId._id}`}
                    className="font-semibold text-primary hover:underline block"
                  >
                    {project.clientId.companyName}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {project.clientId.primaryContactName || "No contact name"}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
