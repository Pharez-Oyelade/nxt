"use client";

import React, { useEffect, useState } from "react";
import { useGetProjects, useCreateProject } from "@/hooks/useProjects";
import { useGetClients } from "@/hooks/useClients";
import { useProjectStore } from "@/store/useProjectStore";
import { KanbanBoard } from "@/components/admin/projects/kanban-board";
import { Loader2, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useGetProjects();
  const { setProjects } = useProjectStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (projects) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Projects Pipeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage projects through their lifecycle phases.
          </p>
        </div>

        <CreateProjectDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-destructive font-medium mb-4">Failed to load projects.</p>
        </div>
      ) : (
        <KanbanBoard />
      )}
    </div>
  );
}

function CreateProjectDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { data: clients, isLoading: clientsLoading } = useGetClients();
  const createMutation = useCreateProject();
  
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !title) return;
    
    await createMutation.mutateAsync({ clientId, title });
    setClientId("");
    setTitle("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button className="h-10 bg-accent hover:bg-accent/90 text-white shadow-md rounded-xl px-4" />}>
        <Plus className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Create Project</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Manually create a new project for an existing client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Client</label>
            {clientsLoading ? (
              <div className="h-10 flex items-center px-3 border border-input rounded-md bg-muted/50 text-sm text-muted-foreground">Loading clients...</div>
            ) : (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>-- Choose a client --</option>
                {clients?.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Website Redesign" 
              required
              className="h-10"
            />
          </div>
          <div className="pt-2 flex justify-end">
            <Button 
              type="submit" 
              disabled={createMutation.isPending || !clientId || !title}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
