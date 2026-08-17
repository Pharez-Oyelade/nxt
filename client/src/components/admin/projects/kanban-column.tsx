import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Project } from "@/services/projects";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  id: string;
  title: string;
  projects: Project[];
}

const COLUMN_COLORS: Record<string, string> = {
  discovery: "bg-blue-500",
  design: "bg-purple-500",
  development: "bg-amber-500",
  review: "bg-indigo-500",
  delivered: "bg-emerald-500",
  maintenance: "bg-slate-500",
};

export function KanbanColumn({ id, title, projects }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: "Column",
      columnId: id,
    },
  });

  const dotColor = COLUMN_COLORS[id] || "bg-gray-500";

  return (
    <div className="flex flex-col bg-muted/20 border border-border/40 rounded-2xl h-full flex-1 min-w-[280px] overflow-hidden">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-card/50">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <h3 className="font-semibold text-primary">{title}</h3>
        </div>
        <span className="flex items-center justify-center bg-muted text-muted-foreground text-xs font-medium rounded-full w-6 h-6">
          {projects.length}
        </span>
      </div>

      {/* Column Body - Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-3 transition-colors duration-200 ${
          isOver ? "bg-accent/5 ring-1 ring-inset ring-accent/30" : ""
        }`}
      >
        {projects.map((project) => (
          <KanbanCard key={project._id} project={project} />
        ))}

        {projects.length === 0 && (
          <div className="h-full flex items-center justify-center p-4 border-2 border-dashed border-border/40 rounded-xl">
            <span className="text-sm text-muted-foreground/60 text-center">
              Drop projects here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
