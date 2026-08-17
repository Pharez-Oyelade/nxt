import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetInvoices = () => {
  return useQuery({
    queryKey: ["invoices", "admin"],
    queryFn: async () => {
      const { getInvoices } = await import("../services/invoices");
      return getInvoices();
    },
  });
};

export const useGetInvoice = (id: string) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const { getInvoice } = await import("../services/invoices");
      return getInvoice(id);
    },
    enabled: !!id,
  });
};

export const useGetClientInvoices = () => {
  return useQuery({
    queryKey: ["invoices", "client"],
    queryFn: async () => {
      const { getClientInvoices } = await import("../services/invoices");
      return getClientInvoices();
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { createInvoice } = await import("../services/invoices");
      return createInvoice(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    },
  });
};

export const useSendInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { sendInvoice } = await import("../services/invoices");
      return sendInvoice(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables] });
      toast.success("Invoice sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invoice");
    },
  });
};
