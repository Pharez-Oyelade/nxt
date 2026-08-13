"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuthGuard("admin");

  if (isLoading) return <div className="p-8 text-sm">Checking session...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
