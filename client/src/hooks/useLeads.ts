import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLead, getLeads, getLead, updateLeadStatus, updateLead, createAdminLead } from "../services/leads";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

export const useCreateLead = () => {
  return useMutation({
    mutationFn: createLead,
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to send message. Please try again.");
    },
  });
};

export const useGetLeads = () => {
  return useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateLeadStatus(id, status),
    onSuccess: (_, variables) => {
      notify.success("Lead status updated");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update lead status");
    },
  });
};

export const useCreateAdminLead = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createAdminLead,
    onSuccess: () => {
      notify.success("Lead created successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      router.push("/admin/leads");
    },
    onError: (error: any) => {
      notify.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to create lead"
      );
    },
  });
};

export const useGetLead = (id: string) => {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => getLead(id),
    enabled: !!id,
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLead(id, data),
    onSuccess: (data, variables) => {
      notify.success("Lead updated successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads", variables.id] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update lead");
    },
  });
};
