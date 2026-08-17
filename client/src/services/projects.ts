import api from "@/lib/axios";

export interface ProjectFile {
  _id: string;
  url: string;
  public_id: string;
  name: string;
  uploadedAt: string;
}

export interface Project {
  _id: string;
  clientId: {
    _id: string;
    companyName: string;
    primaryContactName?: string;
  };
  title: string;
  description?: string;
  phase: "discovery" | "design" | "development" | "review" | "delivered" | "maintenance" | "archived";
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "pending" | "in progress" | "completed";
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data.projects;
};

export const getProject = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.project;
};

export const getClientProjects = async () => {
  const response = await api.get("/projects/client");
  return response.data.projects;
};

export const proposeProject = async (data: { title: string; description: string }) => {
  const response = await api.post("/projects/propose", data);
  return response.data.project;
};

export const createProject = async (data: { clientId: string; title: string }): Promise<Project> => {
  const response = await api.post("/projects", data);
  return response.data.project;
};

export const updateProjectPhase = async (id: string, phase: string): Promise<Project> => {
  const response = await api.put(`/projects/${id}/phase`, { phase });
  return response.data.project;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data.project;
};

export const uploadDeliverable = async (id: string, file: File): Promise<Project> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post(`/projects/${id}/files`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.project;
};

// Task APIs
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data.tasks;
};

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data.tasks;
};

export const createTask = async (
  projectId: string,
  data: { title: string; description?: string; dueDate?: string; assignedTo?: string; status?: string }
): Promise<Task> => {
  const response = await api.post(`/projects/${projectId}/tasks`, data);
  return response.data.task;
};

export const updateTask = async (
  taskId: string,
  data: Partial<{ title: string; description: string; dueDate: string; assignedTo: string; status: string }>
): Promise<Task> => {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data.task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
