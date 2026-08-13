import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { notify } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

interface LoginCredentials {
  email: string;
  password?: string;
  [key: string]: any;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      // Update the me query cache so useAuthGuard knows immediately
      queryClient.setQueryData(["auth", "me"], { user: data.user });
      notify.success("Login successful");
      
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/portal"); // Assuming client portal is here
      }
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to login");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      notify.success("Logged out successfully");
      
      const isClientPortal = window.location.pathname.startsWith("/portal");
      if (isClientPortal) {
        router.push("/portal/login");
      } else {
        router.push("/admin/login");
      }
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to logout");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
