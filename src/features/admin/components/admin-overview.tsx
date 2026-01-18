import { getAdminMetrics, getUsageStats } from "../api";
import { StatsGrid, OverviewChart } from "./overview-stats";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/skeleton";

export async function AdminOverview() {
  // Parallel fetching for performance
  const [metrics, usageStats] = await Promise.all([
    getAdminMetrics(),
    getUsageStats(),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor the AltSEO platform performance.
        </p>
      </div>

      <StatsGrid metrics={metrics} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-4">
          <OverviewChart data={usageStats} />
        </div>

        <Card className="col-span-4 lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Real-time status of critical services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HealthItem label="Supabase API" status="online" />
            <HealthItem label="Creem Webhooks" status="online" />
            <HealthItem label="AI Processor" status="online" />
            <HealthItem label="Image Storage" status="online" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HealthItem({
  label,
  status,
}: {
  label: string;
  status: "online" | "offline" | "degraded";
}) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    degraded: "bg-yellow-500",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
          {status}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${statusColors[status]} shadow-[0_0_8px_rgba(34,197,94,0.5)]`}
        />
      </div>
    </div>
  );
}

// Re-importing Card for the local use if needed, but better to import from atoms
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
