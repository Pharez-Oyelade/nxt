"use client";

import { useGetClientProjects } from "@/hooks/useProjects";
import {
  Loader2,
  Briefcase,
  ChevronRight,
  Clock,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ProposeProjectDialog } from "@/components/portal/propose-project-dialog";

const phaseConfig: Record<string, { label: string; color: string }> = {
  proposed: {
    label: "Proposed",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  discovery: {
    label: "Discovery",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  design: {
    label: "Design",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  development: {
    label: "Development",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  review: {
    label: "Review",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  delivered: {
    label: "Delivered",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  maintenance: {
    label: "Maintenance",
    color: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400",
  },
  archived: {
    label: "Archived",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

export default function ClientProjectsPage() {
  const { data: projects, isLoading } = useGetClientProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Track the status of your ongoing and proposed projects.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <ProposeProjectDialog />
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => {
            const config = phaseConfig[project.phase] || phaseConfig.discovery;

            return (
              <div
                key={project._id}
                className="group relative flex flex-col justify-between p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold line-clamp-1 mb-2">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Updated {format(new Date(project.updatedAt), "MMM d")}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity" 
                    nativeButton={false}
                    render={
                      <Link href={`/portal/projects/${project._id}`}>
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    } 
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            You don't have any active projects with us. Submit a proposal to get
            started!
          </p>
          <ProposeProjectDialog />
        </div>
      )}
    </div>
  );
}
