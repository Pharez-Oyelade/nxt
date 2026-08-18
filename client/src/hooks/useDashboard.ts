import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard/admin");
      return response.data;
    },
  });
};

export const useGetClientDashboard = () => {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard/client");
      return response.data;
    },
  });
};
