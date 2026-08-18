import React, { useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { Project } from "@/services/projects";
import { useProjectStore } from "@/store/useProjectStore";
import { useUpdateProjectPhase } from "@/hooks/useProjects";

const COLUMNS = [
  { id: "proposed", title: "Proposed" },
  { id: "discovery", title: "Discovery" },
  { id: "design", title: "Design" },
  { id: "development", title: "Development" },
  { id: "review", title: "Review" },
  { id: "delivered", title: "Delivered" },
  { id: "maintenance", title: "Maintenance" },
];

export function KanbanBoard() {
  const { projects, updateProjectPhaseOptimistic } = useProjectStore();
  const updateMutation = useUpdateProjectPhase();

  const [activeProject, setActiveProject] = React.useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { project } = active.data.current as { project: Project };
    setActiveProject(project);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveProject(null);
    const { active, over } = event;

    if (!over) return;

    const projectId = active.id as string;
    const currentPhase = active.data.current?.project.phase;
    
    let newPhase = "";
    if (over.data.current?.type === "Column") {
      newPhase = over.id as Project["phase"];
    } else if (over.data.current?.type === "Project") {
      newPhase = over.data.current.project.phase as Project["phase"];
    }

    if (!newPhase || currentPhase === newPhase) return;

    // 1. Optimistic UI update
    updateProjectPhaseOptimistic(projectId, newPhase as Project["phase"]);

    // 2. Persist to backend
    try {
      await updateMutation.mutateAsync({
        id: projectId,
        phase: newPhase,
      });
    } catch (error) {
      // Error is handled in the hook, React Query will invalidate and refresh to fix local state
    }
  };

  // Group projects by phase
  const columns = useMemo(() => {
    const cols = COLUMNS.map((col) => ({
      ...col,
      projects: projects.filter((p) => p.phase === col.id),
    }));
    return cols;
  }, [projects]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[450px]">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              projects={col.projects}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeProject ? <KanbanCard project={activeProject} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
