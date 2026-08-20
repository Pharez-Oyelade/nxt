import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/services/leads";
import { Mail, Briefcase, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface KanbanCardProps {
  lead: Lead;
}

export function KanbanCard({ lead }: KanbanCardProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead._id, data: { ...lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDate = new Date(lead.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-card border ${
        isDragging ? "border-accent shadow-xl opacity-80 z-50 scale-105" : "border-border/50 shadow-sm"
      } rounded-xl p-4 transition-[box-shadow,border-color,opacity,transform] duration-200 cursor-grab active:cursor-grabbing hover:border-accent/40`}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-4 right-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div 
        className="pr-6 cursor-pointer"
        onPointerDown={(e) => {
          // Prevent drag from starting if we are just clicking the text/content area
          // but actually dnd-kit allows clicking just fine if it's not dragged.
        }}
        onClick={() => router.push(`/admin/leads/${lead._id}`)}
      >
        <h4 className="font-semibold text-primary line-clamp-1 hover:underline">{lead.name}</h4>
        
        <div className="flex flex-col gap-1.5 mt-2.5">
          <div className="flex items-center text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span className="line-clamp-1">{lead.email}</span>
          </div>
          {lead.company && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span className="line-clamp-1">{lead.company}</span>
            </div>
          )}
        </div>

        {lead.messages && lead.messages.length > 0 && (
          <div className="mt-3 p-2.5 bg-muted/40 rounded-lg text-xs text-muted-foreground italic line-clamp-2 border border-border/30">
            "{lead.messages[lead.messages.length - 1]}"
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
          <span>{formattedDate}</span>
          {lead.budgetRange && (
            <span className="bg-muted px-2 py-0.5 rounded-full text-foreground/70">
              {lead.budgetRange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
