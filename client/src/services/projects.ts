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

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data.projects;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
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
