"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { LOGIN_PATHS } from "@/lib/auth-paths";

export function useAuthGuard(requiredRole: "admin" | "client") {
  const router = useRouter();
  const loginPath = LOGIN_PATHS[requiredRole] ?? "/admin/login";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.get("/auth/me").then((res) => res.data),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.replace(loginPath);
      return;
    }

    if (requiredRole && data.user.role !== requiredRole) {
      router.replace(loginPath);
    }
  }, [isLoading, isError, data, requiredRole, router]);

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated:
      !isLoading &&
      !isError &&
      !!data?.user &&
      (!requiredRole || data.user.role === requiredRole),
  };
}
