"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Receipt,
  MessageSquare,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/portal",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Work",
    items: [
      {
        title: "Projects",
        url: "/portal/projects",
        icon: Briefcase,
      },
      {
        title: "Deliverables",
        url: "/portal/deliverables",
        icon: FileText,
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Invoices",
        url: "/portal/invoices",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        url: "/portal/messages",
        icon: MessageSquare,
        badge: "Soon",
      },
    ],
  },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { setOpenMobile, isMobile } = useSidebar();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name?: string) => {
    if (!name) return "C";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/portal" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <div className="font-bold text-lg">N</div>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">NXT Agency</span>
                <span className="truncate text-xs">Client Portal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (pathname.startsWith(item.url) && item.url !== "/portal");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={<Link href={item.url} onClick={() => isMobile && setOpenMobile(false)} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {(item as any).badge && (
                        <SidebarMenuBadge className="bg-primary/10 text-primary">{(item as any).badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={user?.name || "Client"} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Client User"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || "client@example.com"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="" alt={user?.name || "Client"} />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name || "Client User"}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email || "client@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    render={
                      <Link href="/portal/account" className="w-full cursor-pointer flex items-center" onClick={() => isMobile && setOpenMobile(false)} />
                    }
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={
                      <Link href="/portal/settings" className="w-full cursor-pointer flex items-center" onClick={() => isMobile && setOpenMobile(false)} />
                    }
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
