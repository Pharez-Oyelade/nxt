"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { useLeadStore, ColumnId } from "@/store/useLeadStore";
import { useUpdateLeadStatus } from "@/hooks/useLeads";

const COLUMNS: { id: ColumnId; title: string; color: string }[] = [
  { id: "new", title: "New Leads", color: "bg-blue-500" },
  { id: "contacted", title: "Contacted", color: "bg-purple-500" },
  { id: "qualified", title: "Qualified", color: "bg-orange-500" },
  { id: "lost", title: "Lost", color: "bg-slate-500" },
];

export function KanbanBoard() {
  const { leads, updateLeadStatusOptimistic } = useLeadStore();
  const updateStatusMutation = useUpdateLeadStatus();
  
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Find the lead being dragged
    const activeLead = leads.find((l) => l._id === activeId);
    if (!activeLead) return;

    // Check if dragging over a column directly or another card
    const isOverAColumn = COLUMNS.some((col) => col.id === overId);
    
    let newStatus = activeLead.status;
    
    if (isOverAColumn) {
      newStatus = overId as ColumnId;
    } else {
      // Find the card we are dragging over to inherit its column
      const overLead = leads.find((l) => l._id === overId);
      if (overLead) {
        newStatus = overLead.status;
      }
    }

    if (activeLead.status !== newStatus) {
      updateLeadStatusOptimistic(activeId, newStatus);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const activeLead = leads.find((l) => l._id === activeId);
    
    if (activeLead && activeLead.status) {
      // Background sync to server with the final status
      updateStatusMutation.mutate({ id: activeId, status: activeLead.status });
    }
  };

  const activeLead = leads.find((l) => l._id === activeId);

  return (
    <div className="w-full h-[calc(100vh-180px)] min-h-[600px] overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full items-start gap-4 px-1 w-full min-w-max lg:min-w-0">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              leads={leads.filter((l) => l.status === col.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && activeLead ? (
            <div className="rotate-3 opacity-90 scale-105 shadow-2xl cursor-grabbing">
              <KanbanCard lead={activeLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
