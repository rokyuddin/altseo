"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  ShieldCheck,
  FileText,
  User2,
  ChevronUp,
} from "lucide-react";
import { RequirePermission } from "@/features/auth/components/require-permission";
import { Logo } from "@/components/organisms/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/atoms/sidebar";
import AdminSidebarFooter from "./admin-sidebar-footer";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      title: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
      active: pathname.startsWith("/admin/subscriptions"),
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileText,
      active: pathname.startsWith("/admin/reports"),
    },
  ];

  const adminItems = [
    {
      title: "Operators",
      href: "/admin/operators",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin/operators"),
      permission: "manage_operators" as const,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
    {
      title: "Audit Logs",
      href: "/admin/audit-logs",
      icon: FileText,
      active: pathname.startsWith("/admin/audit-logs"),
      permission: "view_audit_logs" as const,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex group-data-[collapsible=icon]:justify-center items-center px-2 h-12">
          <div className="group-data-[collapsible=icon]:hidden">
            <Logo href="/admin" />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <Logo hideText href="/admin" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const content = (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );

                if (item.permission) {
                  return (
                    <RequirePermission key={item.href} permission={item.permission}>
                      {content}
                    </RequirePermission>
                  );
                }

                return content;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <AdminSidebarFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
