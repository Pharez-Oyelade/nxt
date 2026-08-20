"use client";

import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { LOGIN_PATHS } from "@/lib/auth-paths";
import { useAuthStore } from "@/store/authStore";

export function useAuthGuard(requiredRole: "admin" | "client") {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, isAuthenticated: isLocallyAuthenticated } = useAuthStore();
  const loginPath = LOGIN_PATHS[requiredRole] ?? "/admin/login";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.get("/auth/me").then((res) => res.data),
    retry: false,
    staleTime: 0,
    gcTime: 0, // Don't cache at all — always hit the server
  });

  // Handle browser back-forward cache (bfcache)
  // When user presses Back after logout, the browser may restore the page
  // from memory without re-running React lifecycle. This catches that case.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache — force re-check with server
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        refetch();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [queryClient, refetch]);

  // Redirect to login if auth check fails
  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      // Hard replace — removes this page from browser history
      window.location.replace(loginPath);
      return;
    }

    if (requiredRole && data.user.role !== requiredRole) {
      window.location.replace(loginPath);
      return;
    }

    // Sync auth store
    setAuth(data.user);
  }, [isLoading, isError, data, requiredRole, setAuth, loginPath]);

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
