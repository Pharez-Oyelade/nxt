"use client";

import React, { useState } from "react";
import { 
  useGetProjectTasks, 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask 
} from "@/hooks/useProjects";
import { useGetAdmins } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, CheckCircle2, Circle, Clock, Trash2, User } from "lucide-react";
import { format } from "date-fns";

export function ProjectTasks({ projectId }: { projectId: string }) {
  const { data: tasks, isLoading } = useGetProjectTasks(projectId);
  const { data: admins } = useGetAdmins();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    
    await createTask.mutateAsync({
      projectId,
      data: {
        ...newTask,
        assignedTo: newTask.assignedTo || undefined,
        dueDate: newTask.dueDate || undefined,
      },
    });
    
    setNewTask({ title: "", description: "", dueDate: "", assignedTo: "" });
    setIsDialogOpen(false);
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-6">
        <h3 className="text-lg font-semibold">Project Tasks</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="h-8 shadow-sm" />}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Title *</label>
                <Input
                  required
                  placeholder="e.g. Design homepage mockup"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Optional details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {admins?.map((admin: any) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createTask.isPending}>
                {createTask.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.map((task: any) => (
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
                <p className={`font-medium text-sm ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                )}
                
                <div className="flex items-center gap-4 mt-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </div>
                  )}
                  
                  {task.assignedTo && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      {task.assignedTo.name}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    deleteTask.mutate({ taskId: task._id, projectId });
                  }
                }}
                disabled={deleteTask.isPending}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                style={{ opacity: 1 }} // Force visibility for simplicity
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
            <CheckCircle2 className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add tasks to keep track of project progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
