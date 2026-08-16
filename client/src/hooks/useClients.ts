import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients, getClient, createClient, updateClient } from "../services/clients";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

export const useGetClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};

export const useGetClient = (id: string) => {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      notify.success("Client created successfully");
      if (data.emailSent) {
        notify.success("Invite email sent to client");
      }
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      router.push("/admin/clients");
    },
    onError: (error: any) => {
      notify.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to create client"
      );
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateClient(id, data),
    onSuccess: (data, variables) => {
      notify.success("Client updated successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update client");
    },
  });
};
