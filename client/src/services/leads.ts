import api from "@/lib/axios";

// Create a new lead (public endpoint)
export const createLead = async (data: { name: string; email: string; company?: string; message: string }) => {
  const response = await api.post("/leads", data);
  return response.data.lead;
};

// Create a new lead as an admin (admin endpoint)
export const createAdminLead = async (data: { 
  name: string; 
  email: string; 
  company?: string; 
  projectType?: string; 
  budgetRange?: string;
  status: string;
  message: string;
}) => {
  const response = await api.post("/leads/admin", data);
  return response.data.lead;
};

export interface Lead {
  _id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budgetRange?: string;
  status: "new" | "contacted" | "qualified" | "lost";
  messages: string[];
  createdAt: string;
}

export const getLeads = async (): Promise<Lead[]> => {
  const response = await api.get("/leads/admin");
  return response.data.leads;
};

export const getLead = async (id: string): Promise<Lead> => {
  const response = await api.get(`/leads/${id}`);
  return response.data.lead;
};

export const updateLeadStatus = async (id: string, status: string): Promise<Lead> => {
  const response = await api.put(`/leads/admin/${id}/status`, { status });
  return response.data.lead;
};

export const updateLead = async (id: string, data: Partial<Lead> & { newMessage?: string }): Promise<Lead> => {
  const response = await api.put(`/leads/admin/${id}`, data);
  return response.data.lead;
};
