import { DashboardStats, DashboardStatsLoader, QuickActions, QuotaChart, RecentResults, RecentResultsLoader } from "@/features/dashboard";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";


export default function DashboardPage() {
  return (
    <div className="container-inline-size space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-primary group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">
            Overview & Analytics
          </span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tightest">
          Dashboard<span className="text-primary text-8xl leading-0">.</span>
        </h1>
      </div>
      <Suspense fallback={<DashboardStatsLoader />}>
        <DashboardStats />
      </Suspense>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-8">
          <Suspense fallback={<RecentResultsLoader />}>
            <RecentResults />
          </Suspense>
        </div>
        <div className="col-span-12 md:col-span-4 space-y-6">
          <QuotaChart />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
