"use client";

import { useGetClientProjects } from "@/hooks/useProjects";
import { Loader2, File, Download, ExternalLink, FileText, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function DeliverablesPage() {
  const { data: projects, isLoading } = useGetClientProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Filter projects to only those that have files
  const projectsWithFiles = projects?.filter((project: any) => project.files && project.files.length > 0) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Deliverables</h2>
        <p className="text-muted-foreground mt-1">
          Access and download your finalized project files.
        </p>
      </div>

      {projectsWithFiles.length > 0 ? (
        <div className="space-y-12">
          {projectsWithFiles.map((project: any) => (
            <div key={project._id} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <span className="text-sm text-muted-foreground ml-2">
                  ({project.files.length} {project.files.length === 1 ? 'file' : 'files'})
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {project.files.map((file: any) => {
                  const isImage = file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                  
                  return (
                    <div key={file._id || file.public_id} className="group relative flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      {/* Cover Preview Area */}
                      <div className="aspect-video bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/40 relative">
                        {isImage ? (
                          <img 
                            src={file.url} 
                            alt={file.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            {file.name.endsWith('.pdf') ? (
                              <FileText className="w-12 h-12 mb-2 opacity-50" />
                            ) : (
                              <File className="w-12 h-12 mb-2 opacity-50" />
                            )}
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                          <Button size="icon" variant="secondary" className="rounded-full w-10 h-10 shadow-lg" nativeButton={false} render={<a href={file.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a>} />
                          <Button size="icon" className="rounded-full w-10 h-10 shadow-lg" nativeButton={false} render={<a href={file.url} download={file.name}><Download className="w-4 h-4" /></a>} />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <p className="font-medium text-sm line-clamp-1 break-all" title={file.name}>
                            {file.name}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{format(new Date(file.uploadedAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
          <File className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No deliverables yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            When your project reaches milestones or completion, your deliverables will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
