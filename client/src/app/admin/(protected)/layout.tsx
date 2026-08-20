"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuthGuard("admin");
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (isLoading) return <div className="p-8 text-sm">Checking session...</div>;
  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {paths.map((path, index) => {
                  const href = "/" + paths.slice(0, index + 1).join("/");
                  const isLast = index === paths.length - 1;
                  const text =
                    path.toLowerCase() === "admin"
                      ? "Dashboard"
                      : path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

                  return (
                    <React.Fragment key={href}>
                      {index > 0 && (
                        <BreadcrumbSeparator className={index === 1 ? "hidden md:block" : ""} />
                      )}
                      <BreadcrumbItem className={index === 0 && !isLast ? "hidden md:block" : ""}>
                        {isLast ? (
                          <BreadcrumbPage>{text}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Global search..."
                className="w-full bg-background pl-8 shadow-none"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
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
