import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { Lead } from "@/services/leads";
import { ColumnId } from "@/store/useLeadStore";

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  leads: Lead[];
  color: string;
}

export function KanbanColumn({ id, title, leads, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: "Column",
    },
  });

  return (
    <div className="flex flex-col bg-muted/20 border border-border/40 rounded-2xl flex-1 min-w-[260px] max-w-[400px] h-full overflow-hidden">
      {/* Column Header */}
      <div className="p-4 border-b border-border/40 bg-card/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="font-semibold text-primary">{title}</h3>
        </div>
        <div className="bg-muted/60 text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {leads.length}
        </div>
      </div>

      {/* Column Body - Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-3 transition-colors duration-200 ${
          isOver ? "bg-accent/5 ring-1 ring-inset ring-accent/30" : ""
        }`}
      >
        <SortableContext
          items={leads.map((l) => l._id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <KanbanCard key={lead._id} lead={lead} />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className="h-full flex items-center justify-center p-4 border-2 border-dashed border-border/50 rounded-xl bg-card/30">
            <span className="text-sm font-medium text-muted-foreground/60 text-center">
              Drop leads here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
