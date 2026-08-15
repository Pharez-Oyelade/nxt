"use client";

import React, { useEffect } from "react";
import { useGetLeads } from "@/hooks/useLeads";
import { useLeadStore } from "@/store/useLeadStore";
import { KanbanBoard } from "@/components/admin/leads/kanban-board";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LeadsPage() {
  const { data: leads, isLoading, error } = useGetLeads();
  const { setLeads } = useLeadStore();

  useEffect(() => {
    if (leads) {
      setLeads(leads);
    }
  }, [leads, setLeads]);

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Lead Pipeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop leads across columns to update their status.
          </p>
        </div>

        <Link
          href="/admin/leads/new"
          className={buttonVariants({
            className: "h-10 bg-accent hover:bg-accent/90 text-white shadow-md",
          })}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline mr-2">Add Lead</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading pipeline...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-destructive/30 bg-destructive/5 rounded-2xl">
          <p className="text-destructive font-medium">Failed to load leads.</p>
          <p className="text-sm text-destructive/70 mt-1">{error.message}</p>
        </div>
      ) : (
        <KanbanBoard />
      )}
    </div>
  );
}
