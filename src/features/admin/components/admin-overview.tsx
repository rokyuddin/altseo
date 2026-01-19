import { StatsGrid, StatsGridSkeleton } from "./overview-stats";
import { OverviewChartSkeleton } from "./overview-chart";
import { OverviewChartContainer } from "./overview-chart-container";
import { Suspense } from "react";
import { SystemHealth } from "./system-health";

export function AdminOverview() {
  return (
    <div className="slide-in-from-bottom-4 space-y-8 animate-in duration-700 fade-in">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage and monitor the AltSEO platform performance.
        </p>
      </div>

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>

      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-4">
          <Suspense fallback={<OverviewChartSkeleton />}>
            <OverviewChartContainer />
          </Suspense>
        </div>
        <div className="col-span-4 lg:col-span-3">
          <SystemHealth />
        </div>

      </div>
    </div>
  );
}

