import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProjectPhase, 
  updateProject, 
  uploadDeliverable,
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks
} from "../services/projects";
import { notify } from "@/lib/toast";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useGetClientProjects = () => {
  return useQuery({
    queryKey: ["clientProjects"],
    queryFn: async () => {
      const { getClientProjects } = await import("../services/projects");
      return getClientProjects();
    }
  });
};

export const useGetClientProject = (id: string) => {
  return useQuery({
    queryKey: ["clientProjects", id],
    queryFn: async () => {
      const { getClientProject } = await import("../services/projects");
      return getClientProject(id);
    },
    enabled: !!id,
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProject(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      notify.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to create project");
    },
  });
};

export const useProposeProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const { proposeProject } = await import("../services/projects");
      return proposeProject(data);
    },
    onSuccess: () => {
      notify.success("Project proposed successfully");
      queryClient.invalidateQueries({ queryKey: ["clientProjects"] });
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to propose project");
    },
  });
};

export const useUpdateProjectPhase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, phase }: { id: string; phase: string }) =>
      updateProjectPhase(id, phase),
    onSuccess: () => {
      notify.success("Project phase updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update project phase");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProject(id, data),
    onSuccess: (data, variables) => {
      notify.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update project");
    },
  });
};

export const useUploadDeliverable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadDeliverable(id, file),
    onSuccess: (data, variables) => {
      notify.success("File uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to upload file");
    },
  });
};

// Task Hooks

export const useGetAllTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
  });
};

export const useGetProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) => createTask(projectId, data),
    onSuccess: (data, variables) => {
      notify.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) => updateTask(taskId, data),
    onSuccess: (data) => {
      notify.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", data.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to update task");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, projectId }: { taskId: string; projectId: string }) => deleteTask(taskId),
    onSuccess: (_, variables) => {
      notify.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to delete task");
    },
  });
};
