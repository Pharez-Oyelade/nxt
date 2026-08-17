import api from "@/lib/axios";

export const getInvoices = async () => {
  const response = await api.get("/invoices/admin");
  return response.data.invoices;
};

export const getInvoice = async (id: string) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data.invoice;
};

export const getClientInvoices = async () => {
  const response = await api.get("/invoices/client");
  return response.data.invoices;
};

export const createInvoice = async (data: any) => {
  const response = await api.post("/invoices", data);
  return response.data.invoice;
};

export const sendInvoice = async (id: string) => {
  const response = await api.post(`/invoices/${id}/send`);
  return response.data.invoice;
};
