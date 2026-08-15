import api from "@/lib/axios";

// Create a new lead (public endpoint)
export const createLead = async (data: { name: string; email: string; company?: string; message: string }) => {
  const response = await api.post("/leads", data);
  return response.data.lead;
};
