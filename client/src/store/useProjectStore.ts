import { create } from "zustand";
import { Project } from "@/services/projects";

type ProjectPhase = Project["phase"];

interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  updateProjectPhaseOptimistic: (projectId: string, newPhase: ProjectPhase) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  updateProjectPhaseOptimistic: (projectId, newPhase) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project._id === projectId ? { ...project, phase: newPhase } : project
      ),
    })),
}));
