"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/portal/client-sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalSearch } from "@/components/admin/global-search";

export default function ProtectedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuthGuard("client");

  if (isLoading) return <div className="p-8 text-sm">Checking session...</div>;
  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="font-semibold tracking-tight text-lg">
              Client Portal
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
