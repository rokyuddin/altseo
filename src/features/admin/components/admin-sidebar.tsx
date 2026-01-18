"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { RequirePermission } from "@/features/auth/components/require-permission";
import { Logo } from "@/components/organisms/logo";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col px-4 py-8">
        <div className={cn("mb-10 px-2", collapsed && "flex justify-center flex-col items-center")}>
          <Logo hideText={collapsed} />
          <div className={cn(
            "mt-2 px-1 text-[10px] font-bold uppercase tracking-wider text-primary/60",
            collapsed ? "text-center text-[8px]" : "flex items-center gap-2"
          )}>
            Admin
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                collapsed && "justify-center"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  item.active
                    ? "bg-primary/10"
                    : "bg-transparent group-hover:bg-primary/10",
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Admin Tools</p>}
            <div className="mt-2 space-y-1.5">
              {adminItems.map((item) => {
                const content = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      item.active
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                      collapsed && "justify-center"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-1.5 transition-colors",
                        item.active
                          ? "bg-primary/10"
                          : "bg-transparent group-hover:bg-primary/10",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </Link>
                );

                return item.permission ? (
                  <RequirePermission key={item.href} permission={item.permission}>
                    {content}
                  </RequirePermission>
                ) : content;
              })}
            </div>
          </div>
        </nav>

        <div className="mt-auto space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 rounded-xl"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </Button>

          <div className="border-t border-border/50 pt-4">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <div className="rounded-lg bg-accent/50 p-1.5">
                <ChevronLeft className="h-4 w-4" />
              </div>
              {!collapsed && <span className="ml-3">Back to App</span>}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
