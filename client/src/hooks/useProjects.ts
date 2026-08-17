import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProjectPhase, 
  updateProject, 
  uploadDeliverable 
} from "../services/projects";
import { notify } from "@/lib/toast";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
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
