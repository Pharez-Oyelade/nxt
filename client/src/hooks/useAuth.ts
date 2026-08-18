import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { notify } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

interface LoginCredentials {
  email: string;
  password?: string;
  [key: string]: any;
}

interface AcceptInviteData {
  token: string;
  password?: string;
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

  const acceptInviteMutation = useMutation({
    mutationFn: async (data: AcceptInviteData) => {
      const response = await api.post(`/auth/invite/${data.token}`, { password: data.password });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      queryClient.setQueryData(["auth", "me"], { user: data.user });
      notify.success(data.message || "Account setup successful");
      router.push("/portal");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to setup account");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    acceptInvite: acceptInviteMutation.mutateAsync,
    isAcceptingInvite: acceptInviteMutation.isPending,
  };
}

export function useGetAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await api.get("/auth/admins");
      return response.data.admins;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { user, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (settings: { currency: string }) => {
      const response = await api.patch("/auth/settings", settings);
      return response.data;
    },
    onSuccess: (data) => {
      if (user) {
        setAuth({ ...user, settings: data.settings });
        queryClient.setQueryData(["auth", "me"], { user: { ...user, settings: data.settings } });
      }
      notify.success(data.message || "Settings updated successfully");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to update settings");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const response = await api.patch("/auth/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user && user) {
        setAuth({ ...user, ...data.user });
        queryClient.setQueryData(["auth", "me"], { user: { ...user, ...data.user } });
      }
      notify.success(data.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to update profile");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword?: string; newPassword?: string }) => {
      const response = await api.patch("/auth/password", data);
      return response.data;
    },
    onSuccess: (data) => {
      notify.success(data.message || "Password updated successfully");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to update password");
    },
  });
}
