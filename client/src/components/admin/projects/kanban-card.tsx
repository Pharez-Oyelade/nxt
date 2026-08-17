import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "@/services/projects";
import { Building2, GripVertical, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface KanbanCardProps {
  project: Project;
}

export function KanbanCard({ project }: KanbanCardProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project._id,
    data: {
      type: "Project",
      project,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-card border-2 border-accent border-dashed rounded-xl p-4 opacity-50 h-[120px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing hover:border-accent/40"
    >
      <div className="absolute top-4 right-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div 
        className="pr-6 cursor-pointer"
        onPointerDown={(e) => {
          // Prevent drag from starting if we are just clicking the text/content area
        }}
        onClick={() => router.push(`/admin/projects/${project._id}`)}
      >
        <h4 className="font-semibold text-primary line-clamp-1 hover:underline mb-1.5">{project.title}</h4>
        
        <div className="flex flex-col gap-1.5 mt-2.5">
          <div className="flex items-center text-xs text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span className="line-clamp-1">{project.clientId?.companyName || "Unknown Client"}</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
