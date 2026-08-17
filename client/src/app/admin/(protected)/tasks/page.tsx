"use client";

import React, { useState } from "react";
import { useGetAllTasks, useUpdateTask } from "@/hooks/useProjects";
import { Loader2, CheckCircle2, Circle, Clock, User, Briefcase, LayoutList, Layers } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function TasksPage() {
  const { data: tasks, isLoading } = useGetAllTasks();
  const updateTask = useUpdateTask();
  const [viewMode, setViewMode] = useState<"list" | "grouped">("list");

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    await updateTask.mutateAsync({
      taskId,
      data: { status: newStatus },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-emerald-500 bg-emerald-500/10";
      case "in progress": return "text-blue-500 bg-blue-500/10";
      default: return "text-amber-500 bg-amber-500/10";
    }
  };

  const groupedTasks = React.useMemo(() => {
    if (!tasks) return {};
    const groups: Record<string, { project: any; tasks: any[] }> = {};
    
    tasks.forEach((task: any) => {
      const projectId = task.projectId ? task.projectId._id : "unassigned";
      
      if (!groups[projectId]) {
        groups[projectId] = {
          project: task.projectId || { title: "Unassigned Tasks", _id: "unassigned" },
          tasks: [],
        };
      }
      groups[projectId].tasks.push(task);
    });
    
    return groups;
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-full text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const renderTask = (task: any) => (
    <div
      key={task._id}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
        task.status === "completed" 
          ? "bg-muted/10 border-border/30 opacity-70" 
          : "bg-muted/30 border-border/50 hover:border-accent/40"
      }`}
    >
      <button
        onClick={() => toggleTaskStatus(task._id, task.status)}
        disabled={updateTask.isPending}
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-accent transition-colors disabled:opacity-50"
      >
        {task.status === "completed" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`font-medium text-base ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          
          {task.projectId && viewMode === "list" && (
            <Link 
              href={`/admin/projects/${task.projectId._id}`}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium bg-primary/5 px-2 py-1 rounded-md"
            >
              <Briefcase className="w-3.5 h-3.5" />
              {task.projectId.title}
            </Link>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              Due {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <User className="w-3.5 h-3.5" />
              {task.assignedTo.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto space-y-6 w-full pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            All Tasks
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage tasks across all projects
          </p>
        </div>
        
        <div className="flex bg-muted/50 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            List
          </button>
          <button
            onClick={() => setViewMode("grouped")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "grouped" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Grouped
          </button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        {tasks && tasks.length > 0 ? (
          viewMode === "list" ? (
            <div className="space-y-3">
              {tasks.map((task: any) => renderTask(task))}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(groupedTasks).map((group) => (
                <div key={group.project._id} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {group.project._id !== "unassigned" ? (
                        <Link href={`/admin/projects/${group.project._id}`} className="hover:underline">
                          {group.project.title}
                        </Link>
                      ) : (
                        group.project.title
                      )}
                    </h3>
                    <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium ml-2">
                      {group.tasks.length}
                    </span>
                  </div>
                  <div className="space-y-3 pl-1">
                    {group.tasks.map((task: any) => renderTask(task))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
            <CheckCircle2 className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No tasks found</p>
            <p className="text-xs text-muted-foreground mt-1">
              You don't have any tasks assigned across your projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
