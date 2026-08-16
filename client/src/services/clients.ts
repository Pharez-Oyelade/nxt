import api from "@/lib/axios";

export interface Client {
  _id: string;
  companyName: string;
  email: string;
  billingEmail?: string;
  industry?: string;
  primaryContactName?: string;
  projectType?: string;
  budgetRange?: string;
  notes: string[];
  status: "prospect" | "active" | "past";
  createdAt: string;
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get("/clients");
  return response.data.clients;
};

export const getClient = async (id: string): Promise<Client> => {
  const response = await api.get(`/clients/${id}`);
  return response.data.client;
};

export const createClient = async (data: {
  companyName: string;
  contactName: string;
  email: string;
  industry?: string;
  billingEmail?: string;
  notes?: string;
}) => {
  const response = await api.post("/clients", data);
  return response.data; // returns { client, user, emailSent }
};

export const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
  const response = await api.put(`/clients/${id}`, data);
  return response.data.client;
};
